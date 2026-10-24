// node carry.js <capS> <capW> [--scrie] — pentru versetele cu același osis ca în ciclul săptămânal: copiază LXX pe tag (după aceeași ebraică), LXX textCompare, comentarii (uniune) și trimiteri din capitolul săptămânal
const fs = require('fs'), path = require('path');
const cs = +process.argv[2], cw = +process.argv[3];
const SF = path.join(__dirname, '../haftarot-sarbatori.json');
const D = JSON.parse(fs.readFileSync(SF, 'utf8')), S = D.chapters.find(c => c.num === cs);
const W = JSON.parse(fs.readFileSync(path.join(__dirname, '../haftarot-ciclu-saptamanal.json'), 'utf8')).chapters.find(c => c.num === cw);
const MS = JSON.parse(fs.readFileSync(path.join(__dirname, '../../_sarbatori_extract/oshb-map-sarbatori.json'), 'utf8'));
const MW = JSON.parse(fs.readFileSync(path.join(__dirname, '../../_haftarot-deuteronom-extract/oshb-map.json'), 'utf8'));
const auth = a => a.replace(/ \(.*/, '').replace(/,.*/, '').trim();
let nt = 0, miss = [], nc = 0, nr = 0;
for (const v of S.verses) {
  const o = (MS[cs + '|' + v.v] || {}).osis; const w = W.verses.find(x => MW[cw + '|' + x.v] && MW[cw + '|' + x.v].osis === o); if (!w) continue;
  const used = new Set();
  for (const t of v.tokens.filter(t => t.heb)) {
    if (t.greek || t.diff_ro) { nt++; continue; }
    const j = w.tokens.findIndex((x, i) => !used.has(i) && x.heb === t.heb && (x.greek || x.diff_ro));
    if (j < 0) { miss.push(v.v + ' «' + t.t + '»'); continue; }
    used.add(j); const x = w.tokens[j]; if (x.greek) { t.greek = x.greek; t.greek_def_ro = x.greek_def_ro; } if (x.diff_ro) t.diff_ro = x.diff_ro; nt++;
  }
  const wl = (w.textCompare || []).find(t => t.greek);
  if (wl && v.t !== w.t) { v.textCompare = (v.textCompare || []).filter(t => !t.greek); v.textCompare.push(JSON.parse(JSON.stringify(wl))); }
  const have = new Set((w.commentaries || []).map(c => auth(c.author)));
  const merged = JSON.parse(JSON.stringify(w.commentaries || [])); for (const c of v.commentaries || []) if (!have.has(auth(c.author))) merged.push(c);
  if (merged.length > (v.commentaries || []).length) { nc += merged.length - (v.commentaries || []).length; v.commentaries = merged; }
  if (w.refs && w.refs.length) { v.refs = w.refs.slice(); nr++; }
}
console.log(`tag-uri cu LXX: ${nt}; fără corespondent în săptămânal: ${miss.length}\n${miss.join('\n')}\ncomentarii adăugate: ${nc}; versete cu trimiteri copiate: ${nr}`);
if (process.argv.includes('--scrie')) { fs.writeFileSync(SF, JSON.stringify(D, null, 1)); console.log('Scris.'); }
