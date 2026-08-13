import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Session } from '@supabase/supabase-js';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { supabase } from '@/lib/supabase';

export type ChildProfile = {
  id: string;
  /** Imię widoczne tylko w tej aplikacji, na koncie rodzica. */
  nick: string;
  avatar: string;
  /** Ziarno pseudonimu publicznego w rankingu — nie tekst, tylko liczba. */
  nick_variant: number;
};

type AuthState = {
  /** Sesja rodzica. `null` = nikt nie jest zalogowany. */
  session: Session | null;
  /** Trwa pierwsze sprawdzenie sesji — do czasu końca nie przekierowujemy. */
  initializing: boolean;

  profiles: ChildProfile[];
  activeProfileId: string | null;

  busy: boolean;
  error: string | null;

  init: () => () => void;

  /**
   * Jedno wejście dla e-maila: logowanie, a gdy konta jeszcze nie ma —
   * założenie go. Rodzic nie musi wybierać między „zaloguj" a „zarejestruj".
   */
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;

  /** Konto założone, ale Supabase czeka na potwierdzenie adresu. */
  awaitingConfirmation: string | null;
  clearAwaitingConfirmation: () => void;

  loadProfiles: () => Promise<void>;
  createProfile: (nick: string, avatar: string) => Promise<boolean>;
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
      activeProfileId: null,
      busy: false,
      error: null,

      init: () => {
        void supabase.auth.getSession().then(({ data }) => {
          set({ session: data.session, initializing: false });
          if (data.session) void get().loadProfiles();
        });

        const { data: subscription } = supabase.auth.onAuthStateChange(
          (_event, session) => {
            const hadSession = Boolean(get().session);
            set({ session, initializing: false });

            if (session && !hadSession) {
              void get().loadProfiles();
            }
            if (!session) {
              set({ profiles: [], activeProfileId: null });
            }
          }
        );

        return () => subscription.subscription.unsubscribe();
      },

      awaitingConfirmation: null,
      clearAwaitingConfirmation: () => set({ awaitingConfirmation: null }),

      signInWithEmail: async (rawEmail, password) => {
        const email = rawEmail.trim();
        set({ busy: true, error: null, awaitingConfirmation: null });

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

      signInWithGoogle: async () => {
        set({ busy: true, error: null });
        try {
          const redirectTo = Linking.createURL('auth/callback');
          const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo, skipBrowserRedirect: true },
          });
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

      signInWithApple: async () => {
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

          const { error } = await supabase.auth.signInWithIdToken({
            provider: 'apple',
            token: credential.identityToken,
          });
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
          // Profil mógł zostać usunięty na innym urządzeniu.
          activeProfileId: profiles.some((p) => p.id === active) ? active : null,
          error: null,
        });
      },

      createProfile: async (nick, avatar) => {
        const session = get().session;
        if (!session) return false;

        set({ busy: true, error: null });
        const { data, error } = await supabase
          .from('profiles')
          .insert({ parent_id: session.user.id, nick: nick.trim(), avatar })
          .select('id, nick, avatar, nick_variant')
          .single();

        if (error || !data) {
          set({ busy: false, error: friendlyError(error?.message ?? 'Nie udało się dodać profilu.') });
          return false;
        }

        set({
          busy: false,
          profiles: [...get().profiles, data as ChildProfile],
        });
        return true;
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
