import { Text, View } from '@/tw';

type ChipVariant = 'brand' | 'reward' | 'success' | 'paper';
type ChipIcon = 'flame' | 'paw' | 'star' | 'medal' | 'leaf' | 'sparkle';

const SURFACE: Record<ChipVariant, string> = {
  brand: 'bg-brand',
  reward: 'bg-reward',
  success: 'bg-success',
  paper: 'bg-paper',
};

const TEXT: Record<ChipVariant, string> = {
  brand: 'text-paper',
  reward: 'text-brand-deep',
  success: 'text-paper',
  paper: 'text-ink',
};

// TODO: replace emoji with SVG from assets/elements/icon-*.svg
const ICONS: Record<ChipIcon, string> = {
  flame: '🔥',
  paw: '🐾',
  star: '⭐',
  medal: '🏅',
  leaf: '🍃',
  sparkle: '✨',
};

type ChipProps = {
  icon?: ChipIcon;
  value: string | number;
  variant?: ChipVariant;
};

export function Chip({ icon, value, variant = 'paper' }: ChipProps) {
  return (
    <View
      className={`${SURFACE[variant]} rounded-chip px-3 py-1.5 flex-row items-center gap-1.5`}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
      }}>
      {icon ? <Text className="text-base">{ICONS[icon]}</Text> : null}
      <Text
        className={`${TEXT[variant]} text-sm`}
        style={{ fontFamily: 'Fredoka-Bold' }}>
        {value}
      </Text>
    </View>
  );
}
