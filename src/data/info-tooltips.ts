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
      'Główna nagroda. Wygrana = +20 (×1.5 gdy zgadniesz w 5–9 pytaniach, ×2 w 4 lub mniej). Pierwsze odkrycie zwierzęcia = bonus +10. Streak ≥3 = +5 ekstra.',
  },
  xp: {
    emoji: '✨',
    title: 'XP — doświadczenie',
    description:
      'Punkty rozwoju. Wygrana = +50, próba = +15, pierwsze odkrycie zwierzęcia = +25. Im wyższy level, tym więcej XP do następnego.',
  },
  level: {
    emoji: '🦊',
    title: 'Poziom odkrywcy',
    description:
      'Numer w kółku to Twój poziom. Co kilka poziomów dostajesz nowy tytuł — od Małego Tropiciela po Profesora Timo!',
  },
  streak: {
    emoji: '🔥',
    title: 'Seria wygranych',
    description:
      'Liczba wygranych rund pod rząd. Od 3 z rzędu dostajesz +5 tropów do każdej kolejnej wygranej.',
  },
  daily_streak: {
    emoji: '📅',
    title: 'Dni z Timo',
    description:
      'Liczba dni z rzędu, w których zagrałeś. Pominięty dzień zeruje licznik. 7 dni z rzędu = bonus +50 tropów i odznaka!',
  },
  collection: {
    emoji: '📒',
    title: 'Kolekcja',
    description:
      'Każde zwierzę, które Timo zgadł, trafia do Twojej księgi. Zbieraj odznaki za 5, 10, 25, 50 i 100 odkrytych!',
  },
  badges: {
    emoji: '🏅',
    title: 'Odznaki',
    description:
      'Małe trofea za różne osiągnięcia — pierwsze odkrycie, serie, kolekcja, wyprawy. Sprawdzaj listę, żeby zobaczyć, co jeszcze możesz zdobyć!',
  },
} as const satisfies Record<string, TooltipDef>;

export type TooltipKey = keyof typeof TOOLTIPS;
