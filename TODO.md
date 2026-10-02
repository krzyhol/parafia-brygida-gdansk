# Do zrobienia

## Przed uruchomieniem strony

- [ ] **Zarejestrować domenę w widżecie liturgii „Niedzieli”.** Regulamin (niedziela.pl/webmaster/regulamin, §4) wymaga zgłoszenia domeny i e-maila w formularzu na niedziela.pl/webmaster/liturgia. Zgłosić krzyhol.github.io (makieta) i docelową domenę parafii. Bez rejestracji widżet może odmówić: w teście odmówił dla pełnego adresu makiety, a dla samej domeny działał. Gdy odmówi, `liturgia.html` pokazuje tylko link do czytań w Niezbędniku Katolika.
- [ ] **Widżet a sprzedaż systemu innym parafiom.** Regulamin (§4) dopuszcza tylko użytek niekomercyjny, a grafik i linków widżetu nie wolno usuwać (§5). Każda parafia rejestruje swoją domenę sama. Czy widżet może być częścią płatnego produktu, trzeba ustalić z redakcją (liturgia@niedziela.pl).

## System (CRM / panel biura parafialnego)

- [ ] **Porządek Mszy w święta i dni nietypowe.** Biuro parafialne dodaje w CRM datę z własnymi godzinami Mszy i dopiskami, np. Triduum, Wielkanoc, Boże Narodzenie, odpust parafialny albo zmiana porządku w wakacje. Taki wpis ma pierwszeństwo przed zwykłym porządkiem tygodnia.
  - Obecnie w makiecie (`mszeDnia` w `assets/js/main.js`): nie znamy godzin w Triduum, Wielkanoc, poniedziałek wielkanocny, Boże Ciało, 1 I, 6 I, 15 VIII, 1 XI i 24–26 XII. W te dni widżet „Msze święte dziś” i pasek dnia nie podają godzin, tylko „Dziś porządek świąteczny — godziny Mszy podajemy w ogłoszeniach”.
  - Do ustalenia z parafią: godziny Mszy w te dni, czy są stałe co roku i które jeszcze dni mają inny porządek (np. 2 XI, 3 V, 11 XI, Popielec).
