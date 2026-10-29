// Descarcă paginile de zi din Wikipedia în engleză („October 29”) și păstrează, pentru fiecare zi,
// evenimentele cu subiect creștin/iudaic ca CANDIDAȚI (nu sunt încă publicate nicăieri). Rezultatul
// se citește și se curăță manual înainte de a deveni date pentru panoul „Istoria zilei”.
//   node tools/fetch-en-days.js <fisier-iesire.json>
const fs = require("fs");

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const UA = "DavarAtlas/1.0 (https://biblie-app.onrender.com; ivan_catalin@outlook.com)";

// cuvinte-cheie: creștin/iudaic general + neoprotestant (baptist, penticostal, adventist, treziri, misiune…)
const CORE = [
  "church","christian","christianity","pope","papal","bishop","archbishop","cardinal","patriarch","catholic","orthodox","protestant",
  "reformation","luther","calvin","zwingli","wesley","methodis","baptist","pentecost","adventis","evangelic","revival","awakening",
  "missionar","mission ","bible","scripture","gospel","testament","monaster","abbey","convent","cathedral","synod","council of","ecumenical",
  "crusade","jew","jewish","judaism","synagogue","rabbi","talmud","torah","zion","israel","jerusalem","temple","holocaust","pogrom",
  "inquisition","heretic","excommunicat","canoniz","beatif","saint","martyr","apostle","jesus","christ","easter","christmas","pentateuch",
  "quaker","mennonite","anabaptist","puritan","pilgrim","huguenot","salvation army","sunday school","ymca","bible society","tract society",
  "hymn","preacher","pastor","clergy","priest","vatican","theolog","creed","schism","anglican","presbyterian","lutheran","congregational",
  "moravian","hussite","waldens","cathar","coptic","armenian church","seventh-day","jehovah","mormon","latter day","christian science",
  "billy graham","spurgeon","moody","whitefield","finney","carey","judson","livingstone","hudson taylor","azusa","scopes"
];
function score(text){
  const t = text.toLowerCase();
  let s = 0;
  CORE.forEach(k => { if(t.indexOf(k) !== -1) s++; });
  return s;
}
function clean(s){
  s = s.replace(/<ref[^>]*\/>/g, "").replace(/<ref[^>]*>[\s\S]*?<\/ref>/g, "");
  let prev;
  do { prev = s; s = s.replace(/\{\{[^{}]*\}\}/g, ""); } while(s !== prev);
  s = s.replace(/\[\[(?:File|Image|Category):[^\]]*\]\]/gi, "");
  s = s.replace(/\[\[([^\]|]*)\|([^\]]*)\]\]/g, "$2").replace(/\[\[([^\]]*)\]\]/g, "$1");
  return s.replace(/'''?/g, "").replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&ndash;/g, "–").replace(/\s+/g, " ").trim();
}

async function getJson(url){
  for(let i = 0; i < 3; i++){
    try {
      const r = await fetch(url, { headers: { "User-Agent": UA } });
      if(r.ok) return await r.json();
    } catch(e){}
    await new Promise(r => setTimeout(r, 1500));
  }
  throw new Error("nu pot citi " + url);
}

(async () => {
  const out = {};
  let total = 0;
  for(let m = 0; m < 12; m++){
    for(let d = 1; d <= DAYS[m]; d++){
      const title = MONTHS[m] + " " + d;
      const j = await getJson("https://en.wikipedia.org/w/api.php?action=parse&prop=wikitext&format=json&formatversion=2&page=" + encodeURIComponent(title.replace(/ /g, "_")));
      const wt = j && j.parse && j.parse.wikitext || "";
      // secțiunea Events (inclusiv sub-secțiunile pe secole)
      const lines = wt.split(/\r?\n/);
      let inEvents = false;
      const items = [];
      lines.forEach(line0 => {
        const line = line0.replace(/&ndash;|&mdash;/g, "–");
        const h = line.match(/^==\s*([^=].*?)\s*==\s*$/);
        if(h){ inEvents = /^Events$/i.test(h[1].trim()); return; }
        if(inEvents && /^\*/.test(line)){
          // „* 1948 – text”  sau  „** 1517 – text” (pe subsecțiuni)
          const m2 = line.match(/^\*+\s*\[?\[?([0-9]{1,4}(?:\s*(?:BC|AD))?)\]?\]?\s*[–—-]\s*(.*)$/);
          if(!m2) return;
          const text = clean(m2[2]);
          if(text.length < 15) return;
          const sc = score(text);
          if(sc > 0) items.push({ y: m2[1].replace(/\s+/g, " "), t: text, s: sc });
        }
      });
      out[(m + 1) + "-" + d] = items;
      total += items.length;
      process.stdout.write(".");
    }
  }
  fs.writeFileSync(process.argv[2], JSON.stringify(out));
  console.log("\ncandidați:", total, "din", Object.keys(out).length, "zile");
})();
