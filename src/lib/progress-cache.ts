import AsyncStorage from '@react-native-async-storage/async-storage';

import type { SyncedProgress } from '@/lib/progress-merge';

/**
 * Kopia postępu każdego dziecka w telefonie.
 *
 * Bieżące dziecko żyje w `profile-store` (persist `timo-profile-v1`). Przy
 * zmianie dziecka jego stan trafia tutaj, pod jego id, a nowe dziecko
 * startuje ze swojej kopii — bez kasowania czegokolwiek i bez internetu.
 * Wcześniej zmiana dziecka czyściła stan i czekała na serwer; bez sieci
 * dziecko zostawało z zerami, które potem nadpisywały bazę.
 */

export type ProgressSnapshot = SyncedProgress & {
  stars: number;
  /** Postęp, którego serwer jeszcze nie ma (zmiana dziecka bez sieci). */
  dirty: boolean;
};

const PREFIX = 'timo-progress-';

export async function saveProgressSnapshot(profileId: string, snap: ProgressSnapshot): Promise<void> {
  await AsyncStorage.setItem(PREFIX + profileId, JSON.stringify(snap)).catch(() => undefined);
}

export async function loadProgressSnapshot(profileId: string): Promise<ProgressSnapshot | null> {
  try {
    const raw = await AsyncStorage.getItem(PREFIX + profileId);
    return raw ? (JSON.parse(raw) as ProgressSnapshot) : null;
  } catch {
    return null;
  }
}

/** Id dzieci, które mają kopię w telefonie. */
export async function snapshotProfileIds(): Promise<string[]> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    return keys.filter((k) => k.startsWith(PREFIX)).map((k) => k.slice(PREFIX.length));
  } catch {
    return [];
  }
}

/** Usuwa kopie — wybranych dzieci albo (bez argumentu) wszystkie. */
export async function clearProgressSnapshots(profileIds?: string[]): Promise<void> {
  const ids = profileIds ?? (await snapshotProfileIds());
  if (ids.length > 0) await AsyncStorage.multiRemove(ids.map((id) => PREFIX + id)).catch(() => undefined);
}
