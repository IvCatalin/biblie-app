// Audit Standardul Davar pe capitolele Genezei 1–23: text de bază vs Rosen, panou lexical, comparație texte, trimiteri, comentarii.
const fs = require('fs');
const P = 'C:/Users/ivcatali/biblie-app/public/';
const html = fs.readFileSync(P + 'library-data.js', 'utf8');
const i0 = html.indexOf('const LIBRARY = ') + 16;
const L = JSON.parse(html.slice(i0, html.indexOf('\n', i0)).trim().replace(/;$/, ''));
const rosen = L.arhivaRabinica.subfolders[0].items[0];
const plainR = (t) => String(t).replace(/<sup class="footnote-marker">[^<]*<\/sup>\s*<i class="footnote">[\s\S]*?<\/i>/g, '').replace(/<[^>]+>/g, '').trim();
const norm = (s) => s.replace(/\s+/g, ' ').trim();
const only = process.argv[2] ? [+process.argv[2]] : null;
const rows = [];
for (let N = 1; N <= 23; N++) {
  if (only && !only.includes(N)) continue;
  const w = new Function('window', fs.readFileSync(P + 'genesis-' + N + '.js', 'utf8') + ';return window;')({});
  const D = w.CHAPTER_DATA; const rc = rosen.chapters.find(c => c.num === N);
  let gMiss = 0, diffN = 0, tagged = 0, dictOk = 0, dictMiss = 0, tcMiss = 0, tc3 = 0, refs = 0, refMin = 99, comm = 0, mism = [], noComm = 0, lexMissFields = 0, noFid = 0;
  for (const x of D) {
    const joined = norm(x.tokens.map(t => t.t).join(''));
    const rv = rc.verses.find(v => v.v === x.num);
    if (!rv || norm(plainR(rv.t)) !== joined) mism.push(N + ':' + x.num);
    const tg = x.tokens.filter(t => t.heb); tagged += tg.length;
    tg.forEach(t => { if (!t.greek_def_ro) gMiss++; if (t.diff_ro) diffN++; if (t.dict_ro) dictOk++; else dictMiss++; if (!t.def_ro || !t.translit) lexMissFields++; });
    const tc = x.textCompare || []; if (!tc.length) tcMiss++; if (tc.length >= 3) tc3++;
    refs += (x.refs || []).length; refMin = Math.min(refMin, (x.refs || []).length);
    comm += x.commentaries.length; if (!x.commentaries.length) noComm++;
    if (!x.fidela) noFid++;
  }
  rows.push({ N, v: D.length, tagAvg: (tagged / D.length).toFixed(1), dictMiss, lexMissFields, tcMiss, tc3, refsAvg: (refs / D.length).toFixed(1), refMin, commAvg: (comm / D.length).toFixed(1), noComm, mism: mism.length, mismList: mism.slice(0, 6).join(','), noFid, gMiss, diffN });
}
console.log('cap | versete | cuv.tagate/verset (țintă 9,9) | dict_ro lipsă | câmpuri lexicale lipsă | fără comparație | comparații cu 3 surse | trimiteri/verset | min | comentarii/verset | fără comentarii | text ≠ Rosen | fără Fidela');
rows.forEach(r => console.log([r.N, r.v, r.tagAvg, r.dictMiss, r.lexMissFields, r.tcMiss, r.tc3, r.refsAvg, r.refMin, r.commAvg, r.noComm, r.mism + (r.mism ? ' [' + r.mismList + ']' : ''), r.noFid, 'greek_def_ro lipsă ' + r.gMiss, 'diff_ro ' + r.diffN].join(' | ')));
