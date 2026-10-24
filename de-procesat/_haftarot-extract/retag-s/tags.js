// node tags.js <cap> [de] [pana] : verset | LXX | tag-uri indexate (doar romana)
const d=JSON.parse(require('fs').readFileSync('C:/Users/ivcatali/biblie-app/de-procesat/_haftarot-extract/haftarot-sarbatori.json','utf8'));
const c=d.chapters.find(x=>x.num===+process.argv[2]);let on=!process.argv[3];
for(const v of c.verses){if(process.argv[3]&&v.v===process.argv[3])on=true;if(!on)continue;
const l=(v.textCompare||[]).find(t=>t.greek);console.log('\n['+v.v+'] LXX: '+(l?l.original:'-'));
console.log((v.tokens||[]).filter(t=>t.heb).map((t,i)=>i+':'+t.t).join(' | '));
if(process.argv[4]&&v.v===process.argv[4])break;}
