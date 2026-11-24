/* ==========================================================================
   Aplikácia prezentácie: plátno 16:9, navigácia, interaktívne slajdy, poznámky, okno prezentujúceho.
   Bez závislostí a bez build kroku: funguje aj po otvorení index.html zo súboru.
   ========================================================================== */
(function () {
  'use strict';
  var D = window.DECK;
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function mk(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function dec(n) { return String(n).replace('.', ','); }
  function prog(id) { return D.PROGRAMS.filter(function (p) { return p.id === id; })[0]; }

  var stage = $('#stage'), slides = $$('.slide'), N = slides.length, cur = -1, scale = 1;

  /* ---------- plátno 16:9 ---------- */
  function fit() {
    var w = window.innerWidth, h = window.innerHeight; scale = Math.min(w / 1920, h / 1080);
    stage.style.transform = 'translate(' + ((w - 1920 * scale) / 2) + 'px,' + ((h - 1080 * scale) / 2) + 'px) scale(' + scale + ')';
    if (window.CampusMap) window.CampusMap.relayout();
    if (levBuilt) drawLine();
  }
  window.addEventListener('resize', fit);

  /* ---------- 02 fakulty ---------- */
  (function () {
    var box = $('#facList'), F = D.FACULTIES;
    ['fpedas', 'sjf', 'feit', 'svf', 'fri', 'fbi'].forEach(function (k, i) {
      var f = F[k], r = mk('div', 'fac' + (f.hero ? ' hero' : ''));
      r.style.setProperty('--c', f.color); r.setAttribute('data-in', ''); r.style.setProperty('--i', i + 1);
      r.innerHTML = '<i></i><span class="ab">' + esc(f.abbr) + '</span><span class="tx"><b>' + esc(f.name) + '</b>' + esc(f.focus) + '</span>';
      box.appendChild(r);
    });
    var u = mk('div', 'fac aside'); u.setAttribute('data-in', ''); u.style.setProperty('--i', 8); u.style.setProperty('--c', '#9AA7C0');
    u.innerHTML = '<i></i><span class="ab" style="font-size:30px">ÚMKD</span><span class="tx"><b style="font-size:24px;margin:0">Ústav mediamatiky a kultúrneho dedičstva</b></span>';
    box.appendChild(u);
  })();

  /* ---------- 04 cesta objednávky ---------- */
  var jsel = 0;
  function buildJourney() {
    var box = $('#journey');
    D.JOURNEY.forEach(function (s, i) {
      var b = mk('button', 'jstop'); b.setAttribute('aria-pressed', 'false'); b.dataset.i = i;
      b.innerHTML = '<span class="dot">' + (i + 1) + '</span><span class="t">' + esc(s.t) + '</span>';
      b.addEventListener('click', function () { setJourney(i); });
      box.appendChild(b);
    });
    setJourney(0);
  }
  function setJourney(i) {
    jsel = i; var s = D.JOURNEY[i];
    $$('.jstop').forEach(function (b, k) { b.classList.toggle('on', k === i); b.classList.toggle('done', k < i); b.setAttribute('aria-pressed', k === i); });
    $('#jfill').style.width = (i / (D.JOURNEY.length - 1) * 100) + '%';
    var d = $('#jdetail'); d.innerHTML = '';
    var w = mk('div', 'swap');
    var qc = mk('div'); qc.appendChild(mk('div', 'small', 'Krok ' + (i + 1) + ' z ' + D.JOURNEY.length)); qc.appendChild(mk('div', 'q', esc(s.q))); w.appendChild(qc);
    var st = mk('div', 'studies');
    st.appendChild(mk('div', 'small', 'Kto to rieši: <b style="color:var(--navy)">' + esc(s.who) + '</b>'));
    st.appendChild(mk('div', 'small', 'Študuješ to na FPEDAS:'));
    var ch = mk('div', 'plinks');
    s.p.forEach(function (pid) { var p = prog(pid), b = mk('button', 'plink', esc(p.n) + '<svg class="ic"><use href="#i-next"/></svg>'); b.title = 'Zobraziť program'; b.addEventListener('click', function () { openProgram(pid); }); ch.appendChild(b); });
    st.appendChild(ch); w.appendChild(st); d.appendChild(w);
  }

  /* ---------- 05 katedry ---------- */
  function buildDepts() {
    var box = $('#dgroups');
    D.DEPTS.forEach(function (d) {
      var b = mk('button', 'dept'); b.setAttribute('aria-expanded', 'false');
      b.innerHTML = '<div class="top"><span>' + esc(d.n) + '</span>' + (d.mine ? '<span class="chip mark">tu pôsobíme</span>' : '') + '</div><div class="more"><div><p>' + esc(d.t) + '</p></div></div>';
      b.addEventListener('click', function () { var o = b.getAttribute('aria-expanded') === 'true'; $$('.dept').forEach(function (x) { x.setAttribute('aria-expanded', 'false'); }); b.setAttribute('aria-expanded', !o); });
      box.appendChild(b);
    });
    $$('.dept')[4].setAttribute('aria-expanded', 'true');
  }

  /* ---------- 06 programy ---------- */
  var psel = 'emp';
  function buildPrograms() {
    var box = $('#cats');
    ['biz', 'eco', 'log', 'mob'].forEach(function (c) {
      var cat = D.CATS[c], el = mk('div', 'cat'); el.style.setProperty('--c', cat.c);
      el.innerHTML = '<h3><i></i>' + esc(cat.n) + '</h3>';
      var row = mk('div', 'pchips');
      D.PROGRAMS.filter(function (p) { return p.cat === c; }).forEach(function (p) {
        var b = mk('button', 'pchip', esc(p.n)); b.dataset.id = p.id; b.setAttribute('aria-pressed', 'false');
        b.addEventListener('click', function () { setProgram(p.id); }); row.appendChild(b);
      });
      el.appendChild(row); box.appendChild(el);
    });
    setProgram(psel);
  }
  function setProgram(id) {
    psel = id; var p = prog(id), c = D.CATS[p.cat].c;
    $$('.pchip').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.id === id); });
    var box = $('#pdet'); box.style.setProperty('--c', c);
    var seats = p.en ? p.seats + ' <span style="font-size:30px;color:var(--mute);font-weight:600">+ ' + p.en + ' v angličtine</span>' : String(p.seats);
    box.innerHTML = '<div class="swap"><h3>' + esc(p.s) + '</h3><div class="meta"><b>' + seats + '</b><span>plánovaných miest v roku 2027/2028</span></div>' +
      '<h4>Naučíš sa</h4><ul>' + p.learn.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' +
      '<h4>Napríklad</h4><ul>' + p.practice.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' +
      '<h4>Kde sa uplatníš</h4><p>' + esc(p.jobs) + '</p></div>';
  }
  function openProgram(id) { setProgram(id); go(idxOf('s-prog')); }

  /* ---------- 08 stupne ---------- */
  var levBuilt = false, lsel = 'emp';
  var PHD = ['Doprava', 'Dopravné služby a logistika', 'Ekonomika dopravy, spojov a služieb', 'Ekonomika a manažment podniku'];
  function buildLev() {
    var box = $('#lev'); box.innerHTML = '';
    var c1 = mk('div', 'lcol l1'), c2 = mk('div', 'lcol l2'), c3 = mk('div', 'lcol l3');
    c1.innerHTML = '<div class="deg">Bc.</div><div class="dur">bakalár, 3 roky</div><div class="sub">9 programov, 720 miest</div>';
    c2.innerHTML = '<div class="deg">Ing.</div><div class="dur">inžinier, 2 roky</div><div class="sub">8 programov, 530 miest</div>';
    c3.innerHTML = '<div class="deg">PhD.</div><div class="dur">doktorand, 3 roky</div><div class="sub">4 programy, 16 miest</div>';
    var u1 = mk('ul'), u2 = mk('ul'), u3 = mk('ul');
    D.PROGRAMS.forEach(function (p) { var li = mk('li'), b = mk('button', 'litem', esc(p.n)); b.dataset.id = p.id; b.addEventListener('click', function () { setLev(p.id); }); li.appendChild(b); u1.appendChild(li); });
    D.PROGRAMS.filter(function (p) { return p.ing; }).forEach(function (p) { var li = mk('li'), d = mk('div', 'litem', esc(p.id === 'let' ? 'Letecká doprava' : p.n)); d.dataset.ing = p.id; li.appendChild(d); u2.appendChild(li); });
    PHD.forEach(function (t) { var li = mk('li'); li.appendChild(mk('div', 'litem', esc(t))); u3.appendChild(li); });
    c1.appendChild(u1); c2.appendChild(u2); c3.appendChild(u3);
    c3.appendChild(mk('div', 'sum', 'Spravidla študenti s vynikajúcimi výsledkami alebo zapojení do výskumu.'));
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('class', 'leadline'); svg.innerHTML = '<path id="lpath" d=""/>';
    box.appendChild(c1); box.appendChild(c2); box.appendChild(c3); box.appendChild(svg);
    levBuilt = true; setLev(lsel);
  }
  function setLev(id) {
    lsel = id; var p = prog(id);
    $$('#lev [data-id]').forEach(function (b) { b.classList.toggle('sel', b.dataset.id === id); });
    $$('#lev [data-ing]').forEach(function (b) { b.classList.toggle('link', p.ing && b.dataset.ing === id); });
    var n = $('#lnote');
    if (p.ing) n.innerHTML = '<b>' + esc(p.n) + '</b> pokračuje na FPEDAS ako inžiniersky program' + (id === 'let' ? ' (špecializácie sa líšia: letecká doprava alebo technológia údržby lietadiel)' : '') + '. ' + (p.cat === 'mob' || p.cat === 'log' ? 'V odbore doprava pokračuje doktorandské štúdium v programoch Doprava a Dopravné služby a logistika.' : 'V odbore ekonómia a manažment pokračuje doktorandské štúdium v programoch Ekonomika a manažment podniku a Ekonomika dopravy, spojov a služieb.');
    else n.innerHTML = '<b>' + esc(p.n) + '</b>: v ponuke inžinierskeho štúdia 2027/2028 nemá program rovnakého názvu. Aktuálnu ponuku si over pri ukončení bakalára.';
    drawLine();
  }
  function drawLine() {
    var path = $('#lpath'); if (!path) return;
    var p = prog(lsel), lev = $('#lev'); if (!p.ing) { path.setAttribute('d', ''); return; }
    var a = $('#lev [data-id="' + lsel + '"]'), b = $('#lev [data-ing="' + lsel + '"]'); if (!a || !b) return;
    var L = lev.getBoundingClientRect(), A = a.getBoundingClientRect(), B = b.getBoundingClientRect(), k = scale || 1;
    var x1 = (A.right - L.left) / k, y1 = (A.top + A.height / 2 - L.top) / k, x2 = (B.left - L.left) / k, y2 = (B.top + B.height / 2 - L.top) / k, mx = (x1 + x2) / 2;
    path.setAttribute('d', 'M' + x1 + ' ' + y1 + 'C' + mx + ' ' + y1 + ' ' + mx + ' ' + y2 + ' ' + x2 + ' ' + y2);
  }

  /* ---------- 09 prax ---------- */
  function buildPrax() {
    var box = $('#pcards');
    D.PRAX.forEach(function (c, i) {
      var b = mk('button', 'tile pc'); b.setAttribute('aria-expanded', 'false'); b.setAttribute('data-in', ''); b.style.setProperty('--i', i + 1);
      b.innerHTML = '<span class="s">' + esc(c.s) + '</span><h3>' + esc(c.h) + '</h3><span class="t">' + esc(c.t) + '</span><span class="d">' + esc(c.d) + '</span><span class="open"><svg class="ic"><use href="#i-open"/></svg>Viac</span>';
      b.addEventListener('click', function () { b.setAttribute('aria-expanded', b.getAttribute('aria-expanded') !== 'true'); });
      box.appendChild(b);
    });
  }

  /* ---------- 10 po škole ---------- */
  function buildJobs() {
    var box = $('#jcols'), rsel = -1;
    ['biz', 'eco', 'log', 'mob'].forEach(function (c) {
      var col = mk('div', 'jcol'); col.style.setProperty('--c', D.CATS[c].c);
      col.innerHTML = '<h3><i></i>' + esc(D.CATS[c].n) + '</h3>';
      var items = mk('div', 'items');
      D.ROLES.forEach(function (r, i) { if (r.cat !== c) return;
        var b = mk('button', 'tile role', esc(r.r)); b.setAttribute('aria-pressed', 'false'); b.dataset.i = i;
        b.addEventListener('click', function () { $$('.role').forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); showRole(i); });
        items.appendChild(b); });
      col.appendChild(items); box.appendChild(col);
    });
  }
  function showRole(i) {
    var r = D.ROLES[i], p = prog(r.p), bar = $('#jbar'); bar.innerHTML = '';
    bar.appendChild(mk('span', '', '<b>' + esc(r.r) + '</b> · vedie z programu'));
    var c = mk('button', 'chip mark', esc(p.n)); c.addEventListener('click', function () { openProgram(p.id); }); bar.appendChild(c);
    bar.appendChild(mk('span', 'cap', 'Podľa oficiálneho profilu absolventa'));
  }

  /* ---------- 11 prijatie ---------- */
  var adm = { type: 'sos', avg: 1.5 };
  function buildAdm() {
    $('#tSos').addEventListener('click', function () { adm.type = 'sos'; renderAdm(); });
    $('#tGym').addEventListener('click', function () { adm.type = 'gym'; renderAdm(); });
    $('#avgM').addEventListener('click', function () { stepAvg(-1); });
    $('#avgP').addEventListener('click', function () { stepAvg(1); });
    var dt = $('#dates');
    [['5. 2. 2027', 'Deň otvorených dverí FPEDAS', 1], ['31. 3. 2027', 'Posledný deň na prihlášku, 1. kolo', 0], ['1. – 2. 6. 2027', 'Prijímacie konanie, 1. kolo', 0], ['31. 7. a 11. – 12. 8. 2027', 'Prihlášky a konanie 2. kola, len pri voľných miestach', 0]].forEach(function (x) {
      dt.appendChild(mk('div', 'dt' + (x[2] ? ' k' : ''), '<b>' + x[0] + '</b><span>' + x[1] + '</span>'));
    });
    renderAdm();
  }
  function stepAvg(d) { adm.avg = Math.max(1, Math.min(3, Math.round((adm.avg + d * .1) * 10) / 10)); renderAdm(); }
  function renderAdm() {
    $('#tSos').setAttribute('aria-pressed', adm.type === 'sos'); $('#tGym').setAttribute('aria-pressed', adm.type === 'gym');
    $('#avgV').textContent = dec(adm.avg.toFixed(1));
    var rows = [];
    D.PROGRAMS.forEach(function (p) {
      if (p.id === 'let') { rows.push({ n: 'Letecká doprava', l: p.limits[adm.type] }); rows.push({ n: 'Letecká doprava: profesionálny pilot', l: p.limits.pilot }); }
      else rows.push({ n: p.n, l: p.limits[adm.type] });
    });
    rows.sort(function (a, b) { return a.l - b.l; });
    var box = $('#admlist'); box.innerHTML = '';
    rows.forEach(function (r) {
      var ok = adm.avg <= r.l + 1e-9;
      box.appendChild(mk('div', 'arow' + (ok ? ' pass' : ''), '<span>' + esc(r.n) + '</span><span class="lim">do ' + dec(r.l.toFixed(2)) + '</span><span class="st">' + (ok ? 'bez skúšky' : 'prijímacia skúška') + '</span>'));
    });
  }

  /* ---------- 12 život ---------- */
  function buildLife() {
    var box = $('#lifegrid');
    D.LIFE.forEach(function (c, i) {
      var b = mk('button', 'tile lf' + (i === 0 ? ' mark' : '')); b.setAttribute('aria-expanded', i === 0 ? 'true' : 'false'); b.setAttribute('data-in', ''); b.style.setProperty('--i', i + 1);
      b.innerHTML = '<span class="k">' + esc(c.k) + '</span><span class="big">' + esc(c.big) + '</span><span class="u">' + esc(c.unit) + '</span><span class="d">' + esc(c.d) + '</span><span class="open"><svg class="ic"><use href="#i-open"/></svg>Viac</span>';
      b.addEventListener('click', function () { b.setAttribute('aria-expanded', b.getAttribute('aria-expanded') !== 'true'); });
      box.appendChild(b);
    });
  }

  /* ---------- úvod: mená prezentujúcich ---------- */
  function renderIntroPres() {
    $('#introPres').innerHTML = ['A', 'B'].map(function (k) { var P = D.PRESENTERS[k]; return esc(P.name || ('Doktorand ' + k)) + '<span>' + esc(P.dept) + '</span>'; }).join('<div style="height:10px"></div>');
  }

  /* ---------- 14 kvíz ---------- */
  var qz = { i: 0, answered: false, score: 0, done: false };
  function renderQuiz() {
    var q = D.QUIZ[qz.i], prog_ = $('#qprog'); prog_.innerHTML = '<span>Otázka ' + (qz.i + 1) + ' z ' + D.QUIZ.length + '</span>';
    D.QUIZ.forEach(function (_, k) { prog_.appendChild(mk('i', k < qz.i || (k === qz.i && qz.answered) ? 'done' : (k === qz.i ? 'on' : ''))); });
    $('#qq').textContent = q.q;
    var box = $('#opts'); box.innerHTML = '';
    q.o.forEach(function (t, i) {
      var b = mk('button', 'opt', '<kbd>' + 'ABCD'[i] + '</kbd><span>' + esc(t) + '</span>'); b.dataset.i = i;
      b.addEventListener('click', function () { answer(i); }); box.appendChild(b);
    });
    $('#qfb').innerHTML = '<div class="small">Prečítaj otázku, nechaj publikum hlasovať rukami a potom klikni na odpoveď (alebo stlač <kbd>1</kbd> až <kbd>4</kbd>).</div>';
    qz.answered = false;
  }
  function answer(i) {
    if (qz.answered) return; var q = D.QUIZ[qz.i]; qz.answered = true; if (i === q.a) qz.score++;
    $$('#opts .opt').forEach(function (b, k) { b.disabled = true; if (k === q.a) b.classList.add('right'); else if (k === i) b.classList.add('wrong'); else b.classList.add('fade'); });
    var last = qz.i === D.QUIZ.length - 1, fb = $('#qfb');
    fb.innerHTML = '<div class="swap"><div><b>' + (i === q.a ? 'Správne. ' : 'Správna odpoveď: ' + esc(q.o[q.a]) + '. ') + '</b>' + esc(q.f) + '</div></div>';
    var btn = mk('button', 'btn main', last ? 'Výsledok' : 'Ďalšia otázka'); btn.id = 'qnext'; btn.addEventListener('click', nextQ); fb.firstChild.appendChild(btn);
    $$('#qprog i')[qz.i].className = 'done';
  }
  function nextQ() {
    if (qz.i < D.QUIZ.length - 1) { qz.i++; renderQuiz(); return; }
    var fb = $('#qfb'); $('#qq').textContent = 'Výsledok kvízu'; $('#opts').innerHTML = '';
    $$('#qprog i').forEach(function (x) { x.className = 'done'; });
    fb.innerHTML = '<div class="swap"><div class="score">' + qz.score + ' z ' + D.QUIZ.length + '</div><div>Správne odpovede vždy pochádzajú z oficiálnych zdrojov UNIZA a FPEDAS.</div></div>';
    var btn = mk('button', 'btn', '<svg class="ic"><use href="#i-redo"/></svg>Hrať znova'); btn.addEventListener('click', function () { qz = { i: 0, answered: false, score: 0 }; renderQuiz(); }); fb.firstChild.appendChild(btn);
    qz.done = true;
  }

  /* ---------- navigácia ---------- */
  var ids = slides.map(function (s) { return s.id; });
  function idxOf(id) { return ids.indexOf(id); }
  var segs = $('#segs');
  slides.forEach(function (s, i) {
    var b = mk('button', 'seg', '<i></i>'); b.setAttribute('aria-label', (i + 1) + ': ' + s.dataset.title); b.title = (i + 1) + '. ' + s.dataset.title;
    b.addEventListener('click', function () { go(i); }); segs.appendChild(b);
  });
  var presWin = null;
  function go(n) {
    n = Math.max(0, Math.min(N - 1, n)); if (n === cur) return;
    slides.forEach(function (s, i) {
      s.classList.toggle('is-active', i === n); s.classList.toggle('is-before', i < n);
      if (i === n) { s.removeAttribute('inert'); s.setAttribute('aria-hidden', 'false'); } else { s.setAttribute('inert', ''); s.setAttribute('aria-hidden', 'true'); }
    });
    cur = n; var dark = slides[n].classList.contains('dark');
    stage.classList.toggle('dark', dark);
    $('#footLogo').src = dark ? 'assets/img/uniza-symbol-white.svg' : 'assets/img/uniza-symbol.svg';
    $$('.seg', segs).forEach(function (b, i) { b.classList.toggle('on', i === n); b.classList.toggle('done', i < n); });
    $('#count').textContent = (n + 1) + ' / ' + N;
    $('#bPrev').disabled = n === 0; $('#bNext').disabled = n === N - 1;
    try { if (location.hash !== '#' + (n + 1)) history.replaceState(null, '', '#' + (n + 1)); } catch (e) { /* file:// */ }
    if (slides[n].id === 's-campus' && window.CampusMap) window.CampusMap.relayout();
    if (slides[n].id === 's-lev') drawLine();
    if (notesOn) renderNotes();
    if (presWin && !presWin.closed) presWin.postMessage({ type: 'state', n: n }, '*');
  }
  function next() { go(cur + 1); } function prev() { go(cur - 1); }
  $('#bPrev').addEventListener('click', prev); $('#bNext').addEventListener('click', next);

  /* ---------- celá obrazovka ---------- */
  function toggleFull() {
    try { if (document.fullscreenElement) document.exitFullscreen(); else (document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen).call(document.documentElement); }
    catch (e) { toast('Celú obrazovku sa nepodarilo zapnúť. Skús klávesu F11.'); }
  }
  $('#bFull').addEventListener('click', toggleFull);

  /* ---------- prekryvné vrstvy ---------- */
  var ovl = null, notesOn = false, notesEl = null;
  function closeOvl() { if (ovl) { ovl.remove(); ovl = null; } }
  function openOvl(title, body) {
    closeOvl(); ovl = mk('div', 'ovl'); ovl.setAttribute('role', 'dialog'); ovl.setAttribute('aria-label', title);
    ovl.innerHTML = '<h2>' + esc(title) + '</h2>'; var c = mk('button', 'close', '<svg class="ic"><use href="#i-close"/></svg>'); c.setAttribute('aria-label', 'Zavrieť'); c.addEventListener('click', closeOvl); ovl.appendChild(c);
    ovl.appendChild(body); stage.appendChild(ovl); c.focus();
  }
  function toggleGrid() {
    if (ovl && ovl.getAttribute('aria-label') === 'Prehľad slajdov') return closeOvl();
    var g = mk('div', 'ovgrid');
    slides.forEach(function (s, i) { var b = mk('button', 'ovb' + (i === cur ? ' on' : ''), '<span class="n">' + (i + 1) + ' · ' + esc(D.NOTES[i].who === 'AB' ? 'obaja' : (D.NOTES[i].who === 'A' ? 'doktorand A' : 'doktorand B')) + '</span><span class="t">' + esc(s.dataset.title) + '</span>'); b.addEventListener('click', function () { closeOvl(); go(i); }); g.appendChild(b); });
    openOvl('Prehľad slajdov', g);
  }
  var SRCMAP = { 's-intro': ['loga', 'manual'], 's-uniza': ['profil', 'fakulty', 'manual'], 's-campus': ['mapa18', 'mapa25', 'sprievodca', 'ubyt'], 's-why': ['bc'], 's-dept': ['katedry', 'fpedas'],
    's-prog': ['letakBc', 'bc', 'programy', 'zoznam'], 's-lev': ['letakBc', 'letakIng', 'letakPhd', 'sprievodca'], 's-prax': ['stip', 'hmi', 'sprievodca', 'fpedas'],
    's-stip': ['stip'], 's-jobs': ['bc'], 's-adm': ['letakBc', 'prij', 'prihlaska'], 's-life': ['letakBc', 'sprievodca', 'ubyt', 'preco'], 's-quiz': ['profil', 'bc', 'letakBc'], 's-end': ['prij', 'prihlaska'] };
  function toggleSrc() {
    if (ovl && ovl.getAttribute('aria-label') === 'Zdroje') return closeOvl();
    var wrap = mk('div', 'srcl'); var order = [cur].concat(slides.map(function (_, i) { return i; }).filter(function (i) { return i !== cur; }));
    order.forEach(function (i) { var list = SRCMAP[slides[i].id] || []; if (!list.length) return; wrap.appendChild(mk('h3', '', (i + 1) + '. ' + slides[i].dataset.title + (i === cur ? ' (aktuálny slajd)' : '')));
      list.forEach(function (k) { var s = D.SOURCES[k]; wrap.appendChild(mk('div', '', '<a href="' + s.u + '" target="_blank" rel="noopener">' + esc(s.t) + '</a><span class="u">' + esc(s.u) + '</span>')); }); });
    wrap.appendChild(mk('h3', '', 'Poznámka k overeniu'));
    wrap.appendChild(mk('div', 'small', 'Údaje overené 23. 11. 2026. Mapa je prekreslená z oficiálneho plánu areálu, nie je v mierke. Fotografie: UNIZA, FPEDAS. Logá a farby podľa dizajn manuálu UNIZA.'));
    openOvl('Zdroje', wrap);
  }
  function toggleHelp() {
    if (ovl && ovl.getAttribute('aria-label') === 'Ovládanie') return closeOvl();
    var dl = mk('dl'); dl.className = 'help'; var rows = [['← →  /  PageUp PageDown', 'predchádzajúci a ďalší slajd'], ['Medzerník', 'ďalší slajd (Shift + medzerník: späť)'], ['Home  /  End', 'prvý a posledný slajd'], ['F', 'celá obrazovka (Esc ju ukončí)'], ['G', 'prehľad slajdov'], ['N', 'poznámky pre prezentujúceho'], ['P', 'okno prezentujúceho (poznámky, časovač)'], ['S', 'zdroje'], ['1–4', 'odpovede v kvíze'], ['↑ ↓  /  T', 'priemer a typ školy na slajde Ako sa dostať'], ['?', 'toto okno']];
    rows.forEach(function (r) { dl.appendChild(mk('dt', '', esc(r[0]))); dl.appendChild(mk('dd', '', esc(r[1]))); });
    openOvl('Ovládanie', dl);
  }
  $('#bGrid').addEventListener('click', toggleGrid); $('#bHelp').addEventListener('click', toggleHelp);

  /* ---------- poznámky ---------- */
  function renderNotes() {
    if (!notesEl) { notesEl = mk('aside', 'notes'); notesEl.setAttribute('aria-label', 'Poznámky pre prezentujúceho'); stage.appendChild(notesEl); }
    var n = D.NOTES[cur], who = n.who === 'AB' ? 'Obaja' : (n.who === 'A' ? 'Doktorand A, ' + D.PRESENTERS.A.dept : 'Doktorand B, ' + D.PRESENTERS.B.dept);
    notesEl.innerHTML = '<div class="who"><span class="chip">' + esc(who) + '</span><span class="chip">~ ' + dec(n.min) + ' min</span>' + (n.opt ? '<span class="chip">možno vynechať</span>' : '') + '</div>' +
      '<h4>Hlavná myšlienka</h4><p>' + esc(n.idea) + '</p><h4>Čo povedať</h4><ul>' + n.say.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul><h4>Otázka pre publikum</h4><p>' + esc(n.ask) + '</p>';
  }
  function toggleNotes() { notesOn = !notesOn; if (notesOn) renderNotes(); else if (notesEl) { notesEl.remove(); notesEl = null; } $('#bNotes').setAttribute('aria-pressed', notesOn); }
  $('#bNotes').addEventListener('click', toggleNotes);

  /* ---------- okno prezentujúceho ---------- */
  function openPresenter() {
    if (presWin && !presWin.closed) { presWin.focus(); return; }
    presWin = window.open('presenter.html', 'uniza-presenter', 'width=1180,height=760');
    if (!presWin) toast('Prehliadač zablokoval nové okno. Povoľ vyskakovacie okná alebo použi klávesu N.');
  }
  $('#bPres').addEventListener('click', openPresenter);
  window.addEventListener('message', function (ev) {
    var m = ev.data; if (!m || typeof m !== 'object') return;
    if (m.type === 'hello') { presWin = ev.source; presWin.postMessage({ type: 'state', n: cur }, '*'); }
    else if (m.type === 'go') go(m.n);
  });

  function toast(t) { var e = mk('div', 'toast', esc(t)); stage.appendChild(e); setTimeout(function () { e.remove(); }, 3200); }

  /* ---------- klávesnica ---------- */
  document.addEventListener('keydown', function (e) {
    var t = e.target, tag = t && t.tagName, editing = t && (t.isContentEditable || tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT');
    if (e.key === 'Escape') {
      if (ovl) { closeOvl(); e.preventDefault(); }
      else if (editing && t.blur) t.blur();
      else if (document.fullscreenElement) { try { document.exitFullscreen(); } catch (x) { /* nič */ } }
      return;
    }
    if (editing || e.ctrlKey || e.metaKey || e.altKey) return;
    var id = slides[cur] && slides[cur].id, k = e.key;
    if (ovl && !/^(g|G|s|S|\?|h|H)$/.test(k)) { if (k === 'ArrowRight' || k === 'ArrowLeft' || k === ' ') e.preventDefault(); return; }
    if (k === 'ArrowRight' || k === 'PageDown') { e.preventDefault(); next(); }
    else if (k === 'ArrowLeft' || k === 'PageUp') { e.preventDefault(); prev(); }
    else if (k === ' ') { e.preventDefault(); e.shiftKey ? prev() : next(); }
    else if (k === 'Home') { e.preventDefault(); go(0); } else if (k === 'End') { e.preventDefault(); go(N - 1); }
    else if (k === 'f' || k === 'F') toggleFull();
    else if (k === 'g' || k === 'G') toggleGrid();
    else if (k === 'n' || k === 'N') toggleNotes();
    else if (k === 'p' || k === 'P') openPresenter();
    else if (k === 's' || k === 'S') toggleSrc();
    else if (k === '?' || k === 'h' || k === 'H') toggleHelp();
    else if (id === 's-quiz' && /^[1-4]$/.test(k)) { if (!qz.answered && D.QUIZ[qz.i] && +k <= D.QUIZ[qz.i].o.length) answer(+k - 1); }
    else if (id === 's-quiz' && k === 'Enter') { var nb = $('#qnext'); if (nb && !qz.done) nb.click(); }
    else if (id === 's-adm' && k === 'ArrowUp') { e.preventDefault(); stepAvg(-1); }
    else if (id === 's-adm' && k === 'ArrowDown') { e.preventDefault(); stepAvg(1); }
    else if (id === 's-adm' && (k === 't' || k === 'T')) { adm.type = adm.type === 'sos' ? 'gym' : 'sos'; renderAdm(); }
  });

  /* ---------- štart ---------- */
  buildJourney(); buildDepts(); buildPrograms(); buildPrax(); buildJobs(); buildAdm(); buildLife(); renderIntroPres(); renderQuiz();
  window.CampusMap.init($('#s-campus'));
  buildLev();
  slides.forEach(function (s) { s.setAttribute('inert', ''); });
  fit();
  var m = /^#(\d+)$/.exec(location.hash), start = m ? +m[1] - 1 : 0;
  go(isNaN(start) ? 0 : start);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { fit(); drawLine(); });
  window.__deck = { go: go, next: next, prev: prev, get cur() { return cur; }, slides: slides };
})();
