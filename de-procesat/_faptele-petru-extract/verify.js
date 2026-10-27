const fs=require("fs");const u=require("./lib.js");
const engRe=/\b(the|and|which|that|with|his|her|shall|upon|unto|said|thou|thee|hath)\b/i;
let probs=0,files=0,secs=0;
for(const c of u){const f=__dirname+"/ro/"+String(c.ch).padStart(2,"0")+".json";if(!fs.existsSync(f))continue;files++;
 const j=JSON.parse(fs.readFileSync(f,"utf8"));
 if(j.verses.length!==c.parts.length){console.log(f,"unități",j.verses.length,"vs",c.parts.length);probs++}
 j.verses.forEach((v,i)=>{secs++;const en=c.parts[i]||"";const r=v.t.length/Math.max(1,en.length);
  if(r<0.8||r>1.6){console.log(c.rom,"§"+(i+1),"raport",r.toFixed(2));probs++}
  if(/[şţŞŢ]/.test(v.t)){console.log(c.rom,"§"+(i+1),"cedilă");probs++}
  if(engRe.test(v.t)){console.log(c.rom,"§"+(i+1),"engleză?",(v.t.match(engRe)||[])[0]);probs++}
  const nums=(en.match(/\b\d+\b/g)||[]);nums.forEach(n=>{if(!v.t.includes(n)){console.log(c.rom,"§"+(i+1),"număr lipsă",n);probs++}})});}
console.log("fișiere",files,"secțiuni",secs,"probleme",probs);
