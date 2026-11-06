// Arată ce spune DOOM3 despre un cuvânt: node tools/doom3-q.js cuvânt [cuvânt...]
(async () => {
  for (const w of process.argv.slice(2)) {
    const r = await fetch('https://doom.lingv.ro/cautare/q/' + encodeURIComponent(w), { headers: { 'User-Agent': 'Mozilla/5.0' } }); const t = await r.text();
    const b = t.slice(t.indexOf('Filtrează') >= 0 ? t.indexOf('Filtrează') : t.indexOf('<body')).replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    const m = /Niciun rezultat[^.]*\./.test(t) ? (t.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').match(/Niciun rezultat pentru[^&]{0,40}\. (Sugestii de căutare:[^&]*(?:&[^;]+;[^&]*){0,4})?/) || [''])[0] : b.replace(/^.*?(Rezultatul provine[^0-9]*)?(\d+ rezultat)/, '$1$2').slice(0, 420);
    console.log('### ' + w + ' → ' + m.slice(0, 430));
  }
})();
