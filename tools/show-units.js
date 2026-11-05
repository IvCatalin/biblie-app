// node show-units.js slug cap v1,v2,...  → textul întreg al unităților
const fs = require('fs');
const P = 'C:/Users/ivcatali/biblie-app/public/';
const html = fs.readFileSync(P + 'library-data.js', 'utf8');
const i0 = html.indexOf('const LIBRARY = ') + 16;
const L = JSON.parse(html.slice(i0, html.indexOf('\n', i0)).trim().replace(/;$/, ''));
const [slug, cap, vs] = process.argv.slice(2);
let book = null;
(function walk(o) { if (!o || book) return; if (Array.isArray(o)) return o.forEach(walk); if (o.slug === slug && !o.isHeader && o.available) { book = o; return; } Object.values(o).forEach(x => typeof x === 'object' && walk(x)); })(L);
let chapters = book.chapters || [];
if (book.lazySrc && !chapters.length) { const ww = { LIB_LAZY: {} }; new Function('window', fs.readFileSync(P + book.lazySrc, 'utf8'))(ww); chapters = ww.LIB_LAZY[slug].chapters; }
const ch = chapters.find(c => String(c.num) === cap);
const want = vs ? vs.split(',').map(Number) : null;
(ch.verses || []).forEach(v => { if (!want || want.includes(v.v)) console.log('[' + slug + ' ' + cap + ':' + v.v + '] ' + String(v.t).replace(/<[^>]+>/g, '')); });
