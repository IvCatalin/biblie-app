// node retag/commit.js <cap> "<titlu scurt>" — verifică (doar capitolul <cap> diferă de HEAD; comentarii/trimiteri neatinse), apoi git add/commit/push
const cp = require('child_process'), fs = require('fs'), path = require('path');
const cn = +process.argv[2], title = process.argv[3] || '';
const R = path.join(__dirname, '../../..');
const sh = c => cp.execSync(c, { cwd: R, maxBuffer: 1e9, stdio: ['ignore', 'pipe', 'pipe'] }).toString();
const F = 'de-procesat/_haftarot-extract/haftarot-ciclu-saptamanal.json';
const old = JSON.parse(sh(`git show HEAD:${F}`)), nw = JSON.parse(fs.readFileSync(path.join(R, F), 'utf8'));
const diff = nw.chapters.filter(c => JSON.stringify(old.chapters.find(x => x.num === c.num)) !== JSON.stringify(c)).map(c => c.num);
if (diff.join() !== String(cn)) { console.log('EROARE: capitole schimbate = ' + diff.join(',')); process.exit(1); }
const c = nw.chapters.find(x => x.num === cn), o = old.chapters.find(x => x.num === cn);
const same = k => JSON.stringify(o.verses.map(v => v[k])) === JSON.stringify(c.verses.map(v => v[k]));
if (!same('commentaries') || !same('refs') || !same('textCompare') || !same('t') || !same('heb')) { console.log('EROARE: comentarii/trimiteri/text modificate'); process.exit(1); }
let tags = 0, pairs = 0, lxx = 0, par = 0;
for (const v of c.verses) for (const t of v.tokens) if (t.heb) { tags++; if (t.heb.split(/\s+/).length > 1) pairs++; if (t.greek) lxx++; if (/\([^)]*\)\s*$/.test(t.def_ro || '')) par++; }
if (par) { console.log('EROARE: def_ro cu paranteză: ' + par); process.exit(1); }
const slug = ['geneza', 'exod', 'levitic', 'numeri', 'deuteronom'][cn <= 12 ? 0 : cn <= 25 ? 1 : cn <= 37 ? 2 : cn <= 47 ? 3 : 4];
const nn = String(cn).padStart(2, '0');
const files = [F, `de-procesat/_haftarot-extract/retag/c${nn}.js`, `de-procesat/_haftarot-extract/retag/bank-c${nn}.js`, `public/haftarot-${slug}.js`];
for (const f of ['bank.json', 'retag.js', 'view.js', 'commit.js']) { const p = 'de-procesat/_haftarot-extract/retag/' + f; if (sh(`git status --short -- ${p}`).trim()) files.push(p); }
sh(`git add ${files.join(' ')}`);
const msg = `Retagare per cuvant (Standard Davar) - Haftarot saptamanal cap. ${cn} ${title}: ${tags} taguri, ${pairs} perechi, dict_ro unic per cuvant, 0 erori\n\nCo-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`;
fs.writeFileSync(path.join(R, '.git/COMMIT_MSG_TMP'), msg);
sh('git commit -q -F .git/COMMIT_MSG_TMP'); sh('git push -q');
console.log(`OK cap.${cn}: ${tags} tag-uri, ${pairs} perechi, LXX ${lxx}; ` + sh('git log --oneline -1').trim());
