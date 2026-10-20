#!/usr/bin/env python3
"""
Warianty logotypu „Timo” na stronę — przez bramkę ToAPIs, na jednolitym
zielonym tle (#00FF00), które potem wycinamy (scripts/key-logo.py).

Uruchom:  python3 scripts/generate-logo.py [<id> ...]
Wynik:    site/_raw/logo/<id>.png
"""
import pathlib, sys, time
sys.path.insert(0, str(pathlib.Path(__file__).parent))
gla = __import__("generate-landing-art")

OUT = pathlib.Path("site/_raw/logo")
BASE = """Children's mobile game title logo, a wordmark that reads exactly "Timo" (capital T, then lowercase i, m, o) and nothing else. Chunky, rounded, friendly bold letters with soft 3D volume: warm fox-orange fill (#EC8E30) with a lighter top highlight and a darker orange bottom bevel, a thick clean white outer outline and a thin dark brown (#4A3726) outline around the white. Glossy but soft, polished like a top casual game logo. {extra} Centered on a completely flat, uniform pure green (#00FF00) background with no gradient, no shadow on the background, no other objects, no text other than "Timo"."""

VARIANTS = {
    "ears": BASE.format(extra="Two small cute fox ears (orange with dark brown tips and cream insides) grow from the top of the letter T, as if the word were the fox's head."),
    "paw": BASE.format(extra="The dot of the letter i is a small cute brown paw print. A tiny green leaf rests on the top corner of the T."),
    "tail": BASE.format(extra="A fluffy orange fox tail with a cream white tip curls under the whole word like a swoosh, and two small fox ears peek out above the letter o."),
}


def main(ids):
    k = gla.key(); OUT.mkdir(parents=True, exist_ok=True)
    tasks = {}
    for i in ids:
        r = gla.call("/images/generations", {"model": gla.MODEL, "prompt": VARIANTS[i], "size": "16:9",
                                              "resolution": "2k", "n": 1}, k)
        tasks[i] = r["id"]; print(f"  wyslano  {i:8} {r['id']}", flush=True)
    t0 = time.time()
    while tasks and time.time() - t0 < 900:
        time.sleep(8)
        for i, tid in list(tasks.items()):
            try:
                r = gla.call(f"/images/generations/{tid}", None, k)
            except Exception:
                continue
            if r.get("status") == "completed":
                p = OUT / f"{i}.png"; gla.fetch_file(r["result"]["data"][0]["url"], p); tasks.pop(i)
                print(f"  gotowe   {i:8} ({int(time.time() - t0)}s)", flush=True)
            elif r.get("status") in ("failed", "cancelled"):
                print(f"  PADLO    {i:8} {r}", flush=True); tasks.pop(i)


if __name__ == "__main__":
    main(sys.argv[1:] or list(VARIANTS))
