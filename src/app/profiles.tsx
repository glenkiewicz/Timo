import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Field } from '@/components/ui/Field';
import { Icon } from '@/components/ui/Icon';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useProfileStore } from '@/lib/stores/profile-store';
import { UI } from '@/theme/ui';
import { Pressable, Text, View } from '@/tw';

const AVATARS = ['🦊', '🐻', '🐰', '🦉', '🐼', '🦁', '🐸', '🐨'];

export default function ProfilesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const profiles = useAuthStore((s) => s.profiles);
  const createProfile = useAuthStore((s) => s.createProfile);
  const deleteProfile = useAuthStore((s) => s.deleteProfile);
  const selectProfile = useAuthStore((s) => s.selectProfile);
  const signOut = useAuthStore((s) => s.signOut);
  const busy = useAuthStore((s) => s.busy);
  const error = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);

  const hydrateFromServer = useProfileStore((s) => s.hydrateFromServer);

  const [adding, setAdding] = useState(profiles.length === 0);
  const [nick, setNick] = useState('');
  const [avatar, setAvatar] = useState(AVATARS[0]);

  const enter = async (id: string) => {
    selectProfile(id);
    await hydrateFromServer(id);
    router.replace('/(tabs)');
  };

  const handleCreate = async () => {
    const ok = await createProfile(nick, avatar);
    if (!ok) return;
    setNick('');
    setAdding(false);
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
          onPress: () => void deleteProfile(id),
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
                <Text style={{ fontSize: 34 }}>{profile.avatar}</Text>
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
                  <View className="flex-row flex-wrap gap-2">
                    {AVATARS.map((option) => (
                      <Pressable
                        key={option}
                        onPress={() => setAvatar(option)}
                        accessibilityRole="button"
                        accessibilityState={{ selected: avatar === option }}
                        className="items-center justify-center"
                        style={{
                          width: 52,
                          height: 52,
                          borderRadius: 16,
                          backgroundColor: avatar === option ? UI.primaryPale : UI.sunken,
                          borderWidth: 2,
                          borderColor: avatar === option ? UI.primary : UI.line,
                        }}>
                        <Text style={{ fontSize: 26 }}>{option}</Text>
                      </Pressable>
                    ))}
                  </View>
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

        <View className="mt-6">
          <Button
            label="Wyloguj konto rodzica"
            variant="ghost"
            size="sm"
            onPress={() => void signOut()}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
