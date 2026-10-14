// node lxx-recover-weekly.js <chapterArrayIndex> [--scrie]
//
// Recupereaza campurile greek / greek_def_ro / diff_ro din sursa .bak-lex
// (stadiul "lexicon la nivelul Genezei 1", inainte ca densify-chapter.js sa lege
// cuvinte in fraze si sa stearga aceste campuri).
//
// METODA (sigura, NU pozitionala - varianta pozitionala anterioara a produs date
// gresite din cauza cuvintelor netagate/goale din tagarea veche):
// Pentru fiecare verset, pentru fiecare cuvant ebraic EXACT (heb fara spatiu) din
// tagurile vechi care au date LXX, il pun intr-o coada FIFO pe acel cuvant exact.
// Pentru fiecare token NOU cu heb exact (un singur cuvant) care nu are deja greek,
// scot primul element din coada cuvantului respectiv (potrivire prin identitate
// exacta de cuvant + ordinea aparitiei, nu prin pozitie absoluta - robust la
// reordonari de traducere si la goluri din tagarea veche).
// FALLBACK (incredere mai mica, marcat separat in raport): daca nu exista potrivire
// exacta, caut acel cuvant ca substring in heb-ul unor taguri vechi LEGATE (mai multe
// cuvinte), si imprumut datele acelui tag legat (pot fi partajate intre mai multe
// cuvinte noi - e o aproximare, nu o potrivire exacta).
//
// REGULA DE SIGURANTA: nu sterge si nu suprascrie NICIODATA un camp deja existent -
// doar completeaza campuri absente. Scrie doar cu --scrie; fara el, doar raport.
const fs = require('fs');
const path = require('path');

const CURRENT_PATH = path.join(__dirname, '../_haftarot-extract/haftarot-ciclu-saptamanal.json');
const OLD_PATH = path.join(__dirname, '../_haftarot-extract/haftarot-ciclu-saptamanal.json.bak-lex');

const chIdx = parseInt(process.argv[2], 10);
const SCRIE = process.argv.includes('--scrie');
if (Number.isNaN(chIdx)) { console.error('Usage: node lxx-recover-weekly.js <chapterArrayIndex> [--scrie]'); process.exit(1); }

const cur = JSON.parse(fs.readFileSync(CURRENT_PATH, 'utf8'));
const old = JSON.parse(fs.readFileSync(OLD_PATH, 'utf8'));

const curCh = cur.chapters[chIdx];
if (!curCh) { console.error('Capitol inexistent la index ' + chIdx); process.exit(1); }
const oldCh = old.chapters.find(c => c.num === curCh.num);
if (!oldCh) { console.error('Nu gasesc capitolul num=' + curCh.num + ' in .bak-lex'); process.exit(1); }

let stats = { tokensFilledExact: 0, tokensFilledFallback: 0, tokensAlreadyHad: 0, tokensNoMultiWord: 0, tokensNoOldData: 0 };

for (const curV of curCh.verses) {
  const oldV = oldCh.verses.find(v => v.v === curV.v);
  if (!oldV) continue;

  // coada FIFO per cuvant exact, din tagurile vechi cu heb de UN singur cuvant
  const queues = new Map();
  const boundOldTokens = []; // taguri vechi cu heb de 2+ cuvinte, pentru fallback
  for (const t of (oldV.tokens || [])) {
    if (!t.heb || !(t.greek || t.greek_def_ro)) continue;
    const words = t.heb.trim().split(/\s+/).filter(Boolean);
    if (words.length === 1) {
      const w = words[0];
      if (!queues.has(w)) queues.set(w, []);
      queues.get(w).push(t);
    } else if (words.length > 1) {
      boundOldTokens.push({ words, t });
    }
  }

  for (const nt of curV.tokens) {
    if (!nt.heb) continue;
    const already = !!(nt.greek || nt.greek_def_ro);
    if (already) { stats.tokensAlreadyHad++; continue; }

    const nWords = nt.heb.trim().split(/\s+/).filter(Boolean);
    if (nWords.length === 1) {
      const w = nWords[0];
      const q = queues.get(w);
      if (q && q.length) {
        const src = q.shift();
        if (src.greek) nt.greek = src.greek;
        if (src.greek_def_ro) nt.greek_def_ro = src.greek_def_ro;
        if (src.diff_ro) nt.diff_ro = src.diff_ro;
        stats.tokensFilledExact++;
        continue;
      }
      // fallback: cuvantul apare ca substring intr-un tag vechi legat
      const match = boundOldTokens.find(b => b.words.includes(w));
      if (match) {
        if (match.t.greek) nt.greek = match.t.greek;
        if (match.t.greek_def_ro) nt.greek_def_ro = match.t.greek_def_ro;
        if (match.t.diff_ro) nt.diff_ro = match.t.diff_ro;
        stats.tokensFilledFallback++;
      } else {
        stats.tokensNoOldData++;
      }
    } else {
      // token nou legat (exceptie legitima, 2+ cuvinte) - caut un tag vechi legat cu exact aceleasi cuvinte, altfel sar
      const exact = boundOldTokens.find(b => b.words.join(' ') === nWords.join(' '));
      if (exact) {
        if (exact.t.greek) nt.greek = exact.t.greek;
        if (exact.t.greek_def_ro) nt.greek_def_ro = exact.t.greek_def_ro;
        if (exact.t.diff_ro) nt.diff_ro = exact.t.diff_ro;
        stats.tokensFilledExact++;
      } else {
        stats.tokensNoMultiWord++;
      }
    }
  }
}

console.log('Capitol:', curCh.num, curCh.title);
console.log('Completati exact (cuvant unic sau tag legat identic):', stats.tokensFilledExact);
console.log('Completati prin fallback (cuvant gasit in tag vechi legat, partajat):', stats.tokensFilledFallback);
console.log('Aveau deja greek:', stats.tokensAlreadyHad);
console.log('Fara sursa veche (cuvant unic, nicio potrivire):', stats.tokensNoOldData);
console.log('Fara sursa veche (tag legat nou, nicio potrivire identica):', stats.tokensNoMultiWord);

if (SCRIE) {
  fs.writeFileSync(CURRENT_PATH, JSON.stringify(cur, null, 1));
  console.log('Scris in fisier.');
} else {
  console.log('(dry-run, fara --scrie nu s-a scris nimic)');
}
