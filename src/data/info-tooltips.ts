export type TooltipDef = {
  emoji: string;
  title: string;
  description: string;
};

export const TOOLTIPS = {
  paws: {
    emoji: '🐾',
    title: 'Tropy',
    description:
      'Główna nagroda. Ukończona runda = +10. Za wiedzę o zwierzęciu do +20 (im mniej „nie wiem", tym więcej). Rzadkie zwierzę = do +10. Pierwsze odkrycie = +10. Seria od 3 rund = +5.',
  },
  xp: {
    emoji: '✨',
    title: 'XP — doświadczenie',
    description:
      'Punkty rozwoju. Ukończona runda = +20, za wiedzę o zwierzęciu do +20, pierwsze odkrycie = +25. Im wyższy poziom, tym więcej XP do następnego.',
  },
  level: {
    emoji: '🦊',
    title: 'Poziom odkrywcy',
    description:
      'Numer w kółku to Twój poziom — jest ich 84. Każdy ma własny stopień, a co siedem stopni awansujesz na nową rangę: od Małego tropiciela po Profesora Timo!',
  },
  streak: {
    emoji: '🔥',
    title: 'Seria rund',
    description:
      'Liczba ukończonych rund pod rząd. Od 3 z rzędu dostajesz +5 tropów do każdej kolejnej. Nie zeruje się, gdy Timo nie zgadnie.',
  },
  daily_streak: {
    emoji: '📅',
    title: 'Dni z Timo',
    description:
      'Liczba dni z rzędu, w których zajrzałeś do Timo — wystarczy otworzyć aplikację. Pominięty dzień zeruje licznik. Progi: 7 dni = +50 tropów, 14 dni = +100, 30 dni = +200.',
  },
  collection: {
    emoji: '📒',
    title: 'Kolekcja',
    description:
      'Każde zwierzę z rundy trafia do Twojej księgi — i to, które Timo zgadł, i to, które mu pokazałeś. Zbieraj odznaki za 5, 10, 25, 50 i 100 odkrytych!',
  },
  badges: {
    emoji: '🏅',
    title: 'Odznaki',
    description:
      'Małe trofea za różne osiągnięcia — pierwsze odkrycie, serie, kolekcja, wyprawy. Sprawdzaj listę, żeby zobaczyć, co jeszcze możesz zdobyć!',
  },
} as const satisfies Record<string, TooltipDef>;

export type TooltipKey = keyof typeof TOOLTIPS;

/**
 * Ilustracje do wysuwanych paneli z opisem. Seria, dni, kolekcja i odznaki
 * biorą gotowe rysunki odznak — ten sam obiekt znaczy w aplikacji to samo.
 */
export const TOOLTIP_ART: Record<TooltipKey, number> = {
  paws: require('../../assets/icons/info/paws.png'),
  xp: require('../../assets/icons/info/xp.png'),
  level: require('../../assets/icons/info/level.png'),
  streak: require('../../assets/badges/streak_3.png'),
  daily_streak: require('../../assets/badges/daily_streak_7.png'),
  collection: require('../../assets/badges/collector_25.png'),
  badges: require('../../assets/badges/streak_10.png'),
};

export const LOCK_ART: number = require('../../assets/icons/info/lock.png');
