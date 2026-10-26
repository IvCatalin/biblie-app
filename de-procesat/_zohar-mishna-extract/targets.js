// Enumeră versetele din aplicație (Geneza 1–23 + Haftarot săptămânal + Sărbători) și le convertește în numerotarea ebraică (Sefaria).
// Rezultat: scratchpad/targets.json  — { "Genesis 1:3": [ {kind:'gen', file:1, num:3}, ... ] } (cheia = referința Sefaria)
const fs = require('fs');
const R = 'C:/Users/ivcatali/biblie-app/';
const OUT = process.argv[2];
const { RULES } = require(R + 'de-procesat/_haftarot-extract/retag-s/edc100/versif.js');

const SEF = { 'Geneza': 'Genesis', 'Exod': 'Exodus', 'Exodul': 'Exodus', 'Levitic': 'Leviticus', 'Leviticul': 'Leviticus', 'Numeri': 'Numbers', 'Deuteronom': 'Deuteronomy', 'Deuteronomul': 'Deuteronomy',
  'Iosua': 'Joshua', 'Judecători': 'Judges', '1 Samuel': 'I Samuel', '2 Samuel': 'II Samuel', '1 Împărați': 'I Kings', '2 Împărați': 'II Kings',
  'Isaia': 'Isaiah', 'Ieremia': 'Jeremiah', 'Ezechiel': 'Ezekiel', 'Osea': 'Hosea', 'Ioel': 'Joel', 'Amos': 'Amos', 'Obadia': 'Obadiah', 'Iona': 'Jonah', 'Mica': 'Micah', 'Naum': 'Nahum',
  'Habacuc': 'Habakkuk', 'Țefania': 'Zephaniah', 'Hagai': 'Haggai', 'Zaharia': 'Zechariah', 'Maleahi': 'Malachi', 'Psalmii': 'Psalms', 'Psalmul': 'Psalms', 'Rut': 'Ruth', 'Estera': 'Esther',
  'Iov': 'Job', 'Proverbe': 'Proverbs', 'Eclesiastul': 'Ecclesiastes', 'Cântarea cântărilor': 'Song of Songs', 'Daniel': 'Daniel', 'Neemia': 'Nehemiah', 'Ezra': 'Ezra', '1 Cronici': 'I Chronicles', '2 Cronici': 'II Chronicles' };
const RO = { 'Exod': 'Exodul', 'Levitic': 'Leviticul', 'Deuteronom': 'Deuteronomul' };

// EDC100 (c,v) -> ebraică (c,v), inversul regulilor din versif.js
function toHebrew(book, c, v) {
  const b = RO[book] || book;
  for (const [hc, a, bb, nc, d] of (RULES[b] || [])) {
    if (nc === c && v - d >= a && v - d <= bb) return [hc, v - d];
  }
  return [c, v];
}
const targets = {}; let nGen = 0, nW = 0, nS = 0, skipped = [];
const add = (book, c, v, rec) => {
  const sb = SEF[book]; if (!sb) { skipped.push(book + ' ' + c + ':' + v); return; }
  const [hc, hv] = toHebrew(book, c, v);
  (targets[sb + ' ' + hc + ':' + hv] = targets[sb + ' ' + hc + ':' + hv] || []).push(rec);
};
// Geneza 1–23
for (let i = 1; i <= 23; i++) {
  const s = fs.readFileSync(R + 'public/genesis-' + i + '.js', 'utf8').replace(/^window\.CHAPTER_DATA\s*=\s*/, '').replace(/;\s*$/, '');
  for (const v of JSON.parse(s)) { add('Geneza', i, v.num, { kind: 'gen', file: i, num: v.num }); nGen++; }
}
// Haftarot
const bookRe = /((?:\d )?[A-ZĂÂÎȘȚ][a-zăâîșț]+(?: [a-zăâîșț]+)?) \d+:\d+/g;
// carte pentru un verset fără prefix: prima parte a referinței (separată prin ; sau paranteze) care menționează capitolul
function bookFor(ref, chap, books) {
  for (const part of ref.replace(/[()+]/g, ';').split(';')) {
    const bm = part.match(/((?:\d )?[A-ZĂÂÎȘȚ][a-zăâîșț]+(?: [a-zăâîșț]+)?) \d+:/);
    const chs = [...part.matchAll(/(\d+):/g)].map(m => +m[1]);
    if (bm && SEF[bm[1]] && chs.includes(chap)) return bm[1];
  }
  return books[0] || null;
}
for (const [f, kind] of [['haftarot-ciclu-saptamanal.json', 'wk'], ['haftarot-sarbatori.json', 'sb']]) {
  const d = JSON.parse(fs.readFileSync(R + 'de-procesat/_haftarot-extract/' + f, 'utf8'));
  for (const ch of d.chapters) {
    const books = [...new Set([...ch.ref.matchAll(bookRe)].map(m => m[1]).filter(b => SEF[b]))];
    for (const v of ch.verses) {
      const m = String(v.v).match(/^(?:(.*\D) )?(\d+):(\d+)/); if (!m) { skipped.push(kind + ch.num + ' ' + v.v); continue; }
      const book = m[1] || (books.length === 1 ? books[0] : bookFor(ch.ref, +m[2], books));
      if (!book) { skipped.push(`${kind}${ch.num} ${v.v} (carte ambiguă: ${books})`); continue; }
      add(book, +m[2], +m[3], { kind, ch: ch.num, v: v.v }); kind === 'wk' ? nW++ : nS++;
    }
  }
}
fs.writeFileSync(OUT, JSON.stringify(targets));
console.log('Geneza', nGen, '| săptămânal', nW, '| sărbători', nS, '| referințe unice (ebraică)', Object.keys(targets).length, '| omise', skipped.length);
console.log(skipped.slice(0, 20).join('\n'));
const chs = new Set(Object.keys(targets).map(k => k.replace(/:\d+$/, ''))); console.log('capitole unice de interogat:', chs.size);
