// node lex/cnt.js H1254 [Isa] — numără aparițiile unui Strong în OSHB (pe cărți)
const O=require('../oshb');const fs=require('fs');const [s,only]=process.argv.slice(2);const r={};let tot=0;
for(const f of fs.readdirSync(__dirname+'/../oshb')){const b=f.replace('.xml','');if(only&&b!==only)continue;for(const ws of Object.values(O.book(b)))for(const w of ws)if(w.strong===s){r[b]=(r[b]||0)+1;tot++}}
console.log(s,'total',tot,JSON.stringify(Object.entries(r).sort((a,b)=>b[1]-a[1])));
