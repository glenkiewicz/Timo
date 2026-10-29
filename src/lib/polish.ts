/** „1 zwierzę”, „3 zwierzęta”, „5 zwierząt”, „22 zwierzęta”. */
export function animalsWord(n: number): string {
  if (n === 1) return 'zwierzę';
  const tens = n % 100;
  const units = n % 10;
  if (units >= 2 && units <= 4 && (tens < 12 || tens > 14)) return 'zwierzęta';
  return 'zwierząt';
}
