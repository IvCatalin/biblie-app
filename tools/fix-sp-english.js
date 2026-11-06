// Înlocuiește traducerea ENGLEZĂ din rândurile cu Pentateuhul Samaritean (comparația de texte) cu versiunea românească a versetului din Biblioteca (sp-geneza).
// node tools/fix-sp-english.js N [N...] [--write]
const fs = require('fs');
const WRITE = process.argv.includes('--write');
const chs = process.argv.slice(2).filter(a => /^\d+$/.test(a)).map(Number);
const s = fs.readFileSync('public/library-data.js', 'utf8'); const L = JSON.parse(s.slice(s.indexOf('{'), s.lastIndexOf('}') + 1));
let book; (function w(o) { if (!o || book) return; if (Array.isArray(o)) return o.forEach(w); if (typeof o !== 'object') return; if (o.slug === 'sp-geneza') { book = o; return; } Object.values(o).forEach(w); })(L);
const plain = t => String(t).replace(/[⁠​‌]/g, '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const EN = /\b(the|and|of|unto|thou|said|with|which|shall|upon|hath|his|her|LORD|And|that|was|from|into|they|them)\b/g;
for (const N of chs) {
  const f = 'public/genesis-' + N + '.js';
  const D = new Function('window', fs.readFileSync(f, 'utf8') + ';return window;')({}).CHAPTER_DATA;
  const ch = book.chapters.find(c => c.num === N); let n = 0, miss = [];
  for (const x of D) {
    const r = x.textCompare.find(q => /Samaritean/.test(q.source)); if (!r) continue;
    const i = r.translation.indexOf(' — „'); if (i < 0) continue;
    const eng = r.translation.slice(i + 4).replace(/[”"]\s*$/, '');
    if (/[֐-׿]/.test(eng) || (eng.match(EN) || []).length < 2) continue;
    const v = ch.verses.find(q => q.v === x.num); if (!v) { miss.push(x.num); continue; }
    r.translation = r.translation.slice(0, i) + ' — „' + plain(v.t).replace(/[”"]\s*$/, '') + '”'; n++;
  }
  console.log('Geneza', N, WRITE ? 'SCRIS' : 'PROBĂ', '| rânduri tradusese:', n, miss.length ? '| fără verset în sp-geneza: ' + miss : '');
  if (WRITE) fs.writeFileSync(f, 'window.CHAPTER_DATA = ' + JSON.stringify(D, null, 1).replace(/\n/g, '\r\n') + ';\r\n', 'utf8');
}
