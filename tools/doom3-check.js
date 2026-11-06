// Verifică textul românesc al unui capitol de Geneză după DOOM3 online (https://doom.lingv.ro/cautare/q/<cuvânt>).
// node tools/doom3-check.js N [N...]
// Pași: 1) filtru prin lista Hunspell ro_RO (cuvintele cunoscute de ea nu se mai interoghează); 2) pentru restul, interogare DOOM3 (răspunsul se păstrează în data/doom3-cache.json: ok / aprox / nu);
// 3) pentru formele cu articol hotărât sau flexiuni regulate, care DOOM3 nu le listează separat, se încearcă baza (ex. „pământul” → „pământ”); 4) ce rămâne se afișează pentru triere manuală
// (transliterări, nume, citate străine, erori reale). DOOM3 listează doar formele neregulate, deci „aprox/nu” nu înseamnă automat greșeală.
const fs = require('fs'), path = require('path');
const { rospell } = require('./lib-ro.js');
const CACHE = path.join(__dirname, '..', 'data', 'doom3-cache.json');
const cache = fs.existsSync(CACHE) ? JSON.parse(fs.readFileSync(CACHE, 'utf8')) : {};
const chapters = process.argv.slice(2).filter(a => /^\d+$/.test(a)).map(Number);
const textOf = (N) => {
  const D = new Function('window', fs.readFileSync('public/genesis-' + N + '.js', 'utf8') + ';return window;')({}).CHAPTER_DATA;
  const txt = [];
  for (const x of D) {
    for (const t of x.tokens) for (const f of ['t', 'def_ro', 'dict_ro', 'greek_def_ro', 'diff_ro']) if (t[f]) txt.push(t[f]);
    for (const c of x.textCompare) txt.push(c.translation || '', c.note || '');
    for (const c of x.commentaries) if (c.text) txt.push(c.text);
    if (x.fidela) txt.push(JSON.stringify(x.fidela));
  }
  return txt.join('\n').replace(/<[^>]*>/g, ' ');
};
const words = {};
for (const N of chapters) for (const m of textOf(N).matchAll(/[A-Za-zăâîșțĂÂÎȘȚ]+(?:-[A-Za-zăâîșțĂÂÎȘȚ]+)*/g)) {
  for (const p of m[0].split('-')) { const k = p.toLowerCase(); if (k.length > 1 && /^[a-zăâîșț]+$/.test(k)) words[k] = (words[k] || 0) + 1; }
}
async function q(w) {
  if (cache[w]) return cache[w];
  for (let i = 0; i < 4; i++) {
    try {
      const r = await fetch('https://doom.lingv.ro/cautare/q/' + encodeURIComponent(w), { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (!r.ok) throw new Error(r.status);
      const t = await r.text();
      return (cache[w] = /Niciun rezultat/.test(t) ? 'nu' : /căutare aproximativă/.test(t) ? 'aprox' : 'ok');
    } catch (e) { await new Promise(s => setTimeout(s, 700 * (i + 1))); }
  }
  return 'eroare';
}
const BASES = (w) => {
  const o = new Set();
  const rules = [['ului', ['']], ['ilor', ['i', 'e', '']], ['elor', ['e', 'a', 'ă', '']], ['ile', ['i', 'e', '']], ['ele', ['e', 'a', 'ă', '']], ['ul', ['']], ['lui', ['']], ['le', ['', 'e', 'i']], ['ii', ['i', 'ie']], ['ei', ['ă', 'e', 'a']], ['ea', ['e', 'ă']], ['a', ['ă', '', 'e']]];
  for (const [s, r] of rules) if (w.endsWith(s) && w.length - s.length >= 2) for (const x of r) o.add(w.slice(0, w.length - s.length) + x);
  return [...o];
};
async function pool(items, fn, n = 8) { let i = 0; await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) await fn(items[i++]); })); }
(async () => {
  const ROS = await rospell();
  const unk = Object.keys(words).filter(w => !ROS.has(w));
  const todo = unk.filter(w => !cache[w]);
  console.log('cuvinte distincte', Object.keys(words).length, '| necunoscute în lista Hunspell', unk.length, '| de interogat în DOOM3', todo.length);
  let done = 0;
  await pool(todo, async (w) => { await q(w); if (++done % 300 === 0) { fs.writeFileSync(CACHE, JSON.stringify(cache)); console.log(done + '/' + todo.length); } });
  const rescued = new Set();
  const second = unk.filter(w => cache[w] !== 'ok');
  await pool(second, async (w) => { for (const b of BASES(w)) { const v = ROS.has(b) ? 'ok' : await q(b); if (v === 'ok') { rescued.add(w); break; } } });
  fs.writeFileSync(CACHE, JSON.stringify(cache));
  const foreign = /[kqwy]|sh|kh|ts|zh|aq|eq|ʿ/;
  const bad = unk.filter(w => cache[w] !== 'ok' && !rescued.has(w));
  const rom = bad.filter(w => !foreign.test(w)).sort((a, b) => words[b] - words[a]);
  console.log('necunoscute după DOOM3 (cu baze de articol):', bad.length, '| fără transliterări evidente:', rom.length);
  console.log(rom.map(w => w + (words[w] > 1 ? '(' + words[w] + ')' : '') + (cache[w] === 'eroare' ? '!' : '')).join(' '));
})();
