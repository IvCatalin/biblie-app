// node mkbank.js NN  (din retag/): creează bank-cNNr.js cu intrări refolosite și listează cheile noi
const fs=require('fs'),cp=require('child_process');
const n=process.argv[2];const p=String(n).padStart(2,'0');
fs.writeFileSync(`bank-c${p}.js`,`module.exports = Object.assign({}, require('./bank-c${p}r.js'), require('./bank-c${p}x.js'));\n`);
if(!fs.existsSync(`bank-c${p}x.js`))fs.writeFileSync(`bank-c${p}x.js`,'module.exports = {};\n');
fs.writeFileSync(`bank-c${p}r.js`,'module.exports = {};\n');
let out='';try{out=cp.execSync(`node retag.js ${n}`,{encoding:'utf8',stdio:['pipe','pipe','pipe']})}catch(e){out=(e.stdout||'')+(e.stderr||'')}
const m=out.match(/CHEI LIPSĂ DIN BANK: (.*)/);const miss=m?m[1].trim().split(' '):[];
const RE=/^bank-c[0-9]+x?[.]js$/;const files=fs.readdirSync('.').filter(f=>RE.test(f)&&!new RegExp('^bank-c'+p).test(f)).concat(fs.readdirSync('../retag').filter(f=>RE.test(f)).map(f=>'../retag/'+f));
const out2={};const nf=[];
for(const k of miss){let hit=0;for(const f of files){let b;try{b=require(require('path').resolve(f))}catch(e){continue}if(b[k]){out2[k]=b[k];hit=1;break}}if(!hit)nf.push(k)}
fs.writeFileSync(`bank-c${p}r.js`,'// intrări refolosite din capitole anterioare\nmodule.exports = '+JSON.stringify(out2,null,1)+';\n');
console.log('refolosite',Object.keys(out2).length,'noi',nf.length);console.log(nf.join(' '));
