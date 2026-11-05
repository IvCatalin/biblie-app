// Scheletul bibliotecii (doar dosare și subdosare, fără cărți): se pune în biblie-demo.html ca LIB_SKELETON, ca ecranele Diverse să apară instant, înainte să sosească library-data.js.
// node tools/build-lib-skeleton.js  — rulează-l când se schimbă structura dosarelor/subdosarelor din library-data.js (nu la text nou).
const fs = require('fs');
const P = 'C:/Users/ivcatali/biblie-app/public/';
const lib = fs.readFileSync(P + 'library-data.js', 'utf8');
const i0 = lib.indexOf('const LIBRARY = ') + 16;
const L = JSON.parse(lib.slice(i0, lib.lastIndexOf(';')).trim());
const sk = {};
for (const [k, f] of Object.entries(L)) {
  const o = { label: f.label, note: f.note || '' };
  if (f.panelTitle) o.panelTitle = f.panelTitle;
  if (f.isNested && Array.isArray(f.subfolders)) {
    o.isNested = true;
    o.subfolders = f.subfolders.map(s => (s.isInfo ? { label: s.label, isInfo: true, text: s.text } : { label: s.label, note: s.note || '' }));
    sk[k] = o;
  }
}
const html = fs.readFileSync(P + 'biblie-demo.html', 'utf8');
const marker = /const LIB_SKELETON = [^\n]*;\n/;
const line = 'const LIB_SKELETON = ' + JSON.stringify(sk) + ';\n';
let out;
if (marker.test(html)) out = html.replace(marker, () => line);
else { const a = '  const CATEGORY_ORDER = ['; if (html.split(a).length !== 2) throw new Error('ancoră'); out = html.replace(a, () => '  ' + line + a); }
fs.writeFileSync(P + 'biblie-demo.html', out, 'utf8');
console.log('schelet:', Object.keys(sk).join(', '), '|', JSON.stringify(sk).length, 'caractere');
