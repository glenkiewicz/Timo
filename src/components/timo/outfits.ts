/**
 * Timo w przebraniu pod wyprawę — te same trzy klipy co zwykły lisek
 * (idle, mówienie, radosne mówienie), wygenerowane z klatki startowej
 * z akcesoriami (scripts/generate-timo-outfit.py → generate-timo-talk.py
 * --start --prefix → process-timo-talk.py). Kadr identyczny ze zwykłym
 * idle, więc lisek stoi w scenie dokładnie tam, gdzie zawsze.
 *
 * Opisy akcesoriów — prompty z scripts/generate-timo-outfit.py.
 * Wyprawa bez wpisu = zwykły lisek.
 */
export type OutfitClips = { idle: number; talk: number; happy: number };

export const OUTFITS: Record<string, OutfitClips> = {
  // a light blue diving mask pushed up on the forehead with a small yellow snorkel attached to its side
  water_friends: {
    idle: require('../../../assets/timo/outfits/water_friends/idle.mp4'),
    talk: require('../../../assets/timo/outfits/water_friends/talk.mp4'),
    happy: require('../../../assets/timo/outfits/water_friends/talk-happy.mp4'),
  },
  // a straw farmer hat with a small wheat stalk tucked into its band
  farm_timo: {
    idle: require('../../../assets/timo/outfits/farm_timo/idle.mp4'),
    talk: require('../../../assets/timo/outfits/farm_timo/talk.mp4'),
    happy: require('../../../assets/timo/outfits/farm_timo/talk-happy.mp4'),
  },
  // a crown of bright tropical leaves on the head and a pink hibiscus flower behind one ear
  green_jungle: {
    idle: require('../../../assets/timo/outfits/green_jungle/idle.mp4'),
    talk: require('../../../assets/timo/outfits/green_jungle/talk.mp4'),
    happy: require('../../../assets/timo/outfits/green_jungle/talk-happy.mp4'),
  },
  // a small brown forest-ranger hat with an oak leaf and an acorn pinned to its band
  forest_kids: {
    idle: require('../../../assets/timo/outfits/forest_kids/idle.mp4'),
    talk: require('../../../assets/timo/outfits/forest_kids/talk.mp4'),
    happy: require('../../../assets/timo/outfits/forest_kids/talk-happy.mp4'),
  },
  // a brown leather aviator cap with round pilot goggles pushed up on the forehead
  flyers: {
    idle: require('../../../assets/timo/outfits/flyers/idle.mp4'),
    talk: require('../../../assets/timo/outfits/flyers/talk.mp4'),
    happy: require('../../../assets/timo/outfits/flyers/talk-happy.mp4'),
  },
  // a soft dark blue nightcap with little yellow stars and a crescent moon, its tip with a pompom
  night_animals: {
    idle: require('../../../assets/timo/outfits/night_animals/idle.mp4'),
    talk: require('../../../assets/timo/outfits/night_animals/talk.mp4'),
    happy: require('../../../assets/timo/outfits/night_animals/talk-happy.mp4'),
  },
  // an orange explorer hard hat and a yellow measuring tape hanging loosely around the neck
  big_animals: {
    idle: require('../../../assets/timo/outfits/big_animals/idle.mp4'),
    talk: require('../../../assets/timo/outfits/big_animals/talk.mp4'),
    happy: require('../../../assets/timo/outfits/big_animals/talk-happy.mp4'),
  },
  // a small round magnifying monocle over one eye and a tiny green cap
  small_animals: {
    idle: require('../../../assets/timo/outfits/small_animals/idle.mp4'),
    talk: require('../../../assets/timo/outfits/small_animals/talk.mp4'),
    happy: require('../../../assets/timo/outfits/small_animals/talk-happy.mp4'),
  },
  // a short red superhero cape tied at the neck, falling behind the back
  scary_animals: {
    idle: require('../../../assets/timo/outfits/scary_animals/idle.mp4'),
    talk: require('../../../assets/timo/outfits/scary_animals/talk.mp4'),
    happy: require('../../../assets/timo/outfits/scary_animals/talk-happy.mp4'),
  },
  // a knitted red winter hat with a white pompom and a striped blue winter scarf
  ice_land: {
    idle: require('../../../assets/timo/outfits/ice_land/idle.mp4'),
    talk: require('../../../assets/timo/outfits/ice_land/talk.mp4'),
    happy: require('../../../assets/timo/outfits/ice_land/talk-happy.mp4'),
  },
  // a small blue pet collar with a shiny golden heart-shaped tag
  home_pets_friends: {
    idle: require('../../../assets/timo/outfits/home_pets_friends/idle.mp4'),
    talk: require('../../../assets/timo/outfits/home_pets_friends/talk.mp4'),
    happy: require('../../../assets/timo/outfits/home_pets_friends/talk-happy.mp4'),
  },
  // a colourful feather tucked behind one ear and a small birdwatcher bucket hat
  feathered: {
    idle: require('../../../assets/timo/outfits/feathered/idle.mp4'),
    talk: require('../../../assets/timo/outfits/feathered/talk.mp4'),
    happy: require('../../../assets/timo/outfits/feathered/talk-happy.mp4'),
  },
  // fluffy soft white earmuffs
  furry: {
    idle: require('../../../assets/timo/outfits/furry/idle.mp4'),
    talk: require('../../../assets/timo/outfits/furry/talk.mp4'),
    happy: require('../../../assets/timo/outfits/furry/talk-happy.mp4'),
  },
  // a headband with two springy antennae ending in little red balls
  bugs_and_worms: {
    idle: require('../../../assets/timo/outfits/bugs_and_worms/idle.mp4'),
    talk: require('../../../assets/timo/outfits/bugs_and_worms/talk.mp4'),
    happy: require('../../../assets/timo/outfits/bugs_and_worms/talk-happy.mp4'),
  },
  // a white safari pith helmet and a pair of small binoculars hanging on a strap on the chest
  savanna_kids: {
    idle: require('../../../assets/timo/outfits/savanna_kids/idle.mp4'),
    talk: require('../../../assets/timo/outfits/savanna_kids/talk.mp4'),
    happy: require('../../../assets/timo/outfits/savanna_kids/talk-happy.mp4'),
  },
  // a headband with two tall soft kangaroo ears in light brown, standing up between the fox ears
  jumpers: {
    idle: require('../../../assets/timo/outfits/jumpers/idle.mp4'),
    talk: require('../../../assets/timo/outfits/jumpers/talk.mp4'),
    happy: require('../../../assets/timo/outfits/jumpers/talk-happy.mp4'),
  },
  // a red-and-white striped lifeguard visor and a silver whistle on a cord around the neck
  swimmers: {
    idle: require('../../../assets/timo/outfits/swimmers/idle.mp4'),
    talk: require('../../../assets/timo/outfits/swimmers/talk.mp4'),
    happy: require('../../../assets/timo/outfits/swimmers/talk-happy.mp4'),
  },
  // a yellow bucket hat with a small banana pattern
  monkey_friends: {
    idle: require('../../../assets/timo/outfits/monkey_friends/idle.mp4'),
    talk: require('../../../assets/timo/outfits/monkey_friends/talk.mp4'),
    happy: require('../../../assets/timo/outfits/monkey_friends/talk-happy.mp4'),
  },
  // a black-and-orange striped knitted beanie and a spotted polka-dot bow tie
  striped_spotted: {
    idle: require('../../../assets/timo/outfits/striped_spotted/idle.mp4'),
    talk: require('../../../assets/timo/outfits/striped_spotted/talk.mp4'),
    happy: require('../../../assets/timo/outfits/striped_spotted/talk-happy.mp4'),
  },
  // a pair of round glasses resting on the snout and a tiny brass trumpet on a cord around the neck
  long_nose: {
    idle: require('../../../assets/timo/outfits/long_nose/idle.mp4'),
    talk: require('../../../assets/timo/outfits/long_nose/talk.mp4'),
    happy: require('../../../assets/timo/outfits/long_nose/talk-happy.mp4'),
  },
  // a navy-blue sea captain's hat with a golden anchor badge
  water_giants: {
    idle: require('../../../assets/timo/outfits/water_giants/idle.mp4'),
    talk: require('../../../assets/timo/outfits/water_giants/talk.mp4'),
    happy: require('../../../assets/timo/outfits/water_giants/talk-happy.mp4'),
  },
  // a headband with big, clearly visible bright green triangular dinosaur spikes running in a row over the top of the head
  dinos_myths: {
    idle: require('../../../assets/timo/outfits/dinos_myths/idle.mp4'),
    talk: require('../../../assets/timo/outfits/dinos_myths/talk.mp4'),
    happy: require('../../../assets/timo/outfits/dinos_myths/talk-happy.mp4'),
  },
  // a cute cap shaped like a green turtle shell with a hexagon pattern, worn on top of the head
  shelled: {
    idle: require('../../../assets/timo/outfits/shelled/idle.mp4'),
    talk: require('../../../assets/timo/outfits/shelled/talk.mp4'),
    happy: require('../../../assets/timo/outfits/shelled/talk-happy.mp4'),
  },
  // a painter's beret with rainbow paint splashes
  colorful: {
    idle: require('../../../assets/timo/outfits/colorful/idle.mp4'),
    talk: require('../../../assets/timo/outfits/colorful/talk.mp4'),
    happy: require('../../../assets/timo/outfits/colorful/talk-happy.mp4'),
  },
};

export function outfitFor(expeditionId?: string | null): OutfitClips | undefined {
  return expeditionId ? OUTFITS[expeditionId] : undefined;
}
