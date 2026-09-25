import type { Question } from '@/types/game';

/**
 * Pytania Timo — lisa-detektywa. Każde pytanie ma własny charakter:
 *
 *  - `core`   — 3 czyste, dokładne wersje. Nie zmieniają sensu atrybutu,
 *               bo dziecko odpowiada zgodnie z prawdą, a silnik na tym liczy.
 *               [0] = forma kanoniczna („Czy twoje zwierzę…?”), [1] = z przykładami,
 *               [2] = krótka.
 *  - `setups` — żart albo zdanie z charakterem PRZED pytaniem. Zamknięte zdanie
 *               („.” lub „!”), więc pasuje do każdego rdzenia.
 *  - `onYes` / `onNo` — reakcje związane z tematem pytania.
 *
 * Zasady tekstów (pilnuje ich `scripts/validate-timo-lines.ts`):
 *  - słowa, które zna przedszkolak; trudne pojęcie zawsze z przykładem,
 *  - zwierzę = „ono” (twoje zwierzę → je, jego, mu),
 *  - bez płci dziecka: żadnych „chciałeś”, „mógłbyś”, „przechytrzyłeś”,
 *  - bez „Wiesz, czy…”, „Powiedz mi, czy…” i „A czy…” na początku,
 *  - żart nigdy nie wyśmiewa dziecka.
 *
 * Stałe gagi Timo: dumny nos, gubiona lupa, jagody i kanapki z serem,
 * strach przed wodą, rude futro i puszysty ogon.
 */
export const QUESTIONS: Question[] = [
  {
    id: 'q_water',
    attribute_key: 'lives_in_water',
    core: [
      'Czy twoje zwierzę żyje w wodzie?',
      'Czy mieszka w wodzie, jak ryba albo delfin?',
      'Czy spędza dużo czasu w wodzie?',
    ],
    setups: [
      'Ja do wody wchodzę tylko w kaloszach.',
      'Plum! To będzie mokre pytanie.',
      'Trzymaj kciuki, bo nie umiem pływać!',
    ],
    onYes: ['Plusk! Zakładam płetwy.', 'Wodny trop! Dobrze, że wziąłem ręcznik.'],
    onNo: ['Suchy ląd! Moje łapki się cieszą.', 'Czyli bez moczenia ogona. Hurra!'],
  },
  {
    id: 'q_fly',
    attribute_key: 'can_fly',
    core: [
      'Czy twoje zwierzę umie latać?',
      'Czy potrafi latać, jak ptak albo motyl?',
      'Czy lata w powietrzu?',
    ],
    setups: [
      'Ja raz próbowałem latać. Wylądowałem w krzakach.',
      'Szu, szu! Teraz pytanie prosto z chmur.',
      'Patrzę w niebo… i zaraz potknę się o własny ogon.',
    ],
    onYes: ['Fiu! Zadzieram głowę do góry.', 'Lata! A ja umiem tylko wysoko skakać.'],
    onNo: ['Chodzi po ziemi, tak jak ja. Tup, tup!', 'Nie lata. Nie muszę patrzeć w chmury.'],
  },
  {
    id: 'q_fur',
    attribute_key: 'has_fur',
    core: [
      'Czy twoje zwierzę ma futro?',
      'Czy ma futro albo sierść, jak pies czy kot?',
      'Czy ma futerko?',
    ],
    setups: [
      'Moje rude futro jest najpiękniejsze. Tak mówi moja mama.',
      'A psik! Coś mnie łaskocze w nos.',
      'Teraz pytanie puszyste.',
    ],
    onYes: ['Futrzak! Aż chce się go przytulić.', 'Mięciutko! Notuję.'],
    onNo: ['Bez futra. Mam nadzieję, że nie marznie!', 'Nie futrzak. Mój grzebień do futra odpoczywa.'],
  },
  {
    id: 'q_feathers',
    attribute_key: 'has_feathers',
    core: [
      'Czy twoje zwierzę ma pióra?',
      'Czy jest pokryte piórami, jak kura albo wróbel?',
      'Czy ma piórka?',
    ],
    setups: [
      'Kiedyś włożyłem sobie pióro za ucho. Wyglądałem bardzo elegancko!',
      'Teraz pytanie lekkie jak piórko.',
    ],
    onYes: ['Pióra! Uważaj, zaraz kichnę.', 'Pierzasty trop! Notuję.'],
    onNo: ['Bez piór. Nikt mnie nie połaskocze.', 'Żadnych piórek. Skreślam.'],
  },
  {
    id: 'q_scales',
    attribute_key: 'has_scales',
    core: [
      'Czy twoje zwierzę ma łuski?',
      'Czy jego skóra jest pokryta łuskami, jak u ryby albo węża?',
      'Czy ma na ciele łuski?',
    ],
    setups: [
      'Łuski wyglądają jak malutkie kafelki w łazience!',
      'Wyciągam lupę. Będę liczyć łuski!',
    ],
    onYes: ['Łuski! Błyszczy jak skarb.', 'Łuskowy trop! Notuję.'],
    onNo: ['Bez łusek. Chowam lupę do kieszeni.', 'Żadnych łusek. Skreślam.'],
  },
  {
    id: 'q_shell',
    attribute_key: 'has_shell',
    core: [
      'Czy twoje zwierzę ma twardą skorupę albo pancerz?',
      'Czy nosi na sobie skorupę, jak żółw albo ślimak?',
      'Czy ma twardą skorupę?',
    ],
    setups: [
      'Stuk, stuk! Pukam w pancerz.',
      'Chciałbym mieć pancerz. Nic by nie bolało, jak się przewrócę!',
    ],
    onYes: ['Stuk, stuk! Twardziel!', 'Pancerz! Żaden deszcz mu nie straszny.'],
    onNo: ['Bez skorupy. Skreślam żółwie.', 'Bez pancerza. Notuję.'],
  },
  {
    id: 'q_mammal',
    attribute_key: 'is_mammal',
    core: [
      'Czy twoje zwierzę jest ssakiem, jak pies, krowa albo słoń?',
      'Czy to ssak, tak jak kot albo ja?',
      'Czy mama tego zwierzęcia karmi maluchy mlekiem?',
    ],
    setups: ['Ja jestem ssakiem. I ty też!', 'Teraz pytanie z mlekiem w tle. Mniam!'],
    onYes: ['Ssak jak ja! Przybij łapę.', 'Nasza ssacza rodzinka rośnie!'],
    onNo: ['Nie ssak! Skreślam psy, koty… i siebie.', 'Oho, robi się ciekawie.'],
  },
  {
    id: 'q_bird',
    attribute_key: 'is_bird',
    core: [
      'Czy twoje zwierzę jest ptakiem?',
      'Czy to ptak, jak wróbel, orzeł albo kura?',
      'Czy to jakiś ptak?',
    ],
    setups: [
      'Ćwir, ćwir! Ptaszki mówią, że to ważne pytanie.',
      'Ptaki zawsze budzą mnie rano. Ziew!',
    ],
    onYes: ['Ptak! Rozsypuję okruszki.', 'Ćwir, ćwir! Notuję.'],
    onNo: ['Nie ptak. Okruszki zjem sam.', 'Żadnych dziobów. Skreślam.'],
  },
  {
    id: 'q_fish',
    attribute_key: 'is_fish',
    core: [
      'Czy twoje zwierzę jest rybą?',
      'Czy to ryba, jak karp albo złota rybka?',
      'Czy to jakaś ryba?',
    ],
    setups: [
      'Bul, bul, bul! Tak mówią ryby. Chyba.',
      'Ryby nigdy nie odpowiadają na moje pytania. Dlatego pytam ciebie!',
    ],
    onYes: ['Ryba! Bul, bul, notuję.', 'Rybka! Dobrze, że nie muszę nurkować.'],
    onNo: ['Nie ryba. Chowam wędkę.', 'Żadna rybka. Skreślam.'],
  },
  {
    id: 'q_reptile',
    attribute_key: 'is_reptile',
    core: [
      'Czy twoje zwierzę jest gadem, jak wąż, jaszczurka albo krokodyl?',
      'Czy to gad, na przykład żółw albo jaszczurka?',
      'Czy to gad?',
    ],
    setups: ['Sss! Teraz pytanie, które syczy.', 'Gady lubią wygrzewać się na słońcu. Ja też!'],
    onYes: ['Gad! Sss… notuję.', 'Gad! Wygrzewam się razem z nim.'],
    onNo: ['Nie gad. Nic tu nie syczy.', 'Żadnych gadów. Skreślam.'],
  },
  {
    id: 'q_amphi',
    attribute_key: 'is_amphibian',
    core: [
      'Czy twoje zwierzę jest płazem, jak żaba albo traszka?',
      'Czy to płaz, czyli ktoś z rodziny żab?',
      'Czy jako maluch było kijanką?',
    ],
    setups: [
      'Kum, kum! To pytanie przyskakuje prosto z bagna.',
      'Kiedyś połknąłem muchę przez pomyłkę. Fuj!',
    ],
    onYes: ['Kum, kum! Wskakuję na liść.', 'Płaz! Mój nos czuje bagienko.'],
    onNo: ['Żadna żabka. Skreślam bagno.', 'Nie płaz. Muchy mogą spać spokojnie.'],
  },
  {
    id: 'q_insect',
    attribute_key: 'is_insect',
    core: [
      'Czy twoje zwierzę jest owadem, jak mrówka, pszczoła albo motyl?',
      'Czy ma sześć nóżek?',
      'Czy to owad?',
    ],
    setups: [
      'Bzzz! Coś mi lata koło ucha.',
      'Liczę nóżki: raz, dwa, trzy… Ojej, pogubiłem się!',
    ],
    onYes: ['Owad! Wyciągam największą lupę.', 'Bzyk! Maleńki trop.'],
    onNo: ['Nie owad. Mogę przestać liczyć nóżki.', 'Bez bzyczenia. Notuję.'],
  },
  {
    id: 'q_bigger_than_dog',
    attribute_key: 'larger_than_dog',
    core: [
      'Czy twoje zwierzę jest większe od psa?',
      'Czy jest duże, większe od psa, jak krowa albo koń?',
      'Czy jest większe niż pies?',
    ],
    setups: [
      'Mój kolega pies jest wysoki na trzy kanapki.',
      'Stawiam psa obok i porównuję. Siad, piesku!',
    ],
    onYes: ['Duże! Muszę wejść na krzesło, żeby wszystko zobaczyć.', 'Olbrzym! Mój notes jest za mały.'],
    onNo: ['Nie większe od psa. Mieści się w notesie!', 'Mniejsze od psa. Notuję.'],
  },
  {
    id: 'q_smaller_than_cat',
    attribute_key: 'smaller_than_cat',
    core: [
      'Czy twoje zwierzę jest mniejsze od kota?',
      'Czy jest mniejsze od kota, jak mysz albo wróbel?',
      'Czy to zwierzę jest mniejsze niż kot?',
    ],
    setups: [
      'Wyciągam miarkę… o nie, to moja skarpetka!',
      'Wyobraź sobie kota. A teraz porównujemy!',
      'Mierzymy! Kot będzie naszą linijką.',
    ],
    onYes: ['Maluszek! Przysuwam lupę bliżej.', 'Małe, ale na pewno sprytne.'],
    onNo: ['Większe od kota! Robię miejsce w notesie.', 'O, ktoś słusznych rozmiarów.'],
  },
  {
    id: 'q_predator',
    attribute_key: 'is_predator',
    core: [
      'Czy twoje zwierzę poluje na inne zwierzęta?',
      'Czy łapie inne zwierzęta, żeby je zjeść?',
      'Czy to drapieżnik, jak wilk albo lew?',
    ],
    setups: [
      'Ja poluję głównie na jagody i kanapki z serem.',
      'Kłap, kłap! Teraz pytanie z pazurem.',
      'Chowam ogon, bo to groźne pytanie.',
    ],
    onYes: ['Groźnie! Dobrze, że mnie nie goni.', 'Myśliwy! Chowam się za lupą.'],
    onNo: ['Uff, łagodniak. Mogę odetchnąć.', 'Nie poluje? Pewnie woli sałatkę.'],
  },
  {
    id: 'q_plants',
    attribute_key: 'eats_plants',
    core: [
      'Czy twoje zwierzę je głównie rośliny?',
      'Czy je głównie trawę, liście albo owoce, jak krowa czy królik?',
      'Czy to roślinożerca, który je głównie rośliny?',
    ],
    setups: ['Ja nie lubię sałaty. Wolę jagody!', 'Chrup, chrup! Teraz pytanie o jedzenie.'],
    onYes: ['Roślinożerca! Podaję marchewkę.', 'Chrup, chrup, sałatka! Notuję.'],
    onNo: ['Nie je głównie roślin. Chowam marchewkę.', 'Sałata może odpocząć. Notuję.'],
  },
  {
    id: 'q_home',
    attribute_key: 'lives_at_home',
    core: [
      'Czy ludzie trzymają takie zwierzę w domu?',
      'Czy może mieszkać z ludźmi w domu, jak pies albo chomik?',
      'Czy to zwierzę bywa czyimś pupilem w domu?',
    ],
    setups: ['Ja mieszkam w norce. Kanapy tam nie mam.', 'Puk, puk! Zaglądam do domów.'],
    onYes: ['Domowy przyjaciel! Szukam miski na podłodze.', 'Pupil! Ktoś go pewnie drapie za uchem.'],
    onNo: ['Nie mieszka w domu. Kanapa wolna!', 'Dzikus! Notuję.'],
  },
  {
    id: 'q_africa',
    attribute_key: 'lives_in_africa',
    core: [
      'Czy twoje zwierzę żyje w Afryce?',
      'Czy mieszka w Afryce, jak lew albo żyrafa?',
      'Czy spotkasz je w Afryce?',
    ],
    setups: [
      'Pakuję kapelusz od słońca. Lecimy daleko!',
      'W Afryce jest tak gorąco, że mój ogon by się opalił.',
    ],
    onYes: ['Afryka! Zakładam kapelusz.', 'Gorący trop! Dosłownie.'],
    onNo: ['Nie Afryka. Kapelusz zostaje w szafie.', 'Nie z Afryki. Skreślam sawannę.'],
  },
  {
    id: 'q_poland',
    attribute_key: 'lives_in_poland',
    core: [
      'Czy twoje zwierzę żyje dziko w Polsce?',
      'Czy można je spotkać na wolności w Polsce, w lesie, na łące albo w rzece?',
      'Czy żyje na wolności w Polsce?',
    ],
    setups: [
      'Ja mieszkam w polskim lesie. Mam tu mnóstwo sąsiadów!',
      'Teraz pytanie bardzo blisko domu.',
    ],
    onYes: ['Nasz sąsiad! Może nawet się znamy.', 'Polski trop! Macham łapą na powitanie.'],
    onNo: ['Nie w Polsce. Szukamy dalej na mapie.', 'Mieszka daleko stąd. Notuję.'],
  },
  {
    id: 'q_jungle',
    attribute_key: 'lives_in_jungle',
    core: [
      'Czy twoje zwierzę żyje w dżungli?',
      'Czy mieszka w dżungli, wśród lian i papug?',
      'Czy jego domem jest gorąca dżungla?',
    ],
    setups: [
      'Uuu-aaa! Tak woła dżungla.',
      'W dżungli jest tak gęsto, że zgubiłem tam kiedyś lupę.',
    ],
    onYes: ['Dżungla! Huśtam się na lianie.', 'Tropikalny trop! Notuję.'],
    onNo: ['Nie dżungla. Liany mogą odpocząć.', 'Bez dżungli. Skreślam.'],
  },
  {
    id: 'q_ocean',
    attribute_key: 'lives_in_ocean',
    core: [
      'Czy twoje zwierzę żyje w morzu albo w oceanie?',
      'Czy mieszka w słonym morzu, jak rekin albo delfin?',
      'Czy spotkasz je w morzu?',
    ],
    setups: ['Szum, szum… to fale morskie.', 'Raz napiłem się morskiej wody. Bleee, słona!'],
    onYes: ['Morze! Szum fal w moim notesie.', 'Morski trop! Ahoj!'],
    onNo: ['Nie z morza. Muszelki zostają na plaży.', 'Bez morskich fal. Notuję.'],
  },
  {
    id: 'q_arctic',
    attribute_key: 'lives_in_arctic',
    core: [
      'Czy twoje zwierzę żyje tam, gdzie jest śnieg i lód?',
      'Czy mieszka w lodowej krainie, jak niedźwiedź polarny albo pingwin?',
      'Czy żyje wśród śniegu i lodu?',
    ],
    setups: ['Brrr! Już mi zimno w ogon.', 'Zakładam szalik, czapkę i trzy pary skarpetek.'],
    onYes: ['Lodowa kraina! Brrr, dzwonią mi zęby.', 'Mroźny trop! Nos mi zamarzł.'],
    onNo: ['Nie z lodu. Szalik mogę zdjąć.', 'Tam, gdzie cieplej. Notuję.'],
  },
  {
    id: 'q_farm',
    attribute_key: 'lives_on_farm',
    core: [
      'Czy twoje zwierzę żyje na farmie?',
      'Czy mieszka u rolnika, w stajni, w chlewiku albo w kurniku?',
      'Czy spotkasz je w gospodarstwie na wsi?',
    ],
    setups: [
      'Ko-ko-ko, mu-u, be-e! Ale tu głośno.',
      'Kiedyś zakradłem się do kurnika. Kury okropnie na mnie nakrzyczały!',
    ],
    onYes: ['Farma! Kukuryku, notuję.', 'Wiejski trop! Pachnie sianem.'],
    onNo: ['Nie z farmy. Kury odetchnęły.', 'Nie mieszka u rolnika. Skreślam.'],
  },
  {
    id: 'q_tail',
    attribute_key: 'has_tail',
    core: ['Czy twoje zwierzę ma ogon?', 'Czy ma ogon, krótki albo długi?', 'Czy ma ogonek?'],
    setups: [
      'Mój ogon jest najpuszystszy w całym lesie!',
      'Czasem gonię własny ogon. Jeszcze go nie złapałem.',
    ],
    onYes: ['Ogon! Mój macha z radości.', 'Z ogonkiem! Notuję.'],
    onNo: ['Bez ogona? Mój ogon jest w szoku!', 'Żadnego ogona. Skreślam.'],
  },
  {
    id: 'q_legs',
    attribute_key: 'has_legs',
    core: [
      'Czy twoje zwierzę ma nogi?',
      'Czy ma nogi albo łapy, na których chodzi?',
      'Czy ma nóżki?',
    ],
    setups: [
      'Ja mam cztery łapy i wszystkie biegają naraz.',
      'Tupu, tupu! Teraz pytanie o nogi.',
    ],
    onYes: ['Nóżki! Pewnie umie tupać.', 'Z nogami! Notuję.'],
    onNo: ['Bez nóg! Ciekawe, jak się porusza.', 'Żadnych nóżek. Skreślam.'],
  },
  {
    id: 'q_dangerous',
    attribute_key: 'is_dangerous',
    core: [
      'Czy twoje zwierzę bywa groźne dla ludzi?',
      'Czy może być niebezpieczne dla człowieka?',
      'Czy lepiej trzymać się od niego z daleka?',
    ],
    setups: ['Chowam się za drzewem. Tak na wszelki wypadek.', 'Ciii… teraz groźne pytanie.'],
    onYes: [
      'Groźne! Ogon zrobił mi się jak szczotka.',
      'Uwaga! Detektyw trzyma się z daleka.',
    ],
    onNo: ['Uff, niegroźne. Wychodzę zza drzewa.', 'Łagodne! Notuję z ulgą.'],
  },
  {
    id: 'q_fast',
    attribute_key: 'is_fast',
    core: [
      'Czy twoje zwierzę jest bardzo szybkie?',
      'Czy szybko biega, lata albo pływa?',
      'Czy jest szybkie jak strzała?',
    ],
    setups: [
      'Ja jestem szybki tylko wtedy, gdy wołają na obiad.',
      'Na start… gotowi… pytanie!',
    ],
    onYes: ['Wziuuum! Nie dogonię go nawet w trampkach.', 'Błyskawica! Aż mi wiatr rozczochrał futro.'],
    onNo: ['Nie śpieszy się. Ja też lubię drzemki.', 'Powolutku… Notuję.'],
  },
  {
    id: 'q_horns',
    attribute_key: 'has_horns',
    core: [
      'Czy twoje zwierzę ma rogi albo poroże?',
      'Czy na głowie rosną mu rogi, jak u krowy, albo poroże, jak u jelenia?',
      'Czy ma na głowie rogi albo poroże?',
    ],
    setups: [
      'Założyłem kiedyś na głowę dwa patyki. Wszyscy myśleli, że jestem jeleniem!',
      'Muu! Teraz pytanie z rogami.',
    ],
    onYes: ['Rogacz! Uważam na swój ogon.', 'Rogi! Można na nich wieszać czapki.'],
    onNo: ['Gładka głowa. Notuję.', 'Bez rogów. Czapka się zmieści!'],
  },
  {
    id: 'q_nocturnal',
    attribute_key: 'is_nocturnal',
    core: [
      'Czy twoje zwierzę budzi się w nocy, a w dzień śpi?',
      'Czy szuka jedzenia nocą, jak sowa albo nietoperz?',
      'Czy to nocne zwierzę?',
    ],
    setups: ['Ziew! Ja w nocy śpię jak suseł.', 'Latarka w łapę! Teraz nocne pytanie.'],
    onYes: ['Nocny marek! Włączam latarkę.', 'Nocny trop! Uhu, uhu.'],
    onNo: ['Nie nocne. Mogę spokojnie iść spać.', 'Działa w dzień. Notuję.'],
  },
  {
    id: 'q_groups',
    attribute_key: 'lives_in_groups',
    core: [
      'Czy twoje zwierzę żyje w stadzie albo w grupie?',
      'Czy żyje razem z innymi, w stadzie, w ławicy albo w roju?',
      'Czy zwykle jest w grupie z innymi takimi samymi zwierzętami?',
    ],
    setups: [
      'Ja mam dużo kolegów, ale mieszkam sam w norce.',
      'Raz, dwa, trzy… ale tu tłoczno!',
    ],
    onYes: ['Cała banda! Nie zdążę wszystkich policzyć.', 'Stado! Im więcej, tym weselej.'],
    onNo: ['Samotnik, jak ja w norce. Notuję.', 'Lubi być samo. Skreślam stada.'],
  },
  {
    id: 'q_venomous',
    attribute_key: 'is_venomous',
    core: [
      'Czy twoje zwierzę jest jadowite?',
      'Czy ma jad, którym może ukąsić albo użądlić?',
      'Czy to jadowite zwierzę?',
    ],
    setups: [
      'Uwaga, teraz pytanie z żądłem!',
      'Mama zawsze mówi: nie dotykaj nieznajomych zwierząt. I ma rację!',
    ],
    onYes: ['Jadowite! Trzymam łapy przy sobie.', 'Jad! Detektyw jest bardzo ostrożny.'],
    onNo: ['Bez jadu. Uff!', 'Nie jadowite. Notuję.'],
  },
  {
    id: 'q_forest',
    attribute_key: 'lives_in_forest',
    core: [
      'Czy twoje zwierzę mieszka w lesie?',
      'Czy żyje w lesie, wśród drzew i mchu?',
      'Czy spotkasz je w lesie?',
    ],
    setups: ['Las to mój dom. Znam tu każdą szyszkę!', 'Pachnie grzybami. Teraz pytanie leśne!'],
    onYes: ['Leśny sąsiad! Pewnie mijamy się codziennie.', 'Las! Mój ulubiony trop.'],
    onNo: ['Nie z lasu. Szyszki zostają.', 'Mieszka poza lasem. Notuję.'],
  },
  {
    id: 'q_barks',
    attribute_key: 'barks',
    core: ['Czy twoje zwierzę szczeka?', 'Czy robi hau, hau, jak pies?', 'Czy umie szczekać?'],
    setups: ['Hau, hau! Ups, to ja. Ćwiczę psią mowę.', 'Nadstawiam ucha. Ciii…'],
    onYes: ['Hau, hau! Notuję.', 'Szczekacz! Zatykam uszy.'],
    onNo: ['Nie szczeka. Cisza jak w bibliotece.', 'Bez szczekania. Skreślam.'],
  },
  {
    id: 'q_meows',
    attribute_key: 'meows',
    core: [
      'Czy twoje zwierzę miauczy albo mruczy?',
      'Czy robi miau albo mruczy, jak kot?',
      'Czy umie miauczeć albo mruczeć?',
    ],
    setups: ['Miau! Ćwiczę kocią mowę, ale kiepsko mi idzie.', 'Mrrr… Teraz pytanie mruczące.'],
    onYes: ['Mrrr! Aż chce się je pogłaskać.', 'Miau! Notuję.'],
    onNo: ['Nie miauczy. Kot będzie zawiedziony.', 'Bez mruczenia. Skreślam koty.'],
  },
  {
    id: 'q_rodent',
    attribute_key: 'is_rodent',
    core: [
      'Czy twoje zwierzę jest gryzoniem, jak mysz, chomik albo bóbr?',
      'Czy to gryzoń, czyli zwierzę z dużymi przednimi ząbkami do gryzienia?',
      'Czy to gryzoń?',
    ],
    setups: ['Chrup, chrup! Ktoś tu gryzie orzeszki.', 'Kiedyś chomik ukradł mi kanapkę z serem!'],
    onYes: ['Gryzoń! Chowam swoje orzeszki.', 'Chrup, chrup! Notuję.'],
    onNo: ['Nie gryzoń. Moje orzeszki są bezpieczne.', 'Żadnych gryzoni. Skreślam.'],
  },
  {
    id: 'q_primate',
    attribute_key: 'is_primate',
    core: [
      'Czy twoje zwierzę jest małpą?',
      'Czy to małpa, jak szympans albo goryl?',
      'Czy to jakaś małpka?',
    ],
    setups: [
      'Uuu-aaa! Ćwiczę małpie okrzyki.',
      'Raz próbowałem huśtać się na gałęzi. Spadłem na nos!',
    ],
    onYes: ['Małpka! Obieram banana.', 'Uuu-aaa! Notuję.'],
    onNo: ['Nie małpa. Banana zjem sam.', 'Bez małpich figli. Skreślam.'],
  },
  {
    id: 'q_long_ears',
    attribute_key: 'has_long_ears',
    core: [
      'Czy twoje zwierzę ma długie uszy?',
      'Czy ma długie uszy, jak królik albo osioł?',
      'Czy ma bardzo długie uszy?',
    ],
    setups: ['Nastawiam uszy. Moje są trochę spiczaste.', 'Słucham uważnie! Teraz pytanie o uszy.'],
    onYes: ['Długie uszy! Pewnie słyszy, jak rośnie trawa.', 'Uszaty trop! Notuję.'],
    onNo: ['Krótkie uszka. Notuję.', 'Bez długich uszu. Skreślam króliki.'],
  },
  {
    id: 'q_marsupial',
    attribute_key: 'is_marsupial',
    core: [
      'Czy twoje zwierzę nosi maluszka w kieszonce na brzuchu?',
      'Czy ma kieszonkę na brzuchu, jak kangur albo koala?',
      'Czy to torbacz, czyli zwierzę z kieszonką na brzuchu?',
    ],
    setups: ['Ja też mam kieszonkę. Trzymam w niej lupę!', 'Hop, hop! Teraz pytanie z kieszonką.'],
    onYes: ['Kieszonka! Ciekawe, czy zmieści się w niej kanapka.', 'Torbacz! Hop, notuję.'],
    onNo: ['Bez kieszonki. Skreślam kangury.', 'Nie torbacz. Notuję.'],
  },
];

/** Tekst i klucz głosu jednej kwestii. */
export type Line = { text: string; voiceKey: string };

/** Klucze głosu: `q.{id}.core.{i}`, `q.{id}.setup.{i}`, `q.{id}.yes.{i}`, `q.{id}.no.{i}`. */
export type QuestionPart = 'core' | 'setup' | 'yes' | 'no';

const PART_POOL: Record<QuestionPart, (q: Question) => string[]> = {
  core: (q) => q.core,
  setup: (q) => q.setups,
  yes: (q) => q.onYes,
  no: (q) => q.onNo,
};

/** Zwraca listę kwestii danej części pytania — używane też przez generator głosu. */
export function questionLines(q: Question, part: QuestionPart): Line[] {
  return PART_POOL[part](q).map((text, i) => ({ text, voiceKey: `q.${q.id}.${part}.${i}` }));
}

/** Losuje jedną kwestię danej części pytania. */
export function pickQuestionLine(q: Question, part: QuestionPart): Line {
  const lines = questionLines(q, part);
  return lines[Math.floor(Math.random() * lines.length)];
}
