import { Link } from 'expo-router';

import { Icon } from '@/components/ui/Icon';
import { getAnimalDetails } from '@/data/animal-details';
import { UI } from '@/theme/ui';
import type { Animal } from '@/types/game';
import { Text, View } from '@/tw';

import { AnimalImage } from './AnimalImage';
import { HabitatMap, regionsLabel } from './HabitatMap';

type Props = {
  animal: Animal;
  /** Numerek karty 23/500 (kolejność odkrycia w kolekcji) — opcjonalnie. */
  cardNumber?: number;
  cardTotal?: number;
  /** Tytuł wyprawy, na której odkryto — opcjonalnie. */
  discoveredOn?: string;
};

/**
 * Karta zwierzęcia w stylu TCG (trading card game) — kolekcjonerska, ale
 * utrzymana w płaskiej palecie UI 2.0: biała powierzchnia, kolorowe pasy
 * sekcji, wyraźne obramowania zamiast cieni.
 */
export function AnimalTradingCard({
  animal,
  cardNumber,
  cardTotal,
  discoveredOn,
}: Props) {
  const d = getAnimalDetails(animal);

  return (
    <View>
      {/* === KARTA === */}
      <View
        className="mx-4 mb-4"
        style={{
          backgroundColor: UI.surface,
          borderRadius: 22,
          borderWidth: 2,
          borderBottomWidth: 4,
          borderColor: UI.line,
          overflow: 'hidden',
        }}>
        {/* === Górny pas — nazwa + numer === */}
        <View
          style={{
            backgroundColor: UI.violet,
            paddingHorizontal: 14,
            paddingVertical: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View className="flex-row items-center" style={{ gap: 8 }}>
            <Text style={{ fontSize: 20 }}>{animal.emoji}</Text>
            <Text
              style={{
                color: UI.surface,
                fontFamily: 'Gabarito-Bold',
                fontSize: 18,
                letterSpacing: 0.5,
              }}>
              {animal.name_pl.toUpperCase()}
            </Text>
          </View>
          {cardNumber && cardTotal ? (
            <View
              className="rounded-pill"
              style={{
                backgroundColor: UI.surface,
                paddingHorizontal: 10,
                paddingVertical: 3,
              }}>
              <Text
                style={{
                  color: UI.violetDeep,
                  fontFamily: 'Gabarito-Bold',
                  fontSize: 11,
                }}>
                #{String(cardNumber).padStart(3, '0')} / {cardTotal}
              </Text>
            </View>
          ) : null}
        </View>

        {/* === Hero zdjęcie === */}
        <View
          className="items-center justify-center"
          style={{
            backgroundColor: UI.sunken,
            paddingVertical: 18,
            paddingHorizontal: 12,
          }}>
          <Link.AppleZoomTarget>
            <View
              style={{
                borderWidth: 2,
                borderColor: UI.line,
                borderRadius: 16,
                padding: 4,
                backgroundColor: UI.surface,
              }}>
              <AnimalImage
                animalId={animal.id}
                fallbackEmoji={animal.emoji}
                size={220}
              />
            </View>
          </Link.AppleZoomTarget>
        </View>

        {/* === Tagline === */}
        {d.tagline_pl ? (
          <View
            style={{
              paddingHorizontal: 14,
              paddingVertical: 10,
              alignItems: 'center',
              borderTopWidth: 2,
              borderTopColor: UI.line,
            }}>
            <Text
              style={{
                color: UI.violetDeep,
                fontFamily: 'Lexend-Bold',
                fontSize: 14,
                fontStyle: 'italic',
              }}>
              „{d.tagline_pl}"
            </Text>
          </View>
        ) : null}

        {/* === Pas statystyk — 3 komórki obok siebie === */}
        {d.size_pl || d.lifespan_pl || d.diet_pl ? (
          <View
            style={{
              flexDirection: 'row',
              borderTopWidth: 2,
              borderTopColor: UI.line,
              paddingVertical: 12,
            }}>
            {d.size_pl ? (
              <StatCell emoji="📏" label="ROZMIAR" value={d.size_pl} />
            ) : null}
            {d.lifespan_pl ? (
              <StatCell emoji="⏳" label="ŻYJE" value={d.lifespan_pl} />
            ) : null}
            {d.diet_pl ? (
              <StatCell emoji="🍽️" label="JE" value={d.diet_pl} last />
            ) : null}
          </View>
        ) : null}

        {/* === Chipy cech === */}
        {d.chips.length > 0 ? (
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 6,
              padding: 12,
              borderTopWidth: 2,
              borderTopColor: UI.line,
              justifyContent: 'center',
            }}>
            {d.chips.map((c) => (
              <View
                key={c.label}
                className="rounded-pill"
                style={{
                  backgroundColor: UI.sunken,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderWidth: 2,
                  borderColor: UI.line,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                }}>
                <Text style={{ fontSize: 12 }}>{c.emoji}</Text>
                <Text
                  style={{
                    color: UI.text,
                    fontFamily: 'Gabarito-Bold',
                    fontSize: 11,
                  }}>
                  {c.label}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* === Dolny pas — odkryte na wyprawie === */}
        {discoveredOn ? (
          <View
            style={{
              backgroundColor: UI.primaryPale,
              paddingHorizontal: 14,
              paddingVertical: 9,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}>
            <Icon name="award" size={14} color={UI.primaryDeep} strokeWidth={2.6} />
            <Text
              style={{
                color: UI.primaryDeep,
                fontFamily: 'Gabarito-Bold',
                fontSize: 11,
                letterSpacing: 0.8,
              }}>
              ODKRYTE NA: {discoveredOn.toUpperCase()}
            </Text>
          </View>
        ) : null}
      </View>

      {/* === Sekcja: CZY WIESZ? === */}
      <View className="mx-4 mt-2 mb-4">
        <SectionLabel
          text="CZY WIESZ?"
          emoji="💡"
          background={UI.goldPale}
          color={UI.goldDeep}
        />
        <View
          style={{
            backgroundColor: UI.surface,
            borderRadius: 20,
            padding: 14,
            borderWidth: 2,
            borderBottomWidth: 4,
            borderColor: UI.line,
            gap: 10,
          }}>
          {d.facts_pl.map((fact, i) => (
            <View
              key={i}
              style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-start' }}>
              <View
                className="rounded-pill"
                style={{
                  width: 22,
                  height: 22,
                  backgroundColor: UI.goldPale,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 1,
                }}>
                <Text
                  style={{
                    color: UI.goldDeep,
                    fontFamily: 'Gabarito-Bold',
                    fontSize: 12,
                  }}>
                  {i + 1}
                </Text>
              </View>
              <Text
                style={{
                  color: UI.text,
                  fontFamily: 'Lexend',
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

      {/* === Sekcja: GDZIE SPOTKASZ === */}
      <View className="mx-4 mb-6">
        <SectionLabel
          text="GDZIE SPOTKASZ"
          emoji="🗺️"
          background={UI.skyPale}
          color={UI.skyDeep}
        />
        <View
          className="items-center"
          style={{
            backgroundColor: UI.surface,
            borderRadius: 20,
            padding: 12,
            borderWidth: 2,
            borderBottomWidth: 4,
            borderColor: UI.line,
          }}>
          <HabitatMap regions={d.map_regions} width={300} />
          <Text
            className="text-center mt-3"
            style={{ color: UI.text, fontFamily: 'Gabarito-Bold', fontSize: 14 }}>
            {regionsLabel(d.map_regions)}
          </Text>
          <Text
            className="text-center"
            style={{
              color: UI.textSoft,
              fontFamily: 'Lexend',
              fontSize: 12,
              marginTop: 2,
              fontStyle: 'italic',
            }}>
            {d.habitat_pl}
          </Text>
        </View>
      </View>
    </View>
  );
}

function SectionLabel({
  text,
  emoji,
  background,
  color,
}: {
  text: string;
  emoji: string;
  background: string;
  color: string;
}) {
  return (
    <View className="flex-row items-center mb-2">
      <View
        className="rounded-pill flex-row items-center gap-1.5"
        style={{ backgroundColor: background, paddingHorizontal: 12, paddingVertical: 5 }}>
        <Text style={{ fontSize: 12 }}>{emoji}</Text>
        <Text
          style={{
            color,
            fontFamily: 'Gabarito-Bold',
            fontSize: 11,
            letterSpacing: 0.8,
          }}>
          {text}
        </Text>
      </View>
    </View>
  );
}

function StatCell({
  emoji,
  label,
  value,
  last = false,
}: {
  emoji: string;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 6,
        borderRightWidth: last ? 0 : 2,
        borderRightColor: UI.line,
      }}>
      <Text style={{ fontSize: 18, marginBottom: 2 }}>{emoji}</Text>
      <Text
        style={{
          color: UI.textFaint,
          fontFamily: 'Gabarito-Bold',
          fontSize: 9,
          letterSpacing: 0.8,
          marginBottom: 1,
        }}>
        {label}
      </Text>
      <Text
        className="text-center"
        numberOfLines={3}
        style={{
          color: UI.text,
          fontFamily: 'Lexend-Bold',
          fontSize: 11,
          lineHeight: 14,
        }}>
        {value}
      </Text>
    </View>
  );
}
