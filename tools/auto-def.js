// def_ro din lexiconul tradus (sources/lexicon-ro): pentru tokenii fără def_ro sau cu def_ro-ecou. node tools/auto-def.js N [--write]
const fs=require('fs');const N=+process.argv[2],W=process.argv.includes('--write');
const LX={};for(const g of fs.readdirSync('sources/lexicon-ro'))for(const f of fs.readdirSync('sources/lexicon-ro/'+g)){const j=JSON.parse(fs.readFileSync('sources/lexicon-ro/'+g+'/'+f,'utf8'));for(const [k,v] of (Array.isArray(j)?j:Object.entries(j)))LX[k]=LX[k]||v}
const file='public/genesis-'+N+'.js';const D=new Function('window',fs.readFileSync(file,'utf8')+';return window;')({}).CHAPTER_DATA;
const echo=(t)=>!t.def_ro||t.def_ro.replace(/[ .]/g,'').toLowerCase()===t.w.replace(/[ .]/g,'').toLowerCase()||t.def_ro.length<=12;
let n=0,miss=[];
for(const x of D)for(const t of x.tokens.filter(t=>t.heb&&t.strong&&echo(t))){const e=LX[t.strong];if(!e||!e.def_ro){miss.push(x.num+':'+t.w+' '+t.strong);continue}
 let d=e.def_ro.replace(/\s+/g,' ').trim();d=d.charAt(0).toLowerCase()+d.slice(1);if(!/[.!?]$/.test(d))d+='.';t.def_ro=d;n++}
console.log(W?'SCRIS':'PROBĂ','def_ro din lexicon:',n,'| fără intrare:',miss.join('; '));
if(W)fs.writeFileSync(file,'window.CHAPTER_DATA = '+JSON.stringify(D,null,1).replace(/\n/g,'\r\n')+';\r\n','utf8');
