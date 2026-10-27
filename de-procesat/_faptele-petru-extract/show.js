const u=require("./lib.js");
for(const a of process.argv.slice(2)){const c=u.find(x=>String(x.ch)===a);if(!c){console.log("lipsă",a);continue}
 console.log("## "+a+" ("+c.rom+") — "+c.parts.length+" unități");c.parts.forEach((p,i)=>console.log("["+(i+1)+"] "+p+"\n"))}
