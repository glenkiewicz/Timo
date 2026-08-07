import { Link } from 'expo-router';

import { getAnimalDetails } from '@/data/animal-details';
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
 * Karta zwierzęcia w stylu TCG (trading card game) — Pokemon / Panini-style.
 * Pełnoekranowa, kolekcjonerska, kolorowa. Dla dzieci 5-7 lat.
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
      {/* === KARTA (TCG-style) === */}
      <View
        className="bg-paper rounded-card mx-4 mb-4"
        style={{
          borderWidth: 3,
          borderColor: '#fff6cc',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.18,
          shadowRadius: 14,
          elevation: 8,
          overflow: 'hidden',
        }}>
        {/* === Top strip — kategoria + numer === */}
        <View
          className="bg-brand"
          style={{
            paddingHorizontal: 14,
            paddingVertical: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottomWidth: 3,
            borderBottomColor: '#a24d17',
          }}>
          <View className="flex-row items-center" style={{ gap: 8 }}>
            <Text style={{ fontSize: 20 }}>{animal.emoji}</Text>
            <Text
              className="text-paper"
              style={{
                fontFamily: 'Fredoka-Bold',
                fontSize: 18,
                letterSpacing: 0.5,
              }}>
              {animal.name_pl.toUpperCase()}
            </Text>
          </View>
          {cardNumber && cardTotal ? (
            <View
              className="bg-paper rounded-chip"
              style={{ paddingHorizontal: 10, paddingVertical: 3 }}>
              <Text
                className="text-brand-deep"
                style={{ fontFamily: 'Fredoka-Bold', fontSize: 11 }}>
                #{String(cardNumber).padStart(3, '0')} / {cardTotal}
              </Text>
            </View>
          ) : null}
        </View>

        {/* === Hero zdjęcie === */}
        <View
          className="items-center justify-center"
          style={{
            backgroundColor: '#fff6cc',
            paddingVertical: 18,
            paddingHorizontal: 12,
          }}>
          <Link.AppleZoomTarget>
            <View
              style={{
                borderWidth: 3,
                borderColor: '#a24d17',
                borderRadius: 12,
                padding: 4,
                backgroundColor: '#fff1df',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.18,
                shadowRadius: 8,
                elevation: 4,
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
              backgroundColor: '#fff1df',
              paddingHorizontal: 14,
              paddingVertical: 8,
              alignItems: 'center',
            }}>
            <Text
              className="text-brand-deep"
              style={{
                fontFamily: 'Nunito-Bold',
                fontSize: 14,
                fontStyle: 'italic',
              }}>
              „{d.tagline_pl}"
            </Text>
          </View>
        ) : null}

        {/* === Stat strip — 3 ikony obok siebie === */}
        {d.size_pl || d.lifespan_pl || d.diet_pl ? (
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#fff1df',
              borderTopWidth: 2,
              borderTopColor: '#fff6cc',
              paddingVertical: 10,
            }}>
            {d.size_pl ? (
              <StatCell emoji="📏" label="ROZMIAR" value={d.size_pl} />
            ) : null}
            {d.lifespan_pl ? (
              <StatCell emoji="⏳" label="ŻYJE" value={d.lifespan_pl} />
            ) : null}
            {d.diet_pl ? (
              <StatCell emoji="🍽️" label="JE" value={d.diet_pl} />
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
              backgroundColor: '#fff1df',
              borderTopWidth: 2,
              borderTopColor: '#fff6cc',
              justifyContent: 'center',
            }}>
            {d.chips.map((c) => (
              <View
                key={c.label}
                className="bg-paper-light rounded-chip"
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderWidth: 1.5,
                  borderColor: '#a24d17',
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

        {/* === Bottom strip — odkryte na wyprawie === */}
        {discoveredOn ? (
          <View
            className="bg-brand-deep"
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}>
            <Text style={{ fontSize: 12 }}>🏆</Text>
            <Text
              className="text-paper"
              style={{
                fontFamily: 'Fredoka-Bold',
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
        <View className="flex-row items-center mb-2" style={{ gap: 6 }}>
          <View
            className="bg-reward rounded-chip"
            style={{
              paddingHorizontal: 10,
              paddingVertical: 3,
              borderWidth: 1.5,
              borderColor: '#a8730c',
            }}>
            <Text
              style={{
                fontFamily: 'Fredoka-Bold',
                fontSize: 11,
                letterSpacing: 0.8,
                color: '#33210f',
              }}>
              💡  CZY WIESZ?
            </Text>
          </View>
        </View>
        <View
          className="bg-paper rounded-card"
          style={{
            padding: 14,
            borderWidth: 1.5,
            borderColor: '#fff6cc',
            gap: 10,
          }}>
          {d.facts_pl.map((fact, i) => (
            <View
              key={i}
              style={{
                flexDirection: 'row',
                gap: 8,
                alignItems: 'flex-start',
              }}>
              <View
                className="bg-brand-pale rounded-chip"
                style={{
                  width: 22,
                  height: 22,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 1,
                }}>
                <Text
                  className="text-brand-deep"
                  style={{ fontFamily: 'Fredoka-Bold', fontSize: 12 }}>
                  {i + 1}
                </Text>
              </View>
              <Text
                className="text-ink"
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

      {/* === Sekcja: GDZIE SPOTKASZ === */}
      <View className="mx-4 mb-6">
        <View className="flex-row items-center mb-2" style={{ gap: 6 }}>
          <View
            className="bg-mystery rounded-chip"
            style={{
              paddingHorizontal: 10,
              paddingVertical: 3,
              borderWidth: 1.5,
              borderColor: '#2f6a92',
            }}>
            <Text
              className="text-paper"
              style={{
                fontFamily: 'Fredoka-Bold',
                fontSize: 11,
                letterSpacing: 0.8,
              }}>
              🗺️  GDZIE SPOTKASZ
            </Text>
          </View>
        </View>
        <View
          className="bg-paper rounded-card items-center"
          style={{
            padding: 12,
            borderWidth: 1.5,
            borderColor: '#fff6cc',
          }}>
          <HabitatMap regions={d.map_regions} width={300} />
          <Text
            className="text-ink text-center mt-3"
            style={{ fontFamily: 'Fredoka-Bold', fontSize: 14 }}>
            {regionsLabel(d.map_regions)}
          </Text>
          <Text
            className="text-ink-soft text-center"
            style={{
              fontFamily: 'Nunito',
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

function StatCell({
  emoji,
  label,
  value,
}: {
  emoji: string;
  label: string;
  value: string;
}) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 6,
        borderRightWidth: 1.5,
        borderRightColor: '#fff6cc',
      }}>
      <Text style={{ fontSize: 18, marginBottom: 2 }}>{emoji}</Text>
      <Text
        className="text-brand-deep"
        style={{
          fontFamily: 'Fredoka-Bold',
          fontSize: 9,
          letterSpacing: 0.8,
          marginBottom: 1,
        }}>
        {label}
      </Text>
      <Text
        className="text-ink text-center"
        numberOfLines={3}
        style={{
          fontFamily: 'Nunito-Bold',
          fontSize: 11,
          lineHeight: 14,
        }}>
        {value}
      </Text>
    </View>
  );
}
