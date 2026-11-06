// Geneza 11: dict_ro pentru cifrele din genealogia 11:10–32 — anul de la creație la nașterea fiecărui patriarh, calculat din cifrele celor trei texte
// (masoretic: din textul românesc al tokenului; Septuaginta: din Rahlfs; samaritean: din rândul de comparație). Nimic nu e scris din memorie: totul se obține prin adunare,
// pornind de la anul potopului din Geneza 5 (tools/g5-chron.js: masoretic 1656, Septuaginta 2242; samaritean 1307 = 707 + 600, 707 fiind suma cifrelor samaritene din Geneza 5).
// node tools/g11-chron.js [--write]
const fs = require('fs');
const WRITE = process.argv.includes('--write');
const t5 = require('./g5-chron.js').table; const last = t5[t5.length - 1];
const FLOOD = { m: last[1] + 600, g: last[2] + 600, s: 1307 };
// [verset vârstă, verset ani rămași, patriarh, copil, vârstă m/g/s, ani rămași m/g/s]
const P = [
  [12, 13, 'Arpacșad', 'Șelah', [35, 135, 135], [403, 430, 303]],
  [14, 15, 'Șelah', 'Ever', [30, 130, 130], [403, 330, 303]],
  [16, 17, 'Ever', 'Peleg', [34, 134, 134], [430, 370, 270]],
  [18, 19, 'Peleg', 'Reu', [30, 130, 130], [209, 209, 109]],
  [20, 21, 'Reu', 'Serug', [32, 132, 132], [207, 207, 107]],
  [22, 23, 'Serug', 'Nahor', [30, 130, 130], [200, 200, 100]],
  [24, 25, 'Nahor', 'Terah', [29, 79, 79], [119, 129, 69]],
];
const out = {}; // „verset|cuvânt” -> text
let y = { m: FLOOD.m + 2, g: FLOOD.g + 2, s: FLOOD.s + 2 }; // Arpacșad se naște la 2 ani după potop (11:10)
const born = { Arpacșad: { ...y } };
out['10|doi ani'] = 'Arpacșad se naște la doi ani după potop, adică în anul ' + y.m + ' de la creație (în Septuaginta, ' + y.g + '; în Pentateuhul Samaritean, ' + y.s + '). Anul potopului se obține din Geneza 5: ' + FLOOD.m + ' (Septuaginta, ' + FLOOD.g + '; samaritean, ' + FLOOD.s + ').';
out['10|o sută de ani'] = 'Șem avea o sută de ani când s-a născut Arpacșad, la doi ani după potop; deci s-a născut el însuși în anul ' + (y.m - 100) + ' de la creație (în Septuaginta, ' + (y.g - 100) + '; în Pentateuhul Samaritean, ' + (y.s - 100) + ').';
out['11|cinci sute de ani'] = 'Șem mai trăiește cinci sute de ani după nașterea lui Arpacșad, în total șase sute de ani (totalul îl dă expres Pentateuhul Samaritean); moare în anul ' + (y.m + 500) + ' de la creație (în Septuaginta, ' + (y.g + 500) + '; în Pentateuhul Samaritean, ' + (y.s + 500) + ').';
const W = { 12: 'treizeci și cinci de ani', 13: 'patru sute trei ani', 14: 'treizeci de ani', 15: 'patru sute trei ani', 16: 'treizeci și patru de ani', 17: 'patru sute treizeci de ani', 18: 'treizeci de ani', 19: 'două sute nouă ani', 20: 'treizeci și doi de ani', 21: 'două sute șapte ani', 22: 'treizeci de ani', 23: 'două sute de ani', 24: 'douăzeci și nouă de ani', 25: 'o sută nouăsprezece ani', 26: 'șaptezeci de ani', 32: 'două sute cinci ani' };
let cur = { ...y };
for (const [va, vr, name, child, a, r] of P) {
  const nxt = { m: cur.m + a[0], g: cur.g + a[1], s: cur.s + a[2] };
  let t = child + ' se naște în anul ' + nxt.m + ' de la creație';
  if (va === 12) t += ' (în Septuaginta, Arpacșad naște mai întâi pe Cainan, în anul ' + nxt.g + ', iar Cainan naște pe Șelah abia în anul ' + (nxt.g + 130) + '; în Pentateuhul Samaritean, ' + nxt.s + ')';
  else t += ' (în Septuaginta, ' + nxt.g + '; în Pentateuhul Samaritean, ' + nxt.s + ')';
  t += '. Anul se obține adunând vârstele patriarhilor la nașterea fiului lor, de la potop încoace.';
  if (va === 12) { nxt.g += 130; }
  out[va + '|' + W[va]] = t;
  const diffs = []; if (r[1] !== r[0]) diffs.push('în Septuaginta, ' + r[1] + (va === 12 ? ' de ani după nașterea lui Cainan' : '')); if (r[2] !== r[0]) diffs.push('în Pentateuhul Samaritean, ' + r[2]);
  const tot = (a[0] + r[0]) + ' de ani în textul masoretic (' + (a[1] + r[1]) + ' în Septuaginta, ' + (a[2] + r[2]) + ' în Pentateuhul Samaritean)';
  const t2 = name + ' mai trăiește ' + r[0] + ' de ani după nașterea lui ' + child + (diffs.length ? ' (' + diffs.join('; ') + ')' : ' (la fel în Septuaginta și în Pentateuhul Samaritean)') + '; împreună cu cei ' + a[0] + ' de dinainte, face ' + tot + '.';
  out[vr + '|' + W[vr]] = t2;
  born[child] = { ...nxt }; cur = nxt;
}
// Septuaginta: Cainan (11:13) — cifrele lui nu au corespondent în ebraică
out['13|patru sute trei ani'] = out['13|patru sute trei ani'].replace(/\.$/, '') + '. Septuaginta intercalează aici pe Cainan, născut în anul ' + (born['Șelah'].g - 130) + ', care trăiește 130 de ani până la nașterea lui Șelah și 330 după; ebraica și textul samaritean nu-l au.';
const T = born['Terah'];
out['26|șaptezeci de ani'] = 'Terah are șaptezeci de ani când se nasc Avram, Nahor și Haran, adică în anul ' + (T.m + 70) + ' de la creație (în Septuaginta, ' + (T.g + 70) + '; în Pentateuhul Samaritean, ' + (T.s + 70) + '). Textul nu spune că cei trei s-au născut în același an; numele lui Avram stă primul, dar nu e neapărat primul născut.';
out['32|două sute cinci ani'] = 'Terah moare în Haran la două sute cinci ani, adică în anul ' + (T.m + 205) + ' de la creație (în Septuaginta, ' + (T.g + 205) + '). Pentateuhul Samaritean are aici o sută patruzeci și cinci de ani, deci anul ' + (T.s + 145) + ': după această cifră Terah moare exact când Avram, născut la 70 de ani ai lui Terah, are 75 de ani, vârsta plecării din Haran (12:4); în ebraică și în Septuaginta, Terah ar mai fi trăit încă 60 de ani după plecarea lui Avram.';
module.exports = { out, born };
if (require.main === module) {
  const f = 'C:/Users/ivcatali/biblie-app/public/genesis-11.js';
  const D = new Function('window', fs.readFileSync(f, 'utf8') + ';return window;')({}).CHAPTER_DATA;
  let n = 0, miss = [];
  for (const [k, v] of Object.entries(out)) { const [vs, w] = k.split('|'); const t = D.find(x => x.num === +vs).tokens.find(t => t.heb && t.w === w); if (!t) { miss.push(k); continue; } if (t.dict_ro !== v) { t.dict_ro = v; n++; } }
  console.log(WRITE ? 'SCRIS' : 'PROBĂ', '| dict_ro cronologie puse:', n, miss.length ? '| lipsă: ' + miss.join('; ') : '');
  if (!WRITE) Object.entries(out).forEach(([k, v]) => console.log(k + ' => ' + v));
  if (WRITE) fs.writeFileSync(f, 'window.CHAPTER_DATA = ' + JSON.stringify(D, null, 1).replace(/\n/g, '\r\n') + ';\r\n', 'utf8');
}
