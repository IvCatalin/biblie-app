const fs=require('fs'),path=require('path');
const S=JSON.parse(fs.readFileSync(path.join(__dirname,'../haftarot-sarbatori.json'),'utf8'));
const W=JSON.parse(fs.readFileSync(path.join(__dirname,'../haftarot-ciclu-saptamanal.json'),'utf8'));
const MS=JSON.parse(fs.readFileSync(path.join(__dirname,'../../_sarbatori_extract/oshb-map-sarbatori.json'),'utf8'));
const MW=JSON.parse(fs.readFileSync(path.join(__dirname,'../../_haftarot-deuteronom-extract/oshb-map.json'),'utf8'));
const idx={};for(const c of W.chapters)for(const v of c.verses){const m=MW[c.num+'|'+v.v];if(m)(idx[m.osis]=idx[m.osis]||[]).push({c:c.num,v});}
for(const c of S.chapters){const cnt={};let n=0;for(const v of c.verses){const m=MS[c.num+'|'+v.v];if(!m)continue;const hit=idx[m.osis];if(hit){n++;for(const h of new Set(hit.map(x=>x.c)))cnt[h]=(cnt[h]||0)+(hit.find(x=>x.c===h&&x.v.t===v.t)?1000:1)}}
console.log('S'+c.num,c.ref,c.verses.length,'v; în săptămânal:',n,Object.entries(cnt).map(([k,x])=>'cap'+k+':'+(x%1000)+'/'+Math.floor(x/1000)+'id').join(' '))}
