import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';

import { AccountForm } from '@/components/auth/AccountForm';
import { Icon } from '@/components/ui/Icon';
import { useAuthStore } from '@/lib/stores/auth-store';
import { SHADOW, UI } from '@/theme/ui';
import { Pressable, View } from '@/tw';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Konto rodzica — opcjonalne, jak w Finchu. Gra działa na anonimowym koncie;
 * tu rodzic zapisuje postępy (dopina e-mail / Apple / Google do tego samego
 * konta) albo loguje się na konto, które już ma.
 */
export default function AccountScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const anonymous = useAuthStore((s) => s.session?.user.is_anonymous === true);
  // „Mam już konto” (onboarding) otwiera od razu logowanie — wcześniej anonimowa
  // sesja kierowała rodzica do „Zapisz postępy”.
  const { mode } = useLocalSearchParams<{ mode?: 'link' | 'login' }>();
  const [variant, setVariant] = useState<'link' | 'login'>(mode ?? (anonymous ? 'link' : 'login'));

  const back = () => (router.canGoBack() ? router.back() : router.replace('/profiles'));

  return (
    <View className="flex-1 bg-canvas">
      <AccountForm
        variant={variant}
        onSwitch={() => setVariant((v) => (v === 'link' ? 'login' : 'link'))}
        onDone={back}
      />
      <Pressable
        onPress={back}
        accessibilityRole="button"
        accessibilityLabel="Wróć"
        className="w-11 h-11 items-center justify-center rounded-pill"
        style={{
          position: 'absolute',
          top: insets.top + 8,
          left: 16,
          backgroundColor: UI.page,
          boxShadow: `${SHADOW.e0}, ${SHADOW.rim}`,
        }}>
        <Icon name="arrow-left" size={22} color={UI.text} strokeWidth={2.6} />
      </Pressable>
    </View>
  );
}
