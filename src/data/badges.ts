export type BadgeDef = {
  id: string;
  label_pl: string;
  description_pl: string;
  emoji: string;
  /** Grupa do sortowania/sekcji w ekranie odznak */
  group: 'firsts' | 'streak' | 'daily' | 'collection' | 'speed' | 'expeditions' | 'special';
};

export const BADGES: BadgeDef[] = [
  // === PIERWSZE KROKI ===
  {
    id: 'first_win',
    label_pl: 'Pierwsza zagadka',
    description_pl: 'Twoja pierwsza wygrana z Timo!',
    emoji: '🌱',
    group: 'firsts',
  },
  {
    id: 'first_loss',
    label_pl: 'Próba się liczy',
    description_pl: 'Czasem Timo się myli — i to też jest cenne!',
    emoji: '🧩',
    group: 'firsts',
  },

  // === STREAK RUND ===
  {
    id: 'streak_3',
    label_pl: 'Trójka pod rząd',
    description_pl: '3 wygrane z rzędu — Timo ma stracha!',
    emoji: '🔥',
    group: 'streak',
  },
  {
    id: 'streak_5',
    label_pl: 'Lisi Detektyw',
    description_pl: '5 wygranych z rzędu — niezły z Ciebie tropiciel.',
    emoji: '🕵️',
    group: 'streak',
  },
  {
    id: 'streak_10',
    label_pl: 'Niezatrzymywalny',
    description_pl: '10 wygranych z rzędu! Timo bije brawo.',
    emoji: '🏅',
    group: 'streak',
  },

  // === STREAK DNI ===
  {
    id: 'daily_streak_7',
    label_pl: 'Tydzień z Timo',
    description_pl: '7 dni z rzędu zagraliście razem.',
    emoji: '📅',
    group: 'daily',
  },
  {
    id: 'daily_streak_30',
    label_pl: 'Miesiąc tropienia',
    description_pl: '30 dni z rzędu — Timo to Twój najlepszy przyjaciel.',
    emoji: '🗓️',
    group: 'daily',
  },

  // === KOLEKCJA ===
  {
    id: 'collector_5',
    label_pl: 'Młody Odkrywca',
    description_pl: 'Odkryłeś 5 różnych zwierząt.',
    emoji: '🔭',
    group: 'collection',
  },
  {
    id: 'collector_10',
    label_pl: 'Przyjaciel Zwierząt',
    description_pl: '10 zwierząt w księdze Timo!',
    emoji: '🤝',
    group: 'collection',
  },
  {
    id: 'collector_25',
    label_pl: 'Kolekcjoner',
    description_pl: 'Już 25 zwierząt w Twoim albumie.',
    emoji: '📔',
    group: 'collection',
  },
  {
    id: 'collector_50',
    label_pl: 'Wielki tropiciel',
    description_pl: '50 zwierząt — pół setki!',
    emoji: '📚',
    group: 'collection',
  },
  {
    id: 'collector_100',
    label_pl: 'Encyklopedia',
    description_pl: '100 zwierząt odkrytych. Jesteś chodzącą encyklopedią!',
    emoji: '🏆',
    group: 'collection',
  },

  // === SZYBKOŚĆ ===
  {
    id: 'fast_thinker',
    label_pl: 'Szybki ogon',
    description_pl: 'Timo zgadł w 4 pytaniach albo mniej.',
    emoji: '⚡',
    group: 'speed',
  },
  {
    id: 'lightning',
    label_pl: 'Błyskawica',
    description_pl: '3 wygrane w 3 pytaniach lub mniej — błyskawiczne tropienie!',
    emoji: '🌩️',
    group: 'speed',
  },

  // === WYPRAWY ===
  {
    id: 'explorer_1',
    label_pl: 'Pierwsza wyprawa',
    description_pl: 'Ukończona pierwsza Wyprawa Dnia!',
    emoji: '🗺️',
    group: 'expeditions',
  },
  {
    id: 'explorer_5',
    label_pl: 'Podróżnik',
    description_pl: '5 wypraw na koncie. Świat się otwiera!',
    emoji: '🌍',
    group: 'expeditions',
  },
  {
    id: 'explorer_10',
    label_pl: 'Mistrz wypraw',
    description_pl: '10 wypraw ukończonych — niezłe portfolio.',
    emoji: '🎖️',
    group: 'expeditions',
  },
  {
    id: 'explorer_all',
    label_pl: 'Globtroter',
    description_pl: 'Wszystkie 20 wypraw zaliczone! Timo wie wszystko o świecie.',
    emoji: '👑',
    group: 'expeditions',
  },

  // === SPECJALNE ===
  {
    id: 'night_owl',
    label_pl: 'Nocna sowa',
    description_pl: 'Zagrałeś późno wieczorem (po 21:00).',
    emoji: '🦉',
    group: 'special',
  },
  {
    id: 'early_bird',
    label_pl: 'Ranny ptaszek',
    description_pl: 'Zagrałeś wcześnie rano (przed 8:00).',
    emoji: '🐤',
    group: 'special',
  },
];
