// Înlocuiri de cuvinte nerecunoscute de DOOM3 cu forme recunoscute, de același sens. node tools/doom3-replace.js [--write]
const fs = require('fs');
const P = [
  ['vietățile mișunătoare', 'vietățile mișcătoare'], ['vietăți mișunătoare', 'vietăți mișcătoare'], ['vietăților mișunătoare', 'vietăților mișcătoare'],
  ['puterile spirituale și netrupești', 'puterile spirituale și fără trup'],
  ['Ce rod mănâncă panterul?', 'Ce rod mănâncă pantera?'],
  ['coveșnică Ziditorului', 'veșnică, ca Ziditorul'],
  ['au apărut prin subînțelegere', 'au apărut în chip tacit'],
  ['o autocondamnare', 'o osândire de sine'],
  ['propriii lor condamnatori', 'propriii lor judecători'],
  ['semnul deosebitor al rătăcirii', 'semnul distinctiv al rătăcirii'],
  ['teologia mariologică', 'teologia despre Maria'],
  ['înțelepciune presimțitoare', 'înțelepciune care presimte'],
  ['numit tradițional Protoevanghelia', 'numit tradițional Prima Evanghelie'],
  ['(protoevanghelia)', '(prima Evanghelie)'],
  ['șorțuri, încingători', 'șorțuri, brâie'],
  ['niciuna confirmabilă direct din text', 'niciuna care să poată fi confirmată direct din text'],
  ['din grășimile lor', 'din grăsimile lor'],
  ['primită sau neprimită de Dumnezeu', 'primită sau respinsă de Dumnezeu'],
  ['luate în seamă sau neluate', 'luate în seamă sau nu'],
  ['neluând în seamă și neînțelegând', 'fără să ia în seamă și fără să înțeleagă'],
  ['perioade nespecificate', 'perioade nedeterminate'],
  ['inimi neumilite', 'inimi mândre'],
  ['nu-l face nevătămabil', 'nu-l face de neatins'],
  ['și nezdruncinându-i autoritatea', 'fără a-i zdruncina autoritatea'],
  ['mele neîndurând însăși lumina', 'mele neputând îndura însăși lumina'],
  ['m-a vânătăit', 'm-a umplut de vânătăi'],
  ['idee necorporală', 'idee fără trup'],
  ['un chip prefigurator', 'un chip care vestea dinainte'],
  ['oameni neevlavioși', 'oameni lipsiți de evlavie'],
  ['recomandând și întărind', 'arătând și întărind'],
  ['dovadă bineprimită', 'dovadă bine venită'],
  ['ci neexperienței', 'ci lipsei de experiență'],
  ['ca preînchipuire a Mântuitorului', 'ca semn dinainte al Mântuitorului'],
  ['o preînchipuire a lui Hristos', 'un chip dinainte al lui Hristos'],
  ['mulțimea nenumărabilă', 'mulțimea fără număr'],
  ['aduc nepace', 'aduc neînțelegeri'],
  ['a dispreți', 'a disprețui'],
  ['necitată pe nume', 'fără să fie numită'],
  ['durere la tratativă', 'durere la înțelegere'],
  ['unei matriarhe', 'unei strămoașe'], ['celelalte matriarhe', 'celelalte strămoașe'],
  ['„rupsă” proaspăt', '„ruptă” proaspăt'], ['frunza „rupsă”', 'frunza „ruptă”'],
  ['se-nvoiește la tratative', 'se predă la tratative'],
  ['o junică, o capră', 'o vițică, o capră'], ['„ia-Mi o junică”', '„ia-Mi o vițică”'], ['„junică, vițică”', '„vițică”'], ['junică, vițică', 'vițică'],
  ['(junică, capră, berbec)', '(vițică, capră, berbec)'], ['a luat o junică', 'a luat o vițică'],
  ['rubin sau carbuncul', 'rubin'],
  ['„tamarisc”', '„tamariscă”'], ['didrahmă, monedă', 'dublă drahmă, monedă'], ['— didrahmă (la', '— dublă drahmă (la'], ['„didrahme”', '„drahme duble”'],
  ['nedospit, azim (la', 'nedospit, azimă (la'],
  ['măgar sălbatic, onagru, animal', 'măgar sălbatic, animal'],
  ['filisten — locuitor', 'filistean — locuitor'],
  ['Cuvântul „ebreu” vine', 'Cuvântul „evreu” vine'], ['cuvântul „ebreu” (Ivri)', 'cuvântul „evreu” (Ivri)'], ['cuvântul „ebreu”.', 'cuvântul „evreu”.'], ['Ivri, „ebreu”', 'Ivri, „evreu”'],
  ['adică saracenii rătăcitori', 'adică arabii rătăcitori'],
  ['că setiții refuzau', 'că urmașii lui Set refuzau'], ['setiții au fost numiți', 'urmașii lui Set au fost numiți'],
  ['gura lui Marcion și a maniheilor', 'gura lui Marcion și a adepților lui Mani'],
  ['Faustus maniheul', 'Faustus, adeptul lui Mani'],
  ['cum vor marcioniții', 'cum vor adepții lui Marcion'],
  ['treispezecelea', 'treisprezecelea'], ['căpetetenia', 'căpetenia'],
  ['(20,24 inci)', '(20,24 de țoli)']
];
const W = process.argv.includes('--write'); const tot = {};
const files = [];
for (let N = 1; N <= 23; N++) files.push('public/genesis-' + N + '.js');
files.push('public/library-data.js', 'public/tanakh/tanakh-genesis-ramban.js');
for (const f of files) {
  let s = fs.readFileSync(f, 'utf8'), ch = 0;
  for (const [a, b] of P) { const n = s.split(a).length - 1; if (n) { s = s.split(a).join(b); tot[a] = (tot[a] || 0) + n; ch += n; } }
  if (W && ch) fs.writeFileSync(f, s, 'utf8');
}
for (const [a] of P) if (!tot[a]) console.log('fără potrivire:', a);
console.log('înlocuiri:', Object.values(tot).reduce((x, y) => x + y, 0));
