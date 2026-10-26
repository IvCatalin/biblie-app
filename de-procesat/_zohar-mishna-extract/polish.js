// Curățare prezentare Mișna/Zohar: fără note de proces/licență în interfață, titluri simple, nume românesc înainte, transliterarea în paranteză.
const { load, save } = require('./lib.js');
const S = load(); const lib = S.lib;
const mi = lib.arhivaRabinica.subfolders.find(f => f.label === 'Mișna');
const kab = lib.arhivaRabinica.subfolders.find(f => f.label === 'Kabbala');
let nm = 0, nz = 0;
for (const it of mi.items) {
  if (!it.slug || !it.slug.startsWith('mishna-') || !it.available || !it.lazySrc) continue;
  const ro = it.name_ro, old = it.name.replace(/\s*\(Pirkei Avot\)\s*$/, '').trim();
  it.name = ro + ' (' + old + ')';
  delete it.name_ro; delete it.edition;
  it.summary = 'Tratatul ' + old + ' (' + ro + ') din ordinul ' + it.author + ' al Mișnei.' + (it.slug === 'mishna-avot' ? ' Capitolul 6 (Kinyan Tora) e un adaos ulterior, în afara Mișnei propriu-zise.' : '');
  nm++;
}
const ZS = {
  'kab-zo-zohar': 'Textul aramaic de bază al Zoharului: Introducerea, parașele Torei de la Bereșit la Haazinu și cele trei volume de Adaosuri (Addenda). Fiecare paragraf poartă numărul secțiunii și al unității (ex. 3:5); titlul secțiunii apare deasupra primului ei paragraf. Idra Raba, Idra Zuta și Sifra di-Țeniuta sunt lucrări separate, în același dosar. Lacună în sursă: secțiunea 26 din Adaosuri, volumul I nu există în textul-sursă.',
  'kab-zo-idra-zuta': 'Idra Zuta („Adunarea cea mică”), parte a Zoharului propriu-zis.',
  'kab-zo-idra-raba': 'Idra Raba („Adunarea cea mare”), parte a Zoharului propriu-zis.',
  'kab-zo-sifra-ditzniuta': 'Sifra di-Țeniuta („Cartea tăinuirii”), parte a Zoharului propriu-zis.'
};
for (const it of kab.items) if (ZS[it.slug]) { it.summary = ZS[it.slug]; delete it.edition; nz++; }
save(S.h, S.s, S.e, lib);
console.log('Mișna:', nm, '| Zohar:', nz);
