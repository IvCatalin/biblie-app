// Construiește src/book-NN.json din paginile Perseus descărcate (Whiston + marcaje Niese) și titlurile din en.json.
// Utilizare: node build-src.js <dir> <en.json>
const fs = require('fs');
const [DIR, ENJ] = process.argv.slice(2);
const en = JSON.parse(fs.readFileSync(ENJ, 'utf8'));
const clean = s => s.replace(/<a id="note-link\d+"[^>]*><sup>\d+<\/sup><\/a>/g, '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();
const report = [];
for (let b = 1; b <= 20; b++) {
  const chapters = [];
  for (const c of Object.keys(en[b]).map(Number).sort((x, y) => x - y)) {
    const f = DIR + '/html/' + b + '-' + c + '.html';
    const h = fs.readFileSync(f, 'utf8');
    const a = h.indexOf('<div class="text">'); const z = h.indexOf('</div>', a);
    if (a < 0) throw new Error('fără text ' + b + '.' + c);
    const body = h.slice(a + 18, z);
    const parts = body.split(/<p\s*\/>/).map(x => x.trim()).filter(x => clean(x).length > 0);
    const secs = parts.map((p, i) => {
      const m = p.match(/\[\s*<span class="english">(\d+)<\/span>\s*\]/);
      const txt = clean(p.replace(/\[\s*<span class="english">\d+<\/span>\s*\]/, ''));
      return { w: i + 1, n0: m ? +m[1] : null, en: txt };
    });
    chapters.push({ ch: c, title: en[b][c].title, sections: secs });
  }
  fs.mkdirSync(DIR + '/src', { recursive: true });
  // Niese: prima secțiune a primului capitol din carte = §1; prima secțiune a celorlalte capitole nu are marcaj -> start = (start-ul ultimei secțiuni din capitolul anterior + 1) NU se poate deduce; se marchează null și se completează la integrare din marcajele următoare
  fs.writeFileSync(DIR + '/src/book-' + String(b).padStart(2, '0') + '.json', JSON.stringify({ book: b, chapters }));
  const ns = chapters.reduce((a, c) => a + c.sections.length, 0), nm = chapters.reduce((a, c) => a + c.sections.filter(s => s.n0 !== null).length, 0);
  const firsts = chapters.map(c => c.sections[0].n0 === null ? '-' : c.sections[0].n0).join(',');
  report.push(`Cartea ${b}: ${chapters.length} capitole, ${ns} secțiuni, ${nm} cu marcaj Niese | primele secțiuni: ${firsts}`);
}
console.log(report.join('\n'));
