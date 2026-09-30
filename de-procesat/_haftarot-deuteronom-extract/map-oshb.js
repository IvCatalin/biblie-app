// Potrivește fiecare verset din Haftarot cu versetul OSHB, după textul ebraic (consoane), nu după număr
// → oshb-map.json { "<cap>|<v>": {osis, score} }
const fs = require('fs'); const O = require('./oshb');
const d = JSON.parse(fs.readFileSync('../_haftarot-extract/haftarot-ciclu-saptamanal.json', 'utf8'));
const BK = { 'Isaia': 'Isa', '1 Împărați': '1Kgs', '2 Împărați': '2Kgs', 'Maleahi': 'Mal', 'Osea': 'Hos', 'Ioel': 'Joel', 'Obadia': 'Obad', 'Amos': 'Amos', 'Ezechiel': 'Ezek', 'Ieremia': 'Jer', 'Judecători': 'Judg', '1 Samuel': '1Sam', '2 Samuel': '2Sam', 'Zaharia': 'Zech', 'Iosua': 'Josh', 'Mica': 'Mic' };
const bigr = s => { const m = new Map(); for (let i = 0; i < s.length - 1; i++) { const k = s.slice(i, i + 2); m.set(k, (m.get(k) || 0) + 1); } return m; };
function dice(a, b) { const A = bigr(a), B = bigr(b); let x = 0, n = 0; for (const [k, c] of A) { n += c; x += Math.min(c, B.get(k) || 0); } for (const c of B.values()) n += c; return n ? 2 * x / n : 0; }
const books = {}; const bookOf = b => books[b] || (books[b] = Object.entries(O.book(b)).map(([k, ws]) => [k, O.cons(ws.map(w => w.heb).join(''))]));
const out = {}; const low = [];
for (const ch of d.chapters) {
  const refBooks = Object.keys(BK).filter(n => ch.ref.includes(n) || ch.verses.some(v => String(v.v).includes(n)));
  for (const v of ch.verses) {
    const hc = O.cons(v.heb || '');
    let best = null;
    // cărțile candidate: cea din eticheta versetului, apoi cele din referința capitolului
    const lab = Object.keys(BK).find(n => String(v.v).startsWith(n));
    const cands = lab ? [lab] : refBooks;
    for (const n of cands) for (const [k, c] of bookOf(BK[n])) {
      if (Math.abs(c.length - hc.length) > hc.length * 0.5) continue;
      const s = dice(hc, c); if (!best || s > best.score) best = { osis: k, score: +s.toFixed(3) };
    }
    out[ch.num + '|' + v.v] = best;
    if (!best || best.score < 0.9) low.push(`${ch.num} ${ch.title} ${v.v} → ${best && best.osis} ${best && best.score}`);
  }
}
fs.writeFileSync('oshb-map.json', JSON.stringify(out, null, 0));
console.log('versete potrivite:', Object.keys(out).length, '| sub 0,9:', low.length); console.log(low.join('\n'));
