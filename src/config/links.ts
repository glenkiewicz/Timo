/**
 * Strony prawne i pomoc (marketing/landing → build-landing.py → hosting).
 * Pusty adres = linki ukryte w aplikacji. Apple wymaga polityki prywatności
 * dostępnej w aplikacji i linków do regulaminu oraz prywatności na ekranie
 * subskrypcji — przed wysłaniem do recenzji ustaw tu adres strony.
 */
export const SITE_URL: string = '';

function page(file: string): string | null {
  return SITE_URL ? `${SITE_URL.replace(/\/$/, '')}/${file}` : null;
}

export const LINKS = {
  privacy: page('prywatnosc.html'),
  terms: page('regulamin.html'),
  support: page('pomoc.html'),
};
