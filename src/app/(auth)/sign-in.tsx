import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AccountForm } from '@/components/auth/AccountForm';
import { TimoCharacter } from '@/components/timo/TimoCharacter';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/lib/stores/auth-store';
import { UI } from '@/theme/ui';
import { Pressable, Text, View } from '@/tw';

/**
 * Ekran awaryjny — gra startuje na anonimowym koncie, a tu trafia się tylko,
 * gdy nie udało się go założyć. Prawie zawsze to brak internetu przy pierwszym
 * uruchomieniu, więc najpierw mówimy to wprost i dajemy „Spróbuj ponownie”.
 * Wcześniej rodzic widział od razu formularz logowania i nie wiedział, czemu.
 */
export default function SignInScreen() {
  const [showForm, setShowForm] = useState(false);
  if (showForm) return <AccountForm variant="fallback" />;
  return <Offline onLogin={() => setShowForm(true)} />;
}

function Offline({ onLogin }: { onLogin: () => void }) {
  const insets = useSafeAreaInsets();
  const ensureSession = useAuthStore((s) => s.ensureSession);
  const [trying, setTrying] = useState(false);
  const [failed, setFailed] = useState(false);

  const retry = async () => {
    setTrying(true);
    setFailed(false);
    await ensureSession();
    // Udało się — sesja jest, przekierowanie zrobi RootLayout.
    setTrying(false);
    setFailed(!useAuthStore.getState().session);
  };

  return (
    <View
      className="flex-1 bg-canvas items-center justify-center px-8"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom + 16, gap: 12 }}>
      <TimoCharacter size={140} />
      <Text className="text-center" style={{ color: UI.text, fontFamily: 'Gabarito-Bold', fontSize: 24 }}>
        Potrzebny internet
      </Text>
      <Text
        className="text-center"
        style={{ color: UI.textSoft, fontFamily: 'Lexend', fontSize: 15, lineHeight: 22 }}>
        Przy pierwszym uruchomieniu Timo musi połączyć się z internetem. Potem gra działa też bez sieci.
      </Text>
      {failed ? (
        <Text
          className="text-center"
          style={{ color: UI.dangerDeep, fontFamily: 'Lexend-Bold', fontSize: 13 }}>
          Nadal brak połączenia. Sprawdź Wi-Fi lub dane komórkowe.
        </Text>
      ) : null}
      <View style={{ alignSelf: 'stretch', marginTop: 8 }}>
        <Button label={trying ? 'CHWILECZKĘ…' : 'SPRÓBUJ PONOWNIE'} disabled={trying} onPress={() => void retry()} />
      </View>
      <Pressable onPress={onLogin} accessibilityRole="button" style={{ padding: 10 }}>
        <Text style={{ color: UI.primaryDeep, fontFamily: 'Gabarito-Bold', fontSize: 15 }}>
          Mam konto rodzica — zaloguj się
        </Text>
      </Pressable>
    </View>
  );
}
