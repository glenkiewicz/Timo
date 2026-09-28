# Prompty na pętle mówienia Timo — image-to-video

Cztery krótkie pętle, w których Timo rusza buzią. W grze pętla leci, dopóki gra
klip głosu, a po nim Timo wraca do `timo-idle`. Buzia nie jest zsynchronizowana
z konkretnymi słowami — to celowe, dzięki temu 4 filmy obsługują wszystkie 1177
kwestii z `voice-manifest.ts`.

## Jak generować

- **Tryb:** image-to-video (Kling, Veo, Runway, Hailuo — każdy, który przyjmuje
  klatkę startową). Proporcje **9:16**, długość **5 s**.
- **Klatka startowa:** ta sama, od której powstał `timo-idle`. Jeśli jej nie ma —
  `assets/timo/character/timo-anchor-front.png` położony na **czysto białym tle
  (#FFFFFF)**, lisek na środku, cały w kadrze, z zapasem nad uszami i pod łapami.
- **Klatka końcowa:** jeśli generator ją przyjmuje (np. Kling „end frame”), daj
  **tę samą** co startowa. Wtedy pętla domyka się sama.
- **Białe tło jest obowiązkowe.** Kanał alfa wycinamy potem tak jak przy
  `timo-idle` (flood-fill od krawędzi kadru, jak w `scripts/matte.py`) — każdy
  cień, gradient czy podłoga na tle zostanie przyklejona do liska.
- Każdy prompt wygeneruj **2–3 razy** i wybierz wersję, w której buzia rusza się
  najbardziej naturalnie, a futro i chustka nie „pływają”.
- Dźwięk z generatora wyrzucamy — liczy się tylko obraz.

## Po wygenerowaniu

1. Wytnij najspokojniejszy fragment **2–3 s** i domknij pętlę przenikaniem końca
   w początek (tak jak `timo-idle`).
2. **Pierwsza i ostatnia klatka: buzia zamknięta, Timo w pozie z `timo-idle`.**
   Inaczej przy przełączaniu idle ↔ mówienie lisek przeskoczy.
3. Wytnij tło, przytnij kadr **identycznie jak `timo-idle.webp`** (łapy muszą
   wypaść na tej samej wysokości — `CLIP_PAWS` w `TimoStage.tsx`) i zapisz jako
   animowany WebP z alfą do `assets/timo/character/`.

---

Każdy prompt ma ten sam opis postaci i te same trzy ostatnie akapity (pętla,
kamera, tło) — różni się tylko akapit „Action”. Jeśli generator ma limit znaków,
skróć opis postaci (zdjęcie i tak niesie wygląd); kamery i tła nie ruszaj.

---

## 1. Mówi — `timo-talk`

Domyślna pętla: powitania, wstępy wypraw, setupy przed pytaniem, reakcje
„nie”, krótkie reakcje, „nie wiem”, nazwy zwierząt.

```
Animate the cute cartoon fox character from the reference image talking warmly to a child, as in a 3D animated children's film. Keep EXACTLY the same character design: stylised plush-like orange fur, cream muzzle, cheeks, chest and belly, dark brown ear tips, paws and feet, big glossy brown eyes with brown eyebrows, small dark brown nose, a tuft of fur on top of the head, a green bandana tied around the neck, a fluffy orange tail with a cream tip.

Action: the fox stands in place facing the camera and speaks in a friendly, cheerful way. The mouth opens and closes in a natural, lively talking rhythm with varied openness - small and medium mouth shapes, never a wide-open yawn. Subtle head bobs and small nods while speaking, a relaxed happy expression, eyebrows moving slightly with the speech, one natural blink. The tail sways gently behind. Paws stay relaxed at the sides with only a tiny gesture. The feet stay planted in exactly the same spot the whole time.

The clip starts and ends with the mouth closed in a soft smile, in exactly the same pose as the first frame, so it loops seamlessly.

Camera: completely static, locked-off, front view, full body always in frame, no zoom, no pan, no camera shake.
Background: plain pure white (#FFFFFF), perfectly flat and even, no floor, no shadow, no gradient, no props.
No text, no subtitles, no watermark, no other characters.
```

## 2. Pyta — `timo-talk-ask`

Pytania (`q.*.core` — najczęstszy klip w grze), wygłupy, wstęp do strzału
(„Mój nos mówi, że to…” + nazwa zwierzęcia).

```
Animate the cute cartoon fox character from the reference image asking a child a question, as in a 3D animated children's film. Keep EXACTLY the same character design: stylised plush-like orange fur, cream muzzle, cheeks, chest and belly, dark brown ear tips, paws and feet, big glossy brown eyes with brown eyebrows, small dark brown nose, a tuft of fur on top of the head, a green bandana tied around the neck, a fluffy orange tail with a cream tip.

Action: the fox stands in place facing the camera and asks a curious question. The mouth opens and closes in a natural talking rhythm with varied, moderate mouth shapes. While speaking, the head slowly tilts to one side, the eyebrows rise with curiosity, the ears perk up and lean slightly forward, the eyes look straight at the viewer with an inviting, expectant look. One paw lifts thoughtfully towards the chin and returns to the side. The tail sways gently. At the end of the phrase the head returns to upright. The feet stay planted in exactly the same spot the whole time.

The clip starts and ends with the mouth closed in a soft smile, in exactly the same pose as the first frame, so it loops seamlessly.

Camera: completely static, locked-off, front view, full body always in frame, no zoom, no pan, no camera shake.
Background: plain pure white (#FFFFFF), perfectly flat and even, no floor, no shadow, no gradient, no props.
No text, no subtitles, no watermark, no other characters.
```

## 3. Cieszy się — `timo-talk-happy`

Reakcje na „tak” (`q.*.yes`), „ciepło / gorąco”, wygrana, próg serii dni.

```
Animate the cute cartoon fox character from the reference image talking excitedly and joyfully, as in a 3D animated children's film. Keep EXACTLY the same character design: stylised plush-like orange fur, cream muzzle, cheeks, chest and belly, dark brown ear tips, paws and feet, big glossy brown eyes with brown eyebrows, small dark brown nose, a tuft of fur on top of the head, a green bandana tied around the neck, a fluffy orange tail with a cream tip.

Action: the fox stands in place facing the camera and speaks with delight, like sharing great news. The mouth opens and closes in an energetic talking rhythm with a big happy smile between words. Small happy bounces on the spot (heels lift a little, the feet land back in exactly the same place), both paws come up to chest height in a cheerful gesture and go back down, ears perk up, eyes sparkle. The tail wags quickly. Joyful but not frantic.

The clip starts and ends with the mouth closed in a soft smile, in exactly the same pose as the first frame, so it loops seamlessly.

Camera: completely static, locked-off, front view, full body always in frame, no zoom, no pan, no camera shake.
Background: plain pure white (#FFFFFF), perfectly flat and even, no floor, no shadow, no gradient, no props.
No text, no subtitles, no watermark, no other characters.
```

## 4. Ups — `timo-talk-oops`

Pudło (`miss.*`) i poddanie się (`giveup.*`, `guided_giveup.*`). Opcjonalna —
bez niej te kwestie mogą lecieć na `timo-talk`.

```
Animate the cute cartoon fox character from the reference image talking in a funny, sheepish "oops" way, as in a 3D animated children's film. Keep EXACTLY the same character design: stylised plush-like orange fur, cream muzzle, cheeks, chest and belly, dark brown ear tips, paws and feet, big glossy brown eyes with brown eyebrows, small dark brown nose, a tuft of fur on top of the head, a green bandana tied around the neck, a fluffy orange tail with a cream tip.

Action: the fox stands in place facing the camera and speaks with playful embarrassment, still friendly and good-humoured, never sad. The mouth opens and closes in a natural talking rhythm with a lopsided, sheepish grin. The ears fold back slightly, the eyebrows lift in the middle, one paw comes up to scratch the back of the head and returns to the side, a small shrug of the shoulders. The tail swishes slowly. The feet stay planted in exactly the same spot the whole time.

The clip starts and ends with the mouth closed in a soft smile, in exactly the same pose as the first frame, so it loops seamlessly.

Camera: completely static, locked-off, front view, full body always in frame, no zoom, no pan, no camera shake.
Background: plain pure white (#FFFFFF), perfectly flat and even, no floor, no shadow, no gradient, no props.
No text, no subtitles, no watermark, no other characters.
```

---

## Negative prompt (jeśli generator ma osobne pole)

```
camera movement, zoom, pan, shaking camera, walking, stepping, turning around, leaving the frame, cropped body, floor, ground shadow, background scenery, gradient background, extra characters, extra limbs, extra fingers, deformed paws, changing fur colour, missing bandana, bandana changing colour, realistic fox, photorealism, wide-open mouth, yawning, teeth close-up, sad expression, crying, text, subtitles, watermark, logo
```

## Która pętla do której kwestii

Klucze z `src/data/voice-manifest.ts`. Sekwencja z kilku klipów (np. setup +
pytanie, wstęp do strzału + nazwa zwierzęcia) leci na **jednej** pętli —
tej, którą wskazuje ostatni klip, żeby lisek nie zmieniał nastroju w pół zdania.

| Pętla | voiceKey | Ile klipów |
|---|---|---|
| `timo-talk-ask` | `q.*.core`, `wyglup.*`, `guess_intro.*` (+ `animal.*` w strzale) | 126 (+ nazwy) |
| `timo-talk-happy` | `q.*.yes`, `heat.*`, `victory.*`, `streak_milestone.*` | 90 |
| `timo-talk-oops` | `miss.*`, `giveup.*`, `guided_giveup.*` | 13 |
| `timo-talk` | wszystko inne: `q.*.setup`, `q.*.no`, `greeting.*`, `intro.*`, `streak.*`, `outside.*`, `reaction.*` | 233 |
