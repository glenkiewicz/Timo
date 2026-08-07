import type { Question } from '@/types/game';

/**
 * Pytania zadawane przez Timo. Każde ma 5 wariantów — w grze losowany jest
 * jeden. Warianty są **dłuższe i bardziej rozbudowane** ("Czy zwierzę, o którym
 * myślisz...") — wydłuża to wypowiedź Timo i daje dziecku 5-7 lat naturalny
 * czas na przemyślenie odpowiedzi.
 *
 * STRATEGIA WARIANTÓW (po reklamacji "za dużo Detektyw pyta —"):
 *  - idx 0: główna rozbudowana forma "Czy zwierzę, o którym myślisz, X?"
 *  - idx 1: krótka konkretna "Czy on/ono X?"
 *  - idx 2: opisowa z przykładem "Czy to stworzenie X, jak Y lub Z?"
 *  - idx 3: nieformalna "A może / Hmm, a czy X?"
 *  - idx 4: różne — kilka pytań ma "Detektyw pyta —" ale tylko ~5 z 38;
 *    większość: alternatywne formy ("Powiedz mi, czy...", "Wiesz, czy...").
 *
 * "Mam pytanie —" / "Detektyw pyta —" są RZADKIE w tej puli, żeby nie nakładać
 * się z detektywskimi prefiksami z timo-lines.ts.
 */
export const QUESTIONS: Question[] = [
  {
    id: 'q_water',
    attribute_key: 'lives_in_water',
    text_pl: 'Czy zwierzę, o którym myślisz, żyje w wodzie?',
    variants: [
      'Czy zwierzę, o którym myślisz, żyje w wodzie?',
      'Czy ono mieszka w wodzie?',
      'Czy to stworzenie spędza większość życia w wodzie, jak ryba lub delfin?',
      'A czy gdybyś chciał go zobaczyć, musiałbyś szukać go w morzu lub jeziorze?',
      'Powiedz mi, czy ten zwierzak ma swój dom w wodzie?',
    ],
  },
  {
    id: 'q_fly',
    attribute_key: 'can_fly',
    text_pl: 'Czy zwierzę, o którym myślisz, potrafi latać?',
    variants: [
      'Czy zwierzę, o którym myślisz, potrafi latać?',
      'Czy on umie latać?',
      'Czy ten zwierzak unosi się w powietrzu, jak ptak lub owad?',
      'A czy mógłbyś go zobaczyć w locie nad głową?',
      'Detektyw pyta — czy potrafi wzbić się do nieba?',
    ],
  },
  {
    id: 'q_fur',
    attribute_key: 'has_fur',
    text_pl: 'Czy zwierzę, o którym myślisz, ma futro?',
    variants: [
      'Czy zwierzę, o którym myślisz, ma futro?',
      'Czy ma futerko?',
      'Czy ten zwierzak jest pokryty miękką sierścią, jak pies lub kot?',
      'A czy gdybyś go pogłaskał, dotknąłbyś futra?',
      'Powiedz mi, czy ma na sobie włochate futerko?',
    ],
  },
  {
    id: 'q_feathers',
    attribute_key: 'has_feathers',
    text_pl: 'Czy zwierzę, o którym myślisz, ma pióra?',
    variants: [
      'Czy zwierzę, o którym myślisz, ma pióra?',
      'Czy ma piórka?',
      'Czy ten zwierzak jest pokryty piórami, takimi jak wróbel lub kura?',
      'A czy gdybyś go dotknął, poczułbyś pióra?',
      'Wiesz co, czy ma na sobie pióra zamiast futra?',
    ],
  },
  {
    id: 'q_scales',
    attribute_key: 'has_scales',
    text_pl: 'Czy zwierzę, o którym myślisz, ma łuski?',
    variants: [
      'Czy zwierzę, o którym myślisz, ma łuski?',
      'Czy ma łuski?',
      'Czy ten zwierzak jest pokryty błyszczącymi łuskami, jak ryba lub wąż?',
      'A czy jego skóra jest łuskowata?',
      'Powiedz mi, czy ma na sobie łuski zamiast futra czy piór?',
    ],
  },
  {
    id: 'q_shell',
    attribute_key: 'has_shell',
    text_pl: 'Czy zwierzę, o którym myślisz, ma twardą skorupę lub pancerz?',
    variants: [
      'Czy zwierzę, o którym myślisz, ma twardą skorupę lub pancerz?',
      'Czy ma skorupę?',
      'Czy ten zwierzak nosi pancerz, jak żółw lub ślimak?',
      'A czy w razie niebezpieczeństwa chowa się w swoją skorupę?',
      'Wiesz, czy jego ciało okrywa twardy pancerz?',
    ],
  },
  {
    id: 'q_mammal',
    attribute_key: 'is_mammal',
    text_pl: 'Czy zwierzę, o którym myślisz, jest ssakiem?',
    variants: [
      'Czy zwierzę, o którym myślisz, jest ssakiem?',
      'Czy to ssak?',
      'Czy to stworzenie należy do ssaków, jak pies, kot lub słoń?',
      'A czy on karmi swoje młode mlekiem?',
      'Powiedz mi, czy mówimy o ciepłokrwistym ssaku?',
    ],
  },
  {
    id: 'q_bird',
    attribute_key: 'is_bird',
    text_pl: 'Czy zwierzę, o którym myślisz, jest ptakiem?',
    variants: [
      'Czy zwierzę, o którym myślisz, jest ptakiem?',
      'Czy to ptak?',
      'Czy to stworzenie należy do ptaków, takich jak wróbel, orzeł lub kura?',
      'A czy ma dziób i pióra, jak prawdziwy ptak?',
      'Powiedz mi, czy mówimy o skrzydlatym ptaku?',
    ],
  },
  {
    id: 'q_fish',
    attribute_key: 'is_fish',
    text_pl: 'Czy zwierzę, o którym myślisz, jest rybą?',
    variants: [
      'Czy zwierzę, o którym myślisz, jest rybą?',
      'Czy to ryba?',
      'Czy to stworzenie należy do ryb, takich jak karp lub łosoś?',
      'A czy ma płetwy i oddycha skrzelami?',
      'Wiesz, czy mówimy o rybie pływającej w wodzie?',
    ],
  },
  {
    id: 'q_reptile',
    attribute_key: 'is_reptile',
    text_pl: 'Czy zwierzę, o którym myślisz, jest gadem?',
    variants: [
      'Czy zwierzę, o którym myślisz, jest gadem?',
      'Czy to gad?',
      'Czy to stworzenie należy do gadów, takich jak wąż, krokodyl lub jaszczurka?',
      'A czy ma zimną krew i suchą, łuskowatą skórę?',
      'Powiedz mi, czy mówimy o pełzającym gadzie?',
    ],
  },
  {
    id: 'q_amphi',
    attribute_key: 'is_amphibian',
    text_pl: 'Czy zwierzę, o którym myślisz, jest płazem?',
    variants: [
      'Czy zwierzę, o którym myślisz, jest płazem?',
      'Czy to płaz?',
      'Czy to stworzenie należy do płazów, takich jak żaba lub salamandra?',
      'A czy żyje i w wodzie, i na lądzie?',
      'Detektyw pyta — czy mówimy o skocznej żabie lub podobnym płazie?',
    ],
  },
  {
    id: 'q_insect',
    attribute_key: 'is_insect',
    text_pl: 'Czy zwierzę, o którym myślisz, jest owadem?',
    variants: [
      'Czy zwierzę, o którym myślisz, jest owadem?',
      'Czy to owad?',
      'Czy to stworzenie należy do owadów, takich jak mrówka, pszczoła lub motyl?',
      'A czy ma sześć nóżek i czasem skrzydła?',
      'Wiesz, czy mówimy o małym pełzającym lub latającym stworzeniu?',
    ],
  },
  {
    id: 'q_bigger_than_dog',
    attribute_key: 'larger_than_dog',
    text_pl: 'Czy zwierzę, o którym myślisz, jest większe od psa?',
    variants: [
      'Czy zwierzę, o którym myślisz, jest większe od psa?',
      'Czy jest większy od psa?',
      'Czy ten zwierzak przerasta rozmiarem zwykłego psa domowego?',
      'A czy gdybyś stanął obok niego, byłby od ciebie większy?',
      'Wiesz, czy to spore zwierzę, większe niż owczarek?',
    ],
  },
  {
    id: 'q_smaller_than_cat',
    attribute_key: 'smaller_than_cat',
    text_pl: 'Czy zwierzę, o którym myślisz, jest mniejsze od kota?',
    variants: [
      'Czy zwierzę, o którym myślisz, jest mniejsze od kota?',
      'Czy jest mniejszy od kota?',
      'Czy ten zwierzak zmieściłby się obok kota i byłby od niego mniejszy?',
      'A czy to taki maluszek, mniejszy nawet od kotka?',
      'Powiedz mi, czy on jest naprawdę drobny?',
    ],
  },
  {
    id: 'q_predator',
    attribute_key: 'is_predator',
    text_pl: 'Czy zwierzę, o którym myślisz, jest drapieżnikiem?',
    variants: [
      'Czy zwierzę, o którym myślisz, jest drapieżnikiem?',
      'Czy to drapieżnik?',
      'Czy ten zwierzak poluje na inne zwierzęta, żeby zdobyć jedzenie?',
      'A czy on zjada mięso i tropi swoje ofiary?',
      'Wiesz, czy on jest myśliwym, jak lew lub wilk?',
    ],
  },
  {
    id: 'q_plants',
    attribute_key: 'eats_plants',
    text_pl: 'Czy zwierzę, o którym myślisz, je głównie rośliny?',
    variants: [
      'Czy zwierzę, o którym myślisz, je głównie rośliny?',
      'Czy je rośliny?',
      'Czy ten zwierzak żywi się trawą, liśćmi lub owocami?',
      'A czy on jest roślinożercą i nie poluje na mięso?',
      'Powiedz mi, czy zjada przede wszystkim zieleninę, jak krowa lub królik?',
    ],
  },
  {
    id: 'q_home',
    attribute_key: 'lives_at_home',
    text_pl: 'Czy ludzie często trzymają to zwierzę w domu?',
    variants: [
      'Czy zwierzę, o którym myślisz, ludzie często trzymają w domu?',
      'Czy bywa zwierzakiem domowym?',
      'Czy ten zwierzak może być czyimś pupilem, mieszkającym z rodziną?',
      'A czy spotkasz go u kogoś w mieszkaniu lub ogrodzie?',
      'Wiesz, czy on nadaje się do domu jak pies lub kot?',
    ],
  },
  {
    id: 'q_africa',
    attribute_key: 'lives_in_africa',
    text_pl: 'Czy zwierzę, o którym myślisz, żyje w Afryce?',
    variants: [
      'Czy zwierzę, o którym myślisz, żyje w Afryce?',
      'Czy mieszka w Afryce?',
      'Czy ten zwierzak ma swój dom na sawannie lub w afrykańskiej dżungli?',
      'A czy spotkasz go w gorącej, słonecznej Afryce?',
      'Powiedz mi, czy biega wśród akacji i pod afrykańskim słońcem?',
    ],
  },
  {
    id: 'q_poland',
    attribute_key: 'lives_in_poland',
    text_pl: 'Czy zwierzę, o którym myślisz, żyje dziko w Polsce?',
    variants: [
      'Czy zwierzę, o którym myślisz, żyje dziko w Polsce?',
      'Czy mieszka dziko w Polsce?',
      'Czy ten zwierzak żyje swobodnie w polskich lasach, na łąkach lub w rzekach?',
      'A czy spotkasz go w polskiej naturze?',
      'Detektyw pyta — czy jest naszym rodakiem z polskiej dziczy?',
    ],
  },
  {
    id: 'q_jungle',
    attribute_key: 'lives_in_jungle',
    text_pl: 'Czy zwierzę, o którym myślisz, żyje w dżungli?',
    variants: [
      'Czy zwierzę, o którym myślisz, żyje w dżungli?',
      'Czy mieszka w dżungli?',
      'Czy ten zwierzak ma swój dom w gęstym, tropikalnym lesie?',
      'A czy spotkasz go wśród lian, drzew i papug?',
      'Wiesz, czy mieszka w gorącej, parnej dżungli?',
    ],
  },
  {
    id: 'q_ocean',
    attribute_key: 'lives_in_ocean',
    text_pl: 'Czy zwierzę, o którym myślisz, żyje w oceanie?',
    variants: [
      'Czy zwierzę, o którym myślisz, żyje w oceanie?',
      'Czy mieszka w oceanie?',
      'Czy ten zwierzak ma swój dom w głębokim, słonym morzu?',
      'A czy spotkasz go w morskiej głębinie, daleko od brzegu?',
      'Powiedz mi, czy pływa po wielkim, otwartym oceanie?',
    ],
  },
  {
    id: 'q_arctic',
    attribute_key: 'lives_in_arctic',
    text_pl: 'Czy zwierzę, o którym myślisz, żyje w lodowych krainach?',
    variants: [
      'Czy zwierzę, o którym myślisz, żyje w lodowych krainach?',
      'Czy żyje na śniegu i lodzie?',
      'Czy ten zwierzak mieszka tam, gdzie zawsze panuje mróz?',
      'A czy chodzi po krze lodowej, jak niedźwiedź polarny?',
      'Wiesz, czy kocha zimno i wieczny lód?',
    ],
  },
  {
    id: 'q_farm',
    attribute_key: 'lives_on_farm',
    text_pl: 'Czy zwierzę, o którym myślisz, żyje na farmie?',
    variants: [
      'Czy zwierzę, o którym myślisz, żyje na farmie?',
      'Czy żyje na farmie?',
      'Czy ten zwierzak mieszka w gospodarstwie, w zagrodzie lub na podwórku?',
      'A czy spotkasz go u rolnika, w stajni lub kurniku?',
      'Powiedz mi, czy jest hodowany przez ludzi na wsi?',
    ],
  },
  {
    id: 'q_tail',
    attribute_key: 'has_tail',
    text_pl: 'Czy zwierzę, o którym myślisz, ma ogon?',
    variants: [
      'Czy zwierzę, o którym myślisz, ma ogon?',
      'Czy ma ogon?',
      'Czy ten zwierzak ma jakiś ogonek lub długi, dumny ogon?',
      'A czy może machać ogonem, jak pies albo kot?',
      'Wiesz, czy z tyłu wystaje mu wyraźny ogon?',
    ],
  },
  {
    id: 'q_legs',
    attribute_key: 'has_legs',
    text_pl: 'Czy zwierzę, o którym myślisz, ma nogi?',
    variants: [
      'Czy zwierzę, o którym myślisz, ma nogi?',
      'Czy ma nogi?',
      'Czy ten zwierzak chodzi, biega lub skacze na własnych nogach?',
      'A czy porusza się na łapach lub kopytach?',
      'Powiedz mi, czy ma chociaż dwie nogi do biegania?',
    ],
  },
  {
    id: 'q_dangerous',
    attribute_key: 'is_dangerous',
    text_pl: 'Czy zwierzę, o którym myślisz, bywa groźne dla ludzi?',
    variants: [
      'Czy zwierzę, o którym myślisz, bywa groźne dla ludzi?',
      'Czy bywa groźne?',
      'Czy ten zwierzak może być niebezpieczny i lepiej trzymać się od niego z daleka?',
      'A czy potrafi ugryźć, ukłuć lub zaatakować człowieka?',
      'Wiesz, czy lepiej go nie podchodzić, bo bywa agresywny?',
    ],
  },
  {
    id: 'q_fast',
    attribute_key: 'is_fast',
    text_pl: 'Czy zwierzę, o którym myślisz, jest naprawdę szybkie?',
    variants: [
      'Czy zwierzę, o którym myślisz, jest naprawdę szybkie?',
      'Czy jest szybki?',
      'Czy ten zwierzak biega błyskawicznie, jak gepard lub koń?',
      'A czy potrafi pędzić jak strzała?',
      'Powiedz mi, czy w wyścigu zostawiłby cię daleko w tyle?',
    ],
  },
  {
    id: 'q_horns',
    attribute_key: 'has_horns',
    text_pl: 'Czy zwierzę, o którym myślisz, ma rogi lub poroże?',
    variants: [
      'Czy zwierzę, o którym myślisz, ma rogi lub poroże?',
      'Czy ma rogi?',
      'Czy ten zwierzak ma na głowie sterczące rogi lub gałęziaste poroże?',
      'A czy widać u niego rogi, jak u jelenia lub krowy?',
      'Wiesz, czy nosi na głowie wystające ozdoby z kości?',
    ],
  },
  {
    id: 'q_nocturnal',
    attribute_key: 'is_nocturnal',
    text_pl: 'Czy zwierzę, o którym myślisz, jest aktywne głównie w nocy?',
    variants: [
      'Czy zwierzę, o którym myślisz, jest aktywne głównie w nocy?',
      'Czy jest nocnym zwierzakiem?',
      'Czy ten zwierzak poluje i biega po zmroku, kiedy inni już śpią?',
      'A czy on śpi w dzień, a budzi się dopiero nocą?',
      'Detektyw pyta — czy kocha noc bardziej niż dzień?',
    ],
  },
  {
    id: 'q_groups',
    attribute_key: 'lives_in_groups',
    text_pl: 'Czy zwierzę, o którym myślisz, żyje w stadzie lub grupie?',
    variants: [
      'Czy zwierzę, o którym myślisz, żyje w stadzie lub grupie?',
      'Czy żyje w stadzie?',
      'Czy ten zwierzak trzyma się razem z innymi, w stadzie lub kolonii?',
      'A czy nie lubi być sam i zawsze chodzi z towarzyszami?',
      'Powiedz mi, czy to zwierzę towarzyskie, lubiące dużą rodzinę?',
    ],
  },
  {
    id: 'q_venomous',
    attribute_key: 'is_venomous',
    text_pl: 'Czy zwierzę, o którym myślisz, jest jadowite?',
    variants: [
      'Czy zwierzę, o którym myślisz, jest jadowite?',
      'Czy jest jadowite?',
      'Czy ten zwierzak ma jad, którym potrafi ukąsić lub użądlić?',
      'A czy jego ugryzienie lub użądlenie może być groźne?',
      'Wiesz, czy mówimy o jadowitym przeciwniku?',
    ],
  },
  {
    id: 'q_forest',
    attribute_key: 'lives_in_forest',
    text_pl: 'Czy zwierzę, o którym myślisz, mieszka w lesie?',
    variants: [
      'Czy zwierzę, o którym myślisz, mieszka w lesie?',
      'Czy mieszka w lesie?',
      'Czy ten zwierzak ma swój dom wśród drzew, krzewów i mchu?',
      'A czy biega między pniami, jak sarna lub lis?',
      'Powiedz mi, czy spotkasz go w głębi lasu, daleko od miasta?',
    ],
  },
  {
    id: 'q_barks',
    attribute_key: 'barks',
    text_pl: 'Czy zwierzę, o którym myślisz, szczeka?',
    variants: [
      'Czy zwierzę, o którym myślisz, szczeka?',
      'Czy szczeka?',
      'Czy ten zwierzak wydaje głośne hau-hau, jak pies na podwórku?',
      'A czy słychać u niego szczekanie?',
      'Wiesz, czy porozumiewa się szczekaniem?',
    ],
  },
  {
    id: 'q_meows',
    attribute_key: 'meows',
    text_pl: 'Czy zwierzę, o którym myślisz, miauczy lub mruczy?',
    variants: [
      'Czy zwierzę, o którym myślisz, miauczy lub mruczy?',
      'Czy miauczy?',
      'Czy ten zwierzak wydaje miau-miau lub przyjazne mruczenie?',
      'A czy mruczy gdy jest zadowolony, jak kotek?',
      'Powiedz mi, czy słychać u niego kocie odgłosy?',
    ],
  },
  {
    id: 'q_rodent',
    attribute_key: 'is_rodent',
    text_pl: 'Czy zwierzę, o którym myślisz, jest gryzoniem?',
    variants: [
      'Czy zwierzę, o którym myślisz, jest gryzoniem?',
      'Czy to gryzoń?',
      'Czy ten zwierzak należy do gryzoni, takich jak myszka, chomik lub szczur?',
      'A czy ma duże, ostre siekacze i lubi gryźć?',
      'Wiesz, czy on jest mały i zalicza się do gryzoni?',
    ],
  },
  {
    id: 'q_primate',
    attribute_key: 'is_primate',
    text_pl: 'Czy zwierzę, o którym myślisz, jest małpą?',
    variants: [
      'Czy zwierzę, o którym myślisz, jest małpą?',
      'Czy to małpa?',
      'Czy to stworzenie należy do naczelnych, jak szympans lub goryl?',
      'A czy huśta się na drzewach i ma zręczne łapy?',
      'Powiedz mi, czy mówimy o małpce lub jej krewnym?',
    ],
  },
  {
    id: 'q_long_ears',
    attribute_key: 'has_long_ears',
    text_pl: 'Czy zwierzę, o którym myślisz, ma długie uszy?',
    variants: [
      'Czy zwierzę, o którym myślisz, ma długie uszy?',
      'Czy ma długie uszy?',
      'Czy ten zwierzak ma duże, sterczące uszy, jak królik lub osioł?',
      'A czy widać u niego wyraźne, długie uszy?',
      'Wiesz, czy wyróżnia się długimi uszami?',
    ],
  },
  {
    id: 'q_marsupial',
    attribute_key: 'is_marsupial',
    text_pl: 'Czy zwierzę, o którym myślisz, nosi młode w torbie na brzuchu?',
    variants: [
      'Czy zwierzę, o którym myślisz, nosi młode w torbie na brzuchu?',
      'Czy to torbacz?',
      'Czy ten zwierzak ma kieszonkę, w której nosi swoje dziecko?',
      'A czy to torbacz, jak kangur lub koala?',
      'Detektyw pyta — czy mówimy o australijskim torbaczu?',
    ],
  },
];

/**
 * Losuje jedną z wersji pytania (text_pl lub jeden z `variants`).
 * Zwraca tekst + voiceKey do odtworzenia MP3 (z voice-manifest.ts).
 */
export function pickQuestionVariant(q: Question): { text: string; voiceKey: string } {
  if (!q.variants || q.variants.length === 0) {
    // Brak variants — używamy text_pl. voiceKey wskazuje na variant.0 bo skrypt
    // generujący zawsze zapisuje co najmniej `question.{id}.0` (z text_pl).
    return { text: q.text_pl, voiceKey: `question.${q.id}.0` };
  }
  const idx = Math.floor(Math.random() * q.variants.length);
  return { text: q.variants[idx], voiceKey: `question.${q.id}.${idx}` };
}
