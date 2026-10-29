// =====================================================================
// Căutare în toată arhiva din „Diverse” (Kabbala, Mișna, Josephus, Eusebiu,
// apocrife, patristice…), inclusiv în capitolele încărcate la cerere.
// Indexul se construiește pe server, din aceleași fișiere pe care le citește
// aplicația — browserul primește doar rezultatele, nu 14 MB de text.
// Tora (Rosen) și Haftarot nu intră aici: ele sunt secțiunea „Biblia” și se
// caută în aplicație.
// =====================================================================

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const PUB = path.join(__dirname, "public");

function strip(s){
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}
const WORD = /[\p{L}\p{M}\p{N}]/u;

function plain(t){
  return String(t || "")
    .replace(/<sup class="footnote-marker">[^<]*<\/sup>\s*<i class="footnote">[\s\S]*?<\/i>/g, "")
    .replace(/<i class="footnote">[\s\S]*?<\/i>/g, "")
    .replace(/<sup[^>]*>[\s\S]*?<\/sup>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// scoate obiectul LIBRARY din pagină (aceeași sursă ca aplicația)
function readLibrary(){
  const html = fs.readFileSync(path.join(PUB, "biblie-demo.html"), "utf8");
  const marker = "const LIBRARY = ";
  const i = html.indexOf(marker);
  if(i < 0) throw new Error("LIBRARY nu a fost găsit în biblie-demo.html");
  const s = html.indexOf("{", i);
  let depth = 0, inStr = false, esc = false, e = s;
  for(; e < html.length; e++){
    const c = html.charCodeAt(e);
    if(inStr){
      if(esc) esc = false;
      else if(c === 92) esc = true;
      else if(c === 34) inStr = false;
    } else if(c === 34) inStr = true;
    else if(c === 123) depth++;
    else if(c === 125){ depth--; if(depth === 0){ e++; break; } }
  }
  return JSON.parse(html.slice(s, e));
}

// colecția din care face parte o lucrare — la fel ca în aplicație (libSearchWorks)
function listWorks(LIBRARY){
  const out = [], seen = {};
  function add(book, group){
    if(book && book.slug && !book.isHeader && !seen[book.slug]){ seen[book.slug] = 1; out.push({ book, group }); }
  }
  function walkItems(items, folderLabel, nestedLabel){
    let header = "";
    (items || []).forEach(e => {
      if(!e) return;
      if(e.isHeader){ header = e.name || ""; return; }
      if(Array.isArray(e.items)){ walkItems(e.items, folderLabel, (e.label || "").split(" — ")[0].trim()); return; }
      add(e, nestedLabel || (/^Kabbala/.test(folderLabel) && header ? header : folderLabel));
    });
  }
  Object.keys(LIBRARY).forEach(key => {
    const f = LIBRARY[key];
    if(Array.isArray(f.books)) walkItems(f.books, f.label || "", "");
    if(Array.isArray(f.subfolders)) f.subfolders.forEach(s => walkItems(s.items, s.label || "", ""));
  });
  return out;
}

// numărul capitolului afișat — identic cu libChNum din aplicație
function chNum(ch, i){
  if(ch && typeof ch.num === "number" && ch.num !== i) return ch.num;
  return i + 1;
}

const lazyCache = new Map();
function loadLazyFile(rel){
  if(lazyCache.has(rel)) return lazyCache.get(rel);
  let data = {};
  try {
    const win = {};
    win.window = win;
    vm.runInNewContext(fs.readFileSync(path.join(PUB, rel), "utf8"), { window: win, document: {} }, { timeout: 30000 });
    data = win;
  } catch(err){
    console.error("[căutare] nu pot citi", rel, err.message);
  }
  lazyCache.set(rel, data);
  return data;
}

let ENTRIES = null;
let GROUP_ORDER = [];
let building = null;

function build(){
  const t0 = Date.now();
  const LIBRARY = readLibrary();
  const entries = [];
  const groups = [];
  listWorks(LIBRARY).forEach(({ book, group }) => {
    if(/^tora-rosen-/.test(book.slug) || /^haftarot-/.test(book.slug)) return; // secțiunea „Biblia”
    const work = (book.name_ro || book.name || "").replace(/\s*\([^)]*\)\s*$/g, "").replace(/\s*\([^)]*\)\s*$/g, "").trim();
    // lucrări încărcate întregi la cerere (ex. Mișna): capitolele vin din fișierul lazySrc
    let chapters = book.chapters || [];
    if(book.lazySrc && !chapters.length){
      const w = loadLazyFile(book.lazySrc);
      const d = (w.LIB_LAZY || {})[book.slug] || (w.HAFTAROT_DATA || {})[book.slug];
      if(d && Array.isArray(d.chapters)) chapters = d.chapters;
    }
    chapters.forEach((ch, chIdx) => {
      let verses = ch.verses;
      if((!verses || !verses.length) && ch.lazyChap){
        const d = (loadLazyFile(ch.lazyChap).LIB_LAZY || {})[book.slug + "#" + ch.num];
        if(Array.isArray(d)) verses = d;
      }
      if(!Array.isArray(verses) || !verses.length) return;
      const g = group || work;
      if(groups.indexOf(g) === -1) groups.push(g);
      const label = chNum(ch, chIdx);
      const t = (ch.title || "").trim();
      const chTitle = (t && t.length <= 36) ? t : "";
      // Josephus / Eusebiu: cititorul arată „I, cap. 15” (din titlu), nu numărul secvențial din fișier
      const structured = /^(josephus-(antichitati|razboiul)|eusebiu-istoria)/.test(book.slug) && t.indexOf(" — ") > 0
        ? t.slice(0, t.indexOf(" — ")).replace(/^Cartea\s+/, "") : "";
      verses.forEach(v => {
        if(typeof v.t !== "string") return;
        const text = plain(v.t);
        if(!text) return;
        const loc = structured ? structured + ":" + v.v : (chTitle ? chTitle + " " : "cap. " + label + ":") + v.v;
        let anchor = "";
        const pre = v.t.match(/^\(([^)]{3,40}\d+:\d+[^)]*)\)/);
        if(pre) anchor = pre[1];
        else if(ch.ref && /[A-Za-zĂÂÎȘȚăâîșț]/.test(ch.ref) && /\d/.test(ch.ref)) anchor = ch.ref;
        entries.push({
          group: g,
          title: work + ", " + loc + (anchor ? " - " + anchor : ""),
          plain: text,
          n: strip(text),
          key: "lib_" + book.slug + "_" + ch.num + "_" + v.v,
          slug: book.slug, chIdx, v: String(v.v)
        });
      });
    });
  });
  ENTRIES = entries;
  GROUP_ORDER = groups;
  console.log(`[căutare] index gata: ${entries.length} versete, ${groups.length} colecții, ${Date.now() - t0} ms`);
}

function ensureIndex(){
  if(ENTRIES) return Promise.resolve();
  if(!building){
    building = new Promise((resolve, reject) => {
      setImmediate(() => { try { build(); resolve(); } catch(err){ building = null; reject(err); } });
    });
  }
  return building;
}

function matches(n, toks){
  return toks.every(t => {
    let idx = n.indexOf(t);
    while(idx !== -1){
      if(idx === 0 || !WORD.test(n[idx - 1])) return true;
      idx = n.indexOf(t, idx + 1);
    }
    return false;
  });
}

// întoarce { total, counts: [[colecție, n], …], hits: […] } — hits doar pentru pagina cerută
async function search(query, group, offset, limit){
  await ensureIndex();
  const toks = strip(String(query || "").trim()).split(/\s+/).filter(Boolean);
  if(!toks.length || String(query).trim().length < 2) return { total: 0, counts: [], hits: [] };

  const counts = new Map();
  const wanted = [];
  let total = 0;
  for(const e of ENTRIES){
    if(!matches(e.n, toks)) continue;
    total++;
    counts.set(e.group, (counts.get(e.group) || 0) + 1);
    if(!group || e.group === group) wanted.push(e);
  }
  const page = wanted.slice(offset, offset + limit).map(e => ({
    group: e.group, title: e.title, plain: e.plain, key: e.key, slug: e.slug, chIdx: e.chIdx, v: e.v
  }));
  return {
    total,
    counts: Array.from(counts.entries()).sort((a, b) => b[1] - a[1]),
    matched: wanted.length,
    hits: page
  };
}

module.exports = { ensureIndex, search };
