// Reeh — Isaia 54:11-55:5 (+ 1 Samuel 20:18, 42; Isaia 66:1, 23) (Rahlfs 1935) — LXX pentru FIECARE tag; aceleași cuvinte ca în Noah (c02) și Masei (c47)
const { J, Z } = require('./lxx-c17h.js');
const l2 = require('./lxx-c02.js'), l47 = require('./lxx-c47.js');
const S = { __tot: true };
const DOM = 'Ebraica: „Adonai” (numele divin); Septuaginta: „Domnul” (κύριος).';
for (const k of ['54:11', '54:12', '54:13', '54:14', '54:15', '54:16', '54:17', '55:2', '55:4']) S[k] = l2[k].slice();
S['55:1'] = l2['55:1'].slice(0, 7).concat([Z('Septuaginta nu are a treia „mergeți” (ulhu) din „mergeți să cumpărați fără bani”.')], l2['55:1'].slice(7));
S['55:3'] = l2['55:3'].slice(0, 10);
{
  const o = l2['55:5'];
  S['55:5'] = [o[2], o[0], o[1], o[3], o[4], o[5], o[6], o[7], J('ἅγιος', 'τοῦ/ἁγίου/Ισραηλ', 'Sfântul lui Israel'), o[10]];
}
S['66:1'] = l47['66:1'].slice(); S['66:23'] = l47['66:23'].slice();
S['1 Samuel 20:18'] = [J('Ἰωναθάν', 'Ιωναθαν', 'Ionatan'), J('λέγω', 'εἶπεν', 'a spune'), J('αὔριον', 'αὔριον', 'mâine'), J('νουμηνία', 'νουμηνία', 'lună nouă'), J('ἐπισκέπτομαι', 'ἐπισκεπήσῃ', 'a fi cercetat', 'Ebraica: „vei lipsi” (venifkadta), adică se va observa lipsa ta; Septuaginta: „vei fi cercetat” (ἐπισκεπήσῃ).'), J('καθέδρα', 'καθέδρα/σου', 'scaun'), J('ἐπισκέπτομαι', 'ἐπισκεπήσεται', 'a fi cercetat', 'Ebraica: „va fi gol” (ipakēd); Septuaginta: „va fi cercetat” (ἐπισκεπήσεται).')];
S['1 Samuel 20:42'] = [J('Ἰωναθάν', 'Ιωναθαν', 'Ionatan'), J('λέγω', 'εἶπεν', 'a spune'), Z('Septuaginta nu are „lui David” (ledavid).'), J('πορεύομαι', 'πορεύου', 'a merge'), J('εἰρήνη', 'εἰς/εἰρήνην', 'pace'), J('ἀμφότεροι', 'ἡμεῖς/ἀμφότεροι', 'noi amândoi'), J('ὀμνύω', 'ὀμωμόκαμεν', 'a jura'), J('ὄνομα', 'ἐν/ὀνόματι', 'nume'), J('κύριος', 'κυρίου', 'Domn', DOM), J('λέγω', 'λέγοντες', 'a spune'), J('κύριος', 'κύριος', 'Domn', DOM), J('εἰμί', 'ἔσται', 'a fi', 'Ebraica: „va fi” (ihie); Septuaginta: „va fi martor” (ἔσται μάρτυς), cu „martor” adăugat.'), J('σπέρμα', 'τοῦ/σπέρματός/μου', 'sămânță'), J('σπέρμα', 'τοῦ/σπέρματός/σου', 'sămânță'), J('αἰών', 'ἕως/αἰῶνος', 'veac')];
module.exports = S;
