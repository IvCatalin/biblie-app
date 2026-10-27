// Parsează raw/bNN.htm (New Advent, McGiffert/NPNF) -> en-eus.json
// [{book, ch, title, blocks:[{n|null, kind:'p'|'h', t}]}]
const fs = require("fs");
const dec = s => s.replace(/&nbsp;/g, " ").replace(/&aelig;/g,"æ").replace(/&oelig;/g,"œ").replace(/&uuml;/g,"ü").replace(/&euml;/g,"ë").replace(/&iuml;/g,"ï").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&rsquo;/g, "'").replace(/&lsquo;/g, "'").replace(/&ldquo;|&rdquo;/g, '"').replace(/&mdash;/g, "—").replace(/&ndash;/g, "–").replace(/&hellip;/g, "…").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#(\d+);/g, (m, d) => String.fromCharCode(+d));
const clean = s => dec(s.replace(/<span class="stiki"[^>]*>(.*?)<\/span>/gs, " ($1) ").replace(/<sup[^>]*>.*?<\/sup>/gs, "").replace(/<q>/g, "“").replace(/<\/q>/g, "”").replace(/<[^>]+>/g, "")).replace(/\s*\[[^\]]*\]/g, "").replace(/ northwest of Jerusalem\..*?\}\}-->/s, "").replace(/ vaguest information.*?\}\}-->/s, "").replace(/ simplest explanation is that.*?\}\}-->/s, "").replace(/\s+/g, " ").replace(/\s+([,.;:])/g, "$1").trim();
const out = [];
for (let b = 1; b <= 10; b++) {
  const h = fs.readFileSync(__dirname + "/raw/b" + String(b).padStart(2, "0") + ".htm", "utf8");
  const end = h.indexOf("<div class=\"pub\">");
  const body = h.slice(h.indexOf("<h1>"), end > 0 ? end : h.length);
  const parts = body.split(/(?=<h2)/).slice(1);
  let last = 0;
  for (const part of parts) {
    const m = part.match(/<h2[^>]*>(.*?)<\/h2>/s);
    const head = clean(m[1]);
    const cm = head.match(/^Chapter (\d+)\.\s*(.*)$/s);
    let ch, title;
    if (cm) { ch = +cm[1]; title = cm[2]; last = ch; }
    else if (/^Introduction/i.test(head)) { ch = 0; title = head.replace(/\.$/, ""); }
    else { ch = ++last; title = head.replace(/\.\s*$/, ""); }
    const rest = part.slice(m[0].length);
    const blocks = [];
    const re = /<(p|h3)[^>]*>(.*?)<\/\1>/gs;
    let x;
    while ((x = re.exec(rest))) {
      const t = clean(x[2]);
      if (!t) continue;
      if (x[1] === "h3") { blocks.push({ n: null, kind: "h", t }); continue; }
      const mm = t.match(/^(\d{1,3})\.\s+(.*)$/s);
      blocks.push(mm ? { n: +mm[1], kind: "p", t: mm[2] } : { n: null, kind: "p", t });
    }
    out.push({ book: b, ch, title, blocks });
  }
}
fs.writeFileSync(__dirname + "/en-eus.json", JSON.stringify(out));
let tot = 0, unnum = 0, chars = 0;
const per = {};
for (const c of out) { per[c.book] = (per[c.book] || 0) + 1; for (const k of c.blocks) { tot++; chars += k.t.length; if (k.n == null) unnum++; } }
console.log("capitole per carte", JSON.stringify(per), "blocuri", tot, "nenumerotate", unnum, "caractere", chars);
