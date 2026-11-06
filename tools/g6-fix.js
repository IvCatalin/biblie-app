// Geneza 6: corecturi la etichetele lexicale (forma greacă/ebraică trebuie să fie exact în verset, față de Rahlfs și Sefaria).
// node tools/g6-fix.js [--write]
const fs = require('fs');
const WRITE = process.argv.includes('--write');
const NOGR = { greek: null, greek_def_ro: null };
const OPS = [
  [1, { w: 'fața' }, { ...NOGR, diff_ro: 'Septuaginta spune doar „pe pământ” (ἐπὶ τῆς γῆς), fără un cuvânt pentru „fața” (פְּנֵי).' }],
  [2, { w: 'fiicele' }, { greek: 'θυγατέρας' }],
  [3, { w: 'trup' }, { greek: 'σάρκας', diff_ro: 'Septuaginta spune „ei sunt trupuri” (σάρκας, la plural, despre oameni), nu „el este trup” ca în ebraică.' }],
  [3, { w: 'zilele' }, { greek: 'αἱ ἡμέραι αὐτῶν' }],
  [4, { w: 'pământ' }, { heb: 'בָאָרֶץ', translit: 'va\'arets' }],
  [4, { w: 'zile' }, { heb: 'בַּיָּמִים', translit: 'bayamim' }],
  [4, { w: 'nășteau' }, { greek: 'ἐγεννῶσαν' }],
  [5, { w: 'mare' }, { greek: 'ἐπληθύνθησαν', diff_ro: 'Septuaginta spune „s-au înmulțit” (ἐπληθύνθησαν) răutățile oamenilor, nu „mare” era răutatea, ca în ebraică.' }],
  [5, { w: 'răutatea' }, { greek: 'αἱ κακίαι' }],
  [6, { w: 'inima' }, { ...NOGR, diff_ro: 'Septuaginta nu are un cuvânt pentru „inima”: spune doar „și a cugetat” (καὶ διενοήθη).' }],
  [3, { w: 'DOMNUL' }, { greek: 'Κύριος ὁ Θεός' }],
  [5, { w: 'gândurilor' }, { ...NOGR }],
  [5, { w: 'inimii' }, { greek: 'ἐν τῇ καρδίᾳ αὐτοῦ' }],
  [7, { w: 'animal' }, { greek: 'κτήνους' }],
  [15, { w: 'trei sute de coți' }, { greek: 'τριακοσίων πήχεων' }],
  [15, { w: 'cincizeci de coți' }, { greek: 'πεντήκοντα πήχεων' }],
  [15, { w: 'treizeci de coți' }, { greek: 'τριάκοντα πήχεων' }],
  [16, { w: 'intrarea' }, { greek: 'θύραν' }],
  [19, { w: 'viu' }, { ...NOGR, diff_ro: 'Septuaginta nu are un cuvânt pentru „viu” (הָחַי): enumeră „dintre toate dobitoacele, târâtoarele și fiarele și din tot trupul”.' }],
  [19, { w: 'păstra în viață' }, { greek: 'τρέφῃς', greek_def_ro: 'τρέφω (trepho) — a hrăni, a întreține (aici: „ca să hrănești”).', diff_ro: 'Ebraicul לְהַחֲיֹת („a păstra în viață”) e redat în greacă prin τρέφῃς („ca să hrănești, să întreții”).' }],
  [21, { w: 'hrană' }, { greek: 'φαγεῖν', greek_def_ro: 'ἐσθίω (esthio) — a mânca (aici infinitiv: „de mâncat”).' }],
  [22, { w: 'întocmai' }, { greek: 'πάντα ὅσα', greek_def_ro: 'πᾶς (pas) — tot; ὅσος (hosos) — cât, câte; împreună: „tot ce”.' }],
];
const f = 'public/genesis-6.js';
const D = new Function('window', fs.readFileSync(f, 'utf8') + ';return window;')({}).CHAPTER_DATA;
let n = 0, miss = 0;
for (const [v, m, patch] of OPS) {
  const x = D.find(q => q.num === v);
  const hit = x.tokens.filter(t => t.heb && t.w === m.w);
  if (!hit.length) { console.log('NU GĂSESC', v, m.w); miss++; continue; }
  for (const t of hit) { for (const [k, val] of Object.entries(patch)) { if (val === null) delete t[k]; else t[k] = val; } n++; }
}
console.log(WRITE ? 'SCRIS' : 'PROBĂ', '| etichete corectate:', n, '| neîntâlnite:', miss);
if (WRITE) fs.writeFileSync(f, 'window.CHAPTER_DATA = ' + JSON.stringify(D, null, 1).replace(/\n/g, '\r\n') + ';\r\n', 'utf8');
