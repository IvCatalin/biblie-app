// Descarcă Whiston (Perseus 1999.01.0146) cu marcajele de paragraf Niese [N] și construiește src/book-NN.json:
// { book, chapters:[{ch,title,sections:[{w,niese:[a,b],en}]}] }  (w = secțiunea Whiston; niese = intervalul de paragrafe Niese acoperit)
// Titlurile capitolelor vin din THE ANTIQUITIES OF THE JEWS.txt (en.json produs de parse-en.js).
// Utilizare: node fetch-perseus.js <dir-iesire> <en.json>
const fs = require('fs');
const { execFile } = require('child_process');
const [OUT, ENJ] = process.argv.slice(2);
fs.mkdirSync(OUT + '/html', { recursive: true }); fs.mkdirSync(OUT + '/src', { recursive: true });
const en = JSON.parse(fs.readFileSync(ENJ, 'utf8'));
const jobs = [];
for (let b = 1; b <= 20; b++) for (const c of Object.keys(en[b])) jobs.push([b, +c]);
const url = (b, c) => 'https://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A1999.01.0146%3Abook%3D' + b + '%3Awhiston+chapter%3D' + c;
const get = ([b, c]) => new Promise(res => {
  const f = OUT + '/html/' + b + '-' + c + '.html';
  if (fs.existsSync(f) && fs.statSync(f).size > 5000) return res();
  const go = n => execFile('curl', ['-s', '--compressed', '-m', '60', '-o', f, '-w', '%{http_code}', url(b, c)], (e, out) => {
    if (out.trim() !== '200' || fs.statSync(f).size < 5000) { if (n < 4) return setTimeout(() => go(n + 1), 1500); console.log('EȘEC', b, c, out); }
    res();
  });
  go(1);
});
const pool = async (items, n, fn) => { let i = 0; await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) await fn(items[i++]); })); };
(async () => {
  await pool(jobs, +(process.env.CONC || 5), get);
  console.log('descărcate', jobs.length);
})();
