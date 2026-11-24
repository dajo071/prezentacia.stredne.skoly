/* ==========================================================================
   OBSAH PREZENTÁCIE – všetky fakty pochádzajú z oficiálnych zdrojov (pozri SOURCES).
   Stav overenia: 23. 11. 2026. Údaje o prijímaní a počte miest platia pre akademický rok 2027/2028.
   Čo nie je overené, tu nie je uvedené.
   ========================================================================== */
window.DECK = (function () {
  'use strict';

  /* ---------- Prezentujúci (doplniť pred prezentáciou; možno prepísať aj priamo v slajde 13 – klávesa E) ---------- */
  var PRESENTERS = {
    A: { name: 'Ing. Dávid Horník', dept: 'Katedra ekonomiky', role: 'Doktorand, absolvent Katedry ekonomiky' },
    B: { name: 'Ing. Michal Buchta', dept: 'Katedra spojov', role: 'Doktorand Katedry spojov' }
  };

  /* ---------- Oficiálne zdroje ---------- */
  var SOURCES = {
    zoznam:   { t: 'FPEDAS: Zoznam akreditovaných študijných programov 2026/2027', u: 'https://www.fpedas.uniza.sk/sk/uchadzaci/moznosti-studia/zoznam-akreditovanych-studijnych-programov' },
    programy: { t: 'UNIZA: Programy 2027–2028 (ponuka fakúlt)', u: 'https://www.uniza.sk/index.php/uchadzaci/moznosti-studia/programy-2027-2028' },
    bc:       { t: 'FPEDAS: Bakalárske štúdium, profily a uplatnenie absolventov', u: 'https://www.fpedas.uniza.sk/sk/uchadzaci/moznosti-studia/bakalarske-studium' },
    letakBc:  { t: 'FPEDAS: Informačný leták pre bakalárske štúdium 2027/2028 (PDF)', u: 'https://www.fpedas.uniza.sk/images/prijimacie_konanie/FPEDAS_BC_2027_2028_infoletak.pdf' },
    letakIng: { t: 'FPEDAS: Informačný leták pre inžinierske štúdium 2027/2028 (PDF)', u: 'https://www.fpedas.uniza.sk/images/prijimacie_konanie/FPEDAS_ING_2027_2028_infoletak_v2.pdf' },
    letakPhd: { t: 'FPEDAS: Informačný leták pre doktorandské štúdium 2027/2028 (PDF)', u: 'https://www.fpedas.uniza.sk/images/prijimacie_konanie/FPEDAS_PHD_2027_2028_infoletak.pdf' },
    prij:     { t: 'FPEDAS: Prijímacie konania (termíny, podmienky)', u: 'https://www.fpedas.uniza.sk/sk/uchadzaci/vseobecne-informacie/prijimacie-konania' },
    katedry:  { t: 'FPEDAS: Katedry', u: 'https://www.fpedas.uniza.sk/sk/fakulta/pracoviska-fakulty/katedry' },
    fpedas:   { t: 'FPEDAS: úvodná stránka (počet študentov, absolventov, programov)', u: 'https://www.fpedas.uniza.sk/' },
    profil:   { t: 'UNIZA: Profil univerzity', u: 'https://www.uniza.sk/index.php/univerzita/vseobecne-informacie/profil-univerzity' },
    fakulty:  { t: 'UNIZA: Fakulty', u: 'https://www.uniza.sk/index.php/univerzita/pracoviska-univerzity/fakulty' },
    preco:    { t: 'UNIZA: Prečo študovať na UNIZA', u: 'https://www.uniza.sk/index.php/uchadzaci/vseobecne-informacie/preco-studovat-na-uniza' },
    ubyt:     { t: 'UNIZA: Možnosti ubytovania', u: 'https://www.uniza.sk/index.php/uchadzaci/studentsky-zivot/moznosti-ubytovania' },
    sprievodca:{ t: 'UNIZA: Sprievodca prváka 2026/2027 (PDF)', u: 'https://www.uniza.sk/images/pdf/sprievodca-prvaka/sprievodca-prvaka-2026-2027.pdf' },
    mapa18:   { t: 'UNIZA: Mapa areálu (oficiálny plán, PDF)', u: 'https://www.fpedas.uniza.sk/images/mapa_arealu_uniza.pdf' },
    mapa25:   { t: 'UNIZA: Areál Veľký Diel – mapa parkovísk (11/2025, PNG)', u: 'https://www.uniza.sk/images/fotogaleria/mapa/10112025_UNIZA-mapa-parkoviska.png' },
    manual:   { t: 'UNIZA: Dizajn manuál (farby, logo, písmo Public Sans)', u: 'https://www.fpedas.uniza.sk/images/uradna_tabula/dizajn_manual_UNIZA.pdf' },
    loga:     { t: 'UNIZA: Oficiálne logá', u: 'https://www.uniza.sk/index.php/verejnost/informacne-materialy/loga' },
    stip:     { t: 'Katedra spojov: Štipendijný program', u: 'https://ks.uniza.sk/sk/uchadzaci/stipendijny-program' },
    hmi:      { t: 'HMI-LAB UNIZA', u: 'https://hmi-lab.uniza.sk/' },
    prihlaska:{ t: 'UNIZA: Elektronická prihláška', u: 'https://vzdelavanie.uniza.sk/prijimacky/index.php' }
  };

  /* ---------- Fakulty (farby podľa dizajn manuálu UNIZA) ---------- */
  var FACULTIES = {
    fpedas: { abbr: 'FPEDAS', name: 'Fakulta prevádzky a ekonomiky dopravy a spojov', color: '#0032A0', ink: '#fff',
      focus: 'Doprava, spoje a logistika spolu s ekonomikou a manažmentom: od vlakov a lietadiel po e-shopy a financie podniku.',
      bld: 'BF a AA', web: 'fpedas.uniza.sk', hero: true },
    sjf:    { abbr: 'SjF', name: 'Strojnícka fakulta', color: '#A6192E', ink: '#fff',
      focus: 'Strojárstvo, konštrukcia strojov, energetika, priemyselné inžinierstvo a automatizácia výroby.',
      bld: 'BA, BB a BJ', web: 'fstroj.uniza.sk' },
    feit:   { abbr: 'FEIT', name: 'Fakulta elektrotechniky a informačných technológií', color: '#FF6A14', ink: '#002D72',
      focus: 'Informačné a komunikačné technológie, telekomunikácie, výkonová elektronika a riadenie elektrických sietí.',
      bld: 'BD a AB', web: 'feit.uniza.sk' },
    svf:    { abbr: 'SvF', name: 'Stavebná fakulta', color: '#6CACE4', ink: '#002D72',
      focus: 'Cestné, železničné a pozemné staviteľstvo, dopravné stavby, geodézia a manažment stavieb.',
      bld: 'AE a AF', web: 'svf.uniza.sk' },
    fri:    { abbr: 'FRI', name: 'Fakulta riadenia a informatiky', color: '#FFB81C', ink: '#002D72',
      focus: 'Informatika, počítačové inžinierstvo a manažment na jednom mieste.',
      bld: 'RA, RB a RC', web: 'fri.uniza.sk' },
    fbi:    { abbr: 'FBI', name: 'Fakulta bezpečnostného inžinierstva', color: '#009A44', ink: '#fff',
      focus: 'Krízový manažment, hasičské a záchranné zložky, ochrana osôb a majetku.',
      bld: 'Ul. 1. mája 32, centrum Žiliny', web: 'fbi.uniza.sk', offmap: true }
  };

  /* ---------- Katedry FPEDAS (oficiálne popisy skrátené) ---------- */
  var DEPTS = [
    { id: 'cmd', g: 'doprava', n: 'Katedra cestnej a mestskej dopravy', t: 'Technológie cestnej a mestskej dopravy, dopravné inžinierstvo, hromadná osobná doprava, cestné vozidlá a dopravné plánovanie.' },
    { id: 'zel', g: 'doprava', n: 'Katedra železničnej dopravy', t: 'Železničné dopravné a prepravné procesy, ekonomika a manažment železničnej dopravy, intermodálna preprava a logistika.' },
    { id: 'let', g: 'doprava', n: 'Katedra leteckej dopravy', t: 'Centrum vzdelávania, výskumu a výcviku v civilnom letectve.' },
    { id: 'vod', g: 'doprava', n: 'Katedra vodnej dopravy', t: 'Centrum vzdelávania a výskumu v oblasti vnútrozemskej riečnej a námornej plavby.' },
    { id: 'spo', g: 'doprava', n: 'Katedra spojov', mine: 'B', t: 'Profilová katedra pre odborníkov v oblasti informačno-komunikačných technológií, poštových, logistických a zasielateľských služieb a v telekomunikačných a sieťových podnikoch.' },
    { id: 'eko', g: 'ekonomika', n: 'Katedra ekonomiky', mine: 'A', t: 'Základné aj špecializované ekonomické, právne a sociálne predmety na všetkých odboroch FPEDAS a vybraných odboroch ďalších fakúlt.' },
    { id: 'kvm', g: 'ekonomika', n: 'Katedra kvantitatívnych metód a hospodárskej informatiky', t: 'Matematické a informatické predmety vo všetkých študijných programoch FPEDAS.' }
  ];

  /* ---------- Bakalárske programy 2027/2028 ---------- */
  /* seats = plánovaný počet prijatých (denné štúdium, slovensky), en = navyše v angličtine; cat = kategória */
  var CATS = {
    biz:  { n: 'Biznis, ekonomika a financie', c: '#0032A0' },
    eco:  { n: 'E-commerce a moderné služby',  c: '#FF6A14' },
    log:  { n: 'Logistika a distribúcia',      c: '#009A44' },
    mob:  { n: 'Doprava a mobilita',           c: '#6CACE4' }
  };

  var PROGRAMS = [
    { id: 'emp', n: 'Ekonomika a manažment podniku', s: 'Ekonomika a manažment podniku', cat: 'biz', seats: 140, ing: true,
      learn: ['Ako funguje firma: ekonomika podniku, manažment, podnikové financie', 'Kalkulácie a rozpočty, marketing, riadenie ľudských zdrojov', 'Popri tom právo, účtovníctvo a informatika'],
      practice: ['Analýza ekonomických procesov v podniku a manažérske rozhodnutia', 'Plánovanie a organizovanie podnikových procesov'],
      jobs: 'Nižší a stredný stupeň riadenia podnikov, inštitúcie verejného sektora a ďalšie organizácie.',
      limits: { gym: 1.5, sos: 1.2 }, tags: ['biz', 'fin', 'eob'] },
    { id: 'fin', n: 'Finančný manažment', s: 'Finančný manažment', cat: 'biz', seats: 75, ing: true,
      learn: ['Financovanie podnikania a finančné účtovníctvo', 'Finančno-ekonomická analýza a finančné rozhodovanie', 'Medzinárodné a verejné financie'],
      practice: ['Finančné riadenie podniku', 'Finančný manažér projektov a grantov EÚ'],
      jobs: 'Malé a stredné podniky doma aj v zahraničí, finančný manažér orgánov štátnej správy a samosprávy.',
      limits: { gym: 1.6, sos: 1.5 }, tags: ['fin', 'biz'] },
    { id: 'eob', n: 'Elektronický obchod a manažment', s: 'Elektronický obchod a manažment', cat: 'eco', seats: 80, ing: true,
      learn: ['Ako fungujú obchod a služby online, od objednávky po účtovanie', 'Dva smery: elektronická podpora procesov alebo finančná stránka e-podnikania', 'Informačné a komunikačné technológie v podniku'],
      practice: ['Riadenie predaja a obchodných procesov v e-shope', 'Služby podniku podporené technológiami'],
      jobs: 'Prevádzkový manažér, odborný pracovník, obchodný zástupca, manažér predaja, konzultant alebo supervízor; aj vlastný podnik v obchode a službách.',
      limits: { gym: 1.6, sos: 1.5 }, tags: ['eob', 'biz', 'tech'] },
    { id: 'dts', n: 'Distribučné technológie a služby', s: 'Distribučné technológie a služby', cat: 'log', seats: 40, ing: true,
      learn: ['Distribučná logistika: poštové a logistické trhy, siete a služby (aj v e-commerce)', 'Dva smery: technológie a prevádzka, alebo manažment, ekonomika a marketing', 'Predaj poštových, digitálnych, poistných a bankových produktov'],
      practice: ['Ako prejde zásielka sieťou od odosielateľa k adresátovi', 'Analýza príležitostí na poštových a logistických trhoch'],
      jobs: 'Logistické podniky, poisťovne a banky, verejná správa (napr. regulácia poštových služieb), vlastné podnikanie.',
      limits: { gym: 1.8, sos: 1.6 }, tags: ['log', 'eob', 'tech'] },
    { id: 'zal', n: 'Zasielateľstvo a logistika', s: 'Zasielateľstvo a logistika', cat: 'log', seats: 90, ing: true,
      learn: ['Objednávanie a plánovanie dopravných služieb', 'Znalosti podľa medzinárodných štandardov FIATA', 'Prepravné reťazce a dodávky vo výrobe a distribúcii'],
      practice: ['Objednanie prepravy pre veľkú výrobnú alebo distribučnú firmu', 'Práca v nadnárodnej logistickej spoločnosti'],
      jobs: 'Zasielateľ, dopravný manažér; zasielateľské, dopravné a logistické firmy aj v zahraničí.',
      limits: { gym: 1.8, sos: 1.6 }, tags: ['log', 'doprava'] },
    { id: 'cesta', n: 'Cestná doprava', s: 'Cestná doprava', cat: 'mob', seats: 120, ing: true,
      learn: ['Plánovanie a riadenie nákladnej, autobusovej dopravy a taxislužby', 'Dopravné inžinierstvo, cestné vozidlá a ich prevádzka', 'Doprava v mestách a regiónoch'],
      practice: ['Plánovanie dopravnej obsluhy regiónu', 'Servis, technická a emisná kontrola, predaj vozidiel'],
      jobs: 'Dopravné a priemyselné podniky, štátna správa, servisy vozidiel a stanice technickej kontroly.',
      limits: { gym: 1.8, sos: 1.6 }, tags: ['doprava'] },
    { id: 'zel', n: 'Železničná doprava', s: 'Železničná doprava', cat: 'mob', seats: 75, ing: true,
      learn: ['Prevádzka a riadenie železničnej dopravy a intermodálnej prepravy', 'Ekonomika a manažment dopravného podniku', 'Výsledky dopravy: ekonomické, obchodné aj prevádzkové'],
      practice: ['Kurzy so ŽSR: signalista, dozorca výhybiek, výhybkár, výpravca', 'Z tohto odboru univerzita vyrástla'],
      jobs: 'Riadenie železničnej prevádzky, zasielateľské a logistické podniky, štátna správa a samospráva.',
      limits: { gym: 1.8, sos: 1.6 }, tags: ['doprava'] },
    { id: 'let', n: 'Letecká doprava', s: 'Letecká doprava (aj profesionálny pilot)', cat: 'mob', seats: 75, en: 15, ing: true,
      learn: ['Navigácia, meteorológia, komunikačné systémy, plánovanie a monitorovanie letu', 'Letecké prístroje, pohonné jednotky a konštrukcia lietadiel', 'Organizácia a riadenie civilného letectva, letecké právo'],
      practice: ['Špecializácia Profesionálny pilot: teória na licenciu ATPL zdarma, prax hradia študenti', 'Výcvik v Leteckom výcvikovom a vzdelávacom centre UNIZA'],
      jobs: 'Letecká prevádzka; ako profesionálny pilot po získaní licencie. Zdravotná spôsobilosť I. triedy je podmienkou pre pilotov.',
      limits: { gym: 1.5, sos: 1.5, pilot: 1.2 }, tags: ['doprava', 'tech'] },
    { id: 'vod', n: 'Vodná doprava', s: 'Vodná doprava', cat: 'mob', seats: 25, ing: false,
      learn: ['Vnútrozemská a námorná plavba, prístavy', 'Ako sa riadia prepravné a logistické procesy po vode', 'Správa a údržba vodných ciest'],
      practice: ['Funkcia lodného kadeta na lodi vnútrozemskej plavby', 'Po získaní plavebnej praxe kapitán a veliteľ lode'],
      jobs: 'Dopravné a zasielateľské firmy, prístavy, osobná lodná preprava v cestovnom ruchu, štátny odborný dozor, multimodálne logistické centrá.',
      limits: { gym: 1.8, sos: 1.6 }, tags: ['doprava'] }
  ];

  /* ---------- Cesta objednávky (slajd 4) ---------- */
  var JOURNEY = [
    { id: 'obj', t: 'Objednávka', q: 'Zákazník klikne na Objednať. E-shop prijme objednávku a spustí celý proces.', p: ['eob'], who: 'Riadenie e-shopu, predaja a obchodných procesov.' },
    { id: 'fin', t: 'Peniaze', q: 'Platba prejde. Firma musí vedieť, koľko zarobila a čo ju to stálo.', p: ['fin', 'emp'], who: 'Financie podniku, rozpočty, kalkulácie a rozhodovanie s peniazmi.' },
    { id: 'sklad', t: 'Sklad a preprava', q: 'Tovar sa nájde, zabalí a niekto musí objednať prepravu.', p: ['zal'], who: 'Zasielateľ, dopravný manažér.' },
    { id: 'cesta', t: 'Na ceste', q: 'Zásielka putuje po ceste, železnici, vzduchom alebo po vode.', p: ['cesta', 'zel', 'let', 'vod'], who: 'Plánovanie a riadenie dopravy.' },
    { id: 'dist', t: 'Doručenie', q: 'Zásielka prejde sieťou a skončí u adresáta.', p: ['dts'], who: 'Distribučné siete a služby, poštové a logistické podniky.' }
  ];

  /* ---------- Kde sa uplatniť (slajd 10); pozície podľa oficiálnych profilov absolventov ---------- */
  var ROLES = [
    { cat: 'biz', r: 'Finančný manažér projektov a grantov EÚ', p: 'fin' },
    { cat: 'biz', r: 'Manažér v malom a strednom podniku', p: 'fin' },
    { cat: 'biz', r: 'Manažér na nižšom a strednom stupni riadenia', p: 'emp' },
    { cat: 'eco', r: 'Manažér predaja', p: 'eob' },
    { cat: 'eco', r: 'Obchodný zástupca', p: 'eob' },
    { cat: 'eco', r: 'Konzultant a supervízor', p: 'eob' },
    { cat: 'log', r: 'Zasielateľ', p: 'zal' },
    { cat: 'log', r: 'Dopravný manažér', p: 'zal' },
    { cat: 'log', r: 'Pracovník poštových a distribučných sietí', p: 'dts' },
    { cat: 'mob', r: 'Výpravca (po kurze so ŽSR)', p: 'zel' },
    { cat: 'mob', r: 'Plánovač cestnej dopravy', p: 'cesta' },
    { cat: 'mob', r: 'Lodný kadet, neskôr kapitán', p: 'vod' },
    { cat: 'mob', r: 'Profesionálny pilot', p: 'let' }
  ];

  /* ---------- Praktické príklady (slajd 9) ---------- */
  var PRAX = [
    { h: 'Podniky z praxe', s: 'Spolupráca', t: 'Firmy sú súčasťou štúdia.', d: 'Fakulta spolupracuje s podnikmi, napríklad so Slovenskou poštou (štipendijný program, témy záverečných prác, odborná prax). UNIZA spolupracuje aj s firmami ako Huawei, Siemens, ŽSR či Kia Motors Slovakia.', src: 'stip' },
    { h: 'Špecializované laboratóriá', s: 'Technika na dosah', t: 'AIDC a HMI-LAB.', d: 'AIDC je laboratórium zamerané na technológie automatickej identifikácie a zberu dát. HMI-LAB v Univerzitnom vedeckom parku skúma, ako ľudia vnímajú a používajú technológie (sledovanie pohľadu, mozgová aktivita, stres).', src: 'hmi' },
    { h: 'Povolanie podnikateľ', s: 'Od nápadu k startupu', t: 'Skús si vlastný startup počas štúdia.', d: 'Celouniverzitný predmet pre študentov všetkých fakúlt. Workshopy, mentori z praxe a súťaž na konci.', src: 'sprievodca' },
    { h: 'Prednášky z praxe', s: 'Čerstvo z fakulty', t: 'Ľudia z firiem priamo na fakulte.', d: 'Napríklad prednáška o reverznej logistike (spätné zvozy) od vedúceho tímu dopravy spoločnosti Kaufland, november 2026.', src: 'fpedas' }
  ];

  /* ---------- Život na univerzite (slajd 12) ---------- */
  var LIFE = [
    { k: 'Bývanie', big: '59 – 71 €', unit: 'mesačne', d: 'Nárok na ubytovanie majú všetci prváci bakalárskeho štúdia (podľa vnútorných predpisov univerzity). Študenti FPEDAS bývajú na internáte Hliny V, asi 10 minút pešo od centra mesta.', src: 'letakBc' },
    { k: 'Jedlo', big: '1,30 – 4,80 €', unit: 'jedlo v univerzitnej jedálni', d: 'Hlavné jedálne sú Nová menza na Veľkom Diele a Stará menza na Hlinách. Platí sa preukazom ISIC cez elektronickú peňaženku.', src: 'sprievodca' },
    { k: 'Šport', big: 'až 30', unit: 'športov na výber', d: 'Atletický štadión (8 dráh, 400 m, certifikát Svetovej atletiky), nové Športové centrum (kapacita 1 500 miest), Fit-club a športcentrum na Hlinách.', src: 'sprievodca' },
    { k: 'Peniaze', big: 'Štipendiá', unit: 'sociálne a motivačné', d: 'Motivačné štipendium dostanú študenti za výsledky v štúdiu alebo mimoriadny úspech, bez nutnosti žiadať.', src: 'sprievodca' },
    { k: 'Spolky', big: 'Rádio, kluby', unit: 'študentské organizácie', d: 'Na Hlinách napríklad rádio RAPEŠ a Klub priateľov železníc, do ktorých sa dá dostať konkurzom.', src: 'sprievodca' },
    { k: 'Svet', big: 'Erasmus+', unit: 'štúdium v zahraničí', d: 'Univerzita spolupracuje s viac než 150 univerzitami po celom svete.', src: 'preco' }
  ];

  /* ---------- Kvíz (slajd 14) ---------- */
  var QUIZ = [
    { q: 'V roku 1953 vznikla univerzita, z ktorej sa neskôr stala UNIZA. Ako sa pôvodne volala?',
      o: ['Vysoká škola železničná', 'Vysoká škola obchodná', 'Vysoká škola poštová', 'Vysoká škola leteckej dopravy'], a: 0,
      f: 'Vznikla 1. septembra 1953 vyčlenením z ČVUT v Prahe. Do Žiliny sa presťahovala v roku 1960.', src: 'profil' },
    { q: 'Ktorý z týchto odborov sa naozaj dá študovať na FPEDAS?',
      o: ['Kozmická doprava', 'Vodná doprava', 'Podzemná doprava', 'Lanová doprava'], a: 1,
      f: 'Vodná doprava je najmenší program: 25 miest. Absolvent môže začať ako lodný kadet a časom sa stať kapitánom.', src: 'bc' },
    { q: 'Koľko stojí prihláška na bakalárske štúdium na FPEDAS pre občana EÚ?',
      o: ['10 €', '40 €', '100 €', 'Je zadarmo'], a: 1,
      f: 'Poplatok je 40 € a platí sa prevodom z účtu. Na každý program sa podáva samostatná prihláška.', src: 'letakBc' }
  ];

  /* ---------- Poznámky pre prezentujúcich ---------- */
  /* who: A = absolvent Katedry ekonomiky, B = Katedra spojov, AB = obaja;  min = orientačný čas;  opt = možno vynechať pri kratšej verzii */
  var NOTES = [
    { id: 'uvod', title: 'Úvod', who: 'AB', min: 1, idea: 'Predstavíme sa a povieme, prečo tu sme: ukázať reálnu cestu na vysokú školu.',
      say: ['Kto sme: dvaja doktorandi FPEDAS, každý z iného smeru.', 'Nebude to reklama, ukážeme vám, ako to naozaj funguje.', 'Na konci vás čaká kvíz.'], ask: 'Kto z vás už vie, kam pôjde po maturite? (ruky hore)' },
    { id: 'uniza', title: 'UNIZA v skratke', who: 'A', min: 2, idea: 'UNIZA je 70-ročná univerzita so šiestimi fakultami, kde sa doprava stretáva s ekonómiou, informatikou či stavbami.',
      say: ['Začínali sme ako Vysoká škola železničná v roku 1953.', 'Dnes šesť fakúlt a viac než 7 700 študentov.', 'Povedz, čo ťa najviac prekvapilo, keď si sem prišiel (vlastná skúsenosť).'], ask: 'Poznáte niekoho, kto študuje v Žiline?' },
    { id: 'kampus', title: 'Kampus', who: 'B', min: 3.5, idea: 'Celé je to na jednom mieste. Fakulty v jednom areáli, internáty a šport hneď vedľa.',
      say: ['Klikni na FPEDAS: ukáže sa, kde fakulta sídli.', 'Prejdi ostatné fakulty jednou vetou, mapa je rovnaká ako oficiálna.', 'Prepni na Študentský život: knižnica, menza, štadión.', 'Poznámka: FPEDAS študenti bývajú na Hlinách V, nie na Veľkom Diele.'], ask: 'Kto z vás bol niekedy na vysokoškolskom kampuse?' },
    { id: 'preco', title: 'Prečo FPEDAS', who: 'A', min: 3.5, idea: 'FPEDAS nie je len o doprave. Je o všetkom, čo sa stane medzi kliknutím na Objednať a zvonením kuriéra.',
      say: ['Prejdi cestu objednávky krok za krokom a klikaj na stanice.', 'Pri každej stanici povedz, kto to rieši a ktorý program to študuje.', 'Spoj to s tým, čo robia na obchodnej škole: ekonomika, financie, zákazník.'], ask: 'Čo sa podľa vás stane hneď po kliknutí na Objednať?' },
    { id: 'katedry', title: 'Katedry', who: 'B', min: 2.5, opt: true, idea: 'Fakulta má sedem katedier. Každý z nás je z jednej z nich.',
      say: ['Čísla: 1 972 študentov, 21 306 absolventov, 22 programov (všetky stupne).', 'Katedra spojov: IKT, poštové, logistické a zasielateľské služby.', 'Katedra ekonomiky učí ekonómiu na celej fakulte.'], ask: 'Ktorá katedra vás zaujala najviac?' },
    { id: 'programy', title: 'Čo môžeš študovať', who: 'AB', min: 4, idea: 'Deväť bakalárskych programov v štyroch svetoch. Nejde o názvy, ale o to, čo budeš robiť.',
      say: ['A: Biznis a financie, e-commerce (naša oblasť).', 'B: Logistika, distribúcia a doprava.', 'Klikni na jeden program a prečítaj, čo sa naučíš a kde sa uplatníš.', 'Pozn.: Dopravné služby v osobnej doprave je len v zozname 2026/2027, v ponuke 2027/2028 nie je.'], ask: 'Ktorý z programov by ste neočakávali na dopravnej fakulte?' },
    { id: 'stupne', title: 'Tri stupne štúdia', who: 'A', min: 2.5, idea: 'Bc., Ing., PhD.: tri stupne na jednej fakulte. Moja vlastná cesta je ukážkou.',
      say: ['Bc. 3 roky, Ing. 2 roky, PhD. 3 roky.', 'Klikni na bakalársky program a uvidíš, na čo nadväzuje.', 'Vlastná cesta: od bakalára cez inžiniera k doktorandskému štúdiu (doplniť skúsenosť).'], ask: 'Viete, čo je rozdiel medzi bakalárom a inžinierom?' },
    { id: 'prax', title: 'Štúdium v praxi', who: 'B', min: 2.5, opt: true, idea: 'Štúdium nie sú len prednášky: firmy, laboratóriá, vlastný startup.',
      say: ['Podniky z praxe: Slovenská pošta, Kaufland, firmy spolupracujúce s univerzitou.', 'Laboratóriá: AIDC (automatická identifikácia a zber dát) a HMI-LAB.', 'Povolanie podnikateľ: predmet, kde si skúsiš vlastný startup.'], ask: 'Čo by ste si radi vyskúšali v praxi už počas štúdia?' },
    { id: 'stipendium', title: 'Štipendium', who: 'B', min: 2, idea: 'Niektoré firmy platia štipendium už počas štúdia. Pre študentov Katedry spojov je to Slovenská pošta.',
      say: ['750 € za semester pri priemere do 1,5, 600 € pri priemere do 2,5.', 'Postup: žiadosť, pohovor, lekárska prehliadka, zmluva.', 'Záväzok: po štátniciach trojročná pracovná zmluva. Povedz to otvorene.'], ask: 'Čo by ste robili s 750 € mesačne? (pozor: je to za semester)' },
    { id: 'po', title: 'Po škole', who: 'AB', min: 2.5, opt: true, idea: 'Konkrétne pozície z oficiálnych profilov absolventov.',
      say: ['Klikni na pozíciu: uvidíš, z ktorého programu vedie.', 'A: financie, e-commerce, manažment.', 'B: logistika, distribúcia, doprava.', 'Nehovor o platoch ani štatistikách uplatnenia: nemáme ich overené.'], ask: 'Ktorá z týchto pozícií by vás bavila?' },
    { id: 'prijatie', title: 'Ako sa dostať', who: 'A', min: 3, idea: 'Vedieť, že existuje cesta bez prijímačiek, a že termíny sú v jari.',
      say: ['Vyber typ školy a priemer za predposledný ročník.', 'Stačí splniť jednu z podmienok (priemer, súťaže, SCIO, inak test).', 'Prihláška do 31. 3. 2027, prijímačky 1. až 2. 6. 2027.', 'Najbližší deň otvorených dverí: 5. 2. 2027.'], ask: 'Aký priemer ste mali v treťom ročníku?' },
    { id: 'zivot', title: 'Život na univerzite', who: 'B', min: 3, idea: 'Bývanie, jedlo, šport a spolky. Čo ťa čaká mimo prednášok.',
      say: ['Kliknutím rozbaľ kartu, ktorá ťa zaujíma.', 'Povedz, kde bývaš a ako vyzerá bežný deň (vlastná skúsenosť).', 'Ceny sú z oficiálneho letáku 2027/2028.'], ask: 'Čo vás zaujíma najviac: bývanie, jedlo alebo šport?' },
    { id: 'kviz', title: 'Kvíz', who: 'AB', min: 3, idea: 'Tri otázky na zapojenie publika. Odpovede sú z oficiálnych zdrojov.',
      say: ['Prečítaj otázku, nechaj hlasovať rukami (A, B, C, D).', 'Potom klikni na odpoveď: ukáže sa správna aj zaujímavosť.', 'Na konci vyhodnoť skóre triedy.'], ask: 'Kto mal všetky tri správne?' },
    { id: 'zaver', title: 'Záver', who: 'AB', min: 1, idea: 'Pozvánka pozrieť si univerzitu naživo a overiť si všetko na oficiálnych stránkach.',
      say: ['Tri QR kódy: ponuka štúdia, prijímacie konanie, elektronická prihláška.', 'Deň otvorených dverí FPEDAS: 5. 2. 2027.', 'Poďakovanie a otázky.'], ask: 'Máte nejaké otázky?' }
  ];

  return { PRESENTERS: PRESENTERS, SOURCES: SOURCES, FACULTIES: FACULTIES, DEPTS: DEPTS, CATS: CATS, PROGRAMS: PROGRAMS,
    JOURNEY: JOURNEY, ROLES: ROLES, PRAX: PRAX, LIFE: LIFE, QUIZ: QUIZ, NOTES: NOTES };
})();
