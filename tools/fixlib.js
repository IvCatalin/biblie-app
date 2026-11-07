// Ajutor pentru gN-fix.js: găsește în versetul LXX (Rahlfs, din textCompare) forma exactă după un tipar fără accente.
// const L = require('./fixlib.js')(N);  L(verset, 'tipar')  -> { greek, greek_def_ro:null }   (tiparul se potrivește pe cuvinte întregi, ne-accentuate, minuscule; spațiu = cuvinte consecutive)
const fs = require('fs');
const norm = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/ς/g, 'σ');
module.exports = (N) => {
  const D = new Function('window', fs.readFileSync('C:/Users/ivcatali/biblie-app/public/genesis-' + N + '.js', 'utf8') + ';return window;')({}).CHAPTER_DATA;
  return (v, pat, extra = {}) => {
    const x = D.find(d => d.num === v); const t = x.textCompare[1].original;
    const ws = t.split(/\s+/); const cw = ws.map(w => norm(w.replace(/[·;.,]/g, '')));
    const ps = norm(pat).split(/\s+/);
    for (let i = 0; i + ps.length <= ws.length; i++) {
      if (ps.every((p, j) => p.startsWith('^') ? cw[i + j] === p.slice(1) : cw[i + j].startsWith(p))) return { greek: ws.slice(i, i + ps.length).map(w => w.replace(/[·;.,]+$/, '')).join(' '), greek_def_ro: null, ...extra };
    }
    console.log('TIPAR NEGĂSIT ' + N + ':' + v + ' «' + pat + '» în: ' + t); return { ...extra };
  };
};
