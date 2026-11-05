// Geneza 1–3: rândurile comentatorilor Tanakh = toate lucrările reale din Bibliotecă (inclusiv Targum Onkelos/Ionatan, Chizkuni, Bekhor Shor, Or HaChaim), primele; restul rândurilor rămân.
const fs = require('fs');
const WRITE = process.argv.includes('--write');
const P = 'C:/Users/ivcatali/biblie-app/public/';
const TAN = [['rashi', 'Rashi (1040–1105)', /^Rashi\b/], ['onkelos', 'Targum Onkelos', /^Targum Onkelos/], ['ionatan', 'Targum Ionatan', /^Targum Ionatan/], ['ibnezra', 'Ibn Ezra (1089–1167)', /^Ibn Ezra/], ['ramban', 'Ramban / Nahmanide (1194–1270)', /^Ramban/], ['sforno', 'Sforno (cca. 1475–1550)', /^Sforno/], ['rashbam', 'Rashbam (cca. 1085–1158)', /^Rashbam/], ['daat', "Da'at Zekenim (sec. XIII, școala tosafiștilor)", /^Da'at Zekenim/], ['radak', 'Radak (cca. 1160–1235)', /^Radak/], ['chizkuni', 'Chizkuni (sec. XIII)', /^Chizkuni/], ['bekhorshor', 'Bekhor Shor (sec. XII)', /^Bekhor Shor/], ['orhachaim', 'Or HaChaim (1696–1743)', /^Or HaChaim/]];
const lazy = (file) => { const ww = { LIB_LAZY: {} }; new Function('window', fs.readFileSync(P + file, 'utf8'))(ww); return ww.LIB_LAZY; };
const SRC = {}; for (const [k] of TAN) { const d = lazy('tanakh/tanakh-genesis-' + k + '.js')['tanakh-genesis-comentatori-' + k]; SRC[k] = {}; for (const c of d.chapters) for (const v of c.verses) SRC[k][c.num + ':' + v.v] = v.t; }
const isTan = (a) => TAN.some(([, , re]) => re.test(a));
const chapters = (process.argv.find(a => /^--ch=/.test(a)) || '--ch=1,2,3').slice(5).split(',').map(Number);
let before = 0, after = 0; const byK = {};
for (const N of chapters) {
  const f = P + 'genesis-' + N + '.js'; const w = new Function('window', fs.readFileSync(f, 'utf8') + ';return window;')({}); const D = w.CHAPTER_DATA;
  for (const x of D) {
    before += x.commentaries.length;
    const others = x.commentaries.filter(c => !isTan(c.author || ''));
    const tan = [];
    for (const [k, label] of TAN) { const t = SRC[k][N + ':' + x.num]; if (t) { tan.push({ author: label, text: t.replace(/\n\n/g, '<br><br>') }); byK[k] = (byK[k] || 0) + 1; } }
    x.commentaries = tan.concat(others); after += x.commentaries.length;
  }
  if (WRITE) fs.writeFileSync(f, 'window.CHAPTER_DATA = ' + JSON.stringify(D, null, 1).replace(/\n/g, '\r\n') + ';\r\n', 'utf8');
}
console.log(WRITE ? 'SCRIS' : 'PROBĂ', 'capitole', chapters.join(','), '| rânduri înainte', before, '→ după', after);
console.log(JSON.stringify(byK));
