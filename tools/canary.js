// Semn de proprietate invizibil în textele traduse pentru Davar.
// În unele versete se insera, după prima propoziție, o secvență de caractere de lățime zero (U+2060 + 24 de biți din U+200B/U+200C):
// 16 biți = semnătura Davar, 8 biți = codul lucrării (crc8 din slug). Invizibil la citire, rămâne la copiere.
// Folosire:  node tools/canary.js            (raport, nu scrie nimic)
//            node tools/canary.js --write    (aplică; idempotent — versetele deja marcate se sar)
// Detectare: node tools/canary-detect.js <fișier-text>
const fs = require("fs");
const path = require("path");
const PUB = path.join(__dirname, "..", "public");
const WRITE = require.main === module && process.argv.includes("--write");

const START = "⁠", Z0 = "​", Z1 = "‌";
const SIGNATURE = 0xDA5A; // 16 biți
function crc8(s){ let c = 0; for(const b of Buffer.from(s, "utf8")){ c ^= b; for(let i = 0; i < 8; i++) c = (c & 0x80) ? ((c << 1) ^ 0x07) & 0xFF : (c << 1) & 0xFF; } return c; }
function marker(slug){
  const bits = ((SIGNATURE << 8) | crc8(slug)).toString(2).padStart(24, "0");
  return START + bits.split("").map(b => b === "1" ? Z1 : Z0).join("");
}
const ZW_RE = /[⁠​‌]/g;
function strip(s){ return String(s).replace(ZW_RE, ""); }
function isMarked(s){ return s.indexOf(START + Z0) >= 0 || s.indexOf(START + Z1) >= 0; }
function markText(t, slug){
  if(typeof t !== "string" || t.length < 50 || isMarked(t)) return t;
  const m = marker(slug);
  const i = t.search(/[.!?…»”]\s/);
  if(i >= 12) return t.slice(0, i + 1) + m + t.slice(i + 1);
  return t + m;
}
// marchează o listă de versete {v,t}: primul și fiecare al 6-lea
function markVerses(arr, slug, st){
  arr.forEach((vs, i) => {
    if(!vs || typeof vs.t !== "string") return;
    st.verses++;
    if(i !== 0 && i % 6 !== 0) return;
    const n = markText(vs.t, slug);
    if(n !== vs.t){ vs.t = n; st.marked++; } else if(isMarked(vs.t)) st.already++;
  });
}
function walkWork(n, slug, st){
  if(!n || typeof n !== "object") return;
  if(Array.isArray(n)){ if(n.length && n[0] && typeof n[0].t === "string" && n[0].v !== undefined) markVerses(n, slug, st); else n.forEach(x => walkWork(x, slug, st)); return; }
  Object.keys(n).forEach(k => walkWork(n[k], slug, st));
}

function main(){
const stats = { verses: 0, marked: 0, already: 0, works: 0, files: 0 };
const byWork = {};
function bump(slug, st){ const w = byWork[slug] = byWork[slug] || { verses: 0, marked: 0 }; w.verses += st.verses; w.marked += st.marked + st.already; }

// 1) library-data.js — toate lucrările disponibile, fără textul Rosen
{
  const f = path.join(PUB, "library-data.js");
  const src = fs.readFileSync(f, "utf8");
  const a = src.indexOf("{"), b = src.lastIndexOf("}");
  const L = JSON.parse(src.slice(a, b + 1));
  if(JSON.stringify(L) !== src.slice(a, b + 1)) throw new Error("library-data.js nu se reserializează identic; opresc");
  (function visit(n){
    if(!n || typeof n !== "object") return;
    if(Array.isArray(n)){ n.forEach(visit); return; }
    if(n.slug && Array.isArray(n.chapters)){
      if(/^tora-rosen/.test(n.slug) || !n.available) return;
      const st = { verses: 0, marked: 0, already: 0 };
      walkWork(n.chapters, n.slug, st); stats.works++; bump(n.slug, st);
      stats.verses += st.verses; stats.marked += st.marked; stats.already += st.already;
      return;
    }
    Object.keys(n).forEach(k => visit(n[k]));
  })(L);
  stats.files++;
  if(WRITE) fs.writeFileSync(f, src.slice(0, a) + JSON.stringify(L) + src.slice(b + 1));
}

// 2) fișierele încărcate la cerere: window.LIB_LAZY["cheie"]=<JSON>;
for(const dir of ["josephus", "eusebiu", "mishna", "talmud", "zohar", "faptele"]){
  const d = path.join(PUB, dir);
  for(const name of fs.readdirSync(d).filter(x => x.endsWith(".js"))){
    const f = path.join(d, name);
    const src = fs.readFileSync(f, "utf8");
    const re = /window\.LIB_LAZY\[("(?:[^"\\]|\\.)*")\]=/g;
    const parts = []; let m;
    while((m = re.exec(src))) parts.push({ key: JSON.parse(m[1]), at: m.index, from: m.index + m[0].length });
    if(!parts.length) continue;
    let out = src.slice(0, parts[0].at);
    parts.forEach((p, i) => {
      const end = i + 1 < parts.length ? parts[i + 1].at : src.length;
      let body = src.slice(p.from, end);
      const tail = (body.match(/;?\s*$/) || [""])[0]; body = body.slice(0, body.length - tail.length);
      const data = JSON.parse(body);
      const slug = p.key.split("#")[0];
      const st = { verses: 0, marked: 0, already: 0 };
      walkWork(data, slug, st); bump(slug, st);
      stats.verses += st.verses; stats.marked += st.marked; stats.already += st.already;
      out += src.slice(p.at, p.from) + JSON.stringify(data) + tail;
    });
    stats.files++;
    if(WRITE) fs.writeFileSync(f, out);
  }
}
console.log((WRITE ? "SCRIS" : "RAPORT (nu s-a scris nimic)"), JSON.stringify(stats));
console.log("lucrări/chei cu cel puțin un marcaj:", Object.values(byWork).filter(w => w.marked).length, "din", Object.keys(byWork).length);
}
if(require.main===module) main();
module.exports = { marker, strip, crc8, SIGNATURE };
