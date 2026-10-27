const fs=require("fs");
const raw=require("./units.json");const ex=JSON.parse(fs.readFileSync(__dirname+"/excl.json","utf8"));
module.exports=raw.map(c=>({ch:c.ch,rom:c.rom,parts:c.parts.filter((p,i)=>!(ex[c.ch]||[]).includes(i+1)),orig:c.parts.length}));
