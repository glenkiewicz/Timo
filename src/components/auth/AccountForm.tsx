import * as AppleAuthentication from 'expo-apple-authentication';
import { useEffect, useRef, useState } from 'react';
import { AppState, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TimoCharacter } from '@/components/timo/TimoCharacter';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Field } from '@/components/ui/Field';
import { Icon } from '@/components/ui/Icon';
import { type AuthMode, type PendingCode, useAuthStore } from '@/lib/stores/auth-store';
import { isSupabaseConfigured } from '@/lib/supabase';
import { UI } from '@/theme/ui';
import { Pressable, Text, View } from '@/tw';
import { contentColumn } from '@/lib/layout';

/**
 * Logowanie Google i Apple — każde włączamy dopiero, gdy dostawca jest
 * skonfigurowany w Supabase (Authentication → Providers). Przycisk, który nie
 * działa, recenzja App Store odrzuca; samo logowanie e-mailem wystarcza.
 * Dopinanie do konta anonimowego wymaga też „Allow manual linking”.
 * Apple: Client ID = bundle id (com.glenkiewicz.Timo). Google: jeszcze nie.
 */
const APPLE_LOGIN = true;
const GOOGLE_LOGIN = false;

const COPY = {
  // Bez anonimowej sesji (brak sieci przy pierwszym starcie) — stary ekran.
  fallback: {
    title: 'Witaj w Timo!',
    lead: 'Konto zakłada dorosły. Dziecko będzie wchodzić jednym puknięciem w swój awatar.',
    submit: 'ZALOGUJ SIĘ',
    google: 'Zaloguj przez Google',
    hint: 'Pierwszy raz? Wpisz e-mail i hasło — konto założy się samo.',
  },
  link: {
    title: 'Zapisz postępy Timo',
    lead: 'Załóż konto rodzica, a kolekcja, odznaki i poziom dziecka będą bezpieczne — także na nowym telefonie.',
    submit: 'ZAPISZ POSTĘPY',
    google: 'Zapisz przez Google',
    hint: 'Hasło co najmniej 6 znaków. Dziecko gra dalej bez zmian.',
  },
  login: {
    title: 'Mam już konto',
    lead: 'Zaloguj się kontem rodzica, żeby wczytać kolekcję i postępy dzieci.',
    submit: 'ZALOGUJ SIĘ',
    google: 'Zaloguj przez Google',
    hint: 'Pierwszy raz? Wybierz „Zapisz postępy z tego telefonu”.',
  },
} as const;

/**
 * Formularz konta rodzica w trzech odmianach:
 * - `fallback` — ekran logowania, gdy nie udało się założyć anonimowej sesji,
 * - `link` — dopięcie e-maila / Apple / Google do anonimowego konta,
 * - `login` — wejście na istniejące konto z anonimowej gry.
 */
export function AccountForm({
  variant,
  onSwitch,
  onDone,
}: {
  variant: 'fallback' | AuthMode;
  /** Przełączenie link ↔ login (ekran konta). */
  onSwitch?: () => void;
  /** Po zapisaniu/zalogowaniu — ekran konta wraca do gry. */
  onDone?: () => void;
}) {
  const insets = useSafeAreaInsets();
  const copy = COPY[variant];
  const mode: AuthMode | undefined = variant === 'fallback' ? undefined : variant;
  const session = useAuthStore((s) => s.session);
  const anonymous = session?.user.is_anonymous === true;

  // Konto dopięte albo zalogowane — wracamy do gry.
  // Logowanie podmienia konto, więc w trybie `login` sygnałem jest nowy uid.
  const doneRef = useRef(false);
  const startUserId = useRef(session?.user.id);
  const pendingCode = useAuthStore((s) => s.pendingCode);
  useEffect(() => {
    // Kod albo nowe hasło jeszcze przed nami — logowanie kodem z „Nie pamiętam
    // hasła” zmienia konto, zanim rodzic ustawi hasło.
    if (!onDone || doneRef.current || !session || pendingCode) return;
    const linked = variant === 'link' && !anonymous;
    const loggedIn = variant === 'login' && !anonymous && session.user.id !== startUserId.current;
    if (linked || loggedIn) {
      doneRef.current = true;
      onDone();
    }
  }, [variant, anonymous, session, onDone, pendingCode]);

  const signInWithEmail = useAuthStore((s) => s.signInWithEmail);
  const signInWithGoogle = useAuthStore((s) => s.signInWithGoogle);
  const signInWithApple = useAuthStore((s) => s.signInWithApple);
  const busy = useAuthStore((s) => s.busy);
  const error = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);
  const verifyCode = useAuthStore((s) => s.verifyCode);
  const resendCode = useAuthStore((s) => s.resendCode);
  const cancelCode = useAuthStore((s) => s.cancelCode);
  const startPasswordReset = useAuthStore((s) => s.startPasswordReset);
  const setNewPassword = useAuthStore((s) => s.setNewPassword);
  const checkLinkConfirmed = useAuthStore((s) => s.checkLinkConfirmed);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [appleAvailable, setAppleAvailable] = useState(false);

  // Sign in with Apple istnieje tylko na iOS 13+ — na reszcie nie pokazujemy guzika.
  useEffect(() => {
    if (Platform.OS !== 'ios') return;
    void AppleAuthentication.isAvailableAsync().then(setAppleAvailable);
  }, []);

  const canSubmit = email.trim().length > 3 && password.length >= 6 && !busy;

  if (pendingCode) {
    return (
      <CodeStep
        pending={pendingCode}
        busy={busy}
        error={error}
        onVerify={verifyCode}
        onResend={resendCode}
        onNewPassword={setNewPassword}
        onCancel={cancelCode}
        onCheckLink={checkLinkConfirmed}
        clearError={clearError}
      />
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-canvas"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          ...contentColumn,
          flexGrow: 1,
          justifyContent: 'center',
          paddingHorizontal: 24,
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 24,
        }}>
        <View className="items-center mb-4">
          <TimoCharacter size={120} />
          <Text style={{ color: UI.text, fontFamily: 'Gabarito-Bold', fontSize: 24 }}>
            {copy.title}
          </Text>
          <Text
            className="text-center"
            style={{
              color: UI.textSoft,
              fontFamily: 'Lexend',
              fontSize: 13,
              lineHeight: 19,
              marginTop: 4,
            }}>
            {copy.lead}
          </Text>
        </View>

        {variant === 'login' && anonymous ? (
          <View className="mb-3">
            <Card borderColor={UI.gold} background={UI.goldPale} padding={12}>
              <Text style={{ color: UI.goldDeep, fontFamily: 'Lexend-Bold', fontSize: 12, lineHeight: 17 }}>
                Postępy zebrane na tym telefonie bez konta zostaną zastąpione tymi z konta.
                Chcesz je zachować? Wybierz „Zapisz postępy”.
              </Text>
            </Card>
          </View>
        ) : null}

        {!isSupabaseConfigured ? (
          <View className="mb-3">
            <Card borderColor={UI.gold} background={UI.goldPale} padding={12}>
              <Text
                style={{
                  color: UI.goldDeep,
                  fontFamily: 'Lexend-Bold',
                  fontSize: 12,
                  lineHeight: 17,
                }}>
                Brak konfiguracji serwera kont — uzupełnij EXPO_PUBLIC_SUPABASE_URL
                i EXPO_PUBLIC_SUPABASE_ANON_KEY (patrz docs/accounts.md).
              </Text>
            </Card>
          </View>
        ) : null}

        <Card padding={16}>
          <View className="gap-3">
            <Field
              label="E-MAIL RODZICA"
              value={email}
              onChangeText={(text) => {
                clearError();
                setEmail(text);
              }}
              placeholder="rodzic@example.com"
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              textContentType="emailAddress"
              inputMode="email"
            />
            <Field
              label="HASŁO"
              value={password}
              onChangeText={(text) => {
                clearError();
                setPassword(text);
              }}
              placeholder="co najmniej 6 znaków"
              secureTextEntry
              autoCapitalize="none"
              textContentType="password"
            />

            {error ? (
              <Text
                style={{
                  color: UI.dangerDeep,
                  fontFamily: 'Lexend-Bold',
                  fontSize: 12,
                  lineHeight: 17,
                }}>
                {error}
              </Text>
            ) : null}

            <Button
              label={busy ? 'CHWILECZKĘ…' : copy.submit}
              onPress={() => void signInWithEmail(email, password, mode)}
              disabled={!canSubmit}
            />

            <Text
              className="text-center"
              style={{
                color: UI.textFaint,
                fontFamily: 'Lexend',
                fontSize: 11,
                lineHeight: 16,
              }}>
              {copy.hint}
            </Text>

            {variant !== 'link' ? (
              <Pressable
                onPress={() => void startPasswordReset(email)}
                disabled={busy}
                accessibilityRole="button"
                style={{ alignSelf: 'center', padding: 4 }}>
                <Text style={{ color: UI.primaryDeep, fontFamily: 'Gabarito-Bold', fontSize: 14 }}>
                  Nie pamiętam hasła
                </Text>
              </Pressable>
            ) : null}
          </View>
        </Card>

        {/* ---------- logowanie społecznościowe ---------- */}
        {GOOGLE_LOGIN || (APPLE_LOGIN && appleAvailable) ? (
          <>
          <View className="flex-row items-center gap-3 my-4">
            <View style={{ flex: 1, height: 2, backgroundColor: UI.line }} />
            <Text
              style={{ color: UI.textFaint, fontFamily: 'Gabarito-Bold', fontSize: 11 }}>
              ALBO
            </Text>
            <View style={{ flex: 1, height: 2, backgroundColor: UI.line }} />
          </View>

          <View className="gap-2.5">
            {GOOGLE_LOGIN ? (
              <Button
                label={copy.google}
                variant="ghost"
                size="md"
                onPress={() => void signInWithGoogle(mode)}
                disabled={busy}
              />
            ) : null}

            {APPLE_LOGIN && appleAvailable ? (
              <AppleAuthentication.AppleAuthenticationButton
                buttonType={
                  variant === 'link'
                    ? AppleAuthentication.AppleAuthenticationButtonType.CONTINUE
                    : AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
                }
                buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                cornerRadius={14}
                style={{ height: 48 }}
                onPress={() => void signInWithApple(mode)}
              />
            ) : null}
          </View>

          </>
        ) : null}

        {onSwitch ? (
          <Pressable
            onPress={() => {
              clearError();
              onSwitch();
            }}
            accessibilityRole="button"
            style={{ alignSelf: 'center', marginTop: 18, padding: 8 }}>
            <Text style={{ color: UI.primaryDeep, fontFamily: 'Gabarito-Bold', fontSize: 15 }}>
              {variant === 'link' ? 'Mam już konto — zaloguj się' : 'Zapisz postępy z tego telefonu'}
            </Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/**
 * Długość kodu ustawia projekt Supabase (Auth → Email OTP length, 6–10).
 * Nasz wysyła 8 cyfr — przyjmujemy każdą rozsądną długość, żeby zmiana
 * w panelu nie blokowała rodziców.
 */
const CODE_MIN = 6;
const CODE_MAX = 10;

/** Po ilu sekundach wolno poprosić o kolejny kod (Supabase domyślnie: 60 s). */
const RESEND_AFTER_S = 60;

const CODE_COPY: Record<PendingCode['purpose'], { title: string; lead: (email: string) => string }> = {
  link: {
    title: 'Wpisz kod z maila',
    lead: (email) => `Wysłaliśmy kod na ${email}. Po wpisaniu konto rodzica będzie gotowe.`,
  },
  signup: {
    title: 'Wpisz kod z maila',
    lead: (email) => `Wysłaliśmy kod na ${email}. Po wpisaniu będziesz zalogowany.`,
  },
  recovery: {
    title: 'Wpisz kod z maila',
    lead: (email) => `Wysłaliśmy kod na ${email}. Potem ustawisz nowe hasło.`,
  },
  'new-password': {
    title: 'Ustaw nowe hasło',
    lead: () => 'Wpisz nowe hasło do konta rodzica — co najmniej 6 znaków.',
  },
};

/**
 * Kod z maila (albo nowe hasło po nim). Link z maila dalej działa — gdy
 * rodzic go kliknie i wróci do aplikacji, sprawdzamy, czy adres jest już
 * potwierdzony (`onCheckLink`).
 */
function CodeStep({
  pending,
  busy,
  error,
  onVerify,
  onResend,
  onNewPassword,
  onCancel,
  onCheckLink,
  clearError,
}: {
  pending: PendingCode;
  busy: boolean;
  error: string | null;
  onVerify: (code: string) => Promise<boolean>;
  onResend: () => Promise<void>;
  onNewPassword: (password: string) => Promise<void>;
  onCancel: () => void;
  onCheckLink: () => Promise<void>;
  clearError: () => void;
}) {
  const insets = useSafeAreaInsets();
  const [value, setValue] = useState('');
  const [wait, setWait] = useState(RESEND_AFTER_S);
  const newPassword = pending.purpose === 'new-password';
  const copy = CODE_COPY[pending.purpose];

  useEffect(() => {
    setValue('');
    setWait(RESEND_AFTER_S);
  }, [pending.purpose]);

  useEffect(() => {
    if (wait <= 0) return;
    const t = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') void onCheckLink();
    });
    return () => sub.remove();
  }, [onCheckLink]);

  const digits = value.replace(/\D/g, '');
  const canSubmit = !busy && (newPassword ? value.length >= 6 : digits.length >= CODE_MIN);

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-canvas"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          ...contentColumn,
          flexGrow: 1,
          justifyContent: 'center',
          paddingHorizontal: 24,
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 24,
        }}>
        <View className="items-center mb-4">
          <TimoCharacter size={110} />
          <Text style={{ color: UI.text, fontFamily: 'Gabarito-Bold', fontSize: 24 }}>{copy.title}</Text>
          <Text
            className="text-center"
            style={{ color: UI.textSoft, fontFamily: 'Lexend', fontSize: 13, lineHeight: 19, marginTop: 4 }}>
            {copy.lead(pending.email)}
          </Text>
        </View>

        <Card padding={16}>
          <View className="gap-3">
            {newPassword ? (
              <Field
                label="NOWE HASŁO"
                value={value}
                onChangeText={(t) => {
                  clearError();
                  setValue(t);
                }}
                placeholder="co najmniej 6 znaków"
                secureTextEntry
                autoCapitalize="none"
                textContentType="newPassword"
              />
            ) : (
              <Field
                label="KOD Z MAILA"
                value={value}
                onChangeText={(t) => {
                  clearError();
                  setValue(t.replace(/\D/g, '').slice(0, CODE_MAX));
                }}
                placeholder="12345678"
                keyboardType="number-pad"
                inputMode="numeric"
                autoComplete="one-time-code"
                textContentType="oneTimeCode"
                maxLength={CODE_MAX}
              />
            )}

            {error ? (
              <Text style={{ color: UI.dangerDeep, fontFamily: 'Lexend-Bold', fontSize: 12, lineHeight: 17 }}>
                {error}
              </Text>
            ) : null}

            <Button
              label={busy ? 'CHWILECZKĘ…' : newPassword ? 'ZAPISZ HASŁO' : 'POTWIERDŹ'}
              disabled={!canSubmit}
              onPress={() => void (newPassword ? onNewPassword(value) : onVerify(digits))}
            />

            {!newPassword ? (
              <Text
                className="text-center"
                style={{ color: UI.textFaint, fontFamily: 'Lexend', fontSize: 11, lineHeight: 16 }}>
                Nie ma maila? Zajrzyj do spamu albo poproś o nowy kod.
              </Text>
            ) : null}
          </View>
        </Card>

        <View className="items-center gap-1 mt-4">
          {!newPassword ? (
            <Pressable
              onPress={() => {
                void onResend();
                setWait(RESEND_AFTER_S);
              }}
              disabled={busy || wait > 0}
              accessibilityRole="button"
              style={{ padding: 8 }}>
              <Text
                style={{
                  color: wait > 0 ? UI.textFaint : UI.primaryDeep,
                  fontFamily: 'Gabarito-Bold',
                  fontSize: 15,
                }}>
                {wait > 0 ? `Wyślij kod ponownie (${wait} s)` : 'Wyślij kod ponownie'}
              </Text>
            </Pressable>
          ) : null}
          <Pressable onPress={onCancel} accessibilityRole="button" style={{ padding: 8 }}>
            <Text style={{ color: UI.textSoft, fontFamily: 'Gabarito-Bold', fontSize: 15 }}>
              {newPassword ? 'Pomiń' : 'Zmień adres e-mail'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
