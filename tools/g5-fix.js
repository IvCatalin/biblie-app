// Geneza 5: corecturi de date găsite la verificarea tokenilor față de textul masoretic și al Septuagintei din textCompare.
// node tools/g5-fix.js [--write]
const fs = require('fs');
const f = 'C:/Users/ivcatali/biblie-app/public/genesis-5.js';
const D = new Function('window', fs.readFileSync(f, 'utf8') + ';return window;')({}).CHAPTER_DATA;
const WRITE = process.argv.includes('--write'); let n = 0;
const tok = (v, w, k = 0) => { const a = D.find(x => x.num === v).tokens.filter(t => t.w === w); if (!a[k]) throw new Error('lipsă ' + v + ' ' + w); return a[k]; };
// v2 „creați”: LXX are „ἐποίησεν αὐτούς” (ᾗ ἡμέρᾳ ἐποίησεν αὐτούς), nu „ἐποιήθησαν”
{ const t = tok(2, 'creați'); t.greek = 'ἐποίησεν αὐτούς'; delete t.greek_def_ro; n++; }
// numere grecești: forma exactă din LXX
{ const t = tok(5, 'nouă sute treizeci de ani'); t.greek = 'ἐννακόσια καὶ τριάκοντα ἔτη'; delete t.greek_def_ro; n++; }
{ const t = tok(8, 'nouă sute doisprezece ani'); t.greek = 'ἐννακόσια δέκα δύο ἔτη'; delete t.greek_def_ro; n++; }
{ const t = tok(25, 'o sută optzeci și șapte de ani'); t.greek = 'ἑκατὸν ἑξήκοντα ἑπτὰ ἔτη'; delete t.greek_def_ro; n++; }
{ const t = tok(26, 'șapte sute optzeci și doi de ani'); t.greek = 'ὀκτακόσια δύο ἔτη'; delete t.greek_def_ro; n++; }
// v31: textul masoretic nu are „שנים” în expresia numărului
{ const t = tok(31, 'șapte sute șaptezeci și șapte de ani'); t.heb = 'שֶׁבַע וְשִׁבְעִים שָׁנָה וּשְׁבַע מֵאוֹת שָׁנָה'; t.translit = "sheva veshiv'im shanah ushva me'ot shanah"; n++; }
// v3 și v29: în text apare „שְׁמוֹ” (numele lui), nu forma de dicționar
for (const v of [3, 29]) { const t = tok(v, 'numele'); t.heb = 'שְׁמוֹ'; t.translit = 'shemo'; t.greek = 'τὸ ὄνομα αὐτοῦ'; n++; }
// v29 „el”: în textul ebraic nu există „הוּא”; „Și el i-a pus” e doar subiectul verbului — cuvântul nu se tagează
{ const x = D.find(y => y.num === 29); const i = x.tokens.findIndex(t => t.w === 'el' && t.heb === 'הוּא'); if (i < 0) throw new Error('el lipsă'); x.tokens[i] = { t: x.tokens[i].t }; n++; }
console.log(WRITE ? 'SCRIS' : 'PROBĂ', 'corecturi', n);
if (WRITE) fs.writeFileSync(f, 'window.CHAPTER_DATA = ' + JSON.stringify(D, null, 1).replace(/\n/g, '\r\n') + ';\r\n', 'utf8');
