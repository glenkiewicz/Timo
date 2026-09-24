import { ANIMALS } from '@/data/animals';
import type { Animal } from '@/types/game';

/**
 * Podział kolekcji na gabloty — po klasie zwierzęcia.
 *
 * Wyprawy odpadły jako oś kolekcji: rostery wypraw guided obejmują tylko 244
 * z 715 zwierząt, a wszystkie rostery razem 496. Dwie trzecie zbioru nie
 * miałoby gdzie stanąć. Klasa pokrywa 624 z 715, a reszta — głównie
 * bezkręgowce inne niż owady — wpada do „Inne" przez wykluczenie, więc nikt
 * nie wypada poza pokój.
 *
 * Kolejność jest od najliczniejszej grupy, żeby pierwsza gablota była tą, do
 * której dziecko zajrzy najczęściej.
 */
export type AnimalGroup = {
  id: string;
  label: string;
  /** null = wszystko, co nie pasuje do żadnej wcześniejszej grupy. */
  attribute: 'is_mammal' | 'is_bird' | 'is_fish' | 'is_reptile' | 'is_insect' | 'is_amphibian' | null;
};

export const ANIMAL_GROUPS: AnimalGroup[] = [
  { id: 'mammals', label: 'Ssaki', attribute: 'is_mammal' },
  { id: 'birds', label: 'Ptaki', attribute: 'is_bird' },
  { id: 'fish', label: 'Ryby', attribute: 'is_fish' },
  { id: 'reptiles', label: 'Gady', attribute: 'is_reptile' },
  { id: 'insects', label: 'Owady', attribute: 'is_insect' },
  { id: 'amphibians', label: 'Płazy', attribute: 'is_amphibian' },
  { id: 'other', label: 'Inne', attribute: null },
];

/**
 * Zwierzęta każdej grupy, policzone raz przy starcie modułu.
 *
 * Pierwsze dopasowanie wygrywa, więc zwierzę z kilkoma zaznaczonymi klasami
 * (w danych się zdarza) trafia do jednej gabloty, a nie do kilku — inaczej
 * liczniki nie sumowałyby się do 715.
 */
export const GROUPED: Record<string, Animal[]> = (() => {
  const out: Record<string, Animal[]> = {};
  for (const g of ANIMAL_GROUPS) out[g.id] = [];

  for (const animal of ANIMALS) {
    const hit = ANIMAL_GROUPS.find(
      (g) => g.attribute !== null && animal.attributes[g.attribute] === true
    );
    out[(hit ?? ANIMAL_GROUPS[ANIMAL_GROUPS.length - 1]).id].push(animal);
  }

  for (const g of ANIMAL_GROUPS) {
    out[g.id].sort((a, b) => a.name_pl.localeCompare(b.name_pl, 'pl'));
  }
  return out;
})();

export function groupById(id: string): AnimalGroup | undefined {
  return ANIMAL_GROUPS.find((g) => g.id === id);
}
