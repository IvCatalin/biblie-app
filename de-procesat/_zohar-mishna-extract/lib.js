const fs=require('fs');
const HP='C:/Users/ivcatali/biblie-app/public/biblie-demo.html';
const BS=String.fromCharCode(92);
function load(){
  const h=fs.readFileSync(HP,'utf8');
  const s=h.indexOf('const LIBRARY = ')+'const LIBRARY = '.length;
  let d=0,i=s,inS=false,esc=false;
  for(;i<h.length;i++){const c=h[i];
    if(inS){ if(esc)esc=false; else if(c===BS)esc=true; else if(c==='"')inS=false; continue;}
    if(c==='"')inS=true; else if(c==='{'||c==='[')d++; else if(c==='}'||c===']'){d--; if(d===0){i++;break;}}
  }
  return {h,s,e:i,lib:JSON.parse(h.slice(s,i))};
}
function save(h,s,e,lib){
  fs.writeFileSync(HP,h.slice(0,s)+JSON.stringify(lib)+h.slice(e));
}
module.exports={load,save,HP};
