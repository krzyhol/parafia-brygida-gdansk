# Do zrobienia

## Przed uruchomieniem strony

- [ ] **Zarejestrować domenę w widżecie liturgii „Niedzieli”.** Regulamin (niedziela.pl/webmaster/regulamin, §4) wymaga zgłoszenia domeny i e-maila w formularzu na niedziela.pl/webmaster/liturgia. Zgłosić krzyhol.github.io (makieta). Domena brygida.gdansk.pl jest już zarejestrowana, bo obecna strona parafii korzysta z tego widżetu. Bez rejestracji widżet może odmówić: w teście odmówił dla pełnego adresu makiety, a dla samej domeny działał. Gdy odmówi, `liturgia.html` pokazuje tylko link do czytań w Niezbędniku Katolika.
- [ ] **Widżet a sprzedaż systemu innym parafiom.** Regulamin (§4) dopuszcza tylko użytek niekomercyjny, a grafik i linków widżetu nie wolno usuwać (§5). Każda parafia rejestruje swoją domenę sama. Czy widżet może być częścią płatnego produktu, trzeba ustalić z redakcją (liturgia@niedziela.pl).
- [ ] **Sentencje z Biblii Tysiąclecia a sprzedaż systemu.** Wspólna lista sentencji (`assets/data/sentencje.json`) to dosłowne cytaty z Biblii Tysiąclecia (Pallottinum). Przed sprzedażą systemu sprawdzić zasady cytowania przekładu w produkcie komercyjnym.

## System (CRM / panel biura parafialnego)

- [ ] **Porządek Mszy w święta i dni nietypowe.** Biuro parafialne dodaje w CRM datę z własnymi godzinami Mszy i dopiskami, np. Triduum, Wielkanoc, Boże Narodzenie, odpust parafialny albo zmiana porządku w wakacje. Taki wpis ma pierwszeństwo przed zwykłym porządkiem tygodnia.
  - Obecnie w makiecie (`mszeDnia` w `assets/js/main.js`): nie znamy godzin w Triduum, Wielkanoc, poniedziałek wielkanocny, Boże Ciało, 1 I, 6 I, 15 VIII, 1 XI i 24–26 XII. W te dni widżet „Msze święte dziś” i pasek dnia nie podają godzin, tylko „Dziś porządek świąteczny — godziny Mszy podajemy w ogłoszeniach”.
  - Do ustalenia z parafią: godziny Mszy w te dni, czy są stałe co roku i które jeszcze dni mają inny porządek (np. 2 XI, 3 V, 11 XI, Popielec).
- [ ] **Aktualności i wydarzenia ze zdjęciem.** Biuro dodaje w CRM wpis: tytuł, datę wydarzenia, opis, program i zdjęcie lub plakat. Z jednego wpisu powstaje karta w „Najbliższych dniach” na stronie głównej, pozycja w aktualnościach i strona wydarzenia. System sam zmniejsza zdjęcie do kart (jak `assets/img/aktualnosci/<id>-m.jpg`), a minione wydarzenia schodzą ze strony głównej. W makiecie są cztery takie strony (`wydarzenie-*.html`) z treścią i plakatami z obecnej strony parafii.
- [ ] **Osoby w parafii.** Biuro prowadzi w CRM listę osób: duszpasterzy i świeckich, np. organistkę. Każda osoba ma rolę, datę od kiedy i opcjonalnie opis. Zdjęcie i telefon są opcjonalne i domyślnie się nie wyświetlają. Proboszcz może mieć zdjęcie. Wikariusze prosili o prywatność, więc bez zdjęć i telefonów, także w innych miejscach strony, np. przy spowiedzi w językach obcych.
  - Do zdobycia: nowsze i większe zdjęcie proboszcza. Obecne ma 300×225 px i pochodzi z obecnej strony parafii.
- [ ] **Własna sentencja parafii** *(niski priorytet)*. Biuro wpisuje w CRM sentencję na wybrany dzień albo tydzień. Ma ona pierwszeństwo przed wspólną listą dla wszystkich parafii (`assets/data/sentencje.json`). Tej możliwości nie daje ISP, gdzie wszystkie parafie mają tę samą sentencję.
