import { ANIMALS_BY_ID } from '@/data/animals';
import type { Animal } from '@/types/game';

export type Expedition = {
  id: string;
  /**
   * Kosmetyczny "alias" tagu (np. dla mapowania regionów na mapie, czy łatwego
   * grep'owania w innych miejscach). NIE używany do budowania puli — pula
   * pochodzi z `roster`.
   */
  tag: string;
  title: string;
  description_pl: string;
  hero_emoji: string;
  /** ile zwierząt do ukończenia */
  target_count: number;
  /** nagrody za completion (pierwsze ukończenie) */
  reward_paws: number;
  reward_xp: number;
  /**
   * Jawna lista animal_id — źródło prawdy dla puli wyprawy w trybie 'expert'.
   * Posortowane ~malejąco po popularności (popularne zwierzęta na początku).
   * Dla 'guided' używamy `inspirationRoster` (ten sam zestaw co karty inspiracji).
   */
  roster?: string[];
  /**
   * Tryb wyprawy:
   *  - 'guided'  — dziecięca, prowadzona. Pokazuje 18 kart inspiracji
   *                (`inspirationRoster`), pula gry = 18 kart, fallback
   *                rozszerza do całej ANIMALS gdy dziecko wybrało spoza puli.
   *  - 'expert'  — klasyczna, abstrakcyjna kategoria. Pula gry = pełny
   *                `roster`, fallback zostaje w roster. Domyślnie ukryta
   *                w UI (`SHOW_EXPERT_EXPEDITIONS`).
   * Brak = traktowane jako 'expert' (back-compat).
   */
  mode?: 'guided' | 'expert';
  /** Dziecięcy tytuł UI dla guided ("Wodne Zwierzaki" itp.). */
  childTitle?: string;
  /**
   * 18 animal_id pokazywanych jako karty inspiracji na ekranie
   * `/expedition-intro/[id]` — jednocześnie grywalna pula w guided mode.
   */
  inspirationRoster?: string[];
};

/**
 * Feature flag — czy "Wyprawy Eksperta" są widoczne w UI.
 * W MVP false: tab Wyprawy pokazuje tylko guided. Przy włączeniu w przyszłości
 * dorobimy ekran wyboru trybu (Wyprawa z Timo vs Wyprawa Eksperta).
 */
export const SHOW_EXPERT_EXPEDITIONS = false;

/** Pomocnik — reward proporcjonalny do target_count. */
function rewards(target: number): Pick<Expedition, 'target_count' | 'reward_paws' | 'reward_xp'> {
  return {
    target_count: target,
    reward_paws: target * 15,
    reward_xp: target * 30,
  };
}

export const EXPEDITIONS: Expedition[] = [
  // === LIGA REGIONALNA / BIOMÓW ===
  {
    id: 'polish_forest',
    tag: 'polish_forest',
    title: 'Polski las',
    description_pl: 'Cisza, mech, ślady kopytek. Sprawdź, kogo Timo wytropi w polskim lesie.',
    hero_emoji: '🌲',
    ...rewards(8),
    mode: 'expert',
    roster: [
      'owl', 'wolf', 'fox', 'brown_bear', 'stork', 'frog', 'mouse', 'deer',
      'hedgehog', 'squirrel', 'swallow', 'sparrow', 'pigeon', 'woodpecker',
      'swan', 'butterfly', 'ladybug', 'bee', 'wild_boar', 'toad', 'ant',
      'spider', 'snail', 'roe_deer', 'lynx', 'badger', 'marten', 'elk',
      'bison', 'beaver', 'otter', 'stoat', 'weasel', 'field_mouse', 'bat',
      'mole', 'tit', 'raven', 'magpie', 'jay', 'blackbird', 'nightingale',
      'hoopoe', 'cuckoo', 'heron', 'eagle_owl', 'salamander', 'newt', 'wasp',
      'bumblebee', 'mosquito', 'fly', 'cricket', 'grasshopper', 'dragonfly',
      'mayfly', 'mantis', 'beetle', 'stag_beetle', 'shrew', 'dormouse', 'hare',
      'finch', 'bullfinch', 'goldfinch', 'partridge', 'pheasant', 'thrush',
      'jackdaw', 'crow', 'mazurek', 'mallard', 'grebe', 'viper', 'grass_snake',
      'slowworm', 'fire_salamander', 'great_tit', 'starling', 'lark',
      'white_eagle', 'buzzard', 'osprey', 'sparrowhawk', 'hobby', 'hornet',
      'caterpillar', 'harvestman', 'slug', 'centipede', 'earthworm', 'wildcat',
      'vole', 'water_shrew', 'polecat', 'sable', 'european_mink', 'musk_rat',
      'european_hamster', 'wolverine', 'crossbill', 'siskin', 'goldcrest',
      'waxwing', 'kingfisher', 'black_woodpecker', 'eagle_owl_white',
      'hawfinch', 'serin', 'grebe_great', 'cicada', 'millipede', 'mole_eu',
      'dormouse_garden', 'chipmunk', 'flying_squirrel', 
      'kestrel', 'peacock_butterfly', 'tick',
    ],
  },
  {
    id: 'savanna',
    tag: 'savanna',
    title: 'Afrykańska sawanna',
    description_pl: 'Lornetka spakowana! Słońce, akacje i wielkie zwierzęta na horyzoncie.',
    hero_emoji: '🦁',
    ...rewards(6),
    mode: 'expert',
    roster: [
      'lion', 'elephant', 'giraffe', 'zebra', 'flamingo', 'ostrich',
      'crocodile', 'leopard', 'cheetah', 'hippo', 'rhino', 'antelope',
      'gnu', 'hyena', 'jackal', 'meerkat', 'gazelle', 'buffalo', 'warthog',
      'vulture', 'termite', 'fennec', 'mongoose', 'dik_dik', 'impala',
      'kudu', 'eland', 'oryx', 'springbok', 'african_wild_dog', 'aardvark',
      'rock_hyrax', 'serval', 'aardwolf', 'ibis', 'marabou', 'locust',
      'pangolin', 'ratel', 'sitatunga', 'caracal', 'genet', 'zebra_grevyi',
      'addax', 'saiga', 'maned_wolf', 'pampas_deer', 'secretary_bird',
      'mamba', 'camel_spider', 'aardwolf_kenya', 'honey_badger', 'rhea',
      'pichi',
    ],
  },
  {
    id: 'ocean',
    tag: 'ocean',
    title: 'Oceaniczna głębia',
    description_pl: 'Nurkujemy! W tonach głębi mieszkają największe i najdziwniejsze stworzenia.',
    hero_emoji: '🌊',
    ...rewards(8),
    mode: 'expert',
    roster: [
      'dolphin', 'shark', 'whale', 'seal', 'orca', 'sea_turtle', 'octopus',
      'manatee', 'narwhal', 'sperm_whale', 'porpoise', 'pelican', 'manta',
      'tuna', 'mackerel', 'herring', 'cod', 'swordfish', 'seahorse',
      'barracuda', 'clownfish', 'moray', 'flounder', 'anchovy', 'crab',
      'shrimp', 'lobster', 'langouste', 'squid', 'cuttlefish', 'jellyfish',
      'starfish', 'seahorse_dwarf', 'coral', 'beluga', 'bowhead',
      'bearded_seal', 'hammerhead', 'whale_shark', 'marlin', 'moonfish',
      'sardine', 'halibut', 'sturgeon', 'hermit_crab', 'coconut_crab',
      'krill', 'barnacle', 'clam', 'oyster', 'sea_urchin', 'sea_anemone',
      'orca_killer', 'blue_whale_pygmy', 'humpback', 'right_whale',
      'gray_whale', 'dugong', 'sea_lion', 'elephant_seal', 'leopard_seal',
      'angler_fish', 'parrotfish', 'wrasse', 'lionfish', 'stonefish',
      'blobfish', 'pufferfish', 'porcupinefish', 'mola_giant', 'mantis_shrimp',
      'horseshoe_crab', 'nautilus', 'giant_squid', 'vampire_squid',
      'cone_snail', 'sea_cucumber', 'sea_slug', 'mantis_shrimp_peacock',
      'atlantic_puffin', 'booby', 
      'moonjellyfish', 'octopus_blue_ring', 'crab_japanese_spider', 'flatworm',
    ],
  },
  {
    id: 'farm',
    tag: 'farm',
    title: 'Wiejska farma',
    description_pl: 'Stodoła, łąka, gdaczące kury. Tu rezydują nasi najbliżsi pomocnicy.',
    hero_emoji: '🐄',
    ...rewards(5),
    mode: 'expert',
    roster: [
      'horse', 'cow', 'pig', 'sheep', 'goat', 'chicken', 'duck', 'bee',
      'donkey', 'rooster', 'goose', 'alpaca', 'turkey', 'guinea_fowl', 'mule',
      'llama', 'yak',
    ],
  },
  {
    id: 'jungle',
    tag: 'jungle',
    title: 'Amazońska dżungla',
    description_pl: 'Lianki, ryki, kolorowe pióra. Timo rusza w gęstwinę tropików.',
    hero_emoji: '🌴',
    ...rewards(6),
    mode: 'expert',
    roster: [
      'tiger', 'panda', 'parrot', 'chimpanzee', 'gorilla', 'crocodile',
      'orangutan', 'jaguar', 'sloth', 'lemur', 'mandrill', 'anteater',
      'capybara', 'gibbon', 'macaque', 'ocelot', 'toucan', 'piranha',
      'eel_electric', 'cobra', 'python', 'anaconda', 'chameleon', 'iguana',
      'komodo', 'boa', 'stick_insect', 'termite', 'tarantula', 'bird_eater',
      'red_panda', 'sun_bear', 'moon_bear', 'sloth_bear', 'langur',
      'japanese_macaque', 'binturong', 'asian_elephant', 'macaw', 'gharial',
      'saltwater_croc', 'basilisk', 'poison_frog', 'tree_frog', 'bullfrog',
      'caecilian', 'okapi', 'pangolin', 'bongo', 'aye_aye', 'tapir',
      'proboscis_monkey', 'clouded_leopard', 'binturong_indo', 'dhole',
      'jaguarundi', 'coati', 'paca', 'tamarin', 'marmoset', 'giant_otter',
      'quetzal', 'hornbill', 'bird_of_paradise', 'toucan_keel', 'shoebill',
      'discus', 'arowana', 'king_cobra', 'mamba', 'matamata', 'softshell_turtle',
      'alligator_snapping', 'glass_frog', 'mantella', 'rhinoceros_beetle',
      'hercules_beetle', 'praying_mantis_giant', 'jewel_beetle',
      'walking_stick', 'atlas_butterfly', 'blue_morpho', 'treehopper',
      'whip_scorpion', 'aardvark_pig', 'saola', 'hoatzin', 'green_anaconda',
      'reticulated_python', 'komodo_juvenile', 'goliath_beetle', 'peacock',
      'hummingbird',
    ],
  },
  {
    id: 'arctic',
    tag: 'arctic',
    title: 'Arktyczna kraina',
    description_pl: 'Śnieg, lód i polarne światło. Kto przetrwa tę zimę?',
    hero_emoji: '❄️',
    ...rewards(5),
    mode: 'expert',
    roster: [
      'polar_bear', 'penguin_emperor', 'seal', 'penguin_little', 'walrus',
      'arctic_fox', 'reindeer', 'musk_ox', 'lemming', 'snowy_owl', 'narwhal',
      'mountain_hare', 'beluga', 'bowhead', 'bearded_seal', 'puffin',
      'arctic_tern', 'caribou', 'arctic_wolf', 'snowshoe_hare', 'wolverine',
      'orca_killer', 'elephant_seal', 'leopard_seal', 'rockhopper_penguin',
      'king_penguin', 'snow_fox', 'reindeer_svalbard', 'atlantic_puffin',
    ],
  },
  {
    id: 'australia',
    tag: 'australia',
    title: 'Australijski busz',
    description_pl: 'Koale, kangury i dziwactwa, których nie ma nigdzie indziej.',
    hero_emoji: '🦘',
    ...rewards(4),
    mode: 'expert',
    roster: [
      'kangaroo', 'koala', 'platypus', 'emu', 'tasmanian_devil', 'wombat',
      'quokka', 'echidna', 'cassowary', 'cassowary_dwarf', 'kakapo',
      'thorny_devil', 'frilled_lizard', 'lyrebird', 'octopus_blue_ring',
      'giant_weta', 'kiwi',
    ],
  },
  {
    id: 'night_forest',
    tag: 'night_forest',
    title: 'Nocny las',
    description_pl: 'Latarka w łapę! Po zmroku las budzi zupełnie inne zwierzęta.',
    hero_emoji: '🌙',
    ...rewards(6),
    mode: 'expert',
    roster: [
      'owl', 'wolf', 'fox', 'hedgehog', 'spider', 'ferret', 'lynx', 'badger',
      'marten', 'stoat', 'weasel', 'field_mouse', 'bat', 'hyena', 'ocelot',
      'porcupine', 'arctic_fox', 'snowy_owl', 'eagle_owl', 'firefly', 'moth',
      'cockroach', 'scorpion', 'tarantula', 'dormouse', 'aardvark', 'aardwolf',
      'raccoon', 'opossum', 'tasmanian_devil', 'cockroach_asian', 'silk_moth',
      'atlas_moth', 'black_widow', 'wildcat', 'vole', 'polecat', 'sable',
      'aye_aye', 'genet', 'arctic_wolf', 'eagle_owl_white', 'dormouse_garden',
      'flying_squirrel', 'skunk', 'armadillo',
    ],
  },
  {
    id: 'mountain',
    tag: 'mountain',
    title: 'Górska wyprawa',
    description_pl: 'Wysokie szczyty, świst halnego. Zwierzęta gór mają mocne nogi.',
    hero_emoji: '⛰️',
    ...rewards(4),
    mode: 'expert',
    roster: [
      'tiger', 'wolf', 'brown_bear', 'panda', 'eagle', 'lynx', 'falcon',
      'condor', 'trout', 'yak', 'chamois', 'mountain_hare', 'red_panda',
      'moon_bear', 'japanese_macaque', 'snow_leopard', 'puma', 'coyote',
      'grizzly', 'bison_american', 'white_eagle', 'buzzard', 'marmot', 'ibex',
      'clouded_leopard', 'serow', 'takin', 'dhole', 'musk_deer',
      'vicuna', 'guanaco', 'wolverine', 'snub_nosed_monkey', 'bald_eagle',
      'giant_salamander',
    ],
  },
  {
    id: 'home_pets',
    tag: 'home_pets',
    title: 'Domowi przyjaciele',
    description_pl: 'Pokój, klatka, akwarium. Twoje codzienne towarzystwo.',
    hero_emoji: '🏠',
    ...rewards(5),
    mode: 'expert',
    roster: [
      'dog', 'cat', 'rabbit', 'hamster', 'guinea_pig', 'parrot', 'mouse',
      'rat', 'ferret', 'cockatoo', 'gecko', 'canary', 'budgerigar', 'parakeet',
      'cricket_house', 'koi', 'gerbil', 'chinchilla', 'mite',
    ],
  },

  // === LIGA TEMATYCZNA — nowe 10 ===
  {
    id: 'predators',
    tag: 'predators',
    title: 'Drapieżniki świata',
    description_pl: 'Bystry wzrok, ostry pazur, cicha sierść. Polowanie z Timo!',
    hero_emoji: '🐺',
    ...rewards(8),
    mode: 'expert',
    roster: [
      'cat', 'lion', 'tiger', 'owl', 'wolf', 'fox', 'polar_bear', 'dolphin',
      'eagle', 'shark', 'crocodile', 'leopard', 'cheetah', 'jaguar', 'seal',
      'orca', 'snake', 'spider', 'octopus', 'ferret', 'lynx', 'marten',
      'otter', 'stoat', 'weasel', 'mole', 'hyena', 'jackal', 'anteater',
      'ocelot', 'arctic_fox', 'snowy_owl', 'sperm_whale', 'porpoise', 'heron',
      'falcon', 'hawk', 'eagle_owl', 'pelican', 'pike', 'catfish', 'eel',
      'salmon', 'trout', 'perch', 'zander', 'tuna', 'cod', 'swordfish',
      'barracuda', 'moray', 'piranha', 'eel_electric', 'cobra', 'python',
      'anaconda', 'rattlesnake', 'chameleon', 'komodo', 'alligator', 'boa',
      'dragonfly', 'mantis', 'scorpion', 'tarantula', 'bird_eater', 'squid',
      'cuttlefish', 'shrew', 'viper', 'grass_snake', 'fennec', 'mongoose',
      'african_wild_dog', 'aardvark', 'serval', 'siberian_tiger',
      'snow_leopard', 'puma', 'coyote', 'tasmanian_devil', 'bearded_seal',
      'hammerhead', 'marlin', 'burbot', 'white_eagle', 'buzzard', 'osprey',
      'sparrowhawk', 'hobby', 'gharial', 'saltwater_croc', 'monitor_lizard',
      'black_widow', 'centipede', 'wildcat', 'water_shrew', 'polecat', 'sable',
      'european_mink', 'pangolin', 'ratel', 'caracal', 'genet',
      'clouded_leopard', 'dhole', 'jaguarundi', 'maned_wolf', 'giant_otter',
      'arctic_wolf', 'wolverine', 'sea_lion', 'leopard_seal', 'kingfisher',
      'eagle_owl_white', 'shoebill', 'secretary_bird', 'angler_fish', 'arowana',
      'king_cobra', 'mamba', 'matamata', 'alligator_snapping',
      'praying_mantis_giant', 'camel_spider', 'whip_scorpion', 'mantis_shrimp',
      'giant_squid', 'cone_snail', 'mantis_shrimp_peacock', 'mole_eu',
      'honey_badger', 'snow_fox', 'bald_eagle', 
      'octopus_blue_ring', 'green_anaconda', 'reticulated_python',
      'komodo_juvenile',
    ],
  },
  {
    id: 'insects',
    tag: 'insects',
    title: 'Świat owadów',
    description_pl: 'Sześć nóg, brzęczenie i miliony historii. Mali bohaterowie ogrodu.',
    hero_emoji: '🦋',
    ...rewards(6),
    mode: 'expert',
    roster: [
      'butterfly', 'ladybug', 'bee', 'ant', 'wasp', 'bumblebee', 'mosquito',
      'fly', 'cricket', 'grasshopper', 'dragonfly', 'mayfly', 'firefly', 'moth',
      'cockroach', 'mantis', 'stick_insect', 'beetle', 'stag_beetle', 'termite',
      'cockroach_asian', 'cricket_house', 'hornet', 'flea', 'louse',
      'caterpillar', 'locust', 'silk_moth', 'atlas_moth', 'rhinoceros_beetle',
      'hercules_beetle', 'praying_mantis_giant', 'jewel_beetle', 'walking_stick',
      'atlas_butterfly', 'blue_morpho', 'monarch', 'cicada', 'treehopper',
      'giant_weta', 'goliath_beetle', 'peacock_butterfly',
    ],
  },
  {
    id: 'freshwater',
    tag: 'freshwater',
    title: 'Słodkie wody Polski',
    description_pl: 'Rzeki, jeziora, stawy. Co pluska pod powierzchnią?',
    hero_emoji: '🎣',
    ...rewards(4),
    mode: 'expert',
    roster: [
      'carp', 'pike', 'catfish', 'eel', 'salmon', 'trout', 'tench', 'perch',
      'zander', 'roach', 'axolotl', 'crayfish', 'catfish_polish', 'bream',
      'chub', 'crucian', 'burbot', 'giant_otter', 'discus', 'arowana', 'koi',
      'matamata', 'softshell_turtle', 'alligator_snapping', 'hellbender',
      'axolotl_pink',
    ],
  },
  {
    id: 'reptiles',
    tag: 'reptiles',
    title: 'Gady i pancerze',
    description_pl: 'Łuski, sykanie, zimna krew. Spokojni i niezwykle starzy mieszkańcy Ziemi.',
    hero_emoji: '🐍',
    ...rewards(6),
    // UWAGA: dinozaury (trex, brachiosaurus, velociraptor, triceratops,
    // stegosaurus) i dragon należą TYLKO do wyprawy 'mythical', nie do reptiles.
    mode: 'expert',
    roster: [
      'turtle', 'crocodile', 'snake', 'lizard', 'sea_turtle', 'cobra', 'python',
      'anaconda', 'rattlesnake', 'gecko', 'chameleon', 'iguana', 'komodo',
      'alligator', 'boa', 'viper', 'grass_snake', 'slowworm', 'gharial',
      'saltwater_croc', 'horned_lizard', 'tortoise_giant', 'monitor_lizard',
      'basilisk', 'king_cobra', 'mamba', 'thorny_devil', 'frilled_lizard',
      'matamata', 'softshell_turtle', 'alligator_snapping', 'green_anaconda',
      'reticulated_python', 'komodo_juvenile',
    ],
  },
  {
    id: 'amphibians',
    tag: 'amphibians',
    title: 'Świat płazów',
    description_pl: 'Skacze, pływa, oddycha skórą. Mokre stworzenia stawów i bagien.',
    hero_emoji: '🐸',
    ...rewards(4),
    mode: 'expert',
    roster: [
      'frog', 'toad', 'salamander', 'newt', 'axolotl', 'fire_salamander',
      'poison_frog', 'tree_frog', 'bullfrog', 'caecilian', 'glass_frog',
      'mantella', 'hellbender', 'giant_salamander', 'axolotl_pink',
    ],
  },
  {
    id: 'songbirds',
    tag: 'songbirds',
    title: 'Ptaki śpiewające',
    description_pl: 'Najpiękniejsze koncerty natury. Każdy z innym dialektem.',
    hero_emoji: '🎶',
    ...rewards(5),
    mode: 'expert',
    roster: [
      'swallow', 'sparrow', 'tit', 'blackbird', 'nightingale', 'hoopoe',
      'cuckoo', 'canary', 'finch', 'bullfinch', 'goldfinch', 'thrush',
      'mazurek', 'great_tit', 'starling', 'lark', 'crossbill', 'siskin',
      'goldcrest', 'waxwing', 'hawfinch', 'serin',
    ],
  },
  {
    id: 'monkeys',
    tag: 'monkeys',
    title: 'Małpy świata',
    description_pl: 'Inteligentni krewniacy człowieka. Lianki, narzędzia, gesty i miny.',
    hero_emoji: '🐒',
    ...rewards(4),
    mode: 'expert',
    roster: [
      'chimpanzee', 'gorilla', 'orangutan', 'lemur', 'mandrill', 'gibbon',
      'macaque', 'langur', 'japanese_macaque', 'aye_aye', 'proboscis_monkey',
      'tamarin', 'marmoset', 'snub_nosed_monkey',
    ],
  },
  {
    id: 'big_cats',
    tag: 'big_cats',
    title: 'Wielkie koty',
    description_pl: 'Króliki dżungli i sawanny. Cicha siła w pasiastym i cętkowanym futrze.',
    hero_emoji: '🐯',
    ...rewards(5),
    mode: 'expert',
    roster: [
      'lion', 'tiger', 'leopard', 'cheetah', 'jaguar', 'lynx', 'ocelot',
      'serval', 'siberian_tiger', 'snow_leopard', 'puma', 'wildcat', 'caracal',
      'clouded_leopard', 'jaguarundi',
    ],
  },
  {
    id: 'giants',
    tag: 'giants',
    title: 'Olbrzymy świata',
    description_pl: 'Tony i tony łagodnej siły. Największe stworzenia lądu i mórz.',
    hero_emoji: '🐘',
    ...rewards(5),
    mode: 'expert',
    roster: [
      'elephant', 'brown_bear', 'giraffe', 'polar_bear', 'whale', 'hippo',
      'rhino', 'orca', 'bison', 'sperm_whale', 'asian_elephant', 'grizzly',
      'bison_american', 'bowhead', 'whale_shark', 'orca_killer',
      'blue_whale_pygmy', 'humpback', 'right_whale', 'gray_whale', 'dugong',
      'elephant_seal', 'giant_squid', 'crab_japanese_spider',
      'green_anaconda', 'reticulated_python', 'komodo_juvenile',
      'giant_salamander',
    ],
  },
  {
    id: 'herbivores',
    tag: 'herbivores',
    title: 'Roślinożerni',
    description_pl: 'Trawa, liście, mech, gałązki. Spokojni jadacze rajów zielonych.',
    hero_emoji: '🌿',
    ...rewards(7),
    mode: 'expert',
    roster: [
      'horse', 'elephant', 'rabbit', 'hamster', 'guinea_pig', 'cow', 'giraffe',
      'panda', 'sheep', 'goat', 'deer', 'squirrel', 'zebra', 'gorilla',
      'kangaroo', 'koala', 'donkey', 'rhino', 'orangutan', 'sloth', 'alpaca',
      'roe_deer', 'elk', 'bison', 'beaver', 'antelope', 'gnu', 'lemur',
      'gazelle', 'buffalo', 'warthog', 'capybara', 'gibbon', 'reindeer',
      'musk_ox', 'lemming', 'manatee', 'mule', 'llama', 'yak', 'chamois',
      'mountain_hare', 'hare', 'dik_dik', 'impala', 'kudu', 'eland', 'oryx',
      'springbok', 'rock_hyrax', 'red_panda', 'langur', 'asian_elephant',
      'bison_american', 'wombat', 'quokka', 'marmot', 'ibex', 'okapi',
      'sitatunga', 'bongo', 'zebra_grevyi', 'addax', 'tapir', 'serow', 'takin',
      'musk_deer', 'saiga', 'tamarin', 'vicuna', 'guanaco', 'pampas_deer',
      'caribou', 'snowshoe_hare', 'dugong', 'chipmunk', 'snub_nosed_monkey',
      'reindeer_svalbard', 'gerbil', 'chinchilla', 'saola',
    ],
  },

  // === SPECJALNA — niemożliwe stworzenia ===
  {
    id: 'mythical',
    tag: 'mythical',
    title: 'Legendy i Mity',
    description_pl: 'Smoki, jednorożce, dinozaury i potwory z głębin. Wyprawa do świata, którego nie ma — i tym ciekawiej!',
    hero_emoji: '🐉',
    ...rewards(5),
    mode: 'expert',
    roster: [
      'trex', 'brachiosaurus', 'velociraptor', 'triceratops', 'stegosaurus',
      'mammoth', 'sabretooth', 'dragon', 'unicorn', 'phoenix', 'mermaid',
      'kraken', 'yeti', 'bigfoot', 'nessie', 'sphinx', 'griffin',
    ],
  },

  // ============================================================
  // === GUIDED — Wyprawy z Timo (dziecięce, dla 5-7 lat)     ===
  // ============================================================
  // Każda wyprawa: 18 zwierząt w `inspirationRoster` (= grywalna pula).
  // target_count: 10 z 18 do ukończenia (≈55%).
  // Roster (= pełna lista) celowo identyczna z inspirationRoster — dla guided
  // nie ma rozróżnienia "wszystkie" vs "karty inspiracji".
  {
    id: 'water_friends',
    tag: 'water_friends',
    title: 'Wodne Zwierzaki',
    childTitle: 'Wodne Zwierzaki',
    description_pl: 'Zwierzęta, które pływają, nurkują i mieszkają w wodzie.',
    hero_emoji: '🐬',
    ...rewards(10),
    mode: 'guided',
    inspirationRoster: [
      'dolphin', 'shark', 'whale', 'octopus', 'sea_turtle', 'crab',
      'carp', 'seal', 'orca', 'starfish', 'jellyfish',
      'seahorse', 'crayfish', 'shrimp', 'penguin_emperor', 'sea_lion',
      'manatee', 'salmon',
    ],
  },
  {
    id: 'farm_timo',
    tag: 'farm_timo',
    title: 'Farma Timo',
    childTitle: 'Farma Timo',
    description_pl: 'Zwierzęta domowe i gospodarskie, które żyją na wsi.',
    hero_emoji: '🐄',
    ...rewards(10),
    mode: 'guided',
    inspirationRoster: [
      'cow', 'horse', 'pig', 'chicken', 'sheep', 'goat', 'duck', 'goose',
      'rooster', 'donkey', 'rabbit', 'turkey', 'bee', 'cat', 'dog', 'alpaca',
      'llama', 'guinea_fowl',
    ],
  },
  {
    id: 'green_jungle',
    tag: 'green_jungle',
    title: 'Zielona Dżungla',
    childTitle: 'Zielona Dżungla',
    description_pl: 'Tropikalna gęstwina pełna lian, kolorów i ryków.',
    hero_emoji: '🌴',
    ...rewards(10),
    mode: 'guided',
    inspirationRoster: [
      'tiger', 'jaguar', 'parrot', 'toucan', 'sloth', 'anaconda', 'gorilla',
      'orangutan', 'chimpanzee', 'panda', 'macaw', 'piranha', 'iguana',
      'chameleon', 'capybara', 'tarantula', 'tree_frog', 'gibbon',
    ],
  },
  {
    id: 'forest_kids',
    tag: 'forest_kids',
    title: 'Leśne Zwierzaki',
    childTitle: 'Leśne Zwierzaki',
    description_pl: 'Mieszkańcy polskich i europejskich lasów.',
    hero_emoji: '🦊',
    ...rewards(10),
    mode: 'guided',
    inspirationRoster: [
      'fox', 'wolf', 'hedgehog', 'roe_deer', 'wild_boar', 'owl', 'brown_bear',
      'squirrel', 'deer', 'lynx', 'badger', 'beaver', 'rabbit', 'elk', 'bison',
      'otter', 'woodpecker', 'magpie',
    ],
  },
  {
    id: 'flyers',
    tag: 'flyers',
    title: 'Latające Zwierzaki',
    childTitle: 'Zwierzęta, które latają',
    description_pl: 'Wszystko, co macha skrzydłami i unosi się w powietrzu.',
    hero_emoji: '🦋',
    ...rewards(10),
    mode: 'guided',
    inspirationRoster: [
      'eagle', 'owl', 'parrot', 'stork', 'sparrow', 'swallow', 'pigeon',
      'butterfly', 'bee', 'dragonfly', 'hummingbird', 'bat', 'flamingo',
      'swan', 'crow', 'ladybug', 'falcon', 'woodpecker',
    ],
  },
  {
    id: 'night_animals',
    tag: 'night_animals',
    title: 'Nocne Zwierzaki',
    childTitle: 'Nocne Zwierzaki',
    description_pl: 'Zwierzęta aktywne nocą — gdy reszta świata śpi.',
    hero_emoji: '🌙',
    ...rewards(10),
    mode: 'guided',
    inspirationRoster: [
      'owl', 'bat', 'fox', 'hedgehog', 'badger', 'moth', 'raccoon', 'opossum',
      'wolf', 'lynx', 'firefly', 'scorpion', 'tarantula', 'eagle_owl', 'marten',
      'arctic_fox', 'snowy_owl', 'cockroach',
    ],
  },
  {
    id: 'big_animals',
    tag: 'big_animals',
    title: 'Wielkie Zwierzęta',
    childTitle: 'Wielkie Zwierzęta',
    description_pl: 'Olbrzymy lądu i morza — większe od człowieka.',
    hero_emoji: '🐘',
    ...rewards(10),
    mode: 'guided',
    inspirationRoster: [
      'elephant', 'giraffe', 'whale', 'rhino', 'hippo', 'brown_bear',
      'polar_bear', 'orca', 'shark', 'lion', 'tiger', 'gorilla', 'bison',
      'walrus', 'grizzly', 'sperm_whale', 'humpback', 'asian_elephant',
    ],
  },
  {
    id: 'small_animals',
    tag: 'small_animals',
    title: 'Małe Zwierzęta',
    childTitle: 'Małe Zwierzęta',
    description_pl: 'Drobne stworzenia, których możesz nie zauważyć od razu.',
    hero_emoji: '🐭',
    ...rewards(10),
    mode: 'guided',
    inspirationRoster: [
      'mouse', 'ant', 'ladybug', 'frog', 'snail', 'butterfly', 'bee',
      'hamster', 'spider', 'beetle', 'cricket', 'caterpillar', 'mosquito',
      'firefly', 'shrew', 'field_mouse', 'gecko', 'sparrow',
    ],
  },
  {
    id: 'scary_animals',
    tag: 'scary_animals',
    title: 'Groźne Zwierzaki',
    childTitle: 'Groźne Zwierzaki',
    description_pl: 'Drapieżnicy z mocnymi zębami i pazurami.',
    hero_emoji: '🦁',
    ...rewards(10),
    mode: 'guided',
    inspirationRoster: [
      'lion', 'tiger', 'shark', 'crocodile', 'wolf', 'snake', 'polar_bear',
      'jaguar', 'leopard', 'cheetah', 'cobra', 'piranha', 'orca', 'eagle',
      'rhino', 'hippo', 'komodo', 'rattlesnake',
    ],
  },
  {
    id: 'ice_land',
    tag: 'ice_land',
    title: 'Lodowa Kraina',
    childTitle: 'Lodowa Kraina',
    description_pl: 'Zwierzęta z mroźnych krain śniegu i lodu.',
    hero_emoji: '❄️',
    ...rewards(10),
    mode: 'guided',
    inspirationRoster: [
      'penguin_emperor', 'polar_bear', 'seal', 'walrus', 'reindeer',
      'arctic_fox', 'narwhal', 'beluga', 'snowy_owl', 'musk_ox', 'lemming',
      'arctic_wolf', 'puffin', 'caribou', 'mountain_hare', 'orca',
      'king_penguin', 'penguin_little',
    ],
  },
  {
    id: 'home_pets_friends',
    tag: 'home_pets_friends',
    title: 'Domowi Pupile',
    childTitle: 'Domowi Pupile',
    description_pl: 'Zwierzaki, które żyją w naszych domach.',
    hero_emoji: '🐶',
    ...rewards(10),
    mode: 'guided',
    inspirationRoster: [
      'dog', 'cat', 'rabbit', 'hamster', 'guinea_pig', 'parrot', 'mouse',
      'rat', 'ferret', 'cockatoo', 'gecko', 'canary', 'budgerigar', 'parakeet',
      'koi', 'gerbil', 'chinchilla', 'cricket_house',
    ],
  },
  {
    id: 'feathered',
    tag: 'feathered',
    title: 'Z Piórami',
    childTitle: 'Z Piórami',
    description_pl: 'Wszystkie ptaki świata — od malutkich po olbrzymie.',
    hero_emoji: '🪶',
    ...rewards(10),
    mode: 'guided',
    inspirationRoster: [
      'eagle', 'owl', 'parrot', 'flamingo', 'stork', 'swallow', 'sparrow',
      'pigeon', 'peacock', 'ostrich', 'penguin_emperor', 'chicken', 'duck',
      'swan', 'hummingbird', 'kiwi', 'toucan', 'rooster',
    ],
  },
  {
    id: 'furry',
    tag: 'furry',
    title: 'Z Futrem',
    childTitle: 'Z Futrem',
    description_pl: 'Ssaki z miękkim, ciepłym futerkiem.',
    hero_emoji: '🐻',
    ...rewards(10),
    mode: 'guided',
    inspirationRoster: [
      'cat', 'dog', 'rabbit', 'wolf', 'fox', 'brown_bear', 'polar_bear',
      'squirrel', 'hamster', 'lion', 'tiger', 'koala', 'hedgehog', 'panda',
      'lynx', 'wild_boar', 'arctic_fox', 'beaver',
    ],
  },
  {
    id: 'bugs_and_worms',
    tag: 'bugs_and_worms',
    title: 'Owady i Robaki',
    childTitle: 'Owady i Robaki',
    description_pl: 'Sześć nóg, brzęczenie i miliony historii.',
    hero_emoji: '🐝',
    ...rewards(10),
    mode: 'guided',
    inspirationRoster: [
      'butterfly', 'bee', 'ant', 'ladybug', 'dragonfly', 'mosquito', 'fly',
      'spider', 'snail', 'caterpillar', 'beetle', 'wasp', 'cricket',
      'grasshopper', 'firefly', 'earthworm', 'scorpion', 'centipede',
    ],
  },
  {
    id: 'savanna_kids',
    tag: 'savanna_kids',
    title: 'Sawanna',
    childTitle: 'Sawanna',
    description_pl: 'Akacje, słońce i wielkie zwierzęta Afryki.',
    hero_emoji: '🦓',
    ...rewards(10),
    mode: 'guided',
    inspirationRoster: [
      'lion', 'elephant', 'giraffe', 'zebra', 'cheetah', 'hippo', 'rhino',
      'leopard', 'gazelle', 'antelope', 'hyena', 'meerkat', 'flamingo',
      'ostrich', 'buffalo', 'gnu', 'warthog', 'jackal',
    ],
  },
  {
    id: 'jumpers',
    tag: 'jumpers',
    title: 'Skoczki',
    childTitle: 'Skoczki',
    description_pl: 'Zwierzęta, które skaczą i wyskakują z prędkością światła.',
    hero_emoji: '🦘',
    ...rewards(10),
    mode: 'guided',
    inspirationRoster: [
      'kangaroo', 'frog', 'rabbit', 'hare', 'cheetah', 'cricket',
      'grasshopper', 'dolphin', 'gazelle', 'springbok', 'chamois', 'squirrel',
      'lemur', 'impala', 'puma', 'mountain_hare', 'snowshoe_hare', 'gibbon',
    ],
  },
  {
    id: 'swimmers',
    tag: 'swimmers',
    title: 'Pływające Zwierzaki',
    childTitle: 'Pływające Zwierzaki',
    description_pl: 'Mistrzowie pływania — w morzu, rzece i jeziorze.',
    hero_emoji: '🐟',
    ...rewards(10),
    mode: 'guided',
    inspirationRoster: [
      'dolphin', 'whale', 'shark', 'orca', 'seal', 'salmon', 'tuna', 'penguin_emperor',
      'sea_turtle', 'octopus', 'manta', 'narwhal', 'walrus', 'beaver', 'otter',
      'pike', 'frog', 'sea_lion',
    ],
  },
  {
    id: 'monkey_friends',
    tag: 'monkey_friends',
    title: 'Małpki i Naczelne',
    childTitle: 'Małpki i Naczelne',
    description_pl: 'Mądrzy krewniacy człowieka.',
    hero_emoji: '🐵',
    ...rewards(10),
    mode: 'guided',
    inspirationRoster: [
      'chimpanzee', 'gorilla', 'orangutan', 'lemur', 'mandrill', 'gibbon',
      'macaque', 'langur', 'japanese_macaque', 'aye_aye', 'proboscis_monkey',
      'tamarin', 'marmoset', 'snub_nosed_monkey', 'binturong',
      'sloth', 'red_panda', 'koala',
    ],
  },
  {
    id: 'striped_spotted',
    tag: 'striped_spotted',
    title: 'Pasiaste i Cętkowane',
    childTitle: 'Pasiaste i Cętkowane',
    description_pl: 'Zwierzęta z najpiękniejszymi wzorami na futrze.',
    hero_emoji: '🐅',
    ...rewards(10),
    mode: 'guided',
    inspirationRoster: [
      'zebra', 'tiger', 'cheetah', 'jaguar', 'leopard', 'giraffe', 'hyena',
      'okapi', 'snow_leopard', 'siberian_tiger', 'ocelot', 'serval', 'caracal',
      'ladybug', 'quokka', 'tapir', 'salamander', 'fire_salamander',
    ],
  },
  {
    id: 'long_nose',
    tag: 'long_nose',
    title: 'Z Trąbą i Długim Nosem',
    childTitle: 'Z Trąbą i Długim Nosem',
    description_pl: 'Zwierzęta z najdłuższym pyskiem albo trąbą.',
    hero_emoji: '🐘',
    ...rewards(10),
    mode: 'guided',
    inspirationRoster: [
      'elephant', 'asian_elephant', 'anteater', 'tapir', 'platypus', 'aardvark',
      'pelican', 'swordfish', 'shrew', 'proboscis_monkey', 'pig', 'wild_boar',
      'mammoth', 'narwhal', 'toucan', 'hornbill', 'flamingo', 'stork',
    ],
  },
  {
    id: 'water_giants',
    tag: 'water_giants',
    title: 'Wodne Olbrzymy',
    childTitle: 'Wodne Olbrzymy',
    description_pl: 'Największe stworzenia mórz i oceanów.',
    hero_emoji: '🐋',
    ...rewards(10),
    mode: 'guided',
    inspirationRoster: [
      'whale', 'shark', 'orca', 'manta', 'swordfish', 'octopus', 'sperm_whale',
      'humpback', 'whale_shark', 'hammerhead', 'beluga', 'narwhal', 'walrus',
      'elephant_seal', 'giant_squid', 'sea_turtle', 'dolphin', 'blue_whale_pygmy',
    ],
  },
  {
    id: 'dinos_myths',
    tag: 'dinos_myths',
    title: 'Dinozaury i Mity',
    childTitle: 'Dinozaury i Mity',
    description_pl: 'Stworzenia z dawnych czasów i legend.',
    hero_emoji: '🦖',
    ...rewards(10),
    mode: 'guided',
    inspirationRoster: [
      'trex', 'brachiosaurus', 'velociraptor', 'triceratops', 'stegosaurus',
      'mammoth', 'sabretooth', 'dragon', 'unicorn', 'phoenix', 'mermaid',
      'kraken', 'yeti', 'bigfoot', 'nessie', 'sphinx', 'griffin', 'salamander',
    ],
  },
  {
    id: 'shelled',
    tag: 'shelled',
    title: 'Ze Skorupą',
    childTitle: 'Ze Skorupą',
    description_pl: 'Zwierzęta noszące własny domek lub pancerz.',
    hero_emoji: '🐢',
    ...rewards(10),
    mode: 'guided',
    inspirationRoster: [
      'turtle', 'sea_turtle', 'snail', 'crab', 'lobster', 'armadillo',
      'oyster', 'clam', 'crayfish', 'hermit_crab', 'shrimp', 'starfish',
      'nautilus', 'tortoise_giant', 'barnacle', 'coconut_crab',
      'horseshoe_crab', 'sea_urchin',
    ],
  },
  {
    id: 'colorful',
    tag: 'colorful',
    title: 'Kolorowe Zwierzaki',
    childTitle: 'Kolorowe Zwierzaki',
    description_pl: 'Zwierzęta tęczowe i najbardziej kolorowe.',
    hero_emoji: '🦜',
    ...rewards(10),
    mode: 'guided',
    inspirationRoster: [
      'parrot', 'toucan', 'butterfly', 'hummingbird', 'peacock', 'flamingo',
      'chameleon', 'mandrill', 'macaw', 'cockatoo', 'clownfish', 'ladybug',
      'kingfisher', 'quetzal', 'poison_frog', 'tree_frog', 'lionfish',
      'bird_of_paradise',
    ],
  },
];

export const EXPEDITIONS_BY_ID: Record<string, Expedition> = Object.fromEntries(
  EXPEDITIONS.map((e) => [e.id, e]),
);

/**
 * Pula zwierząt dla wyprawy.
 * - guided  → `inspirationRoster` (18 zwierząt = karty inspiracji)
 * - expert  → `roster` (15-150 zwierząt z dawnej kategorii)
 * Pominięte/nieznane ID są filtrowane (rezylientne na rozjazd między rosterem
 * a animals.ts).
 */
export function expeditionPool(expeditionId: string): Animal[] {
  const exp = EXPEDITIONS_BY_ID[expeditionId];
  if (!exp) return [];
  const ids = exp.mode === 'guided'
    ? exp.inspirationRoster ?? []
    : exp.roster ?? [];
  return ids
    .map((id) => ANIMALS_BY_ID[id])
    .filter((a): a is Animal => !!a);
}

/**
 * Mapa guided → expert wyprawy "tematycznie pokrewne".
 * Gdy w guided dziecko wybierze zwierzę spoza 18 kart inspiracji, fallback
 * silnika rozszerza się TYLKO do unii rosterów tych expert wypraw — nie do
 * całej ANIMALS. Dzięki temu pytania pozostają tematyczne (np. dla "Wodne
 * Zwierzaki" nie pyta o farmę, Polskę czy Afrykę).
 */
const GUIDED_EXPANSION_REFS: Record<string, string[]> = {
  water_friends: ['ocean', 'freshwater'],
  farm_timo: ['farm'],
  green_jungle: ['jungle'],
  forest_kids: ['polish_forest', 'night_forest'],
  flyers: ['songbirds', 'polish_forest'],
  night_animals: ['night_forest', 'polish_forest'],
  big_animals: ['giants'],
  small_animals: ['insects'],
  scary_animals: ['predators'],
  ice_land: ['arctic'],
  home_pets_friends: ['home_pets'],
  feathered: ['songbirds', 'polish_forest'],
  furry: ['polish_forest', 'savanna', 'arctic', 'home_pets'],
  bugs_and_worms: ['insects'],
  savanna_kids: ['savanna'],
  jumpers: ['polish_forest', 'savanna', 'australia'],
  swimmers: ['ocean', 'freshwater'],
  monkey_friends: ['monkeys', 'jungle'],
  striped_spotted: ['big_cats', 'savanna'],
  long_nose: ['savanna', 'jungle'],
  water_giants: ['ocean', 'giants'],
  dinos_myths: ['mythical'],
  shelled: ['ocean', 'reptiles'],
  colorful: ['jungle'],
};

/**
 * Pula fallbacku dla guided — gdy karty inspiracji się wyczerpią.
 * Zwraca union: 18 kart inspiracji + zwierzęta z rosterów `GUIDED_EXPANSION_REFS`.
 * Dla wypraw bez wpisu (lub expert) → cały ANIMALS jako last resort.
 */
export function expeditionExpansionPool(expeditionId: string): Animal[] {
  const exp = EXPEDITIONS_BY_ID[expeditionId];
  if (!exp || exp.mode !== 'guided') return [];
  const refs = GUIDED_EXPANSION_REFS[exp.id];
  if (!refs || refs.length === 0) return [];

  const ids = new Set<string>(exp.inspirationRoster ?? []);
  for (const refId of refs) {
    const ref = EXPEDITIONS_BY_ID[refId];
    if (!ref) continue;
    const refIds = ref.mode === 'guided'
      ? ref.inspirationRoster ?? []
      : ref.roster ?? [];
    for (const id of refIds) ids.add(id);
  }
  return Array.from(ids)
    .map((id) => ANIMALS_BY_ID[id])
    .filter((a): a is Animal => !!a);
}

/**
 * Deterministic 3 expeditions for a given date key — same date → same picks.
 * Uses simple hash over the date string. Stara funkcja — wybiera ze wszystkich.
 */
export function pickDailyThree(dateKey: string): string[] {
  let seed = 0;
  for (let i = 0; i < dateKey.length; i++) seed = (seed * 31 + dateKey.charCodeAt(i)) & 0xffffffff;
  const sorted = [...EXPEDITIONS].sort((a, b) => {
    const ha = hash(seed ^ stringHash(a.id));
    const hb = hash(seed ^ stringHash(b.id));
    return ha - hb;
  });
  return sorted.slice(0, 3).map((e) => e.id);
}

/**
 * Wyprawa Dnia dla guided mode — 3 wyprawy z `mode === 'guided'`.
 * Deterministyczne dla danego dnia.
 */
export function pickDailyGuided(dateKey: string): string[] {
  let seed = 0;
  for (let i = 0; i < dateKey.length; i++) seed = (seed * 31 + dateKey.charCodeAt(i)) & 0xffffffff;
  const guided = EXPEDITIONS.filter((e) => e.mode === 'guided');
  const sorted = guided.sort((a, b) => {
    const ha = hash(seed ^ stringHash(a.id));
    const hb = hash(seed ^ stringHash(b.id));
    return ha - hb;
  });
  return sorted.slice(0, 3).map((e) => e.id);
}

function stringHash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) & 0xffffffff;
  return h;
}
function hash(x: number): number {
  x = ((x >>> 16) ^ x) * 0x45d9f3b;
  x = ((x >>> 16) ^ x) * 0x45d9f3b;
  x = (x >>> 16) ^ x;
  return x >>> 0;
}

export function todayKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
