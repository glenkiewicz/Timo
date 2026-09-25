import { Link } from 'expo-router';
import type { ReactNode } from 'react';
import { useWindowDimensions } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { getAnimalDetails } from '@/data/animal-details';
import { ACCENT, type Accent, SHADOW, UI } from '@/theme/ui';
import type { Animal } from '@/types/game';
import { Text, View } from '@/tw';
import { Image } from '@/tw/image';

import { HabitatMap, regionsLabel } from './HabitatMap';
import { AnimalCircle, INK, Signpost } from './map';

type Props = {
  animal: Animal;
  /** Miejsce w kolekcji (kolejność odkrycia) — opcjonalnie. */
  cardNumber?: number;
  cardTotal?: number;
  /** Tytuł wyprawy, na której odkryto — opcjonalnie. */
  discoveredOn?: string;
};

/** Poziomy margines paneli — ten sam, co siatki na półce krainy. */
const GUTTER = 16;

/**
 * Karta zwierzęcia w języku kolekcji: portret na tej samej tarczy, co na
 * półce, nazwa na drewnianej tabliczce, a wiedza na ciepłych papierowych
 * panelach leżących na tle krainy.
 *
 * Poprzednia karta (biała, z fioletowym pasem i emoji) pochodziła z UI 2.0
 * i po przejściu kolekcji na ilustrowane krainy wyglądała jak z innej gry.
 * Emoji wypadły całkiem — systemowy krój obok rysunków czytał się jak usterka.
 */
export function AnimalCard({ animal, cardNumber, cardTotal, discoveredOn }: Props) {
  const { width: screenW } = useWindowDimensions();
  const d = getAnimalDetails(animal);

  const disc = Math.min(screenW * 0.66, 300);
  const mapW = screenW - GUTTER * 2 - 24;

  const stats = [
    d.size_pl ? { art: ART.size, tint: 'sky' as const, label: 'Rozmiar', value: d.size_pl } : null,
    d.lifespan_pl
      ? { art: ART.lifespan, tint: 'violet' as const, label: 'Żyje', value: d.lifespan_pl }
      : null,
    d.diet_pl ? { art: ART.diet, tint: 'fox' as const, label: 'Je', value: d.diet_pl } : null,
  ].filter((s) => s !== null);

  return (
    <View>
      {/* === Portret i tabliczka === */}
      <View style={{ alignItems: 'center' }}>
        {/* Cel przejścia z kółka na półce — ta sama tarcza, tylko większa,
            więc zoom czyta się jak podniesienie figurki, nie podmiana.
            `collapsable={false}` jest konieczne: cel przyjmuje JEDNO natywne
            dziecko, a ten widok i zewnętrzny widok tarczy niosą sam układ,
            więc RN je spłaszcza. Cel dostawał wtedy tarczę i rysunek osobno,
            brał tarczę, a rysunek wyrzucał — po wejściu z półki koło było puste. */}
        <Link.AppleZoomTarget>
          <View collapsable={false}>
            <AnimalCircle animalId={animal.id} discovered size={disc} />
          </View>
        </Link.AppleZoomTarget>

        <View style={{ marginTop: -disc * 0.1 }}>
          <Signpost label={animal.name_pl} width={Math.min(screenW * 0.78, 340)} />
        </View>

        {d.tagline_pl ? (
          <Text
            className="text-center"
            style={{
              color: UI.onLawn,
              fontFamily: 'Lexend-Bold',
              fontSize: 16,
              marginTop: 8,
              paddingHorizontal: 24,
              ...ON_ART,
            }}>
            {d.tagline_pl}
          </Text>
        ) : null}

        {discoveredOn || cardNumber ? (
          <View
            className="flex-row items-center"
            style={{
              gap: 6,
              marginTop: 10,
              paddingHorizontal: 12,
              paddingVertical: 5,
              borderRadius: 999,
              backgroundColor: 'rgba(28, 32, 20, 0.42)',
            }}>
            <Icon name="award" size={14} color={UI.onLawn} strokeWidth={2.6} />
            <Text style={{ color: UI.onLawn, fontFamily: 'Gabarito-Bold', fontSize: 13 }}>
              {[
                discoveredOn ? `Odkryte: ${discoveredOn}` : null,
                cardNumber && cardTotal ? `${cardNumber} z ${cardTotal}` : null,
              ]
                .filter(Boolean)
                .join('  ·  ')}
            </Text>
          </View>
        ) : null}

        {/* Cechy to krótkie hasła, nie zdania — zostają pigułkami na tle
            zamiast dostawać własne wiersze. */}
        {d.chips.length > 0 ? (
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 6,
              marginTop: 10,
              paddingHorizontal: GUTTER,
            }}>
            {d.chips.map((c) => (
              <View
                key={c.label}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 5,
                  borderRadius: 999,
                  backgroundColor: 'rgba(255,255,255,0.85)',
                }}>
                <Text style={{ color: INK, fontFamily: 'Gabarito-Bold', fontSize: 13 }}>
                  {c.label}
                </Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>

      {/* === Liczby === */}
      {stats.length > 0 ? (
        <>
          <SectionHeader title="O zwierzęciu" />
          {stats.map((s) => (
            <Row key={s.label} blob={<ArtBlob art={s.art} tint={s.tint} />}>
              <Text style={{ color: UI.pageFaint, fontFamily: 'Gabarito-Bold', fontSize: 13 }}>
                {s.label}
              </Text>
              <Text style={ROW_TEXT}>{s.value}</Text>
            </Row>
          ))}
        </>
      ) : null}

      {/* === Czy wiesz? === */}
      {d.facts_pl.length > 0 ? (
        <>
          <SectionHeader title="Czy wiesz?" />
          {d.facts_pl.map((fact, i) => (
            <Row key={i} blob={<NumberBlob n={i + 1} />}>
              <Text style={ROW_TEXT}>{fact}</Text>
            </Row>
          ))}
        </>
      ) : null}

      {/* === Gdzie spotkasz === */}
      <SectionHeader title="Gdzie spotkasz" />
      <View style={[CARD, { padding: 12, alignItems: 'center' }]}>
        <View style={{ borderRadius: 18, overflow: 'hidden' }}>
          <HabitatMap regions={d.map_regions} width={mapW} />
        </View>
        <Text
          className="text-center"
          style={{ color: INK, fontFamily: 'Gabarito-Bold', fontSize: 16, marginTop: 12 }}>
          {regionsLabel(d.map_regions)}
        </Text>
        <Text
          className="text-center"
          style={{
            color: UI.pageFaint,
            fontFamily: 'Lexend',
            fontSize: 13,
            lineHeight: 18,
            marginTop: 2,
            marginBottom: 4,
            paddingHorizontal: 8,
          }}>
          {d.habitat_pl}
        </Text>
      </View>
    </View>
  );
}

/** Biały napis wprost na ilustracji — cień jak pod nazwami na półce. */
const ON_ART = {
  textShadowColor: 'rgba(0,0,0,0.55)',
  textShadowRadius: 4,
} as const;

/**
 * Wiersz jak w Finchu: każda informacja osobno, z obrazkiem w miękkiej
 * plamie po lewej i tekstem po prawej. Dziecko czyta jedną rzecz naraz,
 * zamiast rozbierać wzrokiem jeden gęsty panel.
 */
const CARD = {
  marginHorizontal: GUTTER,
  marginBottom: 10,
  borderRadius: 28,
  backgroundColor: UI.page,
  boxShadow: `${SHADOW.e1}, ${SHADOW.rim}`,
} as const;

const ROW_TEXT = {
  color: INK,
  fontFamily: 'Lexend-Bold',
  fontSize: 15,
  lineHeight: 21,
} as const;

const BLOB = 60;

function Row({ blob, children }: { blob: ReactNode; children: ReactNode }) {
  return (
    <View
      className="flex-row items-center"
      style={[CARD, { padding: 12, paddingRight: 18, gap: 14, minHeight: BLOB + 24 }]}>
      {blob}
      <View style={{ flex: 1 }}>{children}</View>
    </View>
  );
}

/** Plama pod obrazkiem wiersza — zaokrąglony kwadrat, nie koło, jak w Finchu. */
function Blob({ background, children }: { background: string; children: ReactNode }) {
  return (
    <View
      style={{
        width: BLOB,
        height: BLOB,
        borderRadius: 24,
        backgroundColor: background,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {children}
    </View>
  );
}

/**
 * Ilustracje wierszy — ten sam generator i styl, co ikony doku i wypraw.
 * Kreskowe ikony SVG wyglądały przy rysunkach zwierząt jak z innej aplikacji.
 */
const ART = {
  size: require('../../../assets/icons/card/size.png'),
  lifespan: require('../../../assets/icons/card/lifespan.png'),
  diet: require('../../../assets/icons/card/diet.png'),
} as const;

function ArtBlob({ art, tint }: { art: number; tint: Accent }) {
  return (
    <Blob background={ACCENT[tint].pale}>
      <Image
        source={art}
        style={{ width: BLOB * 0.8, height: BLOB * 0.8 }}
        contentFit="contain"
        transition={0}
        accessible={false}
      />
    </Blob>
  );
}

function NumberBlob({ n }: { n: number }) {
  return (
    <Blob background={UI.goldPale}>
      <Text style={{ color: UI.goldDeep, fontFamily: 'Gabarito-Bold', fontSize: 26 }}>{n}</Text>
    </Blob>
  );
}

/** Nagłówek sekcji wprost na tle — biały napis i cienka linia do krawędzi. */
function SectionHeader({ title }: { title: string }) {
  return (
    <View
      className="flex-row items-center"
      style={{ marginHorizontal: GUTTER + 6, marginTop: 22, marginBottom: 10, gap: 12 }}>
      <Text style={{ color: UI.onLawn, fontFamily: 'Gabarito-Bold', fontSize: 18, ...ON_ART }}>
        {title}
      </Text>
      <View style={{ flex: 1, height: 2, borderRadius: 1, backgroundColor: 'rgba(255,255,255,0.55)' }} />
    </View>
  );
}
