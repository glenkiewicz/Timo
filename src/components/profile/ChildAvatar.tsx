import { avatarSource, DEFAULT_AVATAR } from '@/data/avatars';
import { avatarPhotoUri, PHOTO_AVATAR, useAvatarPhotoVersion } from '@/lib/avatar-photo';
import { UI } from '@/theme/ui';
import { Text, View } from '@/tw';
import { Image } from '@/tw/image';

/**
 * Awatar dziecka w kółku: portret z `AVATARS`, zdjęcie z telefonu albo
 * (stare profile) emoji. Zdjęcia nie ma na innym urządzeniu — wtedy lisek.
 */
export function ChildAvatar({
  avatar,
  profileId,
  photoUri,
  size,
}: {
  avatar: string;
  profileId?: string;
  /** Zdjęcie jeszcze bez profilu (podgląd w onboardingu). */
  photoUri?: string | null;
  size: number;
}) {
  const version = useAvatarPhotoVersion((s) => s.version);
  const saved = avatar === PHOTO_AVATAR && profileId ? avatarPhotoUri(profileId) : null;
  const photo = avatar === PHOTO_AVATAR ? (photoUri ?? (saved ? `${saved}?v=${version}` : null)) : null;
  const source = photo
    ? { uri: photo }
    : (avatarSource(avatar) ?? (avatar === PHOTO_AVATAR ? avatarSource(DEFAULT_AVATAR) : null));

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        overflow: 'hidden',
        backgroundColor: UI.pageSlot,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {source ? (
        <Image source={source} style={{ width: size, height: size }} contentFit="cover" transition={0} />
      ) : (
        <Text style={{ fontSize: size * 0.58 }}>{avatar}</Text>
      )}
    </View>
  );
}
