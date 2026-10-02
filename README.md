# Parafia pw. św. Brygidy w Gdańsku — prototyp strony

Prototyp nowej strony parafii przygotowany jako pilotaż zamiennika dla platformy ISP 2.0 (strony-parafialne.pl). Treść pochodzi z obecnej strony [brygida.gdansk.pl](https://www.brygida.gdansk.pl) (stan na 30 IX 2026). To nie jest oficjalna strona parafii, dlatego strony mają znacznik `noindex`.

## Strony

- `index.html` — strona główna: dzisiejsze Msze (najbliższa liczona na żywo wg czasu warszawskiego), ogłoszenia, najbliższe wydarzenia, Bursztynowy Ołtarz
- `msze-i-nabozenstwa.html` — porządek Mszy, nabożeństwa w tygodniu i w roku liturgicznym, intencje, spowiedź także w językach obcych
- `sakramenty.html` — chrzest, I Komunia, bierzmowanie, małżeństwo; listy dokumentów do odhaczania i druku
- `wspolnota.html` — duszpasterze, grupy parafialne, historia parafii
- `zwiedzanie.html` — godziny i wstęp, przewodnicy, historia bazyliki, Bursztynowy Ołtarz
- `aktualnosci.html` — ogłoszenia duszpasterskie, wydarzenia, galerie
- `kontakt.html` — biuro parafialne, dojazd, telefony
- `wesprzyj-nas.html` — konta (z kopiowaniem numeru), BLIK, Bursztynowy Ołtarz, konserwacja zabytku
- `404.html` — strona błędu dla GitHub Pages; ma ścieżki absolutne `/parafia-brygida-gdansk/…`, bo GitHub Pages serwuje ją pod dowolnym adresem

## Struktura

- `assets/css/style.css` — wspólne style (paleta: kamień, cegła, bursztyn; jasny i ciemny motyw)
- `assets/js/main.js` — menu mobilne, „najbliższa Msza”, status biura, spis treści, okres liturgiczny, listy dokumentów, kopiowanie numerów kont
- `assets/fonts/` — Alegreya i Atkinson Hyperlegible Next (licencja SIL Open Font License), tylko znaki łacińskie z polskimi
- `assets/img/` — zdjęcia Bursztynowego Ołtarza; zdjęcie prezbiterium: fot. Wojciech Chomka

## Podgląd lokalny

```bash
python3 -m http.server 8765 --bind 127.0.0.1
```

Potem otwórz http://127.0.0.1:8765.
