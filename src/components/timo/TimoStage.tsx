import { useCallback, useRef } from 'react';
import type { ReactNode } from 'react';
import { useWindowDimensions, View as RNView } from 'react-native';

import { Image } from '@/tw/image';

import { TimoAnimated } from './TimoAnimated';

/**
 * Polana Timo — pełnoekranowa ilustracja lasu z animowanym Timo na trawie.
 *
 * Scena leży na poziomie ekranu (`HomeBackdrop`), od `top: 0`, pod paskiem
 * statystyk i paskiem XP — dlatego nie może siedzieć w `ScrollView`, który
 * przyciąłby ją na swojej górnej krawędzi.
 *
 * Problem, który to rozwiązuje: linia gruntu musi wypaść dokładnie pod łapami
 * Timo, a ten leży w przewijanej treści, więc jego pozycja zależy od wysokości
 * paska statystyk (czyli od `insets.top`), od paska XP i od tego, ile linijek ma
 * dymek. Nic z tego nie jest znane statycznie, więc `TimoStage` MIERZY pozycję
 * pasa animacji i oddaje ją przez `onGroundY`; `HomeBackdrop` skaluje z niej
 * scenę tak, żeby `SCENE_GROUND` trafiło w ten punkt.
 *
 * Dwie liczby są zestrojone z assetami — po przegenerowaniu któregoś trzeba je
 * przeliczyć:
 * - `SCENES[*].ground` — gdzie w danej ilustracji leży ziemia.
 * - `CLIP_PAWS`    — gdzie w `timo-idle.webp` lisek dotyka ziemi (0.9903).
 *
 * Scena idzie `contentFit="cover"`, nie `fill`: przy wysokim kadrze przycina
 * boki zamiast rozciągać pionowo, więc drzewa zachowują proporcje, a odwzorowanie
 * pionowe (czyli linia gruntu) zostaje nienaruszone.
 */
/**
 * Sceny, ich linie gruntu i kolor podłoża.
 *
 * `ground` — ułamek wysokości grafiki, na którym leży ziemia; odczytany z każdej
 * ilustracji osobno przy jej cięciu.
 *
 * `base` — kolor tła ekranu, mediana dolnych 16 wierszy swojej grafiki (środkowe
 * 60% szerokości, żeby nie złapać dekoracji przy krawędziach). Każdy master ma
 * dorysowane ~1330 px gruntu pod linią, więc ilustracja sięga dołu ekranu i
 * `base` widać już tylko w pierwszej klatce, zanim `TimoStage` zmierzy linię
 * gruntu. Wcześniej wszystkie sceny leżały na jednej zieleni `UI.lawnCool`,
 * przez co przy plaży piasek kończył się ostrą krechą i zaczynał trawnik.
 */
type Scene = {
  source: number;
  ground: number;
  base: string;
  /** Proporcja grafiki (szerokość/wysokość) — potrzebna do wyliczenia skali. */
  aspect: number;
};

const SCENES = {
  home: {
    source: require('../../../assets/backgrounds/home-forest.webp'),
    // Master 752x2029 px, linia trawy na 699 px od góry.
    ground: 699 / 2029,
    aspect: 752 / 2029,
    base: '#75ba1d',
  },
  game: {
    source: require('../../../assets/backgrounds/game-forest.webp'),
    // Master 752x2056 px, linia trawy na 726 px od góry.
    ground: 726 / 2056,
    aspect: 752 / 2056,
    base: '#658537',
  },
  result: {
    source: require('../../../assets/backgrounds/result-forest.webp'),
    ground: 726 / 2056,
    aspect: 752 / 2056,
    base: '#7c952c',
  },
} as const satisfies Record<string, Scene>;

export type SceneName = keyof typeof SCENES;

/**
 * Tła dedykowane wyprawom, po `Expedition.id`. Wyprawa bez wpisu gra na
 * domyślnej scenie leśnej — dopisanie kolejnej to jedna linijka tutaj.
 *
 * `ground` liczony tak samo jak dla scen bazowych: ułamek wysokości grafiki,
 * na którym Timo ma postawić łapy. Dla plaży to 0.575 — tuż pod linią piany,
 * żeby lisek stał na czystym piasku, a nie w fali.
 */
const EXPEDITION_SCENES: Record<string, Scene> = {
  water_friends: {
    source: require('../../../assets/backgrounds/exp-water-friends.webp'),
    // Master ma 752x2100 px, a linia wody leży na 773 px od góry.
    ground: 773 / 2100,
    base: '#ae8f59',
    aspect: 752 / 2100,
  },
  forest_kids: {
    source: require('../../../assets/backgrounds/exp-forest-kids.webp'),
    // Leśne Zwierzaki — master 752x2052 px, linia gruntu na 802 px.
    ground: 802 / 2052,
    base: '#65843e',
    aspect: 752 / 2052,
  },
  flyers: {
    source: require('../../../assets/backgrounds/exp-flyers.webp'),
    // Zwierzęta, które latają — master 752x2052 px, linia gruntu na 829 px.
    ground: 829 / 2052,
    base: '#6a8949',
    aspect: 752 / 2052,
  },
  night_animals: {
    source: require('../../../assets/backgrounds/exp-night-animals.webp'),
    // Nocne Zwierzaki — master 752x2052 px, linia gruntu na 775 px.
    ground: 775 / 2052,
    base: '#073447',
    aspect: 752 / 2052,
  },
  big_animals: {
    source: require('../../../assets/backgrounds/exp-big-animals.webp'),
    // Wielkie Zwierzęta — master 752x2052 px, linia gruntu na 802 px.
    ground: 802 / 2052,
    base: '#5e7d3e',
    aspect: 752 / 2052,
  },
  small_animals: {
    source: require('../../../assets/backgrounds/exp-small-animals.webp'),
    // Małe Zwierzęta — master 752x2052 px, linia gruntu na 816 px.
    ground: 816 / 2052,
    base: '#7a9744',
    aspect: 752 / 2052,
  },
  scary_animals: {
    source: require('../../../assets/backgrounds/exp-scary-animals.webp'),
    // Groźne Zwierzaki — master 752x2212 px, linia gruntu na 882 px.
    // Kanion ma najgłębszy plan ze wszystkich scen: głazy schodzą aż do 0.64
    // wysokości oryginału, więc klepisko zaczyna się dopiero na 0.66 i master
    // musiał dostać 160 px gruntu więcej niż pozostałe.
    ground: 882 / 2212,
    base: '#5d553d',
    aspect: 752 / 2212,
  },
  ice_land: {
    source: require('../../../assets/backgrounds/exp-ice-land.webp'),
    // Lodowa Kraina — master 752x2092 px, linia śniegu na 762 px.
    // Jedyne tło z ToAPIs (gpt-image-2.5-flare), stąd inny rozmiar źródła.
    ground: 762 / 2092,
    base: '#6385b3',
    aspect: 752 / 2092,
  },
  bugs_and_worms: {
    source: require('../../../assets/backgrounds/exp-bugs-and-worms.webp'),
    // Owady i Robaki — master 752x2132 px, linia gruntu na 802 px.
    ground: 802 / 2132,
    base: '#4d392e',
    aspect: 752 / 2132,
  },
  colorful: {
    source: require('../../../assets/backgrounds/exp-colorful.webp'),
    // Kolorowe Zwierzaki — master 752x2105 px, linia gruntu na 775 px.
    ground: 775 / 2105,
    base: '#6e9531',
    aspect: 752 / 2105,
  },
  dinos_myths: {
    source: require('../../../assets/backgrounds/exp-dinos-myths.webp'),
    // Dinozaury i Mity — master 752x2105 px, linia gruntu na 775 px.
    ground: 775 / 2105,
    base: '#567b33',
    aspect: 752 / 2105,
  },
  feathered: {
    source: require('../../../assets/backgrounds/exp-feathered.webp'),
    // Z Piórami — master 752x2146 px, linia gruntu na 816 px.
    ground: 816 / 2146,
    base: '#75972e',
    aspect: 752 / 2146,
  },
  furry: {
    source: require('../../../assets/backgrounds/exp-furry.webp'),
    // Z Futrem — master 752x2159 px, linia gruntu na 829 px.
    ground: 829 / 2159,
    base: '#8e7f29',
    aspect: 752 / 2159,
  },
  home_pets_friends: {
    source: require('../../../assets/backgrounds/exp-home-pets-friends.webp'),
    // Domowi Pupile — master 752x2105 px, linia gruntu na 775 px.
    ground: 775 / 2105,
    base: '#719436',
    aspect: 752 / 2105,
  },
  jumpers: {
    source: require('../../../assets/backgrounds/exp-jumpers.webp'),
    // Skoczki — master 752x2105 px, linia gruntu na 775 px.
    ground: 775 / 2105,
    base: '#7e9e33',
    aspect: 752 / 2105,
  },
  long_nose: {
    source: require('../../../assets/backgrounds/exp-long-nose.webp'),
    // Z Trąbą i Długim Nosem — master 752x2132 px, linia gruntu na 802 px.
    ground: 802 / 2132,
    base: '#918b3a',
    aspect: 752 / 2132,
  },
  monkey_friends: {
    source: require('../../../assets/backgrounds/exp-monkey-friends.webp'),
    // Małpki i Naczelne — master 752x2119 px, linia gruntu na 789 px.
    ground: 789 / 2119,
    base: '#769233',
    aspect: 752 / 2119,
  },
  savanna_kids: {
    source: require('../../../assets/backgrounds/exp-savanna-kids.webp'),
    // Sawanna — master 752x2119 px, linia gruntu na 789 px.
    ground: 789 / 2119,
    base: '#828029',
    aspect: 752 / 2119,
  },
  shelled: {
    source: require('../../../assets/backgrounds/exp-shelled.webp'),
    // Ze Skorupą — master 752x2146 px, linia gruntu na 816 px.
    ground: 816 / 2146,
    base: '#7b7a64',
    aspect: 752 / 2146,
  },
  striped_spotted: {
    source: require('../../../assets/backgrounds/exp-striped-spotted.webp'),
    // Pasiaste i Cętkowane — master 752x2119 px, linia gruntu na 789 px.
    ground: 789 / 2119,
    base: '#74963a',
    aspect: 752 / 2119,
  },
  swimmers: {
    source: require('../../../assets/backgrounds/exp-swimmers.webp'),
    // Pływające Zwierzaki — master 752x2119 px, linia gruntu na 789 px.
    ground: 789 / 2119,
    base: '#6b8f30',
    aspect: 752 / 2119,
  },
  water_giants: {
    source: require('../../../assets/backgrounds/exp-water-giants.webp'),
    // Wodne Olbrzymy — master 752x2159 px, linia gruntu na 829 px.
    ground: 829 / 2159,
    base: '#665851',
    aspect: 752 / 2159,
  },
  farm_timo: {
    source: require('../../../assets/backgrounds/exp-farm-timo.webp'),
    // Master 752x2036 px, krawędź łąki na 706 px od góry.
    ground: 706 / 2036,
    base: '#6a8842',
    aspect: 752 / 2036,
  },
  green_jungle: {
    source: require('../../../assets/backgrounds/exp-green-jungle.webp'),
    // Master ma 752x2064 px, a krawędź polany leży na 737 px od góry.
    ground: 737 / 2064,
    base: '#779132',
    aspect: 752 / 2064,
  },
};

/** Scena dla danego ekranu — wyprawa z własną grafiką wygrywa z bazową. */
function resolveScene(scene: SceneName, expeditionId?: string | null): Scene {
  return (expeditionId ? EXPEDITION_SCENES[expeditionId] : undefined) ?? SCENES[scene];
}

/**
 * Kolor tła ekranu pod daną scenę.
 *
 * Ekrany ustawiają go jako swój `backgroundColor`, zamiast malować go tutaj pod
 * ilustracją. Dzięki temu właściwy kolor jest na miejscu już w pierwszej
 * klatce — `SceneBackdrop` nie rysuje niczego, dopóki `TimoStage` nie zmierzy
 * linii gruntu, więc inaczej mignęłaby zieleń, zanim pojawi się plaża.
 */
export function sceneBaseColor(scene: SceneName, expeditionId?: string | null): string {
  return resolveScene(scene, expeditionId).base;
}

const BAND_HEIGHT = 190;
const CLIP_PAWS = 0.9903;

type TimoStageProps = {
  /** Dymek Timo — stoi nad liskiem, w przepływie, więc może rosnąć. */
  children?: ReactNode;
  /** Zwraca odległość linii gruntu od góry ekranu (w punktach). */
  onGroundY?: (y: number) => void;
};

export function TimoStage({ children, onGroundY }: TimoStageProps) {
  const bandRef = useRef<RNView>(null);

  const handleLayout = useCallback(() => {
    // `measureInWindow` zamiast `onLayout.y`, bo to drugie jest względem
    // rodzica, a pas animacji siedzi kilka poziomów w głąb ScrollView.
    bandRef.current?.measureInWindow((_x, y, _w, h) => {
      if (h > 0) onGroundY?.(y + h * CLIP_PAWS);
    });
  }, [onGroundY]);

  return (
    <RNView style={{ alignSelf: 'stretch' }}>
      {children ? <RNView style={{ paddingRight: 24 }}>{children}</RNView> : null}
      <RNView
        ref={bandRef}
        onLayout={handleLayout}
        style={{ height: BAND_HEIGHT, alignItems: 'center' }}>
        {/* Bez `offsetX`: nowy kadr jest cięty symetrycznie względem korpusu
            (margines 63 px z lewej, 65 z prawej), więc lisek jest już
            wyśrodkowany. Poprzedni klip wymagał korekty, bo przycinałem go
            do zasięgu WSZYSTKICH klatek, a ten sięgał dalej w lewo przez
            podniesioną łapkę. */}
        <TimoAnimated clip="idle" height={BAND_HEIGHT} />
      </RNView>
    </RNView>
  );
}

type SceneBackdropProps = {
  /** Z `TimoStage.onGroundY`; dopóki null, sceny nie rysujemy. */
  groundY: number | null;
  scene?: SceneName;
  /**
   * Gdy runda toczy się w wyprawie mającej własne tło, wygrywa ono z `scene`.
   * Wyprawa bez dedykowanej grafiki spada z powrotem na `scene`.
   */
  expeditionId?: string | null;
};

export function SceneBackdrop({
  groundY,
  scene = 'home',
  expeditionId,
}: SceneBackdropProps) {
  const { width: screenW } = useWindowDimensions();

  if (groundY == null || groundY <= 0) return null;

  const { source, ground, aspect } = resolveScene(scene, expeditionId);

  /*
   * Wysokość sceny, a z niej pozycja — dwa warunki naraz.
   *
   * Poprzednio scena szła `contentFit="cover"` w ramce o wysokości
   * `groundY / ground`, co działało tylko wtedy, gdy ramka była WĘŻSZA niż
   * proporcja grafiki. Na ekranie gry Timo stoi wysoko, ramka wychodziła niska
   * i szeroka, więc `cover` skalował obraz SZEROKOŚCIĄ — wysokość ramki
   * przestawała sterować skalą i linia gruntu lądowała 118 pt pod łapami.
   * W lesie niewidoczne (wszędzie trawa), na plaży Timo stawał w wodzie.
   *
   * Teraz skalę liczymy wprost:
   * - `screenW / aspect` — grafika ma wypełnić szerokość ekranu,
   * - `groundY / ground` — i sięgnąć góry ekranu, żeby nie było luki nad nią.
   * Większa z nich wygrywa; nadmiar szerokości przycinamy symetrycznie.
   *
   * Pozycję pionową wyznacza już tylko linia gruntu, więc trafia pod łapy
   * Timo niezależnie od wysokości ekranu i paska statusu.
   */
  const height = Math.max(screenW / aspect, groundY / ground);
  const width = height * aspect;

  return (
    <Image
      source={source}
      style={{
        position: 'absolute',
        top: groundY - ground * height,
        left: (screenW - width) / 2,
        width,
        height,
      }}
      // Scena leży pod paskiem statystyk i paskiem XP — bez tego przechwytywałaby
      // ich dotknięcia (tooltipy przy odznakach, modal poziomu). Propsem, nie
      // w stylu: typ stylu w `@/tw/image` tego pola nie zna.
      pointerEvents="none"
      contentFit="fill"
      transition={0}
      accessible={false}
    />
  );
}
