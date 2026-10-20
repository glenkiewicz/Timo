#!/usr/bin/env python3
"""
Strona podglądu tygodnia — jedna strona HTML ze wszystkimi postami z `plan.json`:
film albo slajdy, podpis, platformy, termin i status. Do przejrzenia przed
akceptacją; otwiera się lokalnie w przeglądarce (filmy zostają na dysku).

Uruchom:  python3 scripts/marketing/make-preview.py marketing/out/2026-W41 [--open]
Wynik:    <katalog>/podglad.html
"""
import html, json, pathlib, subprocess, sys
from datetime import datetime

ROOT = pathlib.Path(__file__).resolve().parents[2]
DAYS = ["pon.", "wt.", "śr.", "czw.", "pt.", "sob.", "niedz."]
STATUS = {"draft": "czeka na decyzję", "approved": "zatwierdzony", "rejected": "odrzucony",
          "scheduled": "w harmonogramie"}
PLATFORM = {"tiktok": "TikTok", "instagram": "Instagram", "x": "X"}

CSS = """
:root{--bg:#f6f8ed;--card:#fff;--line:#d2dbba;--text:#1e2a26;--soft:#6e7e6c;--fox:#ce7422;--ok:#17756a;--no:#b24528}
@media (prefers-color-scheme:dark){:root{--bg:#161d19;--card:#202a24;--line:#33423a;--text:#eef3e6;--soft:#a3b3a0;--fox:#f6a246;--ok:#5fc9b9;--no:#ec8a6c}}
*{box-sizing:border-box}body{margin:0;padding:24px 16px 64px;background:var(--bg);color:var(--text);font:16px/1.5 -apple-system,system-ui,sans-serif}
main{max-width:980px;margin:0 auto}h1{font-size:28px;margin:0 0 4px}p.lead{color:var(--soft);margin:0 0 28px}
article{background:var(--card);border:1px solid var(--line);border-radius:20px;padding:20px;margin-bottom:20px;display:grid;grid-template-columns:minmax(0,300px) minmax(0,1fr);gap:24px}
@media (max-width:700px){article{grid-template-columns:1fr}}
video,.slides img{width:100%;border-radius:12px;display:block;background:#000}
.slides{display:flex;gap:8px;overflow-x:auto;scroll-snap-type:x mandatory}.slides img{flex:0 0 100%;scroll-snap-align:start}
h2{font-size:19px;margin:0 0 6px}.meta{color:var(--soft);font-size:14px;margin-bottom:12px}
.id{font:600 13px ui-monospace,monospace;color:var(--fox)}
.caption{white-space:pre-wrap;border-left:3px solid var(--line);padding-left:14px;margin:0 0 12px}
.status{display:inline-block;font-size:13px;font-weight:600;padding:3px 10px;border-radius:99px;border:1px solid currentColor}
.approved,.scheduled{color:var(--ok)}.rejected{color:var(--no)}.draft{color:var(--soft)}
.note{font-size:14px;color:var(--soft);margin-top:10px}.textonly{color:var(--soft);font-size:14px}
"""


def when(iso):
    d = datetime.fromisoformat(iso)
    return f"{DAYS[d.weekday()]} {d.day}.{d.month:02d}, {d:%H:%M}"


def media_html(post):
    files = post.get("media", [])
    if not files:
        return '<div class="textonly">Post tekstowy, bez grafiki.</div>'
    if files[0].endswith(".mp4"):
        return f'<video src="{html.escape(files[0])}" controls preload="metadata"></video>'
    imgs = "".join(f'<img src="{html.escape(f)}" loading="lazy" alt="slajd {i}">' for i, f in enumerate(files, 1))
    return f'<div class="slides">{imgs}</div><div class="meta">{len(files)} slajdów — przewiń w bok</div>'


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if len(args) != 1:
        sys.exit(__doc__)
    week_dir = pathlib.Path(args[0])
    week_dir = week_dir if week_dir.is_absolute() else ROOT / week_dir
    plan = json.loads((week_dir / "plan.json").read_text(encoding="utf-8"))
    posts = sorted(plan["posts"], key=lambda p: p["date"])

    cards = []
    for p in posts:
        platforms = " + ".join(PLATFORM.get(x, x) for x in p["platforms"])
        note = f'<div class="note">{html.escape(p["note"])}</div>' if p.get("note") else ""
        cards.append(
            f'<article><div>{media_html(p)}</div><div>'
            f'<div class="id">{html.escape(p["id"])}</div><h2>{html.escape(p["title"])}</h2>'
            f'<div class="meta">{when(p["date"])} · {platforms}</div>'
            f'<p class="caption">{html.escape(p["caption"])}</p>'
            f'<span class="status {p["status"]}">{STATUS.get(p["status"], p["status"])}</span>{note}'
            f'</div></article>')

    page = (f'<!doctype html><html lang="pl"><meta charset="utf-8">'
            f'<meta name="viewport" content="width=device-width,initial-scale=1">'
            f'<title>Timo — posty {html.escape(plan["week"])}</title><style>{CSS}</style><main>'
            f'<h1>Posty na tydzień {html.escape(plan["week"])}</h1>'
            f'<p class="lead">{len(posts)} postów. Napisz w Claude Code, które zatwierdzasz, a które poprawić '
            f'lub odrzucić — używaj pomarańczowych identyfikatorów.</p>{"".join(cards)}</main></html>')
    out = week_dir / "podglad.html"
    out.write_text(page, encoding="utf-8")
    print(out.relative_to(ROOT))
    if "--open" in sys.argv:
        subprocess.run(["open", str(out)])


if __name__ == "__main__":
    main()
