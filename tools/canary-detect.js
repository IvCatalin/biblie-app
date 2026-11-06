// Verifică dacă un text conține semnul invizibil Davar (vezi tools/canary.js) și, dacă da, care lucrare e.
// Folosire:  node tools/canary-detect.js fisier.txt      (sau)   echo "text copiat" | node tools/canary-detect.js
// Cu --lista: arată codul fiecărei lucrări (slug -> cod) ca să poți lega un cod găsit de lucrare.
const fs = require("fs");
const path = require("path");
const { crc8, SIGNATURE } = require("./canary.js");
const START = "⁠", Z0 = "​", Z1 = "‌";
function codes(){ const m = {}; const L = fs.readFileSync(path.join(__dirname, "..", "public", "library-data.js"), "utf8"); (L.match(/"slug":"[^"]+"/g) || []).forEach(s => { const slug = s.slice(8, -1); m[crc8(slug)] = (m[crc8(slug)] || []).concat(slug); }); return m; }
if(process.argv.includes("--lista")){ const m = codes(); Object.keys(m).sort((a, b) => a - b).forEach(k => console.log("cod " + k + ": " + [...new Set(m[k])].slice(0, 6).join(", "))); process.exit(0); }
const arg = process.argv.slice(2).find(a => !a.startsWith("--"));
const text = arg ? fs.readFileSync(arg, "utf8") : fs.readFileSync(0, "utf8");
const re = new RegExp(START + "([" + Z0 + Z1 + "]{24})", "g");
let m, found = 0; const m2 = codes();
while((m = re.exec(text))){
  const bits = m[1].split("").map(c => c === Z1 ? "1" : "0").join("");
  const v = parseInt(bits, 2), sig = v >> 8, code = v & 0xFF;
  if(sig !== SIGNATURE) continue;
  found++;
  console.log("semn Davar găsit la poziția " + m.index + ", cod lucrare " + code + (m2[code] ? " (posibil: " + [...new Set(m2[code])].slice(0, 5).join(", ") + ")" : ""));
}
console.log(found ? "TOTAL: " + found + " semne — textul provine din Davar." : "Nu s-a găsit niciun semn Davar.");
