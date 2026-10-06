const fs = require('fs');
const SRC = 'de-procesat/_haftarot-extract/haftarot-sarbatori.json';
const OUT = 'public/haftarot-sarbatori.js';
const d = JSON.parse(fs.readFileSync(SRC, 'utf8'));
const chapters = d.chapters.map(c => ({
  num: c.num, title: c.title, ref: c.ref, intro: '',
  verses: c.verses.map(v => {
    const toks = [{ t: v.t }];
    return { v: v.v, t: v.t, tokens: toks, commentaries: [], textCompare: [], refs: [] };
  })
}));
const body = 'window.HAFTAROT_DATA = window.HAFTAROT_DATA || {};\nwindow.HAFTAROT_DATA[' + JSON.stringify(d.slug) + '] = ' + JSON.stringify({ chapters }) + ';\n';
fs.writeFileSync(OUT, body);
const nv = chapters.reduce((s, c) => s + c.verses.length, 0);
console.log(OUT + ': ' + chapters.length + ' haftarot, ' + nv + ' versete, ' + (body.length / 1024).toFixed(0) + ' KB');
