// node import-weekly.js [--scrie] — copiază tokens/textCompare/refs/commentaries din ciclul săptămânal pentru versetele Sărbători cu același osis, același text Rosen și aceeași ebraică
const fs=require('fs'),path=require('path');
const WRITE=process.argv.includes('--scrie');
const S=JSON.parse(fs.readFileSync(path.join(__dirname,'../haftarot-sarbatori.json'),'utf8'));
const W=JSON.parse(fs.readFileSync(path.join(__dirname,'../haftarot-ciclu-saptamanal.json'),'utf8'));
const MS=JSON.parse(fs.readFileSync(path.join(__dirname,'../../_sarbatori_extract/oshb-map-sarbatori.json'),'utf8'));
const MW=JSON.parse(fs.readFileSync(path.join(__dirname,'../../_haftarot-deuteronom-extract/oshb-map.json'),'utf8'));
const idx={};for(const c of W.chapters)for(const v of c.verses){const m=MW[c.num+'|'+v.v];if(m)(idx[m.osis]=idx[m.osis]||[]).push({c:c.num,v});}
const res={};
for(const c of S.chapters){if(process.env.ONLY&&+process.env.ONLY!==c.num)continue;let n=0,tot=c.verses.length,pending=[];
  for(const v of c.verses){const m=MS[c.num+'|'+v.v];const cand=m&&(idx[m.osis]||[]).filter(x=>x.v.t===v.t&&x.v.heb===v.heb&&(x.v.tokens||[]).some(t=>t.greek||t.diff_ro));
    if(cand&&cand.length){const x=cand[0].v;n++;pending.push(v.v+'←'+cand[0].c);
      if(WRITE){v.tokens=JSON.parse(JSON.stringify(x.tokens));v.textCompare=JSON.parse(JSON.stringify(x.textCompare));v.refs=JSON.parse(JSON.stringify(x.refs));v.commentaries=JSON.parse(JSON.stringify(x.commentaries));}}}
  console.log('S'+c.num,n+'/'+tot,[...new Set(pending.map(p=>p.split('←')[1]))].join(','));}
if(WRITE)fs.writeFileSync(path.join(__dirname,'../haftarot-sarbatori.json'),JSON.stringify(S,null,1));
