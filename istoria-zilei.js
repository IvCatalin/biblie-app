// =====================================================================
// „Istoria zilei” — evenimente, nașteri și decese pentru o zi din an.
// Sursa: paginile de zi din Wikipedia în limba română („29 octombrie” etc.),
// conținut sub licența CC BY-SA 4.0. Nimic nu e scris de mână aici: totul
// vine din pagina de pe Wikipedia; „Povestea zilei” e introducerea articolului
// principal la care trimite evenimentul ales.
// Selecția: evenimentele cu legătură creștină/iudaică vin primele (cuvinte-cheie
// de mai jos), apoi cele mai bine documentate (cele cu cele mai multe trimiteri).
// =====================================================================

const fs = require("fs");
const path = require("path");
const MONTHS = ["ianuarie", "februarie", "martie", "aprilie", "mai", "iunie", "iulie", "august", "septembrie", "octombrie", "noiembrie", "decembrie"];
const UA = "DavarAtlas/1.0 (https://biblie-app.onrender.com; ivan_catalin@outlook.com)";
const TTL_MS = 12 * 3600 * 1000;
const cache = new Map();

function strip(s){ return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(); }

// rădăcini de cuvinte (fără diacritice) care indică subiect creștin sau iudaic
const RELIGIOUS = [
  "papa", "papei", "pontif", "biseric", "crestin", "evreu", "evreiesc", "israel", "sinagog", "iudais", "rabin", "biblie", "biblic",
  "ortodox", "catolic", "protestant", "reforma", "luther", "manastir", "sfant", "sfint", "ierusalim", "templu", "sinod", "conciliu",
  "cruciad", "patriarh", "episcop", "mitropolit", "preot", "calugar", "iisus", "hristos", "dumnezeu", "apostol", "evanghel", "teolog",
  "misionar", "cardinal", "sionis", "talmud", "tora", "sabat", "paste", "craciun", "inchizit", "eres", "martir", "canoniz", "beatific", "religi"
];
function religiousScore(text){
  const n = strip(text);
  let score = 0;
  RELIGIOUS.forEach(k => {
    let i = n.indexOf(k);
    while(i !== -1){
      if(i === 0 || !/[a-z0-9]/.test(n[i - 1])){ score++; break; }
      i = n.indexOf(k, i + 1);
    }
  });
  return score;
}

async function getJson(url){
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 12000);
  try {
    const r = await fetch(url, { headers: { "User-Agent": UA, "Accept": "application/json" }, signal: ctrl.signal });
    if(!r.ok) throw new Error("HTTP " + r.status + " la " + url);
    return await r.json();
  } finally { clearTimeout(timer); }
}

// --- curățarea wikitext-ului ---
function cleanWiki(s){
  s = String(s || "");
  s = s.replace(/<ref[^>]*\/>/g, "").replace(/<ref[^>]*>[\s\S]*?<\/ref>/g, "");
  let prev;
  do { prev = s; s = s.replace(/\{\{[^{}]*\}\}/g, ""); } while(s !== prev);
  s = s.replace(/\[\[(?:File|Fișier|Fisier|Imagine|Image|Categorie|Category):[^\]]*\]\]/gi, "");
  s = s.replace(/\[\[([^\]|]*)\|([^\]]*)\]\]/g, "$2").replace(/\[\[([^\]]*)\]\]/g, "$1");
  s = s.replace(/'''?/g, "").replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
  return s;
}
function yearNumber(label){
  const n = parseInt(label, 10);
  if(isNaN(n)) return 0;
  return /î\.?\s?Hr/i.test(label) ? -n : n;
}
function articleLinks(raw){
  const out = [];
  const re = /\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|[^\]]*)?\]\]/g;
  let m;
  while((m = re.exec(raw))){
    const t = m[1].trim();
    if(/^\d{1,4}(\s*î\.?\s?Hr\.?)?$/i.test(t)) continue;
    if(/^(File|Fișier|Fisier|Imagine|Image|Categorie|Category|Wikipedia|Calendar)/i.test(t)) continue;
    if(out.indexOf(t) === -1) out.push(t);
  }
  return out;
}

// împarte o linie „* [[1591]]: text” în an + restul brut
function splitYear(line){
  const m = line.match(/^\*+\s*(?:\{\{0\}\}\s*)?(?:\[\[([^\]|]+)(?:\|[^\]]*)?\]\]|(\d{1,4}(?:\s*î\.?\s?Hr\.?)?))\s*[:–—-]\s*([\s\S]*)$/);
  if(!m) return null;
  const year = (m[1] || m[2]).trim();
  return { year, rest: m[3] };
}

function parseSections(wikitext){
  const sections = {};
  let current = null;
  wikitext.split(/\r?\n/).forEach(line => {
    const h = line.match(/^==\s*([^=].*?)\s*==\s*$/);
    if(h){ current = h[1].trim(); sections[current] = sections[current] || []; return; }
    if(current && /^\*/.test(line)) sections[current].push(line);
  });
  return sections;
}

function parseEvents(lines){
  const out = [];
  lines.forEach(line => {
    const p = splitYear(line);
    if(!p) return;
    const text = cleanWiki(p.rest);
    if(!text) return;
    const links = articleLinks(p.rest);
    out.push({
      year: p.year, yearNum: yearNumber(p.year), text, links,
      religious: religiousScore(text),
      weight: links.length
    });
  });
  return out;
}

function parsePeople(lines, kind){
  const out = [];
  lines.forEach(line => {
    const p = splitYear(line);
    if(!p) return;
    let rest = p.rest;
    // anii de viață dintre paranteze: „(d. 1582)” la nașteri, „(n. 1507)” la decese
    let life = "";
    const lm = rest.match(/\(\s*(d|n)\.\s*(?:\{\{0\}\}\s*)?(?:\[\[)?(\d{1,4}(?:\s*î\.?\s?Hr\.?)?)(?:\]\])?\s*\)/);
    if(lm){ life = lm[1] + ". " + lm[2].trim(); rest = rest.replace(lm[0], ""); }
    let name = "", role = "";
    const nm = rest.match(/^\s*\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/);
    if(nm){
      name = cleanWiki(nm[2] || nm[1]);
      role = cleanWiki(rest.slice(nm[0].length));
    } else {
      const c = cleanWiki(rest);
      const i = c.indexOf(",");
      name = i === -1 ? c : c.slice(0, i);
      role = i === -1 ? "" : c.slice(i + 1);
    }
    role = role.replace(/^[,;:\s]+/, "");
    if(/^\([^)]*\)[\s,;]*\S/.test(role)) role = role.replace(/^\([^)]*\)[\s,;]*/, ""); // „(n. Marie Alexandra…), soția…” → „soția…”
    role = role.replace(/[\s,;]+$/, "");
    if(!name) return;
    out.push({
      year: p.year, yearNum: yearNumber(p.year), name, role, life,
      religious: religiousScore(role + " " + name),
      weight: articleLinks(p.rest).length
    });
  });
  return out;
}

function rank(list){
  return list.slice().sort((a, b) =>
    (b.religious - a.religious) || (b.weight - a.weight) || (a.yearNum - b.yearNum));
}

// introducerea articolului la care trimite evenimentul — „Povestea zilei”
async function fetchStory(links){
  for(const title of links.slice(0, 3)){
    try {
      const url = "https://ro.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=1&explaintext=1&redirects=1&format=json&formatversion=2&titles=" + encodeURIComponent(title);
      const j = await getJson(url);
      const page = j && j.query && j.query.pages && j.query.pages[0];
      const extract = page && page.extract ? String(page.extract).trim() : "";
      if(extract.length < 120 || /poate (?:să )?(?:însemna|se referi)/i.test(extract.slice(0, 200))) continue;
      const paragraphs = [];
      let total = 0;
      extract.split(/\n+/).map(s => s.trim()).filter(Boolean).forEach(par => {
        if(paragraphs.length >= 3 || total > 1300) return;
        paragraphs.push(par);
        total += par.length;
      });
      return {
        paragraphs,
        source: { title: page.title || title, url: "https://ro.wikipedia.org/wiki/" + encodeURIComponent((page.title || title).replace(/ /g, "_")) }
      };
    } catch(e){ /* încercăm următoarea legătură */ }
  }
  return null;
}

// --- date selectate în prealabil (vezi tools/build-istoria-*.js) ---
const DATA_DIR = path.join(__dirname, "data");
function loadJson(file){
  try { return JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), "utf8")); } catch(e){ return {}; }
}
const CURATED_EVENTS = loadJson("istoria-evenimente.json"); // evenimente iudeo-creștine și neoprotestante, traduse în română
const CURATED_PEOPLE = loadJson("istoria-persoane.json");   // nașteri și decese din Wikidata (CC0), cu profesii religioase
const MONTHS_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function stems(text){
  const set = new Set();
  String(text || "").split(/[^\p{L}\p{N}]+/u).forEach(w => {
    if(w.length < 5) return;
    set.add(strip(w).replace(/[^a-z0-9]/g, "").slice(0, 6));
  });
  return set;
}
function sameEvent(a, b){
  if(String(a.year) !== String(b.year)) return false;
  const sa = stems(a.text), sb = stems(b.text);
  for(const s of sa) if(sb.has(s)) return true;
  return false;
}
function nameKey(n){ return strip(String(n || "")).replace(/[^a-z0-9]/g, ""); }

async function build(month, day){
  const pageTitle = day + " " + MONTHS[month - 1];
  const key = month + "-" + day;
  const url = "https://ro.wikipedia.org/w/api.php?action=parse&prop=wikitext&format=json&formatversion=2&page=" + encodeURIComponent(pageTitle.replace(/ /g, "_"));
  let sections = {};
  try {
    const j = await getJson(url);
    const wikitext = j && j.parse && j.parse.wikitext;
    if(wikitext) sections = parseSections(wikitext);
  } catch(err){
    // fără Wikipedia în română mergem doar pe datele selectate; dacă nici acelea nu există, eroarea se vede mai jos
    if(!CURATED_EVENTS[key] && !CURATED_PEOPLE[key]) throw err;
  }
  const pick = names => { for(const n of names) if(sections[n]) return sections[n]; return []; };

  // evenimente: întâi cele selectate (iudeo-creștine, neoprotestante), apoi cele din Wikipedia română
  const curated = (CURATED_EVENTS[key] || []).map(e => ({
    year: e.y, yearNum: yearNumber(e.y), text: e.t, links: [], religious: 1, score: 1000 + e.p * 100, curated: true
  }));
  const wiki = parseEvents(pick(["Evenimente"])).map(e => Object.assign(e, { score: e.religious * 20 + Math.min(e.weight, 10) }));
  const all = curated.slice();
  wiki.forEach(w => { if(!curated.some(c => sameEvent(c, w))) all.push(w); });
  all.sort((a, b) => (b.score - a.score) || (a.yearNum - b.yearNum));

  const TOP = 10; // doar cele mai importante: evenimentul zilei + 9, câte 10 nașteri și decese
  let main = null;
  const events = all.slice(0, TOP);
  if(events.length){
    const e = events.shift();
    const story = e.links && e.links.length ? await fetchStory(e.links) : null;
    main = { year: e.year, text: e.text, category: e.religious > 0 ? "Religie" : "Istorie", story };
  }

  // persoane: întâi cele din Wikidata (profesii religioase, după notorietate), apoi completare din Wikipedia română
  function people(kind){
    const fromData = ((CURATED_PEOPLE[key] || {})[kind] || []).map(p => ({ year: String(p.y), name: p.n, role: p.r || "", life: p.l || "" }));
    const out = fromData.slice(0, TOP);
    if(out.length < TOP){
      const seen = new Set(out.map(p => nameKey(p.name)));
      const wikiList = rank(parsePeople(pick(kind === "births" ? ["Nașteri", "Nasteri"] : ["Decese"]), kind));
      for(const p of wikiList){
        if(out.length >= TOP) break;
        if(seen.has(nameKey(p.name))) continue;
        seen.add(nameKey(p.name));
        out.push({ year: p.year, name: p.name, role: p.role, life: p.life });
      }
    }
    return out;
  }

  const sources = [{
    name: "Wikipedia în limba română",
    license: "CC BY-SA 4.0",
    url: "https://ro.wikipedia.org/wiki/" + encodeURIComponent(pageTitle.replace(/ /g, "_")),
    note: "evenimente, nașteri și decese, introducerile articolelor"
  }];
  if(curated.length){
    sources.push({
      name: "Wikipedia în limba engleză",
      license: "CC BY-SA 4.0",
      url: "https://en.wikipedia.org/wiki/" + MONTHS_EN[month - 1] + "_" + day,
      note: "evenimente din istoria Bisericii și a poporului evreu, alese și traduse în română; datele neoprotestante au fost verificate pe surse separate (organizații și arhive ale confesiunilor)"
    });
  }
  if(CURATED_PEOPLE[key]){
    sources.push({
      name: "Wikidata",
      license: "CC0 (domeniu public)",
      url: "https://www.wikidata.org",
      note: "nașteri și comemorări ale unor persoane cu profesii religioase"
    });
  }
  return {
    month, day,
    label: pageTitle,
    sources,
    main,
    events: events.map(e => ({ year: e.year, text: e.text })),
    births: people("births"),
    deaths: people("deaths")
  };
}

async function getDay(month, day){
  const key = month + "-" + day;
  const hit = cache.get(key);
  if(hit && Date.now() - hit.ts < TTL_MS) return hit.data;
  const data = await build(month, day);
  cache.set(key, { ts: Date.now(), data });
  return data;
}

module.exports = { getDay, _test: { cleanWiki, parseEvents, parsePeople, religiousScore } };
