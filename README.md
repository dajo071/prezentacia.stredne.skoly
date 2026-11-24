# Študuj na UNIZA a FPEDAS

Interaktívna prezentácia pre žiakov **Strednej odbornej školy obchodu a služieb v Martine**.
Prezentujú dvaja doktorandi Fakulty prevádzky a ekonomiky dopravy a spojov (FPEDAS) Žilinskej univerzity v Žiline (UNIZA).

Prezentácia nie je katalóg: ukazuje, čo sa deje medzi kliknutím na *Objednať* a zvonením kuriéra, a vedie od toho k programom, mapám, prijatiu a osobným príbehom oboch prezentujúcich.

## Spustenie

Bez inštalácie a bez build kroku. Stačí otvoriť `index.html` v prehliadači (Chrome, Edge, Firefox, Safari).

```bash
# voliteľne cez lokálny server
python3 -m http.server 8080   # potom http://localhost:8080
```

**Nasadenie na GitHub Pages:** *Settings → Pages → Deploy from a branch → `main` / `(root)`*. Súbor `.nojekyll` je pripravený.

## Ovládanie

| Kláves | Akcia |
| --- | --- |
| `→` `←`, `PageDown` `PageUp`, medzerník | ďalší / predchádzajúci slajd (`Shift`+medzerník späť) |
| `Home` `End` | prvý / posledný slajd |
| `F` | celá obrazovka (ukončí ju `Esc`) |
| `G` | prehľad slajdov |
| `N` | poznámky pre prezentujúceho priamo na plátne |
| `P` | okno prezentujúceho (poznámky, ďalší slajd, časovač), synchronizované s hlavným oknom |
| `S` | zdroje (len z klávesnice, nie sú na slajdoch) |
| `?` | prehľad ovládania |
| `1`–`4` | odpovede v kvíze (slajd 13) |
| `↑` `↓`, `T` | priemer a typ školy (slajd 11) |

Všetko sa dá ovládať aj kliknutím: navigácia v pätke (segmenty, šípky, prehľad), každý interaktívny prvok je tlačidlo.
Plátno má pevný pomer 16:9 (1920 × 1080) a škáluje sa na okno, takže vyzerá rovnako na notebooku aj projektore.

## Slajdy a rozdelenie medzi prezentujúcich

Doktorand **A** = Ing. Dávid Horník (Katedra ekonomiky), doktorand **B** = Ing. Michal Buchta (Katedra spojov).
**Podrobný scenár krok za krokom** (čo kliknúť, čo povedať, koho je rad, otázky z publika) je v súbore [`scenar.html`](scenar.html), dá sa vytlačiť (Ctrl+P). Stručné poznámky sú aj v okne prezentujúceho (`P`) a v `js/data.js` (`NOTES`). Celé trvanie ≈ 37 minút, bez slajdov „možno vynechať“ ≈ 29 minút.

| # | Slajd | Kto | Interakcia |
| --- | --- | --- | --- |
| 1 | Úvod | A + B | |
| 2 | UNIZA v skratke, 6 fakúlt | A | |
| 3 | Kampus: interaktívna mapa | B | klik na budovu / fakultu, záložky Fakulty a Študentský život, priblíženie |
| 4 | Nie je to len doprava: cesta objednávky | A | klik na stanice, odkazy na programy |
| 5 | Sedem katedier | B | rozbaľovanie (možno vynechať) |
| 6 | Čo môžeš študovať: 9 programov v 4 svetoch | A + B | klik na program |
| 7 | Tri stupne Bc. → Ing. → PhD. | A | klik na program ukáže nadväznosť |
| 8 | Štúdium nie sú len prednášky | B | rozbaľovanie kariet (možno vynechať) |
| 9 | Štipendium už počas štúdia | B | |
| 10 | Kde sa môžeš uplatniť | A + B | klik na pozíciu (možno vynechať) |
| 11 | Aj bez prijímačiek? | A | priemer, typ školy, termíny |
| 12 | Čo ťa čaká mimo prednášok | B | rozbaľovanie kariet |
| 13 | Kvíz (3 otázky) | A + B | odpovede, skóre |
| 14 | Príď sa pozrieť: 3 QR kódy, kontakty | A + B | |

Mená prezentujúcich sa menia v `js/data.js` (`PRESENTERS`). Zdroje k slajdom nie sú na slajdoch; zobrazia sa klávesom `S` a sú v `js/data.js` (`SOURCES`).

## Overené fakty a zistené rozdiely (stav 23. 11. 2026)

Všetky údaje sú z oficiálnych zdrojov (zoznam je v prezentácii, kláves `S`, a v `js/data.js`, objekt `SOURCES`). Čo sa nedalo overiť, v prezentácii nie je. Pri kontrole sa ukázalo:

- **UNIZA má dnes 6 fakúlt**, nie 7 (zadanie aj predošlá verzia uvádzali 7). Podľa uniza.sk je bývalá Fakulta humanitných vied súčasťou *Ústavu mediamatiky a kultúrneho dedičstva* (ÚMKD), ktorý je v prezentácii uvedený osobitne ako ústav.
- **Bakalárske programy v ponuke 2027/2028 sú 9.** Program *Dopravné služby v osobnej doprave* je v zozname 2026/2027, ale **nie v ponuke 2027/2028** (letáky FPEDAS aj uniza.sk). V prezentácii nie je; je to uvedené v poznámke pod slajdom 6.
- Inžinierske programy 2027/2028 neobsahujú *poštové inžinierstvo* (starý údaj); vodná doprava nemá inžiniersky program rovnakého názvu.
- **Študenti FPEDAS bývajú na internáte Hliny V**, nie na Veľkom Diele (Sprievodca prváka 2026/2027). Veľký Diel je určený pre SjF, FEIT, FRI, ÚMKD a VÚVB.
- Nie sú použité neoverené štatistiky z predošlej verzie (napr. počet dohôd Erasmus+, rôzne počty lôžok). Úplné čísla (1 972 študentov, 21 306 absolventov, 22 programov) sú z úvodnej stránky FPEDAS, „viac než 7 700 študentov“ z profilu UNIZA.
- Najbližší **deň otvorených dverí FPEDAS: 5. 2. 2027**, prihláška do **31. 3. 2027**, prijímačky **1. – 2. 6. 2027** (letáky FPEDAS 2027/2028).
- QR kód na slajde 15 vedie na stránky FPEDAS a elektronickú prihlášku. Odkaz *campus.uniza.sk* je uvedený len textom, lebo je vytlačený na oficiálnej mape a z prostredia, v ktorom vznikla táto verzia, sa nedal overiť.

### Mapa kampusu

Geometria budov a ciest je **vektorovo prevzatá z oficiálneho plánu areálu UNIZA** (PDF) a prekreslená vlastným štýlom, nie nakreslená odhadom. Oficiálny plán je orientovaný severom nadol; podľa jeho kompasu (a smerov na Centrum, Martin a Bratislavu) je v prezentácii **otočený severom hore** o 198,5°. Správnosť rozmiestnenia a otočenia bola skontrolovaná voči novej oficiálnej mape areálu z 11/2025 (podobnostná transformácia na 18 kotevných budovách, odchýlky v rámci presnosti odčítania, v dolnej časti tej mapy je zväčšený výrez). Športové centrum je doplnené z mapy 2025.
Priradenie budov k fakultám je podľa legendy Sprievodcu prváka 2026/2027 (FPEDAS = BF a AA, SjF = BA, BB, BJ, FEIT = BD, AB, SvF = AE, AF, FRI = RA, RB, RC, ÚMKD = AC, AD). Budovy bez priradenia sú neutrálne. FBI (Ul. 1. mája 32) a internát Hliny V sú mimo areálu, preto sú v zozname bez polohy na mape.
Mapa **nie je v mierke**; výška budov je len ilustračná.

## Vizuálna identita

- Farby, logo a písmo **Public Sans** podľa oficiálneho dizajn manuálu UNIZA. Farby fakúlt: FPEDAS `#0032A0`, SjF `#A6192E`, FEIT `#FF6A14`, SvF `#6CACE4`, FRI `#FFB81C`, FBI `#009A44`. Logá sú nezmenené originály (SVG) z uniza.sk.
- Jediný akcent v dizajne je oranžová `#FF6A14`: na každej obrazovke upozorňuje na jednu vec.
- Dizajn vychádza z [charles-design-laws](https://github.com/LemonFace0309/charles-skills/tree/main/skills/drops/charles-design-laws): ploché karty s jedným okrajom, žiadne tiene ani gradienty, jedna sada ikon, medzi skupinami dvojnásobný odstup ako vnútri nich, progresívne odhaľovanie (rozbaľovanie), žiadny úvodný tutoriál, jedna hlavná vec na obrazovku.
- Fotografie sú z oficiálnych kanálov UNIZA / FPEDAS (letecké zábery kampusu a budovy FPEDAS). Autorské práva k logám a fotografiám patria UNIZA / FPEDAS; písmo Public Sans je pod licenciou OFL (`assets/fonts/OFL.txt`).

## Štruktúra

```
index.html            všetky slajdy (statické HTML)
scenar.html           scenár pre prezentujúcich (tlačiteľný)
presenter.html        okno prezentujúceho
css/styles.css        dizajnový systém a štýly slajdov
js/data.js            obsah, poznámky, zdroje, kvíz (tu sa upravuje text)
js/campus-data.js     geometria mapy (generovaná z oficiálneho plánu)
js/map.js             renderer interaktívnej mapy
js/app.js             navigácia, interakcie, poznámky, okno prezentujúceho
assets/               logá, fotografie, QR kódy, písmo
```

Bez frameworku, bez závislostí a bez siete (všetko, vrátane písma, je lokálne), takže prezentácia funguje aj v škole bez internetu.
Dôvod: pôvodný repozitár bol prázdny a prezentácia je jedno plátno s niekoľkými interakciami; framework by pridal build krok bez úžitku.
