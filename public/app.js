
// =====================================================================
// DATE — încărcate dinamic, câte un fișier .js per capitol
// (genesis-1.js, genesis-2.js, ...), fiecare setează window.CHAPTER_DATA
// =====================================================================

// =====================================================================
// RANDARE
// =====================================================================
let VERSES = null; // declarată explicit — evită "ReferenceError: VERSES is not defined"
                     // dacă orice cod o citește înainte ca un capitol să se termine de încărcat
const versesEl = document.getElementById("verses");
const drawer = document.getElementById("drawer");
const backdrop = document.getElementById("backdrop");
const drawerRef = document.getElementById("drawer-ref");
const drawerVerseText = document.getElementById("drawer-verse-text");
const drawerContent = document.getElementById("drawer-content");
const wordPopover = document.getElementById("word-popover");

function plainVerseText(verse){
  return verse.tokens.map(tok => tok.t).join("");
}

function makeAccordionGroup(titleText, items, renderItemBody){
  const group = document.createElement("div");
  group.className = "accordion-group";

  const title = document.createElement("div");
  title.className = "accordion-group-title";
  title.textContent = titleText;
  group.appendChild(title);

  items.forEach(item => {
    const wrap = document.createElement("div");
    wrap.className = "accordion-item";

    const header = document.createElement("div");
    header.className = "accordion-header";
    header.innerHTML = `<span>${item.headerLabel}</span><span class="accordion-go">→</span>`;
    header.addEventListener("click", () => {
      const willOpen = !wrap.classList.contains("open");
      group.querySelectorAll(".accordion-item.open").forEach(openItem => openItem.classList.remove("open"));
      if(willOpen) wrap.classList.add("open");
    });
    wrap.appendChild(header);

    const body = document.createElement("div");
    body.className = "accordion-body";
    body.innerHTML = renderItemBody(item);
    wrap.appendChild(body);

    group.appendChild(wrap);
  });

  return group;
}

// =====================================================================
// FOAIA DE ACȚIUNI PE VERSET — Comentarii / Copiază / Aspect / Trimite /
// Marchează / Notiță. Design propriu, nu o copie a aplicațiilor de referință.
// =====================================================================

const VS_MARK_COLORS = [
  { id: "none",   hex: null },
  { id: "yellow", hex: "#f0c419" },
  { id: "green",  hex: "#4caf7d" },
  { id: "blue",   hex: "#4a90d9" },
  { id: "pink",   hex: "#e0699a" },
  { id: "orange", hex: "#e8892f" },
];
const VS_FONTS = [
  { id: "serif", label: "Fraunces", css: "'Fraunces', serif" },
  { id: "sans",  label: "Inter",    css: "'Inter', sans-serif" },
  { id: "domine", label: "Domine", css: "'Domine', serif" },
  { id: "sourceserif4", label: "Source Serif 4", css: "'Source Serif 4', serif" },
  { id: "literata", label: "Literata", css: "'Literata', serif" },
  { id: "poppins", label: "Poppins", css: "'Poppins', sans-serif" },
  { id: "arimo", label: "Arimo", css: "'Arimo', sans-serif" },
];
const VS_SIZES = [13, 14, 15, 16, 17, 18, 19, 20, 22];
const LIB_THEMES = [
  { id: "dark",  label: "Întunecat", bg: "#101f3c", text: "#B7C2D6" },
  { id: "light", label: "Deschis",   bg: "#E9E9E7", text: "#232220" },
  { id: "sepia", label: "Sepia",     bg: "#EFE6D8", text: "#4A3F2E" },
];
const LIB_SPACINGS = [
  { id: "compact", gap: 4 },
  { id: "normal",  gap: 7 },
  { id: "wide",    gap: 10 },
];
const LSP_ICONS = {
  compact: '<svg width="34" height="22" viewBox="0 0 34 22"><line x1="3" y1="4" x2="31" y2="4" stroke-width="2"/><line x1="3" y1="11" x2="31" y2="11" stroke-width="2"/><line x1="3" y1="18" x2="31" y2="18" stroke-width="2"/></svg>',
  normal:  '<svg width="34" height="22" viewBox="0 0 34 22"><line x1="3" y1="2" x2="31" y2="2" stroke-width="2"/><line x1="3" y1="11" x2="31" y2="11" stroke-width="2"/><line x1="3" y1="20" x2="31" y2="20" stroke-width="2"/></svg>',
  wide:    '<svg width="34" height="22" viewBox="0 0 34 22"><line x1="3" y1="1" x2="31" y2="1" stroke-width="2"/><line x1="3" y1="11" x2="31" y2="11" stroke-width="2"/><line x1="3" y1="21" x2="31" y2="21" stroke-width="2"/></svg>',
};

let vsCurrentVerse = null;
let vsCurrentVerseEl = null;

let vsCtx = null; // { ref, key } — setat când foaia e deschisă din Bibliotecă (ex. Haftarot)
function vsKey(prefix){
  if(vsCtx) return prefix + "_" + vsCtx.key;
  return prefix + "_" + currentBookSlug + "_" + currentChapter + "_" + vsCurrentVerse.num;
}
function vsRefLabel(){
  if(vsCtx) return vsCtx.ref;
  const book = getBook(currentBookSlug);
  return book.name + " " + currentChapter + ":" + vsCurrentVerse.num;
}
function applyMarkByKey(verseEl, storageKey){
  let colorId = "none";
  try { colorId = localStorage.getItem(storageKey) || "none"; } catch(e){}
  const colorObj = VS_MARK_COLORS.find(c => c.id === colorId);
  verseEl.classList.toggle("verse-marked", colorId !== "none");
  verseEl.style.background = (colorObj && colorObj.hex) ? (colorObj.hex + "55") : "";
}
function vsReapplyMark(){
  if(!vsCurrentVerseEl) return;
  if(vsCtx) applyMarkByKey(vsCurrentVerseEl, vsKey("mark"));
  else applyVerseMarkStyle(vsCurrentVerseEl, currentBookSlug, currentChapter, vsCurrentVerse.num);
}

const verseSheet = document.getElementById("verse-sheet");
const verseSheetBackdrop = document.getElementById("verse-sheet-backdrop");
const verseSheetRef = document.getElementById("verse-sheet-ref");
const verseSheetPanel = document.getElementById("verse-sheet-panel");
const vsToast = document.getElementById("vs-toast");

function showVsToast(text){
  vsToast.textContent = text;
  vsToast.classList.add("show");
  clearTimeout(showVsToast._t);
  showVsToast._t = setTimeout(() => vsToast.classList.remove("show"), 1800);
}

let vsScrollY = 0;
function lockBodyScroll(){
  vsScrollY = window.scrollY || window.pageYOffset || 0;
  document.body.style.position = "fixed";
  document.body.style.top = (-vsScrollY) + "px";
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.body.style.width = "100%";
}
function unlockBodyScroll(){
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.width = "";
  window.scrollTo(0, vsScrollY);
}

function openVerseSheet(verse, verseEl, ctx){
  if(typeof LIBRARY === "undefined" && window.libLoad) window.libLoad(() => { if(verseSheet.classList.contains("show") && vsCurrentVerse === verse) renderVerseSheetTabs(verse); });
  vsCtx = ctx || null;
  vsCurrentVerse = verse;
  vsCurrentVerseEl = verseEl;
  verseSheetRef.textContent = vsRefLabel();
  verseSheetPanel.classList.remove("show");
  verseSheetPanel.innerHTML = "";
  document.querySelectorAll(".vs-action").forEach(b => b.classList.remove("active"));
  const highlightBtn = document.querySelector('.vs-action[data-action="highlight"]');
  if(highlightBtn) highlightBtn.classList.toggle("active", vsGetMarkColor() !== "none");
  renderVerseSheetTabs(verse);
  verseSheet.classList.add("show");
  verseSheetBackdrop.classList.add("show");
  lockBodyScroll();
}

// --- Cele două taburi din foaia de verset: Comentarii (listă cu preview) și
// Texte (comparație Masoretic/LXX/Samaritean) — înlocuiesc sertarul separat
// pentru accesul de bază pe verset; sertarul (drawer) rămâne folosit doar
// de trimiterile/referințele care sar direct la alt verset.
let vsActiveTab = "comentarii";
// la „Citește pasajul → ” se ține minte unde era cititorul (verset, tab, rândul deschis), ca „înapoi” din carte să readucă lista de comentarii/texte
let vsPendingRestore = null;
function renderVerseSheetTabs(verse){
  const tabsEl = document.getElementById("vs-tabs");
  const contentEl = document.getElementById("vs-tab-content");
  vsActiveTab = (vsPendingRestore && vsPendingRestore.tab) || "comentarii";

  // "Context literar-istoric" și "Istorici" (Josephus etc.) sunt azi comentarii
  // ca oricare altele, dar aparțin conceptual tab-ului Texte, nu Comentarii.
  // regula: tot ce vine din Diverse ca text (Josephus, Jubilee, Enoh, Cartea Dreptului, Apocalipsa lui Moise, 4 Ezdra, Baruh, Sibiline, deuterocanonice etc.) poartă eticheta „… — comparație" și merge în Texte
  const isAneOrHistorian = (author) => /istoric|josephus|flavius|jubileelor|apocrif|adam.*eva/i.test(author || "") || /—\s*(context\/)?comparație\s*$/i.test(author || "");

  const allComments = (verse.commentaries || []);
  const realComments = allComments.filter(c => !isAneOrHistorian(c.author));
  const aneAndHistorians = allComments.filter(c => isAneOrHistorian(c.author));

  // Țintă „Citește pasajul": lucrarea din Bibliotecă și locul exact (null dacă lucrarea nu e încă disponibilă)
  const srcOf = (label, row) => (typeof window.libResolveSource === "function") ? window.libResolveSource(label, currentBookSlug, currentChapter, verse.num, row && row.src) : null;

  function wordPreview(plainText, wordLimit){
    const words = plainText.trim().split(/\s+/);
    if(words.length <= wordLimit) return plainText.trim();
    return words.slice(0, wordLimit).join(" ") + " …mai mult";
  }

  function appendCommentRow(container, author, htmlText, customPreview, variant, src){
    let preview;
    if(customPreview){
      preview = customPreview;
    } else {
      const plain = (htmlText || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
      preview = wordPreview(plain, 8);
    }
    const row = document.createElement("div");
    row.className = "vs-comment-row" + (variant ? " vs-row-" + variant : "");
    row.innerHTML =
      '<div class="vs-comment-main">' +
        '<div class="vs-comment-head">' +
          '<div class="vs-comment-author">' + author + '</div>' +
        '</div>' +
        '<div class="vs-comment-preview">' + preview + '</div>' +
      '</div>' +
      '<span class="vs-comment-chev">›</span>';
    const full = document.createElement("div");
    full.className = "vs-comment-full" + (variant ? " vs-row-" + variant : "");
    full.style.display = "none";
    full.innerHTML = htmlText;
    // „Citește pasajul →" apare la finalul textului extins
    if(src){
      const wrap = document.createElement("div");
      wrap.className = "vs-open-src-wrap";
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "vs-open-src";
      btn.textContent = "Citește pasajul →";
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        window.libReturnCtx = { slug: currentBookSlug, chapter: currentChapter, verseNum: verse.num, tab: vsActiveTab, row: Array.prototype.indexOf.call(contentEl.querySelectorAll(".vs-comment-row"), row) };
        window.libReturnArmed = true;
        closeVerseSheet();
        if(typeof window.openLibraryPassage === "function") window.openLibraryPassage(src.slug, src.spec);
      });
      wrap.appendChild(btn);
      full.appendChild(wrap);
    }
    row.addEventListener("click", () => {
      const isOpen = full.style.display !== "none";
      contentEl.querySelectorAll(".vs-comment-full").forEach(f => f.style.display = "none");
      contentEl.querySelectorAll(".vs-comment-row").forEach(r => r.classList.remove("open"));
      if(!isOpen){ full.style.display = "block"; row.classList.add("open"); }
    });
    container.appendChild(row);
    container.appendChild(full);
  }

  function renderTabContent(){
    contentEl.innerHTML = "";
    if(vsActiveTab === "comentarii"){
      if(realComments.length){
        realComments.forEach(c => appendCommentRow(contentEl, c.author, c.text, null, null, srcOf(c.author, c)));
      } else {
        contentEl.innerHTML = "";
      }
    } else {
      let hasAny = false;
      if(verse.textCompare && verse.textCompare.length){
        hasAny = true;
        const label = document.createElement("div");
        label.className = "lib-section-title";
        label.style.margin = "4px 0 4px";
        label.textContent = "Comparație texte";
        contentEl.appendChild(label);
        verse.textCompare.forEach(c => {
          const isSamaritan = /Samaritean/i.test(c.source || "");
          const isPlaceholderOriginal = /^\(scris cu alfabetul samaritean/i.test(c.original || "");

          let lead;
          const plainTranslation = (c.translation || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
          if(isSamaritan){
            const looksIdentic = /identic/i.test(c.translation || "");
            lead = (looksIdentic ? "Asemănare: " : "Diferență: ") + wordPreview(plainTranslation, 8);
          } else {
            // previzualizarea e chiar începutul textului real, ca "mai mult" să
            // continue aceeași propoziție, nu una generică nelegată de conținut
            lead = wordPreview(plainTranslation, 8);
          }

          let html = `<div>${c.translation}</div>`;
          if(c.note) html += `<div class="note">${c.note}</div>`;
          if(c.original && !isPlaceholderOriginal){
            html += `<div class="orig-block${c.greek ? ' greek' : ''}">${c.original}</div>`;
          }
          appendCommentRow(contentEl, c.source, html, lead, "textcompare", srcOf(c.source));
        });
      }
      if(aneAndHistorians.length){
        hasAny = true;
        const label = document.createElement("div");
        label.className = "lib-section-title";
        label.style.margin = "16px 0 4px";
        label.textContent = "Context istoric, Josephus, apocrife și pseudepigrafe";
        contentEl.appendChild(label);
        aneAndHistorians.forEach(c => appendCommentRow(contentEl, c.author, c.text, null, null, srcOf(c.author, c)));
      }
      if(!hasAny){
        contentEl.innerHTML = "";
      }
    }
  }

  tabsEl.querySelectorAll(".vs-tab").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.tab === vsActiveTab);
    btn.onclick = () => {
      vsActiveTab = btn.dataset.tab;
      tabsEl.querySelectorAll(".vs-tab").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderTabContent();
    };
  });
  renderTabContent();
  if(vsPendingRestore){
    const r = contentEl.querySelectorAll(".vs-comment-row")[vsPendingRestore.row];
    vsPendingRestore = null;
    if(r){ r.click(); setTimeout(() => { try { r.scrollIntoView({ block: "center" }); } catch(e){} }, 60); }
  }
}
function closeVerseSheet(){
  verseSheet.classList.remove("show");
  verseSheetBackdrop.classList.remove("show");
  verseSheetPanel.classList.remove("show");
  unlockBodyScroll();
}
// Din cititorul bibliotecii, după „Citește pasajul →”: „înapoi” readuce foaia de verset (același tab, același rând deschis). Întoarce true dacă a readus-o.
window.libReturnToVerseSheet = function(){
  const c = window.libReturnCtx; window.libReturnCtx = null; window.libReturnArmed = false;
  if(!c) return false;
  const open = () => {
    const v = Array.isArray(VERSES) ? VERSES.find(x => x.num === c.verseNum) : null;
    if(!v) return;
    vsPendingRestore = { tab: c.tab, row: c.row };
    openVerseSheet(v, document.querySelector('.verse[data-num="' + c.verseNum + '"]'));
  };
  if(currentBookSlug === c.slug && currentChapter === c.chapter && Array.isArray(VERSES) && VERSES.length){ open(); return true; }
  currentBookSlug = c.slug;
  loadChapterThenOpenVerse(c.chapter, c.verseNum);
  setTimeout(open, 600);
  return true;
};
verseSheetBackdrop.addEventListener("click", closeVerseSheet);
const verseSheetCloseBtn = document.getElementById("verse-sheet-close");
if(verseSheetCloseBtn) verseSheetCloseBtn.addEventListener("click", closeVerseSheet);

// Tragere în jos pe mâner ca să închizi foaia — și, la fel de important,
// oprim gestul să "scape" spre pagină și să declanșeze pull-to-refresh
// (exact ce s-a întâmplat: tragerea nereținută aici a ajuns la reload).
// Tragere în jos pentru închidere — pe toată foaia, nu doar sus. Dar cu grijă:
// dacă ești derulat mai jos în Comentarii/Texte, tragerea în jos trebuie să
// deruleze normal, nu să închidă din greșeală. Se comportă ca la aplicațiile
// native: închide doar când ești deja sus de tot (scrollTop === 0) și continui
// să tragi în jos de acolo.
if(verseSheet){
  let dragStartY = null;
  let dragStartX = null;
  let dragCurrentY = 0;
  let dragEngaged = false;
  let dragEligible = false;
  verseSheet.addEventListener("touchstart", (e) => {
    dragStartY = e.touches[0].clientY;
    dragStartX = e.touches[0].clientX;
    dragCurrentY = 0;
    dragEngaged = false;
    dragEligible = verseSheet.scrollTop <= 0;
  }, { passive: true });
  verseSheet.addEventListener("touchmove", (e) => {
    if(dragStartY === null) return;
    const dy = e.touches[0].clientY - dragStartY;
    const dx = e.touches[0].clientX - dragStartX;
    if(!dragEngaged){
      if(!dragEligible || verseSheet.scrollTop > 0) return; // lasă scroll-ul normal
      if(dy > 8 && Math.abs(dy) > Math.abs(dx)){
        dragEngaged = true;
        verseSheet.style.transition = "none";
      } else {
        return;
      }
    }
    dragCurrentY = dy < 0 ? 0 : dy;
    verseSheet.style.transform = "translateY(" + dragCurrentY + "px)";
    e.preventDefault();
  }, { passive: false });
  verseSheet.addEventListener("touchend", () => {
    if(dragEngaged){
      verseSheet.style.transition = "";
      verseSheet.style.transform = "";
      if(dragCurrentY > 90){
        closeVerseSheet();
      }
    }
    dragStartY = null;
    dragStartX = null;
    dragCurrentY = 0;
    dragEngaged = false;
    dragEligible = false;
  });
}

function plainVerseTextForSheet(verse){
  if(currentVersion !== "rosen" && verse[currentVersion]) return verse[currentVersion];
  return plainVerseText(verse);
}

document.querySelectorAll(".vs-action").forEach(btn => {
  btn.addEventListener("click", () => {
    const action = btn.dataset.action;
    const alreadyActive = btn.classList.contains("active");
    document.querySelectorAll(".vs-action").forEach(b => b.classList.remove("active"));

    if(action === "highlight"){
      const current = vsGetMarkColor();
      const next = current === "none" ? "yellow" : "none";
      try { localStorage.setItem(vsKey("mark"), next); } catch(e){}
      vsReapplyMark();
      showVsToast(next !== "none" ? "Verset marcat" : "Verset demarcat");
      closeVerseSheet();
      return;
    }
    if(action === "copy"){
      const ref = vsRefLabel();
      const text = "„" + plainVerseTextForSheet(vsCurrentVerse) + "” — " + ref;
      const doCopy = () => showVsToast("Verset copiat");
      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(text).then(doCopy).catch(doCopy);
      } else {
        doCopy();
      }
      closeVerseSheet();
      return;
    }
    if(action === "share"){
      const ref = vsRefLabel();
      const text = "„" + plainVerseTextForSheet(vsCurrentVerse) + "” — " + ref;
      if(navigator.share){
        navigator.share({ text }).catch(() => {});
        closeVerseSheet();
      } else if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(text).then(() => showVsToast("Copiat — gata de trimis"));
        closeVerseSheet();
      } else {
        showVsToast("Trimiterea nu e disponibilă pe acest dispozitiv");
        closeVerseSheet();
      }
      return;
    }

    // Panouri care rămân deschise: text / highlight / note
    if(alreadyActive){
      verseSheetPanel.classList.remove("show");
      verseSheetPanel.innerHTML = "";
      return;
    }
    btn.classList.add("active");
    if(action === "text") renderTextPanel();
    if(action === "note") renderNotePanel();
  });
});

// --- Panou Setări de citire (Aa): temă, font, mărime, spațiere — se aplică textului versetelor ---
function vsGetTextPrefs(){
  let font = "serif", size = 17, theme = "dark", spacing = "normal";
  try {
    font = localStorage.getItem("vsFont") || "serif";
    size = parseInt(localStorage.getItem("vsSize") || "17", 10);
    theme = localStorage.getItem("vsTheme") || "dark";
    spacing = localStorage.getItem("vsSpacing") || "normal";
  } catch(e){}
  return { font, size, theme, spacing };
}
function vsApplyTextPrefs(){
  const { font, size, theme, spacing } = vsGetTextPrefs();
  const fontObj = VS_FONTS.find(f => f.id === font) || VS_FONTS[0];
  versesEl.style.fontFamily = fontObj.css;
  versesEl.style.fontSize = size + "px";
  versesEl.classList.remove("bible-theme-dark", "bible-theme-light", "bible-theme-sepia");
  versesEl.classList.add("bible-theme-" + theme);
  versesEl.classList.remove("bsp-compact", "bsp-normal", "bsp-wide");
  versesEl.classList.add("bsp-" + spacing);
}
vsApplyTextPrefs();

function renderTextPanel(){
  const { font, size, theme, spacing } = vsGetTextPrefs();
  verseSheetPanel.innerHTML = `
    <div class="vsp-row-label">Temă</div>
    <div class="vsp-chip-row" id="vsp-theme-row">
      ${LIB_THEMES.map(t => `<button class="vsp-chip${t.id===theme?' active':''}" data-theme="${t.id}"><span class="vsp-chip-swatch" style="background:${t.bg}"></span>${t.label}</button>`).join("")}
    </div>
    <div class="vsp-row-label">Font</div>
    <div class="vsp-chip-row" id="vsp-font-row">
      ${VS_FONTS.map(f => `<button class="vsp-chip${f.id===font?' active':''}" data-font="${f.id}" style="font-family:${f.css}">${f.label}</button>`).join("")}
    </div>
    <div class="vsp-row-label">Mărime</div>
    <div class="vsp-chip-row" id="vsp-size-row">
      ${VS_SIZES.map(s => `<button class="vsp-chip${s===size?' active':''}" data-size="${s}">${s}</button>`).join("")}
    </div>
    <div class="vsp-row-label">Spațiere</div>
    <div class="vsp-icon-row" id="vsp-spacing-row">
      ${LIB_SPACINGS.map(sp => `<button class="vsp-icon-chip${sp.id===spacing?' active':''}" data-spacing="${sp.id}" title="Spațiere">${LSP_ICONS[sp.id]}</button>`).join("")}
    </div>
    <div class="vsp-font-preview" id="vsp-preview">„La început, Dumnezeu a făcut cerurile şi pământul.”</div>
  `;
  verseSheetPanel.classList.add("show");
  const preview = document.getElementById("vsp-preview");
  const syncPreview = () => {
    const p = vsGetTextPrefs();
    const fontObj = VS_FONTS.find(f => f.id === p.font) || VS_FONTS[0];
    preview.style.fontFamily = fontObj.css;
    preview.style.fontSize = p.size + "px";
  };
  syncPreview();
  document.getElementById("vsp-theme-row").querySelectorAll(".vsp-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      try { localStorage.setItem("vsTheme", chip.dataset.theme); } catch(e){}
      chip.parentElement.querySelectorAll(".vsp-chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      vsApplyTextPrefs();
    });
  });
  document.getElementById("vsp-font-row").querySelectorAll(".vsp-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      try { localStorage.setItem("vsFont", chip.dataset.font); } catch(e){}
      chip.parentElement.querySelectorAll(".vsp-chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      vsApplyTextPrefs();
      syncPreview();
    });
  });
  document.getElementById("vsp-size-row").querySelectorAll(".vsp-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      try { localStorage.setItem("vsSize", chip.dataset.size); } catch(e){}
      chip.parentElement.querySelectorAll(".vsp-chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      vsApplyTextPrefs();
      syncPreview();
    });
  });
  document.getElementById("vsp-spacing-row").querySelectorAll(".vsp-icon-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      try { localStorage.setItem("vsSpacing", chip.dataset.spacing); } catch(e){}
      chip.parentElement.querySelectorAll(".vsp-icon-chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      vsApplyTextPrefs();
    });
  });
}

// --- Panou Marchează: culori pentru evidențierea versetului ---
function vsGetMarkColor(){
  try { return localStorage.getItem(vsKey("mark")) || "none"; } catch(e){ return "none"; }
}
function applyVerseMarkStyle(verseEl, bookSlug, chapterNum, verseNum){
  let colorId = "none";
  try { colorId = localStorage.getItem("mark_" + bookSlug + "_" + chapterNum + "_" + verseNum) || "none"; } catch(e){}
  const colorObj = VS_MARK_COLORS.find(c => c.id === colorId);
  verseEl.classList.toggle("verse-marked", colorId !== "none");
  verseEl.style.background = (colorObj && colorObj.hex) ? (colorObj.hex + "55") : "";
}
function renderHighlightPanel(){
  const current = vsGetMarkColor();
  verseSheetPanel.innerHTML = `
    <div class="vsp-row-label">Culoare de evidențiere</div>
    <div class="vsp-swatches" id="vsp-swatches">
      ${VS_MARK_COLORS.map(c => c.id === "none"
        ? `<button class="vsp-swatch none-swatch${current==='none'?' active':''}" data-color="none" title="Fără"></button>`
        : `<button class="vsp-swatch${current===c.id?' active':''}" data-color="${c.id}" style="background:${c.hex}" title="${c.id}"></button>`
      ).join("")}
    </div>
  `;
  verseSheetPanel.classList.add("show");
  document.getElementById("vsp-swatches").querySelectorAll(".vsp-swatch").forEach(sw => {
    sw.addEventListener("click", () => {
      try { localStorage.setItem(vsKey("mark"), sw.dataset.color); } catch(e){}
      sw.parentElement.querySelectorAll(".vsp-swatch").forEach(s => s.classList.remove("active"));
      sw.classList.add("active");
      vsReapplyMark();
    });
  });
}

// --- Panou Notiță: textarea persistat local, per verset ---
function renderNotePanel(){
  let savedNote = "";
  try { savedNote = localStorage.getItem(vsKey("note")) || ""; } catch(e){}
  verseSheetPanel.innerHTML = `
    <div class="vsp-row-label">Notița ta pentru acest verset</div>
    <textarea class="vsp-note-area" id="vsp-note-area" placeholder="Scrie un gând, o întrebare, o aplicație personală...">${savedNote.replace(/</g,"&lt;")}</textarea>
    <button class="vsp-note-save" id="vsp-note-save">Salvează notița</button>
  `;
  verseSheetPanel.classList.add("show");
  document.getElementById("vsp-note-save").addEventListener("click", () => {
    const val = document.getElementById("vsp-note-area").value;
    try {
      if(val.trim()) localStorage.setItem(vsKey("note"), val);
      else localStorage.removeItem(vsKey("note"));
    } catch(e){}
    showVsToast("Notiță salvată");
    closeVerseSheet();
  });
}

// =====================================================================
// CITIRE CU VOCE AI (OpenAI TTS, via server propriu — vezi /server)
// Înlocuiește complet vechiul sistem bazat pe window.speechSynthesis.
// =====================================================================

const TTS_API_BASE = ""; // gol = aceeași adresă unde e găzduită pagina (funcționează local ȘI găzduit, pe orice dispozitiv)

const TTS_PRONUNCIATION_DICT = {
  // cheie: cum apare EXACT în textul afișat  →  valoare: cum trimitem textul la TTS
  // (afectează doar sunetul, niciodată textul văzut de om)
  "Hidekel": "Hi-de-chel",
  "Pișon": "Pi-șon",
  "Ghihon": "Ghi-hon"
};
function applyPronunciationDict(text){
  let out = text;
  Object.keys(TTS_PRONUNCIATION_DICT).forEach(key => {
    out = out.split(key).join(TTS_PRONUNCIATION_DICT[key]);
  });
  return out;
}

function ttsVoicePref(){
  return "male"; // singura voce disponibilă acum (Cedar)
}
function ttsSpeedPref(){
  try { return parseFloat(localStorage.getItem("ttsSpeed")) || 1.0; } catch(e){ return 1.0; }
}
function setTtsSpeedPref(s){ try { localStorage.setItem("ttsSpeed", String(s)); } catch(e){} }

// Cache audio în sesiunea curentă a browserului: text+voce → URL blob local.
// (arhitectura permite ușor înlocuirea cu un cache persistent/server-side mai târziu)
const ttsAudioCache = new Map();
function ttsCacheKey(text, voiceProfile){
  return voiceProfile + "::" + text;
}

async function fetchVerseAudio(text, voiceProfile){
  const key = ttsCacheKey(text, voiceProfile);
  if(ttsAudioCache.has(key)) return ttsAudioCache.get(key);

  const spokenText = applyPronunciationDict(text);
  const response = await fetch(TTS_API_BASE + "/api/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: spokenText, voiceProfile })
  });
  if(!response.ok){
    let detail = "";
    try { detail = (await response.json()).error || ""; } catch(e){}
    throw new Error(detail || ("Server TTS a răspuns cu status " + response.status));
  }
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  ttsAudioCache.set(key, url);
  return url;
}

function preloadVerseAudio(text, voiceProfile){
  // preîncărcare "best effort" — nu blochează nimic dacă eșuează
  fetchVerseAudio(text, voiceProfile).catch(() => {});
}

// --- Player unic (folosit atât pentru un singur verset, cât și pentru capitol) ---
const ttsPlayer = new Audio();
let ttsSessionToken = 0;      // fiecare sesiune nouă (verset sau capitol) primește alt număr
let ttsChapterActive = false; // true în timp ce "Citește capitolul" rulează
let ttsChapterVerseIdx = -1;  // indexul versetului curent în VERSES, în timpul lecturii capitolului
let ttsPaused = false;
let ttsCurrentVerseEl = null;

function clearVerseHighlight(){
  if(ttsCurrentVerseEl){
    ttsCurrentVerseEl.classList.remove("verse-speaking");
    ttsCurrentVerseEl = null;
  }
}
function highlightVerse(verseEl){
  clearVerseHighlight();
  if(verseEl){
    verseEl.classList.add("verse-speaking");
    ttsCurrentVerseEl = verseEl;
  }
}

// Navigare pură către un verset (din "Citește capitolul", trimiteri, etc.) —
// doar derulează la el și îl evidențiază scurt, FĂRĂ să deschidă bara/foaia.
function scrollToVerseAndFlash(verseEl){
  if(!verseEl) return;
  verseEl.scrollIntoView({ behavior: "smooth", block: "center" });
  verseEl.classList.add("verse-flash");
  setTimeout(() => verseEl.classList.remove("verse-flash"), 1600);
}

function stopTts(){
  ttsSessionToken++; // invalidează orice callback aflat "în zbor"
  ttsChapterActive = false;
  ttsChapterVerseIdx = -1;
  ttsPaused = false;
  ttsPlayer.pause();
  ttsPlayer.currentTime = 0;
  clearVerseHighlight();
  updateChapterPlayerUI();
}

function pauseTts(){
  if(!ttsPlayer.paused){
    ttsPlayer.pause();
    ttsPaused = true;
    updateChapterPlayerUI();
  }
}
function resumeTts(){
  if(ttsPaused){
    ttsPlayer.play();
    ttsPaused = false;
    updateChapterPlayerUI();
  }
}

function getVerseElByNum(num){
  return versesEl.querySelector('.verse[data-num="' + num + '"]');
}

async function playSingleVerse(verse, verseEl){
  stopTts();
  const mySession = ttsSessionToken;
  const voiceProfile = ttsVoicePref();
  highlightVerse(verseEl);
  setChapterPlayerStatus("Se citește versetul " + verse.num + "…");
  try {
    const url = await fetchVerseAudio(plainVerseText(verse), voiceProfile);
    if(mySession !== ttsSessionToken) return; // s-a schimbat între timp (stop/alt verset)
    ttsPlayer.src = url;
    ttsPlayer.playbackRate = ttsSpeedPref();
    ttsPlayer.onended = () => {
      if(mySession !== ttsSessionToken) return;
      clearVerseHighlight();
      setChapterPlayerStatus("Citește capitolul");
    };
    await ttsPlayer.play();
  } catch(err){
    if(mySession !== ttsSessionToken) return;
    clearVerseHighlight();
    setChapterPlayerStatus("Eroare TTS: " + err.message);
  }
}

async function playChapterFromIndex(startIdx){
  stopTts();
  const mySession = ttsSessionToken;
  ttsChapterActive = true;
  const voiceProfile = ttsVoicePref();

  async function playIndex(idx){
    if(mySession !== ttsSessionToken || !ttsChapterActive) return;
    if(idx >= VERSES.length){
      stopTts();
      return;
    }
    ttsChapterVerseIdx = idx;
    const verse = VERSES[idx];
    const verseEl = getVerseElByNum(verse.num);
    highlightVerse(verseEl);
    if(verseEl) verseEl.scrollIntoView({ behavior: "smooth", block: "center" });
    setChapterPlayerStatus("Se citește versetul " + verse.num + "…");

    try {
      const url = await fetchVerseAudio(plainVerseText(verse), voiceProfile);
      if(mySession !== ttsSessionToken || !ttsChapterActive) return;

      // preîncarcă următorul verset în fundal, cât timp se redă acesta
      if(idx + 1 < VERSES.length){
        preloadVerseAudio(plainVerseText(VERSES[idx + 1]), voiceProfile);
      }

      ttsPlayer.src = url;
      ttsPlayer.playbackRate = ttsSpeedPref();
      ttsPlayer.onended = () => {
        if(mySession !== ttsSessionToken || !ttsChapterActive) return;
        playIndex(idx + 1);
      };
      await ttsPlayer.play();
    } catch(err){
      if(mySession !== ttsSessionToken) return;
      setChapterPlayerStatus("Eroare TTS: " + err.message);
      stopTts();
    }
  }

  await playIndex(startIdx);
}

function findStartVerseIndex(){
  // pornește de la versetul activ (highlight-uit) dacă există, altfel de la primul
  if(ttsCurrentVerseEl){
    const num = parseInt(ttsCurrentVerseEl.dataset.num, 10);
    const idx = VERSES.findIndex(v => v.num === num);
    if(idx !== -1) return idx;
  }
  return 0;
}

function chapterPlayPauseClicked(){
  if(ttsChapterActive && !ttsPaused && !ttsPlayer.paused){
    pauseTts();
  } else if(ttsChapterActive && ttsPaused){
    resumeTts();
  } else {
    playChapterFromIndex(findStartVerseIndex());
  }
}

function goToPrevVerse(){
  if(!ttsChapterActive) return;
  const newIdx = Math.max(0, ttsChapterVerseIdx - 1);
  playChapterFromIndex(newIdx);
}
function goToNextVerse(){
  if(!ttsChapterActive) return;
  const newIdx = Math.min(VERSES.length - 1, ttsChapterVerseIdx + 1);
  playChapterFromIndex(newIdx);
}

// --- UI player capitol ---
let chapterPlayerEls = null;
function setChapterPlayerStatus(text){
  if(chapterPlayerEls) chapterPlayerEls.statusEl.textContent = text;
}
function updateChapterPlayerUI(){
  if(!chapterPlayerEls) return;
  const playing = ttsChapterActive && !ttsPaused;
  chapterPlayerEls.playIcon.style.display = playing ? "none" : "";
  chapterPlayerEls.pauseIcon.style.display = playing ? "" : "none";
  chapterPlayerEls.stopBtn.disabled = !ttsChapterActive && !ttsPaused && ttsPlayer.paused && !ttsCurrentVerseEl;
  if(!ttsChapterActive && !ttsCurrentVerseEl){
    setChapterPlayerStatus("Citește capitolul");
  }
}

function buildChapterPlayerBar(){
  const bar = document.createElement("div");
  bar.className = "chapter-player-bar";
  bar.innerHTML = `
    <div class="cp-row">
      <button class="cp-btn cp-prev" title="Versetul anterior">⏮</button>
      <button class="cp-btn cp-playpause" title="Citește capitolul / Pauză">
        <svg class="cp-play-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        <svg class="cp-pause-icon" viewBox="0 0 24 24" fill="currentColor" style="display:none;"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>
      </button>
      <button class="cp-btn cp-next" title="Versetul următor">⏭</button>
      <button class="cp-btn cp-stop" title="Oprire">⏹</button>
      <div class="cp-status">Citește capitolul</div>
    </div>
    <div class="cp-row cp-row-controls">
      <div class="cp-speed-group">
        <button class="cp-chip cp-speed" data-speed="0.8">0.8×</button>
        <button class="cp-chip cp-speed active" data-speed="1">1×</button>
        <button class="cp-chip cp-speed" data-speed="1.2">1.2×</button>
        <button class="cp-chip cp-speed" data-speed="1.5">1.5×</button>
      </div>
    </div>
  `;

  const playIcon = bar.querySelector(".cp-play-icon");
  const pauseIcon = bar.querySelector(".cp-pause-icon");
  const statusEl = bar.querySelector(".cp-status");
  const stopBtn = bar.querySelector(".cp-stop");

  bar.querySelector(".cp-playpause").addEventListener("click", chapterPlayerClickWrapper);
  bar.querySelector(".cp-prev").addEventListener("click", goToPrevVerse);
  bar.querySelector(".cp-next").addEventListener("click", goToNextVerse);
  stopBtn.addEventListener("click", stopTts);

  bar.querySelectorAll(".cp-speed").forEach(btn => {
    btn.addEventListener("click", () => {
      bar.querySelectorAll(".cp-speed").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const speed = parseFloat(btn.dataset.speed);
      setTtsSpeedPref(speed);
      ttsPlayer.playbackRate = speed; // se aplică imediat, chiar în timpul redării
    });
  });

  // aplică preferința de viteză salvată la construirea barei
  const savedSpeed = ttsSpeedPref();
  bar.querySelectorAll(".cp-speed").forEach(b => b.classList.toggle("active", parseFloat(b.dataset.speed) === savedSpeed));

  chapterPlayerEls = { playIcon, pauseIcon, statusEl, stopBtn };
  return bar;
}
function chapterPlayerClickWrapper(){
  chapterPlayPauseClicked();
}

ttsPlayer.addEventListener("play", updateChapterPlayerUI);
ttsPlayer.addEventListener("pause", updateChapterPlayerUI);

function renderVerses(){
  const aprofundare = (appMode === "aprofundare");
  versesEl.classList.toggle("mode-citire", !aprofundare);
  VERSES.forEach(verse => {
    const p = document.createElement("p");
    p.className = "verse";
    p.dataset.num = verse.num;

    const vnum = document.createElement("span");
    vnum.className = "vnum";
    vnum.textContent = verse.num;
    p.appendChild(vnum);


    if(currentVersion !== "rosen" && verse[currentVersion]){
      // versiune alternativă (ex. Fidela) — text simplu, fără tagare pe cuvinte
      p.appendChild(document.createTextNode(verse[currentVersion]));
    } else if(currentVersion !== "rosen"){
      // versiunea aleasă nu are încă text pentru acest capitol — se arată Rosen, fără nicio notă
      verse.tokens.forEach(tok => p.appendChild(document.createTextNode(tok.t)));
    } else {
    verse.tokens.forEach(tok => {
      if(tok.w && aprofundare){
        // token-urile pot fi fraze întregi ("a fost", "DOMNUL Dumnezeu") -- un singur
        // span pentru toată fraza, cu un singur panou lexical; 3 puncte sub un cuvânt
        // simplu, 6 puncte sub o frază de mai multe cuvinte (fără să umple lățimea).
        const span = document.createElement("span");
        span.className = "word" + (tok.t.trim().includes(" ") ? " word-phrase" : "");
        span.textContent = tok.t;
        span.addEventListener("click", (e) => {
          e.stopPropagation();
          showWordPopover(tok, span);
        });
        p.appendChild(span);
      } else if(tok.editorial){
        const span = document.createElement("span");
        span.className = "editorial";
        span.textContent = tok.t;
        p.appendChild(span);
      } else {
        p.appendChild(document.createTextNode(tok.t));
      }
    });
    }

    if(aprofundare){
      const hint = document.createElement("span");
      hint.className = "comment-hint comment-note-chip";
      hint.textContent = "note";
      p.appendChild(hint);
    }
    // Atinge versetul (în ambele moduri) → deschide foaia de acțiuni
    p.addEventListener("click", () => openVerseSheet(verse, p));
    applyVerseMarkStyle(p, currentBookSlug, currentChapter, verse.num);
    versesEl.appendChild(p);

    if(aprofundare && verse.refs && verse.refs.length){
      const refsRow = document.createElement("div");
      refsRow.className = "inline-refs";
      verse.refs.forEach((refText, idx) => {
        if(idx > 0){
          const sep = document.createElement("span");
          sep.className = "ref-sep";
          sep.textContent = "·";
          refsRow.appendChild(sep);
        }
        const pill = document.createElement("span");
        pill.className = "ref-pill ref-pill-clickable";
        pill.textContent = refText;
        pill.addEventListener("click", (e) => {
          e.stopPropagation();
          showRefPreview(refText, pill);
        });
        refsRow.appendChild(pill);
      });
      versesEl.appendChild(refsRow);
    }
  });
}

function parseRefBookChapterVerse(refText){
  const book = findBookBySlugName(refText);
  if(!book) return null;
  // Capitolul și versetul se iau din forma „cap:vers”, ca să nu fie confundată
  // cifra din numele cărților numerotate („1 Samuel 24:4”) cu numărul capitolului.
  const m = refText.match(/(\d+)\s*:\s*(\d+)(?:\s*[-–]\s*(\d+))?/)
    || refText.replace(/^\s*[1-3]\s+/, "").match(/(\d+)\D+(\d+)(?:-(\d+))?/);
  if(!m) return null;
  const chapter = parseInt(m[1], 10);
  const verse = parseInt(m[2], 10);
  const endVerse = m[3] ? parseInt(m[3], 10) : verse;
  return { book, chapter, verse, endVerse };
}

let pendingRefNav = null; // { book, chapter, verse } - tinut minte pentru butonul "Mergi la pasaj"
let pendingHaftarahNav = null; // { book, idx } - varianta pentru butonul "Mergi la pasaj" cand panoul arata o Haftarah

function renderRefPreviewVerses(textEl, versesArray, startNum, endNum){
  textEl.innerHTML = "";
  let found = 0;
  for(let n = startNum; n <= endNum; n++){
    const v = versesArray.find(v => Number(v.num) === n);
    if(!v) continue;
    found++;
    // Fiecare verset pe rândul lui, în ordine — nu toate înșirate într-un
    // singur paragraf continuu.
    const line = document.createElement("div");
    line.className = "ref-preview-vline";
    const numSpan = document.createElement("span");
    numSpan.className = "vnum";
    numSpan.textContent = n;
    line.appendChild(numSpan);
    line.appendChild(document.createTextNode(plainVerseText(v)));
    textEl.appendChild(line);
  }
  if(!found){
    textEl.textContent = (startNum === endNum)
      ? ("Versetul " + startNum + " nu a fost g\u0103sit.")
      : ("Versetele " + startNum + "-" + endNum + " nu au fost g\u0103site.");
  }
}

function showRefPreview(refText, anchorEl, parchment){
  const parsed = parseRefBookChapterVerse(refText);
  if(!parsed || !chapterIsAvailable(parsed.book.slug, parsed.chapter)){
    console.warn("DAVAR ref-preview: nu s-a putut interpreta referinta:", refText, parsed);
    showRefUnavailable(anchorEl, refText, parchment);
    return;
  }
  const titleEl = document.getElementById("ref-preview-title");
  const textEl = document.getElementById("ref-preview-text");
  const popover = document.getElementById("ref-preview-popover");
  if(!titleEl || !textEl || !popover){
    console.error("DAVAR ref-preview: lipsesc elementele din pagina.");
    return;
  }

  // Varianta "parchament" (modelul panoului lexical) \u2014 doar la s\u0103ge\u021bile de pe
  // Acas\u0103 (Pericopa s\u0103pt\u0103m\u00e2nii), nu la trimiterile inline din citire.
  popover.classList.toggle("rp-parchment", !!parchment);
  if(parchment){
    popover.classList.remove("rp-theme-light", "rp-theme-sepia");
    // golim stilurile inline puse de preferințele de citire (font/mărime) —
    // în modul parchament, fontul e cel fix din CSS (.rp-parchment), nu cel ales de utilizator.
    textEl.style.fontFamily = "";
    textEl.style.fontSize = "";
    titleEl.textContent = refText;
    document.getElementById("ref-preview-go").style.display = "";
    textEl.textContent = "Se \u00eencarc\u0103\u2026";
    pendingRefNav = parsed;
    pendingHaftarahNav = null;
    popover.classList.add("show"); rpHolidayReset();
    hideWordPopover();
    const sameChapterNowP = String(currentBookSlug) === String(parsed.book.slug) && Number(currentChapter) === Number(parsed.chapter);
    if(sameChapterNowP && Array.isArray(VERSES) && VERSES.length){
      renderRefPreviewVerses(textEl, VERSES, parsed.verse, parsed.endVerse);
      return;
    }
    const urlP = parsed.book.slug + "-" + parsed.chapter + ".js";
    fetch(urlP)
      .then(r => { if(!r.ok) throw new Error("HTTP " + r.status + " la " + urlP); return r.text(); })
      .then(txt => {
        const jsonStr = txt.replace(/^[\s\S]*?window\.CHAPTER_DATA\s*=\s*/, "").replace(/;\s*$/, "");
        const data = JSON.parse(jsonStr);
        renderRefPreviewVerses(textEl, data, parsed.verse, parsed.endVerse);
      })
      .catch((err) => {
        console.error("DAVAR ref-preview: eroare la incarcarea pasajului", urlP, err);
        textEl.textContent = "Nu s-a putut \u00eenc\u0103rca pasajul (" + urlP + ").";
      });
    return;
  }

  // Panoul de referin\u021b\u0103 urmeaz\u0103 tema de citire, fontul \u0219i m\u0103rimea alese de utilizator
  // pentru textul versetelor \u2014 textul aici nu e niciodat\u0103 mai mare dec\u00e2t cel al versetului.
  const refPrefs = vsGetTextPrefs();
  const refFontObj = VS_FONTS.find(f => f.id === refPrefs.font) || VS_FONTS[0];
  popover.classList.remove("rp-theme-light", "rp-theme-sepia");
  if(refPrefs.theme === "light" || refPrefs.theme === "sepia") popover.classList.add("rp-theme-" + refPrefs.theme);
  textEl.style.fontFamily = refFontObj.css;
  textEl.style.fontSize = Math.min(14, refPrefs.size) + "px";

  titleEl.textContent = refText;
  document.getElementById("ref-preview-go").style.display = "";
  textEl.textContent = "Se \u00eencarc\u0103\u2026";
  pendingRefNav = parsed;
  pendingHaftarahNav = null;
  popover.classList.add("show"); rpHolidayReset();
  hideWordPopover();

  const sameChapterNow = String(currentBookSlug) === String(parsed.book.slug) && Number(currentChapter) === Number(parsed.chapter);

  if(sameChapterNow && Array.isArray(VERSES) && VERSES.length){
    renderRefPreviewVerses(textEl, VERSES, parsed.verse, parsed.endVerse);
    return;
  }

  const url = parsed.book.slug + "-" + parsed.chapter + ".js";
  fetch(url)
    .then(r => {
      if(!r.ok) throw new Error("HTTP " + r.status + " la " + url);
      return r.text();
    })
    .then(txt => {
      const jsonStr = txt.replace(/^[\s\S]*?window\.CHAPTER_DATA\s*=\s*/, "").replace(/;\s*$/, "");
      const data = JSON.parse(jsonStr);
      renderRefPreviewVerses(textEl, data, parsed.verse, parsed.endVerse);
    })
    .catch((err) => {
      console.error("DAVAR ref-preview: eroare la incarcarea pasajului", url, err);
      textEl.textContent = "Nu s-a putut \u00eenc\u0103rca pasajul (" + url + ").";
    });
}

function hideRefPreview(){
  document.getElementById("ref-preview-popover").classList.remove("show");
  rpHolidayReset();
}

// Panoul dedicat pentru o referință de Haftarah (diferit de showRefPreview,
// care arată text brut de capitol din Tora): titlul Haftarei, referința
// scripturală și un rezumat scurt, extras automat din introducerea deja
// scrisă — reutilizează același popover vizual (#ref-preview-popover), dar
// butonul "→" duce la cititorul de Haftarot din tab-ul Biblia, nu în Biblia
// obișnuită.
// Titlurile de Haftarah sunt fie "Ebraic - Român" (ex. "Bereșit - La început"),
// fie, la unele din Haftarot — Sărbători, "Ebraic calificativ (Român)" (ex.
// "Pesah ziua 1 (Paștele)") — încercăm ambele modele, ca să separăm numele
// ebraic de traducerea română pe rânduri distincte.
function splitHaftarahTitle(title){
  let m = /^(.+?)\s-\s(.+)$/.exec(title || "");
  if(m) return { line1: m[1].trim(), line2: m[2].trim() };
  m = /^(.+?)\s\(([^)]+)\)\s*$/.exec(title || "");
  if(m) return { line1: m[1].trim(), line2: m[2].trim() };
  return { line1: (title || "").trim(), line2: "" };
}
// Titlul panoului "parchament" (vezi showHaftarahPreview) pe 3 rânduri
// distincte — numele ebraic, traducerea română, referința — fiecare încăpând
// pe un singur rând (vezi CSS .rp-title-*), nu înghesuite într-o singură
// linie lungă, înfundată.
function renderPreviewTitle3Lines(titleEl, fullTitle, ref){
  titleEl.textContent = "";
  const { line1, line2 } = splitHaftarahTitle(fullTitle);
  const l1 = document.createElement("div");
  l1.className = "rp-title-he";
  l1.textContent = line1;
  titleEl.appendChild(l1);
  if(line2){
    const l2 = document.createElement("div");
    l2.className = "rp-title-ro";
    l2.textContent = line2;
    titleEl.appendChild(l2);
  }
  if(ref){
    const l3 = document.createElement("div");
    l3.className = "rp-title-ref";
    l3.textContent = ref;
    titleEl.appendChild(l3);
  }
}
// Micșorează DOAR rândurile de titlu care nu încap pe o singură linie la
// mărimea de bază (14.5px) — nu o ierarhie fixă de mărimi diferite per rând.
function fitPreviewTitleLines(titleEl){
  const minPx = 10;
  titleEl.querySelectorAll(".rp-title-he, .rp-title-ro, .rp-title-ref").forEach(el => {
    el.style.fontSize = "";
    let size = parseFloat(getComputedStyle(el).fontSize);
    let guard = 40;
    while(el.scrollWidth > el.clientWidth + 1 && size > minPx && guard-- > 0){
      size -= 0.5;
      el.style.fontSize = size + "px";
    }
  });
}
function showHaftarahPreview(match, anchorEl){
  const titleEl = document.getElementById("ref-preview-title");
  const textEl = document.getElementById("ref-preview-text");
  const popover = document.getElementById("ref-preview-popover");
  if(!titleEl || !textEl || !popover) return;

  // La fel ca la showRefPreview(parchment=true) — e apelată doar de pe Acasă
  // (Pasaj din Profeți), așa că ia mereu varianta "parchament".
  popover.classList.add("rp-parchment");
  popover.classList.remove("rp-theme-light", "rp-theme-sepia");
  textEl.style.fontFamily = "";
  textEl.style.fontSize = "";

  renderPreviewTitle3Lines(titleEl, match.title, match.ref);
  // Sărbătorile/ocaziile speciale (Simhat Tora, Roș Hașana etc.) nu sunt încă
  // în lista de 57 de Haftarot obișnuite — panoul se arată onest, fără
  // rezumat inventat și fără buton spre un capitol care nu există încă,
  // dar apare la fel ca la orice altă referință, nu ascuns.
  const hasTarget = match.book && typeof match.idx === "number";
  const goBtn = document.getElementById("ref-preview-go");
  goBtn.style.display = hasTarget ? "" : "none";
  textEl.textContent = hasTarget ? "Se încarcă…" : "";
  pendingRefNav = null;
  pendingHaftarahNav = hasTarget ? match : null;
  popover.classList.add("show"); rpHolidayReset();
  hideWordPopover();
  fitPreviewTitleLines(titleEl);

  if(hasTarget){
    loadHaftarahIntro(match.book, match.idx, (intro) => {
      if(pendingHaftarahNav !== match) return; // utilizatorul a deschis între timp alt pasaj
      textEl.textContent = intro ? firstSentences(intro, 3) : "Introducerea acestei Haftara nu e încă scrisă.";
    });
  }
}

// Descrieri scurte (2 fraze) pentru sărbătorile evreiești din "Sărbătorile
// calendaristice" (Acasă), plus numărul capitolului din Haftarot — Sărbători
// (HAFTAROT_BOOKS) unde există o lectură dedicată. Hanuca/Purim n-au un
// capitol legat direct de ziua calendaristică însăși (Hanuca are haftară
// doar pentru Șabatul care cade în mijlocul ei, Purim nu are deloc) — rămân
// onest fără buton "citește". Trăiește aici (nu în modulul ES al
// calendarului) ca să aibă acces direct la HAFTAROT_BOOKS și
// pendingRefNav/pendingHaftarahNav — un modul ES nu vede niciodată variabilele
// unui <script> clasic ca identificatori simpli, doar prin window, și acolo
// doar pentru ce e expus explicit (vezi window.JEWISH_HOLIDAY_INFO mai jos).
const JEWISH_HOLIDAY_INFO = {
  "Roș Hașana": { nameRo: "Anul Nou evreiesc", desc: "Anul Nou evreiesc, ziua în care, potrivit tradiției, a fost creat omul — zi de judecată și de sunat din șofar, vestind atât dreptatea cât și mila divină. Se ține două zile la rând, ambele cu aceeași rânduială.", chapterNum: 19 },
  "Roș Hașana (ziua a doua)": { nameRo: "Anul Nou evreiesc, ziua a doua", desc: "A doua zi a Anului Nou, ținută ca o singură sărbătoare prelungită cu prima, cu aceleași rugăciuni de pocăință și sunatul șofarului. Haftara zilei leagă nașterea lui Samuel de tema rugăciunii ascultate.", chapterNum: 20 },
  "Iom Kipur": { nameRo: "Ziua Ispășirii", desc: "Ziua Ispășirii, cea mai sfântă zi a anului evreiesc — post deplin de 25 de ore și rugăciune neîntreruptă, pentru ispășirea păcatelor dintre om și Dumnezeu. Se încheie cu sunetul prelung al șofarului, la apusul soarelui.", chapterNum: 21 },
  "Sucot": { nameRo: "Sărbătoarea Corturilor", desc: "Sărbătoarea Corturilor, când israeliții locuiesc șapte zile în colibe temporare, aducând aminte de popasul din pustiu după ieșirea din Egipt. Se ține laolaltă cu cele patru specii (lulav, etrog, mirt, salcie).", chapterNum: 23 },
  "Șmini Ațeret": { nameRo: "A opta zi de adunare", desc: "A opta zi de adunare, imediat după Sucot — o sărbătoare de sine stătătoare, de încheiere solemnă, fără poruncile specifice ale colibei sau ale celor patru specii. În diasporă cade în aceeași zi cu Simhat Tora.", chapterNum: 26 },
  "Simhat Tora": { nameRo: "Bucuria Torei", desc: "Bucuria Torei — ziua în care se încheie și se reîncepe imediat ciclul anual de citire a Torei, sărbătorită cu dansuri și procesiuni cu sulurile Legii. Ultimul capitol al Deuteronomului e citit și legat direct de primul al Genezei.", chapterNum: 27 },
  "Hanuca (prima lumânare)": { nameRo: "Sărbătoarea Luminilor, prima lumânare", desc: "Sărbătoarea Luminilor, opt zile în care se aprinde câte o lumânare în plus la hanukia, în amintirea minunii untdelemnului din Templul reluat de Macabei. Nu are o haftară proprie — doar Șabatul care cade în cele opt zile are o lectură specială." },
  "Hanuca (ultima lumânare)": { nameRo: "Sărbătoarea Luminilor, ultima lumânare", desc: "A opta și ultima lumânare a Hanucăi, când hanukia arde în întregime, cu toate cele opt lumini aprinse. Sărbătoarea amintește rededicarea Templului, nu o biruință pe câmpul de luptă." },
  "Purim": { nameRo: "Sărbătoarea Sorților", desc: "Sărbătoarea care amintește scăparea evreilor din Persia de la nimicirea plănuită de Haman, prăznuită cu citirea Cărții Esterei, daruri și bucurie. Cartea Esterei nu are o haftară proprie în ciclul obișnuit al Sabatului." },
  "Pesah (prima zi)": { nameRo: "Paștele evreiesc, prima zi", desc: "Paștele evreiesc, amintirea ieșirii din robia Egiptului, deschis cu seder-ul de Paște și interdicția aluatului dospit (hametz) pe toată durata sărbătorii. Haftara primei zile leagă trecerea Iordanului de ieșirea din Egipt.", chapterNum: 10 },
  "Pesah (ultima zi)": { nameRo: "Paștele evreiesc, ultima zi", desc: "Ultima zi a Pesahului (a opta, în diasporă), care încheie sărbătoarea eliberării din Egipt. Haftara zilei vestește un vlăstar din rădăcina lui Iese și o nouă cântare de izbăvire.", chapterNum: 14 },
  "Șavuot": { nameRo: "Sărbătoarea Săptămânilor", desc: "Sărbătoarea Săptămânilor, cincizeci de zile după Pesah, care amintește dăruirea Torei pe Muntele Sinai. Haftara zilei are viziunea lui Ezechiel asupra Carului divin, ecou al revelației de la Sinai.", chapterNum: 15 },
  "Tișa BeAv": { nameRo: "9 Av — ziua de post", desc: "9 Av, ziua de post și jale pentru dărâmarea ambelor Temple din Ierusalim și pentru alte tragedii ale istoriei evreiești. Haftara dimineții e plânsul lui Ieremia pentru pustiirea iminentă a cetății.", chapterNum: 17 },
};
window.JEWISH_HOLIDAY_INFO = JEWISH_HOLIDAY_INFO; // citit din modulul ES al calendarului (vezi renderCalendarInto)
// Previzualizare pentru sărbătorile evreiești din calendar — același panou
// standard (#ref-preview-popover) folosit la Haftarot/pericope, cu titlul pe
// linii (nume ebraic / traducere română / referință) și, doar când există un
// capitol dedicat în Haftarot — Sărbători, butonul "→ citește capitolul".
function showHolidayPreview(name, anchorEl, system){
  const titleEl = document.getElementById("ref-preview-title");
  const textEl = document.getElementById("ref-preview-text");
  const popover = document.getElementById("ref-preview-popover");
  if(!titleEl || !textEl || !popover) return;
  const info = (system === "ro" || system === "de") ? null : JEWISH_HOLIDAY_INFO[name];

  popover.classList.add("rp-parchment");
  popover.classList.remove("rp-theme-light", "rp-theme-sepia");
  textEl.style.fontFamily = "";
  textEl.style.fontSize = "";

  let match = null;
  if(info && info.chapterNum && typeof HAFTAROT_BOOKS !== "undefined"){
    const book = HAFTAROT_BOOKS.find(b => b.slug === "haftarot-sarbatori");
    if(book){
      const idx = book.chapters.findIndex(c => c.num === info.chapterNum);
      if(idx >= 0) match = { book, idx, title: book.chapters[idx].title, ref: book.chapters[idx].ref };
    }
  }
  renderPreviewTitle3Lines(titleEl, info && info.nameRo ? (name + " - " + info.nameRo) : name, match ? match.ref : "");
  textEl.textContent = info ? info.desc : "";
  const goBtn = document.getElementById("ref-preview-go");
  goBtn.style.display = match ? "" : "none";
  pendingRefNav = null;
  pendingHaftarahNav = match;
  popover.classList.add("show"); rpHolidayReset();
  if(system === "ro" || system === "de") showHolidayDetail(system, name);
  hideWordPopover();
  fitPreviewTitleLines(titleEl);
}
window.showHolidayPreview = showHolidayPreview; // apelat din modulul ES al calendarului

// Sărbători românești/germane: rezumat (4 propoziții), „Citește mai mult” cu restul
// textului și iconița ⓘ cu sursele — texte verificate, în public/sarbatori-detalii.js.
// Elementele extra se ascund la orice alt panou de referință (vezi rpHolidayReset).
function rpHolidayReset(){
  const ids = ["ref-preview-more-btn", "ref-preview-more", "ref-preview-src", "ref-preview-info"];
  ids.forEach(id => { const el = document.getElementById(id); if(el) el.style.display = "none"; });
  const btn = document.getElementById("ref-preview-more-btn");
  if(btn) btn.textContent = "Citește mai mult ⌄";
}
function showHolidayDetail(system, name){
  rpHolidayReset();
  const det = window.SARBATORI_DETALII && window.SARBATORI_DETALII[system] && window.SARBATORI_DETALII[system][name];
  if(!det) return false;
  document.getElementById("ref-preview-text").textContent = det.s;
  const more = document.getElementById("ref-preview-more");
  const moreBtn = document.getElementById("ref-preview-more-btn");
  more.textContent = det.m || "";
  if(det.m) moreBtn.style.display = "";
  const src = document.getElementById("ref-preview-src");
  src.textContent = "";
  const ttl = document.createElement("div");
  ttl.className = "rp-src-title";
  ttl.textContent = "Surse";
  src.appendChild(ttl);
  (det.src || []).forEach(s => { const p = document.createElement("div"); p.className = "rp-src-item"; p.textContent = s; src.appendChild(p); });
  document.getElementById("ref-preview-info").style.display = "";
  return true;
}
document.getElementById("ref-preview-more-btn").addEventListener("click", (e) => {
  e.stopPropagation();
  const more = document.getElementById("ref-preview-more");
  const open = more.style.display === "none";
  more.style.display = open ? "block" : "none";
  e.currentTarget.textContent = open ? "Citește mai puțin ⌃" : "Citește mai mult ⌄";
});
document.getElementById("ref-preview-info").addEventListener("click", (e) => {
  e.stopPropagation();
  const src = document.getElementById("ref-preview-src");
  src.style.display = src.style.display === "none" ? "block" : "none";
});

// Închidere la click în afara panoului (la fel ca la panoul de cuvinte/lexicon),
// pe lângă butonul "✕", care rămâne disponibil.
document.addEventListener("click", (e) => {
  const refPopover = document.getElementById("ref-preview-popover");
  if(!refPopover || !refPopover.classList.contains("show")) return;
  if(!refPopover.contains(e.target) && !e.target.classList.contains("ref-pill-clickable")){
    hideRefPreview();
  }
});

function goToRefReal(){
  if(pendingHaftarahNav){
    const match = pendingHaftarahNav;
    hideRefPreview();
    switchTab("biblia");
    if(typeof window.openHaftarahAt === "function") window.openHaftarahAt(match.book, match.idx);
    return;
  }
  const parsed = pendingRefNav;
  if(!parsed) return;
  hideRefPreview();
  if(typeof window.closeLibReaderForNav === "function") window.closeLibReaderForNav();
  switchTab("biblia");
  if(currentBookSlug === parsed.book.slug && currentChapter === parsed.chapter && Array.isArray(VERSES) && VERSES.length){
    const el = document.querySelector(`.verse[data-num="${parsed.verse}"]`);
    scrollToVerseAndFlash(el);
    return;
  }
  currentBookSlug = parsed.book.slug;
  loadChapterThenOpenVerse(parsed.chapter, parsed.verse);
}

document.getElementById("ref-preview-go").addEventListener("click", goToRefReal);
document.getElementById("ref-preview-close").addEventListener("click", hideRefPreview);

function refPreviewShareText(){
  const title = document.getElementById("ref-preview-title").textContent;
  let text = document.getElementById("ref-preview-text").textContent.trim();
  const moreEl = document.getElementById("ref-preview-more");
  if(moreEl && moreEl.style.display === "block") text += " " + moreEl.textContent.trim();
  return text ? ("„" + text + "” — " + title) : title;
}
document.getElementById("ref-preview-copy").addEventListener("click", (e) => {
  e.stopPropagation();
  const text = refPreviewShareText();
  const doCopy = () => showVsToast("Pasaj copiat");
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(doCopy).catch(doCopy);
  } else {
    doCopy();
  }
});
document.getElementById("ref-preview-share").addEventListener("click", (e) => {
  e.stopPropagation();
  const text = refPreviewShareText();
  if(navigator.share){
    navigator.share({ text }).catch(() => {});
  } else if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(() => showVsToast("Copiat — gata de trimis"));
  } else {
    showVsToast("Trimiterea nu e disponibilă pe acest dispozitiv");
  }
});

function loadChapterThenOpenVerse(chapterNum, verseNum){
  const book = getBook(currentBookSlug);
  currentChapter = chapterNum;
  bookPillLabel.textContent = book.name + " " + chapterNum;
  if(typeof stopTts === "function") stopTts();

  const existing = document.getElementById("chapter-data-script");
  if(existing) existing.remove();
  window.CHAPTER_DATA = null;

  const script = document.createElement("script");
  script.id = "chapter-data-script";
  script.src = currentBookSlug + "-" + chapterNum + ".js";
  script.onload = () => {
    if(!window.CHAPTER_DATA || !window.CHAPTER_DATA.length) return;
    VERSES = window.CHAPTER_DATA;
    versesEl.innerHTML = "";
    renderVerses();
    updateChapterNavFloat();
    const targetVerse = VERSES.find(v => v.num === verseNum);
    if(targetVerse){
      switchTab("biblia");
      const el = document.querySelector(`.verse[data-num="${targetVerse.num}"]`);
      scrollToVerseAndFlash(el);
    }
  };
  document.body.appendChild(script);
}

// Un pasaj fără capitol digitizat încă — același panou standard
// (#ref-preview-popover) ca orice altă referință, nu o componentă separată
// (folosea înainte panoul de lexicon, #word-popover) — doar fără buton
// "→ citește capitolul", că nu există încă acea destinație.
function showRefUnavailable(anchorEl, refText, parchment){
  const titleEl = document.getElementById("ref-preview-title");
  const textEl = document.getElementById("ref-preview-text");
  const popover = document.getElementById("ref-preview-popover");
  if(!titleEl || !textEl || !popover) return;
  popover.classList.toggle("rp-parchment", !!parchment);
  if(parchment) popover.classList.remove("rp-theme-light", "rp-theme-sepia");
  hideWordPopover();
  titleEl.textContent = refText;
  textEl.textContent = "";
  document.getElementById("ref-preview-go").style.display = "none";
  pendingRefNav = null;
  pendingHaftarahNav = null;
  popover.classList.add("show"); rpHolidayReset();
}


function openDrawer(verse){
  document.querySelectorAll(".verse").forEach(v => v.classList.remove("open"));
  document.querySelector(`.verse[data-num="${verse.num}"]`).classList.add("open");

  const book = getBook(currentBookSlug);
  drawerRef.textContent = book.name + " " + currentChapter + ":" + verse.num;

  // Respectă traducerea selectată (Rosen/Fidela) — înainte arăta mereu Rosen,
  // indiferent ce era ales în selectorul de sus.
  if(currentVersion !== "rosen" && verse[currentVersion]){
    drawerVerseText.textContent = "„" + verse[currentVersion] + "”";
  } else {
    drawerVerseText.textContent = "„" + plainVerseText(verse) + "”";
  }

  drawerContent.innerHTML = "";

  if(verse.commentaries && verse.commentaries.length){
    const group = makeAccordionGroup(
      "Comentarii",
      verse.commentaries.map(c => ({ headerLabel: c.author, text: c.text })),
      item => item.text
    );
    drawerContent.appendChild(group);
  }

  if(verse.textCompare && verse.textCompare.length){
    const group = makeAccordionGroup(
      "Comparație texte",
      verse.textCompare.map(c => ({ headerLabel: c.source, data: c })),
      item => {
        const c = item.data;
        const origClass = c.greek ? "orig-block greek" : "orig-block";
        let html = `<div class="${origClass}">${c.original}</div>`;
        html += `<div>${c.translation}</div>`;
        if(c.note){
          html += `<div class="note">${c.note}</div>`;
        }
        return html;
      }
    );
    drawerContent.appendChild(group);
  }

  drawer.classList.add("show");
  backdrop.classList.add("show");
  hideWordPopover();
}

function closeDrawer(){
  drawer.classList.remove("show");
  backdrop.classList.remove("show");
  document.querySelectorAll(".verse").forEach(v => v.classList.remove("open"));
}

document.getElementById("drawer-close").addEventListener("click", closeDrawer);
backdrop.addEventListener("click", () => { closeDrawer(); hideWordPopover(); if(typeof hideRefPreview === "function") hideRefPreview(); });

// Textul din medalion (ebraică/transliterare) trebuie să încapă mereu în
// cercul fix al medalionului — la tag-urile cu 2 cuvinte ebraice legate,
// textul e mai lung decât la un singur cuvânt, așa că mărimea fontului se
// scalează după lungimea reală a textului, nu rămâne fixă.
function wpFitSize(text, baseSize, minSize, charsAtBase){
  const len = (text || "").length;
  if(len <= charsAtBase) return baseSize;
  return Math.max(minSize, Math.round(baseSize * (charsAtBase / len)));
}

function showWordPopover(tok, anchorEl){
  document.querySelectorAll(".word").forEach(w => w.classList.remove("active-word"));
  anchorEl.classList.add("active-word");

  // Titlul cardului arată cuvântul/fraza curată, fără ghilimelele de citare
  // rămase din textul Rosen (ex. „Să fie", „Dumnezeu) la marginile frazei-token.
  document.getElementById("wp-word").textContent = (tok.t || "").replace(/^[„"“”‘’«»'"]+|[„"“”‘’«»'",.;:!?]+$/g, "").trim();
  const wpHebEl = document.getElementById("wp-heb");
  const wpTranslitEl = document.getElementById("wp-translit");
  wpHebEl.textContent = tok.heb;
  wpTranslitEl.textContent = tok.translit;
  wpHebEl.style.fontSize = wpFitSize(tok.heb, 30, 15, 7) + "px";
  wpTranslitEl.style.fontSize = wpFitSize(tok.translit, 21, 12, 9) + "px";
  document.getElementById("wp-strong").textContent = tok.pos || "";
  document.getElementById("wp-def").textContent = tok.def_ro || "";

  // Traducerea românească scurtă din greek_def_ro (ex. "ὁ Θεός (ho Theos) — Dumnezeu."
  // → "Dumnezeu"), pentru secțiunea LXX — fără fraza completă, care s-a mutat
  // la "Diferență ebraică / greacă".
  const greekGloss = (() => {
    if(!tok.greek_def_ro) return "";
    const m = tok.greek_def_ro.match(/—\s*(.+)$/);
    if(!m) return "";
    return m[1].split(/[;,]/)[0].trim().replace(/\.$/, "");
  })();

  // Definiția greacă completă se arată în blocul de diferență doar dacă spune mai mult decât glosa scurtă din linia LXX.
  const greekGlossFull = (t) => { const m = (t.greek_def_ro || "").match(/—\s*(.+)$/); return m ? m[1].trim().replace(/\.$/, "") : ""; };
  const extraEl = document.getElementById("wp-extra");
  let extraHtml = "";
  if(tok.greek){
    extraHtml += `<div class="wp-extra-block"><span class="wp-extra-label">LXX (Septuaginta)</span><span class="wp-greek">${tok.greek}${greekGloss ? " — " + greekGloss : ""}</span></div>`;
  }
  // "Definiție greacă" nu mai e secțiune separată — fraza completă se adună,
  // împreună cu diff_ro (dacă există), sub "Diferență ebraică / greacă".
  // Blocul apare doar când există o diferență reală (diff_ro); altfel ar repeta exact linia LXX de mai sus.
  if(tok.diff_ro){
    extraHtml += `<div class="wp-extra-block"><span class="wp-extra-label">Diferență ebraică / greacă</span>` +
      (tok.greek_def_ro && greekGlossFull(tok) !== greekGloss ? `${tok.greek_def_ro} ` : "") + (tok.diff_ro || "") + `</div>`;
  }
  if(tok.dict_ro){
    extraHtml += `<div class="wp-extra-block"><span class="wp-extra-label">Dicționar biblic</span>${tok.dict_ro}</div>`;
  }
  extraEl.innerHTML = extraHtml;

  wordPopover.classList.add("show");
  wordPopover.scrollTop = 0;
}

function hideWordPopover(){
  wordPopover.classList.remove("show");
  document.querySelectorAll(".word").forEach(w => w.classList.remove("active-word"));
}

document.getElementById("wp-close").addEventListener("click", hideWordPopover);
document.addEventListener("click", (e) => {
  if(!wordPopover.contains(e.target) && !e.target.classList.contains("word")){
    hideWordPopover();
  }
});

// =====================================================================
// NAVIGARE — Testament → Carte → Capitol
// =====================================================================
const BOOKS = [
  // Vechiul Testament
  { slug: "genesis", name: "Geneza", chapters: 50, testament: "vt" },
  { slug: "exodus", name: "Exodul", chapters: 40, testament: "vt" },
  { slug: "leviticus", name: "Leviticul", chapters: 27, testament: "vt" },
  { slug: "numbers", name: "Numeri", chapters: 36, testament: "vt" },
  { slug: "deuteronomy", name: "Deuteronomul", chapters: 34, testament: "vt" },
  { slug: "joshua", name: "Iosua", chapters: 24, testament: "vt" },
  { slug: "judges", name: "Judecători", chapters: 21, testament: "vt" },
  { slug: "ruth", name: "Rut", chapters: 4, testament: "vt" },
  { slug: "i_samuel", name: "1 Samuel", chapters: 31, testament: "vt" },
  { slug: "ii_samuel", name: "2 Samuel", chapters: 24, testament: "vt" },
  { slug: "i_kings", name: "1 Împărați", chapters: 22, testament: "vt" },
  { slug: "ii_kings", name: "2 Împărați", chapters: 25, testament: "vt" },
  { slug: "i_chronicles", name: "1 Cronici", chapters: 29, testament: "vt" },
  { slug: "ii_chronicles", name: "2 Cronici", chapters: 36, testament: "vt" },
  { slug: "ezra", name: "Ezra", chapters: 10, testament: "vt" },
  { slug: "nehemiah", name: "Neemia", chapters: 13, testament: "vt" },
  { slug: "esther", name: "Estera", chapters: 10, testament: "vt" },
  { slug: "job", name: "Iov", chapters: 42, testament: "vt" },
  { slug: "psalms", name: "Psalmii", chapters: 150, testament: "vt" },
  { slug: "proverbs", name: "Proverbe", chapters: 31, testament: "vt" },
  { slug: "ecclesiastes", name: "Eclesiastul", chapters: 12, testament: "vt" },
  { slug: "song_of_songs", name: "Cântarea Cântărilor", chapters: 8, testament: "vt" },
  { slug: "isaiah", name: "Isaia", chapters: 66, testament: "vt" },
  { slug: "jeremiah", name: "Ieremia", chapters: 52, testament: "vt" },
  { slug: "lamentations", name: "Plângerile", chapters: 5, testament: "vt" },
  { slug: "ezekiel", name: "Ezechiel", chapters: 48, testament: "vt" },
  { slug: "daniel", name: "Daniel", chapters: 12, testament: "vt" },
  { slug: "hosea", name: "Osea", chapters: 14, testament: "vt" },
  { slug: "joel", name: "Ioel", chapters: 3, testament: "vt" },
  { slug: "amos", name: "Amos", chapters: 9, testament: "vt" },
  { slug: "obadiah", name: "Obadia", chapters: 1, testament: "vt" },
  { slug: "jonah", name: "Iona", chapters: 4, testament: "vt" },
  { slug: "micah", name: "Mica", chapters: 7, testament: "vt" },
  { slug: "nahum", name: "Naum", chapters: 3, testament: "vt" },
  { slug: "habakkuk", name: "Habacuc", chapters: 3, testament: "vt" },
  { slug: "zephaniah", name: "Țefania", chapters: 3, testament: "vt" },
  { slug: "haggai", name: "Hagai", chapters: 2, testament: "vt" },
  { slug: "zechariah", name: "Zaharia", chapters: 14, testament: "vt" },
  { slug: "malachi", name: "Maleahi", chapters: 4, testament: "vt" },
  // Noul Testament
  { slug: "matthew", name: "Matei", chapters: 28, testament: "nt" },
  { slug: "mark", name: "Marcu", chapters: 16, testament: "nt" },
  { slug: "luke", name: "Luca", chapters: 24, testament: "nt" },
  { slug: "john", name: "Ioan", chapters: 21, testament: "nt" },
  { slug: "acts", name: "Faptele Apostolilor", chapters: 28, testament: "nt" },
  { slug: "romans", name: "Romani", chapters: 16, testament: "nt" },
  { slug: "i_corinthians", name: "1 Corinteni", chapters: 16, testament: "nt" },
  { slug: "ii_corinthians", name: "2 Corinteni", chapters: 13, testament: "nt" },
  { slug: "galatians", name: "Galateni", chapters: 6, testament: "nt" },
  { slug: "ephesians", name: "Efeseni", chapters: 6, testament: "nt" },
  { slug: "philippians", name: "Filipeni", chapters: 4, testament: "nt" },
  { slug: "colossians", name: "Coloseni", chapters: 4, testament: "nt" },
  { slug: "i_thessalonians", name: "1 Tesaloniceni", chapters: 5, testament: "nt" },
  { slug: "ii_thessalonians", name: "2 Tesaloniceni", chapters: 3, testament: "nt" },
  { slug: "i_timothy", name: "1 Timotei", chapters: 6, testament: "nt" },
  { slug: "ii_timothy", name: "2 Timotei", chapters: 4, testament: "nt" },
  { slug: "titus", name: "Tit", chapters: 3, testament: "nt" },
  { slug: "philemon", name: "Filimon", chapters: 1, testament: "nt" },
  { slug: "hebrews", name: "Evrei", chapters: 13, testament: "nt" },
  { slug: "james", name: "Iacov", chapters: 5, testament: "nt" },
  { slug: "i_peter", name: "1 Petru", chapters: 5, testament: "nt" },
  { slug: "ii_peter", name: "2 Petru", chapters: 3, testament: "nt" },
  { slug: "i_john", name: "1 Ioan", chapters: 5, testament: "nt" },
  { slug: "ii_john", name: "2 Ioan", chapters: 1, testament: "nt" },
  { slug: "iii_john", name: "3 Ioan", chapters: 1, testament: "nt" },
  { slug: "jude", name: "Iuda", chapters: 1, testament: "nt" },
  { slug: "revelation", name: "Apocalipsa", chapters: 22, testament: "nt" }
];

// Disponibilitate reală pentru pipeline-ul de capitole (fișiere {slug}-{n}.js) —
// verificat direct în folderul public/: doar genesis-1.js...genesis-23.js există;
// Exod/Levitic/Numeri/Deuteronom nu au niciun fișier de capitol pe acest pipeline
// (textul integral Rosen pentru toată Tora trăiește separat, în Bibliotecă, la
// "tora-rosen-*"). Tabelul de mai jos declara greșit disponibile capitole care nu
// aveau niciun fișier — corectat ca să reflecte realitatea (Geneza 24 nu era "în
// lucru", pur și simplu se declara disponibilă când nu exista deloc).
const AVAILABLE = {genesis: {1: true,2: true,3: true,4: true,5: true,6: true,7: true,8: true,9: true,10: true,11: true,12: true,13: true,14: true,15: true,16: true,17: true,18: true,19: true,20: true,21: true,22: true,23: true,24: true,25: true,26: true,27: true,28: true,29: true,30: true,31: true,32: true,33: true,34: true,35: true,36: true,37: true,38: true,39: true,40: true,41: true,42: true,43: true,44: true,45: true,46: true,47: true,48: true,49: true,50: true},exodus: {1: true,2: true,3: true,4: true,5: true,6: true,7: true,8: true,9: true,10: true,11: true,12: true,13: true,14: true,15: true,16: true,17: true,18: true,19: true,20: true,21: true,22: true,23: true,24: true,25: true,26: true,27: true,28: true,29: true,30: true,31: true,32: true,33: true,34: true,35: true,36: true,37: true,38: true,39: true,40: true},leviticus: {1: true,2: true,3: true,4: true,5: true,6: true,7: true,8: true,9: true,10: true,11: true,12: true,13: true,14: true,15: true,16: true,17: true,18: true,19: true,20: true,21: true,22: true,23: true,24: true,25: true,26: true,27: true},numbers: {1: true,2: true,3: true,4: true,5: true,6: true,7: true,8: true,9: true,10: true,11: true,12: true,13: true,14: true,15: true,16: true,17: true,18: true,19: true,20: true,21: true,22: true,23: true,24: true,25: true,26: true,27: true,28: true,29: true,30: true,31: true,32: true,33: true,34: true,35: true,36: true},deuteronomy: {1: true,2: true,3: true,4: true,5: true,6: true,7: true,8: true,9: true,10: true,11: true,12: true,13: true,14: true,15: true,16: true,17: true,18: true,19: true,20: true,21: true,22: true,23: true,24: true,25: true,26: true,27: true,28: true,29: true,30: true,31: true,32: true,33: true,34: true}};

const HAFTAROT_BOOKS = [{"slug":"haftarot-geneza","author":"","available":true,"lazySrc":"haftarot-geneza.js","edition":{"translation":"Traducerea rabinului Șlomo Sorin Rosen","source":"Humașul „Tora și Haftarot” – traducere, transliterare și adnotări după surse iudaice de rabin Șlomo Sorin Rosen (jewishbooks.ro)","source_status":"CC-BY-NC","modernization":"Text integral, fără modificări"},"chapters":[{"num":1,"title":"Bereșit - La început","ref":"Isaia 42:5-43:10","verses":[]},{"num":2,"title":"Noah - Noe","ref":"Isaia 54:1-55:5","verses":[]},{"num":3,"title":"Leh Leha - Du-te","ref":"Isaia 40:27-41:16","verses":[]},{"num":4,"title":"Vaiera - Și S-a arătat","ref":"2 Împărați 4:1-37","verses":[]},{"num":5,"title":"Haiei Sara - Viața Sarei","ref":"1 Împărați 1:1-31","verses":[]},{"num":6,"title":"Toldot - Generații","ref":"Maleahi 1:1-2:7","verses":[]},{"num":7,"title":"Vaiețe - Și a ieșit","ref":"Osea 11:7-14:9 (+ adaos opțional Ioel 2:26-27)","verses":[]},{"num":8,"title":"Vaișlah - Și a trimis","ref":"Obadia 1:1-21","verses":[]},{"num":9,"title":"Vaieșev - Și a locuit","ref":"Amos 2:6-3:8","verses":[]},{"num":10,"title":"Mikeț - La capătul","ref":"1 Împărați 3:15-4:1","verses":[]},{"num":11,"title":"Vaigaș - Și s-a apropiat","ref":"Ezechiel 37:15-28","verses":[]},{"num":12,"title":"Vaiehi - Și a trăit","ref":"1 Împărați 2:1-12","verses":[]}],"name":"Haftarot — Geneza","name_ro":"De la Bereșit la Vaiehi","meta":"12 haftarot","summary":"Haftarot citite după pericopele din Geneza."},{"slug":"haftarot-exod","author":"","available":true,"lazySrc":"haftarot-exod.js","edition":{"translation":"Traducerea rabinului Șlomo Sorin Rosen","source":"Humașul „Tora și Haftarot” – traducere, transliterare și adnotări după surse iudaice de rabin Șlomo Sorin Rosen (jewishbooks.ro)","source_status":"CC-BY-NC","modernization":"Text integral, fără modificări"},"chapters":[{"num":1,"title":"Șemot (așkenaz) - Numele","ref":"Isaia 27:6-28:13; 29:22-23","verses":[]},{"num":2,"title":"Șemot (sefard) - Numele","ref":"Ieremia 1:1-2:3","verses":[]},{"num":3,"title":"Vaera - Și M-am arătat","ref":"Ezechiel 28:25-29:21","verses":[]},{"num":4,"title":"Bo - Intră","ref":"Ieremia 46:13-28","verses":[]},{"num":5,"title":"Beșalah - Când a dat drumul","ref":"Judecători 4:4-5:31","verses":[]},{"num":6,"title":"Itro - Ietro","ref":"Isaia 6:1-7:6, 9:6-7","verses":[]},{"num":7,"title":"Mișpatim - Judecăți","ref":"Ieremia 34:8-22, 33:25-26","verses":[]},{"num":8,"title":"Teruma - Prinos","ref":"1 Împărați 5:12-6:13","verses":[]},{"num":9,"title":"Tețave - Să poruncești","ref":"Ezechiel 43:10-27","verses":[]},{"num":10,"title":"Ki Tisa - Când vei număra","ref":"1 Împărați 18:1-39","verses":[]},{"num":11,"title":"Vaiakhél (sefard și Chabad) - Și a adunat","ref":"1 Împărați 7:13-26","verses":[]},{"num":12,"title":"Vaiakhél (așkenaz) - Și a adunat","ref":"1 Împărați 7:40-50","verses":[]},{"num":13,"title":"Pekudēi - Socotelile","ref":"1 Împărați 7:51-8:21","verses":[]}],"name":"Haftarot — Exodul","name_ro":"De la Șemot la Pekudei","meta":"13 haftarot","summary":"Haftarot citite după pericopele din Exodul, cu variantele așkenază și sefardă acolo unde diferă."},{"slug":"haftarot-levitic","author":"","available":true,"lazySrc":"haftarot-levitic.js","edition":{"translation":"Traducerea rabinului Șlomo Sorin Rosen","source":"Humașul „Tora și Haftarot” – traducere, transliterare și adnotări după surse iudaice de rabin Șlomo Sorin Rosen (jewishbooks.ro)","source_status":"CC-BY-NC","modernization":"Text integral, fără modificări"},"chapters":[{"num":1,"title":"Vaikra - Și a chemat","ref":"Isaia 43:21-44:23","verses":[]},{"num":2,"title":"Țav - Poruncește","ref":"Ieremia 7:21-8:3, 9:23-24","verses":[]},{"num":3,"title":"Șemini (sefard) - A opta","ref":"2 Samuel 6:1-19","verses":[]},{"num":4,"title":"Șemini (așkenaz) - A opta","ref":"2 Samuel 6:1-7:17","verses":[]},{"num":5,"title":"Tazria - Va zămisli","ref":"2 Împărați 4:42-5:19","verses":[]},{"num":6,"title":"Mețora - Lepra","ref":"2 Împărați 7:3-20","verses":[]},{"num":7,"title":"Aharéi Mot - După moarte","ref":"Amos 9:7-15","verses":[]},{"num":8,"title":"Kedoșim (așkenaz) - Sfinți","ref":"Ezechiel 22:1-16","verses":[]},{"num":9,"title":"Kedoșim (sefard) - Sfinți","ref":"Ezechiel 20:2-20","verses":[]},{"num":10,"title":"Emor - Spune","ref":"Ezechiel 44:15-31","verses":[]},{"num":11,"title":"Behar - Pe munte","ref":"Ieremia 32:6-27","verses":[]},{"num":12,"title":"Behukotai - În decretele Mele","ref":"Ieremia 16:19-17:14","verses":[]}],"name":"Haftarot — Leviticul","name_ro":"De la Vaikra la Behukotai","meta":"12 haftarot","summary":"Haftarot citite după pericopele din Levitic, cu variantele așkenază și sefardă acolo unde diferă."},{"slug":"haftarot-numeri","author":"","available":true,"lazySrc":"haftarot-numeri.js","edition":{"translation":"Traducerea rabinului Șlomo Sorin Rosen","source":"Humașul „Tora și Haftarot” – traducere, transliterare și adnotări după surse iudaice de rabin Șlomo Sorin Rosen (jewishbooks.ro)","source_status":"CC-BY-NC","modernization":"Text integral, fără modificări"},"chapters":[{"num":1,"title":"Bamidbar - În deșert","ref":"Osea 1:10-2:20","verses":[]},{"num":2,"title":"Naso - Ridică","ref":"Judecători 13:2-25","verses":[]},{"num":3,"title":"Behaalotecha - Când vei aprinde","ref":"Zaharia 2:10-4:7","verses":[]},{"num":4,"title":"Șelah - Trimite","ref":"Iosua 2:1-24","verses":[]},{"num":5,"title":"Korah - Korah","ref":"1 Samuel 11:14-12:22","verses":[]},{"num":6,"title":"Hukat - Decretul","ref":"Judecători 11:1-33","verses":[]},{"num":7,"title":"Balak - Balak","ref":"Mica 5:7-6:8","verses":[]},{"num":8,"title":"Pinhas - Pinhas","ref":"1 Împărați 18:46-19:21","verses":[]},{"num":9,"title":"Matot - Semințiile","ref":"Ieremia 1:1-2:3","verses":[]},{"num":10,"title":"Masei - Călătoriile","ref":"Ieremia 2:4-28; 3:4; 4:1-2 (Isaia 66:1, 23)","verses":[]}],"name":"Haftarot — Numeri","name_ro":"De la Bamidbar la Masei","meta":"10 haftarot","summary":"Haftarot citite după pericopele din Numeri."},{"slug":"haftarot-deuteronom","author":"","available":true,"lazySrc":"haftarot-deuteronom.js","edition":{"translation":"Traducerea rabinului Șlomo Sorin Rosen","source":"Humașul „Tora și Haftarot” – traducere, transliterare și adnotări după surse iudaice de rabin Șlomo Sorin Rosen (jewishbooks.ro)","source_status":"CC-BY-NC","modernization":"Text integral, fără modificări"},"chapters":[{"num":1,"title":"Devarim - Cuvintele","ref":"Isaia 1:1-27","verses":[]},{"num":2,"title":"Vaethanan - Și m-am rugat","ref":"Isaia 40:1-26","verses":[]},{"num":3,"title":"Ekev - Pentru că","ref":"Isaia 49:14-51:3","verses":[]},{"num":4,"title":"Reeh - Vezi","ref":"Isaia 54:11-55:5 (+ 1 Samuel 20:18, 42; Isaia 66:1, 23)","verses":[]},{"num":5,"title":"Șoftim - Judecători","ref":"Isaia 51:12-52:12","verses":[]},{"num":6,"title":"Ki Tețe - Când vei ieși","ref":"Isaia 54:1-10","verses":[]},{"num":7,"title":"Ki Tavo - Când vei intra","ref":"Isaia 60:1-22","verses":[]},{"num":8,"title":"Nițavim - Stați","ref":"Isaia 61:10-63:9","verses":[]},{"num":9,"title":"Vaieleh - Și a mers","ref":"Osea 14:1-9; Ioel 2:11-27; Mica 7:18-20","verses":[]},{"num":10,"title":"Haazinu - Ascultă","ref":"2 Samuel 22:1-51","verses":[]}],"name":"Haftarot — Deuteronomul","name_ro":"De la Devarim la Haazinu","meta":"10 haftarot","summary":"Haftarot citite după pericopele din Deuteronom, între ele cele șapte haftarot ale consolării."},{"slug":"haftarot-sarbatori","author":"","available":true,"lazySrc":"haftarot-sarbatori.js","edition":{"translation":"Traducerea rabinului Șlomo Sorin Rosen","source":"Humașul „Tora și Haftarot” – traducere, transliterare și adnotări după surse iudaice de rabin Șlomo Sorin Rosen (jewishbooks.ro)","source_status":"CC-BY-NC","modernization":"Text integral, fără modificări"},"chapters":[{"num":1,"title":"Sabat Erev Roș Hodeș - Sabatul ajunului de început de lună","ref":"1 Samuel 20:18-42","verses":[]},{"num":2,"title":"Sabat Roș Hodeș - Sabat de cap de lună","ref":"Isaia 66:1-24","verses":[]},{"num":3,"title":"Sabat Hanuca (I) - Sabatul Luminilor (I)","ref":"Zaharia 2:10-4:7","verses":[]},{"num":4,"title":"Sabat Hanuca (II) - Sabatul Luminilor (II)","ref":"1 Împărați 7:40-50","verses":[]},{"num":5,"title":"Parașat Șekalim - Pericopa Siclilor","ref":"2 Împărați 11:17-12:16","verses":[]},{"num":6,"title":"Parașat Zahor - Pericopa Adu-ți aminte","ref":"1 Samuel 15:1-34","verses":[]},{"num":7,"title":"Parașat Para - Pericopa Vacii roșii","ref":"Ezechiel 36:16-38","verses":[]},{"num":8,"title":"Parașat Hahodeș - Pericopa Lunii","ref":"Ezechiel 45:16-46:18","verses":[]},{"num":9,"title":"Sabat Hagadol - Marele Sabat","ref":"Maleahi 3:4-4:6","verses":[]},{"num":10,"title":"Pesah ziua 1 (Paștele)","ref":"Iosua 3:5-7; 5:2-15; 6:1, 6:27","verses":[]},{"num":11,"title":"Pesah ziua 2 (Paștele)","ref":"2 Împărați 23:1-9, 23:21-25","verses":[]},{"num":12,"title":"Pesah Sabat Hol Hamoed (Paște - Sabat în zilele de mijloc)","ref":"Ezechiel 37:1-14","verses":[]},{"num":13,"title":"Pesah ziua 7 (Paștele)","ref":"2 Samuel 22:1-51","verses":[]},{"num":14,"title":"Pesah ziua 8 (Paștele)","ref":"Isaia 10:32-12:6","verses":[]},{"num":15,"title":"Șavuot ziua 1 (Sărbătoarea Săptămânilor)","ref":"Ezechiel 1:1-28, 3:12","verses":[]},{"num":16,"title":"Șavuot ziua 2 (Sărbătoarea Săptămânilor)","ref":"Habacuc 2:20-3:19","verses":[]},{"num":17,"title":"Tișa Be’Av dimineața (9 Av)","ref":"Ieremia 8:13-9:24","verses":[]},{"num":18,"title":"Taanit Țibur Minha (Post colectiv - după-amiază)","ref":"Isaia 55:6-56:8","verses":[]},{"num":19,"title":"Roș Hașana ziua 1 (Anul Nou)","ref":"1 Samuel 1:1-2:10","verses":[]},{"num":20,"title":"Roș Hașana ziua 2 (Anul Nou)","ref":"Ieremia 31:2-20","verses":[]},{"num":21,"title":"Iom Kipur dimineața (Ziua Ispășirii)","ref":"Isaia 57:14-58:14","verses":[]},{"num":22,"title":"Iom Kipur după-amiaza (Ziua Ispășirii)","ref":"Iona 1:1-4:11; Mica 7:18-20","verses":[]},{"num":23,"title":"Sucot ziua 1 (Sărbătoarea Colibelor)","ref":"Zaharia 14:1-21","verses":[]},{"num":24,"title":"Sucot ziua 2 (Sărbătoarea Colibelor)","ref":"1 Împărați 8:2-21","verses":[]},{"num":25,"title":"Sucot Sabat Hol Hamoed (Colibe - Sabat în zilele de mijloc)","ref":"Ezechiel 38:18-39:16","verses":[]},{"num":26,"title":"Șemini Ațeret - A opta zi de adunare","ref":"1 Împărați 8:54-9:1","verses":[]},{"num":27,"title":"Simhat Tora - Bucuria Torei","ref":"Iosua 1:1-18","verses":[]}],"name":"Haftarot — Sărbători","name_ro":"Haftarot pentru sărbători și ocazii speciale","meta":"27 haftarot","summary":"Haftarot citite la sărbători și ocazii speciale din calendarul iudaic."}];

// Ajutoare pentru citirea Haftarot direct din tab-ul Biblia — vezi HAFTAROT_BOOKS
// mai sus. Motorul de citire (popup, Citire/Aprofundare, lexicon) e cel deja
// construit pentru Bibliotecă (openReader/renderChapter) — vezi window.openHaftarahAt
// mai jos, în secțiunea Bibliotecă. Haftarot NU mai are intrare separată în
// Bibliotecă — un singur loc de citit și întreținut.
function normalizeRefForMatch(s){
  return (s || "")
    .toLowerCase()
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}
function findHaftarahByRef(refText){
  const norm = normalizeRefForMatch(refText);
  if(!norm) return null;
  for(const book of HAFTAROT_BOOKS){
    for(let i = 0; i < book.chapters.length; i++){
      const ch = book.chapters[i];
      if(normalizeRefForMatch(ch.ref) === norm){
        return { book, idx: i, title: ch.title, ref: ch.ref };
      }
    }
  }
  return null;
}
function loadHaftarahIntro(book, idx, cb){
  if(book._lazyLoaded){
    const ch = book.chapters[idx];
    cb(ch ? ch.intro : "");
    return;
  }
  if(book._lazyLoading){
    setTimeout(() => loadHaftarahIntro(book, idx, cb), 150);
    return;
  }
  book._lazyLoading = true;
  const s = document.createElement("script");
  s.src = book.lazySrc;
  s.onload = () => {
    book._lazyLoading = false;
    const data = (window.HAFTAROT_DATA || {})[book.slug];
    if(data && Array.isArray(data.chapters) && data.chapters.length){
      book.chapters = data.chapters;
      book._lazyLoaded = true;
    }
    const ch = book.chapters[idx];
    cb(ch ? ch.intro : "");
  };
  s.onerror = () => { book._lazyLoading = false; cb(""); };
  document.head.appendChild(s);
}
function firstSentences(text, n){
  if(!text) return "";
  const parts = text.match(/[^.!?]+[.!?]+(\s+|$)/g);
  if(!parts || !parts.length) return text;
  return parts.slice(0, n).join("").trim();
}

let currentTestament = "vt";
let currentVersion = "rosen";
let currentBookSlug = "genesis";
let currentChapter = 1;

const testamentBtns = document.querySelectorAll(".testament-btn");
const bookPill = document.getElementById("book-pill");
const bookPillLabel = document.getElementById("book-pill-label");
const pickerModal = document.getElementById("picker-modal");
const pickerBackdrop = document.getElementById("picker-backdrop");
const pickerClose = document.getElementById("picker-close");
const pickerBookList = document.getElementById("picker-book-list");

function getBook(slug){ return BOOKS.find(b => b.slug === slug); }
function bookIsAvailable(slug){ return !!AVAILABLE[slug]; }
function chapterIsAvailable(slug, n){ return !!(AVAILABLE[slug] && AVAILABLE[slug][n]); }

function openPicker(){
  const testamentTabs = document.querySelector(".testament-tabs");
  if(testamentTabs){
    if(currentVersion === "rosen"){
      testamentTabs.style.display = "none";
      currentTestament = "vt";
    } else {
      testamentTabs.style.display = "";
    }
  }
  populatePickerBookList();
  pickerModal.classList.add("show");
  pickerBackdrop.classList.add("show");
  // Săgețile flotante de capitol anterior/următor nu trebuie să rămână peste
  // lista de Cărți, deasupra panoului — doar pe pagina de citire.
  if(typeof updateChapterNavFloat === "function") updateChapterNavFloat();
}
function closePicker(){
  pickerModal.classList.remove("show");
  pickerBackdrop.classList.remove("show");
  if(typeof updateChapterNavFloat === "function") updateChapterNavFloat();
}

const TORA_SLUGS = ["genesis", "exodus", "leviticus", "numbers", "deuteronomy"];
function populatePickerBookList(){
  pickerBookList.innerHTML = "";
  const list = currentVersion === "rosen"
    ? BOOKS.filter(b => TORA_SLUGS.includes(b.slug))
    : BOOKS.filter(b => b.testament === currentTestament);
  list.forEach(book => {
    // Cartea curentă rămâne doar evidențiată (culoare), nu expandată automat cu
    // panoul de capitole deschis — selectorul "Cărți" pornește mereu ca listă
    // curată, expandarea se face doar la o atingere explicită.
    const item = document.createElement("div");
    item.className = "picker-book-item";

    const nameRow = document.createElement("div");
    nameRow.className = "picker-book-name" +
      (bookIsAvailable(book.slug) ? "" : " unavailable") +
      (book.slug === currentBookSlug ? " current" : "");
    nameRow.innerHTML = "<span>" + book.name + "</span><span class=\"picker-book-go\">→</span>";
    nameRow.addEventListener("click", () => {
      const wasOpen = item.classList.contains("open");
      pickerBookList.querySelectorAll(".picker-book-item").forEach(el => el.classList.remove("open"));
      if(!wasOpen) item.classList.add("open");
    });
    item.appendChild(nameRow);

    const grid = document.createElement("div");
    grid.className = "picker-chapter-grid";
    for(let i = 1; i <= book.chapters; i++){
      const btn = document.createElement("button");
      const avail = chapterIsAvailable(book.slug, i);
      btn.className = "chapter-num-btn" + (avail ? "" : " unavailable") + (book.slug === currentBookSlug && i === currentChapter ? " active" : "");
      btn.textContent = i;
      btn.title = book.name + " " + i + (avail ? "" : " (indisponibil momentan)");
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        currentBookSlug = book.slug;
        loadChapter(i);
        closePicker();
      });
      grid.appendChild(btn);
    }
    item.appendChild(grid);

    pickerBookList.appendChild(item);
  });

  // Haftarot — trăiește doar aici, lângă Tora (nu mai are intrare separată în
  // Bibliotecă). Un singur folder "Haftarot", ca orice altă carte din listă;
  // în interiorul lui, cele 5 cărți (Geneza/Exod/Levitic/Numeri/Deuteronom);
  // în interiorul fiecăreia, lista cu numele Haftarot — nu se sare direct la
  // prima Haftarah.
  if(currentVersion === "rosen" && typeof HAFTAROT_BOOKS !== "undefined"){
    const folderItem = document.createElement("div");
    folderItem.className = "picker-book-item";

    const folderNameRow = document.createElement("div");
    folderNameRow.className = "picker-book-name";
    folderNameRow.innerHTML = "<span>Haftarot - Pasaje din Profeți</span><span class=\"picker-book-go\">→</span>";
    folderNameRow.addEventListener("click", () => {
      const wasOpen = folderItem.classList.contains("open");
      pickerBookList.querySelectorAll(".picker-book-item").forEach(el => el.classList.remove("open"));
      if(!wasOpen) folderItem.classList.add("open");
    });
    folderItem.appendChild(folderNameRow);

    const folderGrid = document.createElement("div");
    folderGrid.className = "picker-chapter-grid picker-haftarah-books";
    HAFTAROT_BOOKS.forEach(book => {
      const bookRow = document.createElement("div");
      bookRow.className = "lib-book-item";
      bookRow.innerHTML =
        '<div><div class="lib-book-name">' + book.name + '</div>' +
        '<div class="lib-book-meta">' + book.meta + '</div></div>' +
        '<span class="lib-book-chev">▾</span>';

      const bookGrid = document.createElement("div");
      bookGrid.className = "picker-haftarah-list";
      bookGrid.style.display = "none";
      book.chapters.forEach((ch, idx) => {
        const row = document.createElement("div");
        row.className = "lib-book-item lib-haftarah-name-row";
        row.innerHTML =
          '<div><div class="lib-book-name">' + ch.title + '</div>' +
          '<div class="lib-book-meta">' + ch.ref + '</div></div>' +
          '<span class="lib-book-go">→</span>';
        row.addEventListener("click", (e) => {
          e.stopPropagation();
          closePicker();
          if(typeof window.openHaftarahAt === "function") window.openHaftarahAt(book, idx);
        });
        bookGrid.appendChild(row);
      });

      bookRow.addEventListener("click", (e) => {
        e.stopPropagation();
        const wasOpen = bookRow.classList.contains("open");
        folderGrid.querySelectorAll(".lib-book-item.open").forEach(el => el.classList.remove("open"));
        folderGrid.querySelectorAll(".picker-haftarah-list").forEach(el => { el.style.display = "none"; });
        if(!wasOpen){
          bookRow.classList.add("open");
          bookGrid.style.display = "block";
        }
      });

      folderGrid.appendChild(bookRow);
      folderGrid.appendChild(bookGrid);
    });
    folderItem.appendChild(folderGrid);

    pickerBookList.appendChild(folderItem);
  }
}

// Apelat de săgeata "înapoi" din cititorul de Haftarot (vezi readerBack, secțiunea
// Bibliotecă): redeschide selectorul "Cărți" și reexpandă lista Haftarot a cărții
// din care s-a citit (ex. Geneza) — un pas înapoi, nu tot drumul până la Acasă.
window.reopenHaftarahList = function(book){
  if(typeof openPicker === "function") openPicker();
  setTimeout(() => {
    // Pasul 1: deschide folderul exterior "Haftarot - Pasaje din Profeți"
    // (un .picker-book-item distinct de cărțile canonice din aceeași listă).
    let haftarotFolder = null;
    document.querySelectorAll(".picker-book-item").forEach(it => {
      const span = it.querySelector(".picker-book-name span");
      if(span && span.textContent === "Haftarot - Pasaje din Profeți") haftarotFolder = it;
    });
    if(!haftarotFolder) return;
    if(!haftarotFolder.classList.contains("open")) haftarotFolder.querySelector(".picker-book-name").click();
    // Pasul 2: în interiorul folderului, găsește rândul cărții exacte (ex.
    // "Haftarot — Sărbători") — acestea sunt .lib-book-item, nu .picker-book-item.
    let bookRow = null;
    haftarotFolder.querySelectorAll(".lib-book-item").forEach(row => {
      const nameEl = row.querySelector(".lib-book-name");
      if(nameEl && nameEl.textContent === book.name) bookRow = row;
    });
    if(!bookRow) return;
    if(!bookRow.classList.contains("open")) bookRow.click();
    bookRow.scrollIntoView({ block: "center" });
  }, 30);
};

function loadChapter(n){
  const book = getBook(currentBookSlug);
  if(n < 1 || n > book.chapters) return;
  if(typeof stopTts === "function") stopTts(); // schimbarea capitolului oprește orice sesiune audio
  if(typeof window.exitHaftarahInline === "function") window.exitHaftarahInline(); // la alegerea unei cărți canonice, ieșim din Haftara citită inline
  currentChapter = n;
  bookPillLabel.textContent = book.name + " " + n;

  if(!chapterIsAvailable(currentBookSlug, n)){
    versesEl.innerHTML =
      '<p style="padding:20px; text-align:center; color:var(--ink-soft); font-style:italic;">' +
      book.name + " " + n + " nu e încă disponibil." +
      "</p>";
    return;
  }

  const existing = document.getElementById("chapter-data-script");
  if(existing) existing.remove();
  window.CHAPTER_DATA = null;

  const script = document.createElement("script");
  script.id = "chapter-data-script";
  script.src = currentBookSlug + "-" + n + ".js";
  script.onload = () => {
    if(!window.CHAPTER_DATA || !window.CHAPTER_DATA.length){
      versesEl.innerHTML = '<p style="padding:20px; color:#7a2e2e;">' + script.src + ' s-a încărcat, dar nu conține date valide.</p>';
      return;
    }
    VERSES = window.CHAPTER_DATA;
    versesEl.innerHTML = "";
    renderVerses();
    updateChapterNavFloat();
  };
  script.onerror = () => {
    versesEl.innerHTML = '<p style="padding:20px; color:#7a2e2e;">Nu am putut încărca ' + script.src + '. Verifică că fișierul e în același folder cu biblie-demo.html.</p>';
  };
  document.body.appendChild(script);
}

function updateChapterNavFloat(){
  const navFloat = document.getElementById("chapter-nav-float");
  const prevBtn = document.getElementById("chapter-nav-prev");
  const nextBtn = document.getElementById("chapter-nav-next");
  if(!navFloat) return;
  const onBiblia = tabPanels.biblia && tabPanels.biblia.style.display !== "none";
  // Cât timp panoul "Cărți" (selectorul de cărți/capitole) e deschis peste
  // tab-ul Biblia, săgețile flotante de capitol anterior/următor rămân
  // ascunse — altfel acopereau lista de cărți.
  const pickerOpen = typeof pickerModal !== "undefined" && pickerModal && pickerModal.classList.contains("show");
  if(!onBiblia || !currentBookSlug || pickerOpen){
    navFloat.classList.remove("show");
    return;
  }
  const book = getBook(currentBookSlug);
  navFloat.classList.add("show");
  prevBtn.disabled = currentChapter <= 1;
  nextBtn.disabled = currentChapter >= book.chapters;
}
function spawnChapterNavRipple(btn){
  const ripple = document.createElement("span");
  ripple.className = "chapter-nav-ripple";
  btn.appendChild(ripple);
  ripple.addEventListener("animationend", () => ripple.remove());
}
document.getElementById("chapter-nav-prev").addEventListener("click", (e) => {
  spawnChapterNavRipple(e.currentTarget);
  if(currentChapter <= 1) return;
  loadChapter(currentChapter - 1);
  window.scrollTo({ top: 0, behavior: "smooth" });
});
document.getElementById("chapter-nav-next").addEventListener("click", (e) => {
  spawnChapterNavRipple(e.currentTarget);
  const book = getBook(currentBookSlug);
  if(currentChapter >= book.chapters) return;
  loadChapter(currentChapter + 1);
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Dock-ul de jos + bara cu săgeți < > se ascund la scroll în jos și reapar
// împreună la scroll în sus — rămân fixe pe ecran, nu la finalul paginii.
let dockLastScrollY = window.scrollY;
window.addEventListener("scroll", () => {
  const y = window.scrollY;
  const delta = y - dockLastScrollY;
  const dock = document.querySelector(".bottom-tabs");
  const navFloat = document.getElementById("chapter-nav-float");
  if(y < 40 || delta < 0){
    dock.classList.remove("nav-hidden");
    if(navFloat) navFloat.classList.remove("nav-hidden");
  } else if(delta > 0){
    dock.classList.add("nav-hidden");
    if(navFloat) navFloat.classList.add("nav-hidden");
  }
  dockLastScrollY = y;
}, { passive: true });

// swipe stânga/dreapta între capitole
let touchStartX = null;
let touchStartY = null;
versesEl.addEventListener("touchstart", (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, { passive: true });
versesEl.addEventListener("touchend", (e) => {
  if(touchStartX === null) return;
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  // declanșează schimbarea de capitol DOAR dacă mișcarea e clar orizontală —
  // altfel un scroll normal, puțin pieziș, era interpretat greșit ca swipe
  // și sărea capitolul înapoi la începutul lui
  if(Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 2){
    if(dx < 0) loadChapter(currentChapter + 1);       // swipe stânga → capitolul următor
    else loadChapter(currentChapter - 1);              // swipe dreapta → capitolul anterior
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  touchStartX = null;
  touchStartY = null;
});

bookPill.addEventListener("click", () => {
  // Dacă citim acum o Haftarah inline (ex. Bereșit - La început, din Haftarot
  // — Geneza), pila de sus trebuie să redeschidă exact acea listă, nu lista
  // principală de Cărți de la zero.
  const haftBook = (typeof window.getCurrentHaftarahBook === "function") ? window.getCurrentHaftarahBook() : null;
  if(haftBook && typeof window.reopenHaftarahList === "function"){
    window.reopenHaftarahList(haftBook);
    return;
  }
  populatePickerBookList();
  openPicker();
});
pickerClose.addEventListener("click", closePicker);
pickerBackdrop.addEventListener("click", closePicker);

testamentBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    currentTestament = btn.dataset.testament;
    testamentBtns.forEach(b => b.classList.toggle("active", b === btn));
    populatePickerBookList();
  });
});

// Mod Citire / Aprofundare — persistat în localStorage
let appMode = "citire";
try {
  const savedMode = localStorage.getItem("bibleAppMode");
  if(savedMode === "aprofundare" || savedMode === "citire") appMode = savedMode;
} catch(e){ /* localStorage indisponibil — rămâne modul implicit */ }

const modeCitireBtn = document.getElementById("mode-citire");
const modeAprofundareBtn = document.getElementById("mode-aprofundare");

function applyModeButtons(){
  modeCitireBtn.classList.toggle("active", appMode === "citire");
  modeAprofundareBtn.classList.toggle("active", appMode === "aprofundare");
  const footerHint = document.getElementById("verses-footer-hint");
  if(footerHint){
    footerHint.innerHTML = (appMode === "aprofundare")
      ? 'Atinge un verset pentru comentarii · cuvintele cu <b style="color:#d4a017;">•••</b> dedesubt au sens lexical — atinge-le pentru ebraică și traducere'
      : 'Atinge un verset pentru comentarii.';
  }
}
applyModeButtons();

function setMode(mode){
  appMode = mode;
  try { localStorage.setItem("bibleAppMode", mode); } catch(e){}
  applyModeButtons();
  if(typeof window.isHaftarahInline === "function" && window.isHaftarahInline()){
    window.reRenderInlineHaftarah();
  } else if(Array.isArray(VERSES) && VERSES.length){
    versesEl.innerHTML = "";
    renderVerses();
  }
  const hint = document.getElementById("aprofundare-hint");
  if(hint){
    let seen = false;
    try { seen = localStorage.getItem("seenAprofundareHint") === "1"; } catch(e){}
    hint.style.display = (mode === "aprofundare" && !seen) ? "flex" : "none";
  }
}
const aprofundareHintClose = document.getElementById("aprofundare-hint-close");
if(aprofundareHintClose){
  aprofundareHintClose.addEventListener("click", () => {
    document.getElementById("aprofundare-hint").style.display = "none";
    try { localStorage.setItem("seenAprofundareHint", "1"); } catch(e){}
  });
}
modeCitireBtn.addEventListener("click", () => setMode("citire"));
modeAprofundareBtn.addEventListener("click", () => setMode("aprofundare"));

// Selector de traducere (Rosen / Fidela / ...) — un singur buton cu dropdown
const translationSelectorBtn = document.getElementById("translation-selector-btn");
const translationDropdown = document.getElementById("version-row");
const translationLabelEl = document.getElementById("translation-selector-label");

if(translationSelectorBtn){
  translationSelectorBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    translationDropdown.classList.toggle("show");
  });
  document.addEventListener("click", (e) => {
    if(translationDropdown.classList.contains("show") && !translationDropdown.contains(e.target) && e.target !== translationSelectorBtn){
      translationDropdown.classList.remove("show");
    }
  });
}

document.querySelectorAll(".version-chip").forEach(chip => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".version-chip").forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    currentVersion = chip.dataset.version;
    // actualizează eticheta compactă a selectorului
    const name = chip.querySelector(".version-name");
    if(translationLabelEl && name) translationLabelEl.textContent = name.textContent;
    if(translationDropdown) translationDropdown.classList.remove("show");
    const testamentTabsEl = document.querySelector(".testament-tabs");
    if(currentVersion === "rosen"){
      if(testamentTabsEl) testamentTabsEl.style.display = "none";
      currentTestament = "vt";
      if(!TORA_SLUGS.includes(currentBookSlug)){
        currentBookSlug = "genesis";
        loadChapter(1);
      }
    } else {
      if(testamentTabsEl) testamentTabsEl.style.display = "";
    }
    if(Array.isArray(VERSES) && VERSES.length){
      versesEl.innerHTML = "";
      renderVerses();
    }
  });
});

// Buton play — deschide/închide dropdown-ul playerului de capitol și pornește lectura
const chapterPlayToggleBtn = document.getElementById("chapter-play-toggle-btn");
const chapterPlayerMount = document.getElementById("chapter-player-mount");
if(chapterPlayToggleBtn && chapterPlayerMount){
  chapterPlayToggleBtn.addEventListener("click", () => {
    const opening = !chapterPlayerMount.classList.contains("show");
    chapterPlayerMount.classList.toggle("show", opening);
    chapterPlayToggleBtn.classList.toggle("active", opening);
    if(opening && !ttsChapterActive){
      chapterPlayPauseClicked();
    }
  });
}

const infoBtn = document.getElementById("info-btn");
const infoPanel = document.getElementById("info-panel");
const infoBackdrop = document.getElementById("info-backdrop");
const infoPanelClose = document.getElementById("info-panel-close");

function openInfoPanel(){
  infoPanel.classList.add("show");
  infoBackdrop.classList.add("show");
}
function closeInfoPanel(){
  infoPanel.classList.remove("show");
  infoBackdrop.classList.remove("show");
}
infoBtn.addEventListener("click", openInfoPanel);
infoPanelClose.addEventListener("click", closeInfoPanel);
const infoPrivacyToggle = document.getElementById("info-privacy-toggle");
const infoPrivacyBody = document.getElementById("info-privacy-body");
const infoPrivacyArrow = document.getElementById("info-privacy-arrow");
if(infoPrivacyToggle){
  infoPrivacyToggle.addEventListener("click", () => {
    const willOpen = infoPrivacyBody.style.display === "none";
    infoPrivacyBody.style.display = willOpen ? "block" : "none";
    infoPrivacyArrow.classList.toggle("open", willOpen);
  });
}
infoBackdrop.addEventListener("click", closeInfoPanel);

// =====================================================================
// TAB-URI DE JOS: Acasă / Biblia / Căutare / Setări
// =====================================================================
const tabPanels = {
  acasa: document.getElementById("tab-acasa"),
  biblia: document.getElementById("tab-biblia"),
  cautare: document.getElementById("tab-cautare"),
  diverse: document.getElementById("tab-diverse"),
  radio: document.getElementById("tab-radio"),
  setari: document.getElementById("tab-setari")
};

// Plasă de siguranță — blochează copiere/tăiere/meniul de click-dreapta
// în cititorul din Diverse (comentarii, Kabbala, patristice etc.). Nu-i o
// garanție absolută (nimic din browser nu e), dar descurajează copierea
// întâmplătoare/rapidă a textului.
document.addEventListener("copy", function(e){
  if(e.target.closest && e.target.closest(".lib-reader-body")){
    e.preventDefault();
  }
});
document.addEventListener("cut", function(e){
  if(e.target.closest && e.target.closest(".lib-reader-body")){
    e.preventDefault();
  }
});
document.addEventListener("contextmenu", function(e){
  if(e.target.closest && e.target.closest(".lib-reader-body")){
    e.preventDefault();
  }
});

const bottomTabBtns = document.querySelectorAll(".bottom-tab-btn");

function switchTab(name){
  if(name !== "cautare"){ try { srReset(); } catch(e){} } // căutarea se golește la ieșire
  if(typeof closeVerseSheet === "function") closeVerseSheet();
  if(typeof hideWordPopover === "function") hideWordPopover();
  if(typeof hideRefPreview === "function") hideRefPreview();
  if(typeof unlockBodyScroll === "function") unlockBodyScroll();
  Object.keys(tabPanels).forEach(key => {
    tabPanels[key].style.display = (key === name) ? "" : "none";
  });
  bottomTabBtns.forEach(btn => btn.classList.toggle("active", btn.dataset.tab === name));
  window.scrollTo({ top: 0 });
  if(typeof updateChapterNavFloat === "function") updateChapterNavFloat();
  if(name === "acasa" && typeof window.historyShowDefault === "function") window.historyShowDefault();
}

bottomTabBtns.forEach(btn => {
  btn.addEventListener("click", () => switchTab(btn.dataset.tab));
});

// Acasă — "Informații divine" (buton) deschide un acordeon direct pe pagina Acasă
const heroAccordion = document.getElementById("hero-accordion");
const heroToggleBtn = document.getElementById("hero-toggle");
let heroAccordionBuilt = false;

// Meniul cu 4 pătrățele de pe cardul "Versetul zilei" — deschide un mic dropdown
// care conține atât "Citește capitolul" cât și "Notă de studiu".
const heroMenuBtn = document.getElementById("hero-menu-btn");
const heroMenuDropdown = document.getElementById("hero-menu-dropdown");
if(heroMenuBtn && heroMenuDropdown){
  heroMenuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = heroMenuDropdown.style.display !== "none";
    heroMenuDropdown.style.display = isOpen ? "none" : "flex";
  });
  document.addEventListener("click", (e) => {
    if(heroMenuDropdown.style.display === "none") return;
    if(!heroMenuDropdown.contains(e.target) && e.target !== heroMenuBtn){
      heroMenuDropdown.style.display = "none";
    }
  });
}

// Colapsare reciprocă: la deschiderea unei secțiuni de pe Acasă, celelalte se închid automat
const homeSections = []; // { close: fn, els: [button, body] }
function closeOtherHomeSections(exceptCloseFn){
  homeSections.forEach(sec => { if(sec.close !== exceptCloseFn) sec.close(); });
}

function closeHeroAccordion(){
  heroAccordion.style.display = "none";
  heroToggleBtn.textContent = "Notă de studiu ▾";
}
homeSections.push({ close: closeHeroAccordion, els: [heroToggleBtn, heroAccordion] });

heroToggleBtn.addEventListener("click", () => {
  heroToggleBtn.classList.add("pressed");
  setTimeout(() => heroToggleBtn.classList.remove("pressed"), 250);
  if(heroMenuDropdown) heroMenuDropdown.style.display = "none";
  if(!currentVerseOfDayData || !currentVerseOfDayData.verse) return;
  currentBookSlug = currentVerseOfDayData.book.slug;
  currentChapter = currentVerseOfDayData.chapterNum;
  openVerseSheet(currentVerseOfDayData.verse, null);
});

// Acasă — butonul "Citește capitolul" de sub versetul zilei: te duce direct
// la capitolul și versetul respectiv în tab-ul Biblia (reutilizează
// loadChapterThenOpenVerse, aceeași logică folosită deja de "Mergi la pasaj"
// din panoul de trimiteri). Butonul apela înainte goToRef(), o funcție care
// nu exista nicăieri în fișier — click-ul dădea eroare silențioasă în consolă
// și nu făcea nimic vizibil.
const heroReadChapterBtn = document.getElementById("hero-read-chapter-btn");
if(heroReadChapterBtn){
  heroReadChapterBtn.addEventListener("click", () => {
    heroReadChapterBtn.classList.add("pressed");
    setTimeout(() => heroReadChapterBtn.classList.remove("pressed"), 250);
    if(heroMenuDropdown) heroMenuDropdown.style.display = "none";
    if(!currentVerseOfDayData || !currentVerseOfDayData.verse) return;
    if(currentVerseOfDayData.haftarah){ // versetul zilei din Haftarot: deschide haftara direct la verset
      const hf = currentVerseOfDayData.haftarah;
      if(typeof window.openLibraryAt === "function") window.openLibraryAt(hf.slug, hf.chIdx, hf.vkey);
      return;
    }
    currentBookSlug = currentVerseOfDayData.book.slug;
    switchTab("biblia");
    loadChapterThenOpenVerse(currentVerseOfDayData.chapterNum, currentVerseOfDayData.verse.num);
  });
}

// Acasă — comutatoare "citește mai departe"
function wireToggle(btnId, bodyId, openLabel, closeLabel){
  const btn = document.getElementById(btnId);
  const body = document.getElementById(bodyId);
  function close(){
    body.style.display = "none";
    btn.textContent = openLabel;
  }
  homeSections.push({ close, els: [btn, body] });
  btn.addEventListener("click", () => {
    const willOpen = body.style.display === "none";
    if(willOpen){
      closeOtherHomeSections(close);
      body.style.display = "block";
      btn.textContent = closeLabel;
    } else {
      close();
    }
  });
}

// =====================================================================
// BIBLIOTECĂ — foldere Diverse: canonic / deuterocanonic / pseudepigraf /
// apocrife NT / patristice. Grilă de foldere -> listă cărți -> cititor
// cu navigare pe capitole și swipe, exact ca la tab-ul Biblia.
// =====================================================================
(function(){
  // LIBRARY (datele bibliotecii, ~10 MB) stă în fișierul separat library-data.js (încărcat cu defer, după primul ecran); aici se citește doar când e nevoie.
  function libData(){ return (typeof LIBRARY !== "undefined") ? LIBRARY : {}; }

  const ICONS = {
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5c2-1 5-1 8 .5v13c-3-1.5-6-1.5-8-.5z"/><path d="M20 5.5c-2-1-5-1-8 .5v13c3-1.5 6-1.5 8-.5z"/></svg>',
    scroll: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 4h10a2 2 0 0 1 2 2v13a1.5 1.5 0 0 1-3 0V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v1"/><path d="M8 4a2 2 0 0 0-2 2v13a1.5 1.5 0 0 1-3 0V9a2 2 0 0 1 2-2h1"/><line x1="9" y1="8" x2="16" y2="8"/><line x1="9" y1="11" x2="16" y2="11"/></svg>',
    scroll2: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3v18l3-2 3 2 3-2 3 2V3"/><line x1="9" y1="7" x2="15" y2="7"/><line x1="9" y1="11" x2="15" y2="11"/></svg>',
    document: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></svg>',
    column: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><line x1="9" y1="21" x2="9" y2="12"/><line x1="15" y1="21" x2="15" y2="12"/></svg>'
  };

  const folderGrid = document.getElementById("lib-folder-grid");
  const folderBackdrop = document.getElementById("lib-backdrop");
  const folderPanel = document.getElementById("lib-folder-panel");
  const folderPanelTitle = document.getElementById("lib-folder-panel-title");
  const folderPanelClose = document.getElementById("lib-folder-panel-close");
  const folderPanelBack = document.getElementById("lib-folder-panel-back");
  const bookList = document.getElementById("lib-book-list");
  let lastBookListState = null; // {title, note, items, parentNestedFolder} - pentru butonul Înapoi

  const readerBackdrop = document.getElementById("lib-reader-backdrop");
  const readerModal = document.getElementById("lib-reader-modal");
  const readerBack = document.getElementById("lib-reader-back");
  const readerClose = document.getElementById("lib-reader-close");
  const readerChapterPill = document.getElementById("lib-reader-chapter-pill");
  const readerBookLabel = document.getElementById("lib-reader-book-label");
  const readerChapterLabel = document.getElementById("lib-reader-chapter-label");
  const readerChapterDropdown = document.getElementById("lib-reader-chapter-dropdown");
  // Locul de origine în DOM al dropdown-ului (în interiorul pilei), ca să-l
  // putem muta înapoi când se închide — vezi closeReaderChapterDropdown.
  const readerChapterDropdownHome = readerChapterDropdown.parentElement;
  const readerBody = document.getElementById("lib-reader-body");
  const readerPrev = document.getElementById("lib-reader-prev");
  const readerNext = document.getElementById("lib-reader-next");

  let currentFolderKey = null;
  let currentBook = null;
  let currentChapterIdx = 0; // index in book.chapters array (only for available books)
  let haftarahBackTarget = null; // cand nenul, sageata "inapoi" duce la lista de Haftarot a cartii, nu la ultimul folder din Bibliotecă

const CATEGORY_CARD_IMAGES = {
    "arhivaRabinica": "images/category-arhivarabinica.jpg",
    "canonic": "images/category-canonic.jpg",
    "deuterocanonic": "images/category-deuterocanonic.jpg",
    "pseudepigraf": "images/category-pseudepigraf.jpg",
    "apocrifeNT": "images/category-apocrifent.jpg",
    "patristice": "images/category-patristice.jpg"
  };

const SUBFOLDER_CARD_IMAGES = {
    "arhivaRabinica": [
      "images/subfolder-arhivarabinica-1.jpg",
      "images/subfolder-arhivarabinica-2.jpg",
      "images/subfolder-arhivarabinica-3.jpg",
      "images/subfolder-arhivarabinica-4.jpg",
      "images/subfolder-arhivarabinica-5.jpg",
      "images/subfolder-arhivarabinica-6.jpg"
    ],
    "deuterocanonic": [
      "images/subfolder-deuterocanonic-1.jpg",
      "images/subfolder-deuterocanonic-2.jpg",
      "images/subfolder-deuterocanonic-3.jpg",
      "images/subfolder-deuterocanonic-4.jpg",
      "images/subfolder-deuterocanonic-5.jpg",
      "images/subfolder-deuterocanonic-6.jpg"
    ],
    "pseudepigraf": [
      "images/subfolder-pseudepigraf-1.jpg",
      "images/subfolder-pseudepigraf-2.jpg",
      "images/subfolder-pseudepigraf-3.jpg",
      "images/subfolder-pseudepigraf-4.jpg",
      "images/subfolder-pseudepigraf-5.jpg",
      "images/subfolder-pseudepigraf-6.jpg",
      "images/subfolder-pseudepigraf-7.jpg"
    ],
    "apocrifeNT": [
      "images/subfolder-apocrifent-1.jpg",
      "images/subfolder-apocrifent-2.jpg",
      "images/subfolder-apocrifent-3.jpg",
      "images/subfolder-apocrifent-5.jpg"
    ],
    "patristice": [
      "images/subfolder-patristice-1.jpg",
      "images/subfolder-patristice-2.jpg",
      "images/subfolder-patristice-3.jpg",
      "images/subfolder-patristice-4.jpg"
    ],
    "canonic": [
      "images/subfolder-canonic-1.jpg",
      "images/subfolder-canonic-2.jpg"
    ]
  };

  // ---- build folder grid (6 image cards, order fixed) ----
  const LIB_SKELETON = {"arhivaRabinica":{"label":"ARHIVĂ RABINICĂ","note":"","isNested":true,"subfolders":[{"label":"Tora - Textul Masoretic","note":"Traducere Rosen, 2023, licență CC-BY-NC."},{"label":"Pentateuhul Samaritean","note":"Text critic academic (Schorch, ed. 2018)."},{"label":"Talmud Babilonian","note":""},{"label":"Mișna","note":""},{"label":"Kabbala","note":""},{"label":"Tanakh - Tora/Neviim/Ketuvim - comentarii","note":""}]},"deuterocanonic":{"label":"DEUTEROCANONIC","note":"","isNested":true,"subfolders":[{"label":"Narațiuni istorice","note":""},{"label":"Cărți de înțelepciune","note":""},{"label":"Scrieri profetice","note":""},{"label":"Cărțile Macabeilor","note":""},{"label":"Adaosuri la Estera și Daniel","note":""},{"label":"Alte texte (tradiție ortodoxă)","note":""}]},"pseudepigraf":{"label":"APOCRIFE VT","note":"","panelTitle":"Apocrife VT (Pseudepigraf)","isNested":true,"subfolders":[{"label":"Ciclul lui Enoh și Jubileele","note":""},{"label":"Testamentele celor 12 Patriarhi","note":"Ultimele cuvinte atribuite fiecăruia dintre fiii lui Iacov, cu îndemnuri morale și viziuni despre urmași. Sec. II î.Hr. – II d.Hr."},{"label":"Vieți și înălțări ale patriarhilor","note":""},{"label":"Apocalipse","note":""},{"label":"Psalmi și ode","note":""},{"label":"Narațiuni înțelepte și istorice","note":""},{"label":"Oracole","note":""}]},"apocrifeNT":{"label":"APOCRIFE NT","note":"","isNested":true,"subfolders":[{"label":"Evanghelii","note":""},{"label":"Scrieri Gnostice","note":"Texte gnostice sau gnostic-adiacente din primele secole creștine."},{"label":"Fapte apostolice","note":""},{"label":"Apocalipse","note":""}]},"patristice":{"label":"SCRIERI PATRISTICE / ISTORICE","note":"","isNested":true,"subfolders":[{"label":"Istorici","note":""},{"label":"Părinți Apostolici","note":""},{"label":"Apologeți și Părinți timpurii","note":""},{"label":"Părinți clasici","note":""}]}};
  // pregătește (în fundal) imaginile cardurilor din Diverse, ca la deschidere să fie deja în memorie
  window.libPreloadCardImages = function(){
    const urls = [].concat(Object.values(CATEGORY_CARD_IMAGES), ...Object.values(SUBFOLDER_CARD_IMAGES));
    let i = 0; (function next(){ if(i >= urls.length) return; const im = new Image(); im.decoding = "async"; im.src = urls[i++]; im.onload = im.onerror = () => setTimeout(next, 40); })();
  };
  // așteaptă datele bibliotecii (library-data.js), dacă încă nu au sosit
  function libWhenReady(fn){
    if(typeof LIBRARY !== "undefined"){ fn(); return; }
    window.libLoad();
    const t = setInterval(() => { if(typeof LIBRARY !== "undefined"){ clearInterval(t); fn(); } }, 80);
  }
  const CATEGORY_ORDER = ["arhivaRabinica","patristice","canonic","deuterocanonic","pseudepigraf","apocrifeNT"];
  const CATEGORY_LABELS = { arhivaRabinica: "ARHIVĂ RABINICĂ", patristice: "SCRIERI PATRISTICE / ISTORICE", canonic: "CANONIC", deuterocanonic: "DEUTEROCANONIC", pseudepigraf: "APOCRIFE VT", apocrifeNT: "APOCRIFE NT" };
  CATEGORY_ORDER.forEach(key => {
    const tile = document.createElement("div");
    tile.className = "lib-folder-tile";
    const img = document.createElement("img");
    img.src = CATEGORY_CARD_IMAGES[key];
    img.alt = CATEGORY_LABELS[key];
    tile.appendChild(img);
    tile.addEventListener("click", () => {
      // datele bibliotecii vin din library-data.js; dacă încă nu au sosit (telefon lent, primele secunde), se așteaptă și se deschide imediat ce ajung
      const open = () => {
        const folder = libData()[key];
        if(!folder) return;
        if(folder.isNested) openSubfolderList(folder, key);
        else if(key === "canonic") { currentFolderKey = key; openCanonicCards(folder); }
        else { currentFolderKey = key; openBookListPanel(folder.panelTitle || folder.label, folder.note, folder.books, null); }
      };
      if(typeof LIBRARY !== "undefined") open();
      else if(LIB_SKELETON[key]){ window.libLoad(); openSubfolderList(LIB_SKELETON[key], key); } // cardurile apar instant din schelet; cărțile se deschid când sosește biblioteca
      else { window.libLoad(); libWhenReady(open); }
    });
    folderGrid.appendChild(tile);
  });

  // ---- CANONIC: 2 carduri-imagine (Vechiul Testament / Noul Testament) ----
  function openCanonicCards(folder){
    folderPanelTitle.textContent = folder.panelTitle || folder.label;
    folderPanelBack.style.display = "none";
    currentOnBack = null;
    lastBookListState = null;
    bookList.innerHTML = "";
    bookList.scrollTop = 0;
    const grid = document.createElement("div");
    grid.className = "lib-folder-grid-2col";
    folder.books.forEach((book, i) => {
      const tile = document.createElement("div");
      tile.className = "lib-folder-tile-lg";
      const img = document.createElement("img");
      img.src = (SUBFOLDER_CARD_IMAGES.canonic || [])[i] || "";
      img.alt = book.name;
      tile.appendChild(img);
      tile.addEventListener("click", () => openCanonicInfo(book, folder));
      grid.appendChild(tile);
    });
    bookList.appendChild(grid);
    folderBackdrop.classList.add("show");
    folderPanel.classList.add("show");
  }

  // ---- CANONIC: ecran simplu cu titlul cărții și starea ei (fără cititor, fără capitole false) ----
  function openCanonicInfo(book, folder){
    folderPanelTitle.textContent = book.name;
    folderPanelBack.style.display = "";
    currentOnBack = () => openCanonicCards(folder);
    lastBookListState = null;
    bookList.innerHTML = "";
    bookList.scrollTop = 0;
    const box = document.createElement("div");
    box.className = "home-card";
    box.style.margin = "10px 0";
    box.innerHTML =
      '<div class="home-card-label">' + book.name + '</div>' +
      '<div class="home-essay-text" style="display:block; margin-top:6px;">' + (book.meta || "") + '</div>';
    bookList.appendChild(box);
    folderBackdrop.classList.add("show");
    folderPanel.classList.add("show");
  }

  function countLeafItems(subfolders){
    let n = 0;
    subfolders.forEach(sf => {
      if(sf.isInfo) { n += 1; return; }
      (sf.items || []).forEach(it => { if(!it.isHeader) n += 1; });
    });
    return n;
  }

  // ---- nivel 1: lista de sub-foldere din ARHIVĂ RABINICĂ ----
  function openSubfolderList(folder, key){
    folderPanelTitle.textContent = folder.panelTitle || folder.label;
    folderPanelBack.style.display = "none";
    currentOnBack = null;
    bookList.innerHTML = "";
    bookList.scrollTop = 0;
    if(folder.note){
      const note = document.createElement("div");
      note.className = "settings-footnote";
      note.style.marginBottom = "10px";
      note.textContent = folder.note;
      bookList.appendChild(note);
    }
    const images = SUBFOLDER_CARD_IMAGES[key] || [];
    let imgIdx = 0;
    const grid = document.createElement("div");
    grid.className = "lib-folder-grid-2col";
    folder.subfolders.forEach(sf => {
      if(sf.isInfo){
        // afișare directă, fără cititor — text simplu, mereu vizibil, fără nicio dependență
        const infoBox = document.createElement("div");
        infoBox.className = "home-card";
        infoBox.style.margin = "10px 0";
        infoBox.innerHTML =
          '<div class="home-card-label">' + sf.label + '</div>' +
          '<div class="home-essay-text" style="display:block; margin-top:6px;">' + sf.text + '</div>';
        bookList.appendChild(infoBox);
        return;
      }
      const tile = document.createElement("div");
      tile.className = "lib-folder-tile-lg";
      const img = document.createElement("img");
      img.src = images[imgIdx] || "";
      img.alt = sf.label;
      imgIdx++;
      tile.appendChild(img);
      tile.addEventListener("click", () => {
        // din schelet (înainte să sosească biblioteca) lipsește lista de cărți: se ia din datele complete, când există
        libWhenReady(() => {
          const full = ((libData()[key] || {}).subfolders || []).find(s => s.label === sf.label) || sf;
          openBookListPanel(sf.label, sf.note, full.items, () => openSubfolderList(folder, key));
        });
      });
      grid.appendChild(tile);
    });
    bookList.appendChild(grid);
    folderBackdrop.classList.add("show");
    folderPanel.classList.add("show");
  }

  // ---- nivel 2 (sau nivel 1 pentru folderele simple): lista de cărți ----
  let currentOnBack = null; // funcție de apelat la Înapoi (sau null); suportă orice adâncime de imbricare
  function openBookListPanel(title, note, items, onBack){
    currentOnBack = onBack || null;
    lastBookListState = { title, note, items, onBack: currentOnBack };
    folderPanelTitle.textContent = title;
    folderPanelBack.style.display = currentOnBack ? "" : "none";
    bookList.innerHTML = "";
    bookList.scrollTop = 0;
    if(note){
      const noteEl = document.createElement("div");
      noteEl.className = "settings-footnote";
      noteEl.style.marginBottom = "10px";
      noteEl.textContent = note;
      bookList.appendChild(noteEl);
    }
    let currentGroupBody = null;
    function renderBookRow(entry, container){
      if(entry.isSubgroup && (entry.items || []).some(it => it.books && it.books.length)){
        const wrap = document.createElement("div");
        wrap.className = "lib-acc-wrap";
        const nBooks = (entry.items || []).reduce((s, it) => s + (it.books || []).filter(b => /^Cartea/.test(b.label)).length, 0);
        const row = document.createElement("div");
        row.className = "lib-book-item";
        row.innerHTML =
          '<div><div class="lib-book-name">' + entry.label + '</div>' +
          '<div class="lib-book-meta">' + nBooks + ' cărți</div></div>' +
          '<span class="lib-book-chev">▾</span>';
        const body = document.createElement("div");
        body.className = "lib-acc-body";
        const multi = entry.items.filter(it => it.books).length > 1;
        entry.items.forEach(it => {
          if(!it.books) return;
          let host = body;
          if(multi){
            const sub = document.createElement("div");
            sub.className = "lib-acc-sub";
            const srow = document.createElement("div");
            srow.className = "lib-book-item";
            srow.innerHTML =
              '<div><div class="lib-book-name">' + it.name + '</div>' +
              '<div class="lib-book-meta">' + it.books.filter(b => /^Cartea/.test(b.label)).length + ' cărți</div></div>' +
              '<span class="lib-book-chev">▾</span>';
            const sbody = document.createElement("div");
            sbody.className = "lib-acc-body";
            srow.addEventListener("click", (e) => {
              e.stopPropagation();
              const was = sub.classList.contains("open");
              body.querySelectorAll(".lib-acc-sub.open").forEach(el => el.classList.remove("open"));
              if(!was) sub.classList.add("open");
            });
            sub.appendChild(srow);
            sub.appendChild(sbody);
            body.appendChild(sub);
            host = sbody;
          }
          it.books.forEach(bk => {
            const r = document.createElement("div");
            r.className = "lib-book-item";
            r.innerHTML =
              '<div><div class="lib-book-name">' + bk.label + '</div>' +
              (bk.theme ? '<div class="lib-book-meta">' + bk.theme + '</div>' : '') + '</div>' +
              '<span class="lib-book-go">→</span>';
            r.addEventListener("click", (e) => {
              e.stopPropagation();
              openReaderAtChapter(it, bk.idx);
            });
            host.appendChild(r);
          });
        });
        row.addEventListener("click", () => {
          const wasOpen = wrap.classList.contains("open");
          bookList.querySelectorAll(".lib-acc-wrap.open").forEach(el => el.classList.remove("open"));
          if(!wasOpen){
            wrap.classList.add("open");
            wrap.scrollIntoView({ block: "nearest" });
          }
        });
        wrap.appendChild(row);
        wrap.appendChild(body);
        container.appendChild(wrap);
        return;
      }
      if(entry.isSubgroup){
        const item = document.createElement("div");
        item.className = "lib-book-item";
        const left = document.createElement("div");
        const count = (entry.items || []).filter(it => !it.isHeader).length + " documente";
        left.innerHTML =
          '<div class="lib-book-name">' + entry.label + '</div>' +
          '<div class="lib-book-meta">' + count + '</div>';
        item.appendChild(left);
        const chev = document.createElement("span");
        chev.className = "lib-book-go";
        chev.textContent = "→";
        item.appendChild(chev);
        item.addEventListener("click", () => {
          openBookListPanel(entry.label, entry.note, entry.items, () => openBookListPanel(title, note, items, onBack));
        });
        container.appendChild(item);
        return;
      }
      const book = entry;
      const item = document.createElement("div");
      item.className = "lib-book-item" + (book.available ? "" : " unavailable");
      const left = document.createElement("div");
      left.innerHTML =
        '<div class="lib-book-name">' + book.name + '</div>' +
        '<div class="lib-book-meta">' + (book.name_ro || book.meta || "") + '</div>';
      item.appendChild(left);
      const chev = document.createElement("span");
      chev.className = "lib-book-go";
      chev.textContent = "→";
      item.appendChild(chev);
      item.dataset.slug = book.slug;
      item.addEventListener("click", () => openReader(book));
      container.appendChild(item);
    }
    items.forEach(entry => {
      if(entry.isHeader){
        const wrap = document.createElement("div");
        wrap.className = "lib-group";
        const h = document.createElement("div");
        h.className = "lib-section-title lib-section-toggle";
        h.innerHTML = '<span>' + entry.name + '</span><span class="lib-section-chev">▸</span>';
        const body = document.createElement("div");
        body.className = "lib-group-body";
        wrap.appendChild(h);
        wrap.appendChild(body);
        bookList.appendChild(wrap);
        currentGroupBody = body;
        return;
      }
      renderBookRow(entry, currentGroupBody || bookList);
    });

    // Un singur handler central (event delegation): clic pe un titlu de secțiune
    // deschide/închide acea secțiune; clic oriunde altundeva, în afara secțiunii
    // deschise, o închide automat (click-outside-to-close / outside click handler).
    if(!folderPanel.dataset.accBound){
      folderPanel.dataset.accBound = "1";
      folderPanel.addEventListener("click", (e) => {
        bookList.querySelectorAll(".lib-acc-wrap.open").forEach(el => { if(!el.contains(e.target)) el.classList.remove("open"); });
      });
    }
    if(!bookList.dataset.accordionBound){
      bookList.dataset.accordionBound = "1";
      bookList.addEventListener("click", (e) => {
        const headerEl = e.target.closest(".lib-section-toggle");
        const openBody = bookList.querySelector(".lib-group-body.open");
        const openHeader = bookList.querySelector(".lib-section-toggle.open");
        if(headerEl){
          const body = headerEl.nextElementSibling;
          const wasOpen = body.classList.contains("open");
          if(openBody) openBody.classList.remove("open");
          if(openHeader) openHeader.classList.remove("open");
          if(!wasOpen){ body.classList.add("open"); headerEl.classList.add("open"); }
          return;
        }
        if(openBody && !openBody.contains(e.target)){
          openBody.classList.remove("open");
          if(openHeader) openHeader.classList.remove("open");
        }
      });
    }
    folderBackdrop.classList.add("show");
    folderPanel.classList.add("show");
  }

  function openFolder(key){
    currentFolderKey = key;
    const folder = libData()[key];
    if(folder.isNested) openSubfolderList(folder, key);
    else if(key === "canonic") openCanonicCards(folder);
    else openBookListPanel(folder.label, folder.note, folder.books, null);
  }
  function closeFolderPanel(){
    folderBackdrop.classList.remove("show");
    folderPanel.classList.remove("show");
  }
  folderPanelClose.addEventListener("click", closeFolderPanel);
  folderPanelBack.addEventListener("click", () => {
    if(currentOnBack) currentOnBack();
  });
  folderBackdrop.addEventListener("click", closeFolderPanel);

  // ---- reader ----
  // Haftarot — varianta completă (lexicon + Citire/Aprofundare) se citește direct
  // în tab-ul Biblia, în același loc/format ca Geneza (nu într-un panou separat
  // ca restul Bibliotecii): mutăm temporar #lib-reader-modal în #tab-biblia, în
  // locul lui #verses, fără fundal/antet/ecran-plin propriu — pila "Cărți" și
  // bara de jos rămân cele din tab-ul Biblia, nemodificate.
  let haftarahInlineMode = false;
  function enterHaftarahInline(){
    if(haftarahInlineMode) return;
    haftarahInlineMode = true;
    readerModal.classList.add("lib-reader-inline");
    const mainVerses = document.getElementById("verses");
    mainVerses.style.display = "none";
    mainVerses.insertAdjacentElement("afterend", readerModal);
    const navFloat = document.getElementById("chapter-nav-float");
    if(navFloat) navFloat.classList.remove("show");
  }
  function exitHaftarahInline(){
    if(!haftarahInlineMode) return;
    haftarahInlineMode = false;
    readerModal.classList.remove("lib-reader-inline");
    document.querySelector(".app").appendChild(readerModal);
    const mainVerses = document.getElementById("verses");
    mainVerses.style.display = "";
    if(typeof updateChapterNavFloat === "function") updateChapterNavFloat();
  }
  window.exitHaftarahInline = exitHaftarahInline;
  window.isHaftarahInline = function(){ return haftarahInlineMode; };
  // Cartea de Haftarot citită acum inline (ex. "Haftarot — Geneza"), cât timp
  // suntem în acest mod — folosită de pila "Cărți" de sus, ca s-o poată
  // redeschide direct la lista corectă, nu la lista principală de cărți.
  window.getCurrentHaftarahBook = function(){ return haftarahInlineMode ? currentBook : null; };
  // Apelată de setMode() (comutatorul Citire/Aprofundare din antetul tab-ului
  // Biblia, folosit de ambele moduri — canonic și Haftarot) ca să rerandeze
  // Haftara curentă, nu VERSES (care rămâne ascuns cât timp citim o Haftarah).
  window.reRenderInlineHaftarah = function(){ if(haftarahInlineMode) renderChapter(); };
  function openReader(book){
    exitHaftarahInline();
    haftarahBackTarget = null;
    currentBook = book;
    currentChapterIdx = 0;
    readerBackdrop.classList.add("show");
    readerModal.classList.add("show");
    libApplyTextPrefs();
    renderChapter();
  }
  function closeReader(){
    readerBackdrop.classList.remove("show");
    readerModal.classList.remove("show");
    closeReaderChapterDropdown();
  }
  readerClose.addEventListener("click", () => { closeReader(); if(typeof window.libReturnToVerseSheet === "function") window.libReturnToVerseSheet(); });
  window.closeLibReaderForNav = function(){ window.libReturnCtx = null; closeReader(); if(typeof closeFolderPanel === "function") closeFolderPanel(); };
  window.openHaftarahAt = function(book, idx){
    currentFolderKey = null;
    lastBookListState = null;
    haftarahBackTarget = book;
    currentBook = book;
    currentChapterIdx = idx;
    enterHaftarahInline();
    libApplyTextPrefs();
    renderChapter();
  };
  readerBackdrop.addEventListener("click", () => { closeReader(); if(typeof window.libReturnToVerseSheet === "function") window.libReturnToVerseSheet(); });
  readerBack.addEventListener("click", () => {
    closeReader();
    if(typeof window.libReturnToVerseSheet === "function" && window.libReturnToVerseSheet()) return; // venit din „Citește pasajul” → înapoi la comentarii/texte
    if(haftarahBackTarget){
      const target = haftarahBackTarget;
      haftarahBackTarget = null;
      if(typeof window.reopenHaftarahList === "function") window.reopenHaftarahList(target);
      return;
    }
    if(lastBookListState){
      openBookListPanel(lastBookListState.title, lastBookListState.note, lastBookListState.items, lastBookListState.onBack);
    } else if(currentFolderKey){
      openFolder(currentFolderKey);
    }
  });

  // ---- deschidere directă la un capitol anume (folosit de săgeata aurie din
  // comentariile apocrife, ex. Geneza -> 1 Enoh cap. 6) ----
  function findLibraryBookBySlug(slug){
    function searchList(list){
      if(!Array.isArray(list)) return null;
      for(const entry of list){
        if(!entry || entry.isHeader) continue;
        if(entry.isSubgroup){
          const found = searchList(entry.items);
          if(found) return found;
          continue;
        }
        if(entry.slug === slug) return entry;
      }
      return null;
    }
    for(const key of Object.keys(libData())){
      const folder = libData()[key];
      if(Array.isArray(folder.books)){
        const found = searchList(folder.books);
        if(found) return found;
      }
      if(Array.isArray(folder.subfolders)){
        for(const sub of folder.subfolders){
          const found = searchList(sub.items);
          if(found) return found;
        }
      }
    }
    return null;
  }
  function openReaderAtChapter(book, chapterIdx){
    exitHaftarahInline();
    currentBook = book;
    currentChapterIdx = chapterIdx;
    readerBackdrop.classList.add("show");
    readerModal.classList.add("show");
    libApplyTextPrefs();
    renderChapter();
  }
  // apelată din HTML-ul comentariilor (ex. genesis-6.js), ca onclick inline —
  // de aceea e expusă pe window, nu doar închisă în acest scope local
  window.openLibraryCitation = function(slug, chapterNum){
    const book = findLibraryBookBySlug(slug);
    if(!book){
      console.warn("Lucrare negăsită în Bibliotecă pentru citare:", slug);
      return;
    }
    const total = totalChapters(book);
    const idx = Math.min(Math.max(0, (chapterNum|0) - 1), Math.max(0, total - 1));
    openReaderAtChapter(book, idx);
  };

  // pentru căutare: toate lucrările din Bibliotecă (fără duplicate) și deschiderea
  // unei lucrări la un capitol anume, din afara acestui scope
  // întoarce { book, group }: group = colecția din care face parte lucrarea (Zohar, Mișna, Flavius Josephus…)
  window.libSearchWorks = function(){
    const out = [], seen = {};
    function add(book, group){
      if(book && book.slug && !book.isHeader && !seen[book.slug]){ seen[book.slug] = 1; out.push({ book, group }); }
    }
    function walkItems(items, folderLabel, nestedLabel){
      let header = "";
      (items || []).forEach(e => {
        if(!e) return;
        if(e.isHeader){ header = e.name || ""; return; }
        if(Array.isArray(e.items)){ walkItems(e.items, folderLabel, (e.label || "").split(" — ")[0].trim()); return; }
        // la Kabbala secțiunile (Zohar, Sefer Ietzira…) sunt colecții separate; la Mișna/Talmud toată colecția e una
        const group = nestedLabel || (/^Kabbala/.test(folderLabel) && header ? header : folderLabel);
        add(e, group);
      });
    }
    Object.keys(libData()).forEach(key => {
      const f = libData()[key];
      if(Array.isArray(f.books)) walkItems(f.books, f.label || "", "");
      if(Array.isArray(f.subfolders)) f.subfolders.forEach(s => walkItems(s.items, s.label || "", ""));
    });
    return out;
  };
  // Deschide Diverse la lista în care se află lucrarea (folder → subfolder → grupul ei desfăcut),
  // ca după închiderea cititorului utilizatorul să rămână în Diverse, lângă carte.
  window.libRevealBook = function(slug){
    function hasBook(items){ return (items || []).some(e => e && !e.isHeader && (e.slug === slug || (e.isSubgroup && hasBook(e.items)))); }
    function pathTo(items){
      for(const e of (items || [])){
        if(!e || e.isHeader) continue;
        if(e.slug === slug) return [];
        if(e.isSubgroup && !(e.items || []).some(it => it.books && it.books.length)){ const p = pathTo(e.items); if(p) return [e].concat(p); }
      }
      return null;
    }
    for(const key of Object.keys(libData())){
      const folder = libData()[key];
      let listItems = null, label = folder.label, note = folder.note, onBack = null;
      if(folder.isNested && Array.isArray(folder.subfolders)){
        const sf = folder.subfolders.find(s => hasBook(s.items));
        if(!sf) continue;
        currentFolderKey = key; openSubfolderList(folder, key);
        listItems = sf.items; label = sf.label; note = sf.note; onBack = () => openSubfolderList(folder, key);
      } else if(Array.isArray(folder.books) && hasBook(folder.books)){
        currentFolderKey = key; listItems = folder.books;
      } else continue;
      openBookListPanel(label, note, listItems, onBack);
      let items = listItems, cur = { title: label, note, items: listItems, onBack };
      for(const sub of (pathTo(listItems) || [])){
        const prev = cur;
        cur = { title: sub.label, note: sub.note, items: sub.items, onBack: () => openBookListPanel(prev.title, prev.note, prev.items, prev.onBack) };
        openBookListPanel(cur.title, cur.note, cur.items, cur.onBack);
      }
      const row = bookList.querySelector('.lib-book-item[data-slug="' + slug + '"]');
      if(row){
        const body = row.closest(".lib-group-body");
        if(body){ const hd = body.previousElementSibling; body.classList.add("open"); if(hd) hd.classList.add("open"); }
        row.scrollIntoView({ block: "center" });
      }
      return true;
    }
    return false;
  };
  window.openLibraryAt = function(slug, chapterIdx, verse, ms){
    if(window.libReturnArmed) window.libReturnArmed = false; else window.libReturnCtx = null; // doar „Citește pasajul” din foaia de verset păstrează calea de întoarcere; căutarea etc. rămân ca înainte
    const book = findLibraryBookBySlug(slug);
    if(!book) return;
    libPendingFocus = (verse !== undefined && verse !== null && verse !== "") ? { slug, idx: chapterIdx | 0, v: verse, ms: ms || 0 } : null;
    openReaderAtChapter(book, chapterIdx | 0);
  };

  // ---- „Citește pasajul": din comentariile unui verset spre lucrarea din Bibliotecă, la locul citat ----
  function libNorm(s){ return String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim(); }
  const LIB_TANAKH_SRC = [
    [/^Rashi\b(?!.*citat direct)/, "rashi"], [/^Ibn Ezra/, "ibnezra"], [/^Ramban/, "ramban"], [/^Sforno/, "sforno"],
    [/^Rashbam/, "rashbam"], [/^Da'at Zekenim/, "daat"], [/^Radak/, "radak"],
    [/^Targum Onkelos/, "onkelos"], [/^Targum Ionatan/, "ionatan"], [/^Chizkuni/, "chizkuni"], [/^Bekhor Shor/, "bekhorshor"], [/^Or HaChaim/, "orhachaim"]
  ];
  const LIB_MISHNA_SRC = { "Ievamot": "yevamot", "Sanhedrin": "sanhedrin", "Mikvaot": "mikvaot", "Sota": "sotah", "Eduiot": "eduyot", "Bava Kama": "bava-kamma" };
  const LIB_TALMUD_SRC = {"Berahot":"berakhot","Șabat":"shabbat","Eruvin":"eruvin","Pesahim":"pesachim","Ioma":"yoma","Suca":"sukkah","Roș Hașana":"rosh-hashanah","Taanit":"taanit","Megila":"megillah","Hagiga":"chagigah","Ievamot":"yevamot","Ketubot":"ketubot","Nazir":"nazir","Sota":"sotah","Ghitin":"gittin","Kidușin":"kiddushin","Bava Kama":"bava-kamma","Bava Batra":"bava-batra","Sanhedrin":"sanhedrin","Avoda Zara":"avodah-zarah","Hulin":"chullin","Arahin":"arakhin","Tamid":"tamid","Nida":"niddah","Berakhot":"berakhot","Chagigah":"chagigah"};
  const LIB_ROMAN = { I:1, II:2, III:3, IV:4, V:5, VI:6, VII:7, VIII:8, IX:9, X:10, XI:11, XII:12, XIII:13, XIV:14, XV:15, XVI:16, XVII:17, XVIII:18, XIX:19, XX:20 };
  const LIB_APOC_SRC = [
    [/^Cartea Jubileelor (\d+)/, "jubileele"], [/^1 Enoh (\d+)/, "1-enoh"], [/^Viața lui Adam și Eva (\d+)/, "viata-adam-eva"],
    [/^4 Ezdra (\d+)(?::(\d+))?/, "4-ezdra"], [/^2 Baruh (\d+)(?::(\d+))?/, "2-baruh"],
    [/^Apocalipsa lui Moise (\d+)/, "apocalipsa-moise"], [/^Apocalipsa lui Avraam (\d+)/, "apocalipsa-avraam"]
  ];
  // Întoarce { slug, spec } sau null. Lucrările încă nedisponibile (ex. Talmud) nu primesc buton.
  window.libResolveSource = function(label, bookSlug, chNum, vNum, rowSrc){
    // rând cu țintă ascunsă (ex. Talmud: eticheta arată „cap. 9”, ținta exactă e în câmpul src)
    if(rowSrc && rowSrc.slug){ const bk = findLibraryBookBySlug(rowSrc.slug); return (bk && bk.available !== false) ? { slug: rowSrc.slug, spec: rowSrc.spec } : null; }
    label = String(label || "");
    let m, slug = null, spec = null;
    if(bookSlug === "genesis"){
      for(const [re, k] of LIB_TANAKH_SRC){
        if(re.test(label)){
          const s = "tanakh-genesis-comentatori-" + k;
          const idx = window.TANAKH_GEN_INDEX && window.TANAKH_GEN_INDEX[s];
          if(idx && idx[chNum] && idx[chNum].indexOf(vNum) >= 0){ slug = s; spec = { num: chNum, v: vNum }; }
          break;
        }
      }
      if(!slug && /Samaritean/i.test(label) && !/Descoperire/i.test(label)){ slug = "sp-geneza"; spec = { num: chNum, v: vNum }; }
    }
    if(!slug && (m = label.match(/^Zohar, (Sifra di-Țeniuta|Idra Raba|Idra Zuta) (\d+):(\d+)/))){ slug = m[1] === "Sifra di-Țeniuta" ? "kab-zo-sifra-ditzniuta" : (m[1] === "Idra Raba" ? "kab-zo-idra-raba" : "kab-zo-idra-zuta"); spec = { num: +m[2], v: +m[3] }; }
    if(!slug && (m = label.match(/^Zohar, (.+?) (\d+:\d+)\s*$/))){ slug = "kab-zo-zohar"; spec = { title: m[1], v: m[2] }; }
    if(!slug && (m = label.match(/^Mi[șs]na, (.+?) (\d+):(\d+)/)) && LIB_MISHNA_SRC[m[1]]){ slug = "mishna-" + LIB_MISHNA_SRC[m[1]]; spec = { num: +m[2], v: +m[3] }; }
    if(!slug && (m = label.match(/^Josephus Flavius, Antichitățile Iudaice, Cartea ([IVX]+), cap\. (\d+)/))){
      const n = LIB_ROMAN[m[1]];
      if(n){
        // capitolul se caută după titlu („Cartea I, cap. 1 — …"), pentru că Cartea I începe cu Prefața
        const vol = findLibraryBookBySlug(n <= 10 ? "josephus-antichitati-cartea1" : "josephus-antichitati-cartea2");
        const pre = "Cartea " + m[1] + ", cap. " + m[2] + " ";
        const at = vol ? (vol.chapters || []).findIndex(c => String(c.title || "").indexOf(pre) === 0) : -1;
        if(vol && at >= 0){ slug = vol.slug; spec = { idx: at, v: "__first" }; }
      }
    }
    if(!slug && (m = label.match(/^Talmud(?:ul)?(?: Babilonian)?,? \(?([^()\d]+?) (\d+[ab])(?::(\d+))?/)) && LIB_TALMUD_SRC[m[1].trim()]){ slug = "talmud-" + LIB_TALMUD_SRC[m[1].trim()]; spec = { page: m[2], v: m[3] ? +m[3] : "__first" }; }
    if(!slug){
      for(const [re, s] of LIB_APOC_SRC){
        if((m = label.match(re))){ slug = s; spec = { num: +m[1], v: m[2] ? +m[2] : "__first" }; break; }
      }
    }
    if(!slug) return null;
    const book = findLibraryBookBySlug(slug);
    if(!book || book.available === false) return null;
    // capitolul trebuie să existe (la Zohar titlurile sunt cunoscute din listă); altfel nu arătăm butonul
    if(spec.title && Array.isArray(book.chapters) && book.chapters.length && libPassageIdx(book, spec) < 0) return null;
    if(Array.isArray(book.pages) && spec.page && book.pages.indexOf(spec.page) < 0) return null;
    return { slug, spec };
  };
  function libEnsureLoaded(book, cb){
    if(!book.lazySrc || book._lazyLoaded || (book.chapters && book.chapters.length)){ cb(); return; }
    const s = document.createElement("script");
    s.src = book.lazySrc;
    s.onload = () => {
      const d = (window.LIB_LAZY || {})[book.slug];
      if(d && Array.isArray(d.chapters) && d.chapters.length){ book.chapters = d.chapters; book._lazyLoaded = true; }
      cb();
    };
    s.onerror = () => cb();
    document.head.appendChild(s);
  }
  function libPassageIdx(book, spec){
    const chs = book.chapters || [];
    if(spec.idx != null) return spec.idx;
    if(spec.page){ const re = new RegExp("Foaia " + spec.page + "$"); return chs.findIndex(c => re.test(String(c.title || ""))); }
    if(spec.title){ const t = libNorm(spec.title); return chs.findIndex(c => libNorm(String(c.title || "").split(" - ")[0]) === t); }
    if(spec.num != null) return chs.findIndex(c => c.num === spec.num);
    return 0;
  }
  window.openLibraryPassage = function(slug, spec){
    const book = findLibraryBookBySlug(slug);
    if(!book) return;
    libEnsureLoaded(book, () => {
      let idx = libPassageIdx(book, spec);
      if(idx < 0) idx = 0;
      window.openLibraryAt(slug, idx, spec.v, 1000);
    });
  };

  // ---- info ediție (iconița ⓘ din cititor) ----
  const libReaderInfo = document.getElementById("lib-reader-info");
  const libInfoBackdrop = document.getElementById("lib-info-backdrop");
  const libInfoModal = document.getElementById("lib-info-modal");
  const libInfoTitle = document.getElementById("lib-info-title");
  const libInfoBody = document.getElementById("lib-info-body");
  const libInfoClose = document.getElementById("lib-info-close");

  function openInfoModal(){
    const book = currentBook;
    if(!book) return;
    libInfoTitle.textContent = book.name;
    const ed = book.edition || {};
    let html = "";
    if(book.meta) html += "<div><b>Structură:</b> " + book.meta + "</div>";
    if(book.author) html += "<div><b>Autor:</b> " + book.author + "</div>";
    if(ed.translation) html += "<div><b>Traducere:</b> " + ed.translation + "</div>";
    if(ed.source) html += "<div><b>Sursă:</b> " + ed.source + "</div>";
    if(ed.source_status) html += "<div><b>Stare sursă:</b> " + ed.source_status + "</div>";
    if(ed.modernization) html += "<div><b>Modernizare:</b> " + ed.modernization + "</div>";
    if(Array.isArray(book.notes) && book.notes.length) html += "<div><b>Note generale:</b></div>" + book.notes.map(n => "<div>• " + n + "</div>").join("");
    if(!html) html = "<div>Nu sunt detalii suplimentare de ediție pentru această carte.</div>";
    libInfoBody.innerHTML = html;
    libInfoBackdrop.classList.add("show");
    libInfoModal.classList.add("show");
  }
  function closeInfoModal(){
    libInfoBackdrop.classList.remove("show");
    libInfoModal.classList.remove("show");
  }
  if(libReaderInfo){
    libReaderInfo.addEventListener("click", openInfoModal);
    libInfoClose.addEventListener("click", closeInfoModal);
    libInfoBackdrop.addEventListener("click", closeInfoModal);
  }

  // ---- Setări de citire (Aa) pentru cititorul din Diverse: temă, font, mărime, spațiere ----
  function libGetTextPrefs(){
    let font = "serif", size = 15, theme = "dark", spacing = "normal";
    try { font = localStorage.getItem("libReaderFont") || "serif"; } catch(e){}
    try { size = parseInt(localStorage.getItem("libReaderSize"), 10) || 15; } catch(e){}
    try { theme = localStorage.getItem("libReaderTheme") || "dark"; } catch(e){}
    try { spacing = localStorage.getItem("libReaderSpacing") || "normal"; } catch(e){}
    return { font, size, theme, spacing };
  }
  function libApplyTextPrefs(){
    const { font, size, theme, spacing } = libGetTextPrefs();
    const fontObj = VS_FONTS.find(f => f.id === font) || VS_FONTS[0];
    readerBody.style.fontFamily = fontObj.css;
    readerBody.style.fontSize = size + "px";
    readerModal.classList.remove("theme-dark", "theme-light", "theme-sepia");
    readerModal.classList.add("theme-" + theme);
    readerBody.classList.remove("lsp-compact", "lsp-normal", "lsp-wide");
    readerBody.classList.add("lsp-" + spacing);
  }
  libApplyTextPrefs();

  const libReaderAaBtn = document.getElementById("lib-reader-aa");
  const libTextBackdrop = document.getElementById("lib-text-backdrop");
  const libTextModal = document.getElementById("lib-text-modal");
  const libTextClose = document.getElementById("lib-text-close");

  function renderLibTextPanel(){
    const { font, size, theme, spacing } = libGetTextPrefs();
    const themeRow = document.getElementById("lib-text-theme-row");
    const fontRow = document.getElementById("lib-text-font-row");
    const sizeRow = document.getElementById("lib-text-size-row");
    const spacingRow = document.getElementById("lib-text-spacing-row");
    themeRow.innerHTML = LIB_THEMES.map(t =>
      '<button class="vsp-chip' + (t.id === theme ? ' active' : '') + '" data-theme="' + t.id + '"><span class="vsp-chip-swatch" style="background:' + t.bg + '"></span>' + t.label + '</button>'
    ).join("");
    fontRow.innerHTML = VS_FONTS.map(f =>
      '<button class="vsp-chip' + (f.id === font ? ' active' : '') + '" data-font="' + f.id + '" style="font-family:' + f.css + '">' + f.label + '</button>'
    ).join("");
    sizeRow.innerHTML = VS_SIZES.map(s =>
      '<button class="vsp-chip' + (s === size ? ' active' : '') + '" data-size="' + s + '">' + s + '</button>'
    ).join("");
    spacingRow.innerHTML = LIB_SPACINGS.map(sp =>
      '<button class="vsp-icon-chip' + (sp.id === spacing ? ' active' : '') + '" data-spacing="' + sp.id + '" title="Spațiere">' + LSP_ICONS[sp.id] + '</button>'
    ).join("");
    themeRow.querySelectorAll(".vsp-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        try { localStorage.setItem("libReaderTheme", chip.dataset.theme); } catch(e){}
        libApplyTextPrefs();
        renderLibTextPanel();
      });
    });
    fontRow.querySelectorAll(".vsp-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        try { localStorage.setItem("libReaderFont", chip.dataset.font); } catch(e){}
        libApplyTextPrefs();
        renderLibTextPanel();
      });
    });
    sizeRow.querySelectorAll(".vsp-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        try { localStorage.setItem("libReaderSize", chip.dataset.size); } catch(e){}
        libApplyTextPrefs();
        renderLibTextPanel();
      });
    });
    spacingRow.querySelectorAll(".vsp-icon-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        try { localStorage.setItem("libReaderSpacing", chip.dataset.spacing); } catch(e){}
        libApplyTextPrefs();
        renderLibTextPanel();
      });
    });
  }
  function openLibTextModal(){
    renderLibTextPanel();
    libTextBackdrop.classList.add("show");
    libTextModal.classList.add("show");
  }
  function closeLibTextModal(){
    libTextBackdrop.classList.remove("show");
    libTextModal.classList.remove("show");
  }
  if(libReaderAaBtn){
    libReaderAaBtn.addEventListener("click", openLibTextModal);
    libTextClose.addEventListener("click", closeLibTextModal);
    libTextBackdrop.addEventListener("click", closeLibTextModal);
  }

  function totalChapters(book){
    if(book.available && book.chapters.length) return book.chapters.length;
    // pentru cărți indisponibile, extragem un număr aproximativ din "meta" dacă există (ex: "19 capitole")
    const m = (book.meta || "").match(/(\d+)\s*capitole/);
    return m ? parseInt(m[1], 10) : 1;
  }

  // Lucrări încărcate la cerere (ex. Haftarot): datele vin dintr-un fișier separat (book.lazySrc)
  function loadLazyBook(book){
    readerBody.innerHTML = "";
    showLazyLoading();
    if(book._lazyLoading) return;
    book._lazyLoading = true;
    const s = document.createElement("script");
    s.src = book.lazySrc;
    s.onload = () => {
      book._lazyLoading = false;
      const data = (window.HAFTAROT_DATA || {})[book.slug] || (window.LIB_LAZY || {})[book.slug];
      if(data && Array.isArray(data.chapters) && data.chapters.length){
        book.chapters = data.chapters;
        book._lazyLoaded = true;
        if(currentBook === book) renderChapter();
      }
    };
    s.onerror = () => { book._lazyLoading = false; showLazyError(); };
    document.head.appendChild(s);
  }
  function showLazyLoading(){
    const d = document.createElement("div");
    d.className = "lib-reader-placeholder";
    d.textContent = "Se încarcă…";
    readerBody.appendChild(d);
  }
  function showLazyError(){
    readerBody.innerHTML = "";
    const d = document.createElement("div");
    d.className = "lib-reader-placeholder";
    d.textContent = "Textul nu a putut fi încărcat. Verifică conexiunea și încearcă din nou.";
    readerBody.appendChild(d);
  }
  // Capitole încărcate la cerere (ex. Zohar: fiecare parașă în fișierul ei, ch.lazyChap)
  function loadLazyChapter(book, ch){
    showLazyLoading();
    if(ch._lazyLoading) return;
    ch._lazyLoading = true;
    const s = document.createElement("script");
    s.src = ch.lazyChap;
    s.onload = () => {
      ch._lazyLoading = false;
      let ok = false;
      // un fișier poate conține mai multe capitole (ex. Josephus: o carte întreagă)
      book.chapters.forEach(c => {
        if(c.lazyChap !== ch.lazyChap) return;
        const data = (window.LIB_LAZY || {})[book.slug + "#" + c.num];
        if(Array.isArray(data) && data.length){
          c.verses = data;
          c._lazyLoaded = true;
          if(c === ch) ok = true;
        }
      });
      if(ok){
        if(currentBook === book && book.chapters[currentChapterIdx] === ch) renderChapter();
      } else showLazyError();
    };
    s.onerror = () => { ch._lazyLoading = false; showLazyError(); };
    document.head.appendChild(s);
  }
  // Titlul de capitol afișat: la Haftarot doar partea românească; lucrările cu plainTitles îl arată întreg
  function chapterTitleShown(book, title){
    if(book && book.plainTitles) return title;
    return (typeof splitHaftarahTitle === "function" ? splitHaftarahTitle(title).line2 : "") || title;
  }
  function libBookOfRef(ref){
    const m = (ref || "").match(/^((?:[1-3]\s)?[^\d(]+?)\s+\d/);
    return m ? m[1].trim() : "";
  }
  function renderRichLibVerse(book, ch, v){
    const p = document.createElement("p");
    p.className = "lib-verse lib-verse-rich";
    p.dataset.v = String(v.v);
    const num = document.createElement("span");
    num.className = "lib-verse-num";
    num.textContent = v.v;
    p.appendChild(num);
    const aprofundare = (typeof appMode !== "undefined" && appMode === "aprofundare");
    (v.tokens || [{ t: v.t }]).forEach(tok => {
      if(tok.w && tok.strong && aprofundare){
        const span = document.createElement("span");
        span.className = "word" + (tok.t.trim().includes(" ") ? " word-phrase" : "");
        span.textContent = tok.t;
        span.addEventListener("click", (e) => { e.stopPropagation(); if(typeof showWordPopover === "function") showWordPopover(tok, span); });
        p.appendChild(span);
      } else if(tok.editorial){
        const span = document.createElement("span");
        span.className = "editorial";
        span.textContent = tok.t;
        p.appendChild(span);
      } else {
        p.appendChild(document.createTextNode(tok.t));
      }
    });
    const bookName = /[A-Za-zĂÂÎȘȚăâîșț]/.test(String(v.v)) ? "" : libBookOfRef(ch.ref);
    const ctx = { ref: (ch.title ? ch.title + " — " : "") + (bookName ? bookName + " " : "") + v.v, key: "lib_" + book.slug + "_" + ch.num + "_" + v.v };
    if(aprofundare){
      const hint = document.createElement("span");
      hint.className = "comment-hint comment-note-chip";
      hint.textContent = "note";
      p.appendChild(hint);
    }
    const sheetVerse = Object.assign({}, v, { num: v.v });
    p.addEventListener("click", () => { if(typeof openVerseSheet === "function") openVerseSheet(sheetVerse, p, ctx); });
    if(typeof applyMarkByKey === "function") applyMarkByKey(p, "mark_" + ctx.key);
    readerBody.appendChild(p);
    if(aprofundare && Array.isArray(v.refs) && v.refs.length){
      const refsRow = document.createElement("div");
      refsRow.className = "inline-refs";
      v.refs.forEach((refText, idx) => {
        if(idx > 0){ const sep = document.createElement("span"); sep.className = "ref-sep"; sep.textContent = "·"; refsRow.appendChild(sep); }
        const pill = document.createElement("span");
        pill.className = "ref-pill ref-pill-clickable";
        pill.textContent = refText;
        pill.addEventListener("click", (e) => { e.stopPropagation(); if(typeof showRefPreview === "function") showRefPreview(refText, pill); });
        refsRow.appendChild(pill);
      });
      readerBody.appendChild(refsRow);
    }
  }
  // numărul de capitol afișat: cel real din sursă (ex. Marcion, Evanghelia lui Luca începe la cap. 5);
  // la lucrările numerotate de la 0 sau fără număr propriu rămâne poziția + 1
  function libChNum(ch, i){
    if(ch && typeof ch.num === "number" && ch.num !== i) return ch.num;
    return i + 1;
  }
  window.libChNum = libChNum;
  let libPendingFocus = null; // { slug, idx, v } — versetul spre care ducem cititorul după ce se desenează capitolul
  function libFocusVerse(){
    const f = libPendingFocus;
    if(!f || !currentBook || currentBook.slug !== f.slug || currentChapterIdx !== f.idx) return;
    libPendingFocus = null;
    const el = f.v === "__first" ? readerBody.querySelector(".lib-verse[data-v]") : readerBody.querySelector('[data-v="' + String(f.v).replace(/"/g, '\\"') + '"]');
    if(!el) return;
    const cls = f.ms ? "verse-flash-1s" : "verse-flash";
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.scrollIntoView({ block: "center" });
      el.classList.remove(cls);
      void el.offsetWidth;
      el.classList.add(cls);
      setTimeout(() => el.classList.remove(cls), f.ms ? f.ms + 100 : 2200);
    }));
  }
  function renderChapter(){
    const book = currentBook;
    const total = totalChapters(book);
    const ch0 = book.chapters ? book.chapters[currentChapterIdx] : null;
    readerBookLabel.textContent = (book.name_ro || book.name || "").replace(/\s*\([^)]*\)\s*$/g, "").replace(/\s*\([^)]*\)\s*$/g, "").trim();
    readerBookLabel.title = book.name || "";
    // La lucrări cu titlu propriu per capitol (ex. Haftarot — fiecare "capitol"
    // e de fapt o Haftarah separată, cu titlul ei), pila mică de sus arată acel
    // titlu, nu un simplu număr de capitol generic.
    // Doar varianta română, nu tot titlul bilingv — într-o pilă mică, titlul
    // complet ("Ebraic - Român") nu încape și se taie urât.
    const ch0TitleRo = (ch0 && ch0.title && typeof splitHaftarahTitle === "function") ? chapterTitleShown(book, ch0.title) : (ch0 && ch0.title);
    // La Kabbala/Mișna titlurile lungi de capitol (ex. „Introducere — cele 32 de Netivot…”) nu încap în pilă: apare „Cap. N”, titlul întreg rămâne în dropdown și în corpul paginii
    const shortCh = (book.slug && /^(kab-|mishna-)/.test(book.slug) && ch0TitleRo && ch0TitleRo.length > 14) ? "Cap. " + libChNum(ch0, currentChapterIdx) : null;
    // La Josephus pila arată doar „XI, cap. 1” (cartea și capitolul), ca să încapă lângă „Volumul 2”; titlul întreg rămâne în dropdown și în corpul paginii
    const josephusCh = (book.slug && /^(josephus-(antichitati|razboiul)|eusebiu-istoria)/.test(book.slug) && ch0TitleRo && ch0TitleRo.indexOf(" — ") > 0) ? ch0TitleRo.slice(0, ch0TitleRo.indexOf(" — ")).replace(/^Cartea\s+/, "") : null;
    readerChapterLabel.textContent = shortCh || josephusCh || ch0TitleRo || "Cap. " + libChNum(ch0, currentChapterIdx);
    // În mod inline (Haftarot citite direct în tab-ul Biblia), pila proprie e
    // ascunsă — se actualizează în loc pila "Cărți" principală (#book-pill-label),
    // exact ca la schimbarea unui capitol din Geneza.
    if(haftarahInlineMode && typeof bookPillLabel !== "undefined" && bookPillLabel){
      bookPillLabel.textContent = ch0TitleRo || (book.name || "");
    }
    readerBody.innerHTML = "";
    if(book.lazySrc && !book._lazyLoaded){ loadLazyBook(book); return; }
    if(ch0 && ch0.lazyChap && !ch0._lazyLoaded){ loadLazyChapter(book, ch0); return; }

    // Antetul-copertă al colecției (nume + rezumat) apare doar la primul capitol
    // ȘI doar la lucrări fără titlu propriu per capitol — la Haftarot, unde
    // fiecare capitol e o Haftarah de sine stătătoare, antetul de mai jos arată
    // DOAR titlul acelei Haftara, niciodată numele colecției părinte.
    if(currentChapterIdx === 0 && !(ch0 && ch0.title)){
      const h = document.createElement("div");
      h.className = "lib-reader-book-title";
      h.textContent = book.name;
      readerBody.appendChild(h);
      if(book.summary){
        const s = document.createElement("div");
        s.className = "lib-reader-book-summary";
        s.textContent = book.summary;
        readerBody.appendChild(s);
      }
      if(book.prologue){
        const pr = document.createElement("div");
        pr.className = "lib-reader-book-summary lib-reader-prologue";
        pr.innerHTML = '<div class="lib-prologue-label">Prolog</div>' + book.prologue;
        readerBody.appendChild(pr);
      }
    }
    readerBody.classList.remove("lib-aprofundare");
    if(book.available && book.chapters[currentChapterIdx]){
      const ch = book.chapters[currentChapterIdx];
      if(ch.verses.some(v => Array.isArray(v.tokens))){
        const aprof = (typeof appMode !== "undefined" && appMode === "aprofundare");
        readerBody.classList.toggle("lib-aprofundare", aprof);
        // În mod inline, comutatorul Citire/Aprofundare din antetul tab-ului
        // Biblia e deja vizibil — nu se mai dublează unul propriu aici.
        if(!haftarahInlineMode){
          const row = document.createElement("div");
          row.className = "lib-mode-row";
          const tg = document.createElement("div");
          tg.className = "mode-toggle";
          [["citire", "Citire"], ["aprofundare", "Aprofundare"]].forEach(([m, label]) => {
            const b = document.createElement("button");
            b.className = "mode-btn" + (((m === "aprofundare") === aprof) ? " active" : "");
            b.textContent = label;
            b.addEventListener("click", () => {
              if(typeof setMode === "function") setMode(m);
              const y = readerBody.scrollTop;
              renderChapter();
              readerBody.scrollTop = y;
            });
            tg.appendChild(b);
          });
          row.appendChild(tg);
          readerBody.insertBefore(row, readerBody.firstChild);
        }
      }
      if(ch.title){
        const head = document.createElement("div");
        head.className = "lib-haft-head";
        const t = document.createElement("div");
        t.className = "lib-reader-book-title";
        // Doar varianta română, nu titlul bilingv complet ("Ebraic - Român") —
        // acela nu încape pe un rând la titluri mai lungi (ex. "Sabat Hanuca (II)
        // - Sabatul Luminilor (II)") și se rupe pe 2 rânduri, urât.
        t.textContent = chapterTitleShown(book, ch.title);
        head.appendChild(t);
        if(ch.ref){ const r = document.createElement("div"); r.className = "lib-haft-ref"; r.textContent = ch.ref; head.appendChild(r); }
        if(ch.intro){ const s = document.createElement("div"); s.className = "lib-reader-book-summary"; s.textContent = ch.intro; head.appendChild(s); }
        readerBody.appendChild(head);
      }
      ch.verses.forEach(v => {
        if(Array.isArray(v.tokens)){ renderRichLibVerse(book, ch, v); return; }
        if(v.h){
          const sh = document.createElement("div");
          sh.className = "lib-sec-head";
          sh.textContent = v.h;
          readerBody.appendChild(sh);
        }
        const p = document.createElement("p");
        p.className = "lib-verse";
        p.dataset.v = String(v.v);
        const extracted = extractInlineFootnotes(v.t || "");
        const allNotes = (v.notes || []).concat(extracted.notes);
        let html = '<span class="lib-verse-num">' + v.v + '</span>' + extracted.text.replace(/\n\n+/g, '<br><br>');
        if(allNotes.length){
          html += ' <button class="lib-note-btn" title="Notă">note</button>';
        }
        p.innerHTML = html;
        if(allNotes.length){
          const btn = p.querySelector(".lib-note-btn");
          btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const pg = /Foaia (\d+[ab])$/.exec(String(ch.title || "")); openNoteModal(book.name + " " + (pg ? "Foaia " + pg[1] : libChNum(ch, currentChapterIdx)) + ":" + v.v, allNotes);
          });
        }
        readerBody.appendChild(p);
      });
    } else {
      const ph = document.createElement("div");
      ph.className = "lib-reader-placeholder";
      ph.textContent = book.customPlaceholder || (book.name + " " + (currentChapterIdx + 1) + " nu e încă disponibil.");
      readerBody.appendChild(ph);
    }

    readerPrev.disabled = currentChapterIdx <= 0;
    readerNext.disabled = currentChapterIdx >= total - 1;
    buildChapterDropdown(total);
    readerBody.scrollTop = 0;
    libFocusVerse();
  }

  // ---- Note explicative pe verset: extrage notele inline (Tora Rosen) și le afișează în iconița de notă ----
  function extractInlineFootnotes(text){
    // nota de subsol poate conține etichete <i> interioare, deci închiderea se caută cu numărare, nu cu prima </i>
    const notes = [];
    const marker = /<sup class="footnote-marker">[^<]*<\/sup>\s*<i class="footnote">/g;
    let out = "", i = 0;
    for(;;){
      marker.lastIndex = i;
      const m = marker.exec(text);
      if(!m){ out += text.slice(i); break; }
      out += text.slice(i, m.index);
      const tag = /<(\/?)i\b[^>]*>/g;
      tag.lastIndex = m.index + m[0].length;
      let depth = 1, t, close = -1, closeLen = 0;
      while((t = tag.exec(text))){ depth += t[1] ? -1 : 1; if(depth === 0){ close = t.index; closeLen = t[0].length; break; } }
      if(close < 0){ out += text.slice(m.index); break; }
      notes.push(text.slice(m.index + m[0].length, close).replace(/<[^>]+>/g, "").trim());
      i = close + closeLen;
    }
    return { text: out, notes };
  }

  function openNoteModal(ref, notes){
    libInfoTitle.textContent = "Notă — " + ref;
    libInfoBody.innerHTML = notes.map(n => '<div>' + n + '</div>').join("");
    libInfoBackdrop.classList.add("show");
    libInfoModal.classList.add("show");
  }

  function buildChapterDropdown(total){
    readerChapterDropdown.innerHTML = "";
    // La lucrări cu titlu propriu per capitol (Haftarot — fiecare "capitol" e o
    // Haftarah distinctă, cu numele ei românesc), dropdown-ul arată acel titlu,
    // nu un număr sec — la fel ca lista din selectorul "Cărți". Grila de 6
    // coloane (gândită pentru cifre) strica total textul lung, așa că trecem
    // pe lista verticală (aceeași clasă folosită deja la dropdown-ul de cărți).
    const chapters = (currentBook && Array.isArray(currentBook.chapters)) ? currentBook.chapters : null;
    const hasTitles = !!(chapters && chapters.some(c => c && c.title));
    readerChapterDropdown.classList.toggle("lib-reader-book-list", hasTitles);
    for(let i = 0; i < total; i++){
      const btn = document.createElement("button");
      const chTitle = chapters && chapters[i] && chapters[i].title;
      btn.className = "chapter-num-btn" + (i === currentChapterIdx ? " active" : "") + (chTitle ? " lib-reader-book-btn" : "");
      btn.textContent = chTitle || libChNum(chapters && chapters[i], i);
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        currentChapterIdx = i;
        closeReaderChapterDropdown();
        renderChapter();
      });
      readerChapterDropdown.appendChild(btn);
    }
  }

  // Lucrări împărțite în cărți (Josephus, Eusebiu): clic pe numele din pilă arată cărțile (I, II, …) ale lucrării curente
  function collectWorkBooks(book){
    const chs = book && Array.isArray(book.chapters) ? book.chapters : [];
    const list = [];
    chs.forEach((c, i) => {
      if(!c || c.book === undefined) return;
      if(!list.some(x => x.book === c.book)) list.push({ book: c.book, idx: i });
    });
    return list.length > 1 ? list : null;
  }

  function buildWorkBooksDropdown(list){
    readerChapterDropdown.innerHTML = "";
    readerChapterDropdown.classList.add("lib-reader-book-list");
    const curCh = currentBook.chapters[currentChapterIdx];
    const curBook = curCh ? curCh.book : null;
    list.forEach(item => {
      const btn = document.createElement("button");
      btn.className = "chapter-num-btn lib-reader-book-btn" + (item.book === curBook ? " active" : "");
      btn.textContent = item.book === "" ? "Prefață" : "Cartea " + item.book;
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        currentChapterIdx = item.idx;
        closeReaderChapterDropdown();
        readerChapterDropdown.classList.remove("lib-reader-book-list");
        renderChapter();
      });
      readerChapterDropdown.appendChild(btn);
    });
    const sibs = findSiblingBooks(currentBook.slug) || [];
    const stem = s => (s || "").replace(/\d+$/, "");
    sibs.filter(sib => sib.slug !== currentBook.slug && sib.available !== false && stem(sib.slug) === stem(currentBook.slug)).forEach(sib => {
      const btn = document.createElement("button");
      btn.className = "chapter-num-btn lib-reader-book-btn";
      btn.textContent = (sib.name || "") + " →";
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        closeReaderChapterDropdown();
        readerChapterDropdown.classList.remove("lib-reader-book-list");
        openReader(sib);
      });
      readerChapterDropdown.appendChild(btn);
    });
  }

  function findSiblingBooks(slug){
    // Haftarot nu mai trăiește (varianta completă) în LIBRARY, ci în HAFTAROT_BOOKS
    // (vezi secțiunea BOOKS/AVAILABLE) — verificăm întâi acolo.
    if(typeof HAFTAROT_BOOKS !== "undefined" && HAFTAROT_BOOKS.some(b => b.slug === slug)){
      return HAFTAROT_BOOKS;
    }
    let found = null;
    (function walk(node){
      if(found) return;
      if(Array.isArray(node)){
        if(node.some(it => it && it.slug === slug)){ found = node; return; }
        node.forEach(walk);
      } else if(node && typeof node === "object"){
        if(Array.isArray(node.items)) walk(node.items);
        if(Array.isArray(node.subfolders)) walk(node.subfolders);
        Object.values(node).forEach(v => { if(Array.isArray(v) || (v && typeof v === "object")) walk(v); });
      }
    })(libData());
    if(!found) return null;
    // Listele cu secțiuni (ex. Mișna: ordine + „Lucrări suplimentare despre Avot”) sunt plate,
    // cu antete (isHeader) între grupuri: dropdown-ul arată doar grupul din care face parte lucrarea.
    if(found.some(it => it && it.isHeader)){
      const at = found.findIndex(it => it && it.slug === slug);
      let from = at, to = at;
      while(from > 0 && !(found[from - 1] && found[from - 1].isHeader)) from--;
      while(to < found.length - 1 && !(found[to + 1] && found[to + 1].isHeader)) to++;
      found = found.slice(from, to + 1);
    }
    return found.filter(it => it && it.slug && !it.isHeader);
  }

  function buildBookDropdown(siblings){
    readerChapterDropdown.innerHTML = "";
    readerChapterDropdown.classList.add("lib-reader-book-list");
    const isHaftarot = typeof HAFTAROT_BOOKS !== "undefined" && siblings === HAFTAROT_BOOKS;
    siblings.filter(sib => sib.available !== false || sib.slug === currentBook.slug).forEach(sib => {
      const btn = document.createElement("button");
      btn.className = "chapter-num-btn lib-reader-book-btn" + (sib.slug === currentBook.slug ? " active" : "");
      btn.textContent = sib.name_ro ? sib.name_ro.trim() : (sib.name || "").replace(/\s*\([^)]*\)\s*$/g, "").trim();
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        closeReaderChapterDropdown();
        readerChapterDropdown.classList.remove("lib-reader-book-list");
        if(isHaftarot && typeof window.openHaftarahAt === "function") window.openHaftarahAt(sib, 0);
        else openReader(sib);
      });
      readerChapterDropdown.appendChild(btn);
    });
  }

  // Bug real, reprodus live (nu presupus): dacă corpul textului fusese
  // derulat chiar înainte de deschidere, dropdown-ul (position:absolute,
  // ancorat în interiorul antetului cu scroll/randare proprie) reda greșit —
  // rândurile de la fund "ieșeau" peste margine, peste textul din spate,
  // vizibil mai ales în modul Aprofundare (text mai dens). Nici forțarea unui
  // reflow, nici eliminarea isolation:isolate, nici un z-index explicit pe
  // corp n-au rezolvat — semn că nu-i o problemă de o singură proprietate
  // CSS, ci de interacțiune cu ancestori (scroll, randare proprie a antetului).
  //
  // Reparare robustă: cât e deschis, dropdown-ul e mutat direct în <body>
  // ("portal"), în afara oricărui ancestor cu scroll/randare proprie —
  // position:fixed calculat din poziția reală a pilei pe ecran (getBoundingClientRect,
  // mereu relativ la ecran, fără ambiguitate de container). La închidere, e
  // mutat înapoi la locul lui original (readerChapterDropdownHome), ca
  // structura paginii să rămână neschimbată.
  function openReaderChapterDropdown(){
    const pillRect = readerChapterPill.getBoundingClientRect();
    document.body.appendChild(readerChapterDropdown);
    readerChapterDropdown.style.position = "fixed";
    readerChapterDropdown.style.left = pillRect.left + "px";
    readerChapterDropdown.style.width = pillRect.width + "px";
    readerChapterDropdown.style.top = (pillRect.bottom + 6) + "px";
    readerChapterDropdown.style.right = "auto";
    readerChapterDropdown.classList.add("show");
    readerChapterDropdown.scrollTop = 0;
  }
  function closeReaderChapterDropdown(){
    readerChapterDropdown.classList.remove("show");
    if(readerChapterDropdown.parentElement === document.body){
      readerChapterDropdownHome.appendChild(readerChapterDropdown);
    }
    readerChapterDropdown.style.position = "";
    readerChapterDropdown.style.left = "";
    readerChapterDropdown.style.width = "";
    readerChapterDropdown.style.top = "";
    readerChapterDropdown.style.right = "";
  }
  readerChapterPill.addEventListener("click", (e) => {
    e.stopPropagation();
    const alreadyShown = readerChapterDropdown.classList.contains("show");
    if(alreadyShown){ closeReaderChapterDropdown(); return; }
    const clickedBookLabel = e.target.closest && e.target.closest("#lib-reader-book-label");
    const workBooks = clickedBookLabel ? collectWorkBooks(currentBook) : null;
    const siblings = clickedBookLabel ? findSiblingBooks(currentBook.slug) : null;
    if(workBooks){
      buildWorkBooksDropdown(workBooks);
    } else if(clickedBookLabel && siblings && siblings.length > 1){
      buildBookDropdown(siblings);
    } else {
      readerChapterDropdown.classList.remove("lib-reader-book-list");
      buildChapterDropdown(totalChapters(currentBook));
    }
    openReaderChapterDropdown();
  });
  document.addEventListener("click", (e) => {
    if(!readerChapterPill.contains(e.target) && !readerChapterDropdown.contains(e.target)){
      closeReaderChapterDropdown();
    }
  });

  function goChapter(delta){
    const total = totalChapters(currentBook);
    const next = currentChapterIdx + delta;
    if(next < 0 || next >= total) return;
    currentChapterIdx = next;
    renderChapter();
  }
  readerPrev.addEventListener("click", (e) => { spawnChapterNavRipple(e.currentTarget); goChapter(-1); });
  readerNext.addEventListener("click", (e) => { spawnChapterNavRipple(e.currentTarget); goChapter(1); });

  // Săgețile plutitoare dispar la scroll în jos, reapar la scroll în sus — identic cu Biblia
  let libReaderLastScrollY = 0;
  readerBody.addEventListener("scroll", () => {
    const y = readerBody.scrollTop;
    const delta = y - libReaderLastScrollY;
    if(y < 40 || delta < 0){
      readerPrev.classList.remove("nav-hidden");
      readerNext.classList.remove("nav-hidden");
    } else if(delta > 0){
      readerPrev.classList.add("nav-hidden");
      readerNext.classList.add("nav-hidden");
    }
    libReaderLastScrollY = y;
  }, { passive: true });

  // swipe stânga/dreapta între capitole — același prag ca la tab-ul Biblia
  let libTouchStartX = null;
  readerBody.addEventListener("touchstart", (e) => { libTouchStartX = e.touches[0].clientX; }, { passive: true });
  readerBody.addEventListener("touchend", (e) => {
    if(libTouchStartX === null) return;
    const dx = e.changedTouches[0].clientX - libTouchStartX;
    if(Math.abs(dx) > 60){
      if(dx < 0) goChapter(1);
      else goChapter(-1);
    }
    libTouchStartX = null;
  });
})();


// =====================================================================
// VERSETUL ZILEI — rotație reală, automată, prin capitolele disponibile
// Se schimbă în fiecare zi calendaristică (nu e text fix).
// Alege un capitol disponibil pe baza zilei anului, apoi încarcă acel
// fișier real de date și alege un verset din el (tot pe baza zilei) —
// deci textul afișat vine mereu din datele reale ale capitolului, nu e
// scris static în pagină.
// =====================================================================
function dayOfYear(d){
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d - start;
  return Math.floor(diff / 86400000);
}

let currentVerseOfDayData = null; // { book, chapterNum, verse } — folosit și de "Informații divine"

document.getElementById("hero-share-btn")?.addEventListener("click", () => {
  const ref = document.getElementById("home-verse-ref")?.textContent || "";
  const txt = document.getElementById("home-verse-text")?.textContent || "";
  const text = txt + " — " + ref;
  if(navigator.share){
    navigator.share({ text }).catch(() => {});
  } else if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(text);
  }
});

document.getElementById("hero-like-btn")?.addEventListener("click", (e) => {
  const btn = e.currentTarget;
  const ref = document.getElementById("home-verse-ref")?.textContent || "";
  const key = "votd-like-" + ref;
  const isLiked = btn.classList.toggle("active");
  try { localStorage.setItem(key, isLiked ? "1" : "0"); } catch(err){}
});

function loadVerseOfTheDay(){
  const refEl = document.getElementById("home-verse-ref");
  const textEl = document.getElementById("home-verse-text");
  if(!refEl || !textEl) return;

  const book = getBook("genesis");
  const chapterNum = 1;
  if(!chapterIsAvailable(book.slug, chapterNum)) return;

  const today = dayOfYear(new Date());
  const url = book.slug + "-" + chapterNum + ".js";

  // Folosim <script src> (exact mecanismul care încarcă deja capitolele în
  // tab-ul Biblia) — funcționează offline/local, spre deosebire de fetch(),
  // care e blocat de browsere pentru fișiere locale (file://) și lăsa
  // "Versetul zilei" blocat pe textul static din HTML. Ca să nu suprascriem
  // window.CHAPTER_DATA folosit de tab-ul Biblia, salvăm ce era acolo
  // înainte și-l restaurăm imediat ce citim datele noi.
  const existingScript = document.getElementById("votd-script-tmp");
  if(existingScript) existingScript.remove();
  const script = document.createElement("script");
  script.id = "votd-script-tmp";
  const previousChapterData = window.CHAPTER_DATA;
  script.onload = () => {
    const data = window.CHAPTER_DATA;
    window.CHAPTER_DATA = previousChapterData; // restaurăm imediat
    script.remove();
    if(!data || !data.length) return;
    if(votdHafActive) return; // versetul zilei vine deja din Haftarot
    const verseIndex = today % data.length;
    const verse = data[verseIndex];
    refEl.textContent = book.name + " " + chapterNum + ":" + verse.num;
    textEl.textContent = "„" + plainVerseText(verse).trim() + "”";
    currentVerseOfDayData = { book, chapterNum, verse };
    const studyBtn0 = document.getElementById("hero-toggle"); if(studyBtn0) studyBtn0.style.display = "";
    const readBtn0 = document.getElementById("hero-read-chapter-btn"); if(readBtn0) readBtn0.textContent = "Citește capitolul →";
    heroAccordionBuilt = false; // versetul s-a schimbat — accordeonul trebuie reconstruit
    if(heroAccordion.style.display !== "none") closeHeroAccordion(); // dacă era deschis, îl închidem ca să se reconstruiască la următorul click
  };
  script.onerror = () => { script.remove(); window.CHAPTER_DATA = previousChapterData; };
  script.src = url;
  document.body.appendChild(script);
}
// ---------------------------------------------------------------------
// Versetul zilei din Haftarot: câte o haftară pe zi (rotație), cu versetul din ea cel mai
// apropiat de evenimentul zilei (cuvinte comune); dacă altă haftară se potrivește mult mai bine
// evenimentului, se ia versetul de acolo. Textul vine din indexul de text al Haftarot
// (search-haftarot.js). Dacă indexul nu se încarcă, rămâne versetul din Geneza 1, ca înainte.
// ---------------------------------------------------------------------
let votdHafActive = false;
// Versetele zilei: doar versete de încurajare, bucurie, mângâiere și înălțare, alese manual din Haftarot (referințe exacte). Nu se mai alege orice verset după cuvintele evenimentului zilei.
const VOTD_CURATED = new Set(["Isaia 40:1","Isaia 40:11","Isaia 40:26","Isaia 40:29","Isaia 40:31","Isaia 41:10","Isaia 41:13","Isaia 42:6","Isaia 42:10","Isaia 42:16","Isaia 43:1","Isaia 43:2","Isaia 43:4","Isaia 43:5","Isaia 44:3","Isaia 44:22","Isaia 44:23","Isaia 49:15","Isaia 49:16","Isaia 51:3","Isaia 51:12","Isaia 52:7","Isaia 52:9","Isaia 54:10","Isaia 54:13","Isaia 54:14","Isaia 54:17","Isaia 55:1","Isaia 55:3","Isaia 55:6","Isaia 55:7","Isaia 55:8","Isaia 55:9","Isaia 55:10","Isaia 55:11","Isaia 55:12","Isaia 57:15","Isaia 57:18","Isaia 57:19","Isaia 58:8","Isaia 58:9","Isaia 58:10","Isaia 58:11","Isaia 60:1","Isaia 60:2","Isaia 60:5","Isaia 60:15","Isaia 60:19","Isaia 61:10","Isaia 62:3","Isaia 62:4","Isaia 62:5","Isaia 63:7","Isaia 63:9","Isaia 66:10","Isaia 66:13","Isaia 12:2","Isaia 12:3","Isaia 12:4","Isaia 12:5","Isaia 12:6","Isaia 9:6","Isaia 11:2","Isaia 11:9","Isaia 27:6","Isaia 6:3","Isaia 1:18","Ieremia 1:5","Ieremia 1:8","Ieremia 1:19","Ieremia 17:7","Ieremia 17:8","Ieremia 17:14","Ieremia 31:3","Ieremia 31:4","Ieremia 31:12","Ieremia 31:13","Ieremia 31:14","Ieremia 31:16","Ieremia 46:27","Osea 14:5","Osea 14:6","Osea 14:7","Osea 14:8","Ioel 2:21","Ioel 2:23","Ioel 2:24","Ioel 2:25","Ioel 2:26","Amos 9:13","Amos 9:14","Amos 9:15","Mica 7:18","Mica 7:19","Mica 6:8","Habacuc 3:18","Habacuc 3:19","Zaharia 4:6","Maleahi 3:10","Maleahi 3:12","Iosua 1:5","Iosua 1:9","2 Samuel 22:2","2 Samuel 22:3","2 Samuel 22:29","2 Samuel 22:31","2 Samuel 22:33","2 Samuel 22:34","2 Samuel 22:47","1 Samuel 2:1","1 Samuel 2:2","1 Samuel 2:8","1 Împărați 8:56","1 Împărați 8:57","Ezechiel 36:26","Ezechiel 36:28","Ezechiel 37:14","Judecători 5:3"]);
const VOTD_STOP = new Set(["dumnez","domnul","israel","pentru","aceast","acestu","aceste","dintre","despre","printr","asupra","impotr","precum","atunci","fiecar","tuturo","inaint","acesta","aceea","devine","fusese","fiind","toate","unde","cand","dupa","intre","alte","sunt","este","sale","unui","unei","altor","care","fost","anul","anului","regele","poporu"]);
function votdStem(w){
  return w.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 6);
}
function votdTokens(text){
  const set = new Set();
  String(text || "").split(/[^\p{L}\p{N}]+/u).forEach(w => {
    if(w.length < 6) return;
    const s = votdStem(w);
    if(s.length >= 5 && !VOTD_STOP.has(s)) set.add(s);
  });
  return set;
}
function votdLoadIndex(cb){
  if(window.SEARCH_HAFTAROT){ cb(); return; }
  if(document.getElementById("votd-haf-index")){ document.getElementById("votd-haf-index").addEventListener("load", cb); return; }
  const s = document.createElement("script");
  s.id = "votd-haf-index";
  s.src = "search-haftarot.js?v=1";
  s.onload = cb;
  document.head.appendChild(s);
}
function votdSetFromHaftarah(hint){
  votdLoadIndex(() => {
    const idx = window.SEARCH_HAFTAROT;
    const refEl = document.getElementById("home-verse-ref");
    const textEl = document.getElementById("home-verse-text");
    if(!idx || !refEl || !textEl) return;
    const pool = [];
    Object.keys(idx).forEach(slug => idx[slug].forEach(e => e[3].forEach(v => { if(VOTD_CURATED.has(v[0])) pool.push({ h: { slug, chIdx: e[0], title: e[2] }, v }); })));
    if(!pool.length) return;
    const day = dayOfYear(new Date());
    // versetul zilei = un verset încurajator din lista curată; dacă unul se potrivește clar cu evenimentul zilei, se alege acela, altfel urmează rotația pe zile
    const ht = votdTokens(hint);
    const score = v => { let n = 0; votdTokens(v[1]).forEach(t => { if(ht.has(t)) n++; }); return n; };
    let pick = pool[day % pool.length], best = 0;
    if(ht.size) pool.forEach(p => { const s = score(p.v); if(s > best){ best = s; if(s >= 2) pick = p; } });
    const v = pick.v;
    refEl.textContent = v[0];
    textEl.textContent = "„" + v[1] + "”";
    if(window.quoteForContext) window.quoteForContext((hint || "") + " " + v[1]); // citatul se potrivește cu istoria zilei și cu versetul
    currentVerseOfDayData = { haftarah: { slug: pick.h.slug, chIdx: pick.h.chIdx, vkey: v[2] }, verse: { num: v[2] } };
    votdHafActive = true;
    heroAccordionBuilt = false;
    if(heroAccordion.style.display !== "none") closeHeroAccordion();
    const studyBtn = document.getElementById("hero-toggle");
    if(studyBtn) studyBtn.style.display = "none"; // nota de studiu există doar pentru versetele din Geneza
    const readBtn = document.getElementById("hero-read-chapter-btn");
    if(readBtn) readBtn.textContent = "Citește haftara →";
  });
}
window.votdSetFromHaftarah = votdSetFromHaftarah;

const VOTD_BACKGROUNDS = [
  "images/votd-bg-1.jpg",
  "images/votd-bg-2.jpg",
  "images/votd-bg-3.jpg",
  "images/votd-bg-4.jpg"
];

function applyVerseOfDayBackground(){
  const card = document.getElementById("hero-verse-card");
  if(!card) return;
  const today = dayOfYear(new Date());
  const img = VOTD_BACKGROUNDS[today % VOTD_BACKGROUNDS.length];
  card.style.backgroundImage = "linear-gradient(180deg, rgba(6,10,28,0.35) 0%, rgba(6,10,28,0.6) 100%), url('" + img + "')";
  card.style.backgroundSize = "cover";
  card.style.backgroundPosition = "center";
}
applyVerseOfDayBackground();

loadVerseOfTheDay();

// Reprogramare automată la fiecare miezul nopții local — dacă tab-ul rămâne
// deschis mai multe zile, versetul zilei tot se schimbă, nu rămâne blocat
// pe cel calculat la prima încărcare a paginii.
function scheduleNextMidnightRun(callback){
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 5);
  const ms = next - now;
  setTimeout(() => { callback(); scheduleNextMidnightRun(callback); }, ms);
}
scheduleNextMidnightRun(() => { loadVerseOfTheDay(); applyVerseOfDayBackground(); });

// =====================================================================
// ISTORIA ZILEI — panou în Acasă, între „Versetul zilei” și „Pericopa săptămânii”.
// Datele vin de pe server (/api/istoria-zilei); aici e doar partea vizuală și starea panoului.
// A patra secțiune, „Sărbători”, conține calendarul sărbătorilor (randat de modulul hebcal de la finalul paginii).
// =====================================================================
(function(){
  const card = document.getElementById("history-card");
  if(!card) return;
  const LUNI_H = ["ianuarie","februarie","martie","aprilie","mai","iunie","iulie","august","septembrie","octombrie","noiembrie","decembrie"];
  const ZILE_H = ["Duminică","Luni","Marți","Miercuri","Joi","Vineri","Sâmbătă"];
  const SECS = ["events", "births", "deaths", "calendar"];
  const SHOW_FIRST = 3;
  const HEART = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 20.5s-7.5-4.6-9.2-9.4C1.6 7.6 3.6 4.5 6.8 4.5c2 0 3.6 1.1 5.2 3 1.6-1.9 3.2-3 5.2-3 3.2 0 5.2 3.1 4 6.6-1.7 4.8-9.2 9.4-9.2 9.4z"/></svg>';

  const el = id => document.getElementById(id);
  let dayKey = "";
  let open = "events";
  let infoOpen = false;
  let loadReq = 0;

  function mk(tag, cls, text){
    const n = document.createElement(tag);
    if(cls) n.className = cls;
    if(text !== undefined) n.textContent = text;
    return n;
  }
  function now(){ const n = new Date(); return { m: n.getMonth() + 1, d: n.getDate(), y: n.getFullYear(), w: n.getDay() }; }
  function capMonth(m){ const s = LUNI_H[m - 1]; return s.charAt(0).toUpperCase() + s.slice(1); }
  function dateText(){
    const t = now();
    return t.d + " " + capMonth(t.m) + " · " + ZILE_H[t.w] + " · " + t.y;
  }

  function applyBackground(){
    const imgs = (typeof VOTD_BACKGROUNDS !== "undefined") ? VOTD_BACKGROUNDS : [];
    if(!imgs.length) return;
    const img = imgs[(dayOfYear(new Date()) + 1) % imgs.length]; // altă poză decât „Versetul zilei”
    card.style.backgroundImage = "linear-gradient(180deg, rgba(6,10,28,0.35) 0%, rgba(6,10,28,0.6) 100%), url('" + img + "')";
    card.style.backgroundSize = "cover";
    card.style.backgroundPosition = "center";
  }

  function setOpen(sec){
    open = sec;
    SECS.forEach(s => {
      const isOpen = (s === sec);
      el("history-tab-" + s).setAttribute("aria-expanded", isOpen ? "true" : "false");
      el("history-sec-" + s).classList.toggle("open", isOpen);
    });
  }
  function setInfo(on){
    infoOpen = on;
    el("history-info-btn").setAttribute("aria-expanded", on ? "true" : "false");
    el("history-info").classList.toggle("open", on);
  }

  // rândul de sus al unei secțiuni: eticheta în stânga, data în dreapta
  function kickerRow(text, withDate){
    const row = mk("div", "history-kicker-row");
    row.appendChild(mk("div", "history-kicker", text));
    if(withDate) row.appendChild(mk("div", "history-date", dateText()));
    return row;
  }

  // --- piese reutilizabile ---
  function toggleList(list, btn, labelMore, labelLess){
    const extras = list.querySelectorAll("li[data-extra]");
    if(!extras.length){ btn.remove(); return; }
    let expanded = false;
    btn.setAttribute("aria-expanded", "false");
    btn.textContent = labelMore + " ⌄";
    btn.addEventListener("click", () => {
      expanded = !expanded;
      extras.forEach(li => { li.hidden = !expanded; });
      btn.setAttribute("aria-expanded", expanded ? "true" : "false");
      btn.textContent = expanded ? labelLess + " ⌃" : labelMore + " ⌄";
    });
  }
  function makeList(items, build){
    const ul = mk("ul", "history-list");
    items.forEach((it, i) => {
      const li = build(it);
      if(i >= SHOW_FIRST){ li.hidden = true; li.setAttribute("data-extra", "1"); }
      ul.appendChild(li);
    });
    return ul;
  }
  function note(body, text, retry){
    body.textContent = "";
    body.appendChild(mk("p", "history-note", text));
    if(retry){
      const b = mk("button", "history-btn", "Reîncearcă");
      b.type = "button";
      b.addEventListener("click", load);
      body.appendChild(b);
    }
  }
  function shorten(s, n){
    if(s.length <= n) return s;
    return s.slice(0, n).replace(/\s+\S*$/, "") + "…";
  }
  function eventItem(e){
    const li = mk("li");
    li.appendChild(mk("span", "history-year", e.year));
    li.appendChild(document.createTextNode(" — " + shorten(e.text, 220)));
    return li;
  }

  function renderEvents(data){
    const body = el("history-body-events");
    body.textContent = "";
    const main = data.main;
    if(!main && !data.events.length){ note(body, "Nu am găsit evenimente pentru această zi."); return; }
    body.appendChild(kickerRow("⭐ Evenimentul zilei", false));

    const t = now();
    if(main){
      // rezumatul (o propoziție) → „29 Octombrie 1948” → povestea (3–4 propoziții, la vedere) → „Alte evenimente” din aceeași zi
      body.appendChild(mk("div", "history-title", main.text));
      body.appendChild(mk("div", "history-event-date", t.d + " " + capMonth(t.m) + " " + main.year));
      if(main.story){
        main.story.paragraphs.forEach(p => body.appendChild(mk("p", "history-cont", p)));
      }
    } else {
      body.appendChild(mk("div", "history-event-date", t.d + " " + capMonth(t.m)));
    }

    const others = mk("div", "history-sec history-story");
    others.id = "history-story";
    const inner = mk("div", "history-sec-inner");
    others.appendChild(inner);
    if(data.events.length){
      inner.appendChild(mk("div", "history-subhead", "Alte evenimente din această zi"));
      const ul = mk("ul", "history-list");
      data.events.forEach(e => ul.appendChild(eventItem(e)));
      inner.appendChild(ul);
    }

    const actions = mk("div", "history-actions");
    if(data.events.length){
      const readBtn = mk("button", "history-btn");
      readBtn.type = "button";
      readBtn.setAttribute("aria-controls", "history-story");
      readBtn.setAttribute("aria-expanded", "false");
      readBtn.textContent = "Alte evenimente ⌄";
      readBtn.addEventListener("click", () => {
        const opening = !others.classList.contains("open");
        others.classList.toggle("open", opening);
        readBtn.setAttribute("aria-expanded", opening ? "true" : "false");
        readBtn.textContent = opening ? "Alte evenimente ⌃" : "Alte evenimente ⌄";
      });
      actions.appendChild(readBtn);
    }
    const heart = mk("button", "history-btn history-heart");
    heart.type = "button";
    heart.setAttribute("aria-label", "Salvează evenimentul zilei");
    heart.innerHTML = HEART;
    const likeKey = "hist-like-" + dayKey;
    let liked = false;
    try { liked = localStorage.getItem(likeKey) === "1"; } catch(e){}
    heart.setAttribute("aria-pressed", liked ? "true" : "false");
    heart.addEventListener("click", () => {
      liked = !liked;
      heart.setAttribute("aria-pressed", liked ? "true" : "false");
      try { localStorage.setItem(likeKey, liked ? "1" : "0"); } catch(e){}
    });
    actions.appendChild(heart);
    body.appendChild(actions);
    body.appendChild(others);
  }

  function renderPeople(secId, list, kicker, moreLabel, emptyText){
    const body = el("history-body-" + secId);
    body.textContent = "";
    const tabBtn = el("history-tab-" + secId);
    tabBtn.hidden = !list.length;
    if(!list.length){ body.textContent = ""; if(open === secId) setOpen("events"); return; }
    body.appendChild(kickerRow(kicker, false));
    const ul = makeList(list, p => {
      const li = mk("li");
      li.appendChild(mk("span", "history-year", p.year));
      li.appendChild(document.createTextNode(" — "));
      li.appendChild(mk("span", "history-person-name", p.name));
      const detail = [p.role, p.life].filter(Boolean).join(" · ");
      if(detail) li.appendChild(mk("span", "history-person-role", shorten(detail, 220)));
      return li;
    });
    body.appendChild(ul);
    const more = mk("button", "history-more");
    more.type = "button";
    body.appendChild(more);
    toggleList(ul, more, moreLabel, "Arată mai puține");
  }

  function renderInfo(data){
    // textul panoului e fix, în HTML: Wikipedia - CC BY-SA 4.0 (RO/ENG) și Wikidata - CC0
  }

  function renderAll(data){
    renderEvents(data);
    renderPeople("births", data.births, "🎂 Născuți în această zi", "Vezi toate aniversările", "Nu am găsit nașteri pentru această zi.");
    renderPeople("deaths", data.deaths, "🕊️ Comemorări", "Vezi toate comemorările", "Nu am găsit comemorări pentru această zi.");
    renderInfo(data);
  }

  function setLoading(){
    ["events", "births", "deaths"].forEach(s => note(el("history-body-" + s), "Se încarcă istoria zilei…"));
  }

  async function load(){
    const my = ++loadReq;
    const t = now();
    setLoading();
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 20000);
    try {
      const r = await fetch(TTS_API_BASE + "/api/istoria-zilei?m=" + t.m + "&d=" + t.d, { signal: ctrl.signal });
      if(!r.ok) throw new Error("http " + r.status);
      const data = await r.json();
      if(my !== loadReq) return;
      renderAll(data);
      if(window.votdSetFromHaftarah){
        const m = data.main;
        window.votdSetFromHaftarah(m ? m.text + " " + (m.story ? m.story.paragraphs.join(" ") : "") : "");
      }
    } catch(e){
      if(my !== loadReq) return;
      ["events", "births", "deaths"].forEach(s => note(el("history-body-" + s), "Nu am putut obține istoria zilei acum.", true));
      if(window.votdSetFromHaftarah) window.votdSetFromHaftarah("");
    } finally { clearTimeout(timer); }
  }

  // la schimbarea zilei: conținut nou, liste restrânse
  function checkDay(){
    const t = now();
    const key = t.m + "-" + t.d;
    if(key === dayKey) return;
    dayKey = key;
    el("history-head-date").textContent = dateText();
    applyBackground();
    setOpen("events");
    setInfo(false);
    load();
  }

  document.querySelectorAll(".history-tab").forEach(btn => {
    btn.addEventListener("click", () => setOpen(open === btn.dataset.sec ? null : btn.dataset.sec));
  });
  el("history-info-btn").addEventListener("click", () => setInfo(!infoOpen));

  // click oriunde în afara conținutului deschis închide secțiunea (și nota despre surse)
  document.addEventListener("click", (e) => {
    if(!open && !infoOpen) return;
    if(e.target.closest("#history-info-btn")) return;
    if(!e.target.closest("#tab-acasa")) return; // bara de jos, alte file etc. nu închid secțiunea
    if(infoOpen) setInfo(false); // panoul de surse se închide la orice click
    if(!open) return;
    if(e.target.closest(".history-tab")) return; // butoanele de secțiune își fac singure treaba
    // butoanele și legăturile din panou (Citește mai mult, Vezi toate, ♡, Reîncearcă) merg normal
    if(e.target.closest("#history-card") && e.target.closest("button, a, input, textarea, select, label")) return;
    // în calendar, atingerea zilelor nu închide secțiunea
    if(open === "calendar" && e.target.closest("#history-sec-calendar")) return;
    setOpen(null); // oriunde altundeva (și pe text), secțiunea se închide; la derulare nu se declanșează niciun click
  });

  // la revenirea în Acasă sau în aplicație, „Evenimente” e din nou deschis, ca textul să se poată citi direct
  window.historyShowDefault = function(){ setOpen("events"); setInfo(false); };
  checkDay();
  setInterval(checkDay, 30000);
  document.addEventListener("visibilitychange", () => {
    if(document.visibilityState !== "visible") return;
    checkDay();
    window.historyShowDefault();
  });
})();


// =====================================================================
// PERICOPA SĂPTĂMÂNII + SĂRBĂTORI — calendarul evreiesc LIVE, calculat
// direct în browser cu biblioteca oficială @hebcal/core (nu prin REST API
// — REST API-ul hebcal.com nu trimite header-ele CORS necesare pentru
// fetch() direct din browser, testat și confirmat cu eroare reală).
// Implementarea efectivă e într-un <script type="module"> la finalul
// paginii; aici rămân doar traducerile și funcțiile ajutătoare.
// =====================================================================
const monthNamesRo = ["ianuarie","februarie","martie","aprilie","mai","iunie","iulie","august","septembrie","octombrie","noiembrie","decembrie"];
const dayNamesRo = ["duminică","luni","marți","miercuri","joi","vineri","sâmbătă"];

function formatDateRo(dateStr){
  const d = new Date(dateStr + "T00:00:00");
  return dayNamesRo[d.getDay()] + ", " + d.getDate() + " " + monthNamesRo[d.getMonth()] + " " + d.getFullYear();
}

// Traducere referințe biblice engleză → română (cărțile Torei + cărți frecvente în haftarot)
const BOOK_NAME_RO = {
  "Genesis":"Geneza", "Exodus":"Exodul", "Leviticus":"Leviticul", "Numbers":"Numeri", "Deuteronomy":"Deuteronom",
  "Joshua":"Iosua", "Judges":"Judecătorii", "I Samuel":"1 Samuel", "II Samuel":"2 Samuel",
  "I Kings":"1 Împărați", "II Kings":"2 Împărați", "Isaiah":"Isaia", "Jeremiah":"Ieremia", "Ezekiel":"Ezechiel",
  "Hosea":"Osea", "Joel":"Ioel", "Amos":"Amos", "Obadiah":"Obadia", "Jonah":"Iona", "Micah":"Mica",
  "Nahum":"Naum", "Habakkuk":"Habacuc", "Zephaniah":"Țefania", "Haggai":"Hagai", "Zechariah":"Zaharia", "Malachi":"Maleahi",
  "Ecclesiastes":"Eclesiastul", "Song of Songs":"Cântarea Cântărilor", "Ruth":"Rut", "Lamentations":"Plângerile",
  "Esther":"Estera", "Psalms":"Psalmii"
};

// Numele pericopelor (cum le dă @hebcal) → [transliterare românească, traducerea titlului]
const PARASHA_RO = {"Bereshit":["Bereșit","La început"],"Noach":["Noah","Noe"],"Lech-Lecha":["Leh Leha","Du-te"],"Vayera":["Vaiera","Și S-a arătat"],"Chayei Sara":["Haiei Sara","Viața Sarei"],"Toldot":["Toldot","Generații"],"Vayetzei":["Vaiețe","Și a ieșit"],"Vayishlach":["Vaișlah","Și a trimis"],"Vayeshev":["Vaieșev","Și a locuit"],"Miketz":["Mikeț","La capătul"],"Vayigash":["Vaigaș","Și s-a apropiat"],"Vayechi":["Vaiehi","Și a trăit"],"Shemot":["Șemot","Numele"],"Vaera":["Vaera","Și M-am arătat"],"Bo":["Bo","Intră"],"Beshalach":["Beșalah","Când a dat drumul"],"Yitro":["Itro","Ietro"],"Mishpatim":["Mișpatim","Judecăți"],"Terumah":["Teruma","Prinos"],"Tetzaveh":["Tețave","Să poruncești"],"Ki Tisa":["Ki Tisa","Când vei număra"],"Vayakhel":["Vaiakhel","Și a adunat"],"Pekudei":["Pekudei","Socotelile"],"Vayikra":["Vaikra","Și a chemat"],"Tzav":["Țav","Poruncește"],"Shmini":["Șemini","A opta"],"Tazria":["Tazria","Va zămisli"],"Metzora":["Mețora","Lepra"],"Achrei Mot":["Aharei Mot","După moarte"],"Kedoshim":["Kedoșim","Sfinți"],"Emor":["Emor","Spune"],"Behar":["Behar","Pe munte"],"Bechukotai":["Behukotai","În decretele Mele"],"Bamidbar":["Bamidbar","În deșert"],"Nasso":["Naso","Ridică"],"Beha'alotcha":["Behaalotha","Când vei aprinde"],"Sh'lach":["Șelah","Trimite"],"Korach":["Korah","Korah"],"Chukat":["Hukat","Decretul"],"Balak":["Balak","Balak"],"Pinchas":["Pinhas","Pinhas"],"Matot":["Matot","Semințiile"],"Masei":["Masei","Călătoriile"],"Devarim":["Devarim","Cuvintele"],"Vaetchanan":["Vaethanan","Și m-am rugat"],"Eikev":["Ekev","Pentru că"],"Re'eh":["Ree","Vezi"],"Shoftim":["Șoftim","Judecători"],"Ki Teitzei":["Ki Tețe","Când vei ieși"],"Ki Tavo":["Ki Tavo","Când vei intra"],"Nitzavim":["Nițavim","Stați"],"Vayeilech":["Vaieleh","Și a mers"],"Ha'azinu":["Haazinu","Ascultă"],"Vezot Haberakhah":["Vezot Haberaha","Și aceasta este binecuvântarea"]};
// parshaList = lista de nume englezești (una sau două, la pericopele unite)
function translateParasha(parshaList){
  const parts = parshaList.map(n => PARASHA_RO[n] || [n, ""]);
  return {
    name: "Parașat " + parts.map(p => p[0]).join("-"),
    meaning: parts.map(p => p[1]).filter(Boolean).join(" / ")
  };
}
// Citirile de Șabat care cad de sărbătoare (ex. „Sukkot I (on Shabbat)”)
const LEYNING_HOLIDAY_RO = [
  ["Simchat Torah", "Simhat Tora", "Bucuria Torei"],
  ["Shmini Atzeret", "Șemini Ațeret", "A opta zi de adunare"],
  ["Rosh Hashana", "Roș Hașana", "Capul anului"],
  ["Yom Kippur", "Yom Kipur", "Ziua Ispășirii"],
  ["Sukkot", "Sucot", "Corturile"],
  ["Pesach", "Pesah", "Trecerea"],
  ["Shavuot", "Șavuot", "Săptămânile"],
];
const ROMAN_NUM = { "I":1, "II":2, "III":3, "IV":4, "V":5, "VI":6, "VII":7, "VIII":8 };
function translateLeyningHoliday(en){
  const clean = en.replace(/\s*\(on Shabbat\)/, "").trim();
  for(const [key, ro, meaning] of LEYNING_HOLIDAY_RO){
    if(clean.indexOf(key) < 0) continue;
    if(/Shabbat Chol ha-Moed/.test(clean)){
      return { name: "Șabat Hol Hamoed " + ro, meaning: "Șabatul din zilele de mijloc ale sărbătorii · " + meaning };
    }
    const m = clean.match(/\b(I{1,3}|IV|V|VI{0,3})$/);
    return { name: ro + (m ? ", ziua " + ROMAN_NUM[m[1]] : ""), meaning: meaning };
  }
  return { name: clean, meaning: "" };
}
function translateRef(ref){
  if(!ref) return ref;
  let out = ref;
  // sortez dupa lungime descrescatoare, ca "I Samuel" sa se verifice inaintea
  // lui "Samuel" (evita inlocuiri partiale gresite)
  const sortedEntries = Object.entries(BOOK_NAME_RO).sort((a,b) => b[0].length - a[0].length);
  for(const [en, ro] of sortedEntries){
    out = out.split(en).join(ro);
  }
  return out;
}

const HOLIDAY_NAME_RO = {
  "Rosh Hashana": "Roș Hașana (Anul Nou evreiesc)",
  "Erev Rosh Hashana": "Ajunul Roș Hașana",
  "Tzom Gedaliah": "Postul lui Ghedalia",
  "Yom Kippur": "Yom Kipur (Ziua Ispășirii)",
  "Erev Yom Kippur": "Ajunul Yom Kipur",
  "Sukkot": "Sucot (Sărbătoarea Corturilor)",
  "Erev Sukkot": "Ajunul Sucot",
  "Shmini Atzeret": "Șemini Ațeret",
  "Simchat Torah": "Simhat Tora",
  "Chanukah": "Hanuca",
  "Chanukah: 1 Candle": "Hanuca — prima lumânare",
  "Tu BiShvat": "Tu BiȘvat",
  "Purim": "Purim",
  "Erev Purim": "Ajunul Purim",
  "Shushan Purim": "Șușan Purim",
  "Pesach": "Pesah (Paștele evreiesc)",
  "Erev Pesach": "Ajunul Pesah",
  "Pesach Sheni": "Pesah Șeni",
  "Yom HaShoah": "Ziua Amintirii Holocaustului",
  "Yom HaZikaron": "Ziua Comemorării (Israel)",
  "Yom HaAtzmaut": "Ziua Independenței Israelului",
  "Lag BaOmer": "Lag BaOmer",
  "Yom Yerushalayim": "Ziua Ierusalimului",
  "Shavuot": "Șavuot",
  "Erev Shavuot": "Ajunul Șavuot",
  "Tzom Tammuz": "Postul lui Tamuz",
  "Tisha B'Av": "Tișa BeAv",
  "Erev Tisha B'Av": "Ajunul Tișa BeAv",
  "Rosh Chodesh": "Roș Hodeș (lună nouă)",
};
function translateHoliday(title){
  if(HOLIDAY_NAME_RO[title]) return HOLIDAY_NAME_RO[title];
  for(const [en, ro] of Object.entries(HOLIDAY_NAME_RO)){
    if(title.startsWith(en)) return ro + title.slice(en.length);
  }
  return title; // fallback: numele original, dacă nu-l avem mapat
}

let parashotEssaysData = null;
function fetchParashotEssays(){
  return new Promise((resolve) => {
    const existing = document.getElementById("parashot-essays-script");
    if(existing) existing.remove();
    const script = document.createElement("script");
    script.id = "parashot-essays-script";
    script.onload = () => {
      const d = window.PARASHOT_ESSAYS_DATA;
      if(d && d.parashot){ parashotEssaysData = d.parashot; }
      resolve(d);
    };
    script.onerror = () => { console.error("DAVAR: nu am putut încărca parashot-essays.js"); resolve(null); };
    script.src = "parashot-essays.js";
    document.body.appendChild(script);
  });
}

function slugToEssayName(slug){
  // ex: "ki-teitzei" -> "Ki-Teitzei" (formatul din baza noastră de eseuri)
  return slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join("-");
}

function renderEssaysForParasha(nameSlug){
  const container = document.getElementById("essays-links-container");
  const cardLabel = document.getElementById("essays-card-label");
  if(!container) return;
  container.innerHTML = "";
  if(!parashotEssaysData){ if(cardLabel) cardLabel.textContent = "Meditații cerești"; return; }
  const targetName = slugToEssayName(nameSlug);
  const entry = parashotEssaysData.find(p => p.name.toLowerCase() === targetName.toLowerCase());
  if(!entry){ if(cardLabel) cardLabel.textContent = "Meditații cerești"; return; }
  if(cardLabel) cardLabel.textContent = "Meditații cerești · " + entry.name;
  if(!entry.verified){
    // Nu afișăm link-uri nesigure ca și cum ar fi corecte — pentru multe
    // porții din baza de date, link-urile inițiale s-au dovedit generice
    // sau irelevante la verificare (ex. Ki Teitzei). Până nu verificăm
    // manual fiecare din cele 54, arătăm asta deschis, nu ascundem problema.
    return;
  }
  let lastTradition = null;
  entry.essays.forEach(essay => {
    if(essay.tradition !== lastTradition){
      const label = document.createElement("div");
      label.className = "meditation-section-label";
      label.textContent = essay.tradition === "Jewish" ? "Perspectivă evreiască" : "Perspectivă creștină";
      container.appendChild(label);
      lastTradition = essay.tradition;
    }
    const a = document.createElement("a");
    a.className = "meditation-link";
    a.href = essay.url;
    a.target = "_blank";
    a.rel = "noopener";
    a.innerHTML = '<div><div class="meditation-title">' + essay.title + '</div><div class="meditation-author">' + essay.author + ' →</div></div>';
    container.appendChild(a);
  });
}

// Butonul "Citește pasajul →" de la Pericopa săptămânii — parsează numele
// cărții + primul capitol din textul de referință (ex. "Deuteronom 32:1–52")
// și duce direct la Biblia, la capitolul corect.
function findBookBySlugName(refText){
  if(!refText) return null;
  const lower = refText.toLowerCase().trim();
  // Excepție: pentru citarea unui psalm anume se folosește convențional
  // forma la singular "Psalmul N" (nu numele cărții "Psalmii"), care nu
  // se potrivește cu regula generică de mai jos (nu se termină în "ul").
  if(lower.startsWith("psalmul")) return BOOKS.find(b => b.slug === "psalms") || null;
  // Întâi cartea cu care începe trimiterea, cea cu numele cel mai lung
  // („1 Ioan 4:10” e 1 Ioan, nu Evanghelia după Ioan).
  const starts = BOOKS.filter(b => {
    const full = b.name.toLowerCase();
    return lower.startsWith(full) || lower.startsWith(full.replace(/ul$/, ""));
  });
  if(starts.length) return starts.reduce((a, b) => b.name.length > a.name.length ? b : a);
  return BOOKS.find(b => {
    const full = b.name.toLowerCase();
    const core = full.replace(/ul$/, ""); // "Deuteronomul" -> "deuteronom", ca sa prinda si "Deuteronom"
    return lower.startsWith(full) || lower.startsWith(core) || lower.indexOf(" " + full) >= 0 || lower.indexOf(" " + core) >= 0;
  }) || null;
}
function buildPericopeRefRow(refText){
  const row = document.createElement("div");
  row.className = "pericope-ref-row";
  const span = document.createElement("span");
  span.textContent = refText;
  row.appendChild(span);
  const book = findBookBySlugName(refText);
  const cv = refText.match(/(\d+):(\d+)/);
  const available = !!(book && cv && chapterIsAvailable(book.slug, parseInt(cv[1], 10)));
  // Săgeata apare mereu, la fel ca la Haftarah — dacă pasajul nu-i încă
  // digitizat, panoul standard se arată oricum, onest, gol, fără buton
  // "→ citește capitolul" (nu există încă acea destinație).
  const btn = document.createElement("button");
  btn.className = "pericope-ref-go ref-pill-clickable";
  btn.title = available ? "Vezi pasajul" : "Vezi referința";
  btn.textContent = "→";
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    if(available){
      const chapterNum = parseInt(cv[1], 10);
      const verseNum = parseInt(cv[2], 10);
      // Panoul arată doar primele 2 versete ale pasajului; „citește capitolul” duce la tot capitolul.
      showRefPreview(book.name + " " + chapterNum + ":" + verseNum + "-" + (verseNum + 1), btn, true);
      document.getElementById("ref-preview-title").textContent = refText;
    } else {
      showRefUnavailable(btn, refText, true);
    }
  });
  row.appendChild(btn);
  return row;
}
// Titlu ebraic + traducerea lui în română, pe același rând: „Parașat Bereșit – „La început””
function setHebrewTitleWithMeaning(el, name, meaning){
  el.textContent = "";
  el.appendChild(document.createTextNode(name));
  if(meaning){
    const m = document.createElement("span");
    m.className = "pericope-title-meaning";
    m.textContent = " – „" + meaning + "”";
    el.appendChild(m);
  }
}
// Rândul unei referințe de Haftarah — un singur rând simplu, "Nume (semnificație)
// - referință", nu un preview de text brut; duce mai departe la cititorul de
// Haftarot din tab-ul Biblia (nu în Bibliotecă).
function buildHaftarahRefRow(refText, nameLabel){
  const row = document.createElement("div");
  row.className = "pericope-ref-row";
  const span = document.createElement("span");
  span.textContent = refText;
  row.appendChild(span);
  const match = (typeof findHaftarahByRef === "function") ? findHaftarahByRef(refText) : null;
  // Săgeata apare mereu, ca la orice altă referință — dacă Haftara nu-i încă
  // în cele 57 obișnuite (sărbători/ocazii speciale), panoul se arată oricum,
  // onest, doar fără buton de navigare spre un capitol care nu există.
  const btn = document.createElement("button");
  btn.className = "pericope-ref-go ref-pill-clickable";
  btn.title = "Vezi Haftara";
  btn.textContent = "→";
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    showHaftarahPreview(match || { title: nameLabel || "Haftarah", ref: refText }, btn);
  });
  row.appendChild(btn);
  return row;
}
function renderPericopeRefs(torahRo, haftarahRo, titleInfo){
  const list = document.getElementById("pericope-refs-list");
  if(!list) return;
  list.innerHTML = "";
  if(torahRo){
    torahRo.split(";").map(s => s.trim()).filter(Boolean).forEach(part => {
      list.appendChild(buildPericopeRefRow(part));
    });
  }
  if(haftarahRo){
    const introLabel = document.createElement("div");
    introLabel.className = "home-card-label pericope-haftarah-intro-label";
    introLabel.textContent = "Pasaj din Profeți (haftara)";
    list.appendChild(introLabel);
    // Numele Haftarei urmează numele pericopei — EXACT același stil (și, când
    // e aceeași săptămână, exact același text) ca titlul principal de mai sus
    // ("Simhat Tora – „Bucuria Torei”"), nu un format inventat separat.
    const haftarahName = (titleInfo && titleInfo.name) ? titleInfo.name.replace(/^Parașat\s+/, "") : "";
    const nameEl = document.createElement("div");
    nameEl.className = "pericope-section-label";
    setHebrewTitleWithMeaning(nameEl, haftarahName, titleInfo ? titleInfo.meaning : "");
    list.appendChild(nameEl);
    haftarahRo.split(";").map(s => s.trim()).filter(Boolean).forEach(part => {
      list.appendChild(buildHaftarahRefRow(part, haftarahName));
    });
  }
}

function loadPericopeLive(){
  // Implementarea reală (calculul propriu-zis, fără nicio cerere de rețea
  // către hebcal.com — evită complet problema CORS întâlnită cu REST API-ul)
  // se află într-un <script type="module"> separat, la finalul paginii,
  // care folosește biblioteca oficială @hebcal/core direct în browser.
  fetchParashotEssays();
}

function loadUpcomingHolidays(){
  // Idem — calculat direct în browser, în modulul de la finalul paginii.
}

loadPericopeLive();
loadUpcomingHolidays();
wireToggle("essays-toggle", "essays-body", "Detalii ▾", "Ascunde ▴");

// Închidere automată când apeși oriunde în afara secțiunii deschise
document.addEventListener("click", (e) => {
  homeSections.forEach(sec => {
    const insideAny = sec.els.some(el => el.contains(e.target));
    if(!insideAny) sec.close();
  });
});

// Radio — un singur element audio + un embed iframe pentru posturile fără flux brut
const radioAudio = document.getElementById("radio-audio");
const radioPlayBtn = document.getElementById("radio-play-btn");
const radioPlayIcon = document.getElementById("radio-play-icon");
const radioPauseIcon = document.getElementById("radio-pause-icon");
const radioStatus = document.getElementById("radio-status");
const radioMiniCard = document.getElementById("radio-mini-card");
const radioMiniName = document.getElementById("radio-mini-name");
const radioMiniClose = document.getElementById("radio-mini-close");
const radioNowPlaying = document.getElementById("radio-now-playing");
const radioNowName = document.getElementById("radio-now-name");
const radioStopBtn = document.getElementById("radio-stop-btn");
const radioEmbedBox = document.getElementById("radio-embed-box");
const radioNowPauseBtn = document.getElementById("radio-now-pause-btn");
const radioNowPlayIcon = document.getElementById("radio-now-play-icon");
const radioNowPauseIcon = document.getElementById("radio-now-pause-icon");
const radioNowStatus = document.getElementById("radio-now-status");
function setRadioStatus(text){ radioStatus.textContent = text; radioNowStatus.textContent = text; }
let radioPlaying = false;
let radioIsEmbed = false;
let currentStreamUrl = null;

const AUDIO_ERROR_MESSAGES = {
  1: "conexiune întreruptă (MEDIA_ERR_ABORTED)",
  3: "fluxul nu poate fi decodat de acest browser (MEDIA_ERR_DECODE)"
};
const RADIO_UNAVAILABLE_MSG = "Postul nu este disponibil momentan. Încearcă mai târziu sau alege alt post.";
radioAudio.addEventListener("error", () => {
  const code = radioAudio.error ? radioAudio.error.code : null;
  if(code === 2 || code === 4){ setRadioStatus(RADIO_UNAVAILABLE_MSG); return; }
  const msg = AUDIO_ERROR_MESSAGES[code] || "eroare necunoscută la redare";
  setRadioStatus("eroare: " + msg);
});

function showRadioUI(name){
  radioMiniName.textContent = name;
  radioMiniCard.style.display = "flex";
  radioNowName.textContent = name;
  radioNowPlaying.style.display = "flex";
  document.querySelectorAll(".radio-station").forEach(el => {
    el.classList.toggle("playing", el.querySelector(".radio-station-name").textContent === name);
  });
}

function setMiniPlayPauseVisible(visible){
  radioPlayBtn.style.display = visible ? "flex" : "none";
  radioNowPauseBtn.style.display = visible ? "flex" : "none";
}

function updatePlayPauseIcons(isPlaying){
  radioPlayIcon.style.display = isPlaying ? "none" : "";
  radioPauseIcon.style.display = isPlaying ? "" : "none";
  radioNowPlayIcon.style.display = isPlaying ? "none" : "";
  radioNowPauseIcon.style.display = isPlaying ? "" : "none";
  updateStationButtons();
}

function updateStationButtons(){
  document.querySelectorAll(".radio-station[data-stream]").forEach(el => {
    const btn = el.querySelector(".radio-station-playbtn");
    if(!btn) return;
    const isActive = el.dataset.stream === currentStreamUrl && !radioIsEmbed;
    const isPlaying = isActive && !radioAudio.paused;
    const playIcon = btn.querySelector(".rsp-play");
    const pauseIcon = btn.querySelector(".rsp-pause");
    if(playIcon) playIcon.style.display = isPlaying ? "none" : "";
    if(pauseIcon) pauseIcon.style.display = isPlaying ? "" : "none";
  });
}

function togglePlayPause(){
  if(radioIsEmbed) return;
  if(radioAudio.paused){
    radioAudio.play();
    updatePlayPauseIcons(true);
    setRadioStatus("live acum");
  } else {
    radioAudio.pause();
    updatePlayPauseIcons(false);
    setRadioStatus("pauză");
  }
}

function playStream(url, name){
  radioEmbedBox.style.display = "none";
  radioEmbedBox.innerHTML = "";
  radioIsEmbed = false;
  currentStreamUrl = url;
  setMiniPlayPauseVisible(true);
  radioAudio.src = url;
  setRadioStatus("se conectează…");
  showRadioUI(name);
  updateStationButtons();
  const playPromise = radioAudio.play();
  if(playPromise && playPromise.then){
    playPromise.then(() => {
      radioPlaying = true;
      updatePlayPauseIcons(true);
      setRadioStatus("live acum");
    }).catch(err => {
      if(err && err.name === "NotSupportedError"){
        setRadioStatus(RADIO_UNAVAILABLE_MSG);
        updateStationButtons();
        return;
      }
      setRadioStatus("nu a pornit automat — apasă din nou pe ▶ (" + (err && err.name ? err.name : "eroare browser") + ")");
      updateStationButtons();
    });
  }
}

function playEmbed(embedUrl, name){
  radioAudio.pause();
  radioIsEmbed = true;
  radioPlaying = true;
  currentStreamUrl = null;
  setMiniPlayPauseVisible(false);
  radioEmbedBox.innerHTML = '<iframe src="' + embedUrl + '"></iframe>';
  radioEmbedBox.style.display = "block";
  setRadioStatus("live acum");
  showRadioUI(name);
  updateStationButtons();
}

function stopStream(){
  radioAudio.pause();
  radioAudio.removeAttribute("src");
  radioAudio.load();
  radioEmbedBox.style.display = "none";
  radioEmbedBox.innerHTML = "";
  radioPlaying = false;
  radioIsEmbed = false;
  currentStreamUrl = null;
  setMiniPlayPauseVisible(true);
  updatePlayPauseIcons(false);
  radioMiniCard.style.display = "none";
  radioNowPlaying.style.display = "none";
  document.querySelectorAll(".radio-station").forEach(el => el.classList.remove("playing"));
}

radioPlayBtn.addEventListener("click", togglePlayPause);
radioNowPauseBtn.addEventListener("click", togglePlayPause);

radioMiniClose.addEventListener("click", stopStream);
radioStopBtn.addEventListener("click", stopStream);

document.querySelectorAll(".radio-station[data-stream]").forEach(el => {
  const btn = document.createElement("button");
  btn.className = "radio-station-playbtn";
  btn.title = "Redă / pauză";
  btn.innerHTML =
    '<svg class="rsp-play" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>' +
    '<svg class="rsp-pause" viewBox="0 0 24 24" fill="currentColor" style="display:none;"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>';
  el.appendChild(btn);

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const url = el.dataset.stream;
    const name = el.querySelector(".radio-station-name").textContent;
    if(url === currentStreamUrl && !radioIsEmbed){
      togglePlayPause();
    } else {
      playStream(url, name);
    }
  });

  el.addEventListener("click", () => {
    const url = el.dataset.stream;
    const name = el.querySelector(".radio-station-name").textContent;
    playStream(url, name);
  });
});
document.querySelectorAll(".radio-station[data-embed]").forEach(el => {
  el.addEventListener("click", () => {
    const url = el.dataset.embed;
    const name = el.querySelector(".radio-station-name").textContent;
    playEmbed(url, name);
  });
});

// Căutare — fără diacritice (masa = masă), în capitolul deschis din Biblie și în tot ce e încărcat din Bibliotecă
const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");

function escapeHtml(s){
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// text fără diacritice și cu litere mici: ă→a, â→a, î→i, ș/ş→s, ț/ţ→t, ḥ→h etc.
function srStrip(s){
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}
// la fel, dar păstrează pentru fiecare caracter normalizat poziția din textul original (pentru evidențiere)
function srNormMap(str){
  let n = "";
  const map = [];
  for(let i = 0; i < str.length; i++){
    const p = srStrip(str[i]);
    for(let k = 0; k < p.length; k++){ n += p[k]; map.push(i); }
  }
  map.push(str.length);
  return { n, map };
}
const SR_WORD = /[\p{L}\p{M}\p{N}]/u;
// intervalele [start,end) din textul original care se potrivesc cu oricare cuvânt căutat
function srRanges(str, toks){
  const { n, map } = srNormMap(str);
  const out = [];
  toks.forEach(t => {
    let from = 0, idx;
    while((idx = n.indexOf(t, from)) !== -1){
      from = idx + 1;
      if(idx > 0 && SR_WORD.test(n[idx - 1])) continue; // doar la început de cuvânt (masa nu prinde „cămașa”)
      out.push([map[idx], map[idx + t.length - 1] + 1]);
      from = idx + t.length;
    }
  });
  out.sort((a, b) => a[0] - b[0]);
  const merged = [];
  out.forEach(r => {
    const last = merged[merged.length - 1];
    if(last && r[0] <= last[1]) last[1] = Math.max(last[1], r[1]);
    else merged.push(r.slice());
  });
  return merged;
}
function srWordAround(str, s, e){
  while(s > 0 && SR_WORD.test(str[s - 1])) s--;
  while(e < str.length && SR_WORD.test(str[e])) e++;
  return str.slice(s, e);
}
function srSnippet(plain, toks){
  const ranges = srRanges(plain, toks);
  if(!ranges.length) return escapeHtml(plain.slice(0, 160)) + (plain.length > 160 ? "…" : "");
  const start = Math.max(0, ranges[0][0] - 50);
  const end = Math.min(plain.length, ranges[0][1] + 100);
  let html = "", pos = start;
  ranges.forEach(r => {
    if(r[1] <= start || r[0] >= end) return;
    const a = Math.max(r[0], start), b = Math.min(r[1], end);
    html += escapeHtml(plain.slice(pos, a)) + "<mark>" + escapeHtml(plain.slice(a, b)) + "</mark>";
    pos = b;
  });
  html += escapeHtml(plain.slice(pos, end));
  return (start > 0 ? "…" : "") + html + (end < plain.length ? "…" : "");
}
// evidențiază potrivirile în toate nodurile de text dintr-un element (păstrează legăturile și formatarea)
function srMarkIn(root, toks){
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while(walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(node => {
    const txt = node.nodeValue;
    const ranges = srRanges(txt, toks);
    if(!ranges.length) return;
    const frag = document.createDocumentFragment();
    let pos = 0;
    ranges.forEach(r => {
      if(r[0] > pos) frag.appendChild(document.createTextNode(txt.slice(pos, r[0])));
      const m = document.createElement("mark");
      m.textContent = txt.slice(r[0], r[1]);
      frag.appendChild(m);
      pos = r[1];
    });
    if(pos < txt.length) frag.appendChild(document.createTextNode(txt.slice(pos)));
    node.parentNode.replaceChild(frag, node);
  });
}

// text curat + forma normalizată, păstrate pe fiecare verset/comentariu ca să nu se recalculeze la fiecare literă
const srCache = new WeakMap();
function srPlain(raw){
  if(raw.indexOf("<") === -1) return raw.trim();
  const tpl = document.createElement("template");
  tpl.innerHTML = raw;
  tpl.content.querySelectorAll(".footnote, .footnote-marker").forEach(n => n.remove()); // notele de subsol nu fac parte din verset
  return tpl.content.textContent.replace(/\s+/g, " ").trim();
}
function srInfo(obj, rawHtml){
  let info = srCache.get(obj);
  if(!info){
    const plain = srPlain(rawHtml);
    info = { plain, n: srStrip(plain) };
    srCache.set(obj, info);
  }
  return info;
}
function srStringInfo(key, text){
  let info = srStringCache.get(key);
  if(!info){ info = { plain: text, n: srStrip(text) }; srStringCache.set(key, info); }
  return info;
}
const srStringCache = new Map();

// cărțile Noului Testament (pentru împărțirea VT / NT din secțiunea Biblia)
const SR_NT = /^(?:Matei|Marcu|Luca|Ioan|Faptele|Romani|[12]\s*Corinteni|Galateni|Efeseni|Filipeni|Coloseni|[12]\s*Tesaloniceni|[12]\s*Timotei|Tit|Filimon|Evrei|Iacov|[12]\s*Petru|[123]\s*Ioan|Iuda|Apocalipsa)\b/i;
function srTestament(bookName){ return SR_NT.test(bookName) ? "NT" : "VT"; }

function srShortTitle(ch){
  const t = (ch.title || "").trim();
  if(t && t.length <= 36) return t;
  return "";
}

// încarcă o singură dată indexul mic de text pentru Haftarot (în loc de fișierele mari cu lexicon)
let srHaftarotState = "idle"; // idle | loading | ready | failed
function srLoadHaftarot(){
  if(srHaftarotState !== "idle") return;
  srHaftarotState = "loading";
  const s = document.createElement("script");
  s.src = "search-haftarot.js?v=1";
  s.onload = () => { srHaftarotState = "ready"; if(searchInput.value.trim().length >= 2) runSearch(); };
  s.onerror = () => { srHaftarotState = "failed"; };
  document.head.appendChild(s);
}

// sec: "bible" = Biblia (doar textul Torei și al Haftarot), "lib" = Comentarii-Texte (restul arhivei din Diverse)
function srCollectHits(toks, includeLocalLib){
  const hits = [];
  const match = info => toks.every(t => {
    let idx = info.n.indexOf(t);
    while(idx !== -1){
      if(idx === 0 || !SR_WORD.test(info.n[idx - 1])) return true;
      idx = info.n.indexOf(t, idx + 1);
    }
    return false;
  });

  // 1. comentariile atașate versetelor din capitolul deschis în tab-ul Biblia (Rashi, Ramban, Josephus…)
  if(Array.isArray(VERSES) && VERSES.length){
    const book = getBook(currentBookSlug);
    VERSES.forEach(verse => {
      const baseRef = book.name + " " + currentChapter + ":" + verse.num;
      const baseKey = currentBookSlug + "_" + currentChapter + "_" + verse.num;
      (verse.commentaries || []).forEach((c, ci) => {
        const info = srInfo(c, c.text || "");
        if(match(info)){
          hits.push({
            sec: "lib", group: "Comentarii din Biblie",
            title: c.author + " - " + baseRef, plain: info.plain, html: c.text, key: baseKey + "_c" + ci,
            open: { type: "bible", num: verse.num }
          });
        }
      });
    });
  }

  // 2. Biblioteca: Tora (Rosen) → Biblia; restul → Comentarii-Texte, grupat pe lucrare/colecție
  if(typeof window.libSearchWorks === "function"){
    window.libSearchWorks().forEach(({ book, group }) => {
      if(/^haftarot-/.test(book.slug)) return; // Haftarot se caută în indexul lor mic, mai jos
      const isTora = /^tora-rosen-/.test(book.slug);
      if(!isTora && !includeLocalLib) return; // restul arhivei se caută pe server (include capitolele neîncărcate)
      const work = (book.name_ro || book.name || "").replace(/\s*\([^)]*\)\s*$/g, "").replace(/\s*\([^)]*\)\s*$/g, "").trim();
      (book.chapters || []).forEach((ch, chIdx) => {
        if(!Array.isArray(ch.verses) || !ch.verses.length) return;
        const chTitle = srShortTitle(ch);
        ch.verses.forEach(v => {
          if(typeof v.t !== "string") return;
          const info = srInfo(v, v.t);
          if(!match(info)) return;
          const key = "lib_" + book.slug + "_" + ch.num + "_" + v.v;
          if(isTora){
            hits.push({
              sec: "bible", testament: srTestament(work), book: work,
              title: work + " " + ch.num + ":" + v.v, plain: info.plain, html: null, key,
              open: { type: "lib", slug: book.slug, chIdx, v: String(v.v) }
            });
            return;
          }
          const tt = (ch.title || "").trim();
          const structured = /^(josephus-(antichitati|razboiul)|eusebiu-istoria)/.test(book.slug) && tt.indexOf(" — ") > 0 ? tt.slice(0, tt.indexOf(" — ")).replace(/^Cartea\s+/, "") : "";
          const loc = structured ? structured + ":" + v.v : (chTitle ? chTitle + " " : "cap. " + (typeof window.libChNum === "function" ? window.libChNum(ch, chIdx) : ch.num) + ":") + v.v;
          let anchor = "";
          const pre = v.t.match(/^\(([^)]{3,40}\d+:\d+[^)]*)\)/);
          if(pre) anchor = pre[1];
          else if(ch.ref && /[A-Za-zĂÂÎȘȚăâîșț]/.test(ch.ref) && /\d/.test(ch.ref)) anchor = ch.ref;
          hits.push({
            sec: "lib", group: group || work,
            title: work + ", " + loc + (anchor ? " - " + anchor : ""),
            plain: info.plain, html: null, key,
            open: { type: "lib", slug: book.slug, chIdx, v: String(v.v) }
          });
        });
      });
    });
  }

  // 3. Haftarot (text Rosen) → Biblia, din indexul mic de text
  if(window.SEARCH_HAFTAROT){
    Object.keys(window.SEARCH_HAFTAROT).forEach(slug => {
      window.SEARCH_HAFTAROT[slug].forEach(([chIdx, chNum, chTitle, verses]) => {
        verses.forEach(([ref, text, vkey], vi) => {
          const info = srStringInfo(slug + "|" + chIdx + "|" + vi, text);
          if(!match(info)) return;
          const bookName = ref.replace(/\s*[\d]+:[\d]+.*$/, "").trim();
          hits.push({
            sec: "bible", testament: srTestament(bookName), book: bookName,
            title: ref + " - Haftarah " + chTitle, plain: info.plain, html: null,
            key: "lib_" + slug + "_" + chNum + "_" + vkey,
            open: { type: "lib", slug, chIdx, v: String(vkey) }
          });
        });
      });
    });
  } else {
    srLoadHaftarot();
  }
  return hits;
}

function srCopyText(hit){
  return "„" + hit.plain + "” — " + hit.title;
}
function srFlash(text){ if(typeof showVsToast === "function") showVsToast(text); }

const SR_ICON_COPY = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/></svg>';
const SR_ICON_SHARE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="18" cy="5" r="2.7"/><circle cx="6" cy="12" r="2.7"/><circle cx="18" cy="19" r="2.7"/><path d="M8.4 10.7 15.6 6.6M8.4 13.3l7.2 4.1"/></svg>';
const SR_ICON_MARK = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 3a1 1 0 0 0-1 1v17l7-4 7 4V4a1 1 0 0 0-1-1z"/></svg>';
const SR_ICON_NOTE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 4h13l3 3v13H4z"/><path d="M8 9h9M8 13h9M8 17h5"/></svg>';

function srBuildCard(hit, toks){
  const card = document.createElement("div");
  card.className = "search-result";
  const head = document.createElement("div");
  head.className = "search-result-head";
  head.innerHTML = '<div class="search-result-ref">' + escapeHtml(hit.title) + '</div><span class="search-result-chev">›</span>';
  const snippet = document.createElement("div");
  snippet.className = "search-result-snippet";
  snippet.innerHTML = srSnippet(hit.plain, toks);
  card.appendChild(head);
  card.appendChild(snippet);

  const full = document.createElement("div");
  full.className = "search-result-full";
  card.appendChild(full);

  let built = false;
  const markKey = "mark_" + hit.key, noteKey = "note_" + hit.key;
  if(typeof applyMarkByKey === "function") applyMarkByKey(card, markKey);

  function build(){
    built = true;
    const body = document.createElement("div");
    body.className = "search-result-body";
    if(hit.html) body.innerHTML = hit.html;
    else body.textContent = hit.plain;
    srMarkIn(body, toks);
    full.appendChild(body);

    const actions = document.createElement("div");
    actions.className = "sr-actions";
    actions.innerHTML =
      '<button class="sr-act" data-a="copy">' + SR_ICON_COPY + 'Copiază</button>' +
      '<button class="sr-act" data-a="share">' + SR_ICON_SHARE + 'Trimite</button>' +
      '<button class="sr-act" data-a="mark">' + SR_ICON_MARK + 'Marchează</button>' +
      '<button class="sr-act" data-a="note">' + SR_ICON_NOTE + 'Notiță</button>';
    full.appendChild(actions);

    const noteBox = document.createElement("div");
    noteBox.className = "sr-note";
    noteBox.innerHTML = '<textarea placeholder="Scrie un gând, o întrebare, o aplicație personală..."></textarea><button class="sr-note-save">Salvează notița</button>';
    full.appendChild(noteBox);
    const ta = noteBox.querySelector("textarea");

    const markBtn = actions.querySelector('[data-a="mark"]');
    const noteBtn = actions.querySelector('[data-a="note"]');
    const syncMark = () => {
      let m = "none"; try { m = localStorage.getItem(markKey) || "none"; } catch(e){}
      markBtn.classList.toggle("active", m !== "none");
    };
    const syncNote = () => {
      let t = ""; try { t = localStorage.getItem(noteKey) || ""; } catch(e){}
      noteBtn.classList.toggle("active", !!t);
      return t;
    };
    syncMark();
    ta.value = syncNote();

    const open = document.createElement("button");
    open.className = "sr-open";
    open.textContent = "Citește în carte →";
    full.appendChild(open);

    actions.addEventListener("click", e => {
      const b = e.target.closest(".sr-act");
      if(!b) return;
      e.stopPropagation();
      const a = b.dataset.a;
      if(a === "copy"){
        const t = srCopyText(hit);
        if(navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(() => srFlash("Copiat")).catch(() => srFlash("Copiat"));
        else srFlash("Copiat");
      } else if(a === "share"){
        const t = srCopyText(hit);
        if(navigator.share) navigator.share({ text: t }).catch(() => {});
        else if(navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(() => srFlash("Copiat — gata de trimis"));
        else srFlash("Trimiterea nu e disponibilă pe acest dispozitiv");
      } else if(a === "mark"){
        let cur = "none"; try { cur = localStorage.getItem(markKey) || "none"; } catch(err){}
        const next = cur === "none" ? "yellow" : "none";
        try { localStorage.setItem(markKey, next); } catch(err){}
        if(typeof applyMarkByKey === "function") applyMarkByKey(card, markKey);
        syncMark();
        srFlash(next !== "none" ? "Marcat" : "Demarcat");
      } else if(a === "note"){
        noteBox.classList.toggle("show");
        if(noteBox.classList.contains("show")) ta.focus();
      }
    });
    noteBox.querySelector(".sr-note-save").addEventListener("click", e => {
      e.stopPropagation();
      try {
        if(ta.value.trim()) localStorage.setItem(noteKey, ta.value);
        else localStorage.removeItem(noteKey);
      } catch(err){}
      syncNote();
      noteBox.classList.remove("show");
      srFlash("Notiță salvată");
    });
    ta.addEventListener("click", e => e.stopPropagation());
    open.addEventListener("click", e => {
      e.stopPropagation();
      if(hit.open.type === "lib"){
        switchTab("diverse");
        if(typeof window.libRevealBook === "function") window.libRevealBook(hit.open.slug);
        if(typeof window.openLibraryAt === "function") window.openLibraryAt(hit.open.slug, hit.open.chIdx, hit.open.v);
      } else {
        switchTab("biblia");
        const el = document.querySelector('.verse[data-num="' + hit.open.num + '"]');
        if(el){
          requestAnimationFrame(() => requestAnimationFrame(() => {
            el.scrollIntoView({ block: "center" });
            el.classList.remove("verse-flash");
            void el.offsetWidth;
            el.classList.add("verse-flash");
            setTimeout(() => el.classList.remove("verse-flash"), 2200);
          }));
        }
      }
    });
  }

  head.addEventListener("click", () => {
    if(!built) build();
    card.classList.toggle("open");
  });
  snippet.addEventListener("click", () => {
    if(!built) build();
    card.classList.add("open");
  });
  full.addEventListener("click", e => e.stopPropagation());
  return card;
}

let srFilter = null; // „VT” / „NT” la Biblia, numele colecției la Comentarii-Texte
let srBook = null;   // cartea aleasă la Biblia (Geneza, Isaia…)
let srChipsOpen = false; // lista completă de colecții la Comentarii-Texte
let srSection = "bible"; // "bible" = Biblia, "lib" = Comentarii-Texte (arhiva din Diverse)
let srReq = 0;
const SR_PAGE = 40;
const SR_COMMENTS = "Comentarii din Biblie";

// arhiva din Diverse se caută pe server (toate capitolele, fără să încarce lucrările întregi)
function srFetchLib(q, group, offset, limit){
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 12000);
  return fetch(TTS_API_BASE + "/api/search?q=" + encodeURIComponent(q) + "&group=" + encodeURIComponent(group || "") +
      "&offset=" + offset + "&limit=" + limit, { signal: ctrl.signal })
    .then(r => { if(!r.ok) throw new Error("http " + r.status); return r.json(); })
    .finally(() => clearTimeout(timer));
}
function srServerHit(h){
  return { sec: "lib", group: h.group, title: h.title, plain: h.plain, html: null, key: h.key,
           open: { type: "lib", slug: h.slug, chIdx: h.chIdx, v: h.v } };
}

// golește căutarea (la ieșirea din tab și la redeschiderea aplicației)
function srReset(){
  srReq++;
  clearTimeout(srTimer);
  searchInput.value = "";
  searchResults.innerHTML = "";
  srFilter = null; srBook = null; srChipsOpen = false; srSection = "bible";
}

function srChip(parent, name, n, active, onClick){
  const chip = document.createElement("button");
  chip.className = "search-form-chip" + (active ? " active" : "") + (n ? "" : " empty");
  chip.innerHTML = escapeHtml(name) + "<b>" + n + "</b>";
  if(n) chip.addEventListener("click", onClick);
  parent.appendChild(chip);
  return chip;
}

async function runSearch(){
  const myReq = ++srReq;
  const query = searchInput.value.trim();
  if(query.length < 2){ searchResults.innerHTML = ""; srFilter = null; srBook = null; return; }
  const toks = srStrip(query).split(/\s+/).filter(Boolean);
  if(!toks.length) return;

  // Biblia (Tora + Haftarot) și comentariile atașate versetelor — local; restul arhivei — pe server
  let local = srCollectHits(toks, false);
  let server = null;
  try { server = await srFetchLib(query, "", 0, 0); } catch(e){
    server = null;
    if(myReq === srReq && /429/.test(String(e && e.message))){ searchResults.innerHTML = '<p style="color:var(--ink-soft); font-style:italic;">Prea multe căutări într-un timp scurt. Încearcă din nou peste un minut.</p>'; return; }
  }
  if(myReq !== srReq) return;
  if(!server) local = srCollectHits(toks, true); // fără server: doar ce e deja încărcat în aplicație

  const bibleHits = local.filter(h => h.sec === "bible");
  const commentHits = local.filter(h => h.sec === "lib" && (server ? h.group === SR_COMMENTS : true));
  const libCounts = new Map();
  if(server) server.counts.forEach(([g, n]) => libCounts.set(g, n));
  const localLibHits = commentHits; // fără server include tot ce a găsit local
  if(!server) localLibHits.forEach(h => libCounts.set(h.group, (libCounts.get(h.group) || 0) + 1));
  else if(commentHits.length) libCounts.set(SR_COMMENTS, commentHits.length);
  const libTotal = server ? server.total + commentHits.length : localLibHits.length;
  const all = bibleHits.length + libTotal;

  searchResults.innerHTML = "";
  if(!all){
    searchResults.innerHTML = '<p style="color:var(--ink-soft); font-style:italic;">Niciun rezultat pentru „' + escapeHtml(query) + '”.</p>';
    return;
  }

  // dacă secțiunea aleasă n-are nimic, trecem automat la cealaltă
  let sec = srSection;
  const secCount = { bible: bibleHits.length, lib: libTotal };
  if(!secCount[sec]) sec = (sec === "bible") ? "lib" : "bible";

  const summary = document.createElement("div");
  summary.className = "search-summary";
  summary.textContent = all + (all === 1 ? " rezultat" : " rezultate") + " pentru „" + query + "”";
  searchResults.appendChild(summary);

  const seg = document.createElement("div");
  seg.className = "search-sections";
  [["bible", "Biblia"], ["lib", "Comentarii-Texte"]].forEach(([id, label]) => {
    const btn = document.createElement("button");
    btn.className = "search-section-btn" + (sec === id ? " active" : "");
    btn.innerHTML = escapeHtml(label) + "<b>" + secCount[id] + "</b>";
    btn.addEventListener("click", () => { if(sec === id) return; srSection = id; srFilter = null; srBook = null; runSearch(); });
    seg.appendChild(btn);
  });
  searchResults.appendChild(seg);

  const chipsEl = document.createElement("div");
  chipsEl.className = "search-forms";
  let source; // { total, page(offset, limit) → Promise<hit[]> }

  if(sec === "bible"){
    // VT / NT, apoi cărțile (Geneza 10, Exodul 15…) din testamentul ales
    const tCounts = { VT: 0, NT: 0 };
    bibleHits.forEach(h => tCounts[h.testament]++);
    if(srFilter && !tCounts[srFilter]) srFilter = null;
    ["VT", "NT"].forEach(t => srChip(chipsEl, t, tCounts[t], srFilter === t, () => { srFilter = (srFilter === t) ? null : t; srBook = null; runSearch(); }));
    searchResults.appendChild(chipsEl);

    const inTestament = srFilter ? bibleHits.filter(h => h.testament === srFilter) : bibleHits;
    const bCounts = new Map();
    inTestament.forEach(h => bCounts.set(h.book, (bCounts.get(h.book) || 0) + 1));
    if(srBook && !bCounts.get(srBook)) srBook = null;
    const order = name => { const i = BOOKS.findIndex(b => b.name === name || (b.name === "Faptele Apostolilor" && name === "Faptele")); return i === -1 ? 999 : i; };
    const booksEl = document.createElement("div");
    booksEl.className = "search-forms";
    Array.from(bCounts.entries()).sort((a, b) => order(a[0]) - order(b[0])).forEach(([name, n]) =>
      srChip(booksEl, name, n, srBook === name, () => { srBook = (srBook === name) ? null : name; runSearch(); }));
    if(bCounts.size) searchResults.appendChild(booksEl);

    const shownB = srBook ? inTestament.filter(h => h.book === srBook) : inTestament;
    source = { total: shownB.length, page: async (o, l) => shownB.slice(o, o + l) };
  } else {
    // colecțiile (Zohar 369, Mișna 12…)
    const entries = Array.from(libCounts.entries()).sort((a, b) => b[1] - a[1]);
    if(srFilter && !libCounts.get(srFilter)) srFilter = null;
    const LIMIT = 8;
    const visible = (srChipsOpen || entries.length <= LIMIT + 1) ? entries
      : entries.filter(([name], i) => i < LIMIT || name === srFilter);
    visible.forEach(([name, n]) => srChip(chipsEl, name, n, srFilter === name, () => { srFilter = (srFilter === name) ? null : name; runSearch(); }));
    if(entries.length > LIMIT + 1){
      const tog = document.createElement("button");
      tog.className = "search-form-chip";
      tog.textContent = srChipsOpen ? "Mai puține" : "+" + (entries.length - visible.length) + " colecții";
      tog.addEventListener("click", () => { srChipsOpen = !srChipsOpen; runSearch(); });
      chipsEl.appendChild(tog);
    }
    if(entries.length > 1) searchResults.appendChild(chipsEl);

    if(!server){
      const shownL = srFilter ? localLibHits.filter(h => h.group === srFilter) : localLibHits;
      source = { total: shownL.length, page: async (o, l) => shownL.slice(o, o + l) };
    } else {
      const nLoc = (!srFilter || srFilter === SR_COMMENTS) ? commentHits.length : 0;
      const srvGroup = (srFilter && srFilter !== SR_COMMENTS) ? srFilter : "";
      const nSrv = srFilter === SR_COMMENTS ? 0 : (srvGroup ? (libCounts.get(srvGroup) || 0) : server.total);
      source = {
        total: nLoc + nSrv,
        page: async (o, l) => {
          const out = [];
          if(o < nLoc) out.push(...commentHits.slice(o, Math.min(nLoc, o + l)));
          const need = l - out.length;
          if(need > 0 && nSrv > 0){
            const r = await srFetchLib(query, srvGroup, Math.max(0, o - nLoc), need);
            out.push(...r.hits.map(srServerHit));
          }
          return out;
        }
      };
    }
  }

  const list = document.createElement("div");
  searchResults.appendChild(list);
  let rendered = 0, busy = false;
  const more = document.createElement("button");
  more.className = "search-more";
  async function renderMore(){
    if(busy) return;
    busy = true;
    more.textContent = "Se încarcă…";
    try {
      const hits = await source.page(rendered, SR_PAGE);
      if(myReq !== srReq) return;
      hits.forEach(h => list.appendChild(srBuildCard(h, toks)));
      rendered += hits.length;
    } catch(e){
      more.textContent = "Nu s-a putut încărca — atinge ca să reîncerci";
      busy = false;
      if(!more.parentNode) searchResults.appendChild(more);
      return;
    }
    busy = false;
    if(rendered < source.total){
      more.textContent = "Arată mai multe (" + (source.total - rendered) + ")";
      if(!more.parentNode) searchResults.appendChild(more);
    } else if(more.parentNode){
      more.parentNode.removeChild(more);
    }
  }
  more.addEventListener("click", renderMore);
  renderMore();
}

let srTimer = null;
window.addEventListener("pageshow", () => { srReset(); });
document.addEventListener("visibilitychange", () => { if(document.visibilityState === "hidden") srReset(); });
srReset(); // și la pornire, ca să nu rămână textul restaurat de browser
searchInput.addEventListener("input", () => {
  clearTimeout(srTimer);
  srTimer = setTimeout(runSearch, 100);
});

// Setări — buton spre panoul "despre"
document.getElementById("settings-about-btn").addEventListener("click", openInfoPanel);

// Ceas/dată live, în Acasă
const homeDatetimeEl = document.getElementById("home-datetime");
const ZILE = ["duminică","luni","marți","miercuri","joi","vineri","sâmbătă"];
const LUNI = ["ianuarie","februarie","martie","aprilie","mai","iunie","iulie","august","septembrie","octombrie","noiembrie","decembrie"];
function updateClock(){
  const now = new Date();
  const zi = ZILE[now.getDay()];
  const luna = LUNI[now.getMonth()];
  const lunaCapitalizata = luna.charAt(0).toUpperCase() + luna.slice(1);
  const ora = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  homeDatetimeEl.innerHTML =
    zi.charAt(0).toUpperCase() + zi.slice(1) + ", " + now.getDate() + " " + lunaCapitalizata +
    ' <span class="dt-time">' + ora + ":" + min + "</span>";
}
updateClock();
setInterval(updateClock, 15000);

// Citatul zilei — din public/citate.js (180 de citate creștine). Se alege după tema versetului și a istoriei zilei;
// un citat nu se repetă pe același dispozitiv în 150 de zile.
const CITATE_REZERVA = [
  { text: "Fii mai atent la un grăunte de credință decât la o tonă de entuziasm.", author: "Charles Spurgeon", t: ["credinta"] },
  { text: "Toți uriașii lui Dumnezeu au fost oameni slabi, care au făcut lucruri mari pentru Dumnezeu pentru că au socotit că El este cu ei.", author: "Hudson Taylor", t: ["credinta"] }
];
const QUOTE_THEMES = {
  credinta: ["credint", "increde", "crede", "credin"], rugaciune: ["rugaciun", "ruga", "rugat"], har: ["har ", "harul", "iert", "mantuir", "indreptat"],
  misiune: ["misionar", "misiun", "convert", "trimis"], evanghelizare: ["evanghel", "predic", "vestea", "cruciada"],
  suferinta: ["suferin", "martir", "persecut", "necaz", "prigon", "ucis", "executa", "omorat", "ghetou", "holocaust", "mort"],
  speranta: ["sperant", "viitor", "inviere", "invie"], iubire: ["iubire", "dragoste", "iubi", "milostiv", "caritate"],
  scriptura: ["biblie", "biblic", "scriptur", "traducer", "tiparit", "tipar"], curaj: ["curaj", "indrazn", "impotriva", "rezist", "proces", "condamn"],
  slujire: ["slujb", "slujire", "spital", "scoala", "orfelin", "ajutor", "societate", "fundat", "intemeiat", "intemeiaz"],
  umilinta: ["umil", "smerit"], libertate: ["libertate", "aboli", "sclav", "eliberar", "drepturi", "liber"], pocainta: ["pocain", "indulgent", "mustrare"],
  unitate: ["unitate", "ecumenic", "conferint", "alianta", "adunare", "uniune", "unire"], munca: ["lucrare", "munca", "lucra"],
  bucurie: ["bucur", "veselie", "cant", "imn"], recunostinta: ["multumir", "recunostin"], ascultare: ["ascult", "supus", "porunc"],
  adevar: ["adevar", "dogma", "sinod", "conciliu", "erezie", "crez", "marturisire"], pace: ["pace", "tratat", "armistitiu", "acord", "pacific"],
  biserica: ["biseric", "congregat", "denominat", "sinod", "adunari"], reforma: ["reforma", "luther", "calvin", "protestan", "teze", "worms", "augsburg"],
  craciun: ["craciun", "nasterea", "betleem", "iesle"], darnicie: ["darnic", "milostenie", "daruri", "ofrand"], vesnicie: ["vesnic", "cer ", "ceruri", "imparatia"],
  vegherea: ["vegh", "trezi", "pregatit"]
};
function quoteStrip(s){ return " " + String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase() + " "; }
function quoteThemeCounts(ctx){
  const n = quoteStrip(ctx), out = {};
  Object.keys(QUOTE_THEMES).forEach(th => {
    let c = 0;
    QUOTE_THEMES[th].forEach(k => { let i = n.indexOf(k); while(i !== -1){ c++; i = n.indexOf(k, i + k.length); } });
    if(c) out[th] = c;
  });
  return out;
}
function quoteDayNumber(){ const d = new Date(); return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000); }
function quoteRender(q){
  const quoteEl = document.getElementById("home-quote");
  if(!quoteEl) return;
  quoteEl.textContent = "";
  quoteEl.appendChild(document.createTextNode("„" + q.text + "”"));
  const ref = document.createElement("span");
  ref.className = "home-quote-ref";
  ref.textContent = q.author;
  quoteEl.appendChild(ref);
}
function quoteForContext(ctx){
  const pool = (window.CITATE_DAVAR && window.CITATE_DAVAR.length) ? window.CITATE_DAVAR : CITATE_REZERVA;
  const day = quoteDayNumber();
  let st = {};
  try { st = JSON.parse(localStorage.getItem("davar-citat") || "{}") || {}; } catch(e){ st = {}; }
  st.last = st.last || {};
  // aceeași zi, aceeași alegere (dacă a fost deja făcută cu contextul zilei)
  if(st.day === day && st.matched && pool[st.idx]){ quoteRender(pool[st.idx]); return; }
  if(st.day === day && !ctx && pool[st.idx]){ quoteRender(pool[st.idx]); return; }
  const counts = ctx ? quoteThemeCounts(ctx) : {};
  const recent = new Set();
  Object.keys(st.last).forEach(i => { if(day - st.last[i] < 150 && Number(i) !== st.idx) recent.add(Number(i)); });
  if(st.day === day && typeof st.idx === "number") delete st.last[st.idx]; // înlocuim alegerea provizorie de azi
  let best = -1, bestScore = -1;
  for(let k = 0; k < pool.length; k++){
    const i = (k + day * 7) % pool.length; // la scor egal, rotația zilei hotărăște
    if(recent.has(i) && pool.length > 150) continue;
    let s = 0;
    (pool[i].t || []).forEach(t => { s += counts[t] ? 1 + Math.min(counts[t], 3) : 0; });
    if(s > bestScore){ bestScore = s; best = i; }
  }
  if(best < 0) best = day % pool.length;
  st.day = day; st.idx = best; st.matched = !!ctx; st.last[best] = day;
  Object.keys(st.last).forEach(i => { if(day - st.last[i] > 200) delete st.last[i]; });
  try { localStorage.setItem("davar-citat", JSON.stringify(st)); } catch(e){}
  quoteRender(pool[best]);
}
window.quoteForContext = quoteForContext;
function updateQuote(){ quoteForContext(""); }
updateQuote();

function initApp(){
  document.getElementById("chapter-player-mount").appendChild(buildChapterPlayerBar());
  loadChapter(1);
}

initApp();
window.__mainReady = true; // aplicația (acasă) e construită: ecranul de pornire poate dispărea

// Datele bibliotecii (library-data.js, ~11 MB) NU se cer la pornire: ar concura cu primul ecran. Se încarcă după ce acasă e gata (în pauză),
// sau imediat ce e nevoie (Diverse, foaia de verset). După încărcare, imaginile cardurilor din Diverse se pregătesc în fundal.
window.libLoad = function(cb){
  if(typeof LIBRARY !== "undefined"){ if(cb) cb(); return; }
  (window.__libCbs = window.__libCbs || []).push(cb);
  if(window.__libLoading) return;
  window.__libLoading = true;
  const s = document.createElement("script");
  s.src = "library-data.js?v=1";
  s.onload = () => { const l = window.__libCbs || []; window.__libCbs = []; l.forEach(f => { try { if(f) f(); } catch(e){} }); if(window.libPreloadCardImages) setTimeout(window.libPreloadCardImages, 300); };
  document.head.appendChild(s);
};
(function(){
  const go = () => window.libLoad();
  if("requestIdleCallback" in window) requestIdleCallback(go, { timeout: 2500 }); else setTimeout(go, 1500);
})();

// Service worker: pornire din memoria telefonului. Când apare o versiune nouă (după o actualizare), pagina se reîncarcă o singură dată, doar în primele secunde după deschidere.
if("serviceWorker" in navigator){
  window.addEventListener("load", () => { navigator.serviceWorker.register("sw.js").catch(() => {}); });
  let swReloadTimer = null;
  navigator.serviceWorker.addEventListener("message", (e) => {
    if(!e.data || e.data.type !== "davar-update") return;
    if(performance.now() > 20000 || sessionStorage.getItem("davar-sw-reloaded")) return; // mai târziu: se aplică la următoarea deschidere
    clearTimeout(swReloadTimer);
    swReloadTimer = setTimeout(() => { try { sessionStorage.setItem("davar-sw-reloaded", "1"); } catch(err){} location.reload(); }, 2500);
  });
}
