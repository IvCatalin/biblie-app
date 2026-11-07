// Matrice: pentru fiecare lucrare din Diverse care citează explicit Geneza (data/geneza-diverse-index.json), câte unități citează capitolele 1..N și câte sunt deja în rândurile capitolelor. node tools/audit-diverse.js [N=26] [--list]
const fs = require('fs');
const N = +(process.argv.find(a => /^\d+$/.test(a)) || 26), LIST = process.argv.includes('--list');
const IDX = JSON.parse(fs.readFileSync('data/geneza-diverse-index.json', 'utf8'));
const ZW = /[⁠​‌]/g;
const have = {}; // 'slug#num:v' -> true
const haveText = [];
for (let n = 1; n <= N; n++) { const D = new Function('window', fs.readFileSync('public/genesis-' + n + '.js', 'utf8') + ';return window;')({}).CHAPTER_DATA; for (const x of D) for (const c of x.commentaries || []) { if (c.src && c.src.spec) have[c.src.slug + '#' + c.src.spec.num + ':' + c.src.spec.v] = 1; } }
const fam = (s) => /^talmud-/.test(s) ? 'talmud' : /^mishna-/.test(s) ? 'mishna' : /^kab-/.test(s) ? 'kabbala' : /^tora-rosen|^haftarot|^sp-/.test(s) ? 'baza' : 'altele';
const tot = {}, miss = {};
for (let n = 1; n <= N; n++) for (const slug in (IDX[n] || {})) {
  const f = fam(slug); const seen = new Set();
  for (const u of IDX[n][slug].unitati) { const k = slug + '#' + u.cap + ':' + u.v; if (seen.has(k)) continue; seen.add(k); tot[slug] = tot[slug] || { f, n: 0, in: 0 }; tot[slug].n++; if (have[k]) tot[slug].in++; }
}
const byF = {}; for (const s in tot) { const t = tot[s]; byF[t.f] = byF[t.f] || { w: 0, n: 0, in: 0 }; byF[t.f].w++; byF[t.f].n += t.n; byF[t.f].in += t.in; }
console.log('familie | lucrări | unități care citează Geneza 1–' + N + ' | deja în capitole');
for (const f in byF) console.log(f + ' | ' + byF[f].w + ' | ' + byF[f].n + ' | ' + byF[f].in);
if (LIST) for (const s of Object.keys(tot).filter(s => tot[s].f === 'altele' || tot[s].f === 'kabbala').sort()) console.log('  ' + s + ' ' + tot[s].in + '/' + tot[s].n);
// La nivel de verset: versete cu citări explicite într-o familie, dar fără niciun rând din acea familie
const famOf = (c) => { const s = (c.src && c.src.slug) || ''; const a = c.author || ''; if (s) return fam(s); if (/^(Zohar|Sefer HaBahir|Idra|Sifra)/.test(a)) return 'kabbala'; if (/^Mi[șs]na/.test(a)) return 'mishna'; if (/^(Talmud|Tratatul)/.test(a)) return 'talmud'; if (/Jubilee/.test(a)) return 'altele'; return ''; };
const gaps = {};
for (let n = 1; n <= N; n++) {
  const D = new Function('window', fs.readFileSync('public/genesis-' + n + '.js', 'utf8') + ';return window;')({}).CHAPTER_DATA;
  const inCh = new Set(); for (const x of D) for (const c of x.commentaries || []) if (c.src && c.src.spec) inCh.add(x.num + '@' + c.src.slug + '#' + c.src.spec.num + ':' + c.src.spec.v);
  const cited = {}; for (const slug in (IDX[n] || {})) for (const u of IDX[n][slug].unitati) { const gv = +u.geneza.split(':')[1]; const f = fam(slug); if (inCh.has(gv + '@' + slug + '#' + u.cap + ':' + u.v)) { (cited[gv] = cited[gv] || {})['_ok_' + f] = 1; continue; } (cited[gv] = cited[gv] || {})[f] = (cited[gv][f] || 0) + 1; }
  for (const x of D) for (const f of ['talmud', 'mishna', 'kabbala', 'altele']) { if (!(cited[x.num] && cited[x.num][f])) continue; const has = (x.commentaries || []).some(c => famOf(c) === f) || (cited[x.num] && cited[x.num]['_ok_' + f]); if (!has) (gaps[f] = gaps[f] || []).push(n + ':' + x.num); }
}
console.log('\nversete cu citări explicite dar fără rând din familie:');
for (const f in gaps) console.log(f + ' (' + gaps[f].length + '): ' + gaps[f].join(' '));
