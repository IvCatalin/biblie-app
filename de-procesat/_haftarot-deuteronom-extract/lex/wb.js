// Masa de lucru: node lex/wb.js <cap> [de la] [până la] — afișează pentru fiecare verset textul Rosen, cuvintele deja explicate,
// cuvintele ebraice OSHB (Strong, morfologie, sens de bază) și textul LXX
const fs = require('fs'); const path = require('path'); const O = require('../oshb');
const d = JSON.parse(fs.readFileSync(path.join(__dirname, '../../_haftarot-extract/haftarot-ciclu-saptamanal.json'), 'utf8'));
const S = (() => { const s = fs.readFileSync(path.join(__dirname, '../strongs-heb.js'), 'utf8'); return JSON.parse(s.slice(s.indexOf('{'), s.lastIndexOf('}') + 1)); })();
const HLEX = fs.existsSync(path.join(__dirname, 'hlex.json')) ? JSON.parse(fs.readFileSync(path.join(__dirname, 'hlex.json'), 'utf8')) : {};
const GIDX = JSON.parse(fs.readFileSync(path.join(__dirname, 'gen-idx.json'), 'utf8'));
const [cn, a, b] = process.argv.slice(2).map(Number);
const ch = d.chapters[cn - 1];
console.log(`# ${ch.num} ${ch.title} — ${ch.ref} (${ch.verses.length} versete)`);
ch.verses.forEach((v, k) => {
  if (a && (k + 1 < a || k + 1 > b)) return;
  console.log(`\n== [${k + 1}] ${v.v}\nRO: ${v.t}`);
  const old = (v.tokens || []).filter(t => t.w).map(t => `${t.w}=${t.strong}`); if (old.length) console.log('VECHI: ' + old.join(' · '));
  const ws = O.haftWords(ch.num, v.v);
  console.log(ws.map(w => {
    const e = S[w.strong]; const tag = HLEX[w.strong] ? '✓' : GIDX[w.strong] ? 'G' : '';
    return `${w.i} ${w.heb} ${w.strong}${tag} ${w.translit} [${w.pos}] ${e ? (e.strongs_def || '').replace(/\s+/g, ' ').slice(0, 55) : ''}`;
  }).join('\n'));
  const lxx = (v.textCompare || []).find(t => t.greek); console.log('LXX: ' + (lxx ? lxx.original : '—'));
});
