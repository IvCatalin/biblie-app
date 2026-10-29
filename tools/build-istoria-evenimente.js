// Îmbină evenimentele iudeo-creștine selectate (data/evenimente-src/*.json) într-un singur fișier,
// data/istoria-evenimente.json, folosit de server pentru „Istoria zilei”.
// Fișierele lunare (01–12) au rânduri [zi, an, pondere, text]; neoprotestante.json are [lună, zi, an, pondere, text].
// Pondere: 3 = eveniment major, 2 = important, 1 = relevant. Textele sunt traduceri în română după Wikipedia
// (CC BY-SA 4.0); datele neoprotestante au fost verificate pe surse web separate.
//   node tools/build-istoria-evenimente.js
const fs = require("fs");
const path = require("path");

const SRC = path.join(__dirname, "..", "data", "evenimente-src");
const DAYS = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const out = {};
let total = 0;
const problems = [];

function add(m, d, y, p, t, from){
  if(!(m >= 1 && m <= 12) || !(d >= 1 && d <= DAYS[m - 1])) { problems.push(from + ": zi invalidă " + d + "/" + m); return; }
  if(typeof t !== "string" || t.length < 20) { problems.push(from + ": text lipsă la " + d + "/" + m); return; }
  if(!(p >= 1 && p <= 3)) { problems.push(from + ": pondere invalidă la " + d + "/" + m); return; }
  const key = m + "-" + d;
  const list = out[key] = out[key] || [];
  if(list.some(e => String(e.y) === String(y) && e.t === t)) { problems.push(from + ": dublură " + key + " " + y); return; }
  list.push({ y: typeof y === "number" ? String(y) : y, t, p });
  total++;
}

for(let m = 1; m <= 12; m++){
  const f = String(m).padStart(2, "0") + ".json";
  const rows = JSON.parse(fs.readFileSync(path.join(SRC, f), "utf8"));
  rows.forEach(r => add(m, r[0], r[1], r[2], r[3], f));
}
JSON.parse(fs.readFileSync(path.join(SRC, "neoprotestante.json"), "utf8")).forEach(r => add(r[0], r[1], r[2], r[3], r[4], "neoprotestante.json"));

Object.keys(out).forEach(k => out[k].sort((a, b) => b.p - a.p));
fs.writeFileSync(path.join(__dirname, "..", "data", "istoria-evenimente.json"), JSON.stringify(out));
console.log("Evenimente:", total, "în", Object.keys(out).length, "zile din 366");
if(problems.length) console.log("PROBLEME:\n" + problems.join("\n"));
