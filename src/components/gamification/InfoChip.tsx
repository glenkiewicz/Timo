import * as Haptics from 'expo-haptics';
import { useCallback, useState } from 'react';
import { Platform } from 'react-native';

import { Chip } from '@/components/gamification/Chip';
import { TOOLTIPS, type TooltipKey } from '@/data/info-tooltips';
import { Pressable } from '@/tw';

import { InfoModal } from './InfoModal';

type ChipVariant = 'brand' | 'reward' | 'success' | 'paper';
type ChipIcon = 'flame' | 'paw' | 'star' | 'medal' | 'leaf' | 'sparkle';

type InfoChipProps = {
  tooltipKey: TooltipKey;
  icon: ChipIcon;
  value: string | number;
  variant?: ChipVariant;
};

export function InfoChip({ tooltipKey, icon, value, variant }: InfoChipProps) {
  const [open, setOpen] = useState(false);

  const handlePress = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    setOpen(true);
  }, []);

  return (
    <>
      <Pressable onPress={handlePress}>
        <Chip icon={icon} value={value} variant={variant} />
      </Pressable>
      <InfoModal
        visible={open}
        tooltip={TOOLTIPS[tooltipKey]}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
