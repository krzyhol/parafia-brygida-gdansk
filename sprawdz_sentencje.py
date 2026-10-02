#!/usr/bin/env python3
"""Sprawdza sentencje z assets/data/sentencje.json z tekstem Biblii Tysiąclecia (biblia.deon.pl).

Każda sentencja musi być dosłownym fragmentem podanych wersetów; interpunkcja i wielkość liter
się nie liczą. Po dodaniu albo zmianie sentencji:

    python3 sprawdz_sentencje.py

Rozdziały pobrane z biblia.deon.pl zostają w katalogu tymczasowym, więc kolejne uruchomienia są szybkie.
"""
import html
import json
import re
import subprocess
import sys
import tempfile
import urllib.parse
from pathlib import Path

ROOT = Path(__file__).resolve().parent
CACHE = Path(tempfile.gettempdir()) / 'brygida-bt'
REF = re.compile(r'^(.+?) (\d+), (\d+)(?:-(\d+))?$')   # np. „Ps 23, 1”, „Łk 1, 46-47”


def chapter(book, ch):
    """Wersety rozdziału: {numer: tekst}, bez przypisów i śródtytułów."""
    CACHE.mkdir(exist_ok=True)
    path = CACHE / f'{book.replace(" ", "")}_{ch}.html'
    if not path.exists():
        q = urllib.parse.quote(f'{book} {ch},1'.encode('iso-8859-2'))
        raw = subprocess.run(['curl', '-sL', '-m', '30', f'https://biblia.deon.pl/otworz.php?skrot={q}'],
                             capture_output=True, check=True).stdout
        path.write_bytes(raw)
    s = path.read_bytes().decode('iso-8859-2')
    s = re.sub(r'<sup>.*?</sup>', '', s, flags=re.S)
    s = re.sub(r'<div class=miedzytytul\d*>.*?</div>|<div class="initial-letter">.*?</div>', '', s, flags=re.S)
    parts = re.split(r'<a name="W(\d+)"></a>', s)
    verses = {}
    for i in range(1, len(parts), 2):
        t = re.sub(r'<span class="werset">.*?</span>', '', parts[i + 1], flags=re.S)
        t = re.split(r'<div|<table|<hr', t)[0]
        verses[int(parts[i])] = html.unescape(re.sub(r'<[^>]+>', ' ', t))
    return verses


def norm(t):
    return ' '.join(re.sub(r'[\W\d_]+', ' ', t.lower()).split())


def main():
    data = json.loads((ROOT / 'assets/data/sentencje.json').read_text(encoding='utf-8'))
    bad = 0
    for s in data:
        m = REF.match(s['z'])
        if not m:
            bad += 1
            print('Zły format odnośnika:', s['z'])
            continue
        book, ch, a = m.group(1), int(m.group(2)), int(m.group(3))
        b = int(m.group(4) or a)
        verses = chapter(book, ch)
        src = ' '.join(verses.get(v, '') for v in range(a, b + 1))
        if norm(s['t']) not in norm(src):
            bad += 1
            print(f'Niezgodne z BT: {s["z"]} | {s["t"]}\n  BT: {" ".join(src.split())}')
    print(f'{len(data)} sentencji, niezgodnych: {bad}')
    sys.exit(1 if bad else 0)


if __name__ == '__main__':
    main()
