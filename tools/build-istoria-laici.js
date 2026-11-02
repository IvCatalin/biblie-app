// Generează data/istoria-persoane-laici.json — nașteri și decese ale unor figuri laice istorice cunoscute
// (regi și împărați, savanți, filozofi, scriitori, compozitori, pictori, exploratori), pe zile.
// Sursa: Wikidata (CC0). Folosit doar ca rezervă, când o zi are prea puține persoane religioase.
// Fără actori, sportivi sau politicieni; numai persoane născute/decedate în anul 1 sau după, cu data exactă (precizie la zi).
//   node tools/build-istoria-laici.js
const fs = require("fs");
const path = require("path");
const os = require("os");

const MIN_SL = parseInt(process.env.MIN_SL || "50", 10);
const UA = "DavarAtlas/1.0 (https://biblie-app.onrender.com; ivan_catalin@outlook.com)";

// profesie (Wikidata) → [masculin, feminin]
const OCC = {
  Q116: ["monarh", "monarhă"], Q36180: ["scriitor", "scriitoare"], Q49757: ["poet", "poetă"], Q6625963: ["romancier", "romancieră"],
  Q214917: ["dramaturg", "dramaturgă"], Q4964182: ["filozof", "filozoafă"], Q36834: ["compozitor", "compozitoare"],
  Q1028181: ["pictor", "pictoriță"], Q1281618: ["sculptor", "sculptoriță"], Q42973: ["arhitect", "arhitectă"],
  Q169470: ["fizician", "fiziciană"], Q170790: ["matematician", "matematiciană"], Q11063: ["astronom", "astronomă"],
  Q593644: ["chimist", "chimistă"], Q864503: ["biolog", "bioloagă"], Q39631: ["medic", "medic"], Q205375: ["inventator", "inventatoare"],
  Q11900058: ["explorator", "exploratoare"], Q201788: ["istoric", "istorică"], Q188094: ["economist", "economistă"],
  Q901: ["savant", "savantă"], Q974144: ["pedagog", "pedagogă"], Q1622272: ["profesor universitar", "profesoară universitară"],
  Q1234713: ["teolog", "teologă"], Q81096: ["inginer", "inginer"], Q2259451: ["muzician", "muziciană"]
};
const SKIP = new Set(["Q33999", "Q10800557", "Q937857", "Q2066131", "Q82955", "Q3665646"]); // actor, actor de film, fotbalist, sportiv, politician, baschetbalist
const MONTH_DAYS = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const CACHE = path.join(os.tmpdir(), "davar-laici-cache");
fs.mkdirSync(CACHE, { recursive: true });

async function sparql(q){
  for(let i = 0; i < 6; i++){
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 110000);
      const r = await fetch("https://query.wikidata.org/sparql?format=json&query=" + encodeURIComponent(q), {
        headers: { "User-Agent": UA, "Accept": "application/sparql-results+json" }, signal: ctrl.signal
      });
      clearTimeout(t);
      if(r.ok) return (await r.json()).results.bindings;
      console.error("  HTTP", r.status);
    } catch(e){ console.error("  eroare", e.message); }
    await new Promise(r => setTimeout(r, 12000));
  }
  throw new Error("interogare eșuată");
}

function query(occ, kind){
  const main = kind === "births" ? "P569" : "P570";
  return `SELECT ?p ?en ?ro ?dt ?sl ?g WHERE {
  ?p wdt:P106 wd:${occ} ; wikibase:sitelinks ?sl ; wdt:${main} ?dt .
  FILTER(?sl >= ${MIN_SL})
  OPTIONAL { ?p wdt:P21 ?g }
  OPTIONAL { ?p rdfs:label ?ro FILTER(LANG(?ro)="ro") }
  OPTIONAL { ?p rdfs:label ?en FILTER(LANG(?en)="en") }
}`;
}

async function rowsFor(occ, kind){
  const f = path.join(CACHE, kind + "-" + occ + "-sl" + MIN_SL + ".json");
  if(fs.existsSync(f)) return JSON.parse(fs.readFileSync(f, "utf8"));
  const rows = await sparql(query(occ, kind));
  fs.writeFileSync(f, JSON.stringify(rows));
  return rows;
}

(async () => {
  const out = {};
  for(const kind of ["births", "deaths"]){
    for(const occ of Object.keys(OCC)){
      const rows = await rowsFor(occ, kind);
      rows.forEach(r => {
        const occs = [occ];
        const name = (r.ro && r.ro.value) || (r.en && r.en.value);
        if(!name || /^Q\d+$/.test(name)) return;
        const dt = new Date(r.dt.value);
        const year = dt.getUTCFullYear();
        if(year < 1) return;
        if(dt.getUTCDate() === 1 && dt.getUTCMonth() === 0) return; // 1 ianuarie = de obicei „doar anul”, fără zi exactă
        if(dt.getUTCDate() === 1) return; // ziua 1 poate fi „doar luna”: o sărim, ca să nu afișăm date nesigure
        let kd = dt;
        if(year < 1582){ // Wikidata exportă în calendar gregorian; datele vechi se știu în calendar iulian
          const shift = Math.floor(year / 100) - Math.floor(year / 400) - 2;
          kd = new Date(dt.getTime() - shift * 86400000);
        }
        const key = (kd.getUTCMonth() + 1) + "-" + kd.getUTCDate();
        const fem = r.g && /Q6581072$/.test(r.g.value);
        const terms = [];
        occs.forEach(o => { if(OCC[o]){ const t = OCC[o][fem ? 1 : 0]; if(terms.indexOf(t) === -1) terms.push(t); } });
        if(!terms.length) return;
        out[key] = out[key] || {};
        (out[key][kind] = out[key][kind] || []).push({ y: year, n: name, r: terms.slice(0, 2).join(", "), s: parseInt(r.sl.value, 10) });
      });
      console.log(kind, occ, "-", rows.length, "rânduri");
    }
  }
  Object.keys(out).forEach(k => ["births", "deaths"].forEach(kind => {
    if(!out[k][kind]) return;
    const seen = new Set();
    out[k][kind] = out[k][kind].sort((a, b) => b.s - a.s).filter(p => { const id = p.n + p.y; if(seen.has(id)) return false; seen.add(id); return true; }).slice(0, 8);
  }));
  fs.writeFileSync(path.join(__dirname, "..", "data", "istoria-persoane-laici.json"), JSON.stringify(out));
  console.log("Scris data/istoria-persoane-laici.json —", Object.keys(out).length, "zile");
})();
