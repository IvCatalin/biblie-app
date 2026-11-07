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
const T = require('./doom3-text.js');
const words = {}; for (const N of chapters) for (const [k, o] of Object.entries(T.words(N))) { const w = words[k] = words[k] || { n: 0, low: 0, cap: 0 }; w.n += o.n; w.low += o.low; w.cap += o.cap; }
const ALLOW_F = path.join(__dirname, '..', 'data', 'doom3-allow.json'); const ALLOW = fs.existsSync(ALLOW_F) ? JSON.parse(fs.readFileSync(ALLOW_F, 'utf8')) : {};
const STATE_F = path.join(__dirname, '..', 'data', 'doom3-state.json'); const STATE = fs.existsSync(STATE_F) ? JSON.parse(fs.readFileSync(STATE_F, 'utf8')) : {};
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
  const foreign = /[kqwy]|sh|kh|ts|zh|aq|eq|ʿ|^[bcdfghjklmnpqrstvwxz]+$/;
  const bad = unk.filter(w => cache[w] !== 'ok' && !rescued.has(w));
  // clasificare: nume proprii (apar doar cu majusculă), transliterări evidente; restul = de triat manual
  const names = bad.filter(w => words[w].low === 0 && words[w].cap > 0), translit = bad.filter(w => !names.includes(w) && foreign.test(w));
  const rest = bad.filter(w => !names.includes(w) && !translit.includes(w)).sort((a, b) => words[b].n - words[a].n);
  const pend = rest.filter(w => !ALLOW[w]);
  for (const N of chapters) {
    const ws = T.words(N); const mine = Object.keys(ws).filter(w => pend.includes(w) || (!ROS.has(w) && cache[w] === 'eroare'));
    STATE[N] = { hash: T.hash(N), data: new Date().toISOString().slice(0, 10), nume: names.filter(w => ws[w]).length, translit: translit.filter(w => ws[w]).length, netriate: mine };
  }
  fs.writeFileSync(STATE_F, JSON.stringify(STATE, null, 1));
  console.log('necunoscute după DOOM3:', bad.length, '| nume proprii (auto):', names.length, '| transliterări (auto):', translit.length, '| de triat manual:', pend.length);
  console.log(pend.map(w => w + (words[w].n > 1 ? '(' + words[w].n + ')' : '') + (cache[w] === 'eroare' ? '!' : '')).join(' '));
})();
