import { isValidElement, ReactNode } from 'react';

import { Text, View } from '@/tw';

type SpeechBubbleProps = {
  children: ReactNode;
  eyebrow?: string;
  tailSide?: 'left' | 'right' | 'none';
};

export function SpeechBubble({
  children,
  eyebrow = 'TIMO PYTA',
  tailSide = 'left',
}: SpeechBubbleProps) {
  return (
    <View
      className="bg-paper rounded-card px-5 py-4 relative"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 14,
        elevation: 6,
        borderWidth: 2,
        borderColor: '#fff6cc',
      }}>
      {/* tail */}
      {tailSide !== 'none' ? (
        <View
          className="absolute bg-paper"
          style={{
            bottom: -10,
            [tailSide]: 28,
            width: 22,
            height: 22,
            transform: [{ rotate: '45deg' }],
            borderRightWidth: 2,
            borderBottomWidth: 2,
            borderColor: '#fff6cc',
          }}
        />
      ) : null}

      {eyebrow ? (
        <Text
          className="text-brand-deep mb-1.5"
          style={{
            fontFamily: 'Fredoka-Bold',
            fontSize: 11,
            letterSpacing: 1.2,
          }}>
          {eyebrow}
        </Text>
      ) : null}

      {isValidElement(children) ? (
        children
      ) : (
        <Text
          className="text-ink"
          style={{ fontFamily: 'Fredoka-Bold', fontSize: 18, lineHeight: 24 }}>
          {children}
        </Text>
      )}
    </View>
  );
}
