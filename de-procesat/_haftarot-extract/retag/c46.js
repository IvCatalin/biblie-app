// Haftarat Matot — Ieremia 1:1-2:3 — același text de bază ca Șemot (sefard), cap. 14: retagarea se reia din c14.js, cu fragmentele adaptate la formularea Rosen din acest cap.
const base = require('./c14.js');
const v = JSON.parse(JSON.stringify(base.v));
const swap = (verse, from, to) => { const a = v[verse]; const i = a.findIndex(x => x[0] === from); if (i < 0) throw new Error('lipsă ' + verse + ' ' + from); a[i] = to; };
// 1:3 — „Țidkiahu”; Rosen nu repetă „regele lui Iuda” după Iehoiakim
{
  const a = v['1:3'];
  const i = a.findIndex(x => x[0] === 'regele');
  a.splice(i, 2, ['', 5], ['', 6]);
  swap('1:3', 'Țedekia', ['Țidkiahu', 12, 'Zedechia']);
}
// 1:5 — „în pântec” în loc de „în burtă”
swap('1:5', 'burtă', ['pântec', 2, 'pântece']);
// 1:7 — „sunt [încă] tânăr”
swap('1:7', 'eu', ['sunt', 6, 'eu', { fn: 1 }]);
// 1:11 — „toiag”
swap('1:11', 'nuia', ['toiag', 10, 'ramură']);
// 1:15 — „regatelor țării” în loc de „regatelor de la miazănoapte”
{
  const a = v['1:15'];
  const i = a.findIndex(x => x[0] === 'regatelor');
  a.splice(i, 2, ['regatelor țării', [5, 6], 'regatele de miazănoapte']);
}
// 1:16 — „la lucrarea”
swap('1:16', 'lucrării', ['lucrarea', 12, 'lucrării']);
// 1:19 — „Ei vor lupta”
swap('1:19', 'Se vor lupta', ['vor lupta', 0, 'se vor război']);
// 2:2 — „proclamă”
swap('2:2', 'vestește', ['proclamă', 1, 'strigă']);
module.exports = { bank: Object.assign({}, require('./bank-c14.js'), require('./bank-c46x.js')), v };
