import { Directory, File, Paths } from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';

/**
 * Zdjęcie dziecka jako awatar — ZOSTAJE NA TELEFONIE. Na serwer idzie tylko
 * znacznik `photo` w `profiles.avatar`; plik leży w dokumentach aplikacji
 * pod id profilu. Na innym urządzeniu dziecko ma wtedy awatar domyślny —
 * to świadomy wybór: zdjęcia dzieci nie wysyłamy nigdzie.
 */
export const PHOTO_AVATAR = 'photo';

function dir(): Directory {
  const d = new Directory(Paths.document, 'avatars');
  if (!d.exists) d.create({ intermediates: true, idempotent: true });
  return d;
}

/** Wybór z galerii albo zdjęcie aparatem, przycięte do kwadratu. `null` = anulowano / brak zgody. */
export async function pickAvatarPhoto(from: 'library' | 'camera'): Promise<string | null> {
  const perm =
    from === 'camera'
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) return null;

  const options: ImagePicker.ImagePickerOptions = {
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.6,
  };
  const result =
    from === 'camera'
      ? await ImagePicker.launchCameraAsync(options)
      : await ImagePicker.launchImageLibraryAsync(options);
  if (result.canceled || !result.assets[0]) return null;
  return result.assets[0].uri;
}

/** Kopiuje wybrane zdjęcie na stałe pod id profilu. */
export function saveAvatarPhoto(profileId: string, tempUri: string): void {
  const target = new File(dir(), `${profileId}.jpg`);
  if (target.exists) target.delete();
  new File(tempUri).copy(target);
}

/** Adres zdjęcia profilu albo `null`, gdy na tym telefonie go nie ma. */
export function avatarPhotoUri(profileId: string): string | null {
  const f = new File(Paths.document, 'avatars', `${profileId}.jpg`);
  return f.exists ? f.uri : null;
}

export function deleteAvatarPhoto(profileId: string): void {
  const f = new File(Paths.document, 'avatars', `${profileId}.jpg`);
  if (f.exists) f.delete();
}
