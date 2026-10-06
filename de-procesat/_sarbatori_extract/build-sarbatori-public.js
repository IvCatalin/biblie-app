const fs = require('fs');
const SRC = 'de-procesat/_haftarot-extract/haftarot-sarbatori.json';
const OUT = 'public/haftarot-sarbatori.js';
const d = JSON.parse(fs.readFileSync(SRC, 'utf8'));
const chapters = d.chapters.map(c => ({
  num: c.num, title: c.title, ref: c.ref, intro: '',
  verses: c.verses.map(v => {
    const toks = v.tokens && v.tokens.length ? v.tokens : [{ t: v.t }];
    if (toks.map(t => t.t).join('') !== v.t) throw new Error('tokenii nu refac textul la ' + c.title + ' ' + v.v);
    return { v: v.v, t: v.t, tokens: toks, commentaries: v.commentaries || [], textCompare: v.textCompare || [], refs: v.refs || [] };
  })
}));
const body = 'window.HAFTAROT_DATA = window.HAFTAROT_DATA || {};\nwindow.HAFTAROT_DATA[' + JSON.stringify(d.slug) + '] = ' + JSON.stringify({ chapters }) + ';\n';
fs.writeFileSync(OUT, body);
const nv = chapters.reduce((s, c) => s + c.verses.length, 0);
console.log(OUT + ': ' + chapters.length + ' haftarot, ' + nv + ' versete, ' + (body.length / 1024).toFixed(0) + ' KB');
