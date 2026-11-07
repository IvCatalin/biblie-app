// Câte rânduri de context (Jubilee, Cartea Dreptului, Josephus, apocrife/pseudepigrafe) are fiecare capitol. node tools/audit-context.js [a b]
const fs = require('fs');
const [a, b] = [+process.argv[2] || 1, +process.argv[3] || 26];
const cat = (c) => { if (/^Context cultural/.test(c.author || '')) return 'ane'; const s = (c.author || '') + ' ' + ((c.src && c.src.slug) || ''); if (/Jubilee|jubileele/i.test(s)) return 'jub'; if (/Dreptului|cartea-dreptului/i.test(s)) return 'drept'; if (/Josephus/i.test(s)) return 'jos'; if (/Enoh|Ezdra|Sibilin|Adam și Eva|Apocalips|Testament|Sirah|Țiduș|Înțelepciunea|Tovit|Iudita|Baruh|Macabei|Iosif și Aseneth|Barnaba|Odele|Solomon|Moise|Ioan|Filon|Cartea lui|apocrif|pseudepigraf/i.test(s)) return 'apocr'; return null; };
console.log('cap | verse | jub | drept | jos | apocr | ane | versete fără niciun context');
for (let n = a; n <= b; n++) {
  const D = new Function('window', fs.readFileSync('public/genesis-' + n + '.js', 'utf8') + ';return window;')({}).CHAPTER_DATA;
  const t = { jub: 0, drept: 0, jos: 0, apocr: 0, ane: 0 }; let none = 0;
  for (const x of D) { let any = false; for (const c of x.commentaries || []) { const k = cat(c); if (k) { t[k]++; any = true; } } if (!any) none++; }
  console.log(n + ' | ' + D.length + ' | ' + t.jub + ' | ' + t.drept + ' | ' + t.jos + ' | ' + t.apocr + ' | ' + t.ane + ' | ' + none);
}
