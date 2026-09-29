# Animacje Timo v2 — jeden spójny zestaw

Pierwszy zestaw (`prompts-timo-talking.md`) miał cztery wady: Kling przerysował
liska (inna głowa, oczy i kolory niż w `timo-idle`), pętle trwały 5 s przy
kwestiach 1–2 s, gesty całym ciałem nie pasowały do pozy idle, a buzia nie
dawała się zgrać z głosem. Tu WSZYSTKIE klipy — także idle — powstają z jednej
klatki startowej (`timo-talk-start.png`) tym samym modelem, więc lisek wygląda
w każdym identycznie, a każdy klip zaczyna się i kończy w tej samej pozie.

Tryb std (720p) wystarcza: lisek jest wyświetlany w 435×640.
Czas trwania: idle 5 s, reszta 3 s (minimum Klinga).

Wspólne zakończenie każdego promptu (pętla, kamera, tło) jest takie samo —
różni się tylko akapit „Action”.

---

## 1. Spokojny idle — `timo2-idle`

```
Animate the cute cartoon fox character from the reference image standing calmly, as in a 3D animated children's film. Keep EXACTLY the same character design, proportions, colours and rendering style as the reference image in every frame.

Action: the fox stands still in exactly the same pose as the first frame and simply breathes gently: the chest rises and falls very slightly, the tail sways slowly from side to side, the ears twitch once, and the eyes blink once naturally. The mouth stays closed in a soft smile the whole time. The paws stay relaxed at the sides and do NOT move. The head stays in place, only the tiniest natural movement. No waving, no gestures, no steps.

The clip starts and ends in exactly the same pose as the first frame, so it loops seamlessly.

Camera: completely static, locked-off, front view, full body always in frame, no zoom, no pan, no camera shake.
Background: plain pure white (#FFFFFF), perfectly flat and even, no floor, no shadow, no gradient, no props.
No text, no subtitles, no watermark, no other characters.
```

## 2. Mówi — `timo2-talk`

```
Animate the cute cartoon fox character from the reference image talking to a child, as in a 3D animated children's film. Keep EXACTLY the same character design, proportions, colours and rendering style as the reference image in every frame.

Action: the fox stands still in exactly the same pose as the first frame and talks. ONLY the face moves: the mouth opens and closes continuously in a lively natural talking rhythm with small and medium mouth shapes, the eyebrows move slightly with the speech. The head may nod very slightly. The body, arms, paws, legs and feet stay completely still in the starting pose — no gestures at all. The tail sways gently.

The clip starts and ends with the mouth closed in a soft smile, in exactly the same pose as the first frame, so it loops seamlessly.

Camera: completely static, locked-off, front view, full body always in frame, no zoom, no pan, no camera shake.
Background: plain pure white (#FFFFFF), perfectly flat and even, no floor, no shadow, no gradient, no props.
No text, no subtitles, no watermark, no other characters.
```

## 3. Mówi radośnie — `timo2-talk-happy`

```
Animate the cute cartoon fox character from the reference image talking joyfully to a child, as in a 3D animated children's film. Keep EXACTLY the same character design, proportions, colours and rendering style as the reference image in every frame.

Action: the fox stands still in exactly the same pose as the first frame and talks with delight. ONLY the face moves: the mouth opens and closes continuously in an energetic talking rhythm with a big happy smile between words, the eyebrows lift, the eyes sparkle, the ears perk up. The head may nod slightly. The body, arms, paws, legs and feet stay completely still in the starting pose — no gestures, no bouncing. The tail wags.

The clip starts and ends with the mouth closed in a soft smile, in exactly the same pose as the first frame, so it loops seamlessly.

Camera: completely static, locked-off, front view, full body always in frame, no zoom, no pan, no camera shake.
Background: plain pure white (#FFFFFF), perfectly flat and even, no floor, no shadow, no gradient, no props.
No text, no subtitles, no watermark, no other characters.
```

## 4. Macha — `timo2-wave`

```
Animate the cute cartoon fox character from the reference image waving hello to a child, as in a 3D animated children's film. Keep EXACTLY the same character design, proportions, colours and rendering style as the reference image in every frame.

Action: the fox stands in place, raises one paw and waves hello twice with a friendly smile, then lowers the paw back to exactly the starting position. The mouth stays closed in a smile. The feet stay planted in exactly the same spot the whole time.

The clip starts and ends in exactly the same pose as the first frame, so it loops seamlessly.

Camera: completely static, locked-off, front view, full body always in frame, no zoom, no pan, no camera shake.
Background: plain pure white (#FFFFFF), perfectly flat and even, no floor, no shadow, no gradient, no props.
No text, no subtitles, no watermark, no other characters.
```

---

## Negative prompt

```
camera movement, zoom, pan, shaking camera, walking, stepping, turning around, leaving the frame, cropped body, floor, ground shadow, background scenery, gradient background, extra characters, extra limbs, extra fingers, deformed paws, changing fur colour, changing face, different character design, missing bandana, bandana changing colour, realistic fox, photorealism, wide-open mouth, yawning, sad expression, crying, text, subtitles, watermark, logo
```
