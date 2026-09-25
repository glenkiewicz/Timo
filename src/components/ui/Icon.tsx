import type { ReactNode } from 'react';
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';

import { UI } from '@/theme/ui';

/**
 * Wektorowy zestaw ikon UI 2.0 — zastępuje emoji w nawigacji i statystykach.
 * Viewbox 24×24. Ikony konturowe rysują się kolorem `color` z grubością
 * `strokeWidth`, ikony pełne (flame, paw, star, heart) ignorują strokeWidth.
 */
export type IconName =
  | 'home'
  | 'map'
  | 'grid'
  | 'award'
  | 'flame'
  | 'paw'
  | 'leaf'
  | 'sound-on'
  | 'sound-off'
  | 'chevron-right'
  | 'arrow-left'
  | 'close'
  | 'lock'
  | 'check'
  | 'star'
  | 'bolt'
  | 'ruler'
  | 'hourglass'
  | 'bowl'
  | 'bulb';

type Ctx = { color: string; sw: number };

function shapes(name: IconName, { color, sw }: Ctx): ReactNode {
  const stroke = {
    stroke: color,
    strokeWidth: sw,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none',
  };

  switch (name) {
    case 'home':
      return (
        <>
          <Path d="M3.2 10.4 12 3.1l8.8 7.3" {...stroke} />
          <Path d="M5.4 9.3V19a2 2 0 0 0 2 2h9.2a2 2 0 0 0 2-2V9.3" {...stroke} />
          <Path d="M9.6 21v-5.2a2 2 0 0 1 2-2h.8a2 2 0 0 1 2 2V21" {...stroke} />
        </>
      );

    case 'map':
      return (
        <>
          <Path
            d="M2.8 5.6 9 3.3l6 2.3 5.1-1.9a.9.9 0 0 1 1.2.85v13a.9.9 0 0 1-.6.85L15 20.4 9 18.1l-5.7 2.1a.9.9 0 0 1-1.2-.85v-13a.9.9 0 0 1 .6-.85Z"
            {...stroke}
          />
          <Path d="M9 3.3v14.8" {...stroke} />
          <Path d="M15 5.6v14.8" {...stroke} />
        </>
      );

    case 'grid':
      return (
        <>
          <Rect x={3} y={3} width={7.6} height={7.6} rx={2.4} {...stroke} />
          <Rect x={13.4} y={3} width={7.6} height={7.6} rx={2.4} {...stroke} />
          <Rect x={3} y={13.4} width={7.6} height={7.6} rx={2.4} {...stroke} />
          <Rect x={13.4} y={13.4} width={7.6} height={7.6} rx={2.4} {...stroke} />
        </>
      );

    case 'award':
      return (
        <>
          <Circle cx={12} cy={8.6} r={5.8} {...stroke} />
          <Path d="M15.6 13.3 17.1 21.5 12 18.5l-5.1 3 1.5-8.2" {...stroke} />
        </>
      );

    case 'flame':
      return (
        <Path
          d="M12.4 2.2c3.3 2.7 5.3 5.7 5.3 9.2a5.7 5.7 0 1 1-11.4 0c0-2 .8-3.7 2-5 .2 1.3.9 2.3 2 2.7.4-2.8-.4-5.2 2.1-6.9Z"
          fill={color}
        />
      );

    case 'paw':
      return (
        <>
          <Ellipse cx={7.2} cy={9.4} rx={2.3} ry={2.9} fill={color} />
          <Ellipse cx={16.8} cy={9.4} rx={2.3} ry={2.9} fill={color} />
          <Ellipse cx={11.1} cy={5.9} rx={2.1} ry={2.7} fill={color} />
          <Ellipse cx={19.9} cy={14.6} rx={2} ry={2.4} fill={color} />
          <Path
            d="M11.6 12.4c2.9 0 5.3 2 5.3 4.4 0 1.9-1.5 3-3.2 3-1 0-1.5-.4-2.1-.4s-1.1.4-2.1.4c-1.7 0-3.2-1.1-3.2-3 0-2.4 2.4-4.4 5.3-4.4Z"
            fill={color}
          />
        </>
      );

    case 'leaf':
      return (
        <>
          <Path
            d="M4.6 19.4C2.9 14.7 5.4 8.3 12.6 5.4c2.9-1.2 6.2-1.3 6.2-1.3s.2 3.4-1 6.4c-2.7 6.8-8.8 8.6-13.2 8.9Z"
            {...stroke}
          />
          <Path d="M4.4 20.2 10.6 13.4" {...stroke} />
        </>
      );

    case 'sound-on':
      return (
        <>
          <Path
            d="M4 9.4h3.3L12 5.2v13.6l-4.7-4.2H4a1 1 0 0 1-1-1v-3.2a1 1 0 0 1 1-1Z"
            {...stroke}
          />
          <Path d="M15.6 9.2a4 4 0 0 1 0 5.6" {...stroke} />
          <Path d="M18.3 6.5a7.8 7.8 0 0 1 0 11" {...stroke} />
        </>
      );

    case 'sound-off':
      return (
        <>
          <Path
            d="M4 9.4h3.3L12 5.2v13.6l-4.7-4.2H4a1 1 0 0 1-1-1v-3.2a1 1 0 0 1 1-1Z"
            {...stroke}
          />
          <Path d="m16 9.5 5 5" {...stroke} />
          <Path d="m21 9.5-5 5" {...stroke} />
        </>
      );

    case 'chevron-right':
      return <Path d="m9.5 5.5 6.4 6.5-6.4 6.5" {...stroke} />;

    case 'close':
      return (
        <>
          <Path d="m6.4 6.4 11.2 11.2" {...stroke} />
          <Path d="m17.6 6.4-11.2 11.2" {...stroke} />
        </>
      );

    case 'arrow-left':
      return (
        <>
          <Path d="M19.4 12H4.9" {...stroke} />
          <Path d="m11.4 5.2-6.5 6.8 6.5 6.8" {...stroke} />
        </>
      );

    case 'lock':
      return (
        <>
          <Rect x={4.6} y={10.2} width={14.8} height={10.8} rx={2.8} {...stroke} />
          <Path d="M8.2 10.2V7.4a3.8 3.8 0 0 1 7.6 0v2.8" {...stroke} />
        </>
      );

    case 'check':
      return <Path d="m4.6 12.4 4.9 4.9L19.4 6.8" {...stroke} />;

    case 'star':
      return (
        <Path
          d="m12 2.6 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3.1-5.8 3.1 1.1-6.5-4.7-4.6 6.5-.9Z"
          fill={color}
        />
      );

    case 'bolt':
      return <Path d="M13.4 2.4 4.6 13.4h6L10.6 21.6l8.8-11h-6Z" fill={color} />;

    case 'ruler':
      return (
        <>
          <Rect x={2.6} y={8.2} width={18.8} height={7.6} rx={1.8} {...stroke} />
          <Path d="M6.6 8.2v3.2M10.2 8.2v2.2M13.8 8.2v3.2M17.4 8.2v2.2" {...stroke} />
        </>
      );

    case 'hourglass':
      return (
        <>
          <Path d="M6.4 3h11.2M6.4 21h11.2" {...stroke} />
          <Path
            d="M7.6 3v2.8a4.4 4.4 0 0 0 2 3.7L12 12l2.4-2.5a4.4 4.4 0 0 0 2-3.7V3"
            {...stroke}
          />
          <Path
            d="M7.6 21v-2.8a4.4 4.4 0 0 1 2-3.7L12 12l2.4 2.5a4.4 4.4 0 0 1 2 3.7V21"
            {...stroke}
          />
        </>
      );

    case 'bowl':
      return (
        <>
          <Path d="M3 11.2h18a9 9 0 0 1-18 0Z" {...stroke} />
          <Path d="M9 7.6c0-1.4 1.2-1.6 1.2-3M13.6 7.6c0-1.4 1.2-1.6 1.2-3" {...stroke} />
        </>
      );

    case 'bulb':
      return (
        <>
          <Path
            d="M9 17.4v-1.6a6.4 6.4 0 1 1 6 0v1.6Z"
            {...stroke}
          />
          <Path d="M9.6 20.8h4.8" {...stroke} />
        </>
      );
  }
}

type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
};

export function Icon({
  name,
  size = 24,
  color = UI.text,
  strokeWidth = 2.2,
}: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {shapes(name, { color, sw: strokeWidth })}
    </Svg>
  );
}
