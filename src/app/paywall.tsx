import { useRouter } from 'expo-router';

import { Paywall } from '@/components/paywall/Paywall';
import { UI } from '@/theme/ui';

/**
 * Paywall po stuknięciu zablokowanej treści (wyprawa, kraina, gra
 * swobodna). Ten sam ekran co w onboardingu, tylko zamykany powrotem.
 */
export default function PaywallScreen() {
  const router = useRouter();
  return (
    <Paywall
      background={UI.page}
      onDone={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)'))}
    />
  );
}
