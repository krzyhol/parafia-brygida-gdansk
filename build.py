#!/usr/bin/env python3
"""Wstawia wspólne fragmenty z _partials/ do stron *.html.

W stronie fragment oznacza para komentarzy:

    <!-- include: header -->
    ...treść generowana, nie edytować...
    <!-- /include -->

Nagłówek, stopkę i wspólną część <head> zmienia się w _partials/, potem:

    python3 build.py           # aktualizuje strony
    python3 build.py --check   # tylko sprawdza, czy strony są aktualne

Placeholdery w fragmentach:
  {{base}}     prefiks ścieżek: pusty, a w 404.html absolutny (patrz ABSOLUTE)
  {{dayline}}  pasek dnia z _partials/dayline.html; strona może go pominąć
               flagą: <!-- include: header bez-paska -->
W nagłówku link do bieżącej strony dostaje aria-current="page"; strony wydarzeń (wydarzenie-*.html)
podświetlają „Aktualności”.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PARTIALS = ROOT / '_partials'
# GitHub Pages serwuje 404.html pod dowolnym adresem, więc potrzebuje ścieżek absolutnych
ABSOLUTE = {'404.html': '/parafia-brygida-gdansk/'}
BLOCK = re.compile(r'(<!-- include: ([\w-]+)((?: [\w-]+)*) -->\n)(.*?)(<!-- /include -->)', re.S)


def partial(name):
    return (PARTIALS / f'{name}.html').read_text(encoding='utf-8')


def render(name, flags, page):
    base = ABSOLUTE.get(page, '')
    html = partial(name)
    if '{{dayline}}' in html:
        html = html.replace('{{dayline}}', '' if 'bez-paska' in flags else partial('dayline'))
    html = html.replace('{{base}}', base)
    if name == 'header':
        # linki w menu i przycisk „Wesprzyj nas”; logo (class="brand") pomijamy
        current = 'aktualnosci.html' if page.startswith('wydarzenie-') else page
        html = re.sub(r'<a( class="give")? href="%s"' % re.escape(base + current),
                      lambda m: m.group(0) + ' aria-current="page"', html)
    return html


def build(path):
    page = path.name
    src = path.read_text(encoding='utf-8')
    out = BLOCK.sub(lambda m: m.group(1) + render(m.group(2), m.group(3).split(), page) + m.group(5), src)
    return src, out


def main():
    check = '--check' in sys.argv[1:]
    stale = []
    for path in sorted(ROOT.glob('*.html')):
        src, out = build(path)
        if src != out:
            stale.append(path.name)
            if not check:
                path.write_text(out, encoding='utf-8')
    if check and stale:
        print('Nieaktualne (uruchom python3 build.py):', ', '.join(stale))
        sys.exit(1)
    print(('Zaktualizowano: ' + ', '.join(stale)) if stale else 'Wszystkie strony aktualne.')


if __name__ == '__main__':
    main()
