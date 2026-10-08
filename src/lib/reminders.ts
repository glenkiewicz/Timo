import * as Notifications from 'expo-notifications';

/** Codzienne przypomnienie o Wyprawie Dnia — lokalne, bez serwera. */
const REMINDER_HOUR = 17;

/**
 * Pyta o zgodę i ustawia jedno codzienne powiadomienie. Zwraca, czy się
 * udało — odmowa w systemowym okienku nie jest błędem, onboarding idzie dalej.
 */
export async function enableDailyReminder(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  const status = current.granted
    ? current
    : await Notifications.requestPermissionsAsync({
        ios: { allowAlert: true, allowSound: true, allowBadge: false },
      });
  if (!status.granted) return false;

  await Notifications.cancelAllScheduledNotificationsAsync();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Timo czeka!',
      body: 'Nowa Wyprawa Dnia już gotowa. Zgadniemy razem zwierzę?',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: REMINDER_HOUR,
      minute: 0,
    },
  });
  return true;
}
