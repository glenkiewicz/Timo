import type { Question } from '@/types/game';

/**
 * Pytania zadawane przez Timo. Każde ma kilka wariantów — w grze losowany jest jeden,
 * żeby brzmienie się nie powtarzało. Warianty są bardziej rozbudowane niż text_pl,
 * z naturalnymi formami dla dzieci ("Czy to zwierzę…", "Czy ono…", "Może…").
 */
export const QUESTIONS: Question[] = [
  {
    id: 'q_water',
    attribute_key: 'lives_in_water',
    text_pl: 'Czy to zwierzę żyje w wodzie?',
    variants: [
      'Czy to zwierzę żyje w wodzie?',
      'Czy ono mieszka w wodzie?',
      'Czy spotkasz je w wodzie?',
    ],
  },
  {
    id: 'q_fly',
    attribute_key: 'can_fly',
    text_pl: 'Czy potrafi latać?',
    variants: [
      'Czy to zwierzę potrafi latać?',
      'Czy ono lata?',
      'Czy umie latać?',
      'Czy lata w powietrzu?',
    ],
  },
  {
    id: 'q_fur',
    attribute_key: 'has_fur',
    text_pl: 'Czy ma futro?',
    variants: [
      'Czy to zwierzę ma futro?',
      'Czy ono ma futerko?',
      'Czy pokryte jest futrem?',
    ],
  },
  {
    id: 'q_feathers',
    attribute_key: 'has_feathers',
    text_pl: 'Czy ma pióra?',
    variants: [
      'Czy to zwierzę ma pióra?',
      'Czy ono ma pióra?',
      'Czy pokryte jest piórami?',
    ],
  },
  {
    id: 'q_scales',
    attribute_key: 'has_scales',
    text_pl: 'Czy ma łuski?',
    variants: [
      'Czy to zwierzę ma łuski?',
      'Czy ono ma łuski?',
      'Czy jest pokryte łuskami?',
    ],
  },
  {
    id: 'q_shell',
    attribute_key: 'has_shell',
    text_pl: 'Czy ma twardą skorupę?',
    variants: [
      'Czy to zwierzę ma twardą skorupę?',
      'Czy ono jest schowane w skorupie?',
      'Czy ma pancerz lub skorupę?',
    ],
  },
  {
    id: 'q_mammal',
    attribute_key: 'is_mammal',
    text_pl: 'Czy to ssak?',
    variants: [
      'Czy to ssak?',
      'Czy to zwierzę jest ssakiem?',
      'Czy mówimy o ssaku?',
    ],
  },
  {
    id: 'q_bird',
    attribute_key: 'is_bird',
    text_pl: 'Czy to ptak?',
    variants: [
      'Czy to ptak?',
      'Czy to zwierzę jest ptakiem?',
      'Czy mówimy o ptaku?',
    ],
  },
  {
    id: 'q_fish',
    attribute_key: 'is_fish',
    text_pl: 'Czy to ryba?',
    variants: [
      'Czy to ryba?',
      'Czy to zwierzę jest rybą?',
      'Czy mówimy o rybie?',
    ],
  },
  {
    id: 'q_reptile',
    attribute_key: 'is_reptile',
    text_pl: 'Czy to gad?',
    variants: [
      'Czy to gad?',
      'Czy to zwierzę jest gadem?',
      'Czy mówimy o gadzie?',
    ],
  },
  {
    id: 'q_amphi',
    attribute_key: 'is_amphibian',
    text_pl: 'Czy to płaz?',
    variants: [
      'Czy to płaz?',
      'Czy to zwierzę jest płazem?',
      'Czy mówimy o płazie?',
    ],
  },
  {
    id: 'q_insect',
    attribute_key: 'is_insect',
    text_pl: 'Czy to owad?',
    variants: [
      'Czy to owad?',
      'Czy to zwierzę jest owadem?',
      'Czy mówimy o owadzie?',
    ],
  },
  {
    id: 'q_bigger_than_dog',
    attribute_key: 'larger_than_dog',
    text_pl: 'Czy jest większe od psa?',
    variants: [
      'Czy to zwierzę jest większe od psa?',
      'Czy ono jest większe niż pies?',
      'Czy przerasta rozmiarem psa?',
    ],
  },
  {
    id: 'q_smaller_than_cat',
    attribute_key: 'smaller_than_cat',
    text_pl: 'Czy jest mniejsze od kota?',
    variants: [
      'Czy to zwierzę jest mniejsze od kota?',
      'Czy ono jest mniejsze niż kot?',
      'Czy zmieściłoby się obok kota?',
    ],
  },
  {
    id: 'q_predator',
    attribute_key: 'is_predator',
    text_pl: 'Czy to drapieżnik?',
    variants: [
      'Czy to drapieżnik?',
      'Czy to zwierzę jest drapieżnikiem?',
      'Czy ono poluje na inne zwierzęta?',
    ],
  },
  {
    id: 'q_plants',
    attribute_key: 'eats_plants',
    text_pl: 'Czy je głównie rośliny?',
    variants: [
      'Czy to zwierzę je głównie rośliny?',
      'Czy ono żywi się roślinami?',
      'Czy zjada przede wszystkim trawę i liście?',
    ],
  },
  {
    id: 'q_home',
    attribute_key: 'lives_at_home',
    text_pl: 'Czy ludzie trzymają je w domu?',
    variants: [
      'Czy ludzie trzymają to zwierzę w domu?',
      'Czy ono może mieszkać w domu?',
      'Czy bywa zwierzakiem domowym?',
    ],
  },
  {
    id: 'q_africa',
    attribute_key: 'lives_in_africa',
    text_pl: 'Czy żyje w Afryce?',
    variants: [
      'Czy to zwierzę żyje w Afryce?',
      'Czy ono mieszka w Afryce?',
      'Czy spotkasz je na afrykańskiej sawannie?',
    ],
  },
  {
    id: 'q_poland',
    attribute_key: 'lives_in_poland',
    text_pl: 'Czy żyje dziko w Polsce?',
    variants: [
      'Czy to zwierzę żyje dziko w Polsce?',
      'Czy ono mieszka w polskiej naturze?',
      'Czy spotkasz je dziko w Polsce?',
    ],
  },
  {
    id: 'q_jungle',
    attribute_key: 'lives_in_jungle',
    text_pl: 'Czy żyje w dżungli?',
    variants: [
      'Czy to zwierzę żyje w dżungli?',
      'Czy ono mieszka w dżungli?',
      'Czy spotkasz je w gęstej dżungli?',
    ],
  },
  {
    id: 'q_ocean',
    attribute_key: 'lives_in_ocean',
    text_pl: 'Czy żyje w oceanie?',
    variants: [
      'Czy to zwierzę żyje w oceanie?',
      'Czy ono mieszka w oceanie?',
      'Czy spotkasz je w morskiej głębinie?',
    ],
  },
  {
    id: 'q_arctic',
    attribute_key: 'lives_in_arctic',
    text_pl: 'Czy żyje w lodowych krainach?',
    variants: [
      'Czy to zwierzę żyje w lodowych krainach?',
      'Czy ono mieszka w arktycznym chłodzie?',
      'Czy spotkasz je na śniegu i lodzie?',
    ],
  },
  {
    id: 'q_farm',
    attribute_key: 'lives_on_farm',
    text_pl: 'Czy żyje na farmie?',
    variants: [
      'Czy to zwierzę żyje na farmie?',
      'Czy ono mieszka w gospodarstwie?',
      'Czy spotkasz je w wiejskiej zagrodzie?',
    ],
  },
  {
    id: 'q_tail',
    attribute_key: 'has_tail',
    text_pl: 'Czy ma ogon?',
    variants: [
      'Czy to zwierzę ma ogon?',
      'Czy ono ma ogon?',
      'Czy ma jakiś ogonek lub ogon?',
    ],
  },
  {
    id: 'q_legs',
    attribute_key: 'has_legs',
    text_pl: 'Czy ma nogi?',
    variants: [
      'Czy to zwierzę ma nogi?',
      'Czy ono ma nogi?',
      'Czy porusza się na nogach?',
    ],
  },
  {
    id: 'q_dangerous',
    attribute_key: 'is_dangerous',
    text_pl: 'Czy bywa groźne dla ludzi?',
    variants: [
      'Czy to zwierzę bywa groźne dla ludzi?',
      'Czy ono może być niebezpieczne?',
      'Czy lepiej trzymać się od niego z daleka?',
    ],
  },
  {
    id: 'q_fast',
    attribute_key: 'is_fast',
    text_pl: 'Czy jest naprawdę szybkie?',
    variants: [
      'Czy to zwierzę jest naprawdę szybkie?',
      'Czy ono biega bardzo szybko?',
      'Czy potrafi pędzić jak strzała?',
    ],
  },
  {
    id: 'q_horns',
    attribute_key: 'has_horns',
    text_pl: 'Czy ma rogi lub poroże?',
    variants: [
      'Czy to zwierzę ma rogi lub poroże?',
      'Czy ono ma rogi?',
      'Czy widać u niego poroże?',
    ],
  },
  {
    id: 'q_nocturnal',
    attribute_key: 'is_nocturnal',
    text_pl: 'Czy jest aktywne głównie w nocy?',
    variants: [
      'Czy to zwierzę jest aktywne głównie w nocy?',
      'Czy ono poluje i biega po zmroku?',
      'Czy żyje przede wszystkim nocą?',
    ],
  },
  {
    id: 'q_groups',
    attribute_key: 'lives_in_groups',
    text_pl: 'Czy żyje w stadzie lub grupie?',
    variants: [
      'Czy to zwierzę żyje w stadzie?',
      'Czy ono mieszka w grupie?',
      'Czy trzyma się w stadzie lub kolonii?',
    ],
  },
  {
    id: 'q_venomous',
    attribute_key: 'is_venomous',
    text_pl: 'Czy jest jadowite?',
    variants: [
      'Czy to zwierzę jest jadowite?',
      'Czy ono ma jad?',
      'Czy potrafi ukąsić jadem?',
    ],
  },
  {
    id: 'q_forest',
    attribute_key: 'lives_in_forest',
    text_pl: 'Czy mieszka w lesie?',
    variants: [
      'Czy to zwierzę mieszka w lesie?',
      'Czy ono żyje wśród drzew?',
      'Czy spotkasz je w głębi lasu?',
    ],
  },
  {
    id: 'q_barks',
    attribute_key: 'barks',
    text_pl: 'Czy to zwierzę szczeka?',
    variants: [
      'Czy to zwierzę szczeka?',
      'Czy ono szczeka?',
      'Czy słychać u niego szczekanie?',
    ],
  },
  {
    id: 'q_meows',
    attribute_key: 'meows',
    text_pl: 'Czy miauczy albo mruczy?',
    variants: [
      'Czy to zwierzę miauczy albo mruczy?',
      'Czy ono potrafi miauczeć lub mruczeć?',
      'Czy słychać u niego miauczenie?',
    ],
  },
  {
    id: 'q_rodent',
    attribute_key: 'is_rodent',
    text_pl: 'Czy to gryzoń?',
    variants: [
      'Czy to gryzoń?',
      'Czy to zwierzę jest gryzoniem?',
      'Czy ono lubi gryźć i ma duże siekacze?',
    ],
  },
  {
    id: 'q_primate',
    attribute_key: 'is_primate',
    text_pl: 'Czy to małpa?',
    variants: [
      'Czy to małpa?',
      'Czy to zwierzę jest małpą?',
      'Czy mówimy o naczelnym?',
    ],
  },
  {
    id: 'q_long_ears',
    attribute_key: 'has_long_ears',
    text_pl: 'Czy ma długie uszy?',
    variants: [
      'Czy to zwierzę ma długie uszy?',
      'Czy ono ma duże, długie uszy?',
      'Czy widać u niego sterczące długie uszy?',
    ],
  },
  {
    id: 'q_marsupial',
    attribute_key: 'is_marsupial',
    text_pl: 'Czy nosi małe w kieszonce na brzuchu?',
    variants: [
      'Czy to zwierzę nosi małe w kieszonce na brzuchu?',
      'Czy ono ma torbę na brzuchu, w której nosi młode?',
      'Czy jest torbaczem?',
    ],
  },
];

/**
 * Losuje jedną z wersji pytania (text_pl lub jeden z `variants`).
 */
export function pickQuestionVariant(q: Question): string {
  if (!q.variants || q.variants.length === 0) return q.text_pl;
  const idx = Math.floor(Math.random() * q.variants.length);
  return q.variants[idx];
}
