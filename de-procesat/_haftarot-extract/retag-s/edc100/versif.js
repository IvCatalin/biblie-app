// conversie numerotare ebraică (OSHB) -> EDC100/KJV pentru citări.
// fiecare regulă: [cap ebraic, vMin, vMax, cap EDC100, delta]  =>  v' = v + delta
const fs = require('fs');
const PS = JSON.parse(fs.readFileSync('C:/Users/ivcatali/AppData/Local/Temp/claude/C--Users-ivcatali-biblie-app/1b2de2ce-5fde-4d73-ba50-1c613a2c9173/scratchpad/pscounts.json', 'utf8'));
const RULES = {
  'Geneza': [[32, 1, 1, 31, 54], [32, 2, 33, 32, -1]],
  'Exodul': [[7, 26, 29, 8, -25], [8, 1, 28, 8, 4], [21, 37, 37, 22, -36], [22, 1, 30, 22, 1]],
  'Leviticul': [[5, 20, 26, 6, -19], [6, 1, 23, 6, 7]],
  'Numeri': [[17, 1, 15, 16, 35], [17, 16, 28, 17, -15], [25, 19, 19, 26, -18], [30, 1, 1, 29, 39], [30, 2, 17, 30, -1]],
  'Deuteronomul': [[13, 1, 1, 12, 31], [13, 2, 19, 13, -1], [23, 1, 1, 22, 29], [23, 2, 26, 23, -1], [28, 69, 69, 29, -68], [29, 1, 28, 29, 1]],
  '1 Samuel': [[21, 1, 1, 20, 41], [21, 2, 16, 21, -1], [24, 1, 1, 23, 28], [24, 2, 23, 24, -1]],
  '2 Samuel': [[19, 1, 1, 18, 32], [19, 2, 44, 19, -1]],
  '1 Împărați': [[5, 1, 14, 4, 20], [5, 15, 32, 5, -14]],
  '2 Împărați': [[12, 1, 1, 11, 20], [12, 2, 22, 12, -1]],
  '1 Cronici': [[5, 27, 41, 6, -26], [6, 1, 66, 6, 15]],
  '2 Cronici': [[1, 18, 18, 2, -17], [2, 1, 17, 2, 1], [13, 23, 23, 14, -22], [14, 1, 14, 14, 1]],
  'Neemia': [[3, 33, 38, 4, -32], [4, 1, 17, 4, 6], [10, 1, 1, 9, 37], [10, 2, 40, 10, -1]],
  'Iov': [[40, 25, 32, 41, -24], [41, 1, 26, 41, 8]],
  'Eclesiastul': [[4, 17, 17, 5, -16], [5, 1, 19, 5, 1]],
  'Cântarea cântărilor': [[7, 1, 1, 6, 12], [7, 2, 14, 7, -1]],
  'Isaia': [[8, 23, 23, 9, -22], [9, 1, 20, 9, 1], [64, 1, 11, 64, 1]],
  'Ieremia': [[8, 23, 23, 9, -22], [9, 1, 25, 9, 1]],
  'Ezechiel': [[21, 1, 5, 20, 44], [21, 6, 37, 21, -5]],
  'Daniel': [[3, 31, 33, 4, -30], [4, 1, 34, 4, 3], [6, 1, 1, 5, 30], [6, 2, 29, 6, -1]],
  'Osea': [[2, 1, 2, 1, 9], [2, 3, 25, 2, -2], [12, 1, 1, 11, 11], [12, 2, 15, 12, -1], [14, 1, 1, 13, 15], [14, 2, 10, 14, -1]],
  'Ioel': [[3, 1, 5, 2, 27], [4, 1, 21, 3, 0]],
  'Iona': [[2, 1, 1, 1, 16], [2, 2, 11, 2, -1]],
  'Mica': [[4, 14, 14, 5, -13], [5, 1, 14, 5, 1]],
  'Naum': [[2, 1, 1, 1, 14], [2, 2, 14, 2, -1]],
  'Zaharia': [[2, 1, 4, 1, 17], [2, 5, 17, 2, -4]],
  'Maleahi': [[3, 19, 24, 4, -18]],
};
const ALIAS = { 'Exod': 'Exodul', 'Levitic': 'Leviticul', 'Deuteronom': 'Deuteronomul', 'Psalmii': 'Psalmul', 'Plângerile': 'Plângerile lui Ieremia' };
function conv(book, c, v) {
  book = ALIAS[book] || book;
  if (book === 'Psalmul') {
    const o = PS[c]; if (!o || !o.k) return null;
    if (v <= o.k) return { title: true, c, v };
    return { c, v: v - o.k };
  }
  const rs = RULES[book]; if (!rs) return null;
  for (const [hc, a, b, nc, d] of rs) if (c === hc && v >= a && v <= b) { const nv = v + d; if (nc === c && nv === v) return null; return { c: nc, v: nv }; }
  return null;
}
module.exports = { conv, RULES, PS, ALIAS };
