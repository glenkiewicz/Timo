import { Image } from 'expo-image';
import { useState } from 'react';
import { View } from 'react-native';
import Svg, { Circle, G, Path, Rect, Text as SvgText } from 'react-native-svg';

import type { MapRegion } from '@/data/animal-details';

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

/** Centroidy regionów w przestrzeni viewBox 1920×1152. */
const REGION_CENTERS: Partial<Record<MapRegion, { x: number; y: number }>> = {
  'america-n': { x: 380, y: 400 },
  'america-s': { x: 610, y: 860 },
  europa: { x: 1010, y: 360 },
  polska: { x: 1075, y: 380 },
  'africa-north': { x: 1060, y: 560 },
  'africa-sub': { x: 1100, y: 780 },
  'asia-cent': { x: 1450, y: 400 },
  'asia-east': { x: 1640, y: 470 },
  'asia-se': { x: 1620, y: 720 },
  australia: { x: 1700, y: 870 },
  arctic: { x: 700, y: 130 },
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

  const pointRegions: MapRegion[] = [
    'america-n',
    'america-s',
    'europa',
    'africa-north',
    'africa-sub',
    'asia-cent',
    'asia-east',
    'asia-se',
    'australia',
    'arctic',
  ];

  // Polska to punkt wewnątrz Europy — gdy aktywna, tłumimy marker Europy.
  // Analogicznie tłumimy podregiony zawarte w "większym" markerze.
  // Worldwide rysuje markery na wszystkich zamieszkałych kontynentach —
  // wtedy tłumimy pojedyncze regiony, żeby nie dublować kropek.
  const suppress = new Set<MapRegion>();
  if (active.has('polska')) suppress.add('europa');
  if (active.has('africa-sub')) suppress.add('africa-north');
  if (active.has('asia-east')) suppress.add('asia-cent');
  if (active.has('worldwide')) {
    for (const r of pointRegions) suppress.add(r);
  }

  const worldwideRegions: MapRegion[] = [
    'america-n',
    'america-s',
    'europa',
    'africa-sub',
    'asia-east',
    'australia',
  ];

  return (
    <View
      style={{
        width,
        height,
        alignSelf: 'center',
        borderRadius: 14,
        overflow: 'hidden',
        backgroundColor: imgError ? '#ffe5cc' : '#f7f3ec',
        borderWidth: 1.5,
        borderColor: '#fff6cc',
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
        {pointRegions.map((r) => {
          if (!active.has(r) || suppress.has(r)) return null;
          const c = REGION_CENTERS[r];
          if (!c) return null;
          return <Marker key={r} cx={c.x} cy={c.y} />;
        })}

        {active.has('worldwide')
          ? worldwideRegions.map((r) => {
              const c = REGION_CENTERS[r];
              if (!c) return null;
              return <Marker key={`ww-${r}`} cx={c.x} cy={c.y} />;
            })
          : null}

        {active.has('polska') ? (
          <Marker cx={REGION_CENTERS.polska!.x} cy={REGION_CENTERS.polska!.y} color={COLORS.polskaFill} />
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
              🧊  ANTARKTYDA
            </SvgText>
          </G>
        ) : null}

        {active.has('oceans') ? (
          <G>
            <Marker cx={300} cy={500} />
            <Marker cx={1380} cy={400} />
            <Marker cx={450} cy={950} />
            <Marker cx={1450} cy={950} />
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
        borderWidth: 1.5,
        borderColor: '#fff6cc',
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

export function regionsLabel(regions: MapRegion[]): string {
  if (regions.length === 0) return 'różne zakątki świata';
  if (regions.includes('mythical')) return 'tylko w legendach';
  if (regions.includes('worldwide')) return 'cały świat';

  const labels: string[] = [];
  if (regions.includes('polska')) labels.push('Polska');
  if (regions.includes('europa') && !regions.includes('polska')) labels.push('Europa');
  if (regions.includes('africa-sub')) labels.push('Afryka');
  if (regions.includes('africa-north') && !regions.includes('africa-sub')) labels.push('Afryka Pn.');
  if (regions.includes('asia-east')) labels.push('Azja Wsch.');
  if (regions.includes('asia-se') && !regions.includes('asia-east')) labels.push('Azja Pd-Wsch.');
  if (regions.includes('asia-cent')) labels.push('Azja Środk.');
  if (regions.includes('america-n')) labels.push('Ameryka Pn.');
  if (regions.includes('america-s')) labels.push('Ameryka Pd.');
  if (regions.includes('australia')) labels.push('Australia');
  if (regions.includes('arctic')) labels.push('Arktyka');
  if (regions.includes('antarctica')) labels.push('Antarktyda');
  if (regions.includes('oceans')) labels.push('wszystkie oceany');

  if (labels.length === 0) return 'różne zakątki świata';
  return labels.join(' · ');
}
