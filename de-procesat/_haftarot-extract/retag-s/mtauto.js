// node mtauto.js <cap> [extra.json] [--scrie] — pune în textCompare (Masoretic) nota: Qere/Ketiv din OSHB + note manuale (extra.json: {"6:1": "text"})
const fs = require('fs'), path = require('path');
const R = 'C:/Users/ivcatali/biblie-app/de-procesat/_haftarot-extract/';
const WF = R + 'haftarot-sarbatori.json';
const MAP = JSON.parse(fs.readFileSync('C:/Users/ivcatali/biblie-app/de-procesat/_sarbatori_extract/oshb-map-sarbatori.json', 'utf8'));
const cn = +process.argv[2]; const extraF = process.argv[3] && !process.argv[3].startsWith('--') ? process.argv[3] : null; const WRITE = process.argv.includes('--scrie');
const extra = extraF ? JSON.parse(fs.readFileSync(extraF, 'utf8')) : {};
const d = JSON.parse(fs.readFileSync(WF, 'utf8')); const ch = d.chapters.find(c => c.num === cn);
const xmlc = {}; const xml = b => xmlc[b] || (xmlc[b] = fs.readFileSync('C:/Users/ivcatali/biblie-app/de-procesat/_haftarot-deuteronom-extract/oshb/' + b + '.xml', 'utf8'));
const NT = { Q: 'o lectură în care OSHB urmează BHQ în locul lui BHS', n: 'o formă anomală', v: 'o vocalizare diferită de BHS', p: 'o punctuație diferită de BHS', c: 'o consoană diferită de BHS', s: 'o diferență de accentuare față de BHS', x: 'o notă textuală' };
const DEF = 'Fără variante Qere/Ketiv în textul ebraic consultat (OSHB).';
let nq = 0, nn = 0;
for (const v of ch.verses) {
  const m = MAP[cn + '|' + v.v]; const mt = (v.textCompare || []).find(t => /Masoretic/i.test(t.source)); if (!mt) continue;
  const parts = [];
  if (m) {
    const [b, c, vv] = m.osis.split('.'); const re = new RegExp('<verse osisID="' + b + '\\.' + c + '\\.' + vv + '">([\\s\\S]*?)</verse>'); const x = (xml(b).match(re) || [])[1] || '';
    for (const n of x.matchAll(/<note type="variant">([\s\S]*?)<\/note>/g)) {
      const k = (n[1].match(/<catchWord>([\s\S]*?)<\/catchWord>/) || [])[1]; const q = [...n[1].matchAll(/<w [^>]*>([\s\S]*?)<\/w>/g)].map(z => z[1].replace(/<[^>]+>/g, '').replace(/\//g, '')).join(' ');
      if (k && q) { parts.push('Ketiv (scris): ' + k.replace(/\//g, '') + '; Qere (citit): ' + q + '.'); nq++; }
    }
    const kinds = new Set(); for (const n of x.matchAll(/<note n="(\w)">/g)) if (NT[n[1]]) kinds.add(n[1]);
    if (kinds.size) { parts.push('OSHB marchează în acest verset ' + [...kinds].map(k => NT[k]).join(', ') + '.'); nn += kinds.size; }
  }
  const e = extra[v.v];
  const note = parts.length ? parts.join(' ') + (e ? ' ' + e : '') : (e ? 'Fără variante Qere/Ketiv; ' + e : DEF);
  if (WRITE) mt.note = note; else console.log(v.v + ' | ' + note);
}
console.log('Ketiv/Qere:', nq, 'note OSHB:', nn);
if (WRITE) { fs.writeFileSync(WF, JSON.stringify(d, null, 1)); console.log('Scris.'); }
