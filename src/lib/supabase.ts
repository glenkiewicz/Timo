import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { AppState, Platform } from 'react-native';

/**
 * Klient Supabase — logowanie rodzica i dostęp do bazy.
 *
 * Klucz `anon` jest jawny z założenia; danych pilnuje RLS po stronie bazy
 * (patrz supabase/migrations). Sesja leży w AsyncStorage, więc dziecko nie
 * musi się logować po każdym uruchomieniu.
 */

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

/** Czy aplikacja ma skąd czytać konta — pozwala pokazać sensowny ekran zamiast crasha. */
export const isSupabaseConfigured = Boolean(url && anonKey);

if (!isSupabaseConfigured && __DEV__) {
  console.warn(
    '[supabase] Brak EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY — logowanie nie zadziała.'
  );
}

/**
 * Statyczny eksport weba prerenderuje strony w Node, gdzie nie ma `window` —
 * a webowy AsyncStorage sięga po `localStorage` już przy starcie klienta.
 * Bez tego warunku `expo start --web` i `expo export -p web` wywracają się na
 * `ReferenceError: window is not defined`.
 */
const canPersistSession = typeof window !== 'undefined';

export const supabase = createClient(
  url ?? 'http://localhost:54321',
  anonKey ?? 'public-anon-key-placeholder',
  {
    auth: {
      storage: canPersistSession ? AsyncStorage : undefined,
      autoRefreshToken: canPersistSession,
      persistSession: canPersistSession,
      // Na natywie nie ma adresu URL, z którego można odczytać sesję.
      detectSessionInUrl: canPersistSession && Platform.OS === 'web',
      // PKCE — logowanie Google wraca z kodem, który wymieniamy na sesję.
      flowType: 'pkce',
    },
  }
);

// Odświeżanie tokenu ma sens tylko wtedy, gdy aplikacja jest na wierzchu.
if (Platform.OS !== 'web') {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });
}
