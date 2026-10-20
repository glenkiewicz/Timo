---
name: timo-report
description: Poniedziałkowy raport z wyników postów Timo — co zadziałało, co nie, i co zmienić w kolejnym tygodniu. Użyj, gdy użytkownik prosi o „raport z social mediów”, „jak poszły posty” albo przy poniedziałkowym przebiegu.
---

# Raport tygodnia

Krótko i po ludzku — użytkownik nie zna żargonu marketingowego. Zamiast „ER 4,2%”
pisz „na 100 osób, które zobaczyły film, 4 coś z nim zrobiły”.

## Skąd liczby

Publiczne API Postiz nie udostępnia statystyk, więc bierz je w tej kolejności:

1. Panel Postiz → Analytics, przez przeglądarkę (umiejętność `claude-in-chrome`),
   jeśli użytkownik jest tam zalogowany.
2. Jeśli się nie da — poproś użytkownika o zrzuty ekranu statystyk z TikToka,
   Instagrama i X za ostatnie 7 dni i odczytaj je.

Liczbę zapisów na listę oczekujących czytaj z Supabase funkcją
`select public.waitlist_count();`.

Nie zgaduj brakujących liczb. Czego nie udało się odczytać — napisz wprost.

## Co zawiera raport

1. **Jedno zdanie na start**: czy tydzień był lepszy, gorszy czy podobny do poprzedniego.
2. **Tabela postów** z `plan.json` minionego tygodnia: temat, wyświetlenia,
   polubienia + komentarze + zapisy, nowi obserwujący (jeśli platforma podaje).
3. **Najlepszy i najsłabszy post** — z hipotezą dlaczego (temat? pora? pierwsze 2 sekundy?).
4. **Konta**: liczba obserwujących na każdej platformie i zmiana; zapisy na listę.
5. **Co zmieniam w kolejnym tygodniu** — najwyżej 3 konkretne decyzje
   (np. „żyrafa zebrała 3× więcej niż ośmiornica → w przyszłym tygodniu dwa
   duże zwierzęta afrykańskie”).

Zapisz raport jako `marketing/reports/<rok>-W<nr>.md` i streść go w odpowiedzi.
Jeśli wnioski zmieniają siatkę godzin albo zasady doboru, zaproponuj zmianę
w `marketing/calendar.md` — nanieś ją po zgodzie użytkownika.

Przez pierwsze 4 tygodnie liczby będą małe i chwiejne: nie wyciągaj wniosków
z jednego posta, porównuj formaty między sobą.
