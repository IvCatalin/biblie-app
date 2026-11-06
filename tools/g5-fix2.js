// Geneza 5: a doua serie de corecturi (formele grecești să urmeze exact textul LXX din textCompare).  node tools/g5-fix2.js [--write]
const fs = require('fs');
const f = 'C:/Users/ivcatali/biblie-app/public/genesis-5.js';
const D = new Function('window', fs.readFileSync(f, 'utf8') + ';return window;')({}).CHAPTER_DATA;
const WRITE = process.argv.includes('--write'); let n = 0;
const tok = (v, w) => { const t = D.find(x => x.num === v).tokens.find(t => t.w === w); if (!t) throw new Error('lipsă ' + v + ' ' + w); return t; };
{ const t = tok(1, 'Adam'); t.greek = 'ἀνθρώπων'; delete t.greek_def_ro; n++; }              // 5:1 LXX: γενέσεως ἀνθρώπων
{ const t = tok(29, 'DOMNUL'); t.greek = 'Κύριος ὁ Θεός'; delete t.greek_def_ro; n++; }        // 5:29 LXX: Κύριος ὁ Θεός
{ const t = tok(32, 'cinci sute de ani'); t.greek = 'ἐτῶν πεντακοσίων'; delete t.greek_def_ro; n++; } // 5:32 LXX: ἐτῶν πεντακοσίων
console.log(WRITE ? 'SCRIS' : 'PROBĂ', n);
if (WRITE) fs.writeFileSync(f, 'window.CHAPTER_DATA = ' + JSON.stringify(D, null, 1).replace(/\n/g, '\r\n') + ';\r\n', 'utf8');
