const fs=require('fs');const X=require('./comm-miss-ro.js');
const base='C:/Users/ivcatali/biblie-app/de-procesat/_haftarot-extract/';
const MAP={
 'Jeremiah.2.1':[['w',14,'2:1'],['w',46,'2:1']],'Ezekiel.29.8':[['w',15,'29:8']],'Judges.4.23':[['w',17,'4:23']],'I_Kings.6.13':[['w',20,'6:13']],
 'I_Kings.18.6':[['w',22,'18:6']],'I_Kings.18.8':[['w',22,'18:8']],'I_Kings.18.11':[['w',22,'18:11']],'I_Kings.18.13':[['w',22,'18:13']],'I_Kings.18.15':[['w',22,'18:15']],'I_Kings.18.16':[['w',22,'18:16']],
 'I_Kings.7.43':[['w',24,'7:43'],['s',4,'7:43']],'I_Kings.7.44':[['w',24,'7:44'],['s',4,'7:44']],
 'I_Kings.8.17':[['w',25,'8:17'],['s',24,'8:17']],'I_Kings.8.20':[['w',25,'8:20'],['s',24,'8:20']],
 'I_Kings.8.55':[['s',26,'8:55']],'I_Kings.8.62':[['s',26,'8:62']],
 'II_Kings.4.44':[['w',30,'4:44']],'II_Kings.7.8':[['w',31,'7:8']],'II_Kings.7.16':[['w',31,'7:16']],
 'Ezekiel.22.1':[['w',33,'22:1']],'Ezekiel.20.2':[['w',34,'20:2']],'Jeremiah.32.13':[['w',36,'32:13']],'Jeremiah.32.26':[['w',36,'32:26']],
 'Joshua.2.13':[['w',41,'2:13']],'Joshua.2.22':[['w',41,'2:22']],'Judges.11.14':[['w',43,'11:14']],'Judges.11.32':[['w',43,'11:32']],'Jeremiah.2.4':[['w',47,'2:4']],
 'II_Kings.12.1':[['s',5,'12:1']],'II_Kings.12.15':[['s',5,'12:15']],'I_Samuel.15.10':[['s',6,'15:10']],'I_Samuel.15.31':[['s',6,'15:31']],
 'Ezekiel.36.16':[['s',7,'36:16']],'Joshua.6.27':[['s',10,'6:27']],'II_Kings.23.1':[['s',11,'23:1']],'II_Kings.23.21':[['s',11,'23:21']],'II_Kings.23.23':[['s',11,'23:23']],
 'Ezekiel.37.4':[['s',12,'37:4']],'I_Samuel.1.2':[['s',19,'1:2']],'Joshua.1.12':[['s',27,'1:12']],'Joshua.1.16':[['s',27,'1:16']]};
const files={w:base+'haftarot-ciclu-saptamanal.json',s:base+'haftarot-sarbatori.json'};
const data={w:JSON.parse(fs.readFileSync(files.w,'utf8')),s:JSON.parse(fs.readFileSync(files.s,'utf8'))};
const order=[X.T,X.R,X.A,X.M];let added=0,errs=[];const per={};
for(const [ref,targets] of Object.entries(MAP)){const sp=X.ro[ref];if(!sp){errs.push('lipsă spec '+ref);continue;}
 for(const [m,n,v] of targets){const ch=data[m].chapters.find(c=>c.num===n);const vv=ch&&ch.verses.find(x=>x.v===v);if(!vv){errs.push(`verset inexistent ${m}${n} ${v}`);continue;}
  vv.commentaries=vv.commentaries||[];
  if(vv.commentaries.length){errs.push(`${m}${n} ${v}: are deja comentarii`);continue;}
  for(const a of order){if(sp[a]){if(sp[a].length<20){errs.push(`${ref} ${a} prea scurt`);continue;}vv.commentaries.push({author:a,text:sp[a]});added++;per[m+n]=(per[m+n]||0)+1;}}
 }}
console.log('adăugate',added,JSON.stringify(per));if(errs.length){console.log('ERORI\n'+errs.join('\n'));if(!process.argv.includes('--force'))process.exit(1);}
if(process.argv.includes('--scrie')){for(const m of ['w','s']){fs.copyFileSync(files[m],files[m]+'.bak-miss');fs.writeFileSync(files[m],JSON.stringify(data[m],null,1));}console.log('scris');}
