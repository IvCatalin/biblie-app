// Corectează automat etichetele grecești/ebraice marcate de audit-full când există o potrivire clară în verset (aceeași rădăcină); restul se listează.
// node tools/auto-fix-labels.js N [--write]
const fs=require('fs'),{execSync}=require('child_process');
const N=+process.argv[2],W=process.argv.includes('--write');
const norm=s=>s.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/ς/g,'σ').replace(/[·;.,᾿'’]/g,'');
const cons=s=>s.normalize('NFD').replace(/[֑-ׇ]/g,'').replace(/[־]/g,' ');
const out=execSync('node tools/audit-full.js '+N,{encoding:'utf8',maxBuffer:1e8});
const bad=[];for(const l of out.split('\n')){const m=l.match(/^\s+(\d+):(\d+) \[etichetă-(greacă|ebraică)\] (.+?) → (.+)$/);if(m)bad.push({v:+m[2],kind:m[3],w:m[4],val:m[5]})}
const file='public/genesis-'+N+'.js';const D=new Function('window',fs.readFileSync(file,'utf8')+';return window;')({}).CHAPTER_DATA;
let fixed=0,left=[];
const pref=(a,b)=>{let i=0;while(i<a.length&&i<b.length&&a[i]===b[i])i++;return i};
for(const b of bad){const x=D.find(d=>d.num===b.v);const t=x.tokens.find(t=>t.heb&&t.w===b.w&&(b.kind==='greacă'?t.greek===b.val:t.heb===b.val));if(!t){left.push(b.v+':'+b.w+' (negăsit)');continue}
 if(b.kind==='greacă'){const lx=x.textCompare[1].original.split(/\s+/);const lw=lx.map(norm);const gw=b.val.split(/\s+/).map(norm);
  // caută secvența de cuvinte consecutive din LXX unde fiecare cuvânt are prefix comun >=4 (sau egal) cu cuvântul etichetei
  let best=null;for(let i=0;i+gw.length<=lw.length;i++){let ok=true,sc=0;for(let j=0;j<gw.length;j++){const p=pref(lw[i+j],gw[j]);if(p<Math.min(4,gw[j].length)||(gw[j].length>=4&&p<4)){ok=false;break}sc+=p}if(ok&&(!best||sc>best.sc))best={i,sc}}
  if(best){t.greek=lx.slice(best.i,best.i+gw.length).join(' ').replace(/[·;.,]+$/,'');t.greek_def_ro=null;fixed++}else left.push(b.v+':'+b.w+' → '+b.val+' | LXX: '+x.textCompare[1].original.slice(0,200));
 }else{const mw=cons(x.textCompare[0].original).split(/\s+/);const orig=x.textCompare[0].original.split(/[\s־]+/);const hw=cons(b.val).split(/\s+/);
  let best=null;for(let i=0;i<mw.length;i++){const p=pref(mw[i],hw[0]);if(p>=2&&(!best||p>best.p))best={i,p}}
  if(best&&hw.length===1){t.heb=orig[best.i];fixed++}else left.push(b.v+':'+b.w+' → '+b.val+' | MT: '+x.textCompare[0].original.slice(0,200))}}
console.log(W?'SCRIS':'PROBĂ','corectate automat:',fixed,'| rămase:',left.length);left.forEach(l=>console.log('  '+l));
if(W)fs.writeFileSync(file,'window.CHAPTER_DATA = '+JSON.stringify(D,null,1).replace(/\n/g,'\r\n')+';\r\n','utf8');
