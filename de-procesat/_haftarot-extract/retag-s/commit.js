// node retag/commit.js <cap> "<titlu scurt>" [tag|complet] — verifică (doar capitolul <cap> diferă de HEAD; textul de bază și textCompare neatinse), apoi git add/commit/push
//   tag     = comentariile și trimiterile trebuie să fie neatinse (doar tagare/LXX)
//   complet = se acceptă comentarii/trimiteri adăugate (Standard Davar complet)
const cp = require('child_process'), fs = require('fs'), path = require('path');
const CNS = String(process.argv[2]).split(',').map(Number).sort((a, b) => a - b); const cn = CNS[0], title = process.argv[3] || '', MODE = process.argv[4] || 'tag';
const R = path.join(__dirname, '../../..');
const sh = c => cp.execSync(c, { cwd: R, maxBuffer: 1e9, stdio: ['ignore', 'pipe', 'pipe'] }).toString();
const F = 'de-procesat/_haftarot-extract/haftarot-sarbatori.json';
const old = JSON.parse(sh(`git show HEAD:${F}`)), nw = JSON.parse(fs.readFileSync(path.join(R, F), 'utf8'));
const diff = nw.chapters.filter(c => JSON.stringify(old.chapters.find(x => x.num === c.num)) !== JSON.stringify(c)).map(c => c.num);
if (diff.join() !== CNS.join()) { console.log('EROARE: capitole schimbate = ' + diff.join(',')); process.exit(1); }
const c = nw.chapters.find(x => x.num === cn), o = old.chapters.find(x => x.num === cn);
const same = k => JSON.stringify(o.verses.map(v => v[k])) === JSON.stringify(c.verses.map(v => v[k]));
if ((MODE === 'tag' && (!same('commentaries') || !same('refs'))) || (MODE === 'tag' && !same('textCompare')) || !same('t') || !same('heb')) { console.log('EROARE: text de bază/textCompare (sau comentarii/trimiteri în modul tag) modificate'); process.exit(1); }
let tags = 0, pairs = 0, lxx = 0, par = 0;
for (const v of c.verses) for (const t of v.tokens) if (t.heb) { tags++; if (t.heb.split(/\s+/).length > 1) pairs++; if (t.greek) lxx++; if (/\([^)]*\)\s*$/.test(t.def_ro || '')) par++; }
if (par) { console.log('EROARE: def_ro cu paranteză: ' + par); process.exit(1); }
const slug = 'sarbatori';
const nn = String(cn).padStart(2, '0');
const D = 'de-procesat/_haftarot-extract/retag-s/';
const files = [F, `public/haftarot-${slug}.js`];
for (const f of fs.readdirSync(__dirname)) {
  const mine = CNS.some(k => { const q = String(k).padStart(2, '0'); return new RegExp('-c' + q + '\\.js$').test(f) || f === `c${q}.js`; });
  const tool = ['lxx-gl.js', 'comm-add.js', 'lxx.js', 'lxxfix.js', 'rahlfs-sarb.json', 'LXX-SURSA.md', 'bank.json', 'retag.js', 'view.js', 'commit.js'].includes(f);
  if ((mine || tool) && sh(`git status --short -- ${D + f}`).trim()) files.push(D + f);
}
sh(`git add ${files.join(' ')}`);
const ncom = c.verses.reduce((a, v) => a + (v.commentaries || []).length, 0);
const msg = `${CNS.length > 1 ? '[cap. ' + CNS.join(',') + '] ' : ''}${MODE === 'complet' ? 'Standard Davar complet' : 'Retagare per cuvant (Standard Davar)'} - Haftarot Sarbatori cap. ${cn} ${title}: ${tags} taguri, ${pairs} perechi, LXX ${lxx}, comentarii ${ncom}, 0 erori\n\nCo-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`;
fs.writeFileSync(path.join(R, '.git/COMMIT_MSG_TMP'), msg);
sh('git commit -q -F .git/COMMIT_MSG_TMP'); sh('git push -q');
console.log(`OK cap.${cn}: ${tags} tag-uri, ${pairs} perechi, LXX ${lxx}, comentarii ${ncom}; ` + sh('git log --oneline -1').trim());
