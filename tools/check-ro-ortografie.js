// Verificare ortografică (DOOM3) a textului românesc dintr-un capitol: node tools/check-ro-ortografie.js <N>
// 1) litere: ș/ț cu virgulă (nu cedilă), â/î (fără „â” la început/sfârșit de cuvânt, „î” interior doar în compuse), „sunt”
// 2) cuvinte: comparate cu lista rospell (Hunspell ro_RO, LibreOffice), descărcată o dată în %TEMP%/ro-dict.
// Lista rospell NU e DOOM3: cuvintele necunoscute se triază manual (transliterări, nume, citate străine, flexiuni lipsă) și, la nevoie, se caută pe dexonline.ro (sursa DOOM 3).
const fs = require('fs'), os = require('os'), path = require('path');
const N = process.argv[2] || 1;
const dir = path.join(os.tmpdir(), 'ro-dict'); fs.mkdirSync(dir, { recursive: true });
async function get(f) { const p = path.join(dir, f); if (!fs.existsSync(p)) fs.writeFileSync(p, Buffer.from(await (await fetch('https://raw.githubusercontent.com/LibreOffice/dictionaries/master/ro/' + f)).arrayBuffer())); return fs.readFileSync(p, 'utf8'); }
function forms(aff, dic) {
  const R = {};
  for (const l of aff.split(/\r?\n/)) { const p = l.trim().split(/\s+/); if (p[0] !== 'SFX' && p[0] !== 'PFX') continue;
    if (p.length === 4 && /^[YN]$/.test(p[2])) { R[p[0] + p[1]] = { type: p[0], rules: [] }; continue; }
    if (p.length >= 5 && R[p[0] + p[1]]) { const r = R[p[0] + p[1]]; const add = p[3].split('/')[0]; r.rules.push({ strip: p[2] === '0' ? '' : p[2], add: add === '0' ? '' : add, cond: new RegExp(r.type === 'SFX' ? '(?:' + p[4] + ')$' : '^(?:' + p[4] + ')') }); } }
  const out = new Set();
  for (const line of dic.split(/\r?\n/).slice(1)) { if (!line) continue; const i = line.indexOf('/'); const w = i < 0 ? line : line.slice(0, i); const fl = i < 0 ? '' : line.slice(i + 1); out.add(w.toLowerCase());
    for (const f of fl) for (const r of [R['SFX' + f], R['PFX' + f]]) { if (!r) continue; for (const ru of r.rules) { if (!ru.cond.test(w)) continue;
      if (r.type === 'SFX') { if (ru.strip && !w.endsWith(ru.strip)) continue; out.add((w.slice(0, w.length - ru.strip.length) + ru.add).toLowerCase()); }
      else { if (ru.strip && !w.startsWith(ru.strip)) continue; out.add((ru.add + w.slice(ru.strip.length)).toLowerCase()); } } } }
  return out;
}
(async () => {
  const D = new Function('window', fs.readFileSync('public/genesis-' + N + '.js', 'utf8') + ';return window;')({}).CHAPTER_DATA;
  const txt = [];
  for (const x of D) { for (const t of x.tokens) for (const f of ['t', 'def_ro', 'dict_ro', 'greek_def_ro', 'diff_ro']) if (t[f]) txt.push(t[f]);
    for (const c of x.textCompare) txt.push(c.translation || '', c.note || ''); for (const c of x.commentaries) if (c.text) txt.push(c.text); if (x.fidela) txt.push(JSON.stringify(x.fidela)); }
  const all = txt.join('\n').replace(/<[^>]*>/g, ' ');
  const cnt = (re) => (all.match(re) || []).length;
  console.log('cedilă (ş ţ):', cnt(/[şţŞŢ]/g), '| sînt:', cnt(/\bsînt/gi), '| â inițial/final:', cnt(/(?<![A-Za-zăâîșț])â|â(?![A-Za-zăâîșț])/g));
  const F = forms(await get('ro_RO.aff'), await get('ro_RO.dic'));
  const w = {}; for (const m of all.matchAll(/[A-Za-zăâîșțĂÂÎȘȚ'-]+/g)) { const k = m[0].toLowerCase().replace(/^['-]+|['-]+$/g, ''); if (k.length > 1) w[k] = (w[k] || 0) + 1; }
  const bad = Object.entries(w).filter(([k]) => !k.split('-').filter(Boolean).every(p => F.has(p))).sort((a, b) => b[1] - a[1]);
  console.log('cuvinte distincte', Object.keys(w).length, '| necunoscute de lista rospell (de triat manual):', bad.length);
  console.log(bad.map(b => b[0]).join(' '));
})();
