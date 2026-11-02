// Filtrează listele de persoane (data/istoria-persoane*.json) după datele din Wikidata (CC0):
// - scoate clericii catolici/ortodocși, membrii ordinelor religioase, papi, cardinali;
// - scoate persoanele din alte religii;
// - scoate politicienii, militarii, revoluționarii, actorii, sportivii și pe cei cu rol de conducător de stat sau de secte;
// - scoate numele din lista de excludere (dictatori, conducători de secte, televangheliști cu scandaluri).
// Fiecare intrare trebuie să aibă identificatorul Wikidata în câmpul „i” (vezi build-istoria-persoane.js și build-istoria-laici.js).
//   node tools/filter-persoane.js
const fs = require("fs");
const path = require("path");
const UA = "DavarAtlas/1.0 (https://biblie-app.onrender.com; ivan_catalin@outlook.com)";
const DIR = path.join(__dirname, "..", "data");
const FILES = ["istoria-persoane.json", "istoria-persoane-extra.json", "istoria-persoane-laici.json"];

// ocupații excluse oricui (politică, armată, spectacol, sport, infracțiuni)
const SKIP_OCC = new Set(["Q82955", "Q372436", "Q47064", "Q189290", "Q3242115", "Q48352", "Q33999", "Q10800557", "Q10798782", "Q2259451", "Q177220", "Q2066131", "Q937857", "Q3665646", "Q2159907", "Q16533", "Q1930187"]);
// ocupații de cler catolic/ortodox, monahism, papalitate
const CLERGY_OCC = new Set(["Q19546", "Q7229148", "Q1426821", "Q250867", "Q733786", "Q3860388", "Q6900599", "Q9056856", "Q1529540"]);
// religii excluse pentru persoanele religioase: catolici, ortodocși, islam, budism, hinduism, mormoni, martorii lui Iehova etc.
const BAD_REL = new Set(["Q1841", "Q9592", "Q35032", "Q432", "Q748", "Q9089", "Q9232", "Q9316", "Q9598", "Q812767", "Q9585", "Q42504", "Q35269", "Q37068", "Q35127"]);
const BAD_NAME = /(Hitler|Stalin|Mussolini|Goebbels|Himmler|Göring|Goering|Heydrich|Eichmann|Mengele|Mao Zedong|Pol Pot|Ceau[șs]escu|Lenin\b|Lenin,|Franco\b|Francisco Franco|Jim Jones|Koresh|Charles Taze|Joseph Smith|Brigham Young|Mary Baker|Hubbard|Sun Myung|Haggard|Jim Bakker|Jimmy Swaggart|Benny Hinn|Zacharias|Falwell|Pat Robertson|Fred Phelps|Herbert W\. Armstrong|Branham|Marjoe|Khomeini|Khamenei|Bin Laden|Saddam|Man Haron Monis|Trotsk|Dzerjinski|Beria|Kim Il|Kim Jong|Ho Chi|Castro|Mugabe|Idi Amin|Napoleon|T. ?B. Joshua|Lee Man-Hee|Blahyi|Catherine Th[ée]ot|Paula White|Cori Bush|Kaahumanu|Nicolae al Japoniei|Ilminsky|Saint George of Drama|Pallavicini|Abd al )/i;

async function sparql(q){
  for(let i = 0; i < 6; i++){
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 110000);
      const r = await fetch("https://query.wikidata.org/sparql?format=json&query=" + encodeURIComponent(q), { headers: { "User-Agent": UA, "Accept": "application/sparql-results+json" }, signal: ctrl.signal });
      clearTimeout(t);
      if(r.ok) return (await r.json()).results.bindings;
      console.error("  HTTP", r.status);
    } catch(e){ console.error("  eroare", e.message); }
    await new Promise(r => setTimeout(r, 12000));
  }
  throw new Error("interogare eșuată");
}
function infoQuery(ids){
  return "SELECT ?p (GROUP_CONCAT(DISTINCT STRAFTER(STR(?occ),\"entity/\"); separator=\",\") AS ?occs) " +
    "(GROUP_CONCAT(DISTINCT STRAFTER(STR(?rel),\"entity/\"); separator=\",\") AS ?rels) " +
    "(COUNT(DISTINCT ?dd) AS ?ndead) (COUNT(DISTINCT ?ord) AS ?nord) (COUNT(DISTINCT ?pos) AS ?npos) WHERE { VALUES ?p { " + ids.map(i => "wd:" + i).join(" ") + " } " +
    "OPTIONAL { ?p wdt:P106 ?occ } OPTIONAL { ?p wdt:P570 ?dd } OPTIONAL { ?p wdt:P140 ?rel } OPTIONAL { ?p wdt:P611 ?ord } " +
    "OPTIONAL { ?p wdt:P39 ?pos . ?pos rdfs:label ?pl . FILTER(LANG(?pl) = \"en\" && REGEX(?pl, \"Catholic|cardinal|Pope|Jesuit|Orthodox|Metropolitan|Patriarch|abbot|Abbess|prior\", \"i\")) } } GROUP BY ?p";
}

(async () => {
  const data = {};
  const ids = new Set();
  FILES.forEach(f => {
    data[f] = JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8"));
    Object.keys(data[f]).forEach(k => ["births", "deaths"].forEach(kind => (data[f][k][kind] || []).forEach(p => { if(p.i) ids.add(p.i); })));
  });
  const idList = Array.from(ids);
  console.log("identificatori de verificat:", idList.length);
  const info = {};
  for(let i = 0; i < idList.length; i += 100){
    const rows = await sparql(infoQuery(idList.slice(i, i + 100)));
    rows.forEach(r => {
      const id = r.p.value.replace("http://www.wikidata.org/entity/", "");
      const v = k => (r[k] && r[k].value) || "";
      info[id] = { occs: v("occs").split(",").filter(Boolean), rels: v("rels").split(",").filter(Boolean), nord: parseInt(v("nord") || "0", 10), ndead: parseInt(v("ndead") || "0", 10), npos: parseInt(v("npos") || "0", 10) };
    });
    process.stdout.write((Math.min(i + 100, idList.length)) + "/" + idList.length + " ");
  }
  console.log();
  const removed = {};
  const PROT = new Set(["Q75809", "Q101849", "Q178169", "Q23540", "Q6423963", "Q93191", "Q483978", "Q104319", "Q685812", "Q494890", "Q194253", "Q33203", "Q165580", "Q110223", "Q159318", "Q193664", "Q170208", "Q216952"]);
  const why = (p, f, kind) => {
    if(BAD_NAME.test(p.n)) return "nume";
    const inf = info[p.i];
    if(!inf) return null;
    if(kind === "births" && inf.ndead === 0 && p.y > 1900) return "în viață (fără dată a morții)";
    if(f === "istoria-persoane-laici.json"){
      if(inf.occs.some(o => SKIP_OCC.has(o))) return "ocupație (politică/armată/spectacol/sport)";
      if(inf.occs.some(o => CLERGY_OCC.has(o))) return "cler catolic/ortodox/monahism";
      if(inf.nord > 0) return "membru al unui ordin religios";
      if(inf.npos > 0) return "funcție catolică/ortodoxă";
      return null;
    }
    // liste religioase: cine are o religie protestantă/neoprotestantă declarată se păstrează (inclusiv foști călugări, ca Bucer sau Katharina von Bora)
    if(inf.rels.some(r => PROT.has(r))) return null;
    if(inf.rels.some(r => BAD_REL.has(r))) return "religie (catolic/ortodox/alta)";
    if(inf.occs.some(o => CLERGY_OCC.has(o))) return "cler catolic/ortodox/monahism";
    if(inf.nord > 0) return "membru al unui ordin religios";
    if(inf.npos > 0) return "funcție catolică/ortodoxă";
    return null;
  };
  let keptTotal = 0, removedTotal = 0, noId = 0;
  FILES.forEach(f => {
    Object.keys(data[f]).forEach(k => ["births", "deaths"].forEach(kind => {
      if(!data[f][k][kind]) return;
      data[f][k][kind] = data[f][k][kind].filter(p => {
        if(!p.i) noId++;
        const w = why(p, f, kind);
        if(w){ removedTotal++; (removed[w] = removed[w] || []).push(p.n + " (" + p.y + ")"); return false; }
        keptTotal++;
        return true;
      });
    }));
    fs.writeFileSync(path.join(DIR, f), JSON.stringify(data[f]));
  });
  console.log("păstrate:", keptTotal, "| scoase:", removedTotal, "| fără identificator:", noId);
  Object.keys(removed).forEach(w => console.log("-", w, removed[w].length, ":", removed[w].slice(0, 25).join("; ")));
})();
