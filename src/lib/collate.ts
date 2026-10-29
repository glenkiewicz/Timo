/**
 * Porównanie po polsku (ą po a, ł po l…) — jeden wspólny `Intl.Collator`.
 *
 * `a.localeCompare(b, 'pl')` na Androidzie (Hermes) przy każdym wywołaniu
 * buduje reguły języka od nowa: posortowanie 715 zwierzęt przy starcie
 * trwało na Galaxy A16 4,7 s i tyle dłużej wisiał splash.
 */
const collator = new Intl.Collator('pl');

export const comparePl = (a: string, b: string): number => collator.compare(a, b);
