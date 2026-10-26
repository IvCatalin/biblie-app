// Alege, pentru fiecare verset din aplicație, cel mult o trimitere Zohar și una Mișna (din graful de legături Sefaria, ancorate pe un singur verset)
// și construiește intrările de comentariu cu textul din arhivele Zohar/Mișna (traducerea deja integrată în aplicație).
// Utilizare: node select-links.js <dir-zohar> <dir-mishna> <dir-cache> <plan.json>
const fs = require('fs');
const path = require('path');
const { load } = require('./lib.js');
const [ZD, MD, CD, OUT] = process.argv.slice(2);
const R = 'C:/Users/ivcatali/biblie-app/';
const norm = s => s.toLowerCase().replace(/[^a-z]/g, '');

// ---------- Zohar: lucrări îmbinate + decalaje cumulative (Sefaria numără unitățile continuu pe lucrare) ----------
const zby = {};
for (const f of fs.readdirSync(ZD).filter(f => f.endsWith('.json'))) {
  const key = f.split('.').slice(1, f.includes('Addenda') ? 3 : 2).join('.');
  const sec = +((f.match(/sec(\d+)/) || [0, 0])[1]);
  const sub = f.match(/\.p(\d+)-/) || f.match(/sec7\.(\d+)-/);
  (zby[key] = zby[key] || []).push({ sec, p: sub ? +sub[1] : 0, d: JSON.parse(fs.readFileSync(path.join(ZD, f), 'utf8')) });
}
const Z = {}; // key -> {name, book, secs: {sec: {title, start, verses:[text]}}}
for (const key of Object.keys(zby)) {
  const parts = zby[key].sort((a, b) => a.sec - b.sec || a.p - b.p);
  const secs = {}; let cum = 0, order = [];
  for (const p of parts) for (const c of p.d.chapters) {
    if (!secs[c.chapter]) { secs[c.chapter] = { title: c.title, start: cum, verses: [] }; order.push(c.chapter); }
    for (const v of c.verses) { secs[c.chapter].verses.push(v.text); cum++; }
  }
  Z[key] = { book: parts[0].d.book, name: parts[0].d.book.split(' - ')[0], secs, total: cum };
}
// nume Sefaria -> cheie Zohar (normalizat); alias-uri pentru diferențe de transliterare
const ZALIAS = { chayeisara: 'Chayei_Sara', chayeisarah: 'Chayei_Sara', lechlecha: 'Lech_Lecha', kitisa: 'KiTisa', kitisso: 'KiTisa', kiteitzei: 'KiTeitzei', kitetzei: 'KiTeitzei', achareimot: 'AchareiMot', acharemot: 'AchareiMot', achreimot: 'AchareiMot',
  shmini: 'Shemini', shemini: 'Shemini', nasso: 'Naso', behaalotcha: 'Behaalotekha', behaalotekha: 'Behaalotekha', shelach: 'Shelah', shlach: 'Shelah', korach: 'Korah', pinchas: 'Pinhas', vaetchanan: 'Vaetchanan',
  haazinu: 'HaAzinu', haazinu2: 'HaAzinu', idrarabba: 'Idra_Raba', idraraba: 'Idra_Raba', idrazutah: 'IdraZuta', idrazuta: 'IdraZuta', sifraditzniuta: 'Sifra_diTzniuta', sifradetzniuta: 'Sifra_diTzniuta',
  addendavolumei: 'Addenda.volI', addendavolumeii: 'Addenda.volII', addendavolumeiii: 'Addenda.volIII', beshalach: 'Beshalach', vayeilech: 'Vayeilech', vayelech: 'Vayeilech', bechukotai: 'Bechukotai' };
const zbyNorm = {}; for (const k of Object.keys(Z)) zbyNorm[norm(k)] = k;
function zkey(sefName) { const n = norm(sefName.replace(/^Zohar,\s*/, '')); return ZALIAS[n] || zbyNorm[n] || null; }

// ---------- Mișna ----------
const M = {}; // normKey -> {chapters:[[texts]]}
for (const f of fs.readdirSync(MD).filter(f => f.endsWith('.json')).sort()) {
  const key = norm(f.split('.')[1]);
  const lo = +((f.match(/\.p(\d+)-/) || [0, 0])[1]);
  const d = JSON.parse(fs.readFileSync(path.join(MD, f), 'utf8'));
  (M[key] = M[key] || []).push({ lo, d });
}
const MT = {};
for (const k of Object.keys(M)) { const ch = []; for (const p of M[k].sort((a, b) => a.lo - b.lo)) for (const c of p.d.chapters) ch[c.chapter] = c.verses.map(v => v.text); MT[k] = ch; }
const MALIAS = { avot: 'pirkeiavot', pirkeiavot: 'pirkeiavot', taanit: 'taanit', rosh: 'roshhashanah' };
// nume românești ale tratatelor din LIBRARY (slug mishna-<cheie>)
const S = load(); const mi = S.lib.arhivaRabinica.subfolders.find(f => f.label === 'Mișna');
const MRO = {}; for (const it of mi.items) if (it.slug && it.slug.startsWith('mishna-') && it.available) {
  const nm = it.name.replace(/\s*\([^)]*\)\s*$/, '').trim();
  MRO[it.slug === 'mishna-avot' ? 'pirkeiavot' : norm(it.slug.replace(/^mishna-/, ''))] = nm;
}
function mkey(sefName) { const n = norm(sefName.replace(/^Mishnah\s+/, '')); return MALIAS[n] || n; }

// ---------- ținte ----------
const targets = JSON.parse(fs.readFileSync(path.join(CD, 'targets.json'), 'utf8'));
// parașa așteptată pentru un verset din Geneza (numerotare identică în 1–23)
function genFamily(c, v) {
  const x = c * 1000 + v;
  if (x < 6 * 1000 + 9) return 'Bereshit'; if (x < 12 * 1000 + 1) return 'Noach'; if (x < 18 * 1000 + 1) return 'Lech_Lecha'; if (x < 23 * 1000 + 1) return 'Vayera'; return 'Chayei_Sara';
}
const wk = JSON.parse(fs.readFileSync(R + 'de-procesat/_haftarot-extract/haftarot-ciclu-saptamanal.json', 'utf8'));
const wkFamily = {}; for (const c of wk.chapters) { const k = Object.keys(Z).find(x => Z[x].book === c.title); if (k) wkFamily[c.num] = k; }

const used = {}; // folosiri anterioare (pentru diversificare)
function excerpt(t) {
  if (t.length <= 1000) return t;
  const cut = t.slice(0, 900);
  const m = [...cut.matchAll(/[.!?”»)]\s/g)].pop();
  return (m ? cut.slice(0, m.index + 1) : cut.replace(/\s+\S*$/, '')) + ' […]';
}
function score(len, family, key, usedN, isZ) {
  let s = 0;
  if (family) s += 100;
  if (len >= 150 && len <= 1300) s += 30; else if (len > 2500) s -= 30; else if (len < 120) s -= 40;
  if (/^Addenda/.test(key)) s -= 50;
  s -= 40 * usedN;
  return s;
}
const plan = {}; // "kind|id" -> [ {author, text, src} ]
let nz = 0, nm = 0, nver = 0, withAny = 0;
const keys = Object.keys(targets).sort();
const cacheOf = {};
function links(chapKey) { if (!cacheOf[chapKey]) { const f = path.join(CD, 'sef', chapKey.replace(/ /g, '_') + '.json'); cacheOf[chapKey] = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : []; } return cacheOf[chapKey]; }
const unmappedZ = {}, unmappedM = {}, incoh = [], zseen = {};
for (const tk of keys) {
  const chapKey = tk.replace(/:\d+$/, '');
  const L = links(chapKey).filter(l => l.anchor === tk);
  // Zohar
  const zc = [];
  for (const l of L.filter(l => /^Zohar,/.test(l.ref))) {
    const m = l.ref.match(/^(Zohar, .+?) (\d+):(\d+)$/); if (!m) continue;
    const key = zkey(m[1]); zseen[m[1]] = key; if (!key) { unmappedZ[m[1]] = 1; continue; }
    const sec = Z[key].secs[+m[2]]; if (!sec) continue;
    const unit = +m[3] - sec.start; if (unit < 1 || unit > sec.verses.length) { incoh.push(l.ref + ' (secțiunea are ' + sec.verses.length + ', start ' + sec.start + ')'); continue; } // legătură incoerentă cu structura noastră
    zc.push({ key, secN: +m[2], unit, text: sec.verses[unit - 1], id: key + '|' + m[2] + '|' + unit, sef: l.ref });
  }
  const mc = [];
  for (const l of L.filter(l => /^Mishnah /.test(l.ref))) {
    const m = l.ref.match(/^(Mishnah .+?) (\d+):(\d+)$/); if (!m) continue;
    const k = mkey(m[1]); const ch = MT[k]; if (!ch) { unmappedM[m[1]] = 1; continue; }
    const t = ch[+m[2]] && ch[+m[2]][+m[3] - 1]; if (!t) continue;
    mc.push({ k, c: +m[2], n: +m[3], text: t, id: k + '|' + m[2] + '|' + m[3], sefRef: l.ref });
  }
  for (const rec of targets[tk]) {
    const rid = rec.kind === 'gen' ? 'gen|' + rec.file + '|' + rec.num : rec.kind + '|' + rec.ch + '|' + rec.v;
    let fam = null;
    if (rec.kind === 'gen') fam = genFamily(rec.file, rec.num); else if (rec.kind === 'wk') fam = wkFamily[rec.ch] || null;
    const z = zc.map(c => ({ sef: c.sef, id: c.id, author: 'Zohar, ' + Z[c.key].name + ' ' + c.secN + ':' + c.unit, text: c.text, fam: fam && c.key === fam ? 1 : 0, base: score(c.text.length, fam && c.key === fam, c.key, 0, true) - c.secN * 0.01 - c.unit * 0.001 })).sort((x, y) => y.base - x.base).slice(0, 6);
    const m = mc.map(c => ({ sef: c.sefRef, id: c.id, author: 'Mișna, ' + (MRO[c.k] || c.k) + ' ' + c.c + ':' + c.n, text: c.text, base: score(c.text.length, false, c.k, 0, false) + (c.text.length >= 40 ? 0 : -60) - c.c * 0.01 - c.n * 0.001 })).sort((x, y) => y.base - x.base).slice(0, 6);
    nver++;
    if (z.length || m.length) { plan[rid] = { anchor: tk, z, m }; withAny++; nz += z.length ? 1 : 0; nm += m.length ? 1 : 0; }
  }
}
fs.writeFileSync(OUT, JSON.stringify(plan));
console.log('legături Zohar incoerente cu structura noastră:', incoh.length, incoh.slice(0, 8).join(' | '));
console.log(JSON.stringify(zseen));
console.log('versete țintă', nver, '| cu cel puțin o trimitere', withAny, '| Zohar', nz, '| Mișna', nm);
console.log('lucrări Zohar nemapate:', Object.keys(unmappedZ).join('; ') || '-', '| Mișna nemapate:', Object.keys(unmappedM).join('; ') || '-');
const byKind = {}; for (const k of Object.keys(plan)) { const t = k.split('|')[0]; byKind[t] = (byKind[t] || 0) + 1; } console.log(JSON.stringify(byKind));
