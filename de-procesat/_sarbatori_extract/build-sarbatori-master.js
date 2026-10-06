const fs = require('fs');
const dir = 'de-procesat/_sarbatori_extract/sarbatori/';
const master = JSON.parse(fs.readFileSync('de-procesat/_haftarot-extract/haftarot-ciclu-saptamanal.json','utf8'));
const haazinu = master.chapters.find(c=>c.num===57);

const nume = JSON.parse(fs.readFileSync(dir+'nume_pericope_sarbatori.json','utf8'));
const titleMap = {};
nume.sarbatori_si_ocazii.forEach(o => titleMap[o.id] = o.eb + ' - ' + o.ro);

const bookMap = [
  ['Regi II', '2 Împărați'], ['Regi I', '1 Împărați'],
  ['Samuel II', '2 Samuel'], ['Samuel I', '1 Samuel'],
  ['Ioșua', 'Iosua'], ['Malahi', 'Maleahi']
];
function translateRef(ref) {
  let r = ref.replace(/–/g, '-');
  for (const [from, to] of bookMap) {
    r = r.split(from).join(to);
  }
  return r;
}

const ordine = [
  ['haftarat_shabat_erev_rosh_hodesh.json','shabat_erev_rosh_hodesh'],
  ['haftarat_shabat_rosh_hodesh.json','shabat_rosh_hodesh'],
  ['haftarat_shabat_hanuca_1.json','shabat_hanuca_1'],
  ['haftarat_shabat_hanuca_2.json','shabat_hanuca_2'],
  ['haftarat_parashat_shekalim.json','shekalim'],
  ['haftarat_parashat_zahor.json','zahor'],
  ['haftarat_parashat_para.json','para'],
  ['haftarat_parashat_hahodesh.json','hahodesh'],
  ['haftarat_shabat_hagadol.json','shabat_hagadol'],
  ['haftarat_pesah_ziua_1.json','pesah_1'],
  ['haftarat_pesah_ziua_2.json','pesah_2'],
  ['haftarat_shabat_hol_hamoed_pesah.json','pesah_shabat_hol_hamoed'],
  ['haftarat_pesah_ziua_7.json','pesah_7'],
  ['haftarat_pesah_ziua_8.json','pesah_8'],
  ['haftarat_shavuot_ziua_1.json','shavuot_1'],
  ['haftarat_shavuot_ziua_2.json','shavuot_2'],
  ['haftarat_tisha_bav_shaharit.json','tisha_bav_shaharit'],
  ['haftarat_taanit_tzibur_minha.json','taanit_tzibur_minha'],
  ['haftarat_rosh_hashana_ziua_1.json','rosh_hashana_1'],
  ['haftarat_rosh_hashana_ziua_2.json','rosh_hashana_2'],
  ['haftarat_iom_kipur_shaharit.json','iom_kipur_shaharit'],
  ['haftarat_iom_kipur_minha.json','iom_kipur_minha'],
  ['haftarat_sucot_ziua_1.json','sucot_1'],
  ['haftarat_sucot_ziua_2.json','sucot_2'],
  ['haftarat_shabat_hol_hamoed_sucot.json','sucot_shabat_hol_hamoed'],
  ['haftarat_shemini_atzeret.json','shemini_atzeret'],
  ['haftarat_simhat_tora.json','simhat_tora'],
];

if (ordine.length !== 27) throw new Error('nu sunt 27!');
for (const [f,id] of ordine) if (!titleMap[id]) throw new Error('fara titlu pentru '+id);

let chapters = [];
let totalV = 0;
ordine.forEach(([f,id], i) => {
  const d = JSON.parse(fs.readFileSync(dir+f, 'utf8'));
  let verses;
  if (f === 'haftarat_pesah_ziua_7.json') {
    verses = haazinu.verses.map(v => ({v: v.v, t: v.t, heb: v.heb, translit: v.translit}));
  } else {
    verses = d.verses.map(v => ({v: v.v, t: v.t, heb: v.heb, translit: v.translit}));
  }
  chapters.push({ num: i+1, title: titleMap[id], ref: translateRef(d.reference), verses });
  totalV += verses.length;
});

const entry = {
  slug: 'haftarot-sarbatori',
  name: 'Haftarot — Sărbători',
  name_ro: 'Haftarot pentru sărbători și ocazii speciale',
  author: '',
  meta: chapters.length + ' haftarot',
  summary: 'Haftarot citite la sărbători și ocazii speciale din calendarul iudaic.',
  available: true,
  edition: {
    translation: 'Traducerea rabinului Șlomo Sorin Rosen',
    source: 'Humașul „Tora și Haftarot” – traducere, transliterare și adnotări după surse iudaice de rabin Șlomo Sorin Rosen (jewishbooks.ro)',
    source_status: 'CC-BY-NC',
    modernization: 'Text integral, fără modificări'
  },
  chapters
};
fs.writeFileSync('de-procesat/_haftarot-extract/haftarot-sarbatori.json', JSON.stringify(entry, null, 1));
console.log('capitole:', chapters.length, '| total versete:', totalV);
chapters.forEach(c => console.log(c.num, c.title, '|', c.ref, '|', c.verses.length, 'v'));
