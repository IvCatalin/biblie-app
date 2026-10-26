// decide, pentru fiecare citare din comentarii, dacă e în numerotarea ebraică (se convertește) sau deja EDC100 (rămâne),
// comparând citatul din context cu textul EDC100 al versetelor X (cum e scris) și Y (convertit)
const fs = require('fs');
const { execSync } = require('child_process');
const D = 'C:/Users/ivcatali/AppData/Local/Temp/claude/C--Users-ivcatali-biblie-app/1b2de2ce-5fde-4d73-ba50-1c613a2c9173/scratchpad/';
const base = 'C:/Users/ivcatali/biblie-app/de-procesat/_haftarot-extract/';
const NUM = { 'Geneza': 1, 'Exodul': 2, 'Exod': 2, 'Leviticul': 3, 'Levitic': 3, 'Numeri': 4, 'Deuteronomul': 5, 'Deuteronom': 5, '1 Samuel': 9, '2 Samuel': 10, '1 Împărați': 11, '2 Împărați': 12, '1 Cronici': 13, '2 Cronici': 14, 'Neemia': 16, 'Iov': 18, 'Psalmul': 19, 'Psalmii': 19, 'Eclesiastul': 21, 'Isaia': 23, 'Ieremia': 24, 'Ezechiel': 26, 'Daniel': 27, 'Osea': 28, 'Ioel': 29, 'Iona': 32, 'Mica': 33, 'Naum': 34, 'Zaharia': 38, 'Maleahi': 39 };
const cacheF = D + 'edc-cache.json'; let cache = {}; try { cache = JSON.parse(fs.readFileSync(cacheF, 'utf8')); } catch (e) { }
function verse(book, c, v) {
  const k = book + '|' + c + ':' + v; if (cache[k] !== undefined) return cache[k];
  const p = x => String(x).padStart(3, '0'), bb = String(NUM[book]).padStart(2, '0');
  try { const j = JSON.parse(execSync(`curl -s --compressed -m 30 "https://a1.ebiblia.net/range/ebvdcc:${bb}:${p(c)}:${p(v)}/${bb}:${p(c)}:${p(v)}"`, { maxBuffer: 1e7 }).toString()); const key = Object.keys(j).find(x => /^\d\d:/.test(x)); return cache[k] = key ? j[key].replace(/\*|<[^>]+>/g, ' ') : ''; } catch (e) { return cache[k] = ''; }
}
const norm = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(w => w.length >= 4);
const STEM = w => w.slice(0, 5);
function overlap(quoteWords, verseText) { if (!quoteWords.length) return 0; const vs = new Set(norm(verseText).map(STEM)); return quoteWords.filter(w => vs.has(STEM(w))).length / quoteWords.length; }
const dm = {};
for (const f of ['haftarot-ciclu-saptamanal.json', 'haftarot-sarbatori.json']) dm[f.startsWith('haftarot-ciclu') ? 'C' : 'S'] = JSON.parse(fs.readFileSync(base + f, 'utf8'));
const lines = fs.readFileSync(D + 'citeconv-lista.txt', 'utf8').split('\n').filter(Boolean);
const dec = [], manual = [];
lines.forEach((ln, i) => {
  const mm = ln.match(/^([CS])(\d+) (.*?) ((?:Rashi|Ibn Ezra|Radak|Metzudat|Șadal|Talmud|Ralbag|Malbim|Abarbanel|Targum|Mișna|Midra|Zohar|Ramban|Sforno)[^:]*): (.*) -> (.*)$/);
  if (!mm) { manual.push('NEPARSAT ' + ln); return; }
  const [, tag, n, vk, auth, from, to] = mm;
  const ch = dm[tag].chapters.find(c => c.num === +n); const v = ch.verses.find(x => x.v === vk);
  const cm = v && (v.commentaries || []).find(c => c.author === auth && c.text.includes(from));
  if (!cm) { manual.push('FĂRĂ COMENTARIU ' + ln); return; }
  const idx = cm.text.indexOf(from);
  const before = cm.text.slice(Math.max(0, idx - 140), idx);
  // citatul: ultimul „…” din before, altfel tot contextul
  const q = [...before.matchAll(/„([^”]{4,})”/g)].pop();
  const quote = q ? q[1] : before;
  const qw = norm(quote).map(STEM).length ? norm(quote) : [];
  const b = from.match(/^(.*?) (\d+):(\d+)/), t = to.match(/^(.*?) (\d+):(\d+)/);
  const X = verse(b[1], +b[2], +b[3]), Y = verse(t[1], +t[2], +t[3]);
  const ox = overlap(qw, X), oy = overlap(qw, Y);
  let choice = 'manual';
  if (ox - oy >= 0.2 && ox >= 0.35) choice = 'X'; else if (oy - ox >= 0.2 && oy >= 0.35) choice = 'Y';
  dec.push({ i: i + 1, tag, n: +n, vk, auth, from, to, ox: +ox.toFixed(2), oy: +oy.toFixed(2), choice, quote: quote.slice(-90) });
});
fs.writeFileSync(cacheF, JSON.stringify(cache));
fs.writeFileSync(D + 'comdecide.json', JSON.stringify(dec, null, 1));
const cnt = { X: 0, Y: 0, manual: 0 }; dec.forEach(d => cnt[d.choice]++);
console.log(cnt, 'neparsate:', manual.length);
console.log(manual.join('\n'));
console.log(dec.filter(d => d.choice === 'manual').map(d => `#${d.i} ${d.tag}${d.n} ${d.vk} ${d.from} -> ${d.to} | ox=${d.ox} oy=${d.oy} | «${d.quote}»`).join('\n'));
