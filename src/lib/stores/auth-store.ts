import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Session } from '@supabase/supabase-js';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { deleteAvatarPhoto } from '@/lib/avatar-photo';
import { supabase } from '@/lib/supabase';

export type ChildProfile = {
  id: string;
  /** Imię widoczne tylko w tej aplikacji, na koncie rodzica. */
  nick: string;
  avatar: string;
  /** Ziarno pseudonimu publicznego w rankingu — nie tekst, tylko liczba. */
  nick_variant: number;
};

/**
 * `link` — dopięcie e-maila / Apple / Google do bieżącego, anonimowego konta
 * (ten sam uid, postępy zostają). `login` — wejście na istniejące konto;
 * anonimowe postępy z tego urządzenia zostają porzucone.
 */
export type AuthMode = 'link' | 'login';

type AuthState = {
  /**
   * Sesja. Jak w Finchu gra startuje bez zakładania konta: przy pierwszym
   * uruchomieniu powstaje anonimowe konto Supabase (prawdziwy `auth.uid()`,
   * więc RLS i zapis postępów działają bez zmian). `null` tylko wtedy, gdy
   * anonimowej sesji nie udało się założyć (brak sieci, wyłączone w panelu) —
   * wtedy zostaje stary ekran logowania.
   */
  session: Session | null;
  /** Trwa pierwsze sprawdzenie sesji — do czasu końca nie przekierowujemy. */
  initializing: boolean;

  profiles: ChildProfile[];
  /** Lista profili wczytana z bazy dla bieżącej sesji. */
  profilesLoaded: boolean;
  activeProfileId: string | null;

  busy: boolean;
  error: string | null;

  init: () => () => void;

  /**
   * Jedno wejście dla e-maila: logowanie, a gdy konta jeszcze nie ma —
   * założenie go. Rodzic nie musi wybierać między „zaloguj" a „zarejestruj".
   */
  signInWithEmail: (email: string, password: string, mode?: AuthMode) => Promise<void>;
  signInWithGoogle: (mode?: AuthMode) => Promise<void>;
  signInWithApple: (mode?: AuthMode) => Promise<void>;
  /** Konto bez e-maila ani Apple/Google — postępy żyją tylko na tym urządzeniu. */
  isAnonymous: () => boolean;
  /** Zakłada anonimową sesję, jeśli żadnej nie ma. */
  ensureSession: () => Promise<void>;
  signOut: () => Promise<void>;
  /**
   * Usuwa konto razem z profilami dzieci i całym postępem (serwer + telefon)
   * i zaczyna grę od zera na nowym anonimowym koncie. Zwraca, czy się udało.
   */
  deleteAccount: () => Promise<boolean>;

  /** Konto założone, ale Supabase czeka na potwierdzenie adresu. */
  awaitingConfirmation: string | null;
  clearAwaitingConfirmation: () => void;

  loadProfiles: () => Promise<void>;
  /** Id nowego profilu albo `null`, gdy się nie udało. */
  createProfile: (nick: string, avatar: string) => Promise<string | null>;
  deleteProfile: (id: string) => Promise<void>;
  selectProfile: (id: string | null) => void;

  /** Aktywny profil — wygodny skrót dla ekranów. */
  activeProfile: () => ChildProfile | null;
  /** Losuje nowy pseudonim publiczny (zmienia ziarno w bazie). */
  rerollPublicName: () => Promise<void>;

  clearError: () => void;
};

/** Komunikaty Supabase są po angielsku — tłumaczymy te, które zobaczy rodzic. */
function friendlyError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('invalid login credentials')) {
    return 'Nieprawidłowy e-mail lub hasło.';
  }
  if (lower.includes('user already registered')) {
    return 'Konto z tym adresem już istnieje — zaloguj się.';
  }
  if (lower.includes('password should be at least')) {
    return 'Hasło musi mieć co najmniej 6 znaków.';
  }
  if (lower.includes('unable to validate email') || lower.includes('invalid email')) {
    return 'To nie wygląda na poprawny adres e-mail.';
  }
  if (lower.includes('email not confirmed')) {
    return 'Potwierdź adres e-mail linkiem, który wysłaliśmy.';
  }
  if (lower.includes('network') || lower.includes('fetch')) {
    return 'Brak połączenia z serwerem.';
  }
  if (
    lower.includes('already been registered') ||
    lower.includes('email address already') ||
    lower.includes('identity is already linked') ||
    lower.includes('already linked to another user')
  ) {
    return 'To konto już istnieje — wybierz „Mam już konto” i zaloguj się.';
  }
  if (lower.includes('anonymous sign-ins are disabled')) {
    return 'Gra bez konta jest chwilowo niedostępna — zaloguj się.';
  }
  if (lower.includes('limit 6 profili')) {
    return 'Na koncie może być najwyżej 6 profili.';
  }
  return message;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      session: null,
      initializing: true,
      profiles: [],
      profilesLoaded: false,
      activeProfileId: null,
      busy: false,
      error: null,

      init: () => {
        void supabase.auth.getSession().then(async ({ data }) => {
          if (data.session) {
            set({ session: data.session, initializing: false });
            void get().loadProfiles();
            return;
          }
          await get().ensureSession();
          set({ initializing: false });
        });

        const { data: subscription } = supabase.auth.onAuthStateChange(
          (_event, session) => {
            const prevUser = get().session?.user.id;
            set({ session, initializing: false });

            // Nowy użytkownik — także przejście z anonimowego na istniejące
            // konto („Mam już konto”): profile są inne, aktywny trzeba wyzerować.
            if (session && session.user.id !== prevUser) {
              if (prevUser) set({ profiles: [], profilesLoaded: false, activeProfileId: null });
              void get().loadProfiles();
            }
            if (!session) {
              set({ profiles: [], activeProfileId: null });
            }
          }
        );

        return () => subscription.subscription.unsubscribe();
      },

      isAnonymous: () => get().session?.user.is_anonymous === true,

      ensureSession: async () => {
        if (get().session) return;
        const { data, error } = await supabase.auth.signInAnonymously();
        if (error || !data.session) {
          // Zostaje ekran logowania — lepsze to niż pusta gra bez zapisu.
          if (error) console.warn('[auth] anonimowa sesja:', error.message);
          return;
        }
        set({ session: data.session });
      },

      awaitingConfirmation: null,
      clearAwaitingConfirmation: () => set({ awaitingConfirmation: null }),

      signInWithEmail: async (rawEmail, password, mode) => {
        const email = rawEmail.trim();
        set({ busy: true, error: null, awaitingConfirmation: null });

        if ((mode ?? (get().isAnonymous() ? 'link' : 'login')) === 'link') {
          // Dopięcie e-maila do anonimowego konta — uid i postępy zostają.
          // Przy włączonym potwierdzaniu adresu e-mail dopisze się dopiero po
          // kliknięciu linku; hasło jest ustawione od razu.
          const { data, error } = await supabase.auth.updateUser({ email, password });
          if (error) {
            set({ busy: false, error: friendlyError(error.message) });
            return;
          }
          set({
            busy: false,
            awaitingConfirmation: data.user?.new_email ? email : null,
          });
          return;
        }

        // 1. Najpierw zwykłe logowanie — to najczęstszy przypadek.
        const signIn = await supabase.auth.signInWithPassword({ email, password });
        if (!signIn.error) {
          set({ busy: false });
          return;
        }

        // Inny błąd niż złe dane (np. brak sieci) — nie zakładamy konta.
        if (!signIn.error.message.toLowerCase().includes('invalid login credentials')) {
          set({ busy: false, error: friendlyError(signIn.error.message) });
          return;
        }

        // Z anonimowej gry „Mam już konto” to tylko logowanie: nowe konto
        // w tym miejscu porzuciłoby postępy z telefonu bez żadnej korzyści —
        // od tego jest „Zapisz postępy” (tryb `link`).
        if (get().isAnonymous()) {
          set({ busy: false, error: friendlyError(signIn.error.message) });
          return;
        }

        // 2. Danych nie rozpoznano — próbujemy założyć konto.
        const signUp = await supabase.auth.signUp({ email, password });
        if (signUp.error) {
          set({ busy: false, error: friendlyError(signUp.error.message) });
          return;
        }

        // Supabase celowo nie zdradza, czy adres jest już zajęty: zwraca
        // „sukces" z pustą listą tożsamości. To jedyny sygnał pozwalający
        // odróżnić nowe konto od literówki w haśle do istniejącego.
        const identities = signUp.data.user?.identities;
        if (identities && identities.length === 0) {
          set({
            busy: false,
            error: 'Konto z tym adresem już istnieje — sprawdź hasło.',
          });
          return;
        }

        // Konto założone. Przy włączonym potwierdzaniu adresu sesji jeszcze nie ma.
        set({
          busy: false,
          awaitingConfirmation: signUp.data.session ? null : email,
        });
      },

      signInWithGoogle: async (mode) => {
        set({ busy: true, error: null });
        try {
          const redirectTo = Linking.createURL('auth/callback');
          const link = (mode ?? (get().isAnonymous() ? 'link' : 'login')) === 'link';
          const options = { redirectTo, skipBrowserRedirect: true };
          const { data, error } = link
            ? await supabase.auth.linkIdentity({ provider: 'google', options })
            : await supabase.auth.signInWithOAuth({ provider: 'google', options });
          if (error) throw error;
          if (!data.url) throw new Error('Google nie zwrócił adresu logowania.');

          const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
          if (result.type !== 'success') {
            // Rodzic zamknął okno — to nie jest błąd, nic nie komunikujemy.
            set({ busy: false });
            return;
          }

          const code = new URL(result.url).searchParams.get('code');
          if (!code) throw new Error('Brak kodu autoryzacji w odpowiedzi Google.');

          const exchange = await supabase.auth.exchangeCodeForSession(code);
          if (exchange.error) throw exchange.error;

          set({ busy: false });
        } catch (e) {
          const message = e instanceof Error ? e.message : 'Logowanie Google nie powiodło się.';
          set({ busy: false, error: friendlyError(message) });
        }
      },

      signInWithApple: async (mode) => {
        set({ busy: true, error: null });
        try {
          const credential = await AppleAuthentication.signInAsync({
            requestedScopes: [
              AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
              AppleAuthentication.AppleAuthenticationScope.EMAIL,
            ],
          });

          if (!credential.identityToken) {
            throw new Error('Apple nie zwróciło tokenu tożsamości.');
          }

          const link = (mode ?? (get().isAnonymous() ? 'link' : 'login')) === 'link';
          const idToken = { provider: 'apple' as const, token: credential.identityToken };
          const { error } = link
            ? await supabase.auth.linkIdentity(idToken)
            : await supabase.auth.signInWithIdToken(idToken);
          if (error) throw error;

          set({ busy: false });
        } catch (e) {
          // Anulowanie okna Apple nie jest błędem do pokazania.
          if (
            e &&
            typeof e === 'object' &&
            'code' in e &&
            (e as { code?: string }).code === 'ERR_REQUEST_CANCELED'
          ) {
            set({ busy: false });
            return;
          }
          const message = e instanceof Error ? e.message : 'Logowanie Apple nie powiodło się.';
          set({ busy: false, error: friendlyError(message) });
        }
      },

      signOut: async () => {
        set({ busy: true });
        await supabase.auth.signOut();
        set({
          busy: false,
          profiles: [],
          activeProfileId: null,
          error: null,
          awaitingConfirmation: null,
        });
        // Jak w Finchu: po wylogowaniu gra działa dalej od zera, na nowym
        // anonimowym koncie.
        await get().ensureSession();
      },

      deleteAccount: async () => {
        set({ busy: true, error: null });
        const { error } = await supabase.rpc('delete_my_account');
        if (error) {
          set({ busy: false, error: friendlyError(error.message) });
          return false;
        }
        // Dane z telefonu: zdjęcia awatarów i zapamiętany postęp.
        for (const p of get().profiles) deleteAvatarPhoto(p.id);
        await AsyncStorage.multiRemove(['timo-profile-v1', 'timo-leaderboard', 'timo-onboarding']).catch(
          () => undefined,
        );
        // Konta już nie ma na serwerze — wylogowanie tylko lokalne.
        await supabase.auth.signOut({ scope: 'local' }).catch(() => undefined);
        set({
          busy: false,
          session: null,
          profiles: [],
          profilesLoaded: false,
          activeProfileId: null,
          awaitingConfirmation: null,
        });
        await get().ensureSession();
        return true;
      },

      loadProfiles: async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, nick, avatar, nick_variant')
          .order('created_at', { ascending: true });

        if (error) {
          set({ error: friendlyError(error.message) });
          return;
        }

        const profiles = (data ?? []) as ChildProfile[];
        const active = get().activeProfileId;
        set({
          profiles,
          profilesLoaded: true,
          // Profil mógł zostać usunięty na innym urządzeniu.
          activeProfileId: profiles.some((p) => p.id === active) ? active : null,
          error: null,
        });
      },

      createProfile: async (nick, avatar) => {
        const session = get().session;
        if (!session) return null;

        set({ busy: true, error: null });
        const { data, error } = await supabase
          .from('profiles')
          .insert({ parent_id: session.user.id, nick: nick.trim(), avatar })
          .select('id, nick, avatar, nick_variant')
          .single();

        if (error || !data) {
          set({ busy: false, error: friendlyError(error?.message ?? 'Nie udało się dodać profilu.') });
          return null;
        }

        set({
          busy: false,
          profiles: [...get().profiles, data as ChildProfile],
        });
        return (data as ChildProfile).id;
      },

      deleteProfile: async (id) => {
        set({ busy: true, error: null });
        const { error } = await supabase.from('profiles').delete().eq('id', id);
        if (error) {
          set({ busy: false, error: friendlyError(error.message) });
          return;
        }
        set({
          busy: false,
          profiles: get().profiles.filter((p) => p.id !== id),
          activeProfileId: get().activeProfileId === id ? null : get().activeProfileId,
        });
      },

      selectProfile: (id) => set({ activeProfileId: id }),

      activeProfile: () => {
        const { profiles, activeProfileId } = get();
        return profiles.find((p) => p.id === activeProfileId) ?? null;
      },

      rerollPublicName: async () => {
        const profile = get().activeProfile();
        if (!profile) return;

        const nextVariant = profile.nick_variant + 1;
        const { error } = await supabase
          .from('profiles')
          .update({ nick_variant: nextVariant })
          .eq('id', profile.id);

        if (error) {
          set({ error: friendlyError(error.message) });
          return;
        }

        set({
          profiles: get().profiles.map((p) =>
            p.id === profile.id ? { ...p, nick_variant: nextVariant } : p
          ),
        });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'timo-auth',
      storage: createJSONStorage(() => AsyncStorage),
      // Sesję trzyma klient Supabase; my pamiętamy tylko, kto ostatnio grał.
      partialize: (state) => ({ activeProfileId: state.activeProfileId }),
    }
  )
);
