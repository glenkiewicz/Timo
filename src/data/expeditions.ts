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
   * Jawna lista animal_id — źródło prawdy dla puli wyprawy.
   * Posortowane ~malejąco po popularności (popularne zwierzęta na początku).
   */
  roster: string[];
};

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
      'dormouse_garden', 'chipmunk', 'flying_squirrel', 'peregrine_falcon',
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
      'atlantic_puffin', 'booby', 'seahorse_pygmy', 'manta_ray',
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
    roster: [
      'tiger', 'wolf', 'brown_bear', 'panda', 'eagle', 'lynx', 'falcon',
      'condor', 'trout', 'yak', 'chamois', 'mountain_hare', 'red_panda',
      'moon_bear', 'japanese_macaque', 'snow_leopard', 'puma', 'coyote',
      'grizzly', 'bison_american', 'white_eagle', 'buzzard', 'marmot', 'ibex',
      'clouded_leopard', 'serow', 'takin', 'snow_monkey', 'dhole', 'musk_deer',
      'vicuna', 'guanaco', 'wolverine', 'snub_nosed_monkey', 'bald_eagle',
      'peregrine_falcon', 'giant_salamander',
    ],
  },
  {
    id: 'home_pets',
    tag: 'home_pets',
    title: 'Domowi przyjaciele',
    description_pl: 'Pokój, klatka, akwarium. Twoje codzienne towarzystwo.',
    hero_emoji: '🏠',
    ...rewards(5),
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
      'honey_badger', 'snow_fox', 'bald_eagle', 'peregrine_falcon',
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
    roster: [
      'chimpanzee', 'gorilla', 'orangutan', 'lemur', 'mandrill', 'gibbon',
      'macaque', 'langur', 'japanese_macaque', 'aye_aye', 'proboscis_monkey',
      'snow_monkey', 'tamarin', 'marmoset', 'snub_nosed_monkey',
    ],
  },
  {
    id: 'big_cats',
    tag: 'big_cats',
    title: 'Wielkie koty',
    description_pl: 'Króliki dżungli i sawanny. Cicha siła w pasiastym i cętkowanym futrze.',
    hero_emoji: '🐯',
    ...rewards(5),
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
    roster: [
      'elephant', 'brown_bear', 'giraffe', 'polar_bear', 'whale', 'hippo',
      'rhino', 'orca', 'bison', 'sperm_whale', 'asian_elephant', 'grizzly',
      'bison_american', 'bowhead', 'whale_shark', 'orca_killer',
      'blue_whale_pygmy', 'humpback', 'right_whale', 'gray_whale', 'dugong',
      'elephant_seal', 'giant_squid', 'manta_ray', 'crab_japanese_spider',
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
    roster: [
      'trex', 'brachiosaurus', 'velociraptor', 'triceratops', 'stegosaurus',
      'mammoth', 'sabretooth', 'dragon', 'unicorn', 'phoenix', 'mermaid',
      'kraken', 'yeti', 'bigfoot', 'nessie', 'sphinx', 'griffin',
    ],
  },
];

export const EXPEDITIONS_BY_ID: Record<string, Expedition> = Object.fromEntries(
  EXPEDITIONS.map((e) => [e.id, e]),
);

/**
 * Pula zwierząt dla wyprawy — jawnie z `roster`.
 * Pominięte/nieznane ID są filtrowane (rezylientne na rozjazd między rosterem
 * a animals.ts).
 */
export function expeditionPool(expeditionId: string): Animal[] {
  const exp = EXPEDITIONS_BY_ID[expeditionId];
  if (!exp) return [];
  return exp.roster
    .map((id) => ANIMALS_BY_ID[id])
    .filter((a): a is Animal => !!a);
}

/**
 * Deterministic 3 expeditions for a given date key — same date → same picks.
 * Uses simple hash over the date string.
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
