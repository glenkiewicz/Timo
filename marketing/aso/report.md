# ASO — polski App Store (20.10.2026)

Metoda: podpowiedzi wyszukiwarki App Store (autouzupełnianie) dla 50 słów bazowych → 694 frazy,
po oczyszczeniu 363 polskie frazy ogólne. **Popularność 0–100** = od ilu liter fraza pojawia się
w podpowiedziach i na którym miejscu (przybliżenie, nie liczba wyszukiwań). **Trudność 0–100** =
siła aplikacji w top 10 (logarytm liczby ocen) + ile z nich ma frazę w nazwie.
Skrypt: `scripts/marketing/aso-research.py`, dane: `keywords.csv`, `relevant.json`.

## Frazy dla Timo (popularność / trudność)

| Fraza | Pop. | Trud. | Uwagi |
|---|---|---|---|
| zgadnij kto to | 100 | 45 | najpopularniejsza fraza „zgadnij…”; top: Zgadnij co to? (1829 ocen), Akinator |
| zgadnij co to | 92 | 60 | nazwa konkurenta — trudno wygrać |
| zagadki | 91 | 57 | ogólne, dominuje Brain Test |
| detektyw | 91 | 40 | top to gry kryminalne dla dorosłych |
| zwierzaki | 83 | 39 | słaba konkurencja |
| ciekawostki | 83 | 45 | |
| gry dla dzieci | 75 | 59 | |
| dinozaury | 75 | 42 | |
| kalambury dla dzieci | 74 | 33 | |
| gra edukacyjna dla dzieci | 73 | 32 | **łatwa i popularna** |
| gry edukacyjne dla dzieci | 73 | 54 | |
| przedszkole | 73 | 41 | |
| gra zwierzęta | 69 | 24 | **najłatwiejsza z popularnych** |
| gra edukacyjna | 69 | 35 | |
| zagadki dla dzieci | 63 | 65 | trudna (LogicLike) |
| gry zwierzęta | 61 | 44 | |
| quiz dla dzieci | 60 | 53 | |
| gry o zwierzętach | 55 | 38 | |

Wniosek: konkurencja po polsku jest słaba — top 10 to głównie angielskie aplikacje z kilkudziesięcioma
ocenami. Najlepsze połączenie popularności i łatwości: „gra edukacyjna dla dzieci”, „gra zwierzęta”,
„zwierzaki”, „zgadnij kto to”, „kalambury dla dzieci”.

## Propozycja metadanych

- **Nazwa (30):** `Timo: zgadnij zwierzę` (21) — marka + rdzeń; „zgadnij” łączy się ze słowami kluczowymi
  w „zgadnij kto to”, „zgadnij co to”.
- **Podtytuł (30):** `Gra edukacyjna dla dzieci 4+` (28) — wprost łapie „gra edukacyjna dla dzieci”,
  a z „zwierzęta”/„gry” w słowach kluczowych także „gra zwierzęta”, „gry edukacyjne dla dzieci”.
- **Słowa kluczowe (100):** `zwierzęta,zwierzaki,zagadki,quiz,kto,co,to,gry,edukacyjne,przedszkole,lisek,detektyw,ciekawostki` (96)
  - bez spacji, bez powtórzeń słów z nazwy i podtytułu (Apple łączy słowa ze wszystkich trzech pól),
  - „zwierzęta” i „zwierzaki” osobno — Apple słabo odmienia polskie słowa, „zwierzę” z nazwy nie łapie „zwierzęta”,
  - „kto,co,to” + „zgadnij” z nazwy = „zgadnij kto to” / „zgadnij co to”.

Do weryfikacji w Apple Search Ads (prawdziwa popularność 5–100): zgadnij kto to, gra edukacyjna dla dzieci,
gry edukacyjne dla dzieci, gra zwierzęta, gry o zwierzętach, zwierzaki, zagadki dla dzieci, quiz dla dzieci,
kalambury dla dzieci, przedszkole.
