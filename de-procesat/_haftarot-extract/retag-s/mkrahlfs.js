const fs=require('fs'),path=require('path');
const V=JSON.parse(fs.readFileSync('C:/Users/ivcatali/AppData/Local/Temp/claude/rahlfs/verses-all.json','utf8'));
const MAP=JSON.parse(fs.readFileSync(path.join(__dirname,'../../_sarbatori_extract/oshb-map-sarbatori.json'),'utf8'));
const d=JSON.parse(fs.readFileSync(path.join(__dirname,'../haftarot-sarbatori.json'),'utf8'));
const LAB={'1Kgs':'1/3Kgs','2Kgs':'2/4Kgs','1Sam':'1Sam/K','2Sam':'2Sam/K',Josh:'JoshB',Judg:'JudgB'};
const norm=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/ς/g,'σ').replace(/[^α-ω\s]/g,' ').split(/\s+/).filter(Boolean);
const stem=w=>w.slice(0,4);
function sim(a,b){const A=new Set(norm(a).map(stem)),B=new Set(norm(b).map(stem));let x=0;for(const t of A)if(B.has(t))x++;return x/Math.max(1,Math.min(A.size,B.size));}
const out={},bad=[];
for(const c of d.chapters)for(const v of c.verses){
 const mp=MAP[c.num+'|'+v.v];if(!mp){bad.push(c.num+'|'+v.v+' fără osis');continue;}
 const [b,ch,vs]=mp.osis.split('.');const lab=LAB[b]||b;const key=`${lab} ${ch}:${vs}`;
 const e=(v.textCompare||[]).find(t=>t.greek);
 if(V[key]){out[c.num+'|'+v.v]={rk:key,text:V[key]};
   if(e&&sim(e.original,V[key])<0.5)bad.push(c.num+'|'+v.v+' sim '+sim(e.original,V[key]).toFixed(2)+' '+key);}
 else{bad.push(c.num+'|'+v.v+' lipsă '+key);}
}
fs.writeFileSync(path.join(__dirname,'rahlfs-sarb.json'),JSON.stringify(out));
console.log(Object.keys(out).length,'din',d.chapters.reduce((a,c)=>a+c.verses.length,0));console.log(bad.join('\n'));
// NOTĂ: Maleahi 3:22-24 — ordinea din Rahlfs diferă de TM (Ilie 3:22, inimile 3:23, Legea 3:24); S9 (cap. 9) cere remaparea manuală după regenerare:
// 9|3:22 (TM: Legea) = Mal 3:24; 9|3:23 și 9|3:23b (TM: Ilie) = Mal 3:22; 9|3:24 (TM: inimile) = Mal 3:23

// S20 (Ieremia 31:1-19, Rosen = KJV-1): după regenerare, remapare manuală 20|31:N = Jer 38:(N+1) (LXX Ier 38)
