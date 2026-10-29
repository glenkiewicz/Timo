import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

import { pickDailyFree } from '@/config/free-tier';
import { EXPEDITIONS_BY_ID, pickDailyGuided } from '@/data/expeditions';
import { animalsWord } from '@/lib/polish';
import { isPremiumNow } from '@/lib/purchases';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useProfileStore } from '@/lib/stores/profile-store';

/**
 * Codzienne przypomnienie o Wyprawie Dnia — lokalne, bez serwera.
 *
 * Zamiast jednego powtarzanego powiadomienia planujemy osobne na kolejne dni,
 * każde z inną treścią: z imieniem dziecka, wyprawą tego dnia (zestaw dnia
 * jest wyliczalny z daty), serią albo kolekcją. Plan odświeża się przy każdym
 * uruchomieniu (`refreshDailyReminder`), więc imię i liczby są aktualne.
 */
const REMINDER_HOUR = 17;
/** Na tyle dni naprzód — iOS trzyma najwyżej 64 zaplanowane powiadomienia. */
const DAYS_AHEAD = 14;
const STORAGE_KEY = 'timo-reminder-on';

type Content = { title: string; body: string };

function dateKey(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

/** Nazwa pierwszej Wyprawy Dnia danego dnia — taka sama, jaką dziecko zobaczy w Menu. */
function expeditionOfDay(d: Date): string | null {
  const key = dateKey(d);
  const ids = isPremiumNow() ? pickDailyGuided(key) : pickDailyFree(key);
  const exp = ids[0] ? EXPEDITIONS_BY_ID[ids[0]] : undefined;
  return exp ? (exp.childTitle ?? exp.title) : null;
}

/** Treść na `dayIndex`-ty dzień od dziś — co dzień inna. */
function contentFor(dayIndex: number, date: Date): Content {
  const name = useAuthStore.getState().activeProfile()?.nick.trim() || null;
  const { collection, dailyStreak } = useProfileStore.getState();
  const found = collection.length;
  const hi = (text: string) => (name ? `${name}, ${text}` : text.charAt(0).toUpperCase() + text.slice(1));
  const exp = expeditionOfDay(date);

  // Pierwsze przypomnienie przy trwającej serii — najsilniejszy powód, żeby wrócić.
  if (dayIndex <= 1 && dailyStreak >= 2) {
    return {
      title: `Seria ${dailyStreak} dni!`,
      body: hi('nie przerywaj serii — Timo czeka na Ciebie na polanie.'),
    };
  }

  const variants: Content[] = [
    exp
      ? { title: 'Wyprawa Dnia czeka!', body: hi(`dziś ruszamy na wyprawę „${exp}”. Timo już pakuje plecak!`) }
      : { title: 'Wyprawa Dnia czeka!', body: hi('nowa Wyprawa Dnia już gotowa. Timo pakuje plecak!') },
    { title: 'Timo ma zagadkę', body: hi('pomyśl o zwierzęciu — Timo spróbuje zgadnąć, kto to!') },
    found > 0
      ? {
          title: 'Kolekcja rośnie',
          // Imię w wołaczu nie jest potrzebne — „Zosia, w Twojej kolekcji…”
          // brzmi naturalnie bez odmiany, której nie umiemy zrobić z automatu.
          body: hi(`w Twojej kolekcji jest już ${found} ${animalsWord(found)}. Dziś dołączy kolejne?`),
        }
      : { title: 'Pierwsze zwierzę czeka', body: hi('zgadnij z Timo pierwsze zwierzę do swojej kolekcji!') },
    { title: 'Timo zgubił trop', body: hi('pomożesz mu odkryć, kto ukrył się w lesie?') },
  ];
  return variants[dayIndex % variants.length];
}

/** Planuje powiadomienia na najbliższe dni; poprzednie znikają. */
async function schedule(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  const now = new Date();
  const first = new Date(now);
  first.setHours(REMINDER_HOUR, 0, 0, 0);
  // Dziś po 17:00 — zaczynamy od jutra.
  if (first <= now) first.setDate(first.getDate() + 1);

  for (let i = 0; i < DAYS_AHEAD; i++) {
    const date = new Date(first);
    date.setDate(first.getDate() + i);
    await Notifications.scheduleNotificationAsync({
      content: contentFor(i, date),
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date },
    });
  }
}

/**
 * Pyta o zgodę i włącza przypomnienia. Zwraca, czy się udało — odmowa
 * w systemowym okienku nie jest błędem, onboarding idzie dalej.
 */
export async function enableDailyReminder(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  const status = current.granted
    ? current
    : await Notifications.requestPermissionsAsync({
        ios: { allowAlert: true, allowSound: true, allowBadge: false },
      });
  if (!status.granted) return false;
  await AsyncStorage.setItem(STORAGE_KEY, '1');
  await schedule();
  return true;
}

/** Czy przypomnienia są włączone (ekran „Dla rodzica”). */
export async function isDailyReminderOn(): Promise<boolean> {
  if ((await AsyncStorage.getItem(STORAGE_KEY)) === '1') return true;
  // Wersje sprzed tej zmiany planowały jedno codzienne powiadomienie bez flagi.
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  return scheduled.length > 0;
}

/** Wyłącza przypomnienia. */
export async function disableDailyReminder(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * Odświeża plan przy uruchomieniu: kolejne dni, aktualne imię, seria
 * i kolekcja. Nic nie robi, gdy rodzic przypomnień nie włączył albo cofnął
 * zgodę w ustawieniach telefonu.
 */
export async function refreshDailyReminder(): Promise<void> {
  try {
    if (!(await isDailyReminderOn())) return;
    const perm = await Notifications.getPermissionsAsync();
    if (!perm.granted) return;
    await AsyncStorage.setItem(STORAGE_KEY, '1');
    await schedule();
  } catch {
    /* przypomnienie to dodatek — jego błąd nie może zatrzymać gry */
  }
}
