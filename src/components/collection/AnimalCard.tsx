import { getAnimalDetails } from '@/data/animal-details';
import type { Animal } from '@/types/game';
import { ScrollView, Text, View } from '@/tw';

import { AnimalImage } from './AnimalImage';
import { HabitatMap, regionsLabel } from './HabitatMap';

type Props = {
  animal: Animal;
  /** Pokaż banner "Nowe odkrycie!" nad nazwą. */
  isNewDiscovery?: boolean;
};

export function AnimalCard({ animal, isNewDiscovery }: Props) {
  const d = getAnimalDetails(animal);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 8 }}>
      {isNewDiscovery ? (
        <View
          className="bg-success rounded-chip self-center mb-2"
          style={{ paddingHorizontal: 12, paddingVertical: 4 }}>
          <Text
            className="text-paper"
            style={{
              fontFamily: 'Fredoka-Bold',
              fontSize: 11,
              letterSpacing: 1.2,
            }}>
            🆕  NOWE ODKRYCIE!
          </Text>
        </View>
      ) : null}

      {/* hero */}
      <View className="items-center mb-1">
        <AnimalImage animalId={animal.id} fallbackEmoji={animal.emoji} size={140} />
      </View>
      <Text
        className="text-ink text-center"
        style={{ fontFamily: 'Fredoka-Bold', fontSize: 26 }}>
        {animal.name_pl}
      </Text>
      {d.tagline_pl ? (
        <Text
          className="text-brand-deep text-center"
          style={{
            fontFamily: 'Nunito-Bold',
            fontSize: 13,
            marginTop: 2,
            fontStyle: 'italic',
          }}>
          {d.tagline_pl}
        </Text>
      ) : null}

      {/* chipy faktów (z atrybutów) */}
      {d.chips.length > 0 ? (
        <View
          className="flex-row flex-wrap justify-center mt-3"
          style={{ gap: 6 }}>
          {d.chips.map((c) => (
            <View
              key={c.label}
              className="bg-paper-light rounded-chip"
              style={{
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderWidth: 1.5,
                borderColor: '#fff6cc',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
              }}>
              <Text style={{ fontSize: 12 }}>{c.emoji}</Text>
              <Text
                className="text-ink"
                style={{ fontFamily: 'Fredoka-Bold', fontSize: 11 }}>
                {c.label}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      {/* dane strukturalne */}
      {d.size_pl || d.lifespan_pl || d.diet_pl ? (
        <View
          className="bg-paper-light rounded-card mt-4"
          style={{
            paddingHorizontal: 14,
            paddingVertical: 12,
            borderWidth: 1.5,
            borderColor: '#fff6cc',
            gap: 6,
          }}>
          {d.size_pl ? <FactRow emoji="📏" text={d.size_pl} /> : null}
          {d.lifespan_pl ? <FactRow emoji="⏳" text={d.lifespan_pl} /> : null}
          {d.diet_pl ? <FactRow emoji="🍽️" text={d.diet_pl} /> : null}
        </View>
      ) : null}

      {/* ciekawostki */}
      <View className="mt-4">
        <Text
          className="text-brand-deep"
          style={{
            fontFamily: 'Fredoka-Bold',
            fontSize: 11,
            letterSpacing: 1.2,
            marginBottom: 6,
          }}>
          💡  CZY WIESZ?
        </Text>
        <View style={{ gap: 6 }}>
          {d.facts_pl.map((fact, i) => (
            <View key={i} style={{ flexDirection: 'row', gap: 6 }}>
              <Text
                className="text-brand-deep"
                style={{ fontFamily: 'Fredoka-Bold', fontSize: 14 }}>
                •
              </Text>
              <Text
                className="text-ink-soft"
                style={{
                  fontFamily: 'Nunito',
                  fontSize: 14,
                  lineHeight: 20,
                  flex: 1,
                }}>
                {fact}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* mapa */}
      <View className="mt-4">
        <Text
          className="text-brand-deep"
          style={{
            fontFamily: 'Fredoka-Bold',
            fontSize: 11,
            letterSpacing: 1.2,
            marginBottom: 6,
          }}>
          🗺️  GDZIE SPOTKASZ
        </Text>
        <HabitatMap regions={d.map_regions} width={300} />
        <Text
          className="text-ink text-center mt-2"
          style={{ fontFamily: 'Fredoka-Bold', fontSize: 13 }}>
          {regionsLabel(d.map_regions)}
        </Text>
        <Text
          className="text-ink-soft text-center"
          style={{ fontFamily: 'Nunito', fontSize: 12, marginTop: 2 }}>
          {d.habitat_pl}
        </Text>
      </View>
    </ScrollView>
  );
}

function FactRow({ emoji, text }: { emoji: string; text: string }) {
  return (
    <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-start' }}>
      <Text style={{ fontSize: 14, lineHeight: 20 }}>{emoji}</Text>
      <Text
        className="text-ink"
        style={{
          fontFamily: 'Nunito-Bold',
          fontSize: 13,
          lineHeight: 20,
          flex: 1,
        }}>
        {text}
      </Text>
    </View>
  );
}
