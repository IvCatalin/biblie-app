// Geneza 5: formele grecești ale numerelor (anilor) se iau EXACT din textul LXX al versetului (cu toate cuvintele numeralului).  node tools/g5-fix3.js [--write]
const fs = require('fs');
const f = 'C:/Users/ivcatali/biblie-app/public/genesis-5.js';
const D = new Function('window', fs.readFileSync(f, 'utf8') + ';return window;')({}).CHAPTER_DATA;
const WRITE = process.argv.includes('--write'); let n = 0;
const strip = s => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const NUM = new Set('εκατον διακοσια τριακοσια τετρακοσια πεντακοσια εξακοσια επτακοσια οκτακοσια εννακοσια πεντακοσιων δεκα δωδεκα εικοσι τριακοντα τεσσαρακοντα πεντηκοντα εξηκοντα εβδομηκοντα ογδοηκοντα ενενηκοντα δυο τρια τεσσαρα πεντε εξ επτα οκτω εννεα και'.split(' '));
for (const x of D) {
  const t = x.tokens.find(t => t.heb && t.greek && /ἔτη|ἐτῶν/.test(t.greek)); if (!t) continue;
  const L = x.textCompare.find(c => c.greek).original.replace(/[,.·;]/g, '').split(/\s+/);
  const i = L.findIndex(w => /^(ἔτη|ἐτῶν)$/.test(w)); if (i < 0) throw new Error('v' + x.num + ' fără ἔτη în LXX');
  let a = i - 1; while (a >= 0 && NUM.has(strip(L[a]).replace(/᾿/g, ''))) a--; a++;
  let phrase;
  if (a < i) phrase = L.slice(a, i + 1);                         // numeral înainte: „διακόσια καὶ τριάκοντα ἔτη”
  else { let b = i + 1; while (b < L.length && NUM.has(strip(L[b]))) b++; phrase = L.slice(i, b); }   // numeral după: „ἐτῶν πεντακοσίων”
  while (strip(phrase[0]) === 'και') phrase.shift();
  while (strip(phrase[phrase.length - 1]) === 'και') phrase.pop();
  const nu = phrase.join(' ');
  if (nu !== t.greek) { console.log('v' + x.num + ': ' + t.greek + '  →  ' + nu); t.greek = nu; delete t.greek_def_ro; n++; }
}
console.log(WRITE ? 'SCRIS' : 'PROBĂ', 'modificate', n);
if (WRITE) fs.writeFileSync(f, 'window.CHAPTER_DATA = ' + JSON.stringify(D, null, 1).replace(/\n/g, '\r\n') + ';\r\n', 'utf8');
