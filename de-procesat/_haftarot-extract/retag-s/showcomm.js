const fs=require('fs');const cn=+process.argv[2],authA=process.argv[3],cf=process.argv[4],wf=process.argv[5]||__dirname+'/../haftarot-sarbatori.json';
const S=JSON.parse(fs.readFileSync(wf,'utf8')).chapters.find(c=>c.num===cn);const j=JSON.parse(fs.readFileSync(cf,'utf8'));
const map={'Rashi':'Rashi','Radak':'Radak','Metzudat_David':'Metzudat David','Metzudat_Zion':'Metzudat Țion','Ralbag':'Ralbag','Ibn_Ezra':'Ibn Ezra'};
for(const a of authA.split(',')){console.log('######',a);
for(const v of S.verses){const have=v.commentaries.map(c=>c.author.split(' (')[0]);const s=(j[v.v]||{})[a];if(!s||have.includes(map[a]))continue;
const txt=(a==='Rashi'&&s.en.length?s.en:s.he).join(' ');console.log('['+v.v+'] '+txt)}}
