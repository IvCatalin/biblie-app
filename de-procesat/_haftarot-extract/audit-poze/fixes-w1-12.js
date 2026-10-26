// corecturi după recitirea capitolelor 1–12 (ciclul săptămânal) față de pozele cărții Rosen (ordered/pNNN.jpeg)
// [capitol, verset, text vechi (apare exact o dată în verset), text nou]
module.exports = [
  // c1 Bereșit (p006–p009)
  [1, '43:7', ' îmi poartă', ' Îmi poartă'],
  [1, '43:8', 'Eliberând ', 'Eliberând pe '],
  [1, '43:10', 'nu va fi.', 'nu va fi!”'],
  // c2 Noah (p009–p011)
  [2, '55:1', 'să cumpărați și mâncați, să cumpărați', 'să cumpărați și mâncați, mergeți să cumpărați'],
  [2, '55:2', 'argintii', 'arginții'],
  [2, '55:3', 'înviorat', 'învigorat'],
  // c3 Leh Leha (p012–p014)
  [3, '40:30', 'pot fi obosiți și osteni', 'pot obosi și osteni'],
  [3, '40:30', 'împiedica.', 'împiedica,'],
  [3, '41:1', 'Ascultați-Mă în tăcere', 'Ascultați-mă în tăcere'],
  [3, '41:2', 'să-i preschimbe', 'să îi preschimbe'],
  [3, '41:2', 'în pleavă purtată de vânt', 'în pleavă'],
  [3, '41:2', 'pleavă arcul', 'pleavă să îi prefacă arcul'],
  [3, '41:6', 'semanul', 'seamănul'],
  [3, '41:6', 'Fii tare!”', 'Fii tare!”.'],
  [3, '41:13', 'ajuta!”', 'ajuta!'],
  [3, '41:16', 'preamări!', 'preamări!”'],
  // c4 Vaiera (p014–p018)
  [4, '4:24', 'să nu te oprești', 'să nu te opri'],
  [4, '4:28', 'amăgi!»?”', 'amăgi!» ?”'],
  [4, '4:35', 'tânărul a deschis ochii', 'tânărul și-a deschis ochii'],
  [4, '4:36', 'și i-a spus: „Cheam-o', 'și a spus: „Cheam-o'],
  // c5 Haiei Sara (p018–p021)
  [5, '1:18', 'rege, stăpânul meu, regele, nu știe!', 'rege; și acum, stăpânul meu, regele, nu știe!'],
  [5, '1:24', 'și el va sta pe tronul meu»?', 'și va sta pe tronul meu»?'],
  // c6 Toldot (p021–p024)
  [6, '1:6', 'Un fiu își cinstește tatăl', 'Un fiu își va cinsti tatăl'],
  [6, '1:6', 'Mea? Și dacă', 'Mea, și dacă'],
  [6, '1:6', 'dacă Eu sunt Stăpânul', 'dacă sunt Stăpânul'],
  [6, '1:13', 'Oare să-l [primesc]', 'Oare să doresc să-l [primesc]'],
  // c7 Vaiețe (p024–p028)
  [7, '13:6', 'trufașă, și de aceea', 'trufașă și de aceea'],
  [7, '13:8', ' Îi voi mânca acolo ca un leu; fiara câmpului îi va sfâșia.', ''],   // omis în ediția tipărită (există în ebraică) — notă MT adăugată separat
  [7, '13:13', 'căci în timp, nașterea', 'căci în timp nașterea'],
  [7, '14:2', 'substituie vitelor [jertfite].”', 'substituie vitelor [jertfite].'],
  [7, '14:3', 'milă orfanul.', 'milă orfanul.”'],
  [7, 'Ioel 2:26', 'veți lăuda numele', 'veți slăvi numele'],
  [7, 'Ioel 2:27', 'Și veți ști', 'Și vei ști'],
  // c8 Vaișlah (p029–p031): ediția tipărită scrie «Esav» peste tot
  [8, '1:4', 'Chiar de te-nalți', 'Chiar de te înalți'],
  [8, '1:6', 'Esau', 'Esav'],
  [8, '1:8', 'Esau', 'Esav'],
  [8, '1:9', 'Esau', 'Esav'],
  [8, '1:18', 'Esau', 'Esav', { all: true }],
  [8, '1:19', 'Esau', 'Esav'],
  [8, '1:21', 'Esau', 'Esav'],
  // c9 Vaieșev (p031–p033)
  [9, '2:6', 'încălțări!', 'încălțări?'],
  [9, '2:7', 'Cei care doresc', 'Cei care își doresc'],
  [9, '2:7', 'vin la aceeași', 'vin de la aceeași'],
  [9, '2:16', 'viteajă', 'vitează'],
  [9, '3:7', 'slujitorii Săi', 'slujitorii săi'],
  // c10 Mikeț (p033–p035)
  [10, '3:26', 'dă-i ei pe', 'dă-i-l ei pe'],
  // c11 Vaigaș (p035–p037)
  [11, '37:18', 'deslusi', 'desluși'],
  // c12 Vaiehi (p037–p039)
  [12, '2:5', 'Ioav, fiul Țeruiei', 'Ioav, fiul lui Țeruia'],
];
