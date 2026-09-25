import { Image } from 'expo-image';
import { useState } from 'react';
import { View } from 'react-native';
import Svg, { Circle, G, Path, Rect, Text as SvgText } from 'react-native-svg';

import type { MapRegion } from '@/data/animal-details';
import { UI } from '@/theme/ui';

type Props = {
  regions: MapRegion[];
  width?: number;
};

const MAP_W = 1920;
const MAP_H = 1152;
const ASPECT = MAP_H / MAP_W;

const WORLD_MAP = require('../../../assets/maps/world-map.jpg');

const COLORS = {
  markerFill: '#e8883c',
  markerStroke: '#ffffff',
  markerShadow: 'rgba(60, 30, 10, 0.35)',
  polskaFill: '#d4421a',
  bandLabel: '#a24d17',
  bandFill: 'rgba(232,138,60,0.35)',
};

type Point = { x: number; y: number };

/**
 * Markery regionów w przestrzeni viewBox 1920×1152 — sprawdzone na
 * `world-map.jpg` (kropka ląduje na lądzie danego regionu, oceany na wodzie).
 * Pacyfik jest na obu krawędziach mapy, więc ma dwa punkty.
 */
const REGION_MARKERS: Partial<Record<MapRegion, Point[]>> = {
  'america-n': [{ x: 380, y: 400 }],
  'america-c': [{ x: 420, y: 590 }],
  'america-s': [{ x: 630, y: 800 }],
  europa: [{ x: 970, y: 425 }],
  'africa-north': [{ x: 990, y: 585 }],
  'africa-sub': [{ x: 1040, y: 745 }],
  madagascar: [{ x: 1132, y: 815 }],
  'asia-west': [{ x: 1180, y: 590 }],
  'asia-south': [{ x: 1285, y: 625 }],
  'asia-cent': [{ x: 1420, y: 390 }],
  'asia-east': [{ x: 1480, y: 520 }],
  'asia-se': [{ x: 1440, y: 690 }],
  'new-guinea': [{ x: 1590, y: 735 }],
  australia: [{ x: 1550, y: 870 }],
  'new-zealand': [{ x: 1740, y: 960 }],
  arctic: [{ x: 700, y: 130 }],
  atlantic: [
    { x: 730, y: 500 },
    { x: 820, y: 880 },
  ],
  'pacific-e': [{ x: 220, y: 650 }],
  'pacific-w': [{ x: 1850, y: 560 }],
  indian: [{ x: 1380, y: 820 }],
};

const POLSKA: Point = { x: 1045, y: 395 };

/** Regiony, które rozwijają się w kilka innych. */
const EXPANSIONS: Partial<Record<MapRegion, MapRegion[]>> = {
  pacific: ['pacific-e', 'pacific-w'],
  oceans: ['atlantic', 'pacific-e', 'pacific-w', 'indian'],
  worldwide: ['america-n', 'america-s', 'europa', 'africa-sub', 'asia-south', 'asia-east', 'australia'],
};

type MarkerProps = {
  cx: number;
  cy: number;
  color?: string;
};

function Marker({ cx, cy, color = COLORS.markerFill }: MarkerProps) {
  return (
    <G>
      <Circle cx={cx + 4} cy={cy + 6} r={30} fill={COLORS.markerShadow} />
      <Circle cx={cx} cy={cy} r={30} fill={COLORS.markerStroke} />
      <Circle cx={cx} cy={cy} r={22} fill={color} />
      <Circle cx={cx - 6} cy={cy - 8} r={5} fill="rgba(255,255,255,0.7)" />
    </G>
  );
}

/**
 * Mapa świata z grafiką + markery na regionach (bez wypełniania konturów).
 */
export function HabitatMap({ regions, width = 320 }: Props) {
  const active = new Set(regions);
  const height = Math.round(width * ASPECT);
  const [imgError, setImgError] = useState(false);

  if (active.has('mythical')) {
    return <MythicalMap width={width} height={height} />;
  }

  // Rozwijamy zbiorcze regiony do pojedynczych markerów (Set usuwa dublety).
  const markers = new Set<MapRegion>();
  for (const r of regions) {
    for (const x of EXPANSIONS[r] ?? [r]) markers.add(x);
  }
  // Polska to czerwony punkt wewnątrz Europy — marker Europy by się z nim nakładał.
  if (active.has('polska')) markers.delete('europa');

  return (
    <View
      style={{
        width,
        height,
        alignSelf: 'center',
        borderRadius: 14,
        overflow: 'hidden',
        backgroundColor: imgError ? UI.sunken : '#f7f3ec',
        borderWidth: 2,
        borderColor: UI.line,
      }}>
      <Image
        source={WORLD_MAP}
        style={{ position: 'absolute', top: 0, left: 0, width, height }}
        contentFit="cover"
        onError={() => setImgError(true)}
      />

      <Svg
        width={width}
        height={height}
        viewBox={`0 0 ${MAP_W} ${MAP_H}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ position: 'absolute', top: 0, left: 0 }}>
        {Array.from(markers).flatMap((r) =>
          (REGION_MARKERS[r] ?? []).map((c, i) => (
            <Marker key={`${r}-${i}`} cx={c.x} cy={c.y} />
          )),
        )}

        {active.has('polska') ? (
          <Marker cx={POLSKA.x} cy={POLSKA.y} color={COLORS.polskaFill} />
        ) : null}

        {active.has('antarctica') ? (
          <G>
            <Rect
              x={0}
              y={MAP_H - 90}
              width={MAP_W}
              height={90}
              fill={COLORS.bandFill}
            />
            <SvgText
              x={MAP_W / 2}
              y={MAP_H - 35}
              fontSize={42}
              fill={COLORS.bandLabel}
              fontWeight="bold"
              textAnchor="middle">
              🧊  ANTARKTYKA
            </SvgText>
          </G>
        ) : null}
      </Svg>
    </View>
  );
}

function MythicalMap({ width, height }: { width: number; height: number }) {
  return (
    <View
      style={{
        width,
        height,
        alignSelf: 'center',
        borderRadius: 14,
        overflow: 'hidden',
        backgroundColor: '#f4e5c5',
        borderWidth: 2,
        borderColor: UI.line,
      }}>
      <Svg
        width={width}
        height={height}
        viewBox={`0 0 ${MAP_W} ${MAP_H}`}
        preserveAspectRatio="xMidYMid meet">
        <Path
          d="M 240 280 L 540 230 L 660 380 L 600 600 L 440 680 L 280 640 L 200 440 Z"
          fill="#e6d3a8"
          stroke="#8b5928"
          strokeWidth={6}
          strokeDasharray="14,14"
        />
        <Path
          d="M 920 240 L 1380 220 L 1540 400 L 1480 640 L 1260 720 L 1040 680 L 900 520 L 880 360 Z"
          fill="#e6d3a8"
          stroke="#8b5928"
          strokeWidth={6}
          strokeDasharray="14,14"
        />
        <Path
          d="M 1590 720 L 1770 700 L 1820 820 L 1740 900 L 1620 860 L 1580 780 Z"
          fill="#e6d3a8"
          stroke="#8b5928"
          strokeWidth={6}
          strokeDasharray="14,14"
        />
        <Path
          d="M 1110 400 L 1290 580 M 1290 400 L 1110 580"
          stroke="#a24d17"
          strokeWidth={28}
          strokeLinecap="round"
        />
        <SvgText
          x={MAP_W / 2}
          y={MAP_H - 80}
          fontSize={56}
          fill="#a24d17"
          textAnchor="middle"
          fontWeight="bold">
          tylko w legendach ✨
        </SvgText>
      </Svg>
    </View>
  );
}

/** Kolejność i nazwy w podpisie pod mapą. */
const REGION_LABELS: [MapRegion, string][] = [
  ['europa', 'Europa'],
  ['africa-north', 'Afryka Pn.'],
  ['africa-sub', 'Afryka'],
  ['madagascar', 'Madagaskar'],
  ['asia-west', 'Bliski Wschód'],
  ['asia-cent', 'Azja Pn. i Środk.'],
  ['asia-south', 'Indie i Azja Pd.'],
  ['asia-east', 'Azja Wsch.'],
  ['asia-se', 'Azja Pd.-Wsch.'],
  ['america-n', 'Ameryka Pn.'],
  ['america-c', 'Meksyk i Ameryka Środk.'],
  ['america-s', 'Ameryka Pd.'],
  ['new-guinea', 'Nowa Gwinea'],
  ['australia', 'Australia'],
  ['new-zealand', 'Nowa Zelandia'],
  ['arctic', 'Arktyka'],
  ['antarctica', 'Antarktyka'],
  ['atlantic', 'Atlantyk'],
  ['pacific', 'Pacyfik'],
  ['pacific-w', 'zach. Pacyfik'],
  ['pacific-e', 'wsch. Pacyfik'],
  ['indian', 'Ocean Indyjski'],
];

export function regionsLabel(regions: MapRegion[]): string {
  if (regions.length === 0) return 'różne zakątki świata';
  const has = new Set(regions);
  if (has.has('mythical')) return 'tylko w legendach';
  if (has.has('worldwide')) return has.has('polska') ? 'cały świat, także Polska' : 'cały świat';
  if (has.has('oceans')) return 'wszystkie oceany';

  const labels: string[] = [];
  if (has.has('polska')) labels.push(has.has('europa') ? 'Europa, w tym Polska' : 'Polska');
  for (const [region, label] of REGION_LABELS) {
    if (region === 'europa' && has.has('polska')) continue;
    if (has.has(region)) labels.push(label);
  }
  return labels.length > 0 ? labels.join(' · ') : 'różne zakątki świata';
}
