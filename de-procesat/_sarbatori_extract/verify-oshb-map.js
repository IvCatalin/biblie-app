const fs = require('fs');
const O = require('../_haftarot-deuteronom-extract/oshb');
const map = JSON.parse(fs.readFileSync(__dirname + '/oshb-map-sarbatori.json','utf8'));
let ok=0, fail=0;
for (const [key, {osis}] of Object.entries(map)) {
  const [b,c,v] = osis.split('.');
  const words = O.verse(b, +c, +v);
  if (!words || !words.length) { fail++; console.log('FAIL', key, osis); }
  else ok++;
}
console.log('OK:', ok, '| FAIL:', fail);
