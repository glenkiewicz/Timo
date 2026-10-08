import * as Haptics from 'expo-haptics';
import { useMemo, useState } from 'react';
import { Modal, Platform } from 'react-native';

import { INK } from '@/components/collection/map';
import { SHADOW, UI } from '@/theme/ui';
import { Pressable, Text, View } from '@/tw';

/**
 * Bramka rodzicielska — Apple wymaga jej w aplikacjach dla dzieci przed
 * zakupem, linkiem na zewnątrz i zmianą ustawień konta. Mnożenie liczb
 * zapisanych SŁOWAMI: przedszkolak tego nie przeczyta ani nie policzy,
 * a dorosły odpowiada w sekundę.
 */
const WORDS = ['', '', 'dwa', 'trzy', 'cztery', 'pięć', 'sześć', 'siedem', 'osiem', 'dziewięć'];

function question() {
  const a = 3 + Math.floor(Math.random() * 7);
  const b = 3 + Math.floor(Math.random() * 7);
  const answer = a * b;
  const wrong = new Set<number>();
  while (wrong.size < 3) {
    const w = answer + (Math.floor(Math.random() * 13) - 6);
    if (w !== answer && w > 0) wrong.add(w);
  }
  const options = [...wrong, answer].sort(() => Math.random() - 0.5);
  return { text: `${WORDS[a]} razy ${WORDS[b]}`, answer, options };
}

export function ParentalGate({
  visible,
  onPass,
  onCancel,
}: {
  visible: boolean;
  onPass: () => void;
  onCancel: () => void;
}) {
  const [seed, setSeed] = useState(0);
  const [wrong, setWrong] = useState(false);
  // Nowe pytanie przy każdym otwarciu i po każdej pomyłce.
  const q = useMemo(() => question(), [seed, visible]); // eslint-disable-line react-hooks/exhaustive-deps

  const pick = (n: number) => {
    if (n === q.answer) {
      setWrong(false);
      onPass();
      return;
    }
    if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    setWrong(true);
    setSeed((s) => s + 1);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={{ flex: 1, backgroundColor: 'rgba(28, 32, 20, 0.55)', justifyContent: 'center', padding: 24 }}>
        <View
          style={{
            alignSelf: 'center',
            width: '100%',
            maxWidth: 420,
            backgroundColor: UI.page,
            borderRadius: 28,
            padding: 22,
            boxShadow: `${SHADOW.e2}, ${SHADOW.rim}`,
          }}>
          <Text className="text-center" style={{ color: INK, fontFamily: 'Gabarito-Bold', fontSize: 22 }}>
            Pytanie dla dorosłego
          </Text>
          <Text
            className="text-center"
            style={{ color: UI.pageFaint, fontFamily: 'Lexend', fontSize: 15, lineHeight: 21, marginTop: 6 }}>
            Ile to jest {q.text}?
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 18 }}>
            {q.options.map((n) => (
              <Pressable
                key={n}
                onPress={() => pick(n)}
                accessibilityRole="button"
                style={({ pressed }) => ({
                  flexBasis: '47%',
                  flexGrow: 1,
                  paddingVertical: 16,
                  borderRadius: 18,
                  alignItems: 'center',
                  backgroundColor: UI.pageSlot,
                  transform: [{ scale: pressed ? 0.96 : 1 }],
                })}>
                <Text style={{ color: INK, fontFamily: 'Gabarito-Bold', fontSize: 22 }}>{n}</Text>
              </Pressable>
            ))}
          </View>
          {wrong ? (
            <Text
              className="text-center"
              style={{ color: UI.dangerDeep, fontFamily: 'Lexend-Bold', fontSize: 13, marginTop: 12 }}>
              Nie tym razem — spróbuj jeszcze raz.
            </Text>
          ) : null}
          <Pressable onPress={onCancel} accessibilityRole="button" style={{ alignSelf: 'center', marginTop: 14, padding: 8 }}>
            <Text style={{ color: UI.pageFaint, fontFamily: 'Gabarito-Bold', fontSize: 16 }}>Anuluj</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
