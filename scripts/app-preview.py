#!/usr/bin/env python3
"""
App Preview do App Store (886×1920, 30 kl/s, ≤ 30 s) z PRAWDZIWEGO nagrania gry.

Symulator nagrywa sam obraz, więc dźwięk składamy z oryginalnych plików:
aplikacja logowała podczas nagrania każdy głos i efekt ([REC] w logu Metro),
a `timeline.json` ma ich położenie na osi nagrania (synchronizacja po klatce
wybuchu sterty liści = efekt `pop`, 12,55 s nagrania). Głos ucinamy, gdy zaczyna się następny —
tak jak robi to TimoVoice. Pod spodem cicha muzyka, na górze polskie napisy.

Wejście: marketing/promo/rec/app.mov, timeline.json, marketing/promo/audio/music-1.mp3
Wyjście: marketing/promo/app-preview.mp4

Uruchom:  python3 scripts/app-preview.py
"""
import json, pathlib, subprocess

from PIL import Image, ImageDraw, ImageFont

REC = pathlib.Path("marketing/promo/rec")
OUT = pathlib.Path("marketing/promo")
FONT = pathlib.Path("node_modules/@expo-google-fonts/gabarito/700Bold/Gabarito_700Bold.ttf").resolve()
MUSIC = OUT / "audio" / "music-1.mp3"

# (start, koniec) na osi nagrania, podpis
SCENES = [
    (10.62, 17.90, "Hurra! Poznaj Timo"),
    (21.52, 24.42, "24 wyprawy z przebraniami"),
    (35.07, 41.82, "Odpowiadaj na pytania"),
    (58.12, 63.52, "Timo zgaduje!"),
    (63.82, 70.00, "Zbieraj zwierzęta"),
]

W, H = 886, 1920
SFX_GAIN_DB = 9
MUSIC_GAIN_DB = -20


def run(cmd):
    subprocess.run(cmd, check=True)


def full_audio(length: float) -> pathlib.Path:
    ev = json.load(open(REC / "timeline.json"))
    voices = [e for e in ev if e["kind"] == "voice"]
    inputs, chains = [], []
    for i, e in enumerate(ev):
        dur = e["dur"]
        if e["kind"] == "voice":
            nxt = [v["t"] for v in voices if v["t"] > e["t"]]
            if nxt:
                dur = min(dur, nxt[0] - e["t"])
            gain = 0
        else:
            gain = SFX_GAIN_DB
        inputs += ["-i", e["file"]]
        ms = int(e["t"] * 1000)
        chains.append(
            f"[{i}:a]atrim=0:{dur:.3f},afade=t=out:st={max(0, dur - 0.06):.3f}:d=0.06,"
            f"volume={gain}dB,adelay={ms}|{ms},aformat=channel_layouts=stereo:sample_rates=44100[a{i}]"
        )
    mix = "".join(f"[a{i}]" for i in range(len(ev)))
    graph = ";".join(chains) + f";{mix}amix=inputs={len(ev)}:normalize=0,atrim=0:{length}[out]"
    out = REC / "full-audio.wav"
    run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", graph, "-map", "[out]", str(out)])
    return out


def caption_png(text: str, n: int) -> pathlib.Path:
    """Pasek z napisem na górze — przykrywa pasek statusu symulatora."""
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    f = ImageFont.truetype(str(FONT), 52)
    band = 132
    d.rounded_rectangle((0, -40, W, band), 36, fill=(61, 45, 30, 255))
    tw = d.textlength(text, font=f)
    bbox = d.textbbox((0, 0), text, font=f)
    d.text(((W - tw) / 2, (band - (bbox[3] - bbox[1])) / 2 - bbox[1] + 6), text, font=f, fill="white")
    out = REC / f"caption-{n}.png"
    im.save(out)
    return out


def main():
    length = max(e for s in SCENES for e in s[:2]) + 1
    audio = full_audio(length)

    parts = []
    for n, (a, b, caption) in enumerate(SCENES):
        part = REC / f"scene-{n}.mp4"
        cap = caption_png(caption, n)
        vf = f"[0:v]fps=30,scale={W}:-2,crop={W}:{H}:0:(ih-{H})/2[b];[b][2:v]overlay=0:0[v]"
        run(["ffmpeg", "-v", "error", "-y", "-ss", f"{a}", "-to", f"{b}", "-i", str(REC / "app.mov"),
             "-ss", f"{a}", "-to", f"{b}", "-i", str(audio), "-i", str(cap),
             "-filter_complex", vf, "-map", "[v]", "-map", "1:a",
             "-c:v", "libx264", "-preset", "slow", "-crf", "16", "-pix_fmt", "yuv420p",
             "-c:a", "aac", "-b:a", "256k", "-ar", "44100", str(part)])
        parts.append(part)

    lst = REC / "parts.txt"
    lst.write_text("".join(f"file '{p.resolve()}'\n" for p in parts))
    joined = REC / "joined.mp4"
    run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(lst), "-c", "copy", str(joined)])

    total = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of",
                                  "csv=p=0", str(joined)], capture_output=True, text=True).stdout)
    out = OUT / "app-preview.mp4"
    graph = (
        f"[1:a]aloop=loop=-1:size=2e9,atrim=0:{total:.2f},volume={MUSIC_GAIN_DB}dB,"
        f"afade=t=in:d=0.6,afade=t=out:st={total - 1.2:.2f}:d=1.2[m];"
        f"[0:a][m]amix=inputs=2:normalize=0,alimiter=limit=0.9[a];"
        f"[0:v]fade=t=in:d=0.25,fade=t=out:st={total - 0.4:.2f}:d=0.4[v]"
    )
    run(["ffmpeg", "-v", "error", "-y", "-i", str(joined), "-i", str(MUSIC), "-filter_complex", graph,
         "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-preset", "slow", "-crf", "16",
         "-pix_fmt", "yuv420p", "-r", "30", "-c:a", "aac", "-b:a", "256k", "-ar", "44100",
         "-movflags", "+faststart", str(out)])
    print(f"{out}: {total:.2f} s")


if __name__ == "__main__":
    main()
