# Parafia pw. św. Brygidy w Gdańsku — prototyp strony

Prototyp nowej strony parafii przygotowany jako pilotaż zamiennika dla platformy ISP 2.0 (strony-parafialne.pl). Treść pochodzi z obecnej strony [brygida.gdansk.pl](https://www.brygida.gdansk.pl) (stan na 30 IX 2026). To nie jest oficjalna strona parafii, dlatego strony mają znacznik `noindex`.

## Strony

- `index.html` — strona główna: w centrum aktualności (najbliższe dni i link do ogłoszeń), z boku widżety „Msze święte dziś” (najbliższa liczona na żywo wg czasu warszawskiego), biuro i zwiedzanie dziś; niżej pokaz zdjęć Bursztynowego Ołtarza
- `msze-i-nabozenstwa.html` — porządek Mszy, nabożeństwa w tygodniu i w roku liturgicznym, intencje, spowiedź także w językach obcych
- `sakramenty.html` — chrzest, I Komunia, bierzmowanie, małżeństwo; listy dokumentów do odhaczania i druku
- `wspolnota.html` — „W parafii” (duszpasterze, organistka), grupy parafialne, proboszczowie w historii parafii
- `zwiedzanie.html` — godziny i wstęp, przewodnicy, historia bazyliki, Bursztynowy Ołtarz
- `aktualnosci.html` — ogłoszenia duszpasterskie, wydarzenia, galerie
- `wydarzenie-*.html` — strony wydarzeń (opis, program, plakat, inne wydarzenia); karty na stronie głównej i lista w aktualnościach do nich prowadzą
- `kontakt.html` — biuro parafialne, dojazd, telefony
- `liturgia.html` — liturgia dnia: pełne czytania z widżetu Niezbędnika Katolika („Niedziela”), ze wskazaniem źródła
- `wesprzyj-nas.html` — konta (z kopiowaniem numeru), BLIK, Bursztynowy Ołtarz, konserwacja zabytku
- `404.html` — strona błędu dla GitHub Pages; ma ścieżki absolutne `/parafia-brygida-gdansk/…`, bo GitHub Pages serwuje ją pod dowolnym adresem

## Struktura

- `assets/css/style.css` — wspólne style (paleta: kamień, cegła, bursztyn; jasny i ciemny motyw)
- `assets/js/main.js` — porządek Mszy (`mszeDnia`: godziny i dopiski wg dnia tygodnia, okresu i miesiąca; w święta odsyła do ogłoszeń), z niego data i Msze dziś na stronie głównej i w pasku dnia; widżet liturgii dnia z niedziela.pl na `liturgia.html`; menu mobilne, „najbliższa Msza”, „dziś / jutro / za n dni” w najbliższych dniach, pokaz zdjęć ołtarza, status biura i zwiedzania, spis treści, okres liturgiczny, listy dokumentów, kopiowanie numerów kont
- `assets/fonts/` — Alegreya i Atkinson Hyperlegible Next (licencja SIL Open Font License), tylko znaki łacińskie z polskimi
- `assets/img/aktualnosci/` — plakaty wydarzeń z obecnej strony parafii: `<id>.jpg` na stronę wydarzenia, `<id>-m.jpg` (360 px) do kart i list
- `assets/img/` — zdjęcia Bursztynowego Ołtarza i bazyliki; zdjęcie prezbiterium: fot. Wojciech Chomka, źródła pozostałych do potwierdzenia
- `_partials/` — wspólne fragmenty stron: część `<head>`, nagłówek z menu, pasek dnia, stopka
- `assets/data/sentencje.json` — sentencje dnia, wspólne dla wszystkich parafii: dosłowne cytaty z Biblii Tysiąclecia; strona główna co dzień bierze kolejną
- `build.py` — wstawia fragmenty z `_partials/` do wszystkich stron
- `sprawdz_sentencje.py` — sprawdza każdą sentencję z tekstem Biblii Tysiąclecia (biblia.deon.pl); uruchomić po dodaniu albo zmianie sentencji
- `TODO.md` — lista rzeczy do zrobienia, m.in. funkcje przyszłego CRM dla biura parafialnego

## Nagłówek, menu i stopka

Wspólne fragmenty są w `_partials/`. W stronach oznaczają je komentarze `<!-- include: … -->` i `<!-- /include -->` — tego, co jest między nimi, nie edytuje się ręcznie, bo skrypt to nadpisze. Po zmianie fragmentu:

```bash
python3 build.py
```

`python3 build.py --check` tylko sprawdza, czy strony są aktualne. Skrypt sam dodaje `aria-current` w menu, ścieżki absolutne w `404.html`, a pasek dnia pomija na stronach z `<!-- include: header bez-paska -->` (strona główna).

## Podgląd lokalny

```bash
python3 -m http.server 8765 --bind 127.0.0.1
```

Potem otwórz http://127.0.0.1:8765.
