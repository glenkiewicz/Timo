import type { Animal, AttributeKey } from '@/types/game';

type Short = 0 | 1 | -1; // -1 = null ("czasem/zależy")

type ShortKey =
  | 'water'
  | 'fly'
  | 'fur'
  | 'feathers'
  | 'scales'
  | 'shell'
  | 'mammal'
  | 'bird'
  | 'fish'
  | 'reptile'
  | 'amphi'
  | 'insect'
  | 'big_d'
  | 'small_c'
  | 'pred'
  | 'plant'
  | 'home'
  | 'afr'
  | 'pol'
  | 'jungle'
  | 'ocean'
  | 'arctic'
  | 'farm'
  | 'tail'
  | 'legs'
  | 'danger'
  | 'fast'
  | 'horns'
  | 'nocturnal'
  | 'groups'
  | 'venom'
  | 'forest'
  | 'barks'
  | 'meows'
  | 'rodent'
  | 'primate'
  | 'long_ears'
  | 'marsupial';

const SHORT_TO_KEY: Record<ShortKey, AttributeKey> = {
  water: 'lives_in_water',
  fly: 'can_fly',
  fur: 'has_fur',
  feathers: 'has_feathers',
  scales: 'has_scales',
  shell: 'has_shell',
  mammal: 'is_mammal',
  bird: 'is_bird',
  fish: 'is_fish',
  reptile: 'is_reptile',
  amphi: 'is_amphibian',
  insect: 'is_insect',
  big_d: 'larger_than_dog',
  small_c: 'smaller_than_cat',
  pred: 'is_predator',
  plant: 'eats_plants',
  home: 'lives_at_home',
  afr: 'lives_in_africa',
  pol: 'lives_in_poland',
  jungle: 'lives_in_jungle',
  ocean: 'lives_in_ocean',
  arctic: 'lives_in_arctic',
  farm: 'lives_on_farm',
  tail: 'has_tail',
  legs: 'has_legs',
  danger: 'is_dangerous',
  fast: 'is_fast',
  horns: 'has_horns',
  nocturnal: 'is_nocturnal',
  groups: 'lives_in_groups',
  venom: 'is_venomous',
  forest: 'lives_in_forest',
  barks: 'barks',
  meows: 'meows',
  rodent: 'is_rodent',
  primate: 'is_primate',
  long_ears: 'has_long_ears',
  marsupial: 'is_marsupial',
};

function mk(
  id: string,
  name_pl: string,
  emoji: string,
  fact: string,
  shorts: Partial<Record<ShortKey, Short>>
): Animal {
  const attributes: Record<string, boolean | null> = {};
  for (const fullKey of Object.values(SHORT_TO_KEY)) {
    attributes[fullKey] = false;
  }
  for (const [shortKey, val] of Object.entries(shorts) as [ShortKey, Short][]) {
    const fullKey = SHORT_TO_KEY[shortKey];
    if (!fullKey) continue;
    attributes[fullKey] = val === 1 ? true : val === -1 ? null : false;
  }
  return { id, name_pl, emoji, fun_fact_pl: fact, attributes };
}

const RAW_ANIMALS: Animal[] = [
  // === SSAKI DOMOWE ===
  mk('dog', 'Pies', '🐶', 'Pies potrafi nauczyć się ponad 150 słów!', { mammal: 1, fur: 1, tail: 1, legs: 1, home: 1, pol: 1, fast: 1, barks: 1 }),
  mk('cat', 'Kot', '🐱', 'Kot śpi nawet 16 godzin dziennie.', { mammal: 1, fur: 1, tail: 1, legs: 1, home: 1, pol: 1, pred: 1, fast: 1, nocturnal: -1, meows: 1 }),
  mk('rabbit', 'Królik', '🐰', 'Królik widzi prawie 360° dookoła siebie.', { mammal: 1, fur: 1, tail: 1, legs: 1, home: 1, pol: 1, plant: 1, fast: 1, small_c: -1, long_ears: 1 }),
  mk('hamster', 'Chomik', '🐹', 'Chomik chowa jedzenie w policzkach!', { mammal: 1, fur: 1, tail: 1, legs: 1, home: 1, plant: 1, small_c: 1, rodent: 1, pol: -1 }),
  mk('guinea_pig', 'Świnka morska', '🐹', 'Szczęśliwa świnka morska podskakuje w miejscu — to tzw. "popcorning"!', { mammal: 1, fur: 1, legs: 1, tail: -1, home: 1, plant: 1, small_c: 1, rodent: 1, pol: -1 }),
  mk('rat', 'Szczur ozdobny', '🐀', 'Szczury rozpoznają swoje imiona.', { mammal: 1, fur: 1, tail: 1, legs: 1, home: 1, small_c: 1, rodent: 1 }),
  mk('ferret', 'Fretka', '🦦', 'Fretka kradnie i chowa błyszczące przedmioty.', { mammal: 1, fur: 1, tail: 1, legs: 1, home: 1, pred: 1, pol: -1 }),
  mk('mouse', 'Mysz', '🐭', 'Mysz przejdzie przez szczelinę grubości ołówka.', { mammal: 1, fur: 1, tail: 1, legs: 1, home: -1, pol: 1, small_c: 1, nocturnal: 1, rodent: 1 }),

  // === FARMA ===
  mk('cow', 'Krowa', '🐄', 'Krowa ma najlepszych przyjaciół wśród innych krów.', { mammal: 1, fur: 1, tail: 1, legs: 1, farm: 1, pol: 1, plant: 1, big_d: 1, horns: 1, groups: 1 }),
  mk('horse', 'Koń', '🐴', 'Konie potrafią drzemać na stojąco, ale na głęboki sen kładą się na ziemi.', { mammal: 1, fur: 1, tail: 1, legs: 1, farm: 1, pol: 1, plant: 1, big_d: 1, fast: 1 }),
  mk('sheep', 'Owca', '🐑', 'Owca rozpoznaje twarze przyjaciół po nawet 2 latach.', { mammal: 1, fur: 1, tail: 1, legs: 1, farm: 1, pol: 1, plant: 1, big_d: 1, horns: 1, groups: 1 }),
  mk('goat', 'Koza', '🐐', 'Kozy mają prostokątne źrenice — widzą szeroko.', { mammal: 1, fur: 1, tail: 1, legs: 1, farm: 1, pol: 1, plant: 1, horns: 1 }),
  mk('pig', 'Świnia', '🐷', 'Świnie są bardzo mądre — uczą się swojego imienia i prostych sztuczek.', { mammal: 1, tail: 1, legs: 1, farm: 1, pol: 1, big_d: 1, plant: -1, fur: -1 }),
  mk('donkey', 'Osioł', '🫏', 'Osły mają świetną pamięć — pamiętają miejsca po latach.', { mammal: 1, fur: 1, tail: 1, legs: 1, farm: 1, pol: 1, plant: 1, big_d: 1, long_ears: 1 }),
  mk('chicken', 'Kura', '🐔', 'Kura rozróżnia ponad 100 twarzy.', { bird: 1, feathers: 1, tail: 1, legs: 1, farm: 1, pol: 1, home: -1, groups: 1, small_c: -1 }),
  mk('rooster', 'Kogut', '🐓', 'Kogut ma wewnętrzny zegar — pieje o świcie, nawet gdy jeszcze jest ciemno.', { bird: 1, feathers: 1, tail: 1, legs: 1, farm: 1, pol: 1, small_c: -1 }),
  mk('duck', 'Kaczka', '🦆', 'Kaczka smaruje pióra tłuszczem z gruczołu przy ogonie — dlatego nie przemakają.', { bird: 1, feathers: 1, tail: 1, legs: 1, water: 1, farm: -1, pol: 1, fly: -1, small_c: -1 }),
  mk('goose', 'Gęś', '🦢', 'Dzikie gęsi lecą kluczem w kształcie litery V — tak oszczędzają siły.', { bird: 1, feathers: 1, tail: 1, legs: 1, water: 1, farm: -1, pol: 1, fly: -1 }),
  mk('alpaca', 'Alpaka', '🦙', 'Alpaki cicho nucą — tak porozumiewają się ze stadem.', { mammal: 1, fur: 1, tail: 1, legs: 1, farm: 1, plant: 1, big_d: 1, groups: 1 }),

  // === DZIKIE POLSKI ===
  mk('wolf', 'Wilk', '🐺', 'Wycie wilka słychać z 10 kilometrów.', { mammal: 1, fur: 1, tail: 1, legs: 1, pol: 1, pred: 1, big_d: 1, fast: 1, danger: -1, groups: 1, forest: 1, barks: 1, nocturnal: -1 }),
  mk('fox', 'Lis', '🦊', 'Lisy potrafią słyszeć mysz pod śniegiem z 10 metrów!', { mammal: 1, fur: 1, tail: 1, legs: 1, pol: 1, pred: 1, fast: 1, nocturnal: -1, forest: 1, barks: 1, small_c: -1 }),
  mk('deer', 'Jeleń', '🦌', 'Poroże jelenia odrasta co roku — to najszybciej rosnąca tkanka u ssaków.', { mammal: 1, fur: 1, tail: 1, legs: 1, pol: 1, plant: 1, big_d: 1, fast: 1, horns: 1, forest: 1 }),
  mk('roe_deer', 'Sarna', '🦌', 'Wystraszona sarna "szczeka" — jej głos brzmi podobnie do szczekania psa.', { mammal: 1, fur: 1, tail: 1, legs: 1, pol: 1, plant: 1, fast: 1, horns: 1, forest: 1 }),
  mk('wild_boar', 'Dzik', '🐗', 'Dzik biega 40 km/h przez gęsty las.', { mammal: 1, fur: 1, tail: 1, legs: 1, pol: 1, big_d: 1, danger: -1, fast: 1, forest: 1, plant: -1, groups: 1 }),
  mk('brown_bear', 'Niedźwiedź brunatny', '🐻', 'Niedźwiedzie przesypiają zimę w gawrze.', { mammal: 1, fur: 1, tail: 1, legs: 1, pol: 1, pred: -1, big_d: 1, danger: 1, forest: 1, plant: -1 }),
  mk('lynx', 'Ryś', '🐈', 'Pędzelki na uszach rysia działają jak antena na dźwięki.', { mammal: 1, fur: 1, tail: 1, legs: 1, pol: 1, pred: 1, fast: 1, nocturnal: -1, forest: 1, meows: 1 }),
  mk('badger', 'Borsuk', '🦡', 'Borsuk kopie podziemne tunele długie na kilkanaście metrów.', { mammal: 1, fur: 1, tail: 1, legs: 1, pol: 1, pred: -1, plant: -1, small_c: -1, nocturnal: 1, forest: 1 }),
  mk('marten', 'Kuna', '🦦', 'Kuny mieszkają nawet na strychach domów.', { mammal: 1, fur: 1, tail: 1, legs: 1, pol: 1, pred: 1, fast: 1, forest: 1, nocturnal: -1, small_c: -1 }),
  mk('elk', 'Łoś', '🫎', 'Łoś to największy jeleń świata — ma tak długie nogi, że swobodnie brodzi po bagnach.', { mammal: 1, fur: 1, tail: 1, legs: 1, pol: 1, plant: 1, big_d: 1, horns: 1, forest: 1 }),
  mk('bison', 'Żubr', '🦬', 'Żubr to symbol Puszczy Białowieskiej.', { mammal: 1, fur: 1, tail: 1, legs: 1, pol: 1, plant: 1, big_d: 1, danger: -1, horns: 1, groups: 1, forest: 1 }),
  mk('beaver', 'Bóbr', '🦫', 'Bóbr buduje tamy, które zmieniają cały krajobraz.', { mammal: 1, fur: 1, tail: 1, legs: 1, pol: 1, water: 1, plant: 1, rodent: 1, small_c: -1 }),
  mk('otter', 'Wydra', '🦦', 'Wydra zamyka nos i uszy, gdy nurkuje za rybami.', { mammal: 1, fur: 1, tail: 1, legs: 1, pol: 1, water: 1, pred: 1, small_c: -1 }),
  mk('hedgehog', 'Jeż', '🦔', 'Jeż ma do 7000 kolców na grzbiecie.', { mammal: 1, tail: 1, legs: 1, pol: 1, small_c: -1, pred: -1, nocturnal: 1, forest: 1 }),
  mk('squirrel', 'Wiewiórka', '🐿️', 'Wiewiórki zakopują tysiące orzechów na zimę.', { mammal: 1, fur: 1, tail: 1, legs: 1, pol: 1, plant: 1, small_c: 1, fast: 1, forest: 1, rodent: 1 }),
  mk('stoat', 'Gronostaj', '🦦', 'Zimą gronostaj zmienia futro na śnieżnobiałe.', { mammal: 1, fur: 1, tail: 1, legs: 1, pol: 1, pred: 1, small_c: -1, fast: 1, forest: -1, nocturnal: -1 }),
  mk('weasel', 'Łasica', '🦦', 'Łasica to najmniejszy drapieżny ssak świata — zmieściłaby się w dłoni.', { mammal: 1, fur: 1, tail: 1, legs: 1, pol: 1, pred: 1, small_c: -1, fast: 1, forest: -1, nocturnal: -1 }),
  mk('field_mouse', 'Mysz polna', '🐭', 'Mysz polna ma długi ogon do balansu w trawie.', { mammal: 1, fur: 1, tail: 1, legs: 1, pol: 1, small_c: 1, fast: 1, nocturnal: 1, rodent: 1 }),
  mk('bat', 'Nietoperz', '🦇', 'Nietoperz "widzi" uszami przez echolokację.', { mammal: 1, fur: 1, legs: 1, pol: 1, fly: 1, pred: -1, nocturnal: 1, forest: 1 }),
  mk('mole', 'Kret', '🦫', 'Kret kopie tunele tak szybko jak inny zwierzak biega.', { mammal: 1, fur: 1, legs: 1, pol: 1, small_c: 1, pred: 1, tail: 1 }),

  // === AFRYKA ===
  mk('lion', 'Lew', '🦁', 'Ryk lwa słychać z 8 kilometrów.', { mammal: 1, fur: 1, tail: 1, legs: 1, afr: 1, pred: 1, big_d: 1, danger: 1, fast: 1, groups: 1, meows: 1 }),
  mk('elephant', 'Słoń afrykański', '🐘', 'Słoń poznaje swoje odbicie w lustrze.', { mammal: 1, tail: 1, legs: 1, afr: 1, plant: 1, big_d: 1, danger: -1, groups: 1 }),
  mk('giraffe', 'Żyrafa', '🦒', 'Język żyrafy ma 50 cm długości!', { mammal: 1, fur: 1, tail: 1, legs: 1, afr: 1, plant: 1, big_d: 1 }),
  mk('zebra', 'Zebra', '🦓', 'Pasy zebry działają jak indywidualny "kod kreskowy".', { mammal: 1, fur: 1, tail: 1, legs: 1, afr: 1, plant: 1, big_d: 1, fast: 1, groups: 1 }),
  mk('leopard', 'Lampart', '🐆', 'Lampart wciąga zdobycz na drzewo, żeby zjeść w spokoju.', { mammal: 1, fur: 1, tail: 1, legs: 1, afr: 1, pred: 1, big_d: 1, danger: 1, fast: 1, nocturnal: -1, meows: 1 }),
  mk('cheetah', 'Gepard', '🐆', 'Gepard biega 110 km/h — najszybsze zwierzę lądowe!', { mammal: 1, fur: 1, tail: 1, legs: 1, afr: 1, pred: 1, big_d: 1, fast: 1, meows: 1 }),
  mk('hippo', 'Hipopotam', '🦛', 'Skóra hipopotama wydziela czerwonawą wydzielinę, która chroni go przed słońcem jak krem z filtrem.', { mammal: 1, tail: 1, legs: 1, water: 1, afr: 1, big_d: 1, danger: 1, plant: 1 }),
  mk('rhino', 'Nosorożec', '🦏', 'Róg nosorożca to taka sama keratyna jak nasze paznokcie.', { mammal: 1, tail: 1, legs: 1, afr: 1, plant: 1, big_d: 1, danger: -1, horns: 1 }),
  mk('antelope', 'Antylopa', '🦌', 'Antylopy skaczą czasem 3 metry w górę.', { mammal: 1, fur: 1, tail: 1, legs: 1, afr: 1, plant: 1, fast: 1, horns: 1, groups: 1 }),
  mk('gnu', 'Gnu', '🐃', 'Każdego roku miliony gnu migrują przez Serengeti.', { mammal: 1, fur: 1, tail: 1, legs: 1, afr: 1, plant: 1, big_d: 1, fast: 1, horns: 1, groups: 1 }),
  mk('hyena', 'Hiena', '🐺', 'Hieny "chichoczą" — tak porozumiewają się ze stadem, np. przy jedzeniu.', { mammal: 1, fur: 1, tail: 1, legs: 1, afr: 1, pred: 1, big_d: 1, nocturnal: 1, groups: 1 }),
  mk('jackal', 'Szakal', '🐺', 'Szakale często polują w parach.', { mammal: 1, fur: 1, tail: 1, legs: 1, afr: 1, pred: 1, nocturnal: -1, barks: 1 }),
  mk('meerkat', 'Surykatka', '🐾', 'Surykatki wystawiają jednego "wartownika" na słupku.', { mammal: 1, fur: 1, tail: 1, legs: 1, afr: 1, small_c: 1, fast: 1, groups: 1, pred: 1 }),
  mk('chimpanzee', 'Szympans', '🐵', 'Szympansy używają patyków do "łowienia" termitów.', { mammal: 1, fur: 1, legs: 1, afr: 1, jungle: 1, big_d: 1, groups: 1, forest: 1, primate: 1, plant: -1 }),
  mk('gorilla', 'Goryl', '🦍', 'Goryl uderza w pierś, kiedy chce zaimponować.', { mammal: 1, fur: 1, legs: 1, afr: 1, jungle: 1, plant: 1, big_d: 1, danger: -1, groups: 1, forest: 1, primate: 1 }),
  mk('lemur', 'Lemur', '🐒', 'Lemury żyją tylko na Madagaskarze — rano wygrzewają się w słońcu z rozłożonymi łapkami.', { mammal: 1, fur: 1, tail: 1, legs: 1, afr: 1, jungle: 1, plant: 1, groups: 1, primate: 1 }),
  mk('mandrill', 'Mandryl', '🐒', 'Mandryl ma najbardziej kolorowy pyszczek wśród ssaków.', { mammal: 1, fur: 1, tail: 1, legs: 1, afr: 1, jungle: 1, big_d: 1, groups: 1, primate: 1, plant: -1 }),
  mk('gazelle', 'Gazela', '🦌', 'Uciekająca gazela skacze wysoko na sztywnych nogach — pokazuje drapieżnikowi, że jest silna.', { mammal: 1, fur: 1, tail: 1, legs: 1, afr: 1, plant: 1, fast: 1, horns: 1, groups: 1 }),
  mk('buffalo', 'Bawół afrykański', '🐃', 'Stado bawołów potrafi przegonić nawet lwa.', { mammal: 1, fur: 1, tail: 1, legs: 1, afr: 1, plant: 1, big_d: 1, danger: 1, horns: 1, groups: 1 }),
  mk('warthog', 'Guziec', '🐗', 'Guziec je trawę, klęcząc na przednich nogach.', { mammal: 1, tail: 1, legs: 1, afr: 1, plant: 1 }),

  // === DŻUNGLA / AZJA / AMERYKI ===
  mk('tiger', 'Tygrys', '🐅', 'Każdy tygrys ma unikalny układ pasków — jak nasze odciski.', { mammal: 1, fur: 1, tail: 1, legs: 1, jungle: 1, pred: 1, big_d: 1, danger: 1, fast: 1, forest: 1, meows: 1 }),
  mk('panda', 'Panda wielka', '🐼', 'Panda zjada 12 kg bambusa dziennie.', { mammal: 1, fur: 1, tail: 1, legs: 1, plant: 1, big_d: 1, forest: 1 }),
  mk('orangutan', 'Orangutan', '🦧', 'Orangutany budują codziennie nowe gniazdo na drzewie.', { mammal: 1, fur: 1, legs: 1, jungle: 1, plant: 1, big_d: 1, forest: 1, primate: 1 }),
  mk('jaguar', 'Jaguar', '🐆', 'Jaguar ma najsilniejsze szczęki ze wszystkich kotów.', { mammal: 1, fur: 1, tail: 1, legs: 1, jungle: 1, pred: 1, big_d: 1, danger: 1, fast: 1, forest: 1, meows: 1 }),
  mk('sloth', 'Leniwiec', '🦥', 'Leniwiec porusza się tak wolno, że glony rosną mu na futrze!', { mammal: 1, fur: 1, tail: 1, legs: 1, jungle: 1, plant: 1, forest: 1 }),
  mk('anteater', 'Mrówkojad', '🐜', 'Mrówkojad zjada 35 000 mrówek dziennie.', { mammal: 1, fur: 1, tail: 1, legs: 1, jungle: 1, pred: 1, forest: 1 }),
  mk('capybara', 'Kapibara', '🦫', 'Kapibara to największy gryzoń świata.', { mammal: 1, fur: 1, legs: 1, jungle: 1, water: 1, plant: 1, big_d: 1, rodent: 1 }),
  mk('gibbon', 'Gibon', '🐒', 'Gibony śpiewają poranne duety z partnerem.', { mammal: 1, fur: 1, legs: 1, jungle: 1, plant: 1, primate: 1 }),
  mk('macaque', 'Makak', '🐒', 'Makaki są bardzo sprytne — potrafią myć jedzenie w wodzie przed zjedzeniem.', { mammal: 1, fur: 1, tail: 1, legs: 1, jungle: 1, groups: 1, forest: 1, primate: 1, plant: -1 }),
  mk('ocelot', 'Ocelot', '🐈', 'Ocelot poluje w nocy używając wzroku jak kot domowy.', { mammal: 1, fur: 1, tail: 1, legs: 1, jungle: 1, pred: 1, fast: 1, nocturnal: -1, forest: 1, meows: 1 }),
  mk('kangaroo', 'Kangur', '🦘', 'Kangur skacze nawet 9 metrów w jednym susie.', { mammal: 1, fur: 1, tail: 1, legs: 1, plant: 1, big_d: 1, fast: 1, marsupial: 1 }),
  mk('koala', 'Koala', '🐨', 'Koala śpi 20 godzin na dobę — czas wolny: 4 godziny.', { mammal: 1, fur: 1, legs: 1, tail: -1, plant: 1, small_c: -1, marsupial: 1 }),
  mk('platypus', 'Dziobak', '🦫', 'Dziobak składa jaja, choć jest ssakiem!', { mammal: 1, fur: 1, tail: 1, legs: 1, water: 1, venom: 1 }),
  mk('porcupine', 'Jeżozwierz', '🦔', 'Jeżozwierz nie strzela kolcami — ale kolce łatwo się odczepiają i wbijają w napastnika.', { mammal: 1, tail: 1, legs: 1, danger: -1, rodent: 1, plant: 1, nocturnal: 1, afr: 1 }),
  mk('armadillo', 'Pancernik', '🦔', 'Tylko pancernik trójpasy potrafi zwinąć się w pancerną kulę — inne uciekają i zakopują się.', { mammal: 1, shell: 1, tail: 1, legs: 1, plant: -1, nocturnal: 1 }),

  // === ARKTYKA / POLARNE ===
  mk('polar_bear', 'Niedźwiedź polarny', '🐻‍❄️', 'Pod białym futrem niedźwiedź polarny ma czarną skórę.', { mammal: 1, fur: 1, tail: 1, legs: 1, arctic: 1, pred: 1, big_d: 1, danger: 1 }),
  mk('walrus', 'Mors', '🦭', 'Mors wbija długie kły w lód i podciąga się na nich, wychodząc z wody.', { mammal: 1, fur: 1, tail: 1, legs: 1, ocean: 1, arctic: 1, big_d: 1, water: 1, groups: 1 }),
  mk('seal', 'Foka', '🦭', 'Foki wyczuwają wąsami drgania wody i tak tropią ryby.', { mammal: 1, fur: 1, tail: 1, legs: 1, water: 1, ocean: 1, arctic: -1, pred: 1, big_d: 1 }),
  mk('arctic_fox', 'Lis polarny', '🦊', 'Lis polarny zmienia kolor futra zimą na śnieżnobiały.', { mammal: 1, fur: 1, tail: 1, legs: 1, arctic: 1, pred: 1, fast: 1, barks: 1 }),
  mk('reindeer', 'Renifer', '🦌', 'Renifery widzą światło ultrafioletowe — pomocne na śniegu.', { mammal: 1, fur: 1, tail: 1, legs: 1, arctic: 1, plant: 1, big_d: 1, horns: 1, groups: 1 }),
  mk('musk_ox', 'Piżmowół', '🦬', 'Piżmowoły tworzą krąg, broniąc młodych.', { mammal: 1, fur: 1, tail: 1, legs: 1, arctic: 1, plant: 1, big_d: 1, horns: 1, groups: 1 }),
  mk('lemming', 'Leming', '🐭', 'Lemingi nie skaczą do morza — to mit z filmu.', { mammal: 1, fur: 1, tail: 1, legs: 1, arctic: 1, plant: 1, small_c: 1, rodent: 1 }),
  mk('snowy_owl', 'Sowa śnieżna', '🦉', 'Sowa śnieżna potrafi obrócić głowę o 270°.', { bird: 1, feathers: 1, tail: 1, legs: 1, arctic: 1, pred: 1, fly: 1, nocturnal: -1, small_c: -1 }),

  // === SSAKI MORSKIE ===
  mk('whale', 'Wieloryb (płetwal błękitny)', '🐋', 'Płetwal błękitny to największe zwierzę, jakie żyło na Ziemi.', { mammal: 1, tail: 1, water: 1, ocean: 1, big_d: 1 }),
  mk('dolphin', 'Delfin', '🐬', 'Delfiny używają imion — każdy ma swój gwizd.', { mammal: 1, tail: 1, water: 1, ocean: 1, pred: 1, big_d: 1, fast: 1, groups: 1 }),
  mk('orca', 'Orka', '🐳', 'Orki uczą się polowania w rodzinie przez lata.', { mammal: 1, tail: 1, water: 1, ocean: 1, pred: 1, big_d: 1, danger: 1, fast: 1, groups: 1 }),
  mk('manatee', 'Manat', '🐋', 'Manaty nazywane są "morskimi krowami" — jedzą trawę morską.', { mammal: 1, tail: 1, water: 1, ocean: 1, plant: 1, big_d: 1 }),
  mk('narwhal', 'Narwal', '🦄', 'Narwale są nazywane "jednorożcami morza".', { mammal: 1, tail: 1, water: 1, ocean: 1, arctic: 1, big_d: 1, pred: 1 }),
  mk('sperm_whale', 'Kaszalot', '🐳', 'Kaszalot ma największy mózg ze wszystkich zwierząt.', { mammal: 1, tail: 1, water: 1, ocean: 1, pred: 1, big_d: 1 }),
  mk('porpoise', 'Morświn', '🐬', 'Morświny zamieszkują też Bałtyk.', { mammal: 1, tail: 1, water: 1, ocean: 1, pred: 1, fast: 1 }),

  // === PTAKI POLSKI ===
  mk('stork', 'Bocian', '🦩', 'Bociany przylatują do Polski w marcu z Afryki.', { bird: 1, feathers: 1, tail: 1, legs: 1, pol: 1, afr: -1, fly: 1, big_d: -1, pred: 1 }),
  mk('swallow', 'Jaskółka', '🐦', 'Jaskółka łapie owady w locie — szybkie i celne.', { bird: 1, feathers: 1, tail: 1, legs: 1, pol: 1, fly: 1, fast: 1, small_c: 1, groups: 1 }),
  mk('tit', 'Sikorka', '🐦', 'Sikorki chodzą do góry nogami po gałęziach.', { bird: 1, feathers: 1, tail: 1, legs: 1, pol: 1, fly: 1, small_c: 1, forest: 1 }),
  mk('sparrow', 'Wróbel', '🐦', 'Wróbel kąpie się w pyle, żeby pozbyć się pasożytów.', { bird: 1, feathers: 1, tail: 1, legs: 1, pol: 1, fly: 1, small_c: 1 }),
  mk('pigeon', 'Gołąb', '🕊️', 'Gołąb pocztowy trafi do domu z setek kilometrów.', { bird: 1, feathers: 1, tail: 1, legs: 1, pol: 1, home: -1, fly: 1 }),
  mk('raven', 'Kruk', '🦅', 'Kruki rozwiązują zagadki na poziomie dziecka 7-letniego.', { bird: 1, feathers: 1, tail: 1, legs: 1, pol: 1, fly: 1, forest: -1, small_c: -1 }),
  mk('magpie', 'Sroka', '🐦', 'Sroki rozpoznają siebie w lustrze.', { bird: 1, feathers: 1, tail: 1, legs: 1, pol: 1, fly: 1, forest: -1 }),
  mk('jay', 'Sójka', '🐦', 'Sójki naśladują głosy innych ptaków.', { bird: 1, feathers: 1, tail: 1, legs: 1, pol: 1, fly: 1, forest: 1 }),
  mk('blackbird', 'Kos', '🐦', 'Kosy śpiewają najpiękniej o poranku.', { bird: 1, feathers: 1, tail: 1, legs: 1, pol: 1, fly: 1, small_c: 1, forest: 1 }),
  mk('nightingale', 'Słowik', '🐦', 'Słowik śpiewa w nocy, żeby się popisać przed samicą.', { bird: 1, feathers: 1, tail: 1, legs: 1, pol: 1, fly: 1, small_c: 1, forest: 1 }),
  mk('hoopoe', 'Dudek', '🐦', 'Dudek ma piękny czubek z piór.', { bird: 1, feathers: 1, tail: 1, legs: 1, pol: 1, fly: 1, small_c: 1, forest: 1 }),
  mk('woodpecker', 'Dzięcioł', '🪶', 'Dzięcioł stuka w drzewo 20 razy na sekundę.', { bird: 1, feathers: 1, tail: 1, legs: 1, pol: 1, fly: 1, forest: 1 }),
  mk('cuckoo', 'Kukułka', '🐦', 'Kukułka podrzuca jaja do gniazd innych ptaków.', { bird: 1, feathers: 1, tail: 1, legs: 1, pol: 1, fly: 1, forest: 1 }),
  mk('heron', 'Czapla', '🦩', 'Czapla stoi nieruchomo godzinami, czekając na rybę.', { bird: 1, feathers: 1, tail: 1, legs: 1, pol: 1, water: -1, fly: 1, pred: 1 }),
  mk('swan', 'Łabędź', '🦢', 'Łabędzie są monogamiczne na całe życie.', { bird: 1, feathers: 1, tail: 1, legs: 1, pol: 1, water: 1, fly: 1, big_d: -1 }),

  // === PTAKI DRAPIEŻNE ===
  mk('eagle', 'Orzeł', '🦅', 'Orzeł widzi mysz z wysokości kilometra.', { bird: 1, feathers: 1, tail: 1, legs: 1, pol: -1, fly: 1, pred: 1, fast: 1, small_c: -1 }),
  mk('falcon', 'Sokół wędrowny', '🦅', 'Sokół wędrowny pikuje 320 km/h — najszybsze zwierzę świata!', { bird: 1, feathers: 1, tail: 1, legs: 1, pol: 1, fly: 1, pred: 1, fast: 1, small_c: -1 }),
  mk('hawk', 'Jastrząb', '🦅', 'Jastrząb zaskakuje zdobycz wybijając się zza krzaka.', { bird: 1, feathers: 1, tail: 1, legs: 1, pol: 1, fly: 1, pred: 1, fast: 1, small_c: -1 }),
  mk('owl', 'Sowa', '🦉', 'Sowy lecą bezgłośnie dzięki specjalnym piórom.', { bird: 1, feathers: 1, tail: 1, legs: 1, pol: 1, fly: 1, pred: 1, nocturnal: 1, forest: 1, small_c: -1 }),
  mk('eagle_owl', 'Puchacz', '🦉', 'Puchacz to największa sowa w Polsce.', { bird: 1, feathers: 1, tail: 1, legs: 1, pol: 1, fly: 1, pred: 1, nocturnal: 1, forest: 1, small_c: -1 }),
  mk('condor', 'Kondor', '🦅', 'Rozpostarte skrzydła kondora mają 3 metry.', { bird: 1, feathers: 1, tail: 1, legs: 1, fly: 1, big_d: 1 }),
  mk('vulture', 'Sęp', '🦅', 'Sępy mają tak bystry wzrok, że z wysoka wypatrują jedzenie na ziemi.', { bird: 1, feathers: 1, tail: 1, legs: 1, fly: 1, afr: -1 }),

  // === PTAKI EGZOTYCZNE ===
  mk('toucan', 'Tukan', '🦜', 'Wielki dziób tukana waży zaskakująco mało — jest pusty w środku.', { bird: 1, feathers: 1, tail: 1, legs: 1, jungle: 1, fly: 1 }),
  mk('flamingo', 'Flaming', '🦩', 'Flamingi są różowe od pokarmu — krewetek i alg.', { bird: 1, feathers: 1, tail: 1, legs: 1, water: 1, afr: -1, fly: 1, big_d: -1, groups: 1 }),
  mk('ostrich', 'Struś', '🦤', 'Struś biega 70 km/h — najszybszy ptak na lądzie.', { bird: 1, feathers: 1, tail: 1, legs: 1, afr: 1, big_d: 1, fast: 1 }),
  mk('peacock', 'Paw', '🦚', 'Paw rozkłada ogon w wachlarz, żeby zaimponować.', { bird: 1, feathers: 1, tail: 1, legs: 1, jungle: -1, fly: 1 }),
  mk('hummingbird', 'Koliber', '🐦', 'Koliber to jedyny ptak, który lata w tył.', { bird: 1, feathers: 1, tail: 1, legs: 1, jungle: -1, fly: 1, small_c: 1, fast: 1 }),
  mk('parrot', 'Papuga', '🦜', 'Niektóre papugi powtarzają ponad 100 słów.', { bird: 1, feathers: 1, tail: 1, legs: 1, jungle: 1, home: -1, fly: 1, pol: -1 }),
  mk('cockatoo', 'Kakadu', '🦜', 'Kakadu tańczą do rytmu muzyki!', { bird: 1, feathers: 1, tail: 1, legs: 1, jungle: -1, home: -1, fly: 1, pol: -1 }),
  mk('pelican', 'Pelikan', '🐦', 'W woreczku pelikana mieszczą się litry wody z rybami.', { bird: 1, feathers: 1, tail: 1, legs: 1, water: 1, fly: 1, pred: 1, big_d: -1 }),
  mk('penguin_emperor', 'Pingwin cesarski', '🐧', 'Pingwin cesarski wysiaduje jajo na własnych stopach.', { bird: 1, feathers: 1, tail: 1, legs: 1, arctic: 1, water: 1, ocean: 1, groups: 1 }),
  mk('penguin_little', 'Pingwin mały', '🐧', 'Pingwin mały to najmniejszy gatunek pingwina — 30 cm wysokości.', { bird: 1, feathers: 1, tail: 1, legs: 1, water: 1, ocean: 1, small_c: 1, groups: 1 }),
  mk('kiwi', 'Kiwi', '🥝', 'Kiwi z Nowej Zelandii nie lata, ma za to wąsy jak kot.', { bird: 1, feathers: 1, tail: 1, legs: 1, small_c: -1 }),
  mk('emu', 'Emu', '🦤', 'Emu ma dwie pary powiek — jedna służy do mrugania, druga chroni oczy przed kurzem.', { bird: 1, feathers: 1, tail: 1, legs: 1, big_d: 1, fast: 1 }),

  // === RYBY SŁODKOWODNE ===
  mk('carp', 'Karp', '🐟', 'Karp jest tradycyjną rybą wigilijną w Polsce.', { fish: 1, scales: 1, tail: 1, water: 1, pol: 1, plant: 1 }),
  mk('pike', 'Szczupak', '🐟', 'Szczupak czeka w bezruchu i atakuje błyskawicznie.', { fish: 1, scales: 1, tail: 1, water: 1, pol: 1, pred: 1, big_d: -1, fast: 1 }),
  mk('catfish', 'Sum', '🐟', 'Sum ma "wąsy" — to czujniki smaku.', { fish: 1, tail: 1, water: 1, pol: 1, pred: 1, big_d: 1 }),
  mk('eel', 'Węgorz', '🐍', 'Węgorz przemierza tysiące kilometrów, by się rozmnożyć.', { fish: 1, tail: 1, water: 1, pol: 1, pred: 1 }),
  mk('salmon', 'Łosoś', '🐟', 'Łosoś wraca do rzeki, w której się urodził.', { fish: 1, scales: 1, tail: 1, water: 1, pol: -1, ocean: -1, pred: 1, fast: 1 }),
  mk('trout', 'Pstrąg', '🐟', 'Pstrągi lubią zimne, czyste górskie strumienie.', { fish: 1, scales: 1, tail: 1, water: 1, pol: 1, pred: 1 }),
  mk('tench', 'Lin', '🐟', 'Lin lubi muliste dno stawów.', { fish: 1, scales: 1, tail: 1, water: 1, pol: 1 }),
  mk('perch', 'Okoń', '🐟', 'Okoń to drapieżnik o czerwonych płetwach.', { fish: 1, scales: 1, tail: 1, water: 1, pol: 1, pred: 1 }),
  mk('zander', 'Sandacz', '🐟', 'Sandacz widzi świetnie nawet w mętnej wodzie.', { fish: 1, scales: 1, tail: 1, water: 1, pol: 1, pred: 1, fast: 1 }),
  mk('roach', 'Płoć', '🐟', 'Płoć ma czerwone oczy.', { fish: 1, scales: 1, tail: 1, water: 1, pol: 1, small_c: 1 }),

  // === RYBY MORSKIE ===
  mk('shark', 'Rekin', '🦈', 'Rekin ma kilka rzędów zębów i nowe zawsze wyrastają.', { fish: 1, scales: 1, tail: 1, water: 1, ocean: 1, pred: 1, big_d: 1, danger: 1, fast: 1 }),
  mk('manta', 'Manta', '🐟', 'Manty mają największe mózgi spośród ryb.', { fish: 1, tail: 1, water: 1, ocean: 1, big_d: 1 }),
  mk('tuna', 'Tuńczyk', '🐟', 'Tuńczyk pływa nawet 70 km/h.', { fish: 1, scales: 1, tail: 1, water: 1, ocean: 1, pred: 1, big_d: 1, fast: 1, groups: 1 }),
  mk('mackerel', 'Makrela', '🐟', 'Makrele pływają w wielkich ławicach.', { fish: 1, scales: 1, tail: 1, water: 1, ocean: 1, fast: 1, groups: 1 }),
  mk('herring', 'Śledź', '🐟', 'Śledzie tworzą ławice liczone w milionach.', { fish: 1, scales: 1, tail: 1, water: 1, ocean: 1, small_c: 1, groups: 1 }),
  mk('cod', 'Dorsz', '🐟', 'Dorsz ma "brodę" pod żuchwą.', { fish: 1, scales: 1, tail: 1, water: 1, ocean: 1, pred: 1 }),
  mk('swordfish', 'Miecznik', '🗡️', 'Miecznik ma długi "miecz" do oszołamiania ryb.', { fish: 1, tail: 1, water: 1, ocean: 1, pred: 1, big_d: 1, fast: 1 }),
  mk('seahorse', 'Konik morski', '🐴', 'U koników morskich tatuś rodzi dzieci!', { fish: 1, tail: 1, water: 1, ocean: 1, small_c: 1 }),
  mk('barracuda', 'Barakuda', '🐟', 'Barakuda atakuje błysk w wodzie.', { fish: 1, scales: 1, tail: 1, water: 1, ocean: 1, pred: 1, danger: -1, fast: 1 }),
  mk('clownfish', 'Ryba klaun', '🐠', 'Ryba klaun żyje w ukwiale, który ją chroni.', { fish: 1, scales: 1, tail: 1, water: 1, ocean: 1, small_c: 1 }),
  mk('moray', 'Murena', '🐍', 'Murena oddycha z otwartą paszczą — pompuje wodę.', { fish: 1, tail: 1, water: 1, ocean: 1, pred: 1, danger: -1 }),
  mk('flounder', 'Flądra', '🐟', 'Flądra ma oboje oczu po jednej stronie.', { fish: 1, scales: 1, tail: 1, water: 1, ocean: 1 }),
  mk('anchovy', 'Sardela', '🐟', 'Sardela pływa w ogromnych ławicach.', { fish: 1, scales: 1, tail: 1, water: 1, ocean: 1, small_c: 1, groups: 1 }),
  mk('piranha', 'Pirania', '🐟', 'Piranie żyją w słodkich wodach Amazonki.', { fish: 1, scales: 1, tail: 1, water: 1, jungle: 1, pred: 1, danger: -1, small_c: 1 }),
  mk('eel_electric', 'Węgorz elektryczny', '⚡', 'Węgorz elektryczny rozpętuje "piorun" o sile 600V.', { fish: 1, tail: 1, water: 1, jungle: 1, pred: 1, danger: 1 }),

  // === GADY ===
  mk('snake', 'Wąż', '🐍', 'Wąż "słyszy" wibracje gruntu szczęką.', { reptile: 1, scales: 1, pol: -1, pred: 1, danger: -1, tail: -1 }),
  mk('cobra', 'Kobra', '🐍', 'Kobra rozkłada kaptur, gdy się denerwuje.', { reptile: 1, scales: 1, jungle: -1, pred: 1, danger: 1, venom: 1, tail: -1, afr: -1 }),
  mk('python', 'Pyton', '🐍', 'Pyton owija się wokół zdobyczy i ją dusi.', { reptile: 1, scales: 1, jungle: 1, pred: 1, big_d: -1, danger: 1, tail: -1 }),
  mk('anaconda', 'Anakonda', '🐍', 'Anakonda to najcięższy wąż świata.', { reptile: 1, scales: 1, water: -1, jungle: 1, pred: 1, big_d: 1, danger: 1, tail: -1 }),
  mk('rattlesnake', 'Grzechotnik', '🐍', 'Grzechotnik strzela ostrzeżenie ogonem przed atakiem.', { reptile: 1, scales: 1, tail: 1, pred: 1, danger: 1, venom: 1 }),
  mk('lizard', 'Jaszczurka zwinka', '🦎', 'Jaszczurka odrzuca ogon przy ataku — odrośnie.', { reptile: 1, scales: 1, tail: 1, legs: 1, pol: 1, small_c: 1, fast: 1 }),
  mk('gecko', 'Gekon', '🦎', 'Gekon chodzi po szybach dzięki milionom maleńkich włosków na łapkach.', { reptile: 1, scales: 1, tail: 1, legs: 1, home: -1, jungle: -1, small_c: 1, nocturnal: -1, pol: -1 }),
  mk('chameleon', 'Kameleon', '🦎', 'Kameleon strzela językiem dwa razy dłuższym od ciała.', { reptile: 1, scales: 1, tail: 1, legs: 1, jungle: -1, pred: 1, small_c: 1, afr: 1 }),
  mk('iguana', 'Legwan', '🦎', 'Legwany mają "trzecie oko" na szczycie głowy.', { reptile: 1, scales: 1, tail: 1, legs: 1, jungle: 1, plant: 1, big_d: -1 }),
  mk('komodo', 'Waran z Komodo', '🦎', 'Waran z Komodo to największa jaszczurka świata.', { reptile: 1, scales: 1, tail: 1, legs: 1, pred: 1, big_d: 1, danger: 1, venom: 1 }),
  mk('sea_turtle', 'Żółw morski', '🐢', 'Żółw morski wraca na tę samą plażę co dekady wcześniej.', { reptile: 1, shell: 1, tail: 1, legs: 1, water: 1, ocean: 1, big_d: -1 }),
  mk('turtle', 'Żółw lądowy', '🐢', 'Niektóre żółwie lądowe dożywają ponad 100 lat.', { reptile: 1, shell: 1, tail: 1, legs: 1, plant: 1 }),
  mk('crocodile', 'Krokodyl', '🐊', 'Krokodyl może nie jeść przez wiele miesięcy — wystarcza mu zapas energii.', { reptile: 1, scales: 1, tail: 1, legs: 1, water: 1, afr: -1, pred: 1, big_d: 1, danger: 1 }),
  mk('alligator', 'Aligator', '🐊', 'Aligator ma w pysku około 80 zębów — gdy ząb wypadnie, na jego miejsce rośnie nowy.', { reptile: 1, scales: 1, tail: 1, legs: 1, water: 1, pred: 1, big_d: 1, danger: 1 }),
  mk('boa', 'Boa dusiciel', '🐍', 'Boa dusiciel poluje w nocy.', { reptile: 1, scales: 1, jungle: 1, pred: 1, big_d: -1, tail: -1 }),

  // === PŁAZY ===
  mk('frog', 'Żaba', '🐸', 'Żaba pije wodę przez skórę!', { amphi: 1, legs: 1, water: -1, pol: 1, small_c: 1 }),
  mk('toad', 'Ropucha', '🐸', 'Ropucha ma suchszą skórę niż żaba.', { amphi: 1, legs: 1, pol: 1, small_c: 1 }),
  mk('salamander', 'Salamandra', '🦎', 'Salamandry potrafią regenerować całe kończyny.', { amphi: 1, tail: 1, legs: 1, pol: 1, small_c: 1 }),
  mk('newt', 'Traszka', '🦎', 'Traszki wracają do tej samej kałuży co roku.', { amphi: 1, tail: 1, legs: 1, water: -1, pol: 1, small_c: 1 }),
  mk('axolotl', 'Aksolotl', '🦎', 'Aksolotl pochodzi z jezior Meksyku i nigdy nie "dorasta" — całe życie zostaje wodną larwą.', { amphi: 1, tail: 1, legs: 1, water: 1, small_c: 1, home: -1 }),

  // === OWADY ===
  mk('butterfly', 'Motyl', '🦋', 'Motyl smakuje świat… stopkami!', { insect: 1, fly: 1, pol: 1, small_c: 1, legs: 1 }),
  mk('ladybug', 'Biedronka', '🐞', 'Biedronka zjada nawet 5000 mszyc rocznie.', { insect: 1, fly: 1, pol: 1, pred: 1, small_c: 1, legs: 1 }),
  mk('ant', 'Mrówka', '🐜', 'Mrówka uniesie 50x więcej niż waży sama.', { insect: 1, pol: 1, small_c: 1, groups: 1, legs: 1 }),
  mk('bee', 'Pszczoła', '🐝', 'Pszczoła robi miód z nektaru kwiatów.', { insect: 1, fly: 1, pol: 1, danger: -1, small_c: 1, groups: 1, venom: 1, legs: 1 }),
  mk('wasp', 'Osa', '🐝', 'Osy budują gniazda z przeżutego drewna.', { insect: 1, fly: 1, pol: 1, danger: 1, small_c: 1, groups: 1, venom: 1, legs: 1 }),
  mk('bumblebee', 'Trzmiel', '🐝', 'Trzmiel "buczy" niżej niż pszczoła i zapyla rośliny.', { insect: 1, fly: 1, pol: 1, small_c: 1, legs: 1 }),
  mk('mosquito', 'Komar', '🦟', 'Gryzą tylko samice komarów — samce piją nektar z kwiatów.', { insect: 1, fly: 1, pol: 1, danger: -1, small_c: 1, fast: 1, legs: 1 }),
  mk('fly', 'Mucha', '🪰', 'Mucha widzi ruch kilka razy szybciej niż my — dlatego tak trudno ją złapać.', { insect: 1, fly: 1, pol: 1, small_c: 1, fast: 1, legs: 1 }),
  mk('cricket', 'Świerszcz', '🦗', 'Świerszcz "śpiewa" pocierając skrzydłami.', { insect: 1, pol: 1, small_c: 1, legs: 1 }),
  mk('grasshopper', 'Konik polny', '🦗', 'Konik polny skacze 20x swojej długości.', { insect: 1, pol: 1, plant: 1, small_c: 1, fast: 1, legs: 1, fly: 1 }),
  mk('dragonfly', 'Ważka', '🦋', 'Ważka łapie ofiarę w locie z 95% skutecznością.', { insect: 1, fly: 1, pol: 1, pred: 1, small_c: 1, fast: 1, legs: 1 }),
  mk('mayfly', 'Jętka', '🦋', 'Jętka żyje jako dorosła zaledwie 1 dzień.', { insect: 1, fly: 1, pol: 1, small_c: 1, legs: 1 }),
  mk('firefly', 'Świetlik', '✨', 'Świetlik świeci odwłokiem, żeby przyciągnąć partnera.', { insect: 1, fly: 1, small_c: 1, nocturnal: 1, legs: 1, pol: 1 }),
  mk('moth', 'Ćma', '🦋', 'Ćmy krążą wokół lamp, bo sztuczne światło myli ich zmysł orientacji.', { insect: 1, fly: 1, pol: 1, small_c: 1, nocturnal: 1, legs: 1 }),
  mk('cockroach', 'Karaluch', '🪳', 'Karaluch jest bardzo odporny — potrafi przeżyć nawet tydzień bez głowy.', { insect: 1, small_c: 1, fast: 1, nocturnal: 1, legs: 1 }),
  mk('mantis', 'Modliszka', '🦗', 'Modliszka czeka godzinami w bezruchu na zdobycz.', { insect: 1, pred: 1, small_c: 1, legs: 1, pol: 1 }),
  mk('stick_insect', 'Patyczak', '🌿', 'Patyczak udaje gałąź tak dobrze, że łatwo go przegapić.', { insect: 1, plant: 1, small_c: 1, legs: 1 }),
  mk('beetle', 'Żuk', '🪲', 'Chrząszcze to najliczniejsza grupa zwierząt świata — znamy ponad 350 tysięcy gatunków.', { insect: 1, pol: 1, small_c: 1, legs: 1, fly: 1 }),
  mk('stag_beetle', 'Jelonek rogacz', '🪲', 'Samiec jelonka rogacza ma ogromne żuwaczki podobne do poroża jelenia.', { insect: 1, fly: 1, pol: 1, small_c: 1, horns: 1, legs: 1 }),
  mk('termite', 'Termit', '🐜', 'Termity budują kopce wyższe niż żyrafa.', { insect: 1, jungle: -1, afr: -1, small_c: 1, groups: 1, legs: 1 }),

  // === PAJĘCZAKI ===
  mk('spider', 'Pająk krzyżak', '🕷️', 'Pająk krzyżak rozpina nową sieć każdej nocy.', { pol: 1, pred: 1, danger: -1, small_c: 1, venom: -1, legs: 1, nocturnal: -1 }),
  mk('scorpion', 'Skorpion', '🦂', 'Skorpion świeci w ultrafiolecie.', { pred: 1, danger: 1, small_c: 1, nocturnal: 1, legs: 1, afr: -1, venom: 1 }),
  mk('tarantula', 'Tarantula', '🕷️', 'Tarantula ma sierść na całym ciele.', { jungle: -1, pred: 1, danger: -1, nocturnal: -1, venom: 1, legs: 1, small_c: -1 }),
  mk('tick', 'Kleszcz', '🕷️', 'Kleszcz wykrywa cię po dwutlenku węgla, który wydychasz.', { pol: 1, danger: 1, small_c: 1, legs: 1 }),
  mk('bird_eater', 'Ptasznik', '🕷️', 'Ptasznik to największy pająk świata — łapy 30 cm.', { jungle: 1, pred: 1, danger: -1, legs: 1, venom: 1, small_c: -1 }),

  // === SKORUPIAKI ===
  mk('crab', 'Krab', '🦀', 'Krab chodzi bokiem — to szybsze!', { shell: 1, water: -1, ocean: -1, small_c: 1, legs: 1, pred: -1 }),
  mk('crayfish', 'Rak', '🦐', 'Rak ma kleszcze i potrafi pływać do tyłu.', { shell: 1, water: 1, pol: 1, small_c: 1, legs: 1 }),
  mk('shrimp', 'Krewetka', '🦐', 'Krewetki mają dziesięć odnóży, a uciekając, pływają do tyłu, machając ogonem.', { shell: 1, water: 1, ocean: 1, small_c: 1, legs: 1 }),
  mk('lobster', 'Homar', '🦞', 'Homar żyje nawet 100 lat.', { shell: 1, water: 1, ocean: 1, legs: 1 }),
  mk('langouste', 'Langusta', '🦞', 'Langusty maszerują rzędem po dnie morza.', { shell: 1, water: 1, ocean: 1, legs: 1 }),

  // === MIĘCZAKI / INNE ===
  mk('snail', 'Ślimak winniczek', '🐌', 'Ślimak ma 14 000 ząbków na języku.', { shell: 1, pol: 1, plant: 1, small_c: 1 }),
  mk('octopus', 'Ośmiornica', '🐙', 'Ośmiornica ma trzy serca i 8 ramion.', { water: 1, ocean: 1, pred: 1, fast: 1 }),
  mk('squid', 'Kalmar', '🦑', 'Kalmar zostawia chmurę atramentu, żeby uciec.', { water: 1, ocean: 1, pred: 1 }),
  mk('cuttlefish', 'Mątwa', '🦑', 'Mątwa zmienia kolor w mgnieniu oka.', { water: 1, ocean: 1, pred: 1 }),
  mk('jellyfish', 'Meduza', '🪼', 'Meduza nie ma mózgu, ale poluje skutecznie.', { water: 1, ocean: 1, danger: -1, pred: 1, venom: -1 }),
  mk('starfish', 'Rozgwiazda', '⭐', 'Rozgwiazdy odrastają, jeśli stracą ramię.', { water: 1, ocean: 1, pred: 1 }),
  mk('seahorse_dwarf', 'Konik morski karłowaty', '🐴', 'Karłowaty konik morski jest mniejszy od paznokcia.', { fish: 1, tail: 1, water: 1, ocean: 1, small_c: 1 }),
  mk('coral', 'Koralowiec', '🪸', 'Koralowiec żyje setki lat i buduje całe rafy.', { water: 1, ocean: 1 }),

  // === BATCH 2: rozszerzenie do 300 ===

  // domowe / farma extra
  mk('canary', 'Kanarek', '🐤', 'Kanarki potrafią uczyć się nowych melodii.', { bird: 1, feathers: 1, tail: 1, legs: 1, home: 1, fly: 1, small_c: 1, pol: -1 }),
  mk('budgerigar', 'Papużka falista', '🦜', 'Papużki faliste rozmawiają w stadzie cały dzień.', { bird: 1, feathers: 1, tail: 1, legs: 1, home: 1, fly: 1, small_c: 1, pol: -1 }),
  mk('turkey', 'Indyk', '🦃', 'Indyk zmienia kolor skóry na głowie — gdy jest podekscytowany, robi się czerwona lub niebieska.', { bird: 1, feathers: 1, tail: 1, legs: 1, farm: 1, pol: 1, big_d: -1 }),
  mk('guinea_fowl', 'Perliczka', '🐔', 'Perliczki krzyczą jak alarm gdy widzą obcego.', { bird: 1, feathers: 1, tail: 1, legs: 1, farm: 1, pol: 1 }),
  mk('mule', 'Muł', '🫏', 'Muł to mieszaniec konia i osła — pracowity i wytrzymały.', { mammal: 1, fur: 1, tail: 1, legs: 1, farm: 1, plant: 1, big_d: 1, long_ears: 1 }),
  mk('llama', 'Lama', '🦙', 'Zdenerwowana lama potrafi splunąć nawet na 3 metry!', { mammal: 1, fur: 1, tail: 1, legs: 1, farm: 1, plant: 1, big_d: 1, groups: 1 }),
  mk('yak', 'Jak', '🐂', 'Jaki żyją wysoko w Himalajach — odporne na zimno.', { mammal: 1, fur: 1, tail: 1, legs: 1, farm: -1, plant: 1, big_d: 1, horns: 1 }),

  // polskie ekstra
  mk('shrew', 'Ryjówka', '🐭', 'Ryjówka codziennie zjada prawie tyle, ile sama waży.', { mammal: 1, fur: 1, tail: 1, legs: 1, pol: 1, pred: 1, small_c: -1, fast: 1, forest: 1, nocturnal: -1 }),
  mk('dormouse', 'Popielica', '🐭', 'Popielica zapada w zimowy sen na pół roku.', { mammal: 1, fur: 1, tail: 1, legs: 1, pol: 1, small_c: 1, forest: 1, rodent: 1, nocturnal: 1 }),
  mk('chamois', 'Kozica', '🦌', 'Kozice pewnie skaczą po stromych skałach Tatr — mają kopyta jak antypoślizgowe buty.', { mammal: 1, fur: 1, tail: 1, legs: 1, pol: 1, plant: 1, fast: 1, horns: 1 }),
  mk('mountain_hare', 'Zając bielak', '🐰', 'Zając bielak zimą staje się śnieżnobiały.', { mammal: 1, fur: 1, tail: 1, legs: 1, pol: -1, arctic: -1, plant: 1, fast: 1, long_ears: 1 }),
  mk('hare', 'Zając szarak', '🐰', 'Zając szarak biega 70 km/h.', { mammal: 1, fur: 1, tail: 1, legs: 1, pol: 1, plant: 1, fast: 1, long_ears: 1, small_c: -1 }),
  mk('finch', 'Zięba', '🐦', 'Samiec zięby wiosną śpiewa głośno z czubka drzewa — w każdej okolicy trochę inaczej.', { bird: 1, feathers: 1, tail: 1, legs: 1, pol: 1, fly: 1, small_c: 1 }),
  mk('bullfinch', 'Gil', '🐦', 'Gil ma czerwoną pierś — łatwo go zobaczyć zimą.', { bird: 1, feathers: 1, tail: 1, legs: 1, pol: 1, fly: 1, small_c: 1 }),
  mk('goldfinch', 'Szczygieł', '🐦', 'Szczygieł kocha nasiona ostu.', { bird: 1, feathers: 1, tail: 1, legs: 1, pol: 1, fly: 1, small_c: 1 }),
  mk('partridge', 'Kuropatwa', '🐦', 'Kuropatwy biegną w stadzie po polach.', { bird: 1, feathers: 1, tail: 1, legs: 1, pol: 1, fly: -1, groups: 1 }),
  mk('pheasant', 'Bażant', '🐦', 'Samce bażanta mają długie, kolorowe ogony.', { bird: 1, feathers: 1, tail: 1, legs: 1, pol: 1, fly: 1, forest: -1 }),
  mk('thrush', 'Drozd śpiewak', '🐦', 'Drozd rozbija ślimaki o kamień — używa narzędzia.', { bird: 1, feathers: 1, tail: 1, legs: 1, pol: 1, fly: 1, small_c: 1 }),
  mk('jackdaw', 'Kawka', '🐦', 'Kawki mają jasnoniebieskie oczy.', { bird: 1, feathers: 1, tail: 1, legs: 1, pol: 1, fly: 1 }),
  mk('crow', 'Wrona', '🐦', 'Wrony rozpoznają twarze ludzi przez lata.', { bird: 1, feathers: 1, tail: 1, legs: 1, pol: 1, fly: 1, small_c: -1 }),
  mk('mazurek', 'Mazurek', '🐦', 'Mazurek to kuzyn wróbla — poznasz go po brązowej czapeczce i czarnej plamce na policzku.', { bird: 1, feathers: 1, tail: 1, legs: 1, pol: 1, fly: 1, small_c: 1 }),
  mk('mallard', 'Krzyżówka', '🦆', 'Krzyżówka to najpopularniejsza dzika kaczka.', { bird: 1, feathers: 1, tail: 1, legs: 1, pol: 1, water: 1, fly: 1 }),
  mk('grebe', 'Perkoz', '🐦', 'Perkoz nosi pisklęta na grzbiecie pływając.', { bird: 1, feathers: 1, tail: 1, legs: 1, pol: 1, water: 1, fly: 1 }),
  mk('viper', 'Żmija zygzakowata', '🐍', 'Żmija to jedyny jadowity wąż w Polsce.', { reptile: 1, scales: 1, pol: 1, pred: 1, danger: 1, venom: 1, forest: 1, tail: -1 }),
  mk('grass_snake', 'Zaskroniec', '🐍', 'Zaskroniec ma dwie żółte plamy na głowie.', { reptile: 1, scales: 1, pol: 1, water: -1, pred: 1, tail: -1 }),
  mk('slowworm', 'Padalec', '🦎', 'Padalec wygląda jak wąż, ale to beznoga jaszczurka.', { reptile: 1, scales: 1, tail: 1, pol: 1, small_c: 1 }),
  mk('fire_salamander', 'Salamandra plamista', '🦎', 'Czarno-żółte barwy salamandry ostrzegają: uważaj, moja skóra jest trująca!', { amphi: 1, tail: 1, legs: 1, pol: 1, small_c: 1, forest: 1 }),

  // afryka ekstra
  mk('fennec', 'Fenek', '🦊', 'Fenek ma ogromne uszy — chłodzi nimi ciało na pustyni.', { mammal: 1, fur: 1, tail: 1, legs: 1, afr: 1, pred: 1, small_c: 1, fast: 1, barks: 1, long_ears: 1 }),
  mk('mongoose', 'Mangusta', '🐾', 'Mangusta jest tak zwinna, że potrafi pokonać nawet kobrę.', { mammal: 1, fur: 1, tail: 1, legs: 1, afr: 1, pred: 1, small_c: 1, fast: 1, groups: 1 }),
  mk('dik_dik', 'Dik-dik', '🦌', 'Dik-dik ma tylko około 35 cm wysokości — to jedna z najmniejszych antylop Afryki.', { mammal: 1, fur: 1, tail: 1, legs: 1, afr: 1, plant: 1, small_c: 1, fast: 1, horns: 1 }),
  mk('impala', 'Impala', '🦌', 'Impale skaczą 3 metry w górę i 10 wzdłuż.', { mammal: 1, fur: 1, tail: 1, legs: 1, afr: 1, plant: 1, fast: 1, horns: 1, groups: 1 }),
  mk('kudu', 'Kudu', '🦌', 'Samce kudu mają długie, spiralne rogi.', { mammal: 1, fur: 1, tail: 1, legs: 1, afr: 1, plant: 1, big_d: 1, fast: 1, horns: 1 }),
  mk('eland', 'Eland', '🦌', 'Eland to największa antylopa świata.', { mammal: 1, fur: 1, tail: 1, legs: 1, afr: 1, plant: 1, big_d: 1, horns: 1, groups: 1 }),
  mk('oryx', 'Oryks', '🦌', 'Oryks przeżywa miesiące bez wody — używa rosy.', { mammal: 1, fur: 1, tail: 1, legs: 1, afr: 1, plant: 1, big_d: 1, fast: 1, horns: 1 }),
  mk('springbok', 'Springbok', '🦌', 'Springboki podskakują wysoko w miejscu — pokazują drapieżnikom, że są silne i szybkie.', { mammal: 1, fur: 1, tail: 1, legs: 1, afr: 1, plant: 1, fast: 1, horns: 1, groups: 1 }),
  mk('african_wild_dog', 'Likaon', '🐕', 'Likaony polują stadem skuteczniej niż lwy.', { mammal: 1, fur: 1, tail: 1, legs: 1, afr: 1, pred: 1, fast: 1, danger: -1, groups: 1, barks: 1 }),
  mk('aardvark', 'Mrównik', '🐽', 'Mrównik kopie tunele i zjada termity językiem.', { mammal: 1, tail: 1, legs: 1, afr: 1, pred: 1, nocturnal: 1 }),
  mk('rock_hyrax', 'Góralek', '🐭', 'Góralek wygląda jak świnka morska, a jest dalekim kuzynem słonia!', { mammal: 1, fur: 1, legs: 1, afr: 1, plant: 1, small_c: 1 }),
  mk('serval', 'Serwal', '🐈', 'Serwal skacze 3 metry w pionie, łapie ptaki.', { mammal: 1, fur: 1, tail: 1, legs: 1, afr: 1, pred: 1, fast: 1, meows: 1 }),
  mk('aardwolf', 'Protel', '🐺', 'Protel zjada termity — odróżnia się od hieny.', { mammal: 1, fur: 1, tail: 1, legs: 1, afr: 1, nocturnal: 1, pred: 1 }),

  // azja / dżungla / ameryki ekstra
  mk('siberian_tiger', 'Tygrys syberyjski', '🐅', 'Tygrys syberyjski to największy kot świata.', { mammal: 1, fur: 1, tail: 1, legs: 1, pred: 1, big_d: 1, arctic: -1, danger: 1, fast: 1, meows: 1 }),
  mk('red_panda', 'Panda mała', '🐼', 'Panda mała wygląda jak skrzyżowanie kota i lisa.', { mammal: 1, fur: 1, tail: 1, legs: 1, plant: 1, forest: 1 }),
  mk('sun_bear', 'Niedźwiedź malajski', '🐻', 'Niedźwiedź malajski ma najdłuższy język wśród niedźwiedzi.', { mammal: 1, fur: 1, tail: 1, legs: 1, jungle: 1, big_d: 1, forest: 1 }),
  mk('moon_bear', 'Niedźwiedź himalajski', '🐻', 'Niedźwiedź himalajski ma biały półksiężyc na piersi.', { mammal: 1, fur: 1, tail: 1, legs: 1, jungle: -1, big_d: 1, forest: 1 }),
  mk('sloth_bear', 'Niedźwiedź wargacz', '🐻', 'Wargacz wciąga termity jak odkurzaczem.', { mammal: 1, fur: 1, tail: 1, legs: 1, jungle: 1, big_d: 1, forest: 1 }),
  mk('langur', 'Langur', '🐒', 'Langury skaczą między drzewami przez 10 metrów.', { mammal: 1, fur: 1, tail: 1, legs: 1, jungle: 1, plant: 1, groups: 1, forest: 1, primate: 1 }),
  mk('japanese_macaque', 'Makak japoński', '🐒', 'Te makaki kąpią się w gorących źródłach zimą!', { mammal: 1, fur: 1, tail: 1, legs: 1, arctic: -1, groups: 1, primate: 1 }),
  mk('binturong', 'Binturong', '🐈', 'Binturong pachnie jak prażony popcorn!', { mammal: 1, fur: 1, tail: 1, legs: 1, jungle: 1, forest: 1 }),
  mk('asian_elephant', 'Słoń indyjski', '🐘', 'Słoń indyjski ma mniejsze uszy niż afrykański, a jego trąba kończy się jednym "palcem".', { mammal: 1, tail: 1, legs: 1, jungle: 1, plant: 1, big_d: 1, groups: 1 }),
  mk('snow_leopard', 'Pantera śnieżna', '🐆', 'Pantera śnieżna żyje wysoko w Himalajach.', { mammal: 1, fur: 1, tail: 1, legs: 1, arctic: -1, pred: 1, big_d: 1, fast: 1, meows: 1 }),
  mk('puma', 'Puma', '🐆', 'Puma skacze 6 metrów w jednym susie.', { mammal: 1, fur: 1, tail: 1, legs: 1, pred: 1, big_d: 1, fast: 1, meows: 1 }),
  mk('coyote', 'Kojot', '🐺', 'Kojot wyje, szczeka i skomli — potrafi wydać kilkanaście różnych odgłosów.', { mammal: 1, fur: 1, tail: 1, legs: 1, pred: 1, fast: 1, barks: 1 }),
  mk('grizzly', 'Grizzly', '🐻', 'Grizzly łapie łososie wprost z wodospadu.', { mammal: 1, fur: 1, tail: 1, legs: 1, pred: -1, big_d: 1, danger: 1, forest: 1, plant: -1 }),
  mk('bison_american', 'Bizon amerykański', '🦬', 'Bizon to największy ssak Ameryki Północnej.', { mammal: 1, fur: 1, tail: 1, legs: 1, plant: 1, big_d: 1, horns: 1, groups: 1 }),
  mk('raccoon', 'Szop pracz', '🦝', 'Szop "myje" jedzenie w wodzie przed zjedzeniem.', { mammal: 1, fur: 1, tail: 1, legs: 1, fast: 1, nocturnal: 1, forest: 1, pol: -1 }),
  mk('opossum', 'Oposum', '🐀', 'Oposum udaje martwego gdy się boi.', { mammal: 1, fur: 1, tail: 1, legs: 1, nocturnal: 1, forest: 1, marsupial: 1 }),
  mk('tasmanian_devil', 'Diabeł tasmański', '😈', 'Diabeł tasmański ma najsilniejszy zgryz na kg ciała ze ssaków.', { mammal: 1, fur: 1, tail: 1, legs: 1, pred: 1, danger: -1, nocturnal: 1, marsupial: 1 }),
  mk('wombat', 'Wombat', '🐀', 'Wombaty robią… sześcienne kupki.', { mammal: 1, fur: 1, tail: 1, legs: 1, plant: 1, marsupial: 1 }),
  mk('quokka', 'Kwokka', '🦘', 'Kwokka zawsze "uśmiecha się" do zdjęć.', { mammal: 1, fur: 1, tail: 1, legs: 1, plant: 1, small_c: 1, marsupial: 1 }),
  mk('echidna', 'Kolczatka', '🦔', 'Kolczatka składa jaja, ale karmi mlekiem.', { mammal: 1, tail: 1, legs: 1, pred: 1 }),

  // polarne / morskie ekstra
  mk('beluga', 'Białucha', '🐳', 'Beluga uśmiecha się i piszczy — "kanarek mórz".', { mammal: 1, tail: 1, water: 1, ocean: 1, arctic: 1, big_d: 1, pred: 1, groups: 1 }),
  mk('bowhead', 'Wieloryb grenlandzki', '🐳', 'Wieloryb grenlandzki dożywa nawet 200 lat!', { mammal: 1, tail: 1, water: 1, ocean: 1, arctic: 1, big_d: 1 }),
  mk('bearded_seal', 'Foka brodata', '🦭', 'Foka brodata ma długie wąsy do szukania ryb pod lodem.', { mammal: 1, fur: 1, tail: 1, legs: 1, water: 1, ocean: 1, arctic: 1, pred: 1, big_d: 1 }),
  mk('puffin', 'Maskonur', '🐧', 'Maskonur wygląda jak pingwin z papugowym dziobem.', { bird: 1, feathers: 1, tail: 1, legs: 1, arctic: -1, ocean: 1, fly: 1, small_c: -1, water: 1, pred: 1 }),
  mk('arctic_tern', 'Rybitwa popielata', '🐦', 'Rybitwa przelatuje rocznie 80 000 km — to dwa razy okrążenie Ziemi.', { bird: 1, feathers: 1, tail: 1, legs: 1, arctic: -1, fly: 1, fast: 1, ocean: 1, pred: 1 }),
  mk('hammerhead', 'Rekin młot', '🦈', 'Rekin młot ma oczy daleko od siebie — widzi 360°.', { fish: 1, scales: 1, tail: 1, water: 1, ocean: 1, pred: 1, big_d: 1, danger: 1, fast: 1 }),
  mk('whale_shark', 'Rekin wielorybi', '🦈', 'Rekin wielorybi jest największą rybą — i je tylko plankton.', { fish: 1, tail: 1, water: 1, ocean: 1, big_d: 1 }),
  mk('marlin', 'Marlin', '🐟', 'Marlin pędzi 80 km/h i ma "miecz" do polowania.', { fish: 1, tail: 1, water: 1, ocean: 1, pred: 1, big_d: 1, fast: 1 }),
  mk('moonfish', 'Strojnik', '🐟', 'Strojnik to jedyna znana ryba, która ogrzewa całe swoje ciało — jest stałocieplny!', { fish: 1, tail: 1, water: 1, ocean: 1, big_d: 1 }),
  mk('sardine', 'Sardynka', '🐟', 'Sardynki ławicą wyglądają jak srebrna chmura.', { fish: 1, scales: 1, tail: 1, water: 1, ocean: 1, small_c: 1, groups: 1 }),
  mk('halibut', 'Halibut', '🐟', 'Halibut to płaska ryba większa od człowieka.', { fish: 1, tail: 1, water: 1, ocean: 1, big_d: 1 }),
  mk('sturgeon', 'Jesiotr', '🐟', 'Jesiotr ma kostne tarcze zamiast łusek.', { fish: 1, tail: 1, water: 1, pol: -1, big_d: 1 }),
  mk('catfish_polish', 'Brzana', '🐟', 'Brzana ma wąsiki — pomagają znaleźć jedzenie w mule.', { fish: 1, scales: 1, tail: 1, water: 1, pol: 1 }),
  mk('bream', 'Leszcz', '🐟', 'Leszcze pływają w wielkich ławicach.', { fish: 1, scales: 1, tail: 1, water: 1, pol: 1 }),
  mk('chub', 'Kleń', '🐟', 'Kleń uwielbia szybkie strumienie.', { fish: 1, scales: 1, tail: 1, water: 1, pol: 1, fast: 1 }),
  mk('crucian', 'Karaś', '🐟', 'Karaś jest bardzo wytrzymały — przeżyje zimę w małym stawie, w którym brakuje tlenu.', { fish: 1, scales: 1, tail: 1, water: 1, pol: 1 }),
  mk('burbot', 'Miętus', '🐟', 'Miętus to jedyny dorszowaty słodkowodny.', { fish: 1, tail: 1, water: 1, pol: 1, pred: 1 }),

  // ptaki ekstra
  mk('great_tit', 'Bogatka', '🐦', 'Bogatka to największa nasza sikorka.', { bird: 1, feathers: 1, tail: 1, legs: 1, pol: 1, fly: 1, small_c: 1, forest: 1 }),
  mk('starling', 'Szpak', '🐦', 'Szpaki tworzą w niebie ruchome chmury z tysięcy ptaków.', { bird: 1, feathers: 1, tail: 1, legs: 1, pol: 1, fly: 1, groups: 1 }),
  mk('lark', 'Skowronek', '🐦', 'Skowronek śpiewa wisząc nieruchomo w powietrzu.', { bird: 1, feathers: 1, tail: 1, legs: 1, pol: 1, fly: 1, small_c: 1 }),
  mk('cassowary', 'Kazuar', '🦤', 'Kazuar potrafi być groźniejszy od strusia — mocne kopnięcia.', { bird: 1, feathers: 1, tail: 1, legs: 1, jungle: 1, big_d: 1, danger: 1 }),
  mk('rhea', 'Nandu', '🦤', 'Nandu to mniejszy kuzyn strusia z Ameryki Południowej.', { bird: 1, feathers: 1, tail: 1, legs: 1, big_d: 1, fast: 1 }),
  mk('white_eagle', 'Bielik', '🦅', 'Bielik to największy ptak drapieżny Polski — dorosły ma biały ogon.', { bird: 1, feathers: 1, tail: 1, legs: 1, pol: 1, fly: 1, pred: 1, big_d: -1, small_c: -1 }),
  mk('buzzard', 'Myszołów', '🦅', 'Myszołów najczęściej krąży wysoko nad polami.', { bird: 1, feathers: 1, tail: 1, legs: 1, pol: 1, fly: 1, pred: 1, small_c: -1 }),
  mk('osprey', 'Rybołów', '🦅', 'Rybołów nurkuje za rybą z 30 metrów.', { bird: 1, feathers: 1, tail: 1, legs: 1, pol: 1, water: -1, fly: 1, pred: 1, fast: 1, small_c: -1 }),
  mk('sparrowhawk', 'Krogulec', '🦅', 'Krogulec poluje w lesie szybkim slalomem.', { bird: 1, feathers: 1, tail: 1, legs: 1, pol: 1, fly: 1, pred: 1, fast: 1, small_c: -1 }),
  mk('hobby', 'Kobuz', '🦅', 'Kobuz łapie ważki w locie.', { bird: 1, feathers: 1, tail: 1, legs: 1, pol: 1, fly: 1, pred: 1, fast: 1, small_c: -1 }),
  mk('macaw', 'Ara', '🦜', 'Ary mają najmocniejszy dziób — łupią orzechy brazylijskie.', { bird: 1, feathers: 1, tail: 1, legs: 1, jungle: 1, fly: 1 }),
  mk('parakeet', 'Nimfa', '🦜', 'Nimfa to australijska papuga z żółtym czubem.', { bird: 1, feathers: 1, tail: 1, legs: 1, home: -1, fly: 1, small_c: 1, pol: -1 }),
  mk('ibis', 'Ibis', '🦩', 'Ibis był świętym ptakiem starożytnego Egiptu.', { bird: 1, feathers: 1, tail: 1, legs: 1, afr: -1, water: -1, fly: 1 }),
  mk('marabou', 'Marabut afrykański', '🦅', 'Marabut to ogromny afrykański bocian z łysą głową.', { bird: 1, feathers: 1, tail: 1, legs: 1, afr: 1, fly: 1, big_d: 1, groups: 1 }),

  // gady ekstra
  mk('gharial', 'Gawial', '🐊', 'Gawial ma najwęższy, najdłuższy pysk wśród krokodyli.', { reptile: 1, scales: 1, tail: 1, legs: 1, water: 1, big_d: 1, pred: 1 }),
  mk('saltwater_croc', 'Krokodyl różańcowy', '🐊', 'Krokodyl różańcowy to największy gad świata.', { reptile: 1, scales: 1, tail: 1, legs: 1, water: 1, ocean: -1, pred: 1, big_d: 1, danger: 1 }),
  mk('horned_lizard', 'Frynozom', '🦎', 'Frynozom strzela krwią z oczu, gdy się broni.', { reptile: 1, scales: 1, tail: 1, legs: 1, small_c: 1 }),
  mk('tortoise_giant', 'Żółw olbrzymi', '🐢', 'Żółw olbrzymi z wysp Aldabra na Oceanie Indyjskim może żyć ponad 150 lat.', { reptile: 1, shell: 1, tail: 1, legs: 1, plant: 1, big_d: 1 }),
  mk('monitor_lizard', 'Waran stepowy', '🦎', 'Waran ma długi rozdwojony język jak wąż.', { reptile: 1, scales: 1, tail: 1, legs: 1, afr: -1, pred: 1 }),
  mk('basilisk', 'Bazyliszek', '🦎', 'Bazyliszek biega po wodzie — naprawdę!', { reptile: 1, scales: 1, tail: 1, legs: 1, water: -1, jungle: 1, fast: 1 }),

  // płazy ekstra
  mk('poison_frog', 'Drzewołaz', '🐸', 'Drzewołazy mają najjaskrawsze kolory ostrzegawcze.', { amphi: 1, legs: 1, jungle: 1, danger: 1, small_c: 1, venom: 1 }),
  mk('tree_frog', 'Rzekotka czerwonooka', '🐸', 'Rzekotka czerwonooka śpi w dzień przyklejona do liścia, a nocą otwiera wielkie czerwone oczy.', { amphi: 1, legs: 1, small_c: 1, jungle: 1, nocturnal: 1 }),
  mk('bullfrog', 'Żaba rycząca', '🐸', 'Żaba rycząca brzmi jak krowa w bagnie.', { amphi: 1, legs: 1, water: 1, small_c: -1 }),
  mk('caecilian', 'Robaczyca', '🐍', 'Robaczyce to płazy bez nóg — wyglądają jak węże.', { amphi: 1, jungle: 1, small_c: 1 }),

  // owady ekstra
  mk('cockroach_asian', 'Karaczan azjatycki', '🪳', 'Karaczany potrafią latać i przeżyć nawet tydzień bez głowy.', { insect: 1, fly: -1, small_c: 1, fast: 1, nocturnal: 1, legs: 1 }),
  mk('cricket_house', 'Świerszcz domowy', '🦗', 'Świerszcz domowy lubi ciepłe piwnice i kuchnie.', { insect: 1, small_c: 1, legs: 1, home: -1 }),
  mk('hornet', 'Szerszeń', '🐝', 'Szerszeń to największa osa w Polsce.', { insect: 1, fly: 1, pol: 1, danger: 1, small_c: 1, groups: 1, venom: 1, legs: 1 }),
  mk('flea', 'Pchła', '🦟', 'Pchła skacze 150 razy swoją długość.', { insect: 1, small_c: 1, fast: 1, legs: 1 }),
  mk('louse', 'Wesz', '🦟', 'Wesz nie skacze — chodzi po włosach.', { insect: 1, small_c: 1, legs: 1 }),
  mk('caterpillar', 'Gąsienica', '🐛', 'Gąsienica po przepoczwarczeniu zamieni się w motyla.', { insect: 1, pol: 1, plant: 1, small_c: 1, legs: 1 }),
  mk('locust', 'Szarańcza', '🦗', 'Szarańcza w stadzie może zjeść uprawę na hektary.', { insect: 1, fly: 1, plant: 1, small_c: 1, fast: 1, legs: 1, afr: 1 }),
  mk('silk_moth', 'Jedwabnik', '🦋', 'Dorosły jedwabnik to ćma, która nie umie latać — ludzie hodują go od tysięcy lat.', { insect: 1, small_c: 1, nocturnal: 1, legs: 1 }),
  mk('atlas_moth', 'Pawica atlas', '🦋', 'Pawica atlas to jedna z największych ciem świata — skrzydła ma większe niż dłoń dorosłego.', { insect: 1, fly: 1, jungle: 1, small_c: 1, nocturnal: 1, legs: 1 }),

  // pajęczaki / inne
  mk('mite', 'Roztocz', '🕷️', 'Roztocza są tak małe, że widać je dopiero pod mikroskopem.', { small_c: 1, legs: 1 }),
  mk('harvestman', 'Kosarz', '🕷️', 'Kosarz ma bardzo długie nogi, ale nie tka sieci.', { pol: 1, small_c: 1, legs: 1 }),
  mk('black_widow', 'Czarna wdowa', '🕷️', 'Czarna wdowa ma czerwoną klepsydrę na brzuchu.', { pred: 1, danger: 1, small_c: 1, venom: 1, legs: 1, nocturnal: 1 }),

  // skorupiaki / mięczaki ekstra
  mk('hermit_crab', 'Krab pustelnik', '🦀', 'Krab pustelnik wprowadza się w cudze muszle.', { shell: 1, water: 1, ocean: 1, small_c: 1, legs: 1 }),
  mk('coconut_crab', 'Krab kokosowy', '🦀', 'Krab kokosowy rozłupie orzech kokosowy kleszczami.', { shell: 1, big_d: -1, legs: 1 }),
  mk('krill', 'Kryl', '🦐', 'Kryl to malutkie skorupiaki — płetwal błękitny zjada ich nawet kilka ton dziennie.', { shell: 1, water: 1, ocean: 1, small_c: 1, groups: 1, legs: 1 }),
  mk('barnacle', 'Pąkla', '🪸', 'Pąkle przyklejają się do statków i wielorybów.', { shell: 1, water: 1, ocean: 1, small_c: 1 }),
  mk('slug', 'Ślimak nagi', '🐌', 'Ślimak nagi nie ma muszli — chowa się w wilgoci.', { pol: 1, plant: 1, small_c: 1 }),
  mk('clam', 'Małż', '🦪', 'Niektóre małże żyją ponad 500 lat.', { shell: 1, water: 1, ocean: -1 }),
  mk('oyster', 'Ostryga', '🦪', 'Ostryga tworzy perłę wokół drobinki, która dostała się do jej muszli.', { shell: 1, water: 1, ocean: 1 }),
  mk('sea_urchin', 'Jeżowiec', '🪸', 'Jeżowiec ma kolce i porusza się powolnie po dnie.', { water: 1, ocean: 1, small_c: 1 }),
  mk('sea_anemone', 'Ukwiał', '🪸', 'Ukwiał to "podwodny kwiat" — z parzącymi mackami.', { water: 1, ocean: 1, danger: -1, pred: 1 }),
  mk('centipede', 'Parecznik', '🐛', 'Parecznik ma dużo nóg, ale nigdy dokładnie sto — zawsze nieparzystą liczbę par.', { pol: 1, legs: 1, pred: 1, danger: -1, small_c: 1, venom: 1 }),
  mk('earthworm', 'Dżdżownica', '🪱', 'Dżdżownica spulchnia ziemię — to przyjaciel ogrodu.', { pol: 1, plant: -1, small_c: 1 }),

  // === BATCH 3: rozszerzenie do 500 ===

  // SSAKI — Polski/europejski dodatki
  mk('wildcat', 'Żbik', '🐈‍⬛', 'Żbik wygląda jak duży kot domowy, ale jest rzadkim dzikim drapieżnikiem.', { mammal: 1, fur: 1, tail: 1, legs: 1, pol: 1, pred: 1, fast: 1, meows: 1, forest: 1, nocturnal: -1 }),
  mk('vole', 'Nornica ruda', '🐀', 'Nornica buduje podziemne tunele i magazynuje nasiona na zimę.', { mammal: 1, fur: 1, tail: 1, legs: 1, pol: 1, small_c: 1, rodent: 1, plant: 1, nocturnal: -1 }),
  mk('water_shrew', 'Rzęsorek', '🐭', 'Rzęsorek to jeden z niewielu ssaków z jadowitą śliną — i świetnie nurkuje.', { mammal: 1, fur: 1, tail: 1, legs: 1, pol: 1, water: -1, pred: 1, small_c: 1 }),
  mk('polecat', 'Tchórz pospolity', '🦦', 'Tchórz potrafi obronić się cuchnącym sprayem.', { mammal: 1, fur: 1, tail: 1, legs: 1, pol: 1, pred: 1, fast: 1, nocturnal: 1 }),
  mk('sable', 'Soból', '🦦', 'Soból ma jedno z najcenniejszych futer świata.', { mammal: 1, fur: 1, tail: 1, legs: 1, pred: 1, fast: 1, nocturnal: -1 }),
  mk('european_mink', 'Norka europejska', '🦦', 'Norka świetnie pływa i nurkuje za rybami.', { mammal: 1, fur: 1, tail: 1, legs: 1, water: -1, pred: 1 }),
  mk('musk_rat', 'Piżmak', '🐀', 'Piżmak buduje w mokradłach pływające chatki z trzciny.', { mammal: 1, fur: 1, tail: 1, legs: 1, water: 1, pol: 1, rodent: 1, plant: 1 }),
  mk('european_hamster', 'Chomik europejski', '🐹', 'Chomik europejski jest większy od domowego i mieszka w polach.', { mammal: 1, fur: 1, tail: 1, legs: 1, pol: 1, small_c: 1, rodent: 1, plant: 1 }),
  mk('marmot', 'Świstak', '🐾', 'Świstak gwiżdże ostrzegawczo, gdy widzi orła.', { mammal: 1, fur: 1, tail: 1, legs: 1, plant: 1, small_c: -1, rodent: 1, pol: 1 }),
  mk('ibex', 'Koziorożec alpejski', '🐐', 'Koziorożec chodzi po niemal pionowych skałach.', { mammal: 1, fur: 1, tail: 1, legs: 1, plant: 1, horns: 1 }),

  // SSAKI — Afryka extra
  mk('okapi', 'Okapi', '🦓', 'Okapi to leśny kuzyn żyrafy z pasami zebry na nogach.', { mammal: 1, fur: 1, tail: 1, legs: 1, afr: 1, plant: 1 }),
  mk('pangolin', 'Łuskowiec', '🦔', 'Łuskowiec ma łuski i zwija się w kulę jak szyszka.', { mammal: 1, tail: 1, legs: 1, scales: 1, afr: -1, pred: 1 }),
  mk('ratel', 'Miodożer', '🦡', 'Miodożer jest tak nieustraszony, że atakuje nawet lwy.', { mammal: 1, fur: 1, tail: 1, legs: 1, afr: 1, pred: 1, danger: -1 }),
  mk('sitatunga', 'Sitatunga', '🦌', 'Sitatunga ma długie kopyta — chodzi po bagnach jak po lodzie.', { mammal: 1, fur: 1, tail: 1, legs: 1, afr: 1, plant: 1, horns: 1 }),
  mk('bongo', 'Bongo', '🦌', 'Bongo to największa antylopa leśna Afryki.', { mammal: 1, fur: 1, tail: 1, legs: 1, afr: 1, plant: 1, big_d: 1, horns: 1 }),
  mk('caracal', 'Karakal', '🐈', 'Karakal skacze 3 metry w pionie i łapie ptaki w locie.', { mammal: 1, fur: 1, tail: 1, legs: 1, afr: 1, pred: 1, fast: 1, meows: 1 }),
  mk('aye_aye', 'Aj-aj', '🐒', 'Aj-aj ma długi palec, którym wyciąga larwy z drzew.', { mammal: 1, fur: 1, tail: 1, legs: 1, afr: 1, jungle: 1, primate: 1, nocturnal: 1 }),
  mk('genet', 'Żeneta', '🐈', 'Żeneta wygląda jak kot w cętki z bardzo długim, pręgowanym ogonem.', { mammal: 1, fur: 1, tail: 1, legs: 1, afr: 1, pred: 1, fast: 1, nocturnal: 1 }),
  mk('zebra_grevyi', 'Zebra Grevy’ego', '🦓', 'Zebra Grevy’ego ma najwęższe paski ze wszystkich zebr.', { mammal: 1, fur: 1, tail: 1, legs: 1, afr: 1, plant: 1, big_d: 1, fast: 1 }),
  mk('addax', 'Adaks', '🦌', 'Adaks ma szerokie kopyta — dzięki nim nie zapada się w piasek pustyni.', { mammal: 1, fur: 1, tail: 1, legs: 1, afr: 1, plant: 1, horns: 1 }),

  // SSAKI — Azja extra
  mk('tapir', 'Tapir czaprakowy', '🐗', 'Tapir ma długi, ruchomy nos jak miniaturową trąbę.', { mammal: 1, fur: 1, tail: 1, legs: 1, jungle: 1, plant: 1, big_d: 1 }),
  mk('proboscis_monkey', 'Nosacz sundajski', '🐒', 'Nosacz ma ogromny nos, którym wzmacnia swój głos.', { mammal: 1, fur: 1, tail: 1, legs: 1, jungle: 1, primate: 1, plant: 1, groups: 1 }),
  mk('clouded_leopard', 'Pantera mglista', '🐆', 'Pantera mglista ma najdłuższe kły w stosunku do wielkości ciała spośród żyjących kotów.', { mammal: 1, fur: 1, tail: 1, legs: 1, jungle: 1, pred: 1, big_d: 1, fast: 1, meows: 1 }),
  mk('serow', 'Serau', '🦌', 'Serau wygląda jak skrzyżowanie kozy i antylopy.', { mammal: 1, fur: 1, tail: 1, legs: 1, jungle: 1, plant: 1, horns: 1 }),
  mk('binturong_indo', 'Łaskun', '🐈', 'Łaskun zjada owoce kawy — z nasion, które przeszły przez jego brzuch, robi się bardzo drogą kawę.', { fur: 1, mammal: 1, jungle: 1, forest: 1, tail: 1, legs: 1, nocturnal: 1 }),
  mk('takin', 'Takin', '🐂', 'Takin ma złotawe futro i mieszka w wysokich górach Himalajach.', { mammal: 1, fur: 1, tail: 1, legs: 1, plant: 1, big_d: 1, horns: 1 }),
  mk('dhole', 'Dhole', '🐕', 'Dhole to azjatycki dziki pies, który "gwiżdże" zamiast wyć.', { mammal: 1, fur: 1, tail: 1, legs: 1, jungle: 1, pred: 1, fast: 1 }),
  mk('musk_deer', 'Piżmowiec', '🦌', 'Piżmowiec nie ma poroża — samce mają za to długie kły wystające z pyska.', { mammal: 1, fur: 1, tail: 1, legs: 1, plant: 1 }),
  mk('saiga', 'Suhak', '🦌', 'Suhak ma dziwny, opuchnięty nos — filtruje pył stepowy.', { mammal: 1, fur: 1, tail: 1, legs: 1, plant: 1, fast: 1, horns: 1 }),

  // SSAKI — Ameryka Pd extra
  mk('jaguarundi', 'Jaguarundi', '🐈', 'Jaguarundi wygląda raczej jak wydra niż kot.', { mammal: 1, fur: 1, tail: 1, legs: 1, jungle: 1, pred: 1, fast: 1, meows: 1 }),
  mk('maned_wolf', 'Wilk grzywiasty', '🐺', 'Wilk grzywiasty ma bardzo długie nogi — wygląda jak lis na szczudłach.', { mammal: 1, fur: 1, tail: 1, legs: 1, pred: 1, fast: 1 }),
  mk('coati', 'Ostronos', '🦝', 'Ostronos ma długi nos i ogon w pierścienie.', { mammal: 1, fur: 1, tail: 1, legs: 1, jungle: 1, groups: 1 }),
  mk('paca', 'Paka', '🐀', 'Paka to gryzoń wielkości psa, mistrz unikania jaguarów.', { mammal: 1, fur: 1, legs: 1, jungle: 1, rodent: 1, plant: 1, nocturnal: 1 }),
  mk('tamarin', 'Tamaryna', '🐒', 'Tamaryna lwia ma złotą grzywę jak mały lew.', { mammal: 1, fur: 1, tail: 1, legs: 1, jungle: 1, plant: -1, primate: 1 }),
  mk('marmoset', 'Marmozeta', '🐒', 'Marmozety to jedne z najmniejszych małp świata.', { mammal: 1, fur: 1, tail: 1, legs: 1, jungle: 1, small_c: 1, primate: 1 }),
  mk('vicuna', 'Wikunia', '🦙', 'Wikunia ma najlepszą wełnę świata — tylko Inkowie mogli ją nosić.', { mammal: 1, fur: 1, tail: 1, legs: 1, plant: 1 }),
  mk('guanaco', 'Gwanako', '🦙', 'Gwanako pluje skutecznie do 2 metrów.', { mammal: 1, fur: 1, tail: 1, legs: 1, plant: 1 }),
  mk('giant_otter', 'Wydra olbrzymia', '🦦', 'Wydra olbrzymia może mieć 1,7 m długości — to największa wydra świata.', { mammal: 1, fur: 1, tail: 1, legs: 1, water: 1, jungle: 1, pred: 1, big_d: 1 }),
  mk('pampas_deer', 'Jeleń pampasowy', '🦌', 'Jeleń pampasowy biega po otwartych łąkach Argentyny.', { mammal: 1, fur: 1, tail: 1, legs: 1, plant: 1, fast: 1, horns: 1 }),

  // SSAKI — Polarne/Subarktyczne extra
  mk('caribou', 'Karibu', '🦌', 'Karibu migrują 5000 km rocznie — najdłużej ze wszystkich ssaków lądowych.', { mammal: 1, fur: 1, tail: 1, legs: 1, arctic: 1, plant: 1, big_d: 1, horns: 1 }),
  mk('arctic_wolf', 'Wilk arktyczny', '🐺', 'Wilk arktyczny ma śnieżnobiałe futro przez cały rok.', { mammal: 1, fur: 1, tail: 1, legs: 1, arctic: 1, pred: 1, big_d: 1, fast: 1 }),
  mk('snowshoe_hare', 'Zając rakietkowy', '🐰', 'Zając rakietkowy ma ogromne tylne łapy — śnieżne rakiety.', { mammal: 1, fur: 1, tail: 1, legs: 1, arctic: -1, plant: 1, fast: 1 }),
  mk('wolverine', 'Rosomak', '🦡', 'Rosomak jest wielkości średniego psa, ale tak odważny, że odpędza wilki od zdobyczy.', { mammal: 1, fur: 1, tail: 1, legs: 1, arctic: -1, pred: 1, forest: 1 }),
  mk('orca_killer', 'Płetwal zwyczajny', '🐋', 'Płetwal zwyczajny to drugie co do wielkości zwierzę świata — i jeden z najszybszych wielorybów.', { water: 1, mammal: 1, big_d: 1, ocean: 1, arctic: -1, tail: 1, fast: 1 }),

  // MORSKIE extra
  mk('blue_whale_pygmy', 'Płetwal karłowaty', '🐋', 'Płetwal karłowaty jest "mały" tylko jak na płetwale — i tak ma 24 metry.', { mammal: 1, tail: 1, water: 1, ocean: 1, big_d: 1 }),
  mk('humpback', 'Humbak', '🐋', 'Humbak śpiewa pieśni, które słychać na setki kilometrów.', { mammal: 1, tail: 1, water: 1, ocean: 1, big_d: 1 }),
  mk('right_whale', 'Wal biskajski', '🐋', 'Wal biskajski pływa wolno blisko brzegu.', { mammal: 1, tail: 1, water: 1, ocean: 1, big_d: 1 }),
  mk('gray_whale', 'Wal szary', '🐋', 'Wal szary nurkuje na dno i zjada błoto pełne skorupiaków.', { mammal: 1, tail: 1, water: 1, ocean: 1, big_d: 1 }),
  mk('dugong', 'Diugoń', '🦭', 'Diugoń to "krowa morska" — kuzyn manata.', { mammal: 1, tail: 1, water: 1, ocean: 1, plant: 1, big_d: 1 }),
  mk('sea_lion', 'Lew morski', '🦭', 'Lew morski potrafi "chodzić" po lądzie na płetwach — foki tego nie umieją.', { mammal: 1, fur: 1, tail: 1, legs: 1, water: 1, ocean: 1, pred: 1, big_d: 1 }),
  mk('elephant_seal', 'Słoń morski', '🦭', 'Samce słoni morskich mają nos jak miniaturową trąbę.', { mammal: 1, fur: 1, tail: 1, legs: 1, water: 1, ocean: 1, big_d: 1, arctic: -1 }),
  mk('leopard_seal', 'Foka lampart', '🦭', 'Foka lampart poluje na pingwiny pod lodem.', { mammal: 1, fur: 1, tail: 1, legs: 1, water: 1, ocean: 1, arctic: 1, pred: 1, big_d: 1, danger: 1 }),

  // PTAKI — Polska extra
  mk('crossbill', 'Krzyżodziób', '🐦', 'Krzyżodziób ma "skrzyżowany" dziób — wyłuskuje nasiona z szyszek.', { bird: 1, feathers: 1, tail: 1, legs: 1, pol: 1, fly: 1, small_c: 1 }),
  mk('siskin', 'Czyż', '🐦', 'Czyże w stadach wyglądają jak żółto-zielone obłoki.', { bird: 1, feathers: 1, tail: 1, legs: 1, pol: 1, fly: 1, small_c: 1 }),
  mk('goldcrest', 'Mysikrólik', '🐦', 'Mysikrólik to najmniejszy ptak Europy — waży 5 gramów.', { bird: 1, feathers: 1, tail: 1, legs: 1, pol: 1, fly: 1, small_c: 1 }),
  mk('waxwing', 'Jemiołuszka', '🐦', 'Jemiołuszki przylatują zimą i zjadają jarzębinę.', { bird: 1, feathers: 1, tail: 1, legs: 1, pol: 1, fly: 1, small_c: 1 }),
  mk('kingfisher', 'Zimorodek', '🐦', 'Zimorodek nurkuje za rybą jak niebiesko-pomarańczowa strzała.', { bird: 1, feathers: 1, tail: 1, legs: 1, pol: 1, fly: 1, pred: 1, small_c: 1, fast: 1 }),
  mk('black_woodpecker', 'Dzięcioł czarny', '🐦', 'Dzięcioł czarny jest największym dzięciołem Europy.', { bird: 1, feathers: 1, tail: 1, legs: 1, pol: 1, fly: 1, forest: 1 }),
  mk('eagle_owl_white', 'Sowa uszata', '🦉', 'Sowa uszata ma długie pióra na głowie wyglądające jak uszy.', { bird: 1, feathers: 1, tail: 1, legs: 1, pol: 1, fly: 1, pred: 1, nocturnal: 1, forest: 1 }),
  mk('hawfinch', 'Grubodziób', '🐦', 'Grubodziób potrafi rozłupać pestkę wiśni jak dziadek do orzechów.', { bird: 1, feathers: 1, tail: 1, legs: 1, pol: 1, fly: 1, small_c: 1 }),
  mk('serin', 'Kulczyk', '🐦', 'Kulczyk to mały, żółty kuzyn kanarka — lubi śpiewać z czubków drzew i anten.', { bird: 1, feathers: 1, tail: 1, legs: 1, pol: 1, fly: 1, small_c: 1 }),
  mk('grebe_great', 'Perkoz dwuczuby', '🐦', 'Perkozy dwuczube tańczą w parze na wodzie, trzymając w dziobach roślinki — to ich randka.', { bird: 1, feathers: 1, tail: 1, legs: 1, pol: 1, water: 1, fly: 1 }),

  // PTAKI — egzotyczne extra
  mk('quetzal', 'Kwezal', '🦜', 'Kwezal ma ogon dłuższy od ciała — pióro lśni jak szmaragd.', { bird: 1, feathers: 1, tail: 1, legs: 1, jungle: 1, fly: 1 }),
  mk('hornbill', 'Dzioborożec', '🦜', 'Dzioborożec ma rogowaty hełm nad dziobem — działa jak rezonator.', { bird: 1, feathers: 1, tail: 1, legs: 1, jungle: 1, fly: 1 }),
  mk('bird_of_paradise', 'Rajski ptak', '🦜', 'Rajskie ptaki mają najbardziej szalone pióra świata.', { bird: 1, feathers: 1, tail: 1, legs: 1, jungle: 1, fly: 1 }),
  mk('toucan_keel', 'Tukan tęczowy', '🦜', 'Tukan tęczowy reguluje temperaturę ciała ogromnym dziobem.', { bird: 1, feathers: 1, tail: 1, legs: 1, jungle: 1, fly: 1 }),
  mk('shoebill', 'Trzewikodziób', '🦅', 'Trzewikodziób ma dziób jak gigantyczny but i stoi w bagnach godzinami.', { bird: 1, feathers: 1, tail: 1, legs: 1, water: -1, fly: 1, pred: 1, big_d: -1, afr: 1 }),
  mk('secretary_bird', 'Sekretarz', '🦅', 'Sekretarz to ptak drapieżny, który zabija węże kopniakami.', { bird: 1, feathers: 1, tail: 1, legs: 1, afr: 1, fly: 1, pred: 1, big_d: -1, fast: 1 }),
  mk('cassowary_dwarf', 'Karłowaty kazuar', '🦤', 'Karłowaty kazuar to najmniejszy z trzech gatunków kazuara.', { bird: 1, feathers: 1, tail: 1, legs: 1, jungle: 1 }),
  mk('kakapo', 'Kakapo', '🦜', 'Kakapo to nielatająca papuga z Nowej Zelandii — nocą wędruje po lesie.', { bird: 1, feathers: 1, tail: 1, legs: 1, nocturnal: 1 }),
  mk('rockhopper_penguin', 'Pingwin skalny', '🐧', 'Pingwin skalny ma żółte czuby na głowie i skacze po skałach.', { bird: 1, feathers: 1, tail: 1, legs: 1, water: 1, ocean: 1, arctic: -1, small_c: 1 }),
  mk('king_penguin', 'Pingwin królewski', '🐧', 'Pingwin królewski jest drugim największym po cesarskim.', { bird: 1, feathers: 1, tail: 1, legs: 1, water: 1, ocean: 1, arctic: 1 }),

  // RYBY extra
  mk('angler_fish', 'Żabnica', '🐟', 'Żabnica ma na głowie "wędkę" z przynętą — macha nią, by zwabić rybki.', { fish: 1, scales: 1, tail: 1, water: 1, ocean: 1, pred: 1, danger: -1 }),
  mk('parrotfish', 'Papugoryba', '🐠', 'Papugoryba gryzie koral i robi z niego biały piasek.', { fish: 1, scales: 1, tail: 1, water: 1, ocean: 1 }),
  mk('wrasse', 'Wargacz', '🐠', 'Wargacze są "lekarzami" raf — czyszczą inne ryby z pasożytów.', { fish: 1, scales: 1, tail: 1, water: 1, ocean: 1 }),
  mk('lionfish', 'Skrzydlica', '🐠', 'Skrzydlica ma jadowite kolce — pływa wolno, ale jej nie ruszaj.', { fish: 1, scales: 1, tail: 1, water: 1, ocean: 1, danger: 1, venom: 1 }),
  mk('stonefish', 'Synanceja', '🐟', 'Synanceja to najbardziej jadowita ryba świata — wygląda jak kamień.', { fish: 1, scales: 1, tail: 1, water: 1, ocean: 1, danger: 1, venom: 1 }),
  mk('blobfish', 'Blobfisz', '🐟', 'Blobfisz na powierzchni wygląda smutno — na głębi ma normalny kształt.', { fish: 1, tail: 1, water: 1, ocean: 1 }),
  mk('pufferfish', 'Rozdymka', '🐡', 'Rozdymka napełnia się wodą i robi się okrągła jak balon.', { fish: 1, tail: 1, water: 1, ocean: 1, danger: 1, venom: 1 }),
  mk('porcupinefish', 'Najeżka', '🐡', 'Najeżka ma kolce, które stroszą się, gdy się napełnia.', { fish: 1, tail: 1, water: 1, ocean: 1, danger: -1 }),
  mk('discus', 'Pielęgnica dyskowiec', '🐠', 'Dyskowce karmią małe śluzem na własnej skórze.', { fish: 1, scales: 1, tail: 1, water: 1, jungle: 1 }),
  mk('arowana', 'Arowana', '🐟', 'Arowana wyskakuje z wody, żeby złapać owada z gałęzi.', { fish: 1, scales: 1, tail: 1, water: 1, jungle: 1, pred: 1 }),
  mk('koi', 'Koi', '🐠', 'Karpie koi mogą żyć kilkadziesiąt lat — dłużej niż większość psów i kotów.', { fish: 1, scales: 1, tail: 1, water: 1, home: -1 }),
  mk('mola_giant', 'Samogłów', '🐟', 'Samogłów ma kształt pływającej tarczy — to najcięższa ryba kostna.', { fish: 1, tail: 1, water: 1, ocean: 1, big_d: 1 }),

  // GADY / PŁAZY extra
  mk('king_cobra', 'Kobra królewska', '🐍', 'Kobra królewska to najdłuższy jadowity wąż — ma 5 metrów.', { reptile: 1, scales: 1, jungle: 1, pred: 1, big_d: -1, danger: 1, venom: 1, tail: -1 }),
  mk('mamba', 'Mamba czarna', '🐍', 'Mamba czarna jest najszybszym wężem świata — 19 km/h.', { reptile: 1, scales: 1, afr: 1, pred: 1, danger: 1, venom: 1, fast: 1, tail: -1 }),
  mk('thorny_devil', 'Moloch australijski', '🦎', 'Moloch pije rosę całym ciałem — woda spływa po skórze do pyska.', { reptile: 1, scales: 1, tail: 1, legs: 1, small_c: 1 }),
  mk('frilled_lizard', 'Agama kołnierzasta', '🦎', 'Agama rozkłada kołnierz jak parasol gdy jest przerażona.', { reptile: 1, scales: 1, tail: 1, legs: 1, fast: 1 }),
  mk('matamata', 'Matamata', '🐢', 'Matamata wygląda jak kupka opadłych liści — dzięki temu ryby podpływają bardzo blisko.', { reptile: 1, shell: 1, tail: 1, legs: 1, water: 1, jungle: 1, pred: 1 }),
  mk('softshell_turtle', 'Trionyks', '🐢', 'Trionyks to żółw z miękkim, gumowym pancerzem i nosem jak mała rurka.', { reptile: 1, shell: -1, tail: 1, legs: 1, water: 1 }),
  mk('alligator_snapping', 'Żółw sępi', '🐢', 'Żółw aligatorzy ma "wabik" w pysku — wygląda jak robak.', { reptile: 1, shell: 1, tail: 1, legs: 1, water: 1, pred: 1, big_d: 1 }),
  mk('glass_frog', 'Żaba szklana', '🐸', 'Żaba szklana ma przezroczysty brzuch — widać jej serce.', { amphi: 1, legs: 1, jungle: 1, small_c: 1 }),
  mk('mantella', 'Mantela', '🐸', 'Mantela złota żyje tylko na Madagaskarze — jaskrawy kolor ostrzega, że jest trująca.', { amphi: 1, legs: 1, jungle: 1, danger: 1, venom: 1, small_c: 1, afr: 1 }),
  mk('hellbender', 'Skrytoskrzelnik', '🦎', 'Skrytoskrzelnik to gigantyczna salamandra Ameryki — do 75 cm.', { amphi: 1, tail: 1, legs: 1, water: 1 }),

  // OWADY / PAJĘCZAKI / INNE extra
  mk('rhinoceros_beetle', 'Rohatyniec', '🪲', 'Rohatyniec uniesie 850 razy więcej niż waży — proporcjonalnie najsilniejsze zwierzę.', { insect: 1, fly: 1, small_c: 1, legs: 1 }),
  mk('hercules_beetle', 'Chrząszcz Herkules', '🪲', 'Chrząszcz Herkules to jeden z największych owadów świata — 17 cm.', { insect: 1, fly: 1, jungle: 1, legs: 1 }),
  mk('praying_mantis_giant', 'Modliszka olbrzymia', '🦗', 'Modliszka olbrzymia może łapać małe ptaki.', { insect: 1, jungle: 1, pred: 1, legs: 1 }),
  mk('jewel_beetle', 'Bogatek', '🪲', 'Bogatek lśni jak klejnot — używany w biżuterii w Indiach.', { insect: 1, fly: 1, small_c: 1, legs: 1 }),
  mk('walking_stick', 'Patyczak gigantyczny', '🌿', 'Patyczak gigantyczny może być długi na 60 cm.', { insect: 1, jungle: 1, plant: 1, legs: 1 }),
  mk('atlas_butterfly', 'Ornitoptera królowej Aleksandry', '🦋', 'To największy motyl dzienny świata — jego skrzydła mają ponad 25 cm rozpiętości.', { fly: 1, insect: 1, jungle: 1, legs: 1, plant: 1 }),
  mk('blue_morpho', 'Morfej niebieski', '🦋', 'Morfej niebieski lśni metalicznym błękitem dzięki strukturze skrzydeł.', { insect: 1, fly: 1, jungle: 1, legs: 1 }),
  mk('monarch', 'Monarcha', '🦋', 'Monarchy migrują 4000 km do Meksyku co roku.', { insect: 1, fly: 1, legs: 1 }),
  mk('cicada', 'Cykada', '🦗', 'Cykady "śpiewają" specjalnymi błonkami na brzuchu — to jedne z najgłośniejszych owadów.', { insect: 1, fly: 1, jungle: -1, small_c: 1, legs: 1, pol: -1 }),
  mk('treehopper', 'Garbik', '🪲', 'Pieniugnik ma na grzbiecie dziwne hełmy — wyglądają jak liście, kolce, mrówki.', { insect: 1, small_c: 1, legs: 1, fly: 1 }),
  mk('camel_spider', 'Solfuga', '🕷️', 'Solfuga to pajęczak, choć nie pająk — biega po pustyni nawet 15 km/h.', { fast: 1, pred: 1, legs: 1, afr: -1, nocturnal: 1 }),
  mk('whip_scorpion', 'Bicznik', '🦂', 'Bicznik strzela octem z odwłoka, żeby się bronić.', { pred: 1, legs: 1 }),
  mk('millipede', 'Krocionóg', '🐛', 'Krocionogi mają zwykle kilkaset nóg — rekordzista z Australii ma ich aż 1306!', { legs: 1, small_c: 1, pol: 1 }),
  mk('mantis_shrimp', 'Krewetka modliszkowa', '🦐', 'Krewetka modliszkowa uderza tak szybko, że woda wokół jej szczypiec na chwilę się zagotowuje.', { shell: 1, water: 1, ocean: 1, pred: 1, fast: 1, legs: 1 }),
  mk('horseshoe_crab', 'Skrzypłocz', '🦀', 'Skrzypłocz jest "żywą skamieniałością" — niemal nie zmienił się od 450 mln lat.', { shell: 1, water: 1, ocean: 1, legs: 1 }),

  // MIĘCZAKI / INNE extra
  mk('nautilus', 'Łodzik', '🐚', 'Łodziki pływają w morzach od setek milionów lat — to "żywe skamieniałości".', { shell: 1, water: 1, ocean: 1 }),
  mk('giant_squid', 'Kalmar olbrzymi', '🦑', 'Kalmar olbrzymi ma oczy wielkości talerza — największe ze zwierząt.', { water: 1, ocean: 1, pred: 1, big_d: 1 }),
  mk('vampire_squid', 'Wampirzyca', '🦑', 'Wampirzyca świeci niebieskim światłem i mieszka w głębinach.', { water: 1, ocean: 1, nocturnal: 1 }),
  mk('cone_snail', 'Stożek', '🐚', 'Stożek strzela mikro-harpunem nasączonym jadem.', { shell: 1, water: 1, ocean: 1, pred: 1, danger: 1, venom: 1, small_c: 1 }),
  mk('sea_cucumber', 'Strzykwa', '🌊', 'Strzykwa w obronie wyrzuca wnętrzności na wroga — potem odrastają jej nowe.', { water: 1, ocean: 1, small_c: -1 }),
  mk('sea_slug', 'Ślimak morski', '🌊', 'Niektóre ślimaki morskie są jasnoróżowe i wyglądają jak króliczki.', { water: 1, ocean: 1, small_c: 1 }),
  mk('mantis_shrimp_peacock', 'Pawik morski', '🦐', 'Pawik widzi 12 kolorów — my tylko 3.', { shell: 1, water: 1, ocean: 1, pred: 1, legs: 1 }),
  mk('flatworm', 'Płaziniec', '🌊', 'Płazińce można pociąć na kawałki — każdy odrośnie do całości.', { water: 1, ocean: 1, small_c: 1 }),

  // FANTASTYCZNE / NIEREALNE — wyprawa "Legendy i Mity"
  // (tylko expedition_tags: ['mythical'], filtruje się z Free Play)
  mk('trex', 'Tyranozaur', '🦖', 'T-Rex miał najsilniejszy zgryz wśród zwierząt lądowych historii.', { reptile: 1, scales: 1, tail: 1, legs: 1, pred: 1, big_d: 1, danger: 1 }),
  mk('brachiosaurus', 'Brachiozaur', '🦕', 'Brachiozaur sięgał szyją koron drzew jak żywy dźwig.', { reptile: 1, scales: 1, tail: 1, legs: 1, plant: 1, big_d: 1 }),
  mk('velociraptor', 'Welociraptor', '🦖', 'Welociraptor był wielkości indyka i miał pióra!', { reptile: 1, scales: -1, tail: 1, legs: 1, pred: 1, fast: 1, danger: 1, feathers: 1 }),
  mk('triceratops', 'Triceratops', '🦕', 'Triceratops miał trzy rogi i wielką kostną kryzę na karku.', { reptile: 1, scales: 1, tail: 1, legs: 1, plant: 1, big_d: 1, horns: 1 }),
  mk('stegosaurus', 'Stegozaur', '🦕', 'Stegozaur miał 9 metrów długości, a mózg wielkości orzecha włoskiego.', { reptile: 1, scales: 1, tail: 1, legs: 1, plant: 1, big_d: 1 }),
  mk('mammoth', 'Mamut włochaty', '🦣', 'Mamut miał gęste futro i grubą warstwę tłuszczu — żył w mroźnej tundrze epoki lodowcowej.', { mammal: 1, fur: 1, tail: 1, legs: 1, arctic: 1, plant: 1, big_d: 1 }),
  mk('sabretooth', 'Tygrys szablozębny', '🐅', 'Tygrys szablozębny wcale nie był tygrysem — to osobna grupa kotów z kłami długimi na 20 cm.', { mammal: 1, fur: 1, tail: 1, legs: 1, pred: 1, big_d: 1, danger: 1 }),
  mk('dragon', 'Smok', '🐉', 'Smok ziejący ogniem występuje w legendach niemal każdej kultury.', { reptile: 1, scales: 1, tail: 1, legs: 1, fly: 1, pred: 1, big_d: 1, danger: 1, venom: -1 }),
  mk('unicorn', 'Jednorożec', '🦄', 'Jednorożec ma róg o magicznej mocy — symbol czystości.', { mammal: 1, fur: 1, tail: 1, legs: 1, horns: 1, plant: 1, fast: 1 }),
  mk('phoenix', 'Feniks', '🔥', 'Feniks odradza się z popiołów co 500 lat.', { bird: 1, feathers: 1, tail: 1, legs: 1, fly: 1 }),
  mk('mermaid', 'Syrena', '🧜‍♀️', 'Syreny to legendarne pół-kobiety, pół-ryby — w polskiej legendzie Syrenka broni Warszawy.', { water: 1, ocean: 1 }),
  mk('kraken', 'Kraken', '🐙', 'Kraken to legendarna ośmiornica zatapiająca statki.', { water: 1, ocean: 1, pred: 1, big_d: 1, danger: 1 }),
  mk('yeti', 'Yeti', '🦍', 'Yeti — „Człowiek Śniegu" — żyje rzekomo w Himalajach.', { mammal: 1, fur: 1, legs: 1, arctic: 1, big_d: 1 }),
  mk('bigfoot', 'Bigfoot', '🦍', 'Bigfoot zostawia rzekomo wielkie ślady w lasach Ameryki.', { mammal: 1, fur: 1, legs: 1, big_d: 1 }),
  mk('nessie', 'Potwór z Loch Ness', '🦕', 'Potwór z Loch Ness mieszka rzekomo w szkockim jeziorze.', { reptile: -1, tail: 1, water: 1, big_d: 1 }),
  mk('sphinx', 'Sfinks', '🦁', 'Sfinks z mitologii ma głowę człowieka i ciało lwa.', { mammal: 1, fur: 1, tail: 1, legs: 1, big_d: 1 }),
  mk('griffin', 'Gryf', '🦅', 'Gryf ma głowę orła i ciało lwa — strażnik skarbów.', { feathers: -1, fur: -1, tail: 1, legs: 1, fly: 1, big_d: 1 }),

  // === BATCH 3B: dopełniacz do 500 ===
  mk('mole_eu', 'Orzesznica', '🐭', 'Orzesznica przesypia zimę zwinięta w kulkę — śpi nawet 7 miesięcy w roku.', { fur: 1, mammal: 1, small_c: 1, pol: 1, tail: 1, legs: 1, nocturnal: 1, forest: 1, rodent: 1, plant: 1 }),
  mk('dormouse_garden', 'Żołędnica', '🐭', 'Żołędnica ma czarną "maskę" wokół oczu jak mały bandyta.', { mammal: 1, fur: 1, tail: 1, legs: 1, pol: 1, small_c: 1, rodent: 1, nocturnal: 1 }),
  mk('chipmunk', 'Burunduk', '🐿️', 'Burunduk nosi nasiona w policzkach — może załadować 165 ziaren naraz.', { mammal: 1, fur: 1, tail: 1, legs: 1, plant: 1, small_c: 1, fast: 1, rodent: 1 }),
  mk('flying_squirrel', 'Polatucha', '🐿️', 'Polatucha szybuje 50 metrów między drzewami na "skrzydłach" ze skóry.', { mammal: 1, fur: 1, tail: 1, legs: 1, fly: -1, small_c: 1, rodent: 1, nocturnal: 1, forest: 1 }),
  mk('aardwolf_kenya', 'Hiena pręgowana', '🐺', 'Hiena pręgowana stroszy długą grzywę na grzbiecie, żeby wyglądać na większą.', { fur: 1, mammal: 1, afr: 1, tail: 1, legs: 1, pred: 1, nocturnal: 1, big_d: 1 }),
  mk('honey_badger', 'Zorilla', '🦨', 'Zorilla to afrykański kuzyn tchórza — w obronie wydziela bardzo brzydki zapach.', { fur: 1, mammal: 1, afr: 1, tail: 1, legs: 1, pred: 1, nocturnal: 1 }),
  mk('snow_fox', 'Zając polarny', '🐰', 'Zając polarny potrafi skakać na samych tylnych łapach jak kangur.', { fur: 1, mammal: 1, plant: 1, arctic: 1, tail: 1, legs: 1, fast: 1, groups: 1 }),
  mk('snub_nosed_monkey', 'Sichuanka', '🐒', 'Sichuanka ma jasnoniebieską twarz — mieszka w mroźnych górach Chin.', { mammal: 1, fur: 1, tail: 1, legs: 1, jungle: -1, plant: 1, primate: 1, groups: 1 }),
  mk('reindeer_svalbard', 'Renifer Svalbardzki', '🦌', 'Renifer Svalbardzki to najmniejszy podgatunek — przeżywa w arktycznej ciemności.', { mammal: 1, fur: 1, tail: 1, legs: 1, arctic: 1, plant: 1, horns: 1 }),
  mk('gerbil', 'Myszoskoczek', '🐹', 'Myszoskoczek skacze 30 cm w pionie — jak kangurek w miniaturze.', { mammal: 1, fur: 1, tail: 1, legs: 1, home: 1, plant: 1, small_c: 1, rodent: 1 }),
  mk('chinchilla', 'Szynszyla', '🐭', 'Szynszyla ma bardzo gęste futro — z jednego miejsca na skórze wyrasta nawet 50 włosków.', { mammal: 1, fur: 1, tail: 1, legs: 1, home: 1, plant: 1, small_c: 1, rodent: 1 }),
  mk('skunk', 'Skunks', '🦨', 'Skunks może strzelić swoim "sprayem" na 3 metry — pachnie tygodniami.', { mammal: 1, fur: 1, tail: 1, legs: 1, pred: -1, danger: -1, nocturnal: 1 }),
  mk('aardvark_pig', 'Babirusa', '🐗', 'Babirusa ma kły, które wyrastają przez górną wargę i zawijają się jak rogi.', { fur: -1, mammal: 1, jungle: 1, forest: 1, tail: 1, legs: 1, groups: 1 }),
  mk('saola', 'Saola', '🦌', 'Saola odkryta dopiero w 1992 — to "azjatycki jednorożec".', { mammal: 1, fur: 1, tail: 1, legs: 1, jungle: 1, plant: 1, horns: 1 }),
  mk('pichi', 'Pancernik karłowaty', '🦔', 'Pancernik karłowaty kopie w pustyni i zwija się w kulę.', { mammal: 1, shell: 1, tail: 1, legs: 1 }),

  // Ptaki extra
  mk('bald_eagle', 'Orzeł bielik amerykański', '🦅', 'Bielik amerykański widzi mysz z odległości 3 km.', { bird: 1, feathers: 1, tail: 1, legs: 1, fly: 1, pred: 1, big_d: -1, fast: 1 }),
  mk('atlantic_puffin', 'Alka krzywonosa', '🐧', 'Alka krzywonosa świetnie nurkuje — pod wodą "leci", machając skrzydłami.', { water: 1, fly: 1, feathers: 1, bird: 1, ocean: 1, arctic: -1, tail: 1, legs: 1, pred: 1, groups: 1 }),
  mk('kestrel', 'Pustułka', '🦅', 'Pustułka wisi nieruchomo w powietrzu — łopocze skrzydłami w miejscu.', { bird: 1, feathers: 1, tail: 1, legs: 1, pol: 1, fly: 1, pred: 1 }),
  mk('hoatzin', 'Hoacyn', '🐦', 'Hoacyn trawi liście w wolu jak krowa — dlatego pachnie jak obornik.', { bird: 1, feathers: 1, tail: 1, legs: 1, jungle: 1, fly: 1 }),
  mk('lyrebird', 'Liroogon', '🦚', 'Liroogon naśladuje wszystko — piłę łańcuchową, alarm samochodowy, śmiech.', { bird: 1, feathers: 1, tail: 1, legs: 1 }),
  mk('booby', 'Głupiec niebieskonogi', '🐦', 'Głupiec niebieskonogi ma jaskrawoniebieskie stopy — używa ich w tańcu godowym.', { bird: 1, feathers: 1, tail: 1, legs: 1, ocean: 1, fly: 1 }),

  // Ryby/morze extra
  mk('moonjellyfish', 'Chełbia modra', '🪼', 'Chełbia modra to najczęstsza meduza Bałtyku.', { water: 1, ocean: 1, pol: -1 }),
  mk('octopus_blue_ring', 'Ośmiornica niebieskopierścieniowa', '🐙', 'Ośmiornica niebieskopierścieniowa ma jad zabijający w minuty.', { water: 1, ocean: 1, pred: 1, danger: 1, venom: 1, small_c: 1 }),
  mk('crab_japanese_spider', 'Krab pajęczy', '🦀', 'Krab pajęczy ma nogi rozpiętości 4 metrów — największy skorupiak świata.', { shell: 1, water: 1, ocean: 1, big_d: 1, legs: 1 }),

  // Gady/płazy extra
  mk('green_anaconda', 'Boa szmaragdowy', '🐍', 'Boa szmaragdowy odpoczywa na gałęzi zwinięty w pętle — zielony jak liście.', { scales: 1, reptile: 1, pred: 1, jungle: 1, forest: 1, tail: -1, nocturnal: 1 }),
  mk('reticulated_python', 'Pyton siatkowy', '🐍', 'Pyton siatkowy to najdłuższy wąż świata — może mieć ponad 6 metrów.', { reptile: 1, scales: 1, jungle: 1, pred: 1, big_d: 1, danger: 1, tail: -1 }),
  mk('komodo_juvenile', 'Waran paskowany', '🦎', 'Waran paskowany świetnie pływa — to druga co do wielkości jaszczurka świata.', { water: 1, scales: 1, reptile: 1, big_d: 1, pred: 1, jungle: 1, tail: 1, legs: 1, danger: -1 }),
  mk('giant_salamander', 'Salamandra olbrzymia', '🦎', 'Salamandra olbrzymia żyje 80 lat i ma 1,8 metra.', { amphi: 1, tail: 1, legs: 1, water: 1, big_d: -1 }),
  mk('axolotl_pink', 'Żaba moczarowa', '🐸', 'Wiosną samce żaby moczarowej na kilka dni robią się niebieskie!', { water: -1, amphi: 1, small_c: 1, pol: 1, legs: 1, forest: -1 }),

  // Owady ekstra
  mk('giant_weta', 'Weta gigantyczna', '🦗', 'Weta gigantyczna z Nowej Zelandii jest cięższa od wróbla.', { insect: 1, small_c: -1, legs: 1 }),
  mk('goliath_beetle', 'Chrząszcz Goliath', '🪲', 'Chrząszcz goliat to jeden z najcięższych owadów świata — waży tyle co mała mysz.', { insect: 1, fly: 1, jungle: 1, big_d: -1, legs: 1, afr: 1 }),
  mk('peacock_butterfly', 'Rusałka pawik', '🦋', 'Rusałka pawik ma na skrzydłach "oczy" — straszy ptaki.', { insect: 1, fly: 1, pol: 1, small_c: 1, legs: 1 }),

  // === BATCH 4.1: Ssaki świata (rozszerzenie do 800) ===
  // Australijskie torbacze
  mk('numbat', 'Numbat', '🦨', 'Numbat zjada 20 000 termitów dziennie — to jego jedyne jedzenie.', { mammal: 1, marsupial: 1, fur: 1, tail: 1, legs: 1, small_c: 1, pred: 1 }),
  mk('bilby', 'Wielkouch', '🐰', 'Wielkouch ma uszy jak królik, ale to torbacz — jego torba otwiera się do tyłu, żeby nie wpadał do niej piasek.', { mammal: 1, marsupial: 1, fur: 1, tail: 1, legs: 1, long_ears: 1, small_c: 1, nocturnal: 1 }),
  mk('bandicoot', 'Bandikut', '🐀', 'Bandikut ma najszybszą ciążę wśród ssaków — tylko 12 dni.', { mammal: 1, marsupial: 1, fur: 1, tail: 1, legs: 1, nocturnal: 1, small_c: 1 }),
  mk('honey_possum', 'Możurek miodowy', '🐭', 'Możurek miodowy żyje tylko z nektaru — to jak ssaczy koliber.', { mammal: 1, marsupial: 1, fur: 1, tail: 1, legs: 1, plant: 1, small_c: 1, nocturnal: 1 }),
  mk('wallaby', 'Walabia', '🦘', 'Walabia to mniejszy kuzyn kangura — też skacze na tylnych łapach.', { mammal: 1, marsupial: 1, fur: 1, tail: 1, legs: 1, plant: 1, fast: 1 }),
  mk('tree_kangaroo', 'Drzewokangur', '🦘', 'Drzewokangur mieszka na drzewach i potrafi zeskoczyć z gałęzi z wysokości kilkunastu metrów.', { mammal: 1, marsupial: 1, fur: 1, tail: 1, legs: 1, jungle: 1, plant: 1 }),
  mk('yapok', 'Yapok', '🐀', 'Yapok to torbacz wodny — pływa pod wodą, a torba zamyka się szczelnie jak suchy worek.', { mammal: 1, marsupial: 1, fur: 1, tail: 1, legs: 1, water: 1, jungle: 1, nocturnal: 1, small_c: 1 }),

  // Madagaskar i Afryka
  mk('fossa', 'Fossa', '🐈', 'Fossa to największy drapieżnik Madagaskaru — poluje na lemury w koronach drzew.', { mammal: 1, fur: 1, tail: 1, legs: 1, jungle: 1, pred: 1, fast: 1, afr: 1 }),
  mk('tenrec', 'Tenrek', '🦔', 'Tenreki uderzają kolcami o siebie, by się porozumiewać — to jedyne ssaki które tak robią.', { mammal: 1, fur: -1, tail: 1, legs: 1, jungle: 1, small_c: 1, nocturnal: 1, afr: 1 }),
  mk('indri', 'Indri', '🐒', 'Indri śpiewają jak wieloryby — ich pieśń niesie się 4 km przez las.', { mammal: 1, primate: 1, fur: 1, tail: -1, legs: 1, jungle: 1, plant: 1, afr: 1 }),
  mk('sifaka', 'Sifaka', '🐒', 'Sifaki nie chodzą — tańczą bokiem po ziemi jak na sprężynach.', { mammal: 1, primate: 1, fur: 1, tail: 1, legs: 1, jungle: 1, plant: 1, afr: 1 }),
  mk('galago', 'Galago', '🐒', 'Galago skacze 2 metry w górę — to ssak wielkości szczura.', { mammal: 1, primate: 1, fur: 1, tail: 1, legs: 1, jungle: 1, nocturnal: 1, small_c: 1, afr: 1 }),
  mk('duiker', 'Dujker', '🦌', 'Dujkery są tak małe, że chowają się w trawie — niektóre ważą mniej niż kot.', { mammal: 1, fur: 1, tail: 1, legs: 1, jungle: 1, plant: 1, horns: 1, small_c: -1, fast: 1, afr: 1 }),
  mk('klipspringer', 'Koziołek skalny', '🦌', 'Koziołek skalny stoi na czubkach kopyt i skacze po skałach jak akrobata.', { mammal: 1, fur: 1, tail: 1, legs: 1, plant: 1, horns: 1, small_c: -1, fast: 1, afr: 1 }),

  // Azja Wschodnia i Górska
  mk('tarsier', 'Wyrak', '🐒', 'Każde oko wyraka jest większe niż jego mózg!', { mammal: 1, primate: 1, fur: 1, tail: 1, legs: 1, jungle: 1, nocturnal: 1, small_c: 1, pred: 1 }),
  mk('markhor', 'Markhor', '🐐', 'Markhor ma śrubowo skręcone rogi długości 1,5 metra — to dziki kozioł Pakistanu.', { mammal: 1, fur: 1, tail: 1, legs: 1, plant: 1, horns: 1, big_d: 1 }),
  mk('urial', 'Urial', '🐏', 'Urial to dziki kuzyn owcy — żyje w stadach na stromych zboczach Azji.', { mammal: 1, fur: 1, tail: 1, legs: 1, plant: 1, horns: 1, groups: 1, big_d: 1 }),
  mk('argali', 'Argali', '🐏', 'Argali to największa dzika owca świata — jej rogi mogą ważyć ponad 20 kg.', { mammal: 1, fur: 1, tail: 1, legs: 1, plant: 1, horns: 1, big_d: 1 }),
  mk('bharal', 'Bharal', '🐏', 'Bharal ma sierść z odcieniem niebieskim — kamuflaż wśród skał Himalajów.', { mammal: 1, fur: 1, tail: 1, legs: 1, plant: 1, horns: 1, big_d: -1 }),
  mk('banteng', 'Banteng', '🐂', 'Banteng to dziki przodek wielu domowych krów w Azji.', { mammal: 1, fur: 1, tail: 1, legs: 1, jungle: 1, plant: 1, horns: 1, big_d: 1, groups: 1 }),
  mk('gaur', 'Gaur', '🐂', 'Gaur to największy dziki byk świata — waży 1500 kg, więcej niż samochód.', { mammal: 1, fur: 1, tail: 1, legs: 1, jungle: 1, plant: 1, horns: 1, big_d: 1 }),
  mk('fishing_cat', 'Kot rybołów', '🐈', 'Kot rybołów nurkuje za rybami — ma błony między palcami jak kaczka.', { mammal: 1, fur: 1, tail: 1, legs: 1, water: 1, jungle: -1, pred: 1, meows: 1 }),
  mk('pallas_cat', 'Manul', '🐈', 'Manul wygląda jak puchata kula — ma najgrubszą sierść spośród wszystkich kotów.', { mammal: 1, fur: 1, tail: 1, legs: 1, pred: 1, meows: 1 }),
  mk('sand_cat', 'Kot pustynny', '🐈', 'Kot pustynny ma podeszwy obrosłe sierścią — chodzi po rozżarzonym piasku jak po dywanie.', { mammal: 1, fur: 1, tail: 1, legs: 1, pred: 1, meows: 1, nocturnal: 1, small_c: 1, afr: 1 }),
  mk('raccoon_dog', 'Jenot', '🐕', 'Jenot wygląda jak szop z maską, ale to dziki pies — zasypia na zimę.', { mammal: 1, fur: 1, tail: 1, legs: 1, forest: 1, pol: 1, pred: 1, nocturnal: 1 }),

  // Ameryki Południowe
  mk('agouti', 'Aguti', '🐀', 'Aguti to gryzoń, który zna każde ukryte miejsce na orzeszki w lesie deszczowym.', { mammal: 1, rodent: 1, fur: 1, tail: -1, legs: 1, jungle: 1, plant: 1, small_c: 1, fast: 1 }),
  mk('peccary', 'Pekari obrożny', '🐗', 'Pekari obrożny pachnie piżmem — jego zapach czuć z 100 metrów.', { mammal: 1, fur: 1, tail: 1, legs: 1, jungle: 1, groups: 1, plant: -1 }),
  mk('olingo', 'Olingo', '🐾', 'Olingo wisi na ogonie jak małpa — to ssak wielkości kota.', { mammal: 1, fur: 1, tail: 1, legs: 1, jungle: 1, nocturnal: 1, small_c: 1 }),
  mk('margay', 'Margaj', '🐈', 'Margaj wisi głową w dół jak małpa — może obrócić tylne łapy o 180°.', { mammal: 1, fur: 1, tail: 1, legs: 1, jungle: 1, pred: 1, nocturnal: 1, meows: 1 }),
  mk('spectacled_bear', 'Niedźwiedź andyjski', '🐻', 'Niedźwiedź andyjski ma okulary z białej sierści wokół oczu — każdy ma inne.', { mammal: 1, fur: 1, tail: 1, legs: 1, jungle: 1, plant: 1, big_d: 1 }),
  mk('bush_dog', 'Pies leśny', '🐕', 'Pies leśny ma palce zrośnięte błoną — pływa za wodnymi gryzoniami w dżungli.', { mammal: 1, fur: 1, tail: 1, legs: 1, jungle: 1, pred: 1, groups: 1, small_c: -1 }),
  mk('giant_anteater', 'Tamandua', '🐜', 'Tamandua trzyma się gałęzi chwytnym ogonem, a gdy się boi, brzydko pachnie jak skunks.', { fur: 1, mammal: 1, jungle: 1, forest: 1, tail: 1, legs: 1, pred: 1 }),
  mk('silky_anteater', 'Mrówkojad jedwabisty', '🐾', 'Mrówkojad jedwabisty mieści się w dłoni i wisi na ogonie cały dzień — to najmniejszy mrówkojad świata.', { mammal: 1, fur: 1, tail: 1, legs: 1, jungle: 1, nocturnal: 1, small_c: 1 }),
  mk('mara', 'Mara', '🐰', 'Mara wygląda jak królik na nogach kopytnego — a jest gryzoniem rozmiaru psa.', { mammal: 1, rodent: 1, fur: 1, tail: -1, legs: 1, plant: 1, fast: 1 }),
  mk('viscacha', 'Wiskacha', '🐰', 'Wiskacha śpi w szczelinach skalnych z 30-osobową rodziną — wszystkie razem.', { mammal: 1, rodent: 1, fur: 1, tail: 1, legs: 1, plant: 1, groups: 1, small_c: -1 }),
  mk('prairie_dog', 'Piesek preriowy', '🐀', 'Pieski preriowe rozmawiają — mają osobne słowa dla "duży", "wysoki", "niebieski".', { mammal: 1, rodent: 1, fur: 1, tail: 1, legs: 1, plant: 1, groups: 1, small_c: 1 }),

  // Egzotyczne / inne
  mk('solenodon', 'Almik', '🦔', 'Almik to jeden z niewielu ssaków z jadem — paraliżuje ofiarę śliną.', { mammal: 1, fur: 1, tail: 1, legs: 1, venom: 1, nocturnal: 1, small_c: 1 }),
  mk('dingo', 'Dingo', '🐕', 'Dingo nie szczeka — wyje jak wilk. To australijski dziki pies.', { mammal: 1, fur: 1, tail: 1, legs: 1, pred: 1, fast: 1, groups: 1 }),
  mk('sea_otter', 'Wydra morska', '🦦', 'Wydry morskie trzymają się za łapy podczas snu, żeby prąd ich nie rozdzielił.', { mammal: 1, fur: 1, tail: 1, legs: 1, water: 1, ocean: 1, pred: 1 }),
  mk('naked_mole_rat', 'Golec', '🐀', 'Golec żyje 30 lat — to 10× dłużej niż mysz tego samego rozmiaru.', { mammal: 1, rodent: 1, fur: -1, tail: 1, legs: 1, groups: 1, small_c: 1 }),

  // === BATCH 4.2: Ptaki świata ===
  // Drapieżne
  mk('harpy_eagle', 'Harpia', '🦅', 'Harpia ma szpony długie jak pazury niedźwiedzia grizzly — łapie małpy i leniwce.', { bird: 1, feathers: 1, tail: 1, legs: 1, jungle: 1, fly: 1, pred: 1, big_d: 1 }),
  mk('barn_owl', 'Płomykówka', '🦉', 'Płomykówka słyszy mysz w trawie z 100 metrów — w zupełnej ciemności.', { bird: 1, feathers: 1, tail: 1, legs: 1, pol: 1, fly: 1, pred: 1, nocturnal: 1 }),
  mk('screech_owl', 'Sowa krzykliwa', '🦉', 'Sowa krzykliwa wydaje 14 różnych zawołań — każde znaczy coś innego.', { bird: 1, feathers: 1, tail: 1, legs: 1, forest: 1, fly: 1, pred: 1, nocturnal: 1, small_c: 1 }),
  mk('great_grey_owl', 'Puszczyk mszarny', '🦉', 'Puszczyk mszarny nurkuje w 60 cm głębokim śniegu, by złapać mysz, której nie widzi.', { bird: 1, feathers: 1, tail: 1, legs: 1, forest: 1, arctic: -1, fly: 1, pred: 1, nocturnal: 1 }),

  // Morskie / Antarktyda
  mk('albatross', 'Albatros', '🦤', 'Młode albatrosy spędzają nad oceanem kilka lat, zanim pierwszy raz wrócą na ląd.', { bird: 1, feathers: 1, tail: 1, legs: 1, ocean: 1, fly: 1, big_d: 1, pred: 1 }),
  mk('cormorant', 'Kormoran', '🦅', 'Kormoran nurkuje 45 metrów po ryby — ma pióra częściowo nasiąkliwe, by się szybciej zanurzyć.', { bird: 1, feathers: 1, tail: 1, legs: 1, water: 1, pol: 1, fly: 1, pred: 1 }),
  mk('gannet', 'Głuptak', '🦅', 'Głuptak nurkuje do morza z 30 metrów z prędkością 100 km/h.', { bird: 1, feathers: 1, tail: 1, legs: 1, ocean: 1, fly: 1, pred: 1 }),
  mk('frigatebird', 'Fregata wielka', '🦅', 'Fregata kradnie jedzenie innym ptakom w locie — to powietrzny pirat.', { bird: 1, feathers: 1, tail: 1, legs: 1, ocean: 1, fly: 1, pred: 1 }),
  mk('skua', 'Wydrzyk', '🦅', 'Wydrzyk atakuje człowieka, jeśli podejdzie zbyt blisko gniazda — uderza w głowę.', { bird: 1, feathers: 1, tail: 1, legs: 1, arctic: 1, ocean: 1, fly: 1, pred: 1 }),
  mk('herring_gull', 'Mewa srebrzysta', '🐦', 'Mewa srebrzysta otwiera muszle, upuszczając je z 20 metrów na skały.', { bird: 1, feathers: 1, tail: 1, legs: 1, ocean: 1, water: 1, fly: 1, pol: 1 }),
  mk('adelie_penguin', 'Pingwin Adeli', '🐧', 'Pingwiny Adeli budują gniazda z kamyków — samiec przynosi samicy najładniejsze.', { bird: 1, feathers: 1, tail: 1, legs: 1, arctic: 1, ocean: 1, groups: 1, water: 1 }),
  mk('chinstrap_penguin', 'Pingwin maskowy', '🐧', 'Pingwin maskowy ma pod dziobem czarny pasek — jakby nosił kask zapięty pod brodą.', { bird: 1, feathers: 1, tail: 1, legs: 1, arctic: 1, ocean: 1, groups: 1, water: 1 }),
  mk('gentoo_penguin', 'Pingwin białobrewy', '🐧', 'Pingwin białobrewy to najszybciej pływający ptak — pod wodą pędzi nawet 36 km/h.', { bird: 1, feathers: 1, tail: 1, legs: 1, arctic: 1, ocean: 1, fast: 1, groups: 1, water: 1 }),
  mk('macaroni_penguin', 'Pingwin złotoczuby', '🐧', 'Pingwin złotoczuby ma na głowie złote pióra, które sterczą jak fantazyjna fryzura.', { bird: 1, feathers: 1, tail: 1, legs: 1, arctic: 1, ocean: 1, groups: 1, water: 1 }),

  // Egzotyczne tropikalne
  mk('kookaburra', 'Kukabura', '🐦', 'Kukabura śmieje się "ha-ha-ha" — to ptak, który brzmi jak chichot.', { bird: 1, feathers: 1, tail: 1, legs: 1, fly: 1, pred: 1, small_c: -1 }),
  mk('bowerbird', 'Altannik', '🐦', 'Altannik buduje pałac z patyków i ozdabia go niebieskimi przedmiotami — by zaimponować samicy.', { bird: 1, feathers: 1, tail: 1, legs: 1, jungle: 1, fly: 1, small_c: 1 }),
  mk('mockingbird', 'Drozd przedrzeźniacz', '🐦', 'Drozd przedrzeźniacz uczy się 200 piosenek innych ptaków i miesza je w swój własny remiks.', { bird: 1, feathers: 1, tail: 1, legs: 1, fly: 1, small_c: 1 }),
  mk('bee_eater', 'Żołna', '🐦', 'Żołna łapie pszczoły w locie i uderza nimi o gałąź, żeby pozbyć się żądła.', { bird: 1, feathers: 1, tail: 1, legs: 1, pol: 1, fly: 1, pred: 1, small_c: 1 }),
  mk('motmot', 'Motmot', '🦜', 'Motmot ma ogon zakończony "rakietkami" — macha nim jak wahadłem zegara.', { bird: 1, feathers: 1, tail: 1, legs: 1, jungle: 1, fly: 1, small_c: 1 }),
  mk('roller', 'Kraska', '🐦', 'Kraska wykonuje akrobacje w locie — koziołkuje, by zaimponować samicy.', { bird: 1, feathers: 1, tail: 1, legs: 1, pol: 1, fly: 1, small_c: 1 }),
  mk('sunbird', 'Nektarnik', '🐦', 'Nektarnik to afrykański "koliber" — ale pije nektar, siedząc na kwiatku.', { bird: 1, feathers: 1, tail: 1, legs: 1, jungle: 1, fly: 1, plant: 1, small_c: 1, afr: 1 }),
  mk('fairy_wren', 'Chwostka', '🐦', 'Chwostka uczy pisklęta hasła w jajku — żeby rozpoznać własne dzieci.', { bird: 1, feathers: 1, tail: 1, legs: 1, fly: 1, groups: 1, small_c: 1 }),

  // Brodzące i błotne
  mk('crane_grey', 'Żuraw zwyczajny', '🐦', 'Żuraw tańczy podskakując i kłaniając się — to taniec godowy parą na całe życie.', { bird: 1, feathers: 1, tail: 1, legs: 1, water: 1, pol: 1, fly: 1, big_d: -1, groups: 1 }),
  mk('crowned_crane', 'Żuraw koroniasty', '🐦', 'Żuraw koroniasty śpi na drzewach — jedyny żuraw, który ma palce do chwytania gałęzi.', { bird: 1, feathers: 1, tail: 1, legs: 1, water: 1, fly: 1, afr: 1 }),
  mk('whooping_crane', 'Żuraw krzykliwy', '🐦', 'Żuraw krzykliwy był kiedyś prawie wymarły — w 1941 roku zostało go tylko około 20 ptaków.', { bird: 1, feathers: 1, tail: 1, legs: 1, water: 1, fly: 1, big_d: -1 }),
  mk('spoonbill', 'Warzęcha', '🐦', 'Warzęcha ma dziób w kształcie łyżki — przesiewa wodę z muła, łapiąc małe stworzonka.', { bird: 1, feathers: 1, tail: 1, legs: 1, water: 1, pol: -1, fly: 1 }),
  mk('avocet', 'Szablodziób', '🐦', 'Szablodziób ma dziób wygięty w górę jak szabla — wodzi nim w wodzie szukając zdobyczy.', { bird: 1, feathers: 1, tail: 1, legs: 1, water: 1, pol: -1, fly: 1, small_c: 1 }),
  mk('stilt', 'Szczudłak', '🐦', 'Szczudłak ma bardzo długie, różowe nogi — brodzi w wodzie jak na szczudłach.', { bird: 1, feathers: 1, tail: 1, legs: 1, water: 1, fly: 1, small_c: 1 }),
  mk('oystercatcher', 'Ostrygojad', '🐦', 'Ostrygojad ma mocny, czerwony dziób — otwiera nim muszle małży.', { bird: 1, feathers: 1, tail: 1, legs: 1, ocean: 1, fly: 1, pred: 1, pol: 1 }),
  mk('sandpiper', 'Brodziec', '🐦', 'Brodźce biegają po plaży tuż za falą i wyciągają z piasku małe stworzonka.', { bird: 1, feathers: 1, tail: 1, legs: 1, ocean: 1, water: 1, fly: 1, small_c: 1, pol: 1 }),

  // Małe leśne
  mk('robin_european', 'Rudzik', '🐦', 'Rudzik śpiewa nawet w nocy przy ulicznej lampie — myśli, że to świt.', { bird: 1, feathers: 1, tail: 1, legs: 1, pol: 1, forest: 1, fly: 1, small_c: 1 }),
  mk('wagtail', 'Pliszka siwa', '🐦', 'Pliszka ciągle kiwa ogonem w górę i w dół — stąd jej ludowa nazwa "trzęsiogon".', { bird: 1, feathers: 1, tail: 1, legs: 1, pol: 1, fly: 1, small_c: 1 }),
  mk('nuthatch', 'Kowalik', '🐦', 'Kowalik chodzi po pniu drzewa głową w dół — jedyny ptak Polski, który tak potrafi.', { bird: 1, feathers: 1, tail: 1, legs: 1, pol: 1, forest: 1, fly: 1, small_c: 1 }),
  mk('treecreeper', 'Pełzacz leśny', '🐦', 'Pełzacz wspina się spiralą po pniu — w dół już nie chodzi, leci na następne drzewo.', { bird: 1, feathers: 1, tail: 1, legs: 1, pol: 1, forest: 1, fly: 1, small_c: 1 }),
  mk('nightjar', 'Lelek', '🐦', 'Lelek za dnia wygląda jak kawałek gałęzi — nocą łapie owady szeroko otwartym dziobem.', { bird: 1, feathers: 1, tail: 1, legs: 1, pol: 1, forest: 1, fly: 1, nocturnal: 1, pred: 1, small_c: 1 }),
  mk('swift', 'Jerzyk', '🐦', 'Jerzyk śpi w locie na 3000 metrów — może nie lądować nawet przez 10 miesięcy.', { bird: 1, feathers: 1, tail: 1, legs: 1, pol: 1, fly: 1, fast: 1, small_c: 1 }),

  // Egzotyczne dziwactwa
  mk('kea', 'Kea', '🦜', 'Kea z Nowej Zelandii jest tak ciekawska, że otwiera plecaki turystów i kradnie kanapki.', { bird: 1, feathers: 1, tail: 1, legs: 1, fly: 1, pred: -1 }),
  mk('rhea_lesser', 'Nandu mały', '🦤', 'Nandu mały nie lata, ale biega 60 km/h — i to samce wysiadują jaja.', { bird: 1, feathers: 1, tail: -1, legs: 1, fast: 1, big_d: 1 }),

  // === BATCH 4.3: Ryby świata ===
  // Polskie/europejskie słodkowodne (pikeperch + barbel skipped — `zander` i `catfish_polish` już istnieją z tymi nazwami_pl)
  mk('asp', 'Boleń', '🐟', 'Boleń atakuje z impetem — "wybucha" wśród rybek, by je ogłuszyć falą.', { fish: 1, scales: 1, tail: 1, water: 1, pol: 1, pred: 1, fast: 1 }),
  mk('rudd', 'Wzdręga', '🐟', 'Wzdręga ma czerwone płetwy — żyje w zarośniętych jeziorach Polski.', { fish: 1, scales: 1, tail: 1, water: 1, pol: 1, plant: 1, small_c: 1 }),
  mk('grayling', 'Lipień', '🐟', 'Lipień ma dużą, kolorową płetwę na grzbiecie, która wygląda jak żagiel.', { fish: 1, scales: 1, tail: 1, water: 1, pol: 1, fast: 1 }),
  mk('brook_trout', 'Głowacica', '🐟', 'Głowacica to największa ryba łososiowata Europy — może mieć ponad metr długości.', { water: 1, scales: 1, fish: 1, pred: 1, pol: 1, tail: 1, fast: 1 }),
  mk('smelt', 'Stynka', '🐟', 'Stynka pachnie świeżym ogórkiem — to taki sam aromatyczny związek.', { fish: 1, scales: 1, tail: 1, water: 1, pol: 1, small_c: 1, groups: 1 }),
  mk('sterlet', 'Sterlet', '🐟', 'Sterlet ma "kostne tarcze" zamiast łusek — to żywy relikt sprzed dinozaurów.', { fish: 1, scales: -1, tail: 1, water: 1, pol: -1 }),

  // Akwariowe tropikalne
  mk('betta', 'Bojownik wspaniały', '🐠', 'Bojownik puszcza bańki — buduje gniazdo z piany na wodzie dla swojego potomstwa.', { fish: 1, scales: 1, tail: 1, water: 1, small_c: 1, pred: 1, home: 1 }),
  mk('guppy', 'Gupik', '🐠', 'Gupik nie składa ikry — rodzi żywe rybki, które od razu pływają.', { fish: 1, scales: 1, tail: 1, water: 1, small_c: 1, groups: 1, home: 1 }),
  mk('tetra_neon', 'Neonowiec', '🐠', 'Neonowiec ma na grzbiecie świecący niebieski pasek — błyszczy nawet w ciemnym akwarium.', { fish: 1, scales: 1, tail: 1, water: 1, small_c: 1, groups: 1, home: 1 }),
  mk('angelfish', 'Skalar', '🐠', 'Skalar ma trójkątny kształt i pływa wśród korzeni w Amazonii — w domu pływa wśród sztucznych roślin.', { fish: 1, scales: 1, tail: 1, water: 1, jungle: -1, small_c: 1, home: 1 }),
  mk('gourami', 'Gurami', '🐠', 'Gurami oddycha powietrzem z atmosfery — wysuwa pyszczek nad wodę co kilka minut.', { fish: 1, scales: 1, tail: 1, water: 1, home: 1 }),
  mk('mandarinfish', 'Mandarynka', '🐠', 'Mandarynka ma najbardziej kolorową łuskę morza — niebiesko-pomarańczowy wzór jak kalejdoskop.', { fish: 1, scales: 1, tail: 1, water: 1, ocean: 1, small_c: 1 }),

  // Rafa koralowa
  mk('triggerfish', 'Rogatnica', '🐠', 'Rogatnica wsuwa się w szczeliny rafy i blokuje wyjście dziwnym kolcem na grzbiecie.', { fish: 1, scales: 1, tail: 1, water: 1, ocean: 1, pred: 1 }),
  mk('surgeonfish', 'Pokolec', '🐠', 'Pokolec ma ostre "skalpele" przy ogonie — używa ich w walce z rywalem.', { fish: 1, scales: 1, tail: 1, water: 1, ocean: 1, plant: 1 }),
  mk('butterflyfish', 'Chetonik', '🐠', 'Chetonik ma "fałszywe oko" na ogonie — myli drapieżcę, który atakuje z tyłu.', { fish: 1, scales: 1, tail: 1, water: 1, ocean: 1, small_c: 1 }),
  mk('grouper', 'Granik', '🐟', 'Granik olbrzymi potrafi połknąć nawet małego rekina — waży do 400 kg.', { fish: 1, scales: 1, tail: 1, water: 1, ocean: 1, pred: 1, big_d: 1 }),
  mk('snapper', 'Lucjan', '🐟', 'Lucjan grupuje się w ławice tysiąca ryb — wirują razem jak chmura w wodzie.', { fish: 1, scales: 1, tail: 1, water: 1, ocean: 1, groups: 1, pred: 1 }),
  mk('flying_fish', 'Ryba latająca', '🐟', 'Ryba latająca szybuje nad wodą nawet 200 metrów — ogon działa jak silnik startowy.', { fish: 1, scales: 1, tail: 1, water: 1, ocean: 1, fast: 1, small_c: -1 }),

  // Rekiny
  mk('great_white', 'Żarłacz biały', '🦈', 'Żarłacz biały wykrywa kroplę krwi w 100 litrach wody — to jak igła w basenie.', { fish: 1, scales: 1, tail: 1, water: 1, ocean: 1, pred: 1, danger: 1, big_d: 1, fast: 1 }),
  mk('tiger_shark', 'Żarłacz tygrysi', '🦈', 'Żarłacz tygrysi zjada wszystko — w jego brzuchu znaleziono opony i tablice rejestracyjne.', { fish: 1, scales: 1, tail: 1, water: 1, ocean: 1, pred: 1, danger: 1, big_d: 1 }),
  mk('bull_shark', 'Żarłacz tępogłowy', '🦈', 'Żarłacz tępogłowy pływa w słodkiej wodzie — można go spotkać 1000 km w głębi rzeki.', { fish: 1, scales: 1, tail: 1, water: 1, ocean: 1, pred: 1, danger: 1, big_d: 1 }),
  mk('nurse_shark', 'Rekin pielęgniarka', '🦈', 'Rekin pielęgniarka śpi w dzień w jaskini, brzuchem do góry, czasem w stosie 30 osobników.', { fish: 1, scales: 1, tail: 1, water: 1, ocean: 1, pred: 1, big_d: 1, nocturnal: 1, groups: 1 }),
  mk('mako_shark', 'Mako ostronosy', '🦈', 'Mako ostronosy to najszybszy rekin świata — pędzi 80 km/h, jak skuter wodny.', { fish: 1, scales: 1, tail: 1, water: 1, ocean: 1, pred: 1, big_d: 1, fast: 1 }),
  mk('thresher_shark', 'Kosogon', '🦈', 'Kosogon ma ogon dłuższy niż reszta ciała — biczem ogłusza ryby w ławicy.', { fish: 1, scales: 1, tail: 1, water: 1, ocean: 1, pred: 1, big_d: 1 }),
  mk('goblin_shark', 'Rekin goblinski', '🦈', 'Rekin goblin wysuwa szczęki do przodu — jak chwytak w automacie z pluszakami.', { fish: 1, scales: 1, tail: 1, water: 1, ocean: 1, pred: 1, big_d: 1, nocturnal: 1 }),

  // Płaszczki i podobne
  mk('stingray', 'Płaszczka kolczasta', '🐟', 'Płaszczka kolczasta ma kolec na ogonie z jadem — używa go tylko w obronie.', { fish: 1, scales: -1, tail: 1, water: 1, ocean: 1, venom: 1, danger: -1 }),
  mk('electric_ray', 'Drętwa', '🐟', 'Drętwa porazi cię 200 woltami — to jak rażenie z gniazdka.', { fish: 1, scales: -1, tail: 1, water: 1, ocean: 1, danger: 1, pred: 1 }),
  mk('sawfish', 'Piła morska', '🐟', 'Piła morska ma pysk z 30 zębami po bokach — macha nim wśród ryb jak mieczem.', { fish: 1, scales: 1, tail: 1, water: 1, ocean: 1, pred: 1, big_d: 1 }),

  // Wyjątki/dziwactwa
  mk('coelacanth', 'Latimeria', '🐟', 'Latimeria miała wyginąć z dinozaurami, ale została odkryta żyjąca w 1938 roku.', { fish: 1, scales: 1, tail: 1, water: 1, ocean: 1, nocturnal: 1 }),
  mk('lungfish', 'Prapłaźka', '🐟', 'Prapłaźka oddycha płucami i przeżyje 4 lata w wysychającym błocie — owinięta śluzem.', { fish: 1, scales: 1, tail: 1, water: 1, afr: 1 }),
  mk('arapaima', 'Arapaima', '🐟', 'Arapaima ma do 3 metrów długości — to jedna z największych słodkowodnych ryb świata.', { fish: 1, scales: 1, tail: 1, water: 1, jungle: 1, pred: 1, big_d: 1 }),
  mk('mudskipper', 'Skoczek mułowy', '🐟', 'Skoczek mułowy chodzi po lądzie godzinami — oddycha skórą i ogonem.', { fish: 1, scales: -1, tail: 1, water: 1, ocean: -1, small_c: 1 }),
  mk('pacu', 'Pacu', '🐟', 'Pacu ma zęby jak człowiek — używa ich do gryzienia owoców spadających do wody.', { fish: 1, scales: 1, tail: 1, water: 1, jungle: 1, plant: 1 }),
  mk('tigerfish', 'Goliat afrykański', '🐟', 'Goliat afrykański skacze z wody, by chwycić ptaka w locie — ma 32 ostre zęby.', { fish: 1, scales: 1, tail: 1, water: 1, pred: 1, danger: 1, big_d: 1, fast: 1, afr: 1 }),
  mk('candiru', 'Kanderu', '🐟', 'Kanderu to pasożyt — wchodzi przez skrzela większej ryby i pije jej krew.', { fish: 1, scales: -1, tail: 1, water: 1, jungle: 1, small_c: 1, pred: 1, danger: 1 }),

  // === BATCH 4.4: Owady i pajęczaki ===
  // Motyle i ćmy
  mk('luna_moth', 'Saturniówka księżycowa', '🦋', 'Saturniówka księżycowa nie ma ust — żyje tylko 7 dni, dorosła nie je nic.', { insect: 1, fly: 1, jungle: -1, nocturnal: 1, small_c: 1, legs: 1 }),
  mk('silkworm', 'Gąsienica jedwabnika', '🦋', 'Jedwabnik snuje 1 km jedwabnej nici dla jednego kokonu — z 30 kokonów uszyje się chustka.', { insect: 1, jungle: -1, small_c: 1, legs: 1 }),
  mk('monarch_butterfly', 'Cytrynek', '🦋', 'Cytrynek to jeden z pierwszych motyli wiosny — przezimowuje ukryty wśród liści.', { fly: 1, insect: 1, small_c: 1, pol: 1, legs: 1, plant: 1, forest: 1 }),
  mk('swallowtail', 'Paź królowej', '🦋', 'Paź królowej ma "ogonki" na tylnych skrzydłach — myli ptaki, gdzie jest głowa.', { insect: 1, fly: 1, pol: 1, small_c: 1, legs: 1 }),
  mk('morpho_blue', 'Modraszek ariom', '🦋', 'Gąsienica modraszka mieszka w mrowisku — mrówki karmią ją jak własne dziecko!', { fly: 1, insect: 1, small_c: 1, pol: 1, legs: 1 }),

  // Ważki i ich krewni
  mk('damselfly', 'Łątka', '🦟', 'Łątka składa skrzydła "do kupy" w spoczynku — ważka zostawia je rozłożone.', { insect: 1, fly: 1, water: 1, pol: 1, pred: 1, small_c: 1, legs: 1 }),
  mk('mayfly_giant', 'Jętka olbrzymka', '🦟', 'Jętka olbrzymka to największa jętka Europy — jej masowe wyloty wyglądają jak śnieżyca.', { insect: 1, fly: 1, water: 1, pol: -1, small_c: 1, legs: 1 }),
  mk('water_strider', 'Nartnik', '🦗', 'Nartnik chodzi po wodzie — jego łapy mają mikroskopijne włoski odpychające krople.', { insect: 1, water: 1, pol: 1, small_c: 1, pred: 1, legs: 1 }),

  // Chrząszcze
  mk('dung_beetle', 'Toczyciel', '🪲', 'Toczyciel ulepi kulkę z kupy 50 razy większą niż on i toczy ją do norki.', { insect: 1, fast: -1, small_c: 1, legs: 1 }),
  mk('jewel_beetle_emerald', 'Chrząszcz klejnotowy', '🪲', 'Chrząszcz klejnotowy ma pancerz tak błyszczący, że robi się z niego biżuterię.', { insect: 1, fly: 1, jungle: 1, small_c: 1, legs: 1 }),
  mk('bombardier_beetle', 'Bombardier', '🪲', 'Bombardier strzela wrzącą cieczą z odwłoka — 100°C, prosto w oczy wroga.', { insect: 1, pol: -1, small_c: 1, danger: -1, legs: 1 }),
  mk('weevil', 'Ryjkowiec', '🪲', 'Ryjkowiec ma "trąbkę" zamiast pyska — wbija ją w nasiona i składa w środku jaja.', { insect: 1, plant: 1, small_c: 1, legs: 1 }),

  // Pluskwiaki i robaczki
  mk('aphid', 'Mszyca', '🐛', 'Mszyce potrafią rodzić młode bez udziału samca — wszystkie są kopiami mamy.', { insect: 1, plant: 1, small_c: 1, groups: 1, legs: 1 }),
  mk('earwig', 'Skorek pospolity', '🐛', 'Samica skorka opiekuje się jajami — czyści je i pilnuje aż do wyklucia.', { insect: 1, pol: 1, nocturnal: 1, small_c: 1, legs: 1 }),
  mk('cicada_periodical', 'Cykada okresowa', '🦗', 'Cykada okresowa kryje się pod ziemią 17 lat, potem wszystkie wychodzą w tym samym dniu.', { insect: 1, fly: 1, small_c: 1, groups: 1, legs: 1 }),
  mk('lacewing', 'Złotook', '🦗', 'Złotook składa jaja na cienkich nitkach — żeby mrówki i rodzeństwo ich nie zjadły.', { insect: 1, fly: 1, pol: 1, pred: 1, small_c: 1, legs: 1 }),

  // Mrówki i ich krewni
  mk('leafcutter_ant', 'Mrówka tnąca liście', '🐜', 'Mrówki tnące liście hodują pod ziemią grzyby — to jedni z pierwszych "rolników" świata.', { insect: 1, jungle: 1, groups: 1, small_c: 1, legs: 1 }),
  mk('army_ant', 'Mrówka wędrowna', '🐜', 'Mrówki wędrowne nie budują gniazda — żyją w "kuli" z własnych ciał, splecionych razem.', { insect: 1, jungle: 1, pred: 1, groups: 1, small_c: 1, legs: 1 }),
  mk('honeypot_ant', 'Mrówka miodowa', '🐜', 'Mrówka miodowa to "żywy słoik" — robotnice karmią ją słodyczami aż brzuch jej spuchnie do rozmiaru jagody.', { insect: 1, groups: 1, small_c: 1, legs: 1 }),
  mk('carpenter_ant', 'Gmachówka', '🐜', 'Gmachówki drążą korytarze w drewnie — to największe mrówki w Polsce.', { insect: 1, forest: 1, pol: 1, groups: 1, small_c: 1, legs: 1 }),

  // Osy i pszczoły specjalne
  mk('paper_wasp', 'Klecanka', '🐝', 'Klecanka buduje sześciokątne komory papierowe — żuje drewno i miesza ze śliną.', { insect: 1, fly: 1, pol: 1, groups: 1, small_c: 1, legs: 1 }),
  mk('asian_hornet', 'Szerszeń azjatycki', '🐝', 'Szerszeń azjatycki poluje na pszczoły miodne — dlatego pszczelarze bardzo go nie lubią.', { insect: 1, fly: 1, pred: 1, danger: 1, groups: 1, venom: 1, small_c: 1, legs: 1 }),
  mk('tarantula_hawk', 'Nastecznik', '🐝', 'Nastecznik chwyta tarantulę, paraliżuje ją, składa jaja w jej brzuchu — żywa larwa zjada żywą tarantulę.', { insect: 1, fly: 1, pred: 1, danger: 1, venom: 1, small_c: 1, legs: 1 }),

  // Pajęczaki — pająki
  mk('jumping_spider', 'Skakun', '🕷️', 'Skoczek widzi w kolorze i ma 8 oczu — najlepsze widzenie wśród pajęczaków.', { jungle: -1, pred: 1, small_c: 1, legs: 1 }),
  mk('wolf_spider', 'Pogoniec', '🕷️', 'Pogoniec nie tka sieci — biega za zdobyczą jak mały wilk.', { pol: 1, pred: 1, nocturnal: 1, small_c: 1, legs: 1 }),
  mk('orb_weaver', 'Tygrzyk paskowany', '🕷️', 'Tygrzyk paskowany ma żółto-czarne paski jak osa i tka sieć z zygzakiem.', { small_c: 1, pred: 1, pol: 1, legs: 1 }),
  mk('trapdoor_spider', 'Gryziel', '🕷️', 'Gryziel mieszka w jedwabnej rurce w ziemi — łapie owady, które po niej przejdą.', { pred: 1, nocturnal: 1, small_c: 1, legs: 1, pol: 1 }),
  mk('brown_recluse', 'Pustelnik brunatny', '🕷️', 'Pustelnik brunatny ma jad rozkładający tkanki — rana goi się tygodniami.', { pred: 1, danger: 1, venom: 1, small_c: 1, nocturnal: 1, legs: 1 }),
  mk('huntsman_spider', 'Łownik', '🕷️', 'Łownik ma rozpiętość 30 cm — wielkości talerza obiadowego.', { jungle: 1, pred: 1, nocturnal: 1, fast: 1, small_c: -1, legs: 1 }),
  mk('funnel_web_spider', 'Atrax', '🕷️', 'Atrax z Sydney to jeden z najgroźniejszych pająków świata — na szczęście jest na niego lekarstwo.', { pred: 1, danger: 1, venom: 1, small_c: 1, legs: 1 }),
  mk('peacock_spider', 'Pawik pająk', '🕷️', 'Pawik pająk tańczy z kolorowym wachlarzem na odwłoku — wielkości ziarna ryżu.', { pred: 1, small_c: 1, legs: 1 }),
  mk('crab_spider', 'Kwietnik', '🕷️', 'Kwietnik potrafi w kilka dni zmienić kolor na żółty lub biały — pasuje do kwiatka, na którym czyha.', { pol: 1, pred: 1, small_c: 1, legs: 1 }),
  mk('whip_spider', 'Tępoodwłokowiec', '🕷️', 'Tępoodwłokowiec ma długie, biczowate odnóża — to krewniak pająków, ale bez jadu.', { jungle: 1, nocturnal: 1, small_c: 1, legs: 1 }),

  // Skorpiony
  mk('emperor_scorpion', 'Skorpion imperialny', '🦂', 'Skorpion imperialny świeci na zielono w świetle UV — naukowcy nie wiedzą dlaczego.', { jungle: 1, pred: 1, venom: 1, nocturnal: 1, small_c: 1, legs: 1, afr: 1 }),
  mk('deathstalker', 'Skorpion żółty', '🦂', 'Jad skorpiona żółtego jest bardzo silny — naukowcy badają go, by leczyć choroby.', { pred: 1, danger: 1, venom: 1, nocturnal: 1, small_c: 1, legs: 1, afr: 1 }),

  // Wijowce
  mk('giant_centipede', 'Skolopendra olbrzymia', '🐛', 'Skolopendra olbrzymia łapie nietoperza w locie — wisi z sufitu jaskini.', { jungle: 1, pred: 1, danger: 1, venom: 1, nocturnal: 1, legs: 1 }),

  // Inne pajęczaki
  mk('sun_spider', 'Topik', '🕷️', 'Topik to pająk, który mieszka pod wodą w bańce powietrza jak w dzwonie nurkowym.', { water: 1, small_c: 1, pred: 1, pol: 1, legs: 1 }),

  // === BATCH 4.5: Gady i płazy ===
  // Węże jadowite
  mk('tiger_snake', 'Wąż tygrysi', '🐍', 'Wąż tygrysi z Australii ma bardzo silny jad — na szczęście jest na niego surowica.', { reptile: 1, scales: 1, pred: 1, danger: 1, venom: 1, tail: -1 }),
  mk('coral_snake', 'Wąż koralowy', '🐍', 'Wąż koralowy ma czerwone, żółte i czarne paski — jaskrawe kolory ostrzegają: jestem jadowity!', { reptile: 1, scales: 1, pred: 1, danger: 1, venom: 1, jungle: 1, small_c: -1, tail: -1 }),
  mk('gaboon_viper', 'Żmija gabońska', '🐍', 'Żmija gabońska ma najdłuższe kły wśród węży — 5 cm, dłuższe niż palec.', { reptile: 1, scales: 1, pred: 1, danger: 1, venom: 1, jungle: 1, tail: -1 }),
  mk('sea_snake', 'Wąż morski', '🐍', 'Wąż morski potrafi pobierać część tlenu przez skórę i długo nie wypływa na powierzchnię.', { reptile: 1, scales: 1, water: 1, ocean: 1, pred: 1, danger: 1, venom: 1, tail: -1 }),
  mk('sidewinder', 'Grzechotnik wycieczny', '🐍', 'Grzechotnik wycieczny porusza się bokiem na piasku — zostawia ślady jak litera "S".', { reptile: 1, scales: 1, pred: 1, danger: 1, venom: 1, nocturnal: 1 }),
  mk('copperhead', 'Mokasyn miedziogłowy', '🐍', 'Mokasyn miedziogłowy pachnie świeżymi ogórkami, gdy się go drażni.', { reptile: 1, scales: 1, pred: 1, danger: 1, venom: 1, tail: -1 }),
  mk('bushmaster', 'Surukuku', '🐍', 'Surukuku to najdłuższy jadowity wąż Ameryki — 3,7 metra, większy niż łóżko.', { reptile: 1, scales: 1, jungle: 1, pred: 1, danger: 1, venom: 1, big_d: 1, nocturnal: 1, tail: -1 }),

  // Węże bez jadu
  mk('garter_snake', 'Wąż wstęgowy', '🐍', 'Wąż wstęgowy ma pomarańczowe wstęgi na grzbiecie — jest niewielki i nieszkodliwy.', { reptile: 1, scales: 1, water: -1, pred: 1, small_c: -1, tail: -1 }),
  mk('milk_snake', 'Wąż mleczny', '🐍', 'Wąż mleczny udaje koralowego — barwami straszy wrogów, ale sam nie ma jadu.', { reptile: 1, scales: 1, pred: 1, nocturnal: 1, small_c: 1, tail: -1 }),

  // Krokodyle i krewniacy
  mk('caiman', 'Kajman okularowy', '🐊', 'Kajman okularowy ma kostny wałek między oczami — wygląda, jakby nosił okulary.', { reptile: 1, scales: 1, tail: 1, legs: 1, water: 1, jungle: 1, pred: 1, danger: 1, big_d: 1 }),

  // Jaszczurki
  mk('gila_monster', 'Helodermat', '🦎', 'Helodermat to jedna z niewielu jadowitych jaszczurek — gdy ugryzie, długo nie puszcza.', { reptile: 1, scales: 1, tail: 1, legs: 1, pred: 1, danger: 1, venom: 1, small_c: -1 }),
  mk('beaded_lizard', 'Heloderma meksykańska', '🦎', 'Heloderma ma na skórze "perełki" — to kostne łuski jak bursztynowy szlif.', { reptile: 1, scales: 1, tail: 1, legs: 1, pred: 1, venom: 1, small_c: -1, nocturnal: 1 }),
  mk('anole', 'Anolis', '🦎', 'Anolis zmienia kolor z zielonego na brązowy, a samiec pokazuje kolorowy fałd pod gardłem.', { reptile: 1, scales: 1, tail: 1, legs: 1, jungle: 1, pred: 1, small_c: 1 }),
  mk('skink', 'Scynk', '🦎', 'Scynk traci ogon, gdy go złapać — odrasta mu nowy w kilka miesięcy.', { reptile: 1, scales: 1, tail: 1, legs: 1, small_c: 1, fast: 1 }),
  mk('tuatara', 'Tuatara', '🦎', 'Tuatara wygląda jak jaszczurka, ale to ostatni krewny gadów żyjących przed dinozaurami.', { reptile: 1, scales: 1, tail: 1, legs: 1, nocturnal: 1, pred: 1, small_c: 1 }),
  mk('tokay_gecko', 'Tokej', '🦎', 'Tokej szczeka jak pies — "to-kay, to-kay" — można go usłyszeć z 10 metrów.', { reptile: 1, scales: 1, tail: 1, legs: 1, jungle: 1, nocturnal: 1, small_c: 1 }),
  mk('crested_gecko', 'Gekon orzęsiony', '🦎', 'Gekon orzęsiony ma nad oczami kolce jak rzęsy — uważano go za wymarłego do 1994 roku.', { reptile: 1, scales: 1, tail: 1, legs: 1, jungle: 1, nocturnal: 1, small_c: 1 }),
  mk('panther_chameleon', 'Kameleon panterowy', '🦎', 'Kameleon panterowy ma jedne z najjaskrawszych barw wśród kameleonów — niebieskie, czerwone i zielone.', { reptile: 1, scales: 1, tail: 1, legs: 1, jungle: 1, pred: 1, small_c: 1 }),
  mk('jackson_chameleon', 'Kameleon Jacksona', '🦎', 'Kameleon Jacksona ma 3 rogi jak triceratops — używa ich w walce z rywalami.', { reptile: 1, scales: 1, tail: 1, legs: 1, jungle: 1, pred: 1, horns: 1, small_c: 1 }),

  // Żółwie
  mk('hawksbill_turtle', 'Żółw szylkretowy', '🐢', 'Żółw szylkretowy zjada gąbki morskie, których prawie nikt inny nie je.', { reptile: 1, scales: 1, shell: 1, tail: 1, legs: 1, water: 1, ocean: 1, pred: 1, big_d: 1 }),
  mk('leatherback_turtle', 'Żółw skórzasty', '🐢', 'Żółw skórzasty nie ma twardej skorupy — ma elastyczną skórę i jest największym żółwiem świata.', { reptile: 1, scales: -1, shell: -1, tail: 1, legs: 1, water: 1, ocean: 1, pred: 1, big_d: 1 }),
  mk('loggerhead_turtle', 'Karetta', '🐢', 'Karetta ma najpotężniejszą szczękę wśród żółwi — zgryzie muszle krabów jak orzechy.', { reptile: 1, scales: 1, shell: 1, tail: 1, legs: 1, water: 1, ocean: 1, pred: 1, big_d: 1 }),
  mk('galapagos_tortoise', 'Żółw słoniowy', '🐢', 'Żółw słoniowy z Galapagos może ważyć ponad 250 kg i żyć ponad 100 lat.', { reptile: 1, scales: 1, shell: 1, tail: 1, legs: 1, plant: 1, big_d: 1 }),
  mk('red_eared_slider', 'Żółw czerwonolicy', '🐢', 'Żółw czerwonolicy ma czerwone "uszy" — to nie uszy, ale rysunek za okiem.', { reptile: 1, scales: 1, shell: 1, tail: 1, legs: 1, water: 1, home: -1, small_c: 1 }),
  mk('painted_turtle', 'Żółw malowany', '🐢', 'Żółw malowany ma na pancerzu wzór jak zachodzące słońce — różowy, żółty, czerwony.', { reptile: 1, scales: 1, shell: 1, tail: 1, legs: 1, water: 1, small_c: 1 }),

  // Płazy — żaby/ropuchy
  mk('tomato_frog', 'Żaba pomidorowa', '🐸', 'Żaba pomidorowa w obronie wydziela kleistą ciecz, która skleja pysk drapieżnikowi.', { amphi: 1, tail: -1, legs: 1, jungle: 1, small_c: 1, afr: 1 }),
  mk('darwin_frog', 'Nosatka', '🐸', 'Samiec nosatki nosi kijanki w worku pod gardłem — małe żabki wyskakują mu z pyszczka!', { amphi: 1, tail: -1, legs: 1, jungle: 1, small_c: 1 }),
  mk('surinam_toad', 'Pipa amerykańska', '🐸', 'Pipa amerykańska składa jaja w skórę grzbietu samicy — żabki wykluwają się z jej pleców.', { amphi: 1, tail: -1, legs: 1, water: 1, jungle: 1, small_c: 1 }),
  mk('cane_toad', 'Aga olbrzymia', '🐸', 'Aga olbrzymia ma trujące gruczoły za oczami — zwierzę, które ją ugryzie, może się otruć.', { amphi: 1, tail: -1, legs: 1, jungle: 1, venom: 1, danger: 1 }),
  mk('fire_belly_toad', 'Kumak czerwonobrzuchy', '🐸', 'Kumak ma czerwony brzuch — odwraca się brzuchem do góry, by ostrzec, że jest trujący.', { amphi: 1, tail: -1, legs: 1, water: 1, pol: 1, venom: 1, small_c: 1 }),
  mk('spadefoot_toad', 'Grzebiuszka', '🐸', 'Grzebiuszka kopie tylnymi łapami pod ziemię — chowa się przed suszą na całe lato.', { amphi: 1, tail: -1, legs: 1, pol: 1, small_c: 1, nocturnal: 1 }),
  mk('wood_frog', 'Żaba leśna', '🐸', 'Żaba leśna zamarza zimą w lód i ożywa wiosną — jej serce zatrzymuje się i restartuje.', { amphi: 1, tail: -1, legs: 1, forest: 1, arctic: -1, small_c: 1 }),

  // Płazy ogoniaste
  mk('tiger_salamander', 'Salamandra tygrysia', '🦎', 'Salamandra tygrysia zjada własne rodzeństwo, gdy zabraknie jedzenia — i ma żółto-czarne paski.', { amphi: 1, tail: 1, legs: 1, pred: 1, nocturnal: 1, small_c: 1 }),
  mk('olm', 'Odmieniec jaskiniowy', '🦎', 'Odmieniec żyje 100 lat w ciemności jaskini — biały, ślepy, oddycha skórą.', { amphi: 1, tail: 1, legs: 1, water: 1, nocturnal: 1, small_c: 1 }),

  // === BATCH 4.6: Głębia oceanu i skorupiaki ===
  // Ryby głębinowe (biolumnescentne, dziwne kształty)
  mk('viperfish', 'Wężomorz', '🐟', 'Wężomorz ma zęby tak długie, że nie mieszczą się w pysku — sterczą jak kraty.', { fish: 1, scales: -1, tail: 1, water: 1, ocean: 1, pred: 1, nocturnal: 1, small_c: 1 }),
  mk('dragonfish', 'Wielkogłowy smok', '🐟', 'Wielkogłowy smok świeci czerwonym światłem — widzi w głębinach tym, czym inne ryby są ślepe.', { fish: 1, scales: -1, tail: 1, water: 1, ocean: 1, pred: 1, small_c: 1 }),
  mk('lanternfish', 'Świetlik morski', '🐟', 'Świetlik świeci na brzuchu jak gwiazdy — ukrywa swój cień przed drapieżcą w dole.', { fish: 1, scales: 1, tail: 1, water: 1, ocean: 1, small_c: 1, groups: 1 }),
  mk('gulper_eel', 'Worek żarłoczny', '🐟', 'Worek żarłoczny ma paszczę większą niż reszta ciała — może połknąć rybę swojego rozmiaru.', { fish: 1, scales: -1, tail: 1, water: 1, ocean: 1, pred: 1 }),
  mk('barreleye', 'Beczkooczka', '🐟', 'Beczkooczka ma przezroczystą głowę — widać przez nią oczy patrzące do góry.', { fish: 1, scales: -1, tail: 1, water: 1, ocean: 1, small_c: 1 }),
  mk('ghost_shark', 'Chimera ryba', '🦈', 'Chimera ma na głowie "młotek" z czujnikami elektrycznymi — szuka jedzenia jak detektor metali.', { fish: 1, scales: -1, tail: 1, water: 1, ocean: 1, pred: 1, big_d: -1 }),
  mk('frogfish', 'Skrzeczyk', '🐟', 'Skrzeczyk wędkuje rybkami — kiwa "wędką" na głowie, żeby zwabić zdobycz.', { fish: 1, scales: -1, tail: 1, water: 1, ocean: 1, pred: 1, small_c: 1 }),
  mk('hagfish', 'Śluzica', '🐟', 'Śluzica zalewa wroga 20 litrami galaretowatego śluzu — w sekundę zatka mu skrzela.', { fish: 1, scales: -1, tail: 1, water: 1, ocean: 1, small_c: 1 }),
  mk('snailfish', 'Ślimakowiec', '🐟', 'Ślimakowiec żyje 8000 metrów pod wodą — to najgłębiej żyjąca ryba świata.', { fish: 1, scales: -1, tail: 1, water: 1, ocean: 1, small_c: 1 }),
  mk('atolla_jellyfish', 'Atolla', '🪼', 'Atolla świeci spiralą niebieskiego światła, gdy zaatakowana — alarm dla większych ryb, by pożarły napastnika.', { water: 1, ocean: 1, small_c: 1 }),

  // Inne głębinowe
  mk('yeti_crab', 'Krab yeti', '🦀', 'Krab yeti ma "futro" z bakterii na szczypcach — hoduje je na hydrotermalnych wulkanach głębi.', { shell: 1, water: 1, ocean: 1, small_c: 1, legs: 1 }),
  mk('tube_worm', 'Robak rurkowiec', '🐛', 'Rurkowiec żyje przy podwodnych wulkanach — nie ma ust, żywią go bakterie w jego ciele.', { water: 1, ocean: 1, small_c: -1, groups: 1 }),
  mk('dumbo_octopus', 'Ośmiornica Dumbo', '🐙', 'Ośmiornica Dumbo lata pod wodą — macha "uszami" jak słoń Dumbo.', { water: 1, ocean: 1, small_c: 1 }),
  mk('glass_octopus', 'Ośmiornica szklana', '🐙', 'Ośmiornica szklana jest przezroczysta — widać tylko jej oczy i jelito.', { water: 1, ocean: 1, pred: 1, small_c: 1 }),
  mk('vampire_squid_giant', 'Kalmar Humboldta', '🦑', 'Kalmar Humboldta poluje w stadach i błyska na czerwono i biało — rybacy nazywają go "czerwonym diabłem".', { water: 1, pred: 1, ocean: 1, fast: 1, groups: 1, big_d: 1 }),
  mk('lions_mane_jellyfish', 'Chełbia lwiogrzywa', '🪼', 'Chełbia lwiogrzywa ma macki długie nawet na 30 metrów — to jedno z najdłuższych zwierząt świata.', { water: 1, ocean: 1, arctic: -1, danger: 1, big_d: 1 }),
  mk('box_jellyfish', 'Osa morska', '🪼', 'Osa morska to jedno z najbardziej jadowitych zwierząt świata — pływacy w Australii noszą specjalne kombinezony.', { water: 1, ocean: 1, pred: 1, danger: 1, venom: 1 }),
  mk('portuguese_man_of_war', 'Żeglarz portugalski', '🪼', 'Żeglarz portugalski to nie meduza, tylko kolonia wielu drobnych stworzeń żyjących razem jak jedno.', { water: 1, ocean: 1, danger: 1, venom: 1 }),
  mk('crown_of_thorns_starfish', 'Rozgwiazda korona cierniowa', '⭐', 'Korona cierniowa zjada koralowce — jedna sztuka pochłania 6 m² rafy rocznie.', { water: 1, ocean: 1, pred: 1, small_c: -1, danger: -1 }),
  mk('brittle_star', 'Wężowidło', '⭐', 'Wężowidło gubi ramię, gdy ktoś je złapie — i ucieka, a ramię mu odrasta.', { water: 1, ocean: 1, small_c: 1 }),

  // Skorupiaki
  mk('mantis_shrimp_punching', 'Krab bokser', '🦀', 'Krab bokser trzyma w szczypcach małe ukwiały i macha nimi jak pomponami, żeby odstraszyć wrogów.', { water: 1, shell: 1, small_c: 1, ocean: 1, legs: 1 }),
  mk('pistol_shrimp', 'Krewetka pistoletowa', '🦐', 'Krewetka pistoletowa strzela bańką powietrza głośniej niż wystrzał — ogłusza nią rybki.', { shell: 1, water: 1, ocean: 1, pred: 1, small_c: 1, legs: 1 }),
  mk('cleaner_shrimp', 'Krewetka czyściciel', '🦐', 'Krewetka czyściciel sprząta zęby rybom — ryby otwierają usta i czekają.', { shell: 1, water: 1, ocean: 1, small_c: 1, legs: 1 }),
  mk('blue_crab', 'Krab niebieski', '🦀', 'Samica kraba niebieskiego ma czerwone końcówki szczypiec — jakby pomalowała paznokcie.', { shell: 1, water: 1, ocean: 1, pred: 1, legs: 1 }),
  mk('king_crab', 'Krab królewski', '🦀', 'Krab królewski ma rozpiętość 1,8 m — to największy jadalny krab świata.', { shell: 1, water: 1, ocean: 1, arctic: 1, pred: 1, big_d: -1, legs: 1 }),
  mk('dungeness_crab', 'Krab Dungeness', '🦀', 'Krab Dungeness żyje około 10 lat — żeby urosnąć, wiele razy zrzuca pancerz.', { shell: 1, water: 1, ocean: 1, pred: 1, legs: 1 }),
  mk('isopod_giant', 'Stonoga murowa', '🐛', 'Stonoga to skorupiak, który żyje na lądzie — oddycha czymś w rodzaju skrzeli, dlatego lubi wilgoć.', { shell: 1, small_c: 1, pol: 1, legs: 1, nocturnal: 1, plant: 1 }),
  mk('amphipod_giant', 'Obunóg gigantyczny', '🦗', 'Obunóg gigantyczny żyje na 9000 m głębi — ma w brzuchu plastikowe drobinki z naszych śmieci.', { water: 1, ocean: 1, small_c: 1, legs: 1 }),

  // Mięczaki i inne
  mk('cuttlefish_giant', 'Mątwa olbrzymia', '🦑', 'Mątwa olbrzymia potrafi błyskawicznie zmieniać kolory skóry, żeby "rozmawiać" z innymi mątwami.', { water: 1, ocean: 1, pred: 1, big_d: -1 }),
  mk('nudibranch_rainbow', 'Nagosk tęczowy', '🐌', 'Nagosk tęczowy zjada parzącego stwora morskiego, a potem używa jego komórek paraliżujących jako własnej broni.', { water: 1, ocean: 1, small_c: 1 }),
  mk('giant_isopod', 'Stonóg olbrzymi', '🦗', 'Stonóg olbrzymi z głębin wygląda jak wielka stonoga — i potrafi nie jeść nawet kilka lat.', { shell: 1, water: 1, ocean: 1, nocturnal: 1, small_c: -1, legs: 1 }),
  mk('sand_dollar', 'Jeżowiec piaskowy', '⭐', 'Jeżowiec piaskowy wygląda jak okrągła moneta na plaży — to bezgłowe stworzonko mórz.', { water: 1, ocean: 1, small_c: 1 }),
  mk('feather_star', 'Liliowiec pierzasty', '⭐', 'Liliowiec wygląda jak pióro tańczące pod wodą — pływa, ale woli "chodzić" po dnie.', { water: 1, ocean: 1, small_c: 1 }),
  mk('comb_jelly', 'Żebropław', '🪼', 'Żebropław świeci tęczowo, gdy płynie — światło załamuje się na rzęskach.', { water: 1, ocean: 1, small_c: 1, nocturnal: -1 }),
  mk('sea_pig', 'Strzykwa świnka', '🐷', 'Strzykwa świnka chodzi po dnie oceanu kilka tysięcy metrów pod wodą — wygląda jak różowa świnka.', { water: 1, ocean: 1, small_c: 1 }),
];

/**
 * Expedition tags — przypisanie zwierząt do wypraw (biomy/regiony).
 * Multi-tag dozwolone (np. lis = polski las + nocny las).
 * Zwierzęta bez wpisu mają puste tagi i nie pojawią się w żadnej wyprawie.
 */
const TAGS: Record<string, string[]> = {
  // DOMOWI
  dog: ['home_pets'],
  cat: ['home_pets'],
  rabbit: ['home_pets'],
  hamster: ['home_pets'],
  guinea_pig: ['home_pets'],
  rat: ['home_pets'],
  ferret: ['home_pets'],
  mouse: ['home_pets', 'polish_forest'],
  canary: ['home_pets'],
  budgerigar: ['home_pets'],
  cockatoo: ['home_pets'],
  parakeet: ['home_pets'],
  gecko: ['home_pets'],

  // FARMA
  cow: ['farm'],
  horse: ['farm'],
  sheep: ['farm'],
  goat: ['farm'],
  pig: ['farm'],
  donkey: ['farm'],
  chicken: ['farm'],
  rooster: ['farm'],
  duck: ['farm'],
  goose: ['farm'],
  alpaca: ['farm'],
  llama: ['farm'],
  mule: ['farm'],
  turkey: ['farm'],
  guinea_fowl: ['farm'],
  yak: ['farm', 'mountain'],

  // POLSKI LAS
  wolf: ['polish_forest', 'night_forest', 'mountain'],
  fox: ['polish_forest', 'night_forest'],
  deer: ['polish_forest'],
  roe_deer: ['polish_forest'],
  wild_boar: ['polish_forest'],
  brown_bear: ['polish_forest', 'mountain'],
  lynx: ['polish_forest', 'night_forest', 'mountain'],
  badger: ['polish_forest', 'night_forest'],
  marten: ['polish_forest', 'night_forest'],
  elk: ['polish_forest'],
  bison: ['polish_forest'],
  beaver: ['polish_forest'],
  otter: ['polish_forest'],
  hedgehog: ['polish_forest', 'night_forest'],
  squirrel: ['polish_forest'],
  stoat: ['polish_forest', 'night_forest'],
  weasel: ['polish_forest', 'night_forest'],
  field_mouse: ['polish_forest', 'night_forest'],
  bat: ['polish_forest', 'night_forest'],
  mole: ['polish_forest'],
  shrew: ['polish_forest'],
  dormouse: ['polish_forest', 'night_forest'],
  hare: ['polish_forest'],
  // ptaki polskie
  woodpecker: ['polish_forest'],
  owl: ['polish_forest', 'night_forest'],
  eagle_owl: ['polish_forest', 'night_forest'],
  jay: ['polish_forest'],
  tit: ['polish_forest'],
  raven: ['polish_forest'],
  magpie: ['polish_forest'],
  blackbird: ['polish_forest'],
  nightingale: ['polish_forest'],
  hoopoe: ['polish_forest'],
  great_tit: ['polish_forest'],
  cuckoo: ['polish_forest'],
  swallow: ['polish_forest'],
  swan: ['polish_forest'],
  stork: ['polish_forest'],
  heron: ['polish_forest'],
  pigeon: ['polish_forest'],
  sparrow: ['polish_forest'],
  starling: ['polish_forest'],
  lark: ['polish_forest'],
  white_eagle: ['polish_forest', 'mountain'],
  buzzard: ['polish_forest', 'mountain'],
  osprey: ['polish_forest'],
  sparrowhawk: ['polish_forest'],
  hobby: ['polish_forest'],
  bullfinch: ['polish_forest'],
  finch: ['polish_forest'],
  goldfinch: ['polish_forest'],
  thrush: ['polish_forest'],
  jackdaw: ['polish_forest'],
  crow: ['polish_forest'],
  mazurek: ['polish_forest'],
  partridge: ['polish_forest'],
  pheasant: ['polish_forest'],
  mallard: ['polish_forest'],
  grebe: ['polish_forest'],
  // polskie inne
  viper: ['polish_forest'],
  grass_snake: ['polish_forest'],
  slowworm: ['polish_forest'],
  fire_salamander: ['polish_forest'],
  frog: ['polish_forest'],
  toad: ['polish_forest'],
  newt: ['polish_forest'],
  salamander: ['polish_forest'],
  // polskie ryby (raczej rzeki/jeziora niż ocean)
  carp: [],
  pike: [],
  catfish: [],
  eel: [],
  salmon: [],
  trout: ['mountain'],
  tench: [],
  perch: [],
  zander: [],
  roach: [],
  catfish_polish: [],
  bream: [],
  chub: [],
  crucian: [],
  burbot: [],

  // SAWANNA / AFRYKA
  lion: ['savanna'],
  elephant: ['savanna'],
  giraffe: ['savanna'],
  zebra: ['savanna'],
  leopard: ['savanna'],
  cheetah: ['savanna'],
  hippo: ['savanna'],
  rhino: ['savanna'],
  antelope: ['savanna'],
  gnu: ['savanna'],
  hyena: ['savanna', 'night_forest'],
  jackal: ['savanna'],
  meerkat: ['savanna'],
  gazelle: ['savanna'],
  buffalo: ['savanna'],
  warthog: ['savanna'],
  fennec: ['savanna'],
  mongoose: ['savanna'],
  dik_dik: ['savanna'],
  impala: ['savanna'],
  kudu: ['savanna'],
  eland: ['savanna'],
  oryx: ['savanna'],
  springbok: ['savanna'],
  african_wild_dog: ['savanna'],
  aardvark: ['savanna', 'night_forest'],
  rock_hyrax: ['savanna'],
  serval: ['savanna'],
  aardwolf: ['savanna', 'night_forest'],
  ostrich: ['savanna'],
  flamingo: ['savanna'],
  vulture: ['savanna'],
  marabou: ['savanna'],
  ibis: ['savanna'],
  // afryka rzeki
  crocodile: ['savanna', 'jungle'],
  saltwater_croc: ['jungle'],
  gharial: ['jungle'],

  // OCEAN
  shark: ['ocean'],
  whale: ['ocean'],
  dolphin: ['ocean'],
  orca: ['ocean'],
  manatee: ['ocean'],
  sperm_whale: ['ocean'],
  porpoise: ['ocean'],
  seal: ['ocean', 'arctic'],
  sea_turtle: ['ocean'],
  octopus: ['ocean'],
  squid: ['ocean'],
  cuttlefish: ['ocean'],
  jellyfish: ['ocean'],
  starfish: ['ocean'],
  seahorse: ['ocean'],
  seahorse_dwarf: ['ocean'],
  manta: ['ocean'],
  tuna: ['ocean'],
  mackerel: ['ocean'],
  herring: ['ocean'],
  cod: ['ocean'],
  swordfish: ['ocean'],
  barracuda: ['ocean'],
  clownfish: ['ocean'],
  moray: ['ocean'],
  flounder: ['ocean'],
  anchovy: ['ocean'],
  hammerhead: ['ocean'],
  whale_shark: ['ocean'],
  marlin: ['ocean'],
  moonfish: ['ocean'],
  sardine: ['ocean'],
  halibut: ['ocean'],
  sturgeon: ['ocean'],
  coral: ['ocean'],
  crab: ['ocean'],
  shrimp: ['ocean'],
  lobster: ['ocean'],
  langouste: ['ocean'],
  hermit_crab: ['ocean'],
  coconut_crab: ['ocean'],
  krill: ['ocean'],
  barnacle: ['ocean'],
  clam: ['ocean'],
  oyster: ['ocean'],
  sea_urchin: ['ocean'],
  sea_anemone: ['ocean'],
  crayfish: [],
  pelican: ['ocean'],

  // DŻUNGLA / AZJA / AMERYKA TROPIK
  tiger: ['jungle', 'mountain'],
  panda: ['mountain'],
  orangutan: ['jungle'],
  jaguar: ['jungle'],
  sloth: ['jungle'],
  anteater: ['jungle'],
  capybara: ['jungle'],
  gibbon: ['jungle'],
  macaque: ['jungle'],
  ocelot: ['jungle', 'night_forest'],
  chimpanzee: ['jungle'],
  gorilla: ['jungle'],
  mandrill: ['jungle'],
  lemur: ['jungle'],
  langur: ['jungle'],
  japanese_macaque: ['mountain'],
  binturong: ['jungle'],
  asian_elephant: ['jungle'],
  toucan: ['jungle'],
  parrot: ['jungle', 'home_pets'],
  macaw: ['jungle'],
  python: ['jungle'],
  anaconda: ['jungle'],
  basilisk: ['jungle'],
  boa: ['jungle'],
  poison_frog: ['jungle'],
  tree_frog: ['jungle'],
  iguana: ['jungle'],
  chameleon: ['jungle'],
  piranha: ['jungle'],
  eel_electric: ['jungle'],
  caecilian: ['jungle'],
  bullfrog: [],
  sun_bear: ['jungle'],
  moon_bear: ['jungle', 'mountain'],
  sloth_bear: ['jungle'],
  bird_eater: ['jungle'],
  // wybrane gady tropikalne
  cobra: ['jungle'],
  komodo: [],

  // ARKTYKA
  polar_bear: ['arctic'],
  walrus: ['arctic'],
  arctic_fox: ['arctic'],
  reindeer: ['arctic'],
  musk_ox: ['arctic'],
  lemming: ['arctic'],
  snowy_owl: ['arctic'],
  beluga: ['arctic', 'ocean'],
  bowhead: ['arctic', 'ocean'],
  bearded_seal: ['arctic', 'ocean'],
  puffin: ['arctic'],
  arctic_tern: ['arctic'],
  narwhal: ['arctic', 'ocean'],
  mountain_hare: ['arctic', 'mountain'],
  penguin_emperor: ['arctic'],
  penguin_little: ['ocean', 'australia'],

  // AUSTRALIA
  kangaroo: ['australia'],
  koala: ['australia'],
  platypus: ['australia'],
  echidna: ['australia'],
  tasmanian_devil: ['australia', 'night_forest'],
  wombat: ['australia'],
  quokka: ['australia'],
  cassowary: ['australia'],
  emu: ['australia'],

  // NOCNY LAS — dodatkowe
  raccoon: ['night_forest'],
  opossum: ['night_forest'],
  scorpion: ['night_forest'],
  cockroach: ['night_forest'],
  cockroach_asian: ['night_forest'],
  firefly: ['night_forest'],
  moth: ['night_forest'],
  silk_moth: [],
  atlas_moth: ['night_forest'],
  porcupine: ['night_forest'],
  black_widow: ['night_forest'],
  tarantula: ['jungle', 'night_forest'],

  // GÓRY — dodatkowe
  chamois: ['mountain'],
  snow_leopard: ['mountain'],
  eagle: ['mountain'],
  falcon: ['mountain'],
  condor: ['mountain'],
  grizzly: ['mountain'],
  bison_american: ['mountain'],

  // pozostałe owady (popularne → polski las)
  butterfly: ['polish_forest'],
  ladybug: ['polish_forest'],
  ant: ['polish_forest'],
  bee: ['polish_forest', 'farm'],
  wasp: ['polish_forest'],
  bumblebee: ['polish_forest'],
  hornet: ['polish_forest'],
  mosquito: ['polish_forest'],
  fly: ['polish_forest'],
  cricket: ['polish_forest'],
  cricket_house: ['home_pets'],
  grasshopper: ['polish_forest'],
  dragonfly: ['polish_forest'],
  mayfly: ['polish_forest'],
  caterpillar: ['polish_forest'],
  beetle: ['polish_forest'],
  stag_beetle: ['polish_forest'],
  spider: ['polish_forest', 'night_forest'],
  harvestman: ['polish_forest'],
  mite: [],
  flea: [],
  louse: [],
  earthworm: ['polish_forest'],
  centipede: ['polish_forest'],
  snail: ['polish_forest'],
  slug: ['polish_forest'],
  mantis: ['polish_forest'],
  stick_insect: ['jungle'],
  termite: ['savanna', 'jungle'],
  locust: ['savanna'],
  tick: [],
  axolotl: ['home_pets'],

  // ssaki Polski górskie i inne
  coyote: ['mountain'],
  puma: ['mountain'],
  red_panda: ['mountain'],

  // === BATCH 3 — Europe/Polska extras ===
  wildcat: ['polish_forest', 'night_forest'],
  vole: ['polish_forest', 'night_forest'],
  water_shrew: ['polish_forest'],
  polecat: ['polish_forest', 'night_forest'],
  sable: ['night_forest'],
  european_mink: [],
  musk_rat: ['polish_forest'],
  european_hamster: ['polish_forest'],
  marmot: ['mountain'],
  ibex: ['mountain'],

  // === BATCH 3 — Africa ===
  okapi: ['jungle'],
  pangolin: ['savanna', 'jungle'],
  ratel: ['savanna'],
  sitatunga: ['savanna'],
  bongo: ['jungle'],
  caracal: ['savanna'],
  aye_aye: ['jungle', 'night_forest'],
  genet: ['savanna', 'night_forest'],
  zebra_grevyi: ['savanna'],
  addax: ['savanna'],

  // === BATCH 3 — Asia ===
  tapir: ['jungle'],
  proboscis_monkey: ['jungle'],
  clouded_leopard: ['jungle', 'mountain'],
  serow: ['mountain'],
  binturong_indo: ['jungle'],
  takin: ['mountain'],
  dhole: ['jungle', 'mountain'],
  musk_deer: ['mountain'],
  saiga: [],

  // === BATCH 3 — South America ===
  jaguarundi: ['jungle'],
  maned_wolf: [],
  coati: ['jungle'],
  paca: ['jungle'],
  tamarin: ['jungle'],
  marmoset: ['jungle'],
  vicuna: ['mountain'],
  guanaco: ['mountain'],
  giant_otter: ['jungle'],
  pampas_deer: [],

  // === BATCH 3 — Polar ===
  caribou: ['arctic'],
  arctic_wolf: ['arctic'],
  snowshoe_hare: ['arctic'],
  wolverine: ['arctic', 'mountain'],
  orca_killer: ['ocean', 'arctic'],

  // === BATCH 3 — Marine ===
  blue_whale_pygmy: ['ocean'],
  humpback: ['ocean'],
  right_whale: ['ocean'],
  gray_whale: ['ocean'],
  dugong: ['ocean'],
  sea_lion: ['ocean'],
  elephant_seal: ['ocean', 'arctic'],
  leopard_seal: ['ocean', 'arctic'],

  // === BATCH 3 — Polish birds ===
  crossbill: ['polish_forest'],
  siskin: ['polish_forest'],
  goldcrest: ['polish_forest'],
  waxwing: ['polish_forest'],
  kingfisher: ['polish_forest'],
  black_woodpecker: ['polish_forest'],
  eagle_owl_white: ['polish_forest', 'night_forest'],
  hawfinch: ['polish_forest'],
  serin: ['polish_forest'],
  grebe_great: ['polish_forest'],

  // === BATCH 3 — Exotic birds ===
  quetzal: ['jungle'],
  hornbill: ['jungle'],
  bird_of_paradise: ['jungle'],
  toucan_keel: ['jungle'],
  shoebill: ['jungle'],
  secretary_bird: ['savanna'],
  cassowary_dwarf: ['australia'],
  kakapo: ['australia'],
  rockhopper_penguin: ['arctic'],
  king_penguin: ['arctic'],

  // === BATCH 3 — Fish ===
  angler_fish: ['ocean'],
  parrotfish: ['ocean'],
  wrasse: ['ocean'],
  lionfish: ['ocean'],
  stonefish: ['ocean'],
  blobfish: ['ocean'],
  pufferfish: ['ocean'],
  porcupinefish: ['ocean'],
  discus: ['jungle'],
  arowana: ['jungle'],
  koi: ['home_pets'],
  mola_giant: ['ocean'],

  // === BATCH 3 — Reptiles & amphibians ===
  king_cobra: ['jungle'],
  mamba: ['savanna'],
  thorny_devil: ['australia'],
  frilled_lizard: ['australia'],
  matamata: ['jungle'],
  softshell_turtle: ['jungle'],
  alligator_snapping: [],
  glass_frog: ['jungle'],
  mantella: ['jungle'],
  hellbender: [],

  // === BATCH 3 — Insects / arachnids ===
  rhinoceros_beetle: ['jungle'],
  hercules_beetle: ['jungle'],
  praying_mantis_giant: ['jungle'],
  jewel_beetle: ['jungle'],
  walking_stick: ['jungle'],
  atlas_butterfly: ['jungle'],
  blue_morpho: ['jungle'],
  monarch: [],
  cicada: ['polish_forest'],
  treehopper: ['jungle'],
  camel_spider: ['savanna'],
  whip_scorpion: ['jungle'],
  millipede: ['polish_forest'],
  mantis_shrimp: ['ocean'],
  horseshoe_crab: ['ocean'],

  // === BATCH 3 — Mollusks / other ===
  nautilus: ['ocean'],
  giant_squid: ['ocean'],
  vampire_squid: ['ocean'],
  cone_snail: ['ocean'],
  sea_cucumber: ['ocean'],
  sea_slug: ['ocean'],
  mantis_shrimp_peacock: ['ocean'],
  flatworm: [],

  // === BATCH 3 — Mythical (TYLKO mythical, NIE pojawiają się w innych wyprawach) ===
  trex: ['mythical'],
  brachiosaurus: ['mythical'],
  velociraptor: ['mythical'],
  triceratops: ['mythical'],
  stegosaurus: ['mythical'],
  mammoth: ['mythical'],
  sabretooth: ['mythical'],
  dragon: ['mythical'],
  unicorn: ['mythical'],
  phoenix: ['mythical'],
  mermaid: ['mythical'],
  kraken: ['mythical'],
  yeti: ['mythical'],
  bigfoot: ['mythical'],
  nessie: ['mythical'],
  sphinx: ['mythical'],
  griffin: ['mythical'],

  // === BATCH 3B — dopełniacz do 500 ===
  mole_eu: ['polish_forest'],
  dormouse_garden: ['polish_forest', 'night_forest'],
  chipmunk: [],
  flying_squirrel: ['night_forest'],
  aardwolf_kenya: ['savanna', 'night_forest'],
  honey_badger: ['savanna', 'night_forest'],
  snow_fox: ['arctic'],
  snub_nosed_monkey: ['mountain'],
  reindeer_svalbard: ['arctic'],
  gerbil: ['home_pets'],
  chinchilla: ['home_pets'],
  skunk: ['night_forest'],
  aardvark_pig: ['jungle'],
  saola: ['jungle'],
  pichi: [],
  bald_eagle: ['mountain'],
  atlantic_puffin: ['ocean', 'arctic'],
  kestrel: ['polish_forest'],
  hoatzin: ['jungle'],
  lyrebird: ['australia'],
  booby: ['ocean'],
  moonjellyfish: ['ocean'],
  octopus_blue_ring: ['ocean', 'australia'],
  crab_japanese_spider: ['ocean'],
  green_anaconda: ['jungle'],
  reticulated_python: ['jungle'],
  komodo_juvenile: ['jungle'],
  giant_salamander: ['mountain'],
  axolotl_pink: ['polish_forest'],
  giant_weta: ['australia'],
  goliath_beetle: ['jungle'],
  peacock_butterfly: ['polish_forest'],
  // rest unstated → no tag (won't appear in any expedition)
};

/**
 * Tagi tematyczne — śpiewające ptaki, małpy, wielkie koty, olbrzymy, słodka woda.
 * Tagi biomów są w TAGS powyżej; tu dorzucamy specyficzne grupy.
 */
const SPECIAL_TAGS: Record<string, string[]> = {
  // SONGBIRDS — ptaki śpiewające
  blackbird: ['songbirds'],
  nightingale: ['songbirds'],
  thrush: ['songbirds'],
  tit: ['songbirds'],
  great_tit: ['songbirds'],
  finch: ['songbirds'],
  bullfinch: ['songbirds'],
  goldfinch: ['songbirds'],
  canary: ['songbirds'],
  mazurek: ['songbirds'],
  sparrow: ['songbirds'],
  lark: ['songbirds'],
  starling: ['songbirds'],
  swallow: ['songbirds'],

  // MONKEYS — naczelne
  chimpanzee: ['monkeys'],
  gorilla: ['monkeys'],
  orangutan: ['monkeys'],
  mandrill: ['monkeys'],
  lemur: ['monkeys'],
  macaque: ['monkeys'],
  japanese_macaque: ['monkeys'],
  langur: ['monkeys'],
  gibbon: ['monkeys'],

  // BIG CATS — kotowate
  lion: ['big_cats'],
  tiger: ['big_cats'],
  leopard: ['big_cats'],
  jaguar: ['big_cats'],
  cheetah: ['big_cats'],
  snow_leopard: ['big_cats'],
  puma: ['big_cats'],
  ocelot: ['big_cats'],
  lynx: ['big_cats'],
  serval: ['big_cats'],
  siberian_tiger: ['big_cats'],

  // GIANTS — wielkie zwierzęta
  elephant: ['giants'],
  asian_elephant: ['giants'],
  hippo: ['giants'],
  rhino: ['giants'],
  giraffe: ['giants'],
  whale: ['giants'],
  orca: ['giants'],
  sperm_whale: ['giants'],
  bowhead: ['giants'],
  whale_shark: ['giants'],
  polar_bear: ['giants'],
  brown_bear: ['giants'],
  grizzly: ['giants'],
  bison: ['giants'],
  bison_american: ['giants'],

  // FRESHWATER — słodka woda
  carp: ['freshwater'],
  pike: ['freshwater'],
  catfish: ['freshwater'],
  eel: ['freshwater'],
  salmon: ['freshwater'],
  trout: ['freshwater'],
  tench: ['freshwater'],
  perch: ['freshwater'],
  zander: ['freshwater'],
  roach: ['freshwater'],
  catfish_polish: ['freshwater'],
  bream: ['freshwater'],
  chub: ['freshwater'],
  crucian: ['freshwater'],
  burbot: ['freshwater'],
  crayfish: ['freshwater'],

  // === BATCH 3 — songbirds extras ===
  crossbill: ['songbirds'],
  siskin: ['songbirds'],
  goldcrest: ['songbirds'],
  waxwing: ['songbirds'],
  hawfinch: ['songbirds'],
  serin: ['songbirds'],

  // === BATCH 3 — big_cats extras ===
  wildcat: ['big_cats'],
  caracal: ['big_cats'],
  clouded_leopard: ['big_cats'],
  jaguarundi: ['big_cats'],

  // === BATCH 3 — monkeys extras ===
  proboscis_monkey: ['monkeys'],
  aye_aye: ['monkeys'],
  snub_nosed_monkey: ['monkeys'],
  tamarin: ['monkeys'],
  marmoset: ['monkeys'],

  // === BATCH 3 — giants extras ===
  blue_whale_pygmy: ['giants'],
  humpback: ['giants'],
  right_whale: ['giants'],
  gray_whale: ['giants'],
  orca_killer: ['giants'],
  elephant_seal: ['giants'],
  dugong: ['giants'],
  reticulated_python: ['giants'],
  crab_japanese_spider: ['giants'],
  giant_squid: ['giants'],
  giant_salamander: ['giants'],

  // === BATCH 3 — freshwater extras ===
  axolotl_pink: ['freshwater'],

  // === Poprawki: słodkie wody Polski, koty, ptaki śpiewające ===
  asp: ['freshwater'],
  rudd: ['freshwater'],
  grayling: ['freshwater'],
  brook_trout: ['freshwater'],
  smelt: ['freshwater'],
  otter: ['freshwater'],
  beaver: ['freshwater'],
  musk_rat: ['freshwater'],
  water_shrew: ['freshwater'],
  kingfisher: ['freshwater'],
  grebe_great: ['freshwater'],
  cormorant: ['freshwater'],
  grass_snake: ['freshwater'],
  fire_belly_toad: ['freshwater'],
  water_strider: ['freshwater'],
  damselfly: ['freshwater'],
  fishing_cat: ['big_cats'],
  pallas_cat: ['big_cats'],
  sand_cat: ['big_cats'],
  margay: ['big_cats'],
  robin_european: ['songbirds'],
  nuthatch: ['songbirds'],
  wagtail: ['songbirds'],
  mockingbird: ['songbirds'],
  indri: ['monkeys'],
  sifaka: ['monkeys'],
  galago: ['monkeys'],
  tarsier: ['monkeys'],
};

/** Auto-tagi wyliczane z atrybutów (predators, insects, reptiles, amphibians, herbivores). */
function autoTagsFor(animal: Animal): string[] {
  const out: string[] = [];
  const a = animal.attributes;
  if (a.is_predator === true) out.push('predators');
  if (a.is_insect === true) out.push('insects');
  if (a.is_reptile === true) out.push('reptiles');
  if (a.is_amphibian === true) out.push('amphibians');
  // herbivores: ssaki/torbacze co głównie jedzą rośliny
  if (
    a.eats_plants === true &&
    (a.is_mammal === true || a.is_marsupial === true)
  ) {
    out.push('herbivores');
  }
  return out;
}

function applyTags(animals: Animal[]): Animal[] {
  return animals.map((a) => {
    const explicit = TAGS[a.id] ?? [];
    const special = SPECIAL_TAGS[a.id] ?? [];
    const auto = autoTagsFor(a);
    const merged = Array.from(new Set([...explicit, ...special, ...auto]));
    if (merged.length === 0) return a;
    return { ...a, expedition_tags: merged };
  });
}

export const ANIMALS: Animal[] = applyTags(RAW_ANIMALS);

export const ANIMALS_BY_ID: Record<string, Animal> = Object.fromEntries(
  ANIMALS.map((a) => [a.id, a]),
);
