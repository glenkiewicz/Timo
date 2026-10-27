import { Alert } from 'react-native';

import { STORE } from '@/config/store';
import { useAuthStore } from '@/lib/stores/auth-store';

/**
 * Usunięcie konta z potwierdzeniem — wspólne dla ekranu „Kto gra?”
 * i „Dla rodzica”, żeby oba mówiły rodzicowi to samo (wytyczna Apple 5.1.1(v):
 * usunięcie konta dostępne w aplikacji).
 */
export function confirmDeleteAccount(): void {
  Alert.alert(
    'Usunąć konto?',
    `Znikną wszystkie profile dzieci, kolekcje, odznaki i postęp — na tym telefonie i na serwerze. Tego nie da się cofnąć.\n\nSubskrypcję (jeśli jest) anulujesz osobno ${STORE.cancelPath}.`,
    [
      { text: 'Anuluj', style: 'cancel' },
      {
        text: 'Usuń konto',
        style: 'destructive',
        onPress: () => {
          void useAuthStore
            .getState()
            .deleteAccount()
            .then((ok) => {
              if (!ok) Alert.alert('Nie udało się usunąć konta', 'Sprawdź połączenie z internetem i spróbuj jeszcze raz.');
            });
        },
      },
    ],
  );
}
