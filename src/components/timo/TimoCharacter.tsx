import { Image } from '@/tw/image';

export type TimoState =
  | 'idle'
  | 'listening'
  | 'speaking'
  | 'thinking'
  | 'happy'
  | 'oops'
  | 'greeting'
  | 'pointing';

const SOURCE = require('../../../assets/timo/character/timo.png');

type TimoCharacterProps = {
  /** reserved for future Rive state machine — currently no effect */
  state?: TimoState;
  size?: number;
};

export function TimoCharacter({ size = 240 }: TimoCharacterProps) {
  return (
    <Image
      source={SOURCE}
      style={{ width: size, height: size }}
      contentFit="contain"
    />
  );
}
