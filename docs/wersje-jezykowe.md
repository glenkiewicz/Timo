# Wersje językowe Timo — plan

Stan na 30.10.2026. Plan, nie wdrożenie: zaczynamy po stabilnym wydaniu wersji
polskiej w obu sklepach.

## Założenie

Timo to gra **głosowa** dla dzieci 3–5 lat, które nie czytają. Wersja językowa
to pełny głos Timo w danym języku, nie same napisy. Angielska wersja dla
przedszkolaka w Niemczech jest dla niego niezrozumiała — każdy rynek dostaje
własny, kompletny język.

## Co jest do przetłumaczenia (stan kodu)

| Co | Ile | Uwagi |
|---|---|---|
| Kwestie Timo z głosem | 1 186 plików MP3 w aplikacji, ok. 37 MB | Gry słów i rymy pisać od nowa w danym języku (transkreacja), nie tłumaczyć |
| Treść gry: zwierzęta, opisy, pytania, wyprawy | ok. 30 tys. słów (`src/data/*`) | 715 nazw gatunków sprawdzić w danym języku |
| Napisy interfejsu | ok. 460 tekstów w ok. 60 plikach | Dziś wpisane na sztywno po polsku |
| Poza aplikacją | opisy w sklepach, zrzuty, regulamin, polityka prywatności, maile Supabase, strona | |

Silnik zgadywania opiera się na cechach niezależnych od języka — logika gry
się nie zmienia.

## Kolejność rynków

Danych o samych aplikacjach dla dzieci w podziale na kraje nie ma w źródłach
otwartych; poniżej dane pośrednie (wydatki w sklepach, indeks cen subskrypcji
w kategorii Edukacja względem USA — Adapty). Przed każdym językiem sprawdzić
popularność wyszukiwań (AppTweak / Sensor Tower).

| Kolejność | Język | Rynki | Dlaczego |
|---|---|---|---|
| 1 | Angielski | USA, Wielka Brytania, Kanada, Australia, Irlandia + domyślny wszędzie indziej | Największa pula (USA ok. 55 mld USD wydatków w aplikacjach w 2025), największa konkurencja |
| 2 | Niemiecki | Niemcy, Austria, Szwajcaria | Ceny Edukacji ok. 1,9× USA, rodzice płacą za edukację |
| 3 | Hiszpański | Hiszpania, Ameryka Łacińska, USA | Hiszpania ok. 2,3×, Ameryka Łacińska nisko (ok. 0,4×), duży zasięg |
| 4 | Francuski | Francja, Belgia, Szwajcaria, Kanada | Ok. 2,0× |
| później | włoski, holenderski | | Włochy ok. 2,3×, Holandia mała, zamożna |
| ostrożnie | portugalski (BR), ukraiński, czeski | | Zasięg lub bliskość języka, niska płatność |

USA: obowiązuje COPPA. Timo jest blisko zgodności (bez reklam i śledzenia) —
przejrzeć politykę prywatności przed wejściem.

## Rozmiar aplikacji

Dziś (Android arm64, po kompresji) ok. 165 MB; z tego głosy 36,6 MB,
przebrania liska (wideo) 23,4 MB, kod i biblioteki ok. 66 MB, zwierzęta 14,2 MB.

Progi sklepów: powyżej **200 MB** Android i iOS ostrzegają przy pobieraniu na
danych komórkowych (można pominąć, ale odstrasza). Twarde limity są daleko
(Google: moduł bazowy 200–500 MB wg wersji dokumentacji, więcej przez Play
Asset Delivery; Apple: ok. 4 GB).

Każdy język w aplikacji to +ok. 37 MB — jeden dodatkowy daje ok. 200 MB, dwa
i więcej wyraźnie ponad próg. Dlatego **głosy kolejnych języków jako paczki do
pobrania**, a teksty (poniżej 1 MB na język) w aplikacji.

## Paczki głosów — jak ładować

1. **Polski zostaje w aplikacji.** Dla Polski zero ładowania, działa bez sieci.
2. **Pobieranie w tle od pierwszej karty onboardingu.** Pierwsze uruchomienie
   i tak wymaga internetu (konto anonimowe); onboarding trwa 1–2 min — na
   zwykłym Wi-Fi/LTE paczka zdąży się pobrać.
3. **Dwie części paczki:**
   - startowa (ok. 3–5 MB): głos onboardingu, powitania w Menu, najczęstsze
     reakcje i pytania, nazwy zwierząt z darmowych wypraw;
   - reszta: w tle, gdy dziecko już gra.
4. **Ekran ładowania tylko przy wolnej sieci:** jeśli po onboardingu część
   startowa jeszcze się pobiera — ekran w stylu „Timo pakuje plecak”
   (`PackingLoader`) z paskiem postępu i „Timo uczy się nowych słów…”,
   a gdy się nie uda — „Spróbuj ponownie”.
5. **Brak nagrania w grze niczego nie blokuje** — dymek z tekstem i gra idzie
   dalej (`timoVoice.playOne` już dziś kończy się od razu przy braku pliku).

Technicznie:
- jedno archiwum na język i część (zamiast 1 186 pobrań), hosting na
  Cloudflare R2 razem z klipami przebrań (patrz audyt T-03), wersja
  w ścieżce jak w `outfit-webp.android.ts`;
- zapis w dokumentach aplikacji, numer wersji paczki — nowe kwestie to nowa
  paczka;
- zmiana języka: pobierz nową paczkę, usuń starą;
- pobieranie z postępem: `File.downloadFileAsync` / `DownloadTask`
  z expo-file-system, rozpakowanie — moduł zip (do wyboru przy wdrożeniu).

## Prace techniczne (przed pierwszym językiem)

1. **i18n interfejsu:** napisy do plików tłumaczeń, wykrywanie języka telefonu
   (`expo-localization`), wybór języka w strefie rodzica.
2. **Dane w podziale na języki:** `name_pl` → nazwy wg języka; kwestie Timo,
   pytania, wyprawy, opisy zwierząt per język; `voice-manifest` per język.
3. **Paczki głosów:** generowanie (`scripts/generate-timo-voices.ts` z modelem
   wielojęzycznym ElevenLabs), pakowanie, wysyłka na R2, pobieranie
   w aplikacji wg sekcji wyżej.
4. **Maile Supabase:** jeden zestaw szablonów na projekt — wersje językowe
   warunkami w szablonie po języku zapisanym przy koncie
   (`user_metadata.locale`).
5. **Sklepy:** opisy, słowa kluczowe, zrzuty ekranu, ceny per kraj (w Play
   Console ceny są netto — patrz doświadczenie z PLN), dokumenty prawne
   i strona w danym języku.

Szacunek: infrastruktura ok. 1 tydzień; pierwszy język (angielski) ok. 2–3
tygodnie, głównie czas korekty przez native speakera; każdy kolejny ok. 1–2
tygodnie.

## Tłumaczenie

Szkic z AI, ale **obowiązkowa korekta native speakera**, najlepiej
z doświadczeniem w treściach dla dzieci. Kwestie Timo pisane od nowa
(humor, rymy, wtrącenia), nie tłumaczone dosłownie.

## Angielski (US) — decyzje z 30.10.2026

- Angielski amerykański. Teksty: `content/en/build_voice_lines.py`
  (471 kwestii) i `content/en/build_animal_names.py` (715 nazw) → JSON obok;
  głosy: `python3 scripts/generate-voices-lang.py en` → `content/en/voices/`
  (poza aplikacją, materiał na paczkę do pobrania).
- Głos: polski Timo po angielsku miał wschodni akcent, więc EN ma osobny
  głos „Timo Lisek EN” — zaprojektowany z tego samego opisu postaci,
  z akcentem amerykańskim (`ELEVENLABS_VOICE_ID_EN` w `.env`). Kolejne
  języki: najpierw odsłuch polskiego głosu, w razie akcentu — osobny projekt.
- Pytanie `q_poland` w wersji US: „żyje dziko w Ameryce Północnej” —
  odpowiedź z zasięgów (`america-n`), nie z cechy `pol`.
- Timo bez kraju: lis „ze swojego lasu”, nie „z Polski”.
- Wyprawa „Leśne Zwierzaki” w wersji US: las Ameryki Północnej (szop pracz,
  skunks, pręgowiec, oposum, kojot, bielik, bóbr, lis, wilk, sowa, wiewiórka…).
  Brakujące gatunki do ewentualnego dodania: jeleń wirginijski, baribal,
  kardynał, świstak amerykański.
- Kraina „Polski las” w kolekcji → „European Forest”.
- Mapy w karcie zwierzęcia: bez wyróżnienia Polski.
- Opisy zwierząt: 39 wzmianek o Polsce do przepisania (nie tłumaczenia).
- Nazwy tłumaczone z nazwy polskiej, nie z id (`orca_killer` = Fin whale,
  `snow_fox` = Arctic hare); łoś = Moose, żubr = European bison,
  jeleń = Red deer, myszołów = Common buzzard.
- Wstępy do zgadywania kończą się na „the…” — nazwa to osobne nagranie,
  a „a/an” zależy od nazwy.

## Kolejność wdrożenia

1. Stabilne wydanie polskie (test zamknięty → publikacja w obu sklepach).
2. Infrastruktura (punkty 1–4 prac technicznych).
3. Angielski: treść, korekta, głosy, sklepy.
4. Ocena po 4–6 tygodniach: pobrania, konwersja do subskrypcji, oceny.
5. Niemiecki, potem hiszpański i francuski.

## Przy okazji — odchudzenie już teraz

- Głosy (36,6 MB): niższy bitrate MP3 (mowa brzmi dobrze przy 48–64 kb/s),
  prawdopodobnie −30–50% — do oceny na słuch.
- Przebrania liska (23,4 MB): na Androidzie grają z pobieranych WebP, wideo
  w aplikacji potrzebne tam tylko offline — można je zostawić tylko dla iOS.
