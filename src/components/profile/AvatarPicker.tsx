import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

import { INK } from '@/components/collection/map';
import { Icon } from '@/components/ui/Icon';
import { AVATARS } from '@/data/avatars';
import { PHOTO_AVATAR, pickAvatarPhoto } from '@/lib/avatar-photo';
import { UI } from '@/theme/ui';
import { Pressable, Text, View } from '@/tw';

import { ChildAvatar } from './ChildAvatar';

/**
 * Wybór awatara: 12 portretów w siatce 4×3 i zdjęcie — z galerii albo aparatu.
 * Zdjęcie trzymamy jako tymczasowy plik do czasu założenia profilu
 * (`saveAvatarPhoto`), dopiero wtedy ląduje na stałe na telefonie.
 */
export function AvatarPicker({
  value,
  photoUri,
  onChange,
  width,
}: {
  value: string;
  photoUri: string | null;
  onChange: (avatar: string, photoUri: string | null) => void;
  /** Szerokość dostępna na siatkę. */
  width: number;
}) {
  const gap = 12;
  const cols = 4;
  const size = Math.min(84, Math.floor((width - gap * (cols - 1)) / cols));

  const tap = () => {
    if (Platform.OS !== 'web') Haptics.selectionAsync();
  };

  const pick = async (from: 'library' | 'camera') => {
    tap();
    const uri = await pickAvatarPhoto(from);
    if (uri) onChange(PHOTO_AVATAR, uri);
  };

  return (
    <View>
      <View className="flex-row flex-wrap" style={{ gap, width: size * cols + gap * (cols - 1), alignSelf: 'center' }}>
        {AVATARS.map((a) => {
          const selected = value === a.id;
          return (
            <Pressable
              key={a.id}
              onPress={() => {
                tap();
                onChange(a.id, null);
              }}
              accessibilityRole="button"
              accessibilityLabel={a.label}
              accessibilityState={{ selected }}
              style={({ pressed }) => ({
                borderRadius: size / 2 + 4,
                padding: 3,
                borderWidth: 3,
                borderColor: selected ? UI.fox : 'transparent',
                transform: [{ scale: pressed ? 0.94 : 1 }],
              })}>
              <ChildAvatar avatar={a.id} size={size - 12} />
            </Pressable>
          );
        })}
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 20 }}>
        {value === PHOTO_AVATAR && photoUri ? (
          <View
            style={{
              borderRadius: 999,
              padding: 3,
              borderWidth: 3,
              borderColor: UI.fox,
            }}>
            <ChildAvatar avatar={PHOTO_AVATAR} photoUri={photoUri} size={44} />
          </View>
        ) : null}
        <PhotoButton icon="image" label="Z galerii" onPress={() => void pick('library')} />
        <PhotoButton icon="camera" label="Zrób zdjęcie" onPress={() => void pick('camera')} />
      </View>
      <Text style={{ color: UI.pageFaint, fontFamily: 'Lexend', fontSize: 12, lineHeight: 17, marginTop: 8 }}>
        Zdjęcie zostaje tylko na tym telefonie — nie wysyłamy go nigdzie.
      </Text>
    </View>
  );
}

function PhotoButton({ icon, label, onPress }: { icon: 'image' | 'camera'; label: string; onPress: () => void }) {
  // Bez `className` — w połączeniu ze stylem-funkcją Pressable gubił tło
  // i przycisk wyglądał jak goły napis.
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => ({
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingVertical: 15,
        borderRadius: 20,
        backgroundColor: UI.page,
        borderWidth: 2,
        borderColor: UI.pageSlot,
        boxShadow: pressed ? 'none' : `0px 4px 0px ${UI.pageSlot}`,
        transform: [{ translateY: pressed ? 4 : 0 }],
      })}>
      <Icon name={icon} size={22} color={INK} strokeWidth={2.4} />
      <Text style={{ color: INK, fontFamily: 'Gabarito-Bold', fontSize: 17 }}>{label}</Text>
    </Pressable>
  );
}
