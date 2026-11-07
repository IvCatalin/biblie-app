// Arată, pentru etichetele marcate de audit-full, versetul LXX/MT și tokenii. node tools/show-flagged.js N
const fs=require('fs'),{execSync}=require('child_process');const N=+process.argv[2];
const out=execSync('node tools/audit-full.js '+N,{encoding:'utf8',maxBuffer:1e8});
const want={};for(const l of out.split('\n')){const m=l.match(/^\s+(\d+):(\d+) \[etichetă-(greacă|ebraică)\] (.+?) → /);if(m){(want[m[2]]=want[m[2]]||new Set()).add(m[4])}}
const D=new Function('window',fs.readFileSync('public/genesis-'+N+'.js','utf8')+';return window;')({}).CHAPTER_DATA;
for(const v of Object.keys(want)){const x=D.find(d=>d.num==+v);console.log('\n#'+v+' LXX: '+x.textCompare[1].original+'\n   MT: '+x.textCompare[0].original);for(const t of x.tokens)if(t.heb&&want[v].has(t.w))console.log('   '+t.w+' | '+t.heb+' | '+t.greek)}
