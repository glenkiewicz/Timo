/**
 * Strony prawne i pomoc na zgadujztimo.pl.
 * Pusty adres = linki ukryte w aplikacji. Apple wymaga polityki prywatności
 * dostępnej w aplikacji i linków do regulaminu oraz prywatności na ekranie
 * subskrypcji — przed wysłaniem do recenzji ustaw tu adres strony.
 */
export const SITE_URL: string = 'https://zgadujztimo.pl';

function page(file: string): string | null {
  return SITE_URL ? `${SITE_URL.replace(/\/$/, '')}/${file}` : null;
}

export const LINKS = {
  privacy: page('polityka-prywatnosci'),
  terms: page('regulamin'),
  support: page('pomoc'),
};
