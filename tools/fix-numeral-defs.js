// Pune def_ro la numeralele de vârstă („o sută treizeci de ani”) acolo unde def_ro doar repetă cuvântul. node tools/fix-numeral-defs.js N [--write]
const fs = require('fs');
const N = +process.argv[2], WRITE = process.argv.includes('--write');
const U = { 'un': 1, 'una': 1, 'o': 1, 'doi': 2, 'două': 2, 'doua': 2, 'trei': 3, 'patru': 4, 'cinci': 5, 'șase': 6, 'șapte': 7, 'opt': 8, 'nouă': 9, 'zece': 10, 'unsprezece': 11, 'doisprezece': 12, 'treisprezece': 13, 'paisprezece': 14, 'cincisprezece': 15, 'șaisprezece': 16, 'șaptesprezece': 17, 'optsprezece': 18, 'nouăsprezece': 19 };
const T = { 'douăzeci': 20, 'treizeci': 30, 'patruzeci': 40, 'cincizeci': 50, 'șaizeci': 60, 'șaptezeci': 70, 'optzeci': 80, 'nouăzeci': 90 };
function parse(w) {
  const s = w.toLowerCase().replace(/[.,]/g, '').replace(/ de ani| ani| de ani$/g, '').trim().split(/\s+/); let n = 0, cur = 0;
  for (let i = 0; i < s.length; i++) { const x = s[i];
    if (x === 'sută') { n += (cur || 1) * 100; cur = 0; } else if (x === 'sute') { n += cur * 100; cur = 0; }
    else if (x === 'și' || x === 'de') continue; else if (U[x] !== undefined) { if (U[x] <= 19 && s[i + 1] && (s[i + 1] === 'sute' || s[i + 1] === 'sută')) cur = U[x]; else cur += U[x]; }
    else if (T[x]) cur += T[x]; else return null; }
  return n + cur;
}
const f = 'public/genesis-' + N + '.js';
const D = new Function('window', fs.readFileSync(f, 'utf8') + ';return window;')({}).CHAPTER_DATA;
let c = 0, bad = [];
for (const x of D) for (const t of x.tokens) if (t.heb && /ani\.?$/.test(t.w || '') && (t.def_ro || '').replace(/[ .]/g, '').toLowerCase() === t.w.replace(/[ .]/g, '').toLowerCase()) {
  const n = parse(t.w); if (!n) { bad.push(x.num + ':' + t.w); continue; }
  t.def_ro = n + ' de ani — numeral compus: ebraica îl spune pe părți (unități, zeci, sute, fiecare cu „ani”) și îl adună; aici, anii vieții unui patriarh.'; c++;
}
console.log(WRITE ? 'SCRIS' : 'PROBĂ', 'def_ro puse', c, bad.length ? '| neparsate: ' + bad.join(', ') : '');
if (WRITE) fs.writeFileSync(f, 'window.CHAPTER_DATA = ' + JSON.stringify(D, null, 1).replace(/\n/g, '\r\n') + ';\r\n', 'utf8');
