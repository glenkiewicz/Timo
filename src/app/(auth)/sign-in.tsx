import * as AppleAuthentication from 'expo-apple-authentication';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TimoCharacter } from '@/components/timo/TimoCharacter';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Field } from '@/components/ui/Field';
import { Icon } from '@/components/ui/Icon';
import { useAuthStore } from '@/lib/stores/auth-store';
import { isSupabaseConfigured } from '@/lib/supabase';
import { UI } from '@/theme/ui';
import { Text, View } from '@/tw';

export default function SignInScreen() {
  const insets = useSafeAreaInsets();

  const signInWithEmail = useAuthStore((s) => s.signInWithEmail);
  const signInWithGoogle = useAuthStore((s) => s.signInWithGoogle);
  const signInWithApple = useAuthStore((s) => s.signInWithApple);
  const busy = useAuthStore((s) => s.busy);
  const error = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);
  const awaitingConfirmation = useAuthStore((s) => s.awaitingConfirmation);
  const clearAwaitingConfirmation = useAuthStore((s) => s.clearAwaitingConfirmation);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [appleAvailable, setAppleAvailable] = useState(false);

  // Sign in with Apple istnieje tylko na iOS 13+ — na reszcie nie pokazujemy guzika.
  useEffect(() => {
    if (Platform.OS !== 'ios') return;
    void AppleAuthentication.isAvailableAsync().then(setAppleAvailable);
  }, []);

  const canSubmit = email.trim().length > 3 && password.length >= 6 && !busy;

  if (awaitingConfirmation) {
    return (
      <View
        className="flex-1 bg-canvas items-center justify-center px-6"
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
        <Card borderColor={UI.primary} background={UI.primaryPale} padding={18}>
          <View className="items-center gap-2">
            <Icon name="check" size={30} color={UI.primaryDeep} strokeWidth={3} />
            <Text
              className="text-center"
              style={{ color: UI.text, fontFamily: 'Gabarito-Bold', fontSize: 18 }}>
              Konto założone
            </Text>
            <Text
              className="text-center"
              style={{
                color: UI.primaryDeep,
                fontFamily: 'Lexend',
                fontSize: 13,
                lineHeight: 19,
              }}>
              Wysłaliśmy link potwierdzający na {awaitingConfirmation}. Kliknij go,
              a potem wróć tutaj i zaloguj się tym samym hasłem.
            </Text>
            <View className="mt-2" style={{ alignSelf: 'stretch' }}>
              <Button
                label="Wróć do logowania"
                variant="ghost"
                size="md"
                onPress={clearAwaitingConfirmation}
              />
            </View>
          </View>
        </Card>
      </View>
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
          flexGrow: 1,
          justifyContent: 'center',
          paddingHorizontal: 24,
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 24,
        }}>
        <View className="items-center mb-4">
          <TimoCharacter size={120} />
          <Text style={{ color: UI.text, fontFamily: 'Gabarito-Bold', fontSize: 24 }}>
            Witaj w Timo!
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
            Konto zakłada dorosły. Dziecko będzie wchodzić jednym puknięciem
            w swój awatar.
          </Text>
        </View>

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
              label={busy ? 'CHWILECZKĘ…' : 'ZALOGUJ SIĘ'}
              onPress={() => void signInWithEmail(email, password)}
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
              Pierwszy raz? Wpisz e-mail i hasło — konto założy się samo.
            </Text>
          </View>
        </Card>

        {/* ---------- logowanie społecznościowe ---------- */}
        <View className="flex-row items-center gap-3 my-4">
          <View style={{ flex: 1, height: 2, backgroundColor: UI.line }} />
          <Text
            style={{ color: UI.textFaint, fontFamily: 'Gabarito-Bold', fontSize: 11 }}>
            ALBO
          </Text>
          <View style={{ flex: 1, height: 2, backgroundColor: UI.line }} />
        </View>

        <View className="gap-2.5">
          <Button
            label="Zaloguj przez Google"
            variant="ghost"
            size="md"
            onPress={() => void signInWithGoogle()}
            disabled={busy}
          />

          {appleAvailable ? (
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
              buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
              cornerRadius={14}
              style={{ height: 48 }}
              onPress={() => void signInWithApple()}
            />
          ) : null}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
