import { isValidElement, type ReactNode } from 'react';
import type { ViewStyle } from 'react-native';

import { UI } from '@/theme/ui';
import { Text, View } from '@/tw';

/** Skąd wychodzi ogonek dymka — zależnie od tego, gdzie stoi Timo. */
export type BubbleTail = 'none' | 'bottom-left' | 'bottom-right' | 'top-center';

type BubbleProps = {
  children: ReactNode;
  eyebrow?: string;
  tail?: BubbleTail;
  /** Rozmiar tekstu — w grze pytanie ma być większe niż zwykły komunikat. */
  size?: 'md' | 'lg';
};

const TAIL_SIZE = 18;

function tailStyle(tail: Exclude<BubbleTail, 'none'>): ViewStyle {
  const base: ViewStyle = {
    position: 'absolute',
    width: TAIL_SIZE,
    height: TAIL_SIZE,
    backgroundColor: UI.canvas,
    transform: [{ rotate: '45deg' }],
    borderColor: UI.line,
  };

  if (tail === 'top-center') {
    return {
      ...base,
      top: -TAIL_SIZE / 2,
      alignSelf: 'center',
      left: '50%',
      marginLeft: -TAIL_SIZE / 2,
      borderTopWidth: 2,
      borderLeftWidth: 2,
    };
  }

  return {
    ...base,
    bottom: -TAIL_SIZE / 2,
    [tail === 'bottom-left' ? 'left' : 'right']: 26,
    borderRightWidth: 2,
    borderBottomWidth: 2,
  };
}

/**
 * Dymek Timo w stylu UI 2.0 — biały, obrysowany, bez cienia.
 */
export function Bubble({
  children,
  eyebrow,
  tail = 'bottom-left',
  size = 'md',
}: BubbleProps) {
  return (
    <View
      style={{
        backgroundColor: UI.canvas,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: UI.line,
        paddingHorizontal: 18,
        paddingVertical: 14,
        position: 'relative',
      }}>
      {tail !== 'none' ? <View style={tailStyle(tail)} /> : null}

      {eyebrow ? (
        <Text
          style={{
            color: UI.textFaint,
            fontFamily: 'Fredoka-Bold',
            fontSize: 11,
            letterSpacing: 1.2,
            marginBottom: 4,
          }}>
          {eyebrow}
        </Text>
      ) : null}

      {isValidElement(children) ? (
        children
      ) : (
        <Text
          style={{
            color: UI.text,
            fontFamily: 'Fredoka-Bold',
            fontSize: size === 'lg' ? 20 : 17,
            lineHeight: size === 'lg' ? 27 : 23,
          }}>
          {children}
        </Text>
      )}
    </View>
  );
}
