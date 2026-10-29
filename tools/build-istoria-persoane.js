// Generează data/istoria-persoane.json — nașterile și decesele cu legătură iudeo-creștină, pe zile.
// Sursa: Wikidata (licență CC0 / domeniu public) — persoane cu profesii religioase (papă, episcop, pastor,
// rabin, misionar, teolog, predicator, traducător al Bibliei etc.), cu data exactă (precizie la zi).
// Ordinea: notorietatea (numărul de limbi în care există articol), cu un plus pentru zona neoprotestantă
// (baptiști, penticostali, adventiști, frați din Plymouth, evanghelici) și protestantă.
//   node tools/build-istoria-persoane.js
const fs = require("fs");
const path = require("path");

const UA = "DavarAtlas/1.0 (https://biblie-app.onrender.com; ivan_catalin@outlook.com)";

// profesii (Wikidata) → cuvânt românesc. Sunt toate profesii creștine/iudaice sau generale-religioase.
const OCC = {
  Q19546: "papă", Q7229148: "papă",
  Q29182: "episcop", Q866111: "episcop", Q1529540: "episcop",
  Q250867: "preot catolic", Q42603: "preot", Q7242875: "preot", Q55375000: "preot",
  Q133485: "rabin", Q2796156: "rabin",
  Q152002: "pastor", Q352507: "pastor", Q1423891: "pastor", Q114797862: "pastor baptist", Q16961626: "pastor",
  Q219477: "misionar", Q432386: "predicator", Q1381391: "evanghelist", Q30107072: "televangelist",
  Q733786: "călugăr", Q3860388: "călugăr", Q6900599: "călugăr",
  Q1234713: "teolog", Q19829990: "biblist", Q24262584: "traducător al Bibliei", Q13424456: "imnograf",
  Q1426821: "cardinal", Q9056856: "patriarh", Q763779: "reformator protestant",
  Q2259532: "cleric", Q2566598: "cleric", Q3315492: "cleric", Q15995642: "lider religios"
};
// profesii care indică, singure, un context creștin sau iudaic clar
const STRICT = new Set(["Q19546","Q7229148","Q29182","Q866111","Q1529540","Q250867","Q133485","Q2796156","Q152002","Q352507",
  "Q1423891","Q114797862","Q1381391","Q1426821","Q9056856","Q763779","Q30107072","Q24262584","Q19829990"]);

// religie / confesiune (P140) → adjectiv românesc și pondere
const REL = {
  Q93191: ["baptist", 60], Q483978: ["penticostal", 60], Q104319: ["adventist", 60], Q685812: ["din Frații din Plymouth", 60],
  Q494890: ["penticostal", 60], Q194253: ["evanghelic", 50],
  Q33203: ["metodist", 25], Q165580: ["anabaptist", 25], Q110223: ["menonit", 25], Q159318: ["morav", 20], Q193664: ["pietist", 20], Q170208: ["quaker", 20],
  Q75809: ["luteran", 15], Q101849: ["reformat", 15], Q178169: ["prezbiterian", 15], Q6423963: ["anglican", 10], Q23540: ["protestant", 12],
  Q1841: ["catolic", 0], Q9592: ["catolic", 0], Q35032: ["ortodox", 0], Q5043: ["creștin", 0],
  Q9268: ["evreu", 0], Q80970: ["ortodox evreu", 0], Q1133485: ["reformat evreu", 0], Q205644: ["conservator evreu", 0], Q171201: ["hasidic", 0],
  Q216952: ["evreu mesianic", 20], Q35269: ["", 0], Q42504: ["", 0]
};
const JC = new Set(Object.keys(REL));
const OTHER_RELIGIONS = ["Q432","Q748","Q9089","Q9232","Q9316","Q9598","Q812767","Q9585"]; // islam, budism, hinduism, jainism, sikhism, taoism, shinto, bahai

function occList(){ return Object.keys(OCC).map(q => "wd:" + q).join(" "); }

async function sparql(q){
  for(let i = 0; i < 3; i++){
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
    await new Promise(r => setTimeout(r, 4000));
  }
  throw new Error("interogare eșuată");
}

// trecerea 1: pe lună, interogare ușoară (fără precizia datei și fără țară, ca să nu depășească timpul limită)
function query(month, kind){
  const main = kind === "births" ? "P569" : "P570";
  return `SELECT ?p ?en ?ro ?dt ?sl
  (GROUP_CONCAT(DISTINCT STRAFTER(STR(?occ),"entity/"); separator=",") AS ?occs)
  (GROUP_CONCAT(DISTINCT STRAFTER(STR(?rel),"entity/"); separator=",") AS ?rels)
WHERE {
  VALUES ?occ { ${occList()} }
  ?p wdt:P106 ?occ ; wdt:${main} ?dt ; wikibase:sitelinks ?sl .
  FILTER(?sl >= 8)
  FILTER(MONTH(?dt) = ${month})
  OPTIONAL { ?p wdt:P140 ?rel }
  OPTIONAL { ?p rdfs:label ?ro FILTER(LANG(?ro)="ro") }
  OPTIONAL { ?p rdfs:label ?en FILTER(LANG(?en)="en") }
}
GROUP BY ?p ?en ?ro ?dt ?sl`;
}

// trecerea 2: pentru finaliști — precizia datei (doar zi exactă) și țara, în limba română
function query2(ids, kind){
  const main = kind === "births" ? "P569" : "P570";
  const other = kind === "births" ? "P570" : "P569";
  return `SELECT ?p ?prec (SAMPLE(?cro) AS ?country) (MAX(YEAR(?od)) AS ?oy) WHERE {
  VALUES ?p { ${ids.map(i => "wd:" + i).join(" ")} }
  OPTIONAL { ?p p:${main}/psv:${main}/wikibase:timePrecision ?prec }
  OPTIONAL { ?p wdt:P27 ?c . ?c rdfs:label ?cro FILTER(LANG(?cro)="ro") }
  OPTIONAL { ?p wdt:${other} ?od }
} GROUP BY ?p ?prec`;
}

function candidates(rows, kind){
  const byDay = {};
  rows.forEach(r => {
    const occs = (r.occs.value || "").split(",").filter(Boolean);
    const rels = (r.rels ? r.rels.value : "").split(",").filter(Boolean);
    if(rels.some(x => OTHER_RELIGIONS.indexOf(x) !== -1)) return; // alte religii
    const strict = occs.some(o => STRICT.has(o));
    const jcRel = rels.some(x => JC.has(x));
    const sl = parseInt(r.sl.value, 10);
    // profesiile generale (preot, călugăr, teolog…) se iau doar cu confesiune creștină/iudaică sau notorietate mare
    if(!strict && !jcRel && sl < 25) return;
    const name = (r.ro && r.ro.value) || (r.en && r.en.value);
    if(!name || /^Q\d+$/.test(name)) return;
    const dt = new Date(r.dt.value);
    const year = dt.getUTCFullYear();
    if(year < 1) return;
    let relAdj = "", bonus = 0;
    rels.forEach(x => { if(REL[x]){ bonus = Math.max(bonus, REL[x][1]); if(!relAdj && REL[x][0]) relAdj = REL[x][0]; } });
    const terms = [];
    occs.forEach(o => { const t = OCC[o]; if(t && terms.indexOf(t) === -1) terms.push(t); });
    const dayKey = (dt.getUTCMonth() + 1) + "-" + dt.getUTCDate();
    (byDay[dayKey] = byDay[dayKey] || []).push({
      id: r.p.value.replace("http://www.wikidata.org/entity/", ""), y: year, n: name, terms, relAdj, sl,
      s: sl + bonus + (strict ? 8 : 0), day1: dt.getUTCDate() === 1
    });
  });
  Object.keys(byDay).forEach(k => {
    const seen = new Set();
    byDay[k] = byDay[k].sort((a, b) => b.s - a.s).filter(p => { const id = p.n + p.y; if(seen.has(id)) return false; seen.add(id); return true; }).slice(0, 30);
  });
  return byDay;
}

(async () => {
  const pool = { births: {}, deaths: {} };
  for(const kind of ["births", "deaths"]){
    for(let m = 1; m <= 12; m++){
      const t0 = Date.now();
      const rows = await sparql(query(m, kind));
      Object.assign(pool[kind], candidates(rows, kind));
      console.log(kind, "luna", m, "-", rows.length, "rânduri,", Math.round((Date.now() - t0) / 1000) + "s");
    }
  }

  // trecerea 2
  const info = { births: {}, deaths: {} };
  for(const kind of ["births", "deaths"]){
    const ids = [];
    Object.keys(pool[kind]).forEach(k => pool[kind][k].forEach(p => { if(ids.indexOf(p.id) === -1) ids.push(p.id); }));
    for(let i = 0; i < ids.length; i += 120){
      const rows = await sparql(query2(ids.slice(i, i + 120), kind));
      rows.forEach(r => {
        const id = r.p.value.replace("http://www.wikidata.org/entity/", "");
        info[kind][id] = { prec: r.prec ? parseInt(r.prec.value, 10) : null, country: r.country ? r.country.value : "", oy: r.oy ? parseInt(r.oy.value, 10) : null };
      });
      process.stdout.write(kind[0] + Math.min(i + 120, ids.length) + "/" + ids.length + " ");
    }
    console.log();
  }

  const out = {};
  for(const kind of ["births", "deaths"]){
    Object.keys(pool[kind]).forEach(k => {
      const list = pool[kind][k].filter(p => {
        const inf = info[kind][p.id] || {};
        // data fără zi exactă (doar an sau lună) apare ca ziua 1 — o acceptăm doar dacă precizia e zi (11)
        return !p.day1 || inf.prec === 11;
      }).slice(0, 15).map(p => {
        const inf = info[kind][p.id] || {};
        let role = p.terms.slice(0, 2).join(", ");
        if(p.relAdj && !new RegExp(p.relAdj.split(" ")[0], "i").test(role)) role += " " + p.relAdj;
        if(inf.country) role += " din " + inf.country;
        const life = inf.oy ? ((kind === "births" ? "d. " : "n. ") + inf.oy) : "";
        return { y: p.y, n: p.n, r: role, l: life };
      });
      if(list.length){ out[k] = out[k] || {}; out[k][kind] = list; }
    });
  }
  const dir = path.join(__dirname, "..", "data");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "istoria-persoane.json"), JSON.stringify(out));
  console.log("Scris data/istoria-persoane.json —", Object.keys(out).length, "zile");
})();
