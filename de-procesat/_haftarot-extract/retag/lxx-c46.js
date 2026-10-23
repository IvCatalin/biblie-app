// Matot — Ieremia 1:1-2:3 (Rahlfs 1935) — LXX pentru FIECARE tag: același text de bază ca la Șemot (sefard), cap. 14, cu ajustări la tag-urile care diferă
const base = require('./lxx-c14.js');
const S = JSON.parse(JSON.stringify(base));
// 1:3 — Rosen nu repetă „regele lui Iuda” după Iehoiakim: dispar tag-urile 4 și 5
S['1:3'].splice(4, 2);
// 1:15 — „regatelor țării” (o singură pereche) în loc de „regatelor” + „miazănoapte”
S['1:15'].splice(2, 2, 'βασιλεία¦πάσας/τὰς/βασιλείας/βορρᾶ¦regatele de miazănoapte¦Ebraica: „regatele de miazănoapte” (mamlehot țafonah); Septuaginta: „toate împărățiile de la miazănoapte a pământului” (πάσας τὰς βασιλείας ἀπὸ βορρᾶ τῆς γῆς).');
module.exports = S;
