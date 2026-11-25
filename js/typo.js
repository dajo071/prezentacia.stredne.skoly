/* ==========================================================================
   Slovenská typografia: jednopísmenové predložky a spojky (a, i, k, o, s, u, v, z)
   a krátke predložky (do, na, od, po, pre, pri, za, zo, so, ku, vo, bez, cez, nad, pod, pred)
   nesmú ostať na konci riadka. Medzeru za nimi nahradíme nezlomiteľnou medzerou.
   Spracuje celý dokument pri načítaní a potom každý obsah, ktorý skript doplní neskôr.
   ========================================================================== */
(function () {
  'use strict';
  var NB = '\u00A0';
  var RX = /(^|[\s(„"'\/–-])(a|i|k|o|s|u|v|z|do|na|od|po|pre|pri|za|zo|so|ku|vo|bez|cez|nad|pod|pred|aj|že)[ \t\r\n]+(?=\S)/gi;
  var SKIP = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, INPUT: 1, CODE: 1, PRE: 1, SVG: 1 };

  function fix(t) {
    /* opakuj, kým sa niečo mení: chytí aj predložky idúce hneď po sebe („aj v meste“) */
    var prev;
    do { prev = t; t = t.replace(RX, function (m, pre, w) { return pre + w + NB; }); } while (t !== prev);
    return t;
  }
  function walk(root) {
    if (!root) return;
    if (root.nodeType === 3) { if (root.parentNode && root.parentNode.isContentEditable) return; var v = root.nodeValue, f = fix(v); if (f !== v) root.nodeValue = f; return; }
    if (root.nodeType !== 1 && root.nodeType !== 9 && root.nodeType !== 11) return;
    if (root.nodeType === 1 && (SKIP[root.tagName.toUpperCase()] || root.isContentEditable)) return;
    for (var c = root.firstChild; c; c = c.nextSibling) walk(c);
  }

  var busy = false;
  function run(nodes) {
    if (busy) return; busy = true;
    try { nodes.forEach(walk); } finally { busy = false; }
  }
  function start() {
    run([document.body]);
    if (!window.MutationObserver) return;
    new MutationObserver(function (list) {
      var n = [];
      list.forEach(function (m) {
        if (m.type === 'characterData') n.push(m.target);
        else Array.prototype.forEach.call(m.addedNodes, function (x) { n.push(x); });
      });
      if (n.length) run(n);
    }).observe(document.body, { childList: true, subtree: true, characterData: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
