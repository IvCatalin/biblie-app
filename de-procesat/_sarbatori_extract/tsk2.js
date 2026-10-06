// node tsk2.js <tskBookNum> <cap> <v1> <v2> — trimiteri TSK traduse EDC100, validate local prin OSHB
const fs = require('fs');
const O = require('../_haftarot-deuteronom-extract/oshb');
const BOOKS_OT = ['Geneza','Exodul','Leviticul','Numeri','Deuteronomul','Iosua','Judecători','Rut','1 Samuel','2 Samuel','1 Împărați','2 Împărați','1 Cronici','2 Cronici','Ezra','Neemia','Estera','Iov','Psalmul','Proverbe','Eclesiastul','Cântarea cântărilor','Isaia','Ieremia','Plângerile lui Ieremia','Ezechiel','Daniel','Osea','Ioel','Amos','Obadia','Iona','Mica','Naum','Habacuc','Țefania','Hagai','Zaharia','Maleahi'];
const OSIS_OT = ['Gen','Exod','Lev','Num','Deut','Josh','Judg','Ruth','1Sam','2Sam','1Kgs','2Kgs','1Chr','2Chr','Ezra','Neh','Esth','Job','Ps','Prov','Eccl','Song','Isa','Jer','Lam','Ezek','Dan','Hos','Joel','Amos','Obad','Jonah','Mic','Nah','Hab','Zeph','Hag','Zech','Mal'];
const PFX_OT = ['ge','ex','le','nu','de','jos','jg','ru','1sa','2sa','1ki','2ki','1ch','2ch','ezr','ne','es','job','ps','pr','ec','so','isa','jer','la','eze','da','ho','joe','am','ob','jon','mic','na','hab','zep','hag','zec','mal'];
const BOOKS_NT = ['Matei','Marcu','Luca','Ioan','Faptele apostolilor','Romani','1 Corinteni','2 Corinteni','Galateni','Efeseni','Filipeni','Coloseni','1 Tesaloniceni','2 Tesaloniceni','1 Timotei','2 Timotei','Tit','Filimon','Evrei','Iacov','1 Petru','2 Petru','1 Ioan','2 Ioan','3 Ioan','Iuda','Apocalipsa'];
const PFX_NT = ['mt','mr','lu','joh','ac','ro','1co','2co','ga','eph','phi','col','1th','2th','1ti','2ti','tit','phm','heb','jas','1pe','2pe','1jo','2jo','3jo','jude','re'];

const PFX2NAME = {}; PFX_OT.forEach((p,i)=>PFX2NAME[p]=BOOKS_OT[i]); PFX_NT.forEach((p,i)=>PFX2NAME[p]=BOOKS_NT[i]);
const NAME2OSIS = {}; BOOKS_OT.forEach((n,i)=>NAME2OSIS[n]=OSIS_OT[i]);

function existsOT(name, c, v) {
  const osis = NAME2OSIS[name]; if (!osis) return null; // NT nu poate fi validat local (fara OSHB)
  const ws = O.verse(osis, c, v); return !!(ws && ws.length);
}

const [bookNum, cn, v1, v2] = process.argv.slice(2).map(Number);
const lines = fs.readFileSync(__dirname + '/tskxref.txt', 'utf8').split(/\r?\n/);
const out = {};
for (const line of lines) {
  const p = line.split('\t'); if (p.length < 6) continue;
  if (+p[0] !== bookNum || +p[1] !== cn) continue;
  const vNum = +p[2]; if (vNum < v1 || vNum > v2) continue;
  const order = +p[3], kw = p[4];
  const refs = [];
  for (let r of p[5].split(';')) {
    r = r.trim();
    const m = r.match(/^(\d?[a-z]+)\s+(\d+):([\d,\-]+)/);
    if (!m) continue;
    const name = PFX2NAME[m[1]]; if (!name) continue;
    const c = +m[2];
    for (const part of m[3].split(',')) {
      const mm = part.match(/^(\d+)(-(\d+))?$/); if (!mm) continue;
      const vA = +mm[1], vB = mm[3] ? +mm[3] : vA;
      const isNT = PFX_NT.includes(m[1]);
      if (!isNT) {
        if (!existsOT(name, c, vA)) continue;
        if (mm[3] && !existsOT(name, c, vB)) continue;
      }
      refs.push(name + ' ' + c + ':' + (mm[3] ? vA + '-' + vB : vA) + (isNT ? ' [NT-neverificat]' : ''));
    }
  }
  (out[vNum] = out[vNum] || []).push({ order, kw, refs });
}
for (const v of Object.keys(out).sort((a,b)=>a-b)) {
  console.log(`== v.${v}`);
  out[v].sort((a,b)=>a.order-b.order).forEach(e => console.log(`  <${e.kw}> ${e.refs.join('; ')}`));
}
