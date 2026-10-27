import { Platform } from 'react-native';

/**
 * Sklep, w którym rodzic płaci za subskrypcję — App Store na iOS, Google Play
 * na Androidzie. Teksty o anulowaniu i przywracaniu zakupów muszą wskazywać
 * właściwy sklep, inaczej recenzja (i rodzic) dostaje instrukcję z iPhone'a.
 */
const ANDROID = Platform.OS === 'android';
const PACKAGE = 'com.glenkiewicz.Timo';

export const STORE = {
  /** „w ustawieniach App Store” / „w Google Play” */
  where: ANDROID ? 'w Google Play' : 'w ustawieniach App Store',
  /** „na tym koncie Apple” / „na tym koncie Google” */
  account: ANDROID ? 'na tym koncie Google' : 'na tym koncie Apple',
  /** Ścieżka do anulowania subskrypcji w ustawieniach telefonu. */
  cancelPath: ANDROID
    ? 'w Sklepie Google Play → profil → Płatności i subskrypcje → Subskrypcje'
    : 'w Ustawieniach → Apple ID → Subskrypcje',
  /** Okno zarządzania subskrypcjami w sklepie. */
  manageUrl: ANDROID
    ? `https://play.google.com/store/account/subscriptions?package=${PACKAGE}`
    : 'https://apps.apple.com/account/subscriptions',
};
