/**
 * Tytuł odkrywcy — mała rzecz, która zauważalnie zmienia się gdy
 * dziecko awansuje. Łatwe do dorzucania kolejnych progów.
 */
type TitleStep = { level: number; title: string };

const STEPS: TitleStep[] = [
  { level: 1, title: 'Mały tropiciel' },
  { level: 3, title: 'Odkrywca' },
  { level: 5, title: 'Detektyw' },
  { level: 8, title: 'Mistrz polany' },
  { level: 12, title: 'Lisi mędrzec' },
  { level: 17, title: 'Legenda lasu' },
  { level: 25, title: 'Profesor Timo' },
];

/** Zwraca tytuł najwyższy ≤ podanemu levelowi. */
export function titleFor(level: number): string {
  let current = STEPS[0].title;
  for (const step of STEPS) {
    if (step.level <= level) current = step.title;
    else break;
  }
  return current;
}
