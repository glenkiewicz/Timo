import { useMemo, useState } from 'react';

import { AnimalImage } from '@/components/collection/AnimalImage';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Field } from '@/components/ui/Field';
import { ANIMALS, ANIMALS_BY_ID } from '@/data/animals';
import { scoreAnimal } from '@/features/game/guessing-engine';
import { SHADOW, UI } from '@/theme/ui';
import type { Animal, GameAnswer } from '@/types/game';
import { Pressable, Text, View } from '@/tw';

const SUGGESTIONS = 9;
const SEARCH_LIMIT = 24;
const COLUMNS = 3;

type AnimalRevealProps = {
  /** Odpowiedzi rundy — po nich rankujemy podpowiedzi. */
  answers: GameAnswer[];
  /** Ograniczenie puli do rosteru wyprawy; brak = cała baza. */
  poolIds?: string[];
  onPick: (animalId: string) => void;
  onSkip: () => void;
};

/**
 * „Powiedz Timo, co to było" — krok po poddaniu się lisa.
 *
 * Wszystkie kwestie poddania w `timo-lines.ts` kończą się pytaniem do dziecka
 * („Powiedz mi, kogo wymyśliłeś?"), ale dziecko nie miało jak odpowiedzieć.
 * Ten komponent domyka tę obietnicę, a przy okazji naprawia brak sprawczości:
 * wskazane zwierzę wpada do kolekcji, więc zbiór przestaje rosnąć wyłącznie
 * wtedy, gdy trafi Timo.
 *
 * Podpowiedzi rankuje `scoreAnimal` z silnika zgadywania — ta sama funkcja,
 * której Timo używa do typowania, ale puszczona po CAŁEJ puli, z pominięciem
 * twardych wykluczeń. To właśnie one zgubiły odpowiedź: jedno wahnięcie przy
 * „czy ma futro?" wycina zwierzę na stałe i nic go nie przywraca.
 */
export function AnimalReveal({ answers, poolIds, onPick, onSkip }: AnimalRevealProps) {
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');

  const suggestions = useMemo(() => {
    const pool = poolIds
      ? poolIds.map((id) => ANIMALS_BY_ID[id]).filter(Boolean)
      : ANIMALS;
    return [...pool]
      .map((animal) => ({ animal, score: scoreAnimal(animal, answers) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, SUGGESTIONS)
      .map((entry) => entry.animal);
  }, [answers, poolIds]);

  const results = useMemo(() => {
    const q = normalise(query.trim());
    if (q.length < 2) return [];
    return ANIMALS.filter((a) => normalise(a.name_pl).includes(q)).slice(0, SEARCH_LIMIT);
  }, [query]);

  const shown = searching ? results : suggestions;

  return (
    <View style={{ alignSelf: 'stretch' }}>
      <Card padding={16}>
        <Text
          className="text-center"
          style={{
            color: UI.textFaint,
            fontFamily: 'Gabarito-Bold',
            fontSize: 11,
            letterSpacing: 1.2,
            marginBottom: 4,
          }}>
          POKAŻ TIMO, KOGO WYMYŚLIŁEŚ
        </Text>
        <Text
          className="text-center"
          style={{
            color: UI.textSoft,
            fontFamily: 'Lexend',
            fontSize: 13,
            lineHeight: 19,
            marginBottom: 14,
          }}>
          {searching
            ? 'Wpisz nazwę zwierzęcia.'
            : 'Timo typuje, że to ktoś z nich — a jeśli nie, poszukaj.'}
        </Text>

        {searching ? (
          <View style={{ marginBottom: 12 }}>
            <Field
              label="Szukaj zwierzęcia"
              value={query}
              onChangeText={setQuery}
              autoFocus
              placeholder="np. borsuk"
            />
          </View>
        ) : null}

        {rows(shown).map((row, ri) => (
          <View
            key={ri}
            className="flex-row"
            style={{ gap: 10, marginTop: ri > 0 ? 10 : 0 }}>
            {row.map((animal) => (
              <View key={animal.id} style={{ flex: 1 }}>
                <AnimalTile animal={animal} onPress={() => onPick(animal.id)} />
              </View>
            ))}
            {Array.from({ length: COLUMNS - row.length }).map((_, i) => (
              <View key={`fill-${i}`} style={{ flex: 1 }} />
            ))}
          </View>
        ))}

        {searching && query.trim().length >= 2 && results.length === 0 ? (
          <Text
            className="text-center"
            style={{
              color: UI.textSoft,
              fontFamily: 'Lexend-Bold',
              fontSize: 13,
              paddingVertical: 18,
            }}>
            Nie znam takiego zwierzęcia.
          </Text>
        ) : null}

        <View style={{ marginTop: 14, gap: 8 }}>
          <Button
            label={searching ? 'Wróć do podpowiedzi' : 'To żadne z nich — szukaj'}
            variant="sky"
            size="md"
            onPress={() => {
              setSearching((v) => !v);
              setQuery('');
            }}
          />
          <Button label="Nie pamiętam" variant="ghost" size="md" onPress={onSkip} />
        </View>
      </Card>
    </View>
  );
}

function AnimalTile({ animal, onPress }: { animal: Animal; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={animal.name_pl}
      style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.96 : 1 }] })}>
      <View style={{ alignItems: 'center' }}>
        <View
          style={{
            width: '100%',
            aspectRatio: 1,
            borderRadius: 18,
            backgroundColor: UI.sunken,
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            boxShadow: SHADOW.e0,
          }}>
          <AnimalImage animalId={animal.id} fill />
        </View>
        <Text
          className="text-center"
          numberOfLines={2}
          style={{
            color: UI.text,
            fontFamily: 'Gabarito-Bold',
            fontSize: 11,
            lineHeight: 14,
            marginTop: 5,
          }}>
          {animal.name_pl}
        </Text>
      </View>
    </Pressable>
  );
}

/** Wiersze po `COLUMNS` — równe kolumny robi `flex: 1` w wierszu. */
function rows(items: Animal[]): Animal[][] {
  const out: Animal[][] = [];
  for (let i = 0; i < items.length; i += COLUMNS) {
    out.push(items.slice(i, i + COLUMNS));
  }
  return out;
}

/** Bez ogonków i wielkości liter — pięciolatek nie trafi w „ś". */
function normalise(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ł/g, 'l');
}
