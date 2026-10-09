import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Field } from '@/components/ui/Field';
import { Icon } from '@/components/ui/Icon';
import { AvatarPicker } from '@/components/profile/AvatarPicker';
import { ChildAvatar } from '@/components/profile/ChildAvatar';
import { ParentalGate } from '@/components/paywall/ParentalGate';
import { DEFAULT_AVATAR } from '@/data/avatars';
import { PHOTO_AVATAR, deleteAvatarPhoto, saveAvatarPhoto } from '@/lib/avatar-photo';
import { useContentWidth } from '@/lib/layout';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useProfileStore } from '@/lib/stores/profile-store';
import { UI } from '@/theme/ui';
import { Pressable, Text, View } from '@/tw';
import { contentColumn } from '@/lib/layout';


export default function ProfilesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const profiles = useAuthStore((s) => s.profiles);
  const createProfile = useAuthStore((s) => s.createProfile);
  const deleteProfile = useAuthStore((s) => s.deleteProfile);
  const selectProfile = useAuthStore((s) => s.selectProfile);
  const signOut = useAuthStore((s) => s.signOut);
  const deleteAccount = useAuthStore((s) => s.deleteAccount);
  // Akcja czekająca na odpowiedź dorosłego w bramce rodzicielskiej.
  const [gate, setGate] = useState<null | (() => void)>(null);
  const anonymous = useAuthStore((s) => s.session?.user.is_anonymous === true);
  const busy = useAuthStore((s) => s.busy);
  const error = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);

  const hydrateFromServer = useProfileStore((s) => s.hydrateFromServer);

  const [adding, setAdding] = useState(profiles.length === 0);
  const [nick, setNick] = useState('');
  const [avatar, setAvatar] = useState<string>(DEFAULT_AVATAR);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const contentW = useContentWidth();

  const enter = async (id: string) => {
    selectProfile(id);
    await hydrateFromServer(id);
    // Przez ekran startowy — nowe dziecko też ma sam powiedzieć „Gramy!”.
    router.replace('/start');
  };

  const handleCreate = async () => {
    const id = await createProfile(nick, avatar);
    if (!id) return;
    if (avatar === PHOTO_AVATAR && photoUri) {
      try {
        saveAvatarPhoto(id, photoUri);
      } catch (e) {
        if (__DEV__) console.warn('[avatar] zapis zdjęcia:', e);
      }
    }
    setAvatar(DEFAULT_AVATAR);
    setPhotoUri(null);
    setNick('');
    setAdding(false);
  };

  const confirmDeleteAccount = () => {
    Alert.alert(
      'Usunąć konto?',
      'Znikną wszystkie profile dzieci, kolekcje, odznaki i postęp — na tym telefonie i na serwerze. Tego nie da się cofnąć.\n\nSubskrypcję (jeśli jest) anulujesz osobno w Ustawieniach → Apple ID → Subskrypcje.',
      [
        { text: 'Anuluj', style: 'cancel' },
        {
          text: 'Usuń konto',
          style: 'destructive',
          onPress: () => {
            void deleteAccount().then((ok) => {
              if (!ok) Alert.alert('Nie udało się usunąć konta', 'Sprawdź połączenie z internetem i spróbuj jeszcze raz.');
            });
          },
        },
      ],
    );
  };

  const confirmDelete = (id: string, name: string) => {
    Alert.alert(
      `Usunąć profil ${name}?`,
      'Cały postęp tego dziecka — kolekcja, odznaki i XP — zniknie bezpowrotnie.',
      [
        { text: 'Anuluj', style: 'cancel' },
        {
          text: 'Usuń',
          style: 'destructive',
          onPress: () => {
            deleteAvatarPhoto(id);
            void deleteProfile(id);
          },
        },
      ]
    );
  };

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
          paddingHorizontal: 20,
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + 24,
        }}>
        <Text
          className="text-center"
          style={{ color: UI.text, fontFamily: 'Gabarito-Bold', fontSize: 26 }}>
          Kto gra?
        </Text>
        <Text
          className="text-center"
          style={{
            color: UI.textSoft,
            fontFamily: 'Lexend',
            fontSize: 13,
            marginTop: 4,
            marginBottom: 20,
          }}>
          Wybierz swój awatar i ruszaj z Timo.
        </Text>

        <View className="gap-2.5">
          {profiles.map((profile) => (
            <Card
              key={profile.id}
              onPress={() => void enter(profile.id)}
              accessibilityLabel={`Graj jako ${profile.nick}`}
              padding={14}>
              <View className="flex-row items-center gap-3">
                <ChildAvatar avatar={profile.avatar} profileId={profile.id} size={52} />
                <Text
                  className="flex-1"
                  numberOfLines={1}
                  style={{
                    color: UI.text,
                    fontFamily: 'Gabarito-Bold',
                    fontSize: 18,
                  }}>
                  {profile.nick}
                </Text>
                <Pressable
                  onPress={() => confirmDelete(profile.id, profile.nick)}
                  accessibilityRole="button"
                  accessibilityLabel={`Usuń profil ${profile.nick}`}
                  hitSlop={8}
                  className="w-9 h-9 items-center justify-center rounded-pill"
                  style={{ backgroundColor: UI.sunken }}>
                  <Icon name="close" size={16} color={UI.textFaint} strokeWidth={2.6} />
                </Pressable>
                <Icon name="chevron-right" size={20} color={UI.textFaint} strokeWidth={2.6} />
              </View>
            </Card>
          ))}
        </View>

        {adding ? (
          <View className="mt-3">
            <Card padding={16}>
              <View className="gap-3">
                <Field
                  label="IMIĘ DZIECKA"
                  value={nick}
                  onChangeText={(text) => {
                    clearError();
                    setNick(text);
                  }}
                  placeholder="np. Zosia"
                  maxLength={24}
                  autoCapitalize="words"
                />

                <View className="gap-1.5">
                  <Text
                    style={{
                      color: UI.textSoft,
                      fontFamily: 'Gabarito-Bold',
                      fontSize: 12,
                      letterSpacing: 0.4,
                    }}>
                    AWATAR
                  </Text>
                  <AvatarPicker
                    value={avatar}
                    photoUri={photoUri}
                    width={contentW - 72}
                    onChange={(a, uri) => {
                      setAvatar(a);
                      setPhotoUri(uri);
                    }}
                  />
                </View>

                {error ? (
                  <Text
                    style={{
                      color: UI.dangerDeep,
                      fontFamily: 'Lexend-Bold',
                      fontSize: 12,
                    }}>
                    {error}
                  </Text>
                ) : null}

                <Button
                  label={busy ? 'CHWILECZKĘ…' : 'DODAJ PROFIL'}
                  size="md"
                  onPress={() => void handleCreate()}
                  disabled={nick.trim().length === 0 || busy}
                />
                {profiles.length > 0 ? (
                  <Button
                    label="Anuluj"
                    variant="ghost"
                    size="sm"
                    onPress={() => {
                      clearError();
                      setAdding(false);
                    }}
                  />
                ) : null}
              </View>
            </Card>
          </View>
        ) : (
          <View className="mt-3">
            <Button
              label="Dodaj profil dziecka"
              variant="ghost"
              size="md"
              onPress={() => setAdding(true)}
            />
          </View>
        )}

        <View className="flex-1" />

        <View className="mt-6 gap-2">
          {anonymous ? (
            <>
              {/* Jak w Finchu: konto nie jest wymagane, ale bez niego postępy
                  żyją tylko na tym telefonie. */}
              <Button
                label="Zapisz postępy — załóż konto rodzica"
                variant="ghost"
                size="md"
                onPress={() => setGate(() => () => router.push('/account'))}
              />
            </>
          ) : (
            <Button
              label="Wyloguj konto rodzica"
              variant="ghost"
              size="sm"
              onPress={() => void signOut()}
            />
          )}
          {/* Wymóg App Store (5.1.1): konto, które da się założyć, da się
              też usunąć — razem ze wszystkimi danymi dzieci. Za bramką
              rodzicielską, żeby dziecko nie skasowało kolekcji przypadkiem. */}
          <Pressable
            onPress={() => setGate(() => confirmDeleteAccount)}
            accessibilityRole="button"
            style={{ alignSelf: 'center', padding: 10, marginTop: 4 }}>
            <Text style={{ color: UI.dangerDeep, fontFamily: 'Lexend-Bold', fontSize: 13 }}>
              Usuń konto i wszystkie dane
            </Text>
          </Pressable>
        </View>
        <ParentalGate
          visible={gate !== null}
          onCancel={() => setGate(null)}
          onPass={() => {
            const fn = gate;
            setGate(null);
            fn?.();
          }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
