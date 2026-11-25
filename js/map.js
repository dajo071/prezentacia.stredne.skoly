/* ==========================================================================
   Interaktívna mapa kampusu. Geometria (js/campus-data.js) je prekreslená z oficiálneho
   plánu areálu UNIZA, otočená severom hore. Budovy sú mierne vytiahnuté nahor (výška je
   len ilustračná, pôdorysy a vzájomná poloha zodpovedajú plánu).
   ========================================================================== */
(function () {
  'use strict';
  var C = window.CAMPUS, D = window.DECK, F = D.FACULTIES;
  var NS = 'http://www.w3.org/2000/svg';
  var LIFE = '#1E8F7A';

  /* entity, ktoré sa dajú vybrať (panel aj mapa) */
  var ENT = {
    fpedas: { tab: 'fac', groups: ['fpedas'], ab: F.fpedas.abbr, name: F.fpedas.name, color: F.fpedas.color, hero: true,
      text: F.fpedas.focus, rows: ['Referát pre vzdelávanie: BF 107 a BF 108', 'Deväť bakalárskych programov, plánovaných 720 miest'] },
    sjf:  { tab: 'fac', groups: ['sjf'],  ab: F.sjf.abbr,  name: F.sjf.name,  color: F.sjf.color,  text: F.sjf.focus,  rows: [] },
    feit: { tab: 'fac', groups: ['feit'], ab: F.feit.abbr, name: F.feit.name, color: F.feit.color, text: F.feit.focus, rows: [] },
    svf:  { tab: 'fac', groups: ['svf'],  ab: F.svf.abbr,  name: F.svf.name,  color: F.svf.color,  text: F.svf.focus,  rows: [] },
    fri:  { tab: 'fac', groups: ['fri'],  ab: F.fri.abbr,  name: F.fri.name,  color: F.fri.color,  text: F.fri.focus,  rows: [] },
    fbi:  { tab: 'fac', groups: [], off: true, ab: F.fbi.abbr, name: F.fbi.name, color: F.fbi.color, text: F.fbi.focus, rows: [F.fbi.bld, 'Nie je na tejto mape: je v centre mesta'] },
    umkd: { tab: 'fac', groups: ['umkd'], ab: 'ÚMKD', name: 'Ústav mediamatiky a kultúrneho dedičstva', color: '#7C8AA6', inst: true,
      text: 'Pedagogické pracovisko univerzity, nie fakulta.', rows: [] },
    kniznica: { tab: 'life', groups: ['kniznica'], ab: 'UK', name: 'Univerzitná knižnica', color: LIFE,
      text: 'Študijná literatúra, knihy a pokojné miesto na učenie. Preukaz ISIC je zároveň knižničný preukaz.', rows: [] },
    menza: { tab: 'life', groups: ['menza'], ab: 'NM', name: 'Nová menza', color: LIFE,
      text: 'Hlavná jedáleň na Veľkom Diele. Jedlo stojí od 1,30 do 4,80 €, platí sa preukazom ISIC cez elektronickú peňaženku.', rows: [] },
    sport: { tab: 'life', groups: ['sport'], stadium: true, ab: 'Šport', name: 'Štadión, Športové centrum, telocvičňa T1', color: LIFE,
      text: 'Atletický štadión (8 dráh, 400 m, certifikát Svetovej atletiky), nové Športové centrum (hala, kapacita 1 500 miest) a telocvičňa T1.', rows: ['Až 30 športov na výber'] },
    dorm: { tab: 'life', groups: ['dorm'], ab: 'DA–DH', name: 'Internát Veľký Diel', color: LIFE,
      text: 'Pre študentov SjF, FEIT, FRI, ÚMKD a VÚVB, ostatní podľa voľnej kapacity. Kuchynky, študovne a kinosála.', rows: ['Študenti FPEDAS bývajú na Hlinách V'] },
    upc: { tab: 'life', groups: ['upc'], ab: 'UPC', name: 'Univerzitné pastoračné centrum', color: LIFE,
      text: 'Pastoračné centrum s kaviarňou.', rows: [] },
    hliny: { tab: 'life', groups: [], off: true, ab: 'Hliny V', name: 'Internát Hliny V', color: LIFE,
      text: 'Pre študentov FPEDAS, SvF a FBI, asi 10 minút pešo od centra mesta. V areáli je Stará menza a športcentrum.', rows: ['Hlinská ulica, mimo tejto mapy', 'Parkovanie je tu bezplatné'] }
  };
  var ORDER = {
    fac: ['fpedas', 'sjf', 'feit', 'svf', 'fri', 'fbi', 'umkd'],
    life: ['hliny', 'menza', 'kniznica', 'sport', 'dorm', 'upc']
  };
  var HEIGHT = { fpedas: 30 }; var H0 = 15;
  var SUN = [0.62, -0.38]; /* posun tieňa na zemi na jednotku výšky (svetlo zľava zhora) */
  var CORE = ['fpedas', 'sjf', 'feit', 'svf', 'umkd', 'bother', 'aother', 'aula', 'upc', 'uvp', 'pp'];

  function el(n, a, p) { var e = document.createElementNS(NS, n); for (var k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e; }
  function shade(hex, f) { var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    function m(v) { return Math.max(0, Math.min(255, Math.round(v * (1 + f)))); } return 'rgb(' + m(r) + ',' + m(g) + ',' + m(b) + ')'; }
  function d(pts) { return 'M' + pts.map(function (p) { return p[0] + ' ' + p[1]; }).join('L') + 'Z'; }
  function area(P) { var a = 0; for (var i = 0; i < P.length; i++) { var q = P[(i + 1) % P.length]; a += P[i][0] * q[1] - q[0] * P[i][1]; } return a / 2; }
  function inside(pt, P) { var c = false; for (var i = 0, j = P.length - 1; i < P.length; j = i++) {
    if (((P[i][1] > pt[1]) !== (P[j][1] > pt[1])) && (pt[0] < (P[j][0] - P[i][0]) * (pt[1] - P[i][1]) / (P[j][1] - P[i][1]) + P[i][0])) c = !c; } return c; }
  function entOf(g) { for (var k in ENT) if (ENT[k].groups.indexOf(g) > -1) return k; return null; }

  var S = { root: null, svg: null, box: null, labs: null, tab: 'fac', sel: 'fpedas', vb: null, vbTo: null, raf: 0, bld: [], labEls: {}, zoomMode: 'core' };

  function bboxOf(groups) {
    var x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    C.buildings.forEach(function (b) { if (groups.indexOf(b.g) < 0) return;
      b.pts.forEach(function (p) { x0 = Math.min(x0, p[0]); y0 = Math.min(y0, p[1] - 36); x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]); }); });
    return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
  }
  function fitView(bb, pad) {
    var r = S.box.clientWidth / S.box.clientHeight;
    var w = bb.w + pad * 2, h = bb.h + pad * 2;
    if (w / h < r) w = h * r; else h = w / r;
    return { x: bb.x + bb.w / 2 - w / 2, y: bb.y + bb.h / 2 - h / 2, w: w, h: h };
  }
  function viewFor(mode) {
    if (mode === 'full') return fitView({ x: 0, y: 0, w: C.w, h: C.h }, 4);
    if (S.tab === 'life') {
      var bb = bboxOf(['menza', 'kniznica', 'sport', 'dorm', 'hb']);
      C.stadium.forEach(function (p) { var x1 = Math.max(bb.x + bb.w, p[0]), y1 = Math.max(bb.y + bb.h, p[1]); bb.x = Math.min(bb.x, p[0]); bb.y = Math.min(bb.y, p[1] - 8); bb.w = x1 - bb.x; bb.h = y1 - bb.y; });
      return fitView(bb, 40);
    }
    return fitView(bboxOf(CORE), 40);
  }
  function applyVB() {
    var v = S.vb; S.svg.setAttribute('viewBox', v.x + ' ' + v.y + ' ' + v.w + ' ' + v.h);
    positionLabels();
  }
  function tweenTo(v, quick) {
    cancelAnimationFrame(S.raf);
    if (quick || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { S.vb = v; applyVB(); return; }
    var from = { x: S.vb.x, y: S.vb.y, w: S.vb.w, h: S.vb.h }, t0 = null, dur = 650;
    (function step(t) { if (!t0) t0 = t; var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      S.vb = { x: from.x + (v.x - from.x) * e, y: from.y + (v.y - from.y) * e, w: from.w + (v.w - from.w) * e, h: from.h + (v.h - from.h) * e };
      applyVB(); if (k < 1) S.raf = requestAnimationFrame(step); })(performance.now());
  }

  /* ---------- kreslenie ---------- */
  function build() {
    var svg = S.svg; svg.innerHTML = '';
    el('rect', { x: -2000, y: -2000, width: 5000, height: 5000, fill: '#E3EAF4' }, svg);
    var g0 = el('g', {}, svg);
    C.paved.forEach(function (p) { el('path', { d: d(p.pts), fill: '#D2DAE8' }, g0); });
    C.roads.forEach(function (r) { el('path', { d: 'M' + r.pts.map(function (p) { return p[0] + ' ' + p[1]; }).join('L'), fill: 'none', stroke: '#FFFFFF', 'stroke-width': r.w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g0); });
    C.others.forEach(function (o) { el('path', { d: d(o.pts), fill: '#CBD4E3', stroke: '#B4C0D4', 'stroke-width': .8 }, g0); });
    /* tiene budov na zemi: jedna vrstva s priehľadnosťou, aby sa prekryvy nestmavovali */
    var sh = el('g', { opacity: .16 }, svg);
    C.buildings.forEach(function (b) {
      var h = HEIGHT[b.g] || H0, P = b.pts, ox = SUN[0] * h, oy = -SUN[1] * h * .35;
      var Q = P.map(function (p) { return [+(p[0] + ox).toFixed(1), +(p[1] + oy).toFixed(1)]; });
      el('path', { d: d(Q), fill: '#001F52' }, sh);
      for (var i = 0; i < P.length; i++) { var j = (i + 1) % P.length;
        el('path', { d: d([P[i], P[j], Q[j], Q[i]]), fill: '#001F52' }, sh); }
    });
    /* štadión */
    S.stad = el('g', { 'data-ent': 'sport', class: 'bld', tabindex: 0, role: 'button', 'aria-label': 'Atletický štadión' }, svg);
    el('path', { d: d(C.stadium), fill: '#CFE5C8', stroke: '#fff', 'stroke-width': C.stadW, 'stroke-linejoin': 'round' }, S.stad);
    S.stadRing = el('path', { d: d(C.stadium), fill: 'none', stroke: '#B9C4D8', 'stroke-width': C.stadW * .55, 'stroke-linejoin': 'round' }, S.stad);
    /* budovy: zozadu dopredu */
    var order = C.buildings.map(function (b, i) { var m = -1e9; b.pts.forEach(function (p) { m = Math.max(m, p[1]); }); return { b: b, i: i, y: m }; }).sort(function (a, b) { return a.y - b.y; });
    S.bld = [];
    order.forEach(function (o) {
      var b = o.b, e = entOf(b.g), grp = el('g', { class: 'bld', 'data-g': b.g }, svg);
      if (e) { grp.setAttribute('data-ent', e); grp.setAttribute('tabindex', 0); grp.setAttribute('role', 'button'); grp.setAttribute('aria-label', ENT[e].name); }
      var h = HEIGHT[b.g] || H0, P = b.pts;
      var top = el('path', { d: d(P.map(function (p) { return [p[0], +(p[1] - h).toFixed(1)]; })) }, grp);
      var walls = el('g', {}, grp); var A = area(P);
      for (var i = 0; i < P.length; i++) {
        var a = P[i], c = P[(i + 1) % P.length], ex = c[0] - a[0], ey = c[1] - a[1], L = Math.hypot(ex, ey) || 1;
        var n = [ey / L, -ex / L], mid = [(a[0] + c[0]) / 2 + n[0] * .05, (a[1] + c[1]) / 2 + n[1] * .05];
        if (inside(mid, P)) n = [-n[0], -n[1]];
        if (n[1] > 0.05) { var w = el('path', { d: 'M' + a[0] + ' ' + a[1] + 'L' + c[0] + ' ' + c[1] + 'L' + c[0] + ' ' + (c[1] - h) + 'L' + a[0] + ' ' + (a[1] - h) + 'Z' }, walls);
          w.dataset.k = (-.16 - .2 * Math.max(0, n[0]) + .06 * Math.max(0, -n[0])).toFixed(3); }
      }
      S.bld.push({ g: b.g, top: top, walls: walls, grp: grp, ent: e });
    });
    /* štítky (HTML nad SVG, konštantná veľkosť) */
    S.labs.innerHTML = ''; S.labEls = {};
    var anchors = {};
    C.buildings.forEach(function (b) { var A = Math.abs(area(b.pts)); if (!anchors[b.g] || A > anchors[b.g].A) anchors[b.g] = { A: A, c: b.c, h: HEIGHT[b.g] || H0 }; });
    Object.keys(ENT).forEach(function (k) {
      var e = ENT[k]; if (!e.groups.length) return;
      var an = anchors[e.groups[0]]; if (!an) return;
      if (k === 'sport') { var cs = C.stadium.reduce(function (s, p) { return [s[0] + p[0] / C.stadium.length, s[1] + p[1] / C.stadium.length]; }, [0, 0]); an = { c: cs, h: 0 }; }
      var l = document.createElement('div'); l.className = 'maplab' + (e.hero ? ' hero' : '') + (e.tab === 'life' ? ' sm' : '');
      l.textContent = e.ab; l.dataset.x = an.c[0]; l.dataset.y = an.c[1] - an.h - 4; l.dataset.ent = k; S.labs.appendChild(l); S.labEls[k] = l;
    });
    paint();
  }

  function paint() {
    var mode = S.tab, sel = S.sel, selEnt = sel && ENT[sel];
    S.bld.forEach(function (o) {
      var e = o.ent, ent = e && ENT[e], base = '#C3CEE0', stroke = 'rgba(0,31,82,.28)', sw = .7, dim = false;
      if (ent && ent.tab === mode) { base = ent.color; if (ent.inst) base = '#9AA7C0'; }
      if (ent && ent.tab !== mode && o.g === 'fpedas' && mode === 'life') base = '#C3CEE0';
      var isSel = selEnt && e === sel;
      if (isSel) { stroke = '#001F52'; sw = 2.2; }
      if (selEnt && !isSel && ent && ent.tab === mode) dim = true;
      if (selEnt && !isSel && !(ent && ent.tab === mode)) dim = !!(selEnt && selEnt.tab === mode && !selEnt.off);
      o.top.setAttribute('fill', base); o.top.setAttribute('stroke', stroke); o.top.setAttribute('stroke-width', sw); o.top.setAttribute('stroke-linejoin', 'round');
      var hb = /^#/.test(base) ? base : '#C3CEE0';
      o.top.setAttribute('fill', shade(hb, .06));
      Array.prototype.forEach.call(o.walls.childNodes, function (w) { w.setAttribute('fill', shade(hb, +w.dataset.k)); w.setAttribute('stroke', 'rgba(0,31,82,.18)'); w.setAttribute('stroke-width', .5); });
      o.grp.classList.toggle('dim', dim && !isSel && !!ent && ent.tab === mode);
      o.grp.setAttribute('aria-pressed', isSel ? 'true' : 'false');
    });
    var sportOn = mode === 'life';
    S.stadRing.setAttribute('stroke', sportOn ? LIFE : '#B9C4D8');
    S.stad.classList.toggle('dim', sportOn && sel && sel !== 'sport');
    S.stad.style.pointerEvents = sportOn ? 'auto' : 'none';
    Object.keys(S.labEls).forEach(function (k) {
      var l = S.labEls[k], e = ENT[k];
      var show = (e.tab === mode || k === 'fpedas') && !(mode === 'life' && k === 'upc' && sel !== 'upc') && !(e.inst && sel !== k);
      l.classList.toggle('hide', !show);
      l.classList.toggle('on', k === sel);
    });
    /* zoznam a detail */
    renderList(); renderDetail();
  }

  function positionLabels() {
    var W = S.box.clientWidth, H = S.box.clientHeight, v = S.vb;
    Object.keys(S.labEls).forEach(function (k) {
      var l = S.labEls[k], x = (+l.dataset.x - v.x) / v.w * W, y = (+l.dataset.y - v.y) / v.h * H;
      l.style.left = x + 'px'; l.style.top = y + 'px';
      l.style.visibility = (x < -10 || x > W + 10 || y < 20 || y > H + 10) ? 'hidden' : 'visible';
    });
  }

  /* ---------- panel ---------- */
  function renderList() {
    var list = S.root.querySelector('#plistMap'); list.innerHTML = '';
    ORDER[S.tab].forEach(function (k) {
      var e = ENT[k], b = document.createElement('button'); b.className = 'prow' + (e.hero ? ' hero' : '');
      b.setAttribute('aria-pressed', k === S.sel ? 'true' : 'false'); b.dataset.ent = k;
      b.style.setProperty('--c', e.color); b.style.setProperty('--k', /^#(6CACE4|FFB81C|FF6A14)$/i.test(e.color) ? '#002D72' : '#fff');
      b.innerHTML = '<i></i><span class="a"></span><span class="n"></span>';
      b.querySelector('.a').textContent = e.ab; b.querySelector('.n').textContent = e.inst ? 'ústav (nie fakulta)' : e.name;
      if (e.off) b.querySelector('.n').textContent = e.name + ' · mimo mapy';
      b.addEventListener('click', function () { select(k, true); });
      list.appendChild(b);
    });
  }
  function renderDetail() {
    var e = ENT[S.sel], box = S.root.querySelector('#mapDetail'); if (!e) { box.innerHTML = ''; return; }
    box.style.setProperty('--c', e.color);
    box.innerHTML = '<div class="swap"><h3></h3><p></p><div class="small"></div></div>';
    box.querySelector('h3').textContent = e.ab + ' · ' + e.name;
    box.querySelector('p').textContent = e.text;
    box.querySelector('.small').innerHTML = e.rows.map(function (r) { return '<div>' + r + '</div>'; }).join('');
  }

  function select(k, zoom) {
    var e = ENT[k]; if (!e) return;
    S.sel = k;
    if (e.tab !== S.tab) setTab(e.tab, true);
    paint();
    if (zoom) {
      if (!e.off) { var m = (k === 'fri' || k === 'upc') ? 'full' : 'core'; setZoomBtn(m); tweenTo(viewFor(m)); }
    }
  }
  function setZoomBtn(m) { S.zoomMode = m; S.root.querySelector('#zCore').textContent = S.tab === 'life' ? 'Bývanie a šport' : 'Fakulty'; S.root.querySelector('#zFull').setAttribute('aria-pressed', m === 'full'); S.root.querySelector('#zCore').setAttribute('aria-pressed', m === 'core'); }
  function setTab(t, silent) {
    S.tab = t;
    S.root.querySelector('#tabF').setAttribute('aria-selected', t === 'fac'); S.root.querySelector('#tabL').setAttribute('aria-selected', t === 'life');
    if (!silent) { S.sel = ORDER[t][0]; paint(); setZoomBtn('core'); tweenTo(viewFor('core')); }
  }

  function init(root) {
    S.root = root; S.svg = root.querySelector('#mapsvg'); S.box = root.querySelector('#mapbox'); S.labs = root.querySelector('#maplabs');
    build();
    S.vb = viewFor('core'); applyVB();
    S.svg.addEventListener('click', function (ev) { var g = ev.target.closest('[data-ent]'); if (g) select(g.dataset.ent, false); });
    S.svg.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' || ev.key === ' ') { var g = ev.target.closest && ev.target.closest('[data-ent]'); if (g) { ev.preventDefault(); ev.stopPropagation(); select(g.dataset.ent, false); } } });
    root.querySelector('#tabF').addEventListener('click', function () { setTab('fac'); });
    root.querySelector('#tabL').addEventListener('click', function () { setTab('life'); });
    root.querySelector('#zFull').addEventListener('click', function () { setZoomBtn('full'); tweenTo(viewFor('full')); });
    root.querySelector('#zCore').addEventListener('click', function () { setZoomBtn('core'); tweenTo(viewFor('core')); });
    window.addEventListener('resize', function () { S.vb = viewFor(S.zoomMode); applyVB(); });
  }
  function reset() { S.tab = 'fac'; S.sel = 'fpedas'; S.root.querySelector('#tabF').setAttribute('aria-selected', 'true'); S.root.querySelector('#tabL').setAttribute('aria-selected', 'false'); setZoomBtn('core'); S.vb = viewFor('core'); applyVB(); paint(); }
  function relayout() { if (!S.root) return; S.vb = viewFor(S.zoomMode); applyVB(); }

  window.CampusMap = { init: init, reset: reset, relayout: relayout, select: select };
})();
