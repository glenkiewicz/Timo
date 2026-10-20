# Timo w social mediach — zasady marki

Źródło prawdy dla każdego, kto pisze lub składa posty (człowiek albo agent).
Przebieg tygodnia opisuje `.claude/skills/timo-content-week/SKILL.md`.

## Do kogo mówimy

**Do rodziców dzieci w wieku przedszkolnym i wczesnoszkolnym** — oraz do
nauczycieli przedszkolnych. Dziecko jest bohaterem treści, nigdy adresatem: nie
ma konta, a aplikację instaluje dorosły.

Rodzic, do którego piszemy, szuka czegoś, co zajmie dziecko mądrze, i ma wyrzuty
sumienia z powodu ekranów. Nie obiecujemy mu geniusza. Obiecujemy kwadrans
zabawy, po której dziecko wie coś nowego o zwierzętach i chce zgadywać dalej —
także bez telefonu.

> Do potwierdzenia przez właściciela: dokładny przedział wieku (w repo jest
> tylko „przedszkolak”). Do tego czasu piszemy „dla dzieci”, bez liczb.

## Co mówimy o grze

- Dziecko myśli o zwierzęciu, lisek Timo zgaduje je, zadając pytania.
- 715 zwierząt, każde z własną ilustracją i kartą z ciekawostkami.
- Timo mówi głosem — dziecko nie musi umieć czytać.
- Konto zakłada rodzic; dziecko niczego nie wpisuje, w rankingu nie ma imion.
- Premiera: **wkrótce, bez daty**. Nie podajemy terminu, dopóki nie ma go w `marketing/calendar.md`.

Nie piszemy o niczym, czego w aplikacji nie ma. W razie wątpliwości — sprawdź
w `docs/game-design.md`.

## Ton

Ciepły, konkretny, z lekkim humorem. Jak znajomy rodzic, który coś poleca —
nie jak reklama.

| Tak | Nie |
| --- | --- |
| „Jeż ma do 7000 kolców. Twoje dziecko już to wie?” | „Rewolucyjna aplikacja edukacyjna!” |
| „Zabawa na 10 minut w kolejce do lekarza.” | „Rozwiń potencjał swojego dziecka!” |
| krótkie zdania, jedna myśl na post | trzy wykrzykniki, WERSALIKI, ściana emoji |

- Forma: „ty” do rodzica. Bez zakładania płci dziecka ani rodzica („Twoje
  dziecko”, nie „Twój synek”; „udało się zgadnąć?”, nie „zgadłeś?”).
- Timo mówi o sobie w rodzaju męskim; jego stałe gagi: dumny nos, gubiona lupa,
  jagody i kanapki z serem, strach przed wodą, puszysty ogon.
- Emoji: najwyżej 2 w podpisie. Na grafikach — żadnych.
- Nie straszymy ekranami i nie oceniamy rodziców.

## Zasady twarde

1. **Fakty o zwierzętach tylko z danych gry** (`marketing/.cache/data.json`,
   czyli `src/data/animals.ts` i `animal-details.ts`). Nic z pamięci, nic
   „powszechnie wiadomego”. Ciekawostka cytowana dosłownie albo skracana bez
   zmiany liczb.
2. **Żadnych wizerunków dzieci** — ani generowanych, ani zdjęć.
3. **Timo zawsze ten sam**: gotowe pętle z `assets/timo/character/` albo
   generacja z referencji `timo-anchor-front.png`. Krzywy lisek = post do kosza.
4. **Treść z generacji AI jest oznaczana** etykietą platformy (TikTok, Instagram).
   Montaż z gotowych plików gry etykiety nie wymaga.
5. **Bez porównań z konkurencją po nazwie** i bez obietnic edukacyjnych,
   których nie da się udowodnić.
6. **Nic nie wychodzi bez akceptacji właściciela** — patrz status `approved`
   w `plan.json`.

## Wygląd

Paleta i czcionki są w `scripts/marketing/kit.py` (lustro `src/theme/ui.ts`):
lisi pomarańcz na nagłówki, zielony panel na hasła, biel na treść, tła z gry.
Nowe szablony budujemy z tych samych klocków.

Wideo 1080×1920, treść w bezpiecznej strefie (200–1540 px w pionie, do 940 px
w poziomie). Karuzele 1080×1350.

## Wezwanie do działania

Jedno, zawsze to samo, na końcu podpisu:

> Timo — gra, w której lisek zgaduje zwierzę. Premiera wkrótce, link do zapisów w bio.

## Hasztagi

3–5 na post, zawsze na końcu. Stałe: `#timogra` `#zabawyzdzieckiem`.
Do wyboru zależnie od tematu: `#ciekawostkidladzieci` `#zwierzetadladzieci`
`#naukaprzezzabawe` `#rodzicielstwo` `#przedszkolak` `#zagadkidladzieci`
`#zabawybezekranu`.

Na X bez hasztagów (dziennik twórcy) — najwyżej `#buildinpublic`.

## X — dziennik twórcy

Inny głos niż reszta: pisze Grzegorz, w pierwszej osobie, o budowaniu gry.
Konkret zamiast autopromocji: liczba, zrzut ekranu, decyzja i jej powód, błąd
i jak został naprawiony. Tematy bierzemy z historii commitów i `docs/`.
Jeden post = jedna rzecz. Bez wątków na 12 części.
