// Generează public/search-haftarot.js — indexul de căutare (doar text simplu) pentru Haftarot.
// Fișierele haftarot-*.js sunt mari (lexicon, comentarii); căutarea are nevoie doar de text,
// așa că încarcă acest index mic în loc de ele. Rulează din nou după orice modificare de text la Haftarot:
//   node tools/build-search-haftarot.js
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const PUB = path.join(__dirname, "..", "public");
const files = fs.readdirSync(PUB).filter(f => /^haftarot-.*\.js$/.test(f) && f !== "search-haftarot.js");

function plain(t){
  return String(t || "")
    .replace(/<i class="footnote">.*?<\/i><\/i>/g, " ")
    .replace(/<i class="footnote">.*?<\/i>/g, " ")
    .replace(/<sup[^>]*>.*?<\/sup>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ch.ref poate avea mai multe pasaje, chiar din cărți diferite: „Isaia 27:6-28:13; 29:22-23”
function parseSegments(ref){
  const segs = [];
  let book = "";
  String(ref || "").split(/;\s*/).forEach(seg => {
    const m = seg.match(/^((?:[1-3]\s)?[^\d]+?)\s+(\d+):(\d+)/);
    if(m){ book = m[1].trim(); segs.push({ book, start: m[2] + ":" + m[3] }); return; }
    const c = seg.match(/^(\d+):(\d+)/);
    if(c) segs.push({ book, start: c[1] + ":" + c[2] });
  });
  return segs;
}

const out = {};
let nv = 0, unresolved = 0;
files.forEach(f => {
  const win = {};
  win.window = win;
  vm.runInNewContext(fs.readFileSync(path.join(PUB, f), "utf8"), { window: win, document: {} }, { timeout: 30000 });
  const data = win.HAFTAROT_DATA || {};
  Object.keys(data).forEach(slug => {
    out[slug] = (data[slug].chapters || []).map((ch, chIdx) => {
      const segs = parseSegments(ch.ref);
      let si = 0;
      const verses = (ch.verses || []).map(v => {
        const key = String(v.v);
        if(si + 1 < segs.length && key === segs[si + 1].start) si++;
        const book = segs.length ? segs[si].book : "";
        let ref;
        if(/^(?:[1-3]\s)?[^\d\s][^\d]*\s\d+:\d+/.test(key)) ref = key; // cheia conține deja cartea („1 Samuel 20:18”)
        else if(book && /^\d+:\d+/.test(key)) ref = book + " " + key;
        else { ref = (book || ch.ref || "") + " " + key; unresolved++; }
        nv++;
        return [ref.replace(/_/g, " ").trim(), plain(v.t), key];
      }).filter(x => x[1]);
      const title = String(ch.title || "").split(" - ")[0].trim();
      return [chIdx, ch.num, title, verses];
    });
  });
});

const target = path.join(PUB, "search-haftarot.js");
fs.writeFileSync(target, "window.SEARCH_HAFTAROT=" + JSON.stringify(out) + ";\n");
console.log("Scris", path.relative(process.cwd(), target), "—", nv, "versete,", unresolved, "cu trimitere aproximativă,", (fs.statSync(target).size / 1024).toFixed(0) + " KB");
