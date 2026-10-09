#!/usr/bin/env python3
"""
Montaż filmu promocyjnego z ujęć Kling (scripts/generate-promo.py).

Wyjścia (marketing/promo/):
  header-21x9.mp4   3840×1646, bez dźwięku — nagłówek strony produktu (App Store)
  search-3x2.mp4    1920×1280, bez dźwięku — wideo w wynikach wyszukiwania
  trailer-16x9.mp4  1920×1080 z muzyką i planszą końcową — social media, strona
  trailer-9x16.mp4  1080×1920 (rozmyte tło) — TikTok, Reels, Shorts

Nagłówek i wyszukiwanie: 5–30 s, 30 kl/s, w pętli i wyciszone (wymogi
Asset Library z 5.10.2026). Ujęcia przenikają się co 0,5 s.

Uruchom:  python3 scripts/promo-edit.py
"""
import pathlib, subprocess

from PIL import Image, ImageDraw, ImageFont

P = pathlib.Path("marketing/promo")
CLIPS = ["1-hero", "2-ocean", "3-safari", "4-leaves", "5-collection"]
# pionowe położenie kadru 21:9 (od góry, w px na 1080) — głowa liska w kadrze
Y_21x9 = {"1-hero": 30, "2-ocean": 110, "3-safari": 120, "4-leaves": 150, "5-collection": 60}
XF = 0.5
CLIP_LEN = 5.0
FONT_BOLD = pathlib.Path("node_modules/@expo-google-fonts/gabarito/700Bold/Gabarito_700Bold.ttf")
FONT_TEXT = pathlib.Path("node_modules/@expo-google-fonts/lexend/500Medium/Lexend_500Medium.ttf")
MUSIC = P / "audio" / "music-1.mp3"


def run(cmd):
    subprocess.run(cmd, check=True)


def chain(crop_for, w, h, extra_inputs=()):
    """Łańcuch przenikań: każdy klip przycięty i przeskalowany, potem xfade."""
    inputs, parts = [], []
    for i, c in enumerate(CLIPS):
        inputs += ["-i", str(P / "clips" / f"{c}.mp4")]
        parts.append(f"[{i}:v]trim=0:{CLIP_LEN},setpts=PTS-STARTPTS,{crop_for(c)},"
                     f"scale={w}:{h}:flags=lanczos,fps=30,format=yuv420p,setsar=1[c{i}]")
    prev, off = "c0", CLIP_LEN - XF
    for i in range(1, len(CLIPS)):
        parts.append(f"[{prev}][c{i}]xfade=transition=fade:duration={XF}:offset={off:.2f}[x{i}]")
        prev, off = f"x{i}", off + CLIP_LEN - XF
    total = CLIP_LEN * len(CLIPS) - XF * (len(CLIPS) - 1)
    return inputs, parts, prev, total


def silent(name, crop_for, w, h):
    inputs, parts, last, total = chain(crop_for, w, h)
    # domknięcie pętli: wyciemnienie/rozjaśnienie, żeby skok na początek był miękki
    parts.append(f"[{last}]fade=t=in:d=0.4,fade=t=out:st={total - 0.4:.2f}:d=0.4[v]")
    run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", ";".join(parts), "-map", "[v]",
         "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "17",
         # zwykłe 4:2:0 — przenikanie przestawia format na 4:4:4, którego Apple nie przyjmie
         "-pix_fmt", "yuv420p", "-profile:v", "high",
         "-movflags", "+faststart", str(P / name)])
    print(f"{name}: {w}×{h}, {total:.1f} s")


def end_card(w, h, path):
    im = Image.new("RGB", (w, h), (253, 236, 213))
    d = ImageDraw.Draw(im)
    s = min(w, h) / 1080
    icon = Image.open("assets/images/icon.png").convert("RGB").resize((int(300 * s), int(300 * s)))
    m = Image.new("L", icon.size, 0)
    ImageDraw.Draw(m).rounded_rectangle((0, 0, *icon.size), int(66 * s), fill=255)
    y = int(h / 2 - 330 * s)
    im.paste(icon, ((w - icon.width) // 2, y), m)
    y += icon.height + int(50 * s)
    for text, font, size, color in [
        ("Timo – zgadnij zwierzę", FONT_BOLD, 92, (61, 45, 30)),
        ("Pomyśl o zwierzęciu, a lisek zgadnie!", FONT_TEXT, 46, (111, 96, 73)),
        ("Wkrótce w App Store", FONT_BOLD, 54, (232, 128, 43)),
    ]:
        f = ImageFont.truetype(str(font), int(size * s))
        tw = d.textlength(text, font=f)
        d.text(((w - tw) / 2, y), text, font=f, fill=color)
        y += int((size + 34) * s)
    im.save(path)


def trailer(name, w, h, vertical):
    card = P / f"_card-{w}x{h}.png"
    end_card(w, h, card)
    if vertical:
        # 16:9 na środku, tło z tego samego obrazu, rozmyte i przyciemnione
        crop = lambda c: "null"
        inputs, parts, last, total = chain(crop, 1080, 608)
        parts.append(f"[{last}]split[a][b];[b]scale=-2:{h},crop={w}:{h},gblur=sigma=40,eq=brightness=-0.08[bg];"
                     f"[bg][a]overlay=0:(H-h)/2[film]")
        last = "film"
    else:
        inputs, parts, last, total = chain(lambda c: "null", w, h)
    n = len(CLIPS)
    inputs += ["-loop", "1", "-t", "3", "-i", str(card)]
    parts.append(f"[{n}:v]fps=30,format=yuv420p,setsar=1[card]")
    parts.append(f"[{last}][card]xfade=transition=fade:duration=0.6:offset={total - 0.6:.2f},"
                 f"fade=t=in:d=0.4,fade=t=out:st={total + 2.4 - 0.5:.2f}:d=0.5[v]")
    full = total + 2.4
    # dźwięk: muzyka + szelest i „pyk” przy wybuchu liści + fanfara na planszy
    leaves_at = 3 * (CLIP_LEN - XF)
    sfx = [("assets/sfx/rustle.mp3", leaves_at + 0.4), ("assets/sfx/pop.mp3", leaves_at + 1.6),
           ("assets/sfx/fanfare.mp3", total - 0.4)]
    a_in = n + 1
    inputs += ["-i", str(MUSIC)]
    parts.append(f"[{a_in}:a]aloop=loop=-1:size=2e9,atrim=0:{full:.2f},volume=-6dB,"
                 f"afade=t=in:d=0.5,afade=t=out:st={full - 1.5:.2f}:d=1.5[m]")
    mix = ["[m]"]
    for k, (f, t) in enumerate(sfx):
        inputs += ["-i", f]
        ms = int(t * 1000)
        parts.append(f"[{a_in + 1 + k}:a]volume=14dB,adelay={ms}|{ms},apad[s{k}]")
        mix.append(f"[s{k}]")
    parts.append(f"{''.join(mix)}amix=inputs={len(mix)}:normalize=0,atrim=0:{full:.2f},alimiter=limit=0.9[a]")
    run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", ";".join(parts),
         "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-preset", "slow", "-crf", "18",
         "-pix_fmt", "yuv420p", "-profile:v", "high",
         "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", str(P / name)])
    card.unlink()
    print(f"{name}: {w}×{h}, {full:.1f} s")


def main():
    silent("header-21x9.mp4", lambda c: f"crop=1920:823:0:{Y_21x9[c]}", 3840, 1646)
    silent("search-3x2.mp4", lambda c: "crop=1620:1080:150:0", 1920, 1280)
    trailer("trailer-16x9.mp4", 1920, 1080, vertical=False)
    trailer("trailer-9x16.mp4", 1080, 1920, vertical=True)


if __name__ == "__main__":
    main()
