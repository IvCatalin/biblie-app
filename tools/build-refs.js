// Construiește data/ref-lxx-rahlfs-gen.json (Rahlfs 1935, CCAT, prelucrare E. Wong, CC BY-NC-SA) și data/ref-mt-sefaria-gen.json (Sefaria, ebraică) pentru Geneza 1..N.
// node tools/build-refs.js [N=15]
const fs = require('fs'), os = require('os'), path = require('path');
const MAX = +(process.argv[2] || 15);
const dir = path.join(os.tmpdir(), 'ro-dict'); fs.mkdirSync(dir, { recursive: true });
const B = 'https://raw.githubusercontent.com/eliranwong/LXX-Rahlfs-1935/master/';
async function get(u, f) { const p = path.join(dir, f); if (!fs.existsSync(p)) fs.writeFileSync(p, Buffer.from(await (await fetch(u)).arrayBuffer())); return fs.readFileSync(p, 'utf8'); }
(async () => {
  const words = new Map(); for (const l of (await get(B + '01_wordlist_unicode/text_accented.csv', 'lxx.csv')).split(/\r?\n/)) { const p = l.split('\t'); if (p.length >= 3 && p[2]) words.set(+p[0], p[2]); }
  const vs = (await get(B + '08_versification/001_verse_c_modified_KEEP.csv', 'verse.csv')).split(/\r?\n/).filter(Boolean).map(l => { const [r, i] = l.split('\t'); return [r, +i]; });
  const lx = {}; for (let k = 0; k < vs.length; k++) { const [r, i] = vs[k]; const m = r.match(/^Gen\.(\d+)\./); if (!m || +m[1] > MAX) continue; const e = k + 1 < vs.length ? vs[k + 1][1] : i + 1; const a = []; for (let j = i; j < e; j++) if (words.has(j)) a.push(words.get(j)); lx[r] = a.join(' '); }
  fs.writeFileSync('data/ref-lxx-rahlfs-gen.json', JSON.stringify(lx, null, 1));
  const he = {}; for (let c = 1; c <= MAX; c++) { const j = await (await fetch('https://www.sefaria.org/api/texts/Genesis.' + c + '?context=0&commentary=0&pad=0&lang=he')).json(); j.he.forEach((t, i) => { he['Gen.' + c + '.' + (i + 1)] = t; }); }
  fs.writeFileSync('data/ref-mt-sefaria-gen.json', JSON.stringify(he, null, 1));
  console.log('LXX', Object.keys(lx).length, 'versete | MT', Object.keys(he).length, 'versete');
})();
