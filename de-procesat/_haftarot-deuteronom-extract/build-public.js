// node build-public.js — generează din fișierul de lucru fișierele Haftarot pentru aplicație (public/haftarot-<secțiune>.js)
// Fiecare fișier: window.HAFTAROT_DATA["haftarot-<secțiune>"] = { chapters: [...] }, capitolele renumerotate 1..n în secțiune
const fs = require('fs'); const path = require('path');
const SRC = path.join(__dirname, '../_haftarot-extract/haftarot-ciclu-saptamanal.json');
const OUT = path.join(__dirname, '../../public');
const SECTIONS = [
  ['haftarot-geneza', 1, 12], ['haftarot-exod', 13, 25], ['haftarot-levitic', 26, 37], ['haftarot-numeri', 38, 47], ['haftarot-deuteronom', 48, 57]
];
const d = JSON.parse(fs.readFileSync(SRC, 'utf8'));
const report = [];
for (const [slug, a, b] of SECTIONS) {
  const chs = d.chapters.filter(c => c.num >= a && c.num <= b);
  if (chs.length !== b - a + 1) throw new Error('capitole lipsă în ' + slug);
  const chapters = chs.map((c, i) => ({
    num: i + 1, title: c.title, ref: c.ref, intro: c.intro || '',
    verses: c.verses.map(v => {
      const toks = v.tokens && v.tokens.length ? v.tokens : [{ t: v.t }];
      const o = { v: v.v, t: v.t, tokens: toks, commentaries: v.commentaries || [], textCompare: v.textCompare || [], refs: v.refs || [] };
      if (toks.map(t => t.t).join('') !== v.t) throw new Error(`tokenii nu refac textul la ${c.title} ${v.v}`);
      return o;
    })
  }));
  const body = 'window.HAFTAROT_DATA = window.HAFTAROT_DATA || {};\nwindow.HAFTAROT_DATA[' + JSON.stringify(slug) + '] = ' + JSON.stringify({ chapters }) + ';\n';
  fs.writeFileSync(path.join(OUT, slug + '.js'), body);
  const nv = chapters.reduce((s, c) => s + c.verses.length, 0);
  report.push(`${slug}.js: ${chapters.length} haftarot, ${nv} versete, ${(body.length / 1024).toFixed(0)} KB`);
}
console.log(report.join('\n'));
