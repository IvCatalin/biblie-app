// Integrare Zohar (Zohar_baza_complet.ro.zip) + Mișna (Mishna_complet.ro.zip) în aplicație.
// Utilizare: node build.js <dir-zohar-extras> <dir-mishna-extras> [--scrie]
// Scrie fișierele lazy în public/zohar/ și public/mishna/ și înlocuiește intrările din LIBRARY (biblie-demo.html).
const fs = require('fs');
const path = require('path');
const { load, save } = require('./lib.js');

const ZD = process.argv[2], MD = process.argv[3], WRITE = process.argv.includes('--scrie');
const PUB = 'C:/Users/ivcatali/biblie-app/public/';
const nf = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

// ---------- ZOHAR: citire + îmbinare pe lucrări (secțiunile sparte în mai multe fișiere se lipesc) ----------
const zfiles = fs.readdirSync(ZD).filter(f => f.endsWith('.json'));
const zby = {};
for (const f of zfiles) {
  const key = f.split('.').slice(1, f.includes('Addenda') ? 3 : 2).join('.');
  const sec = +((f.match(/sec(\d+)/) || [0, 0])[1]);
  const sub = f.match(/\.p(\d+)-/) || f.match(/sec7\.(\d+)-/);
  (zby[key] = zby[key] || []).push({ f, sec, p: sub ? +sub[1] : 0, d: JSON.parse(fs.readFileSync(path.join(ZD, f), 'utf8')) });
}
const Z = {};
for (const key of Object.keys(zby)) {
  const parts = zby[key].sort((a, b) => a.sec - b.sec || a.p - b.p);
  const chs = [];
  for (const p of parts) for (const c of p.d.chapters) {
    const last = chs[chs.length - 1];
    if (last && last.sec === c.chapter) last.verses.push(...c.verses);
    else chs.push({ sec: c.chapter, title: c.title, verses: c.verses.slice() });
  }
  chs.forEach(c => c.verses.forEach((v, i) => { if (v.verse !== i + 1) throw new Error(`${key} ${c.sec}: numerotare ${v.verse} != ${i + 1}`); }));
  Z[key] = { book: parts[0].d.book, chs };
}
const ORDER = ['Introduction', 'Bereshit', 'Noach', 'Lech_Lecha', 'Vayera', 'Chayei_Sara', 'Toldot', 'Vayetzei', 'Vayishlach', 'Vayeshev', 'Miketz', 'Vayigash', 'Vayechi',
  'Shemot', 'Vaera', 'Bo', 'Beshalach', 'Yitro', 'Mishpatim', 'Terumah', 'Tetzaveh', 'KiTisa', 'Vayakhel', 'Pekudei',
  'Vayikra', 'Tzav', 'Shemini', 'Tazria', 'Metzora', 'AchareiMot', 'Kedoshim', 'Emor', 'Behar', 'Bechukotai',
  'Bamidbar', 'Naso', 'Behaalotekha', 'Shelah', 'Korah', 'Chukat', 'Balak', 'Pinhas', 'Matot',
  'Vaetchanan', 'Eikev', 'Shoftim', 'KiTeitzei', 'Vayeilech', 'HaAzinu', 'Addenda.volI', 'Addenda.volII', 'Addenda.volIII'];
const SEPARATE = { IdraZuta: 'kab-zo-idra-zuta', Idra_Raba: 'kab-zo-idra-raba', Sifra_diTzniuta: 'kab-zo-sifra-ditzniuta' };
const used = new Set([...ORDER, ...Object.keys(SEPARATE)]);
const missing = Object.keys(Z).filter(k => !used.has(k)), absent = [...used].filter(k => !Z[k]);
if (missing.length || absent.length) throw new Error('lucrări neîncadrate: ' + missing + ' | lipsă: ' + absent);

const SLUG = 'kab-zo-zohar';
const lazyJs = (key, val) => 'window.LIB_LAZY=window.LIB_LAZY||{};window.LIB_LAZY[' + JSON.stringify(key) + ']=' + JSON.stringify(val) + ';\n';
const out = []; // [cale, conținut]
const zChapters = []; let zPar = 0;
ORDER.forEach((key, i) => {
  const num = i + 1, w = Z[key];
  const verses = [];
  for (const c of w.chs) c.verses.forEach((v, j) => {
    const o = { v: c.sec + ':' + v.verse, t: v.text };
    if (j === 0) o.h = c.sec + '. ' + c.title;
    verses.push(o);
  });
  zPar += verses.length;
  out.push(['zohar/z' + num + '.js', lazyJs(SLUG + '#' + num, verses)]);
  zChapters.push({ num, title: w.book, lazyChap: 'zohar/z' + num + '.js', verses: [] });
});
const zSep = {}; // slug -> {chapters, par}
for (const [key, slug] of Object.entries(SEPARATE)) {
  const w = Z[key]; let par = 0;
  const chapters = w.chs.map(c => { par += c.verses.length; return { num: c.sec, title: c.sec + '. ' + c.title, verses: c.verses.map(v => ({ v: v.verse, t: v.text })) }; });
  out.push(['zohar/' + slug.replace('kab-zo-', '') + '.js', lazyJs(slug, { chapters })]);
  zSep[slug] = { chapters: chapters.length, par, book: w.book };
}

// ---------- MIȘNA ----------
const mfiles = fs.readdirSync(MD).filter(f => f.endsWith('.json'));
const mby = {};
for (const f of mfiles) {
  const key = f.split('.')[1], lo = +((f.match(/\.p(\d+)-/) || [0, 0])[1]);
  (mby[key] = mby[key] || []).push({ lo, d: JSON.parse(fs.readFileSync(path.join(MD, f), 'utf8')) });
}
const slugOf = k => k === 'Pirkei_Avot' ? 'mishna-avot' : 'mishna-' + k.toLowerCase().replace(/_/g, '-');
const M = {};
for (const key of Object.keys(mby)) {
  const parts = mby[key].sort((a, b) => a.lo - b.lo), chs = [];
  for (const p of parts) for (const c of p.d.chapters) chs.push(c);
  chs.forEach((c, i) => {
    if (c.chapter !== i + 1) throw new Error(key + ': capitol ' + c.chapter + ' la poziția ' + (i + 1));
    c.verses.forEach((v, j) => { if (v.verse !== j + 1) throw new Error(`${key} ${c.chapter}: verset ${v.verse} != ${j + 1}`); });
  });
  const book = parts[0].d.book; // "Berahot - Binecuvântările (ordinul Zeraim - Semințe)"
  const mm = /^(.*?) - (.*?) \(ordinul (.*)\)$/.exec(book);
  if (!mm) throw new Error('format book: ' + book);
  M[slugOf(key)] = { key, name_ro: mm[2], chs, nv: chs.reduce((a, c) => a + c.verses.length, 0) };
  out.push(['mishna/' + slugOf(key) + '.js', lazyJs(slugOf(key), { chapters: chs.map(c => ({ num: c.chapter, verses: c.verses.map(v => ({ v: v.verse, t: v.text })) })) })]);
}

// ---------- LIBRARY ----------
const S = load();
const lib = S.lib;
const kab = lib.arhivaRabinica.subfolders.find(f => f.label === 'Kabbala');
const mi = lib.arhivaRabinica.subfolders.find(f => f.label === 'Mișna');

const zEd = {
  translation: 'Traducere în română din aramaică/ebraică, unitate cu unitate',
  source: 'Sefaria — Zohar (text aramaic clasic, paginare Vilna; Mantua 1558 / Vilna; nu comentariul Sulam)',
  source_status: 'Domeniu public',
  modernization: 'Traducere directă în română citibilă, fără adaos; parantezele și variantele ediției (ס״א/נ״א = altă versiune, trimiteri la foi) păstrate în text'
};
const zi = kab.items.findIndex(i => i.slug === SLUG);
if (zi < 0) throw new Error('kab-zo-zohar lipsă');
const oldZ = kab.items[zi];
kab.items[zi] = {
  slug: SLUG, name: 'Zohar', name_ro: 'Cartea Splendorii',
  meta: zChapters.length + ' capitole · ' + nf(zPar) + ' paragrafe',
  author: oldZ.author,
  summary: 'Textul aramaic de bază al Zoharului (ediția Vilna/Mantua, domeniu public — nu comentariul Sulam), tradus direct din original: Introducerea, toate parașele Torei de la Bereșit la Haazinu și cele trei volume de Adaosuri (Addenda). Fiecare paragraf poartă numărul secțiunii și al unității (ex. 3:5); titlul fiecărei secțiuni apare deasupra primului ei paragraf. Idra Raba, Idra Zuta și Sifra di-Țeniuta sunt lucrări separate, în același dosar. Lacună în sursă: secțiunea 26 din Adaosuri, volumul I nu există în textul Sefaria.',
  available: true, edition: zEd, plainTitles: true, chapters: zChapters
};
const sepNames = {
  'kab-zo-idra-zuta': ['Idra Zuta', 'Adunarea cea mică', 'Idra Zuta („Adunarea cea mică”), parte a Zoharului propriu-zis. Text aramaic clasic, tradus direct în română, fără adaos.'],
  'kab-zo-idra-raba': ['Idra Raba', 'Adunarea cea mare', 'Idra Raba („Adunarea cea mare”), parte a Zoharului propriu-zis. Text aramaic clasic, tradus direct în română, fără adaos.'],
  'kab-zo-sifra-ditzniuta': ['Sifra di-Țeniuta', 'Cartea tăinuirii', 'Sifra di-Țeniuta („Cartea tăinuirii”), parte a Zoharului propriu-zis. Text aramaic clasic, tradus direct în română, fără adaos.']
};
const sepEntry = slug => ({
  slug, name: sepNames[slug][0], name_ro: sepNames[slug][1],
  meta: zSep[slug].chapters + ' secțiuni · ' + nf(zSep[slug].par) + ' paragrafe',
  author: 'corpus zoharic, ediție domeniu public (API Sefaria)',
  summary: sepNames[slug][2], available: true, edition: zEd, plainTitles: true,
  lazySrc: 'zohar/' + slug.replace('kab-zo-', '') + '.js', chapters: []
});
// Idra Zuta înlocuiește placeholderul existent; celelalte două se adaugă lângă el
const iz = kab.items.findIndex(i => i.slug === 'kab-zo-idra-zuta');
if (iz < 0) throw new Error('placeholder Idra Zuta lipsă');
kab.items.splice(iz, 1, sepEntry('kab-zo-idra-zuta'), sepEntry('kab-zo-idra-raba'), sepEntry('kab-zo-sifra-ditzniuta'));

const mEd = {
  translation: 'Traducere în română din ebraică, după ediția Romm, Vilna 1913',
  source: 'Sefaria — Mishnah (ediția Romm, Vilna 1913)',
  source_status: 'Domeniu public',
  modernization: 'Traducere directă din ebraică, în română citibilă, fără adaos; numele divine în stilul Cornilescu (EDC100)'
};
let mUpd = 0, mCh = 0, mPar = 0;
for (const it of mi.items) {
  if (!it.slug || !M[it.slug]) continue;
  const m = M[it.slug];
  const keep = { slug: it.slug, name: it.name, author: it.author };
  Object.keys(it).forEach(k => delete it[k]);
  Object.assign(it, keep, {
    name_ro: m.name_ro, meta: m.chs.length + ' capitole · ' + nf(m.nv) + ' mișnayot',
    summary: 'Tratatul ' + keep.name + ' („' + m.name_ro + '”) din ordinul ' + keep.author + ' al Mișnei. Traducere în română direct din ebraică, după ediția Romm, Vilna 1913 (domeniu public, text Sefaria).' +
      (keep.slug === 'mishna-avot' ? ' Capitolul 6 (Kinyan Tora) e un adaos ulterior, în afara Mișnei propriu-zise, păstrat ca în Sefaria.' : ''),
    available: true, edition: mEd, lazySrc: 'mishna/' + keep.slug + '.js', chapters: []
  });
  mUpd++; mCh += m.chs.length; mPar += m.nv;
}

console.log('Zohar: capitole', zChapters.length, 'paragrafe', zPar, '| separate', JSON.stringify(zSep));
console.log('Mișna: tratate actualizate', mUpd, 'de', Object.keys(M).length, '| capitole', mCh, '| mișnayot', mPar);
console.log('fișiere lazy de scris:', out.length);
if (WRITE) {
  for (const [p, c] of out) { fs.mkdirSync(path.dirname(PUB + p), { recursive: true }); fs.writeFileSync(PUB + p, c); }
  save(S.h, S.s, S.e, lib);
  console.log('scris');
}
