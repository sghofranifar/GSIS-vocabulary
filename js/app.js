/* ═══════════════════════════════════════════════════════════════
   GSIS Grundwortschatz — App logic
   Screens, i18n, practice modes. Vocabulary data lives in data.js,
   spaced-repetition scheduling in srs.js, badges/levels in badges.js.
   ═══════════════════════════════════════════════════════════════ */

var SS = 10;
var LANG = 'en';
var S = { jg: null, unit: null, mode: null, cards: [], idx: 0, ok: 0, no: 0 };
var PW = 'learnvocab'; // symbolic gate only — visible in source, not real access control (see README)

// ═══ i18n ═══
var TX = {
en: {
  landD:"The essential English vocabulary for GSIS German Stream students — practise your Green Line word lists with flashcards, matching, typing and listening exercises.",
  startTxt:"Start Practising", back:"Back",
  step1:"Step 1 of 3", step2:"Step 2 of 3",
  yrT:"Choose your year", yrD:"Select the year group matching your Green Line textbook.",
  unT:"Choose a unit", unD:"Pick the unit you are currently working on in class.",
  moT:"How would you like to practise?", moD:"Choose a practice mode or view the complete word list.",
  liT:"Complete Word List",
  vocab:"words", tapFlip:"Tap to flip", again:"Again", okish:"So-so", gotIt:"Got it!",
  check:"Check", next:"Next →", correct:"Correct!", wrongWas:"Correct answer:",
  listenH:"Listen and type the English word", typeH:"Type the English word",
  slower:"Slower", result:"Result", right:"Correct", wrng:"Wrong", total:"Total",
  retry:"Practise again", diffMode:"Different mode", home:"Home", pairs:"pairs",
  search:"Search...", yr:"Year", navSel:"Select Year",
  it1:"How to use", id1:"Choose your year (K05–K09), pick a unit, then select a practice mode. Each session tests 10 words — the words you find hardest come up more often. Your progress is saved automatically on this device.",
  it2:"4 Practice Modes + Definitions", id2:"Flashcards, matching pairs, typing with typo tolerance, and listening comprehension — with real spaced repetition. Toggle to EN mode for monolingual English definitions instead of German translations.",
  it3:"Privacy First", id3:"No login, no tracking, no cookies. All data stays on your device. Works completely offline after loading once.",
  abt:"About this vocabulary", abp:"The Grundwortschatz is the defined basic English vocabulary for the GSIS German Secondary Stream (Klasse 5–9). It is based on the Green Line textbook series (Klett Verlag, 2021–2023 editions) and covers approximately 4,100 words and phrases across five year groups. Students are expected to actively learn and retain this core vocabulary throughout their secondary school years.",
  fc:"Flashcards", fcD:"Read, flip, sort — spaced repetition.",
  ma:"Matching", maD:"Match English and German words.",
  ty:"Typing", tyD:"Read the German, type the English word.",
  li:"Listening", liD:"Listen to the word, then type it.",
  wl:"Word List", wlD:"View all vocabulary in a searchable list.",
  resetQ:"Delete all learning progress and badges?", deleted:"Deleted.", streak:"day streak",
  pwT:"Enter Access Code", pwD:"Please enter the password to access the vocabulary trainer.",
  level:"Level", toNextLevel:"XP to next level", badgesT:"Your Progress", badgesD:"Collect badges as you practise. Everything is stored only on this device.",
  newBadge:"New badge!"
},
de: {
  landD:"Der obligatorische Englisch-Grundwortschatz für den Deutschen Strom an der GSIS — übe deine Green-Line-Vokabeln mit Karteikarten, Matching, Tippen und Hörverstehen.",
  startTxt:"Jetzt üben", back:"Zurück",
  step1:"Schritt 1 von 3", step2:"Schritt 2 von 3",
  yrT:"Wähle deine Klasse", yrD:"Wähle die Jahrgangsstufe passend zu deinem Green-Line-Buch.",
  unT:"Welche Lektion?", unD:"Such dir die Unit aus, die du gerade im Unterricht bearbeitest.",
  moT:"Wie möchtest du üben?", moD:"Wähle einen Übungsmodus oder sieh dir die komplette Vokabelliste an.",
  liT:"Komplette Vokabelliste",
  vocab:"Vokabeln", tapFlip:"Tippe zum Umdrehen", again:"Nochmal", okish:"Geht so", gotIt:"Wusste ich!",
  check:"Prüfen", next:"Weiter →", correct:"Richtig!", wrongWas:"Richtig wäre:",
  listenH:"Hör zu und tippe das englische Wort", typeH:"Tippe das englische Wort",
  slower:"Langsamer", result:"Ergebnis", right:"Richtig", wrng:"Falsch", total:"Gesamt",
  retry:"Nochmal üben", diffMode:"Anderer Modus", home:"Startseite", pairs:"Paare",
  search:"Suchen...", yr:"Klasse", navSel:"Klasse wählen",
  it1:"So funktioniert's", id1:"Wähle deine Klasse (K05–K09), dann eine Unit und einen Übungsmodus. Jede Übungsrunde testet 10 Wörter — Wörter, die dir schwerfallen, kommen häufiger dran. Dein Fortschritt wird automatisch auf diesem Gerät gespeichert.",
  it2:"4 Übungsmodi + Definitionen", id2:"Karteikarten, Zuordnungsspiel, Tippen mit Tipptoleranz und Hörverstehen — mit echter Spaced Repetition. Im EN-Modus werden deutsche Übersetzungen durch englische Definitionen ersetzt.",
  it3:"Datenschutz", id3:"Kein Login, kein Tracking, keine Cookies. Alle Daten bleiben auf deinem Gerät. Funktioniert nach dem ersten Laden komplett offline.",
  abt:"Über diesen Wortschatz", abp:"Der Grundwortschatz ist der verbindliche englische Basiswortschatz für den Deutschen Strom an der GSIS (Klasse 5–9). Er basiert auf der Green-Line-Reihe (Klett Verlag, 2021–2023) und umfasst ca. 4.100 Wörter und Wendungen in fünf Jahrgangsstufen.",
  fc:"Karteikarten", fcD:"Lesen, drehen, einordnen — Spaced Repetition.",
  ma:"Matching", maD:"Englische und deutsche Wörter verbinden.",
  ty:"Tippen", tyD:"Deutsche Bedeutung lesen, englisches Wort tippen.",
  li:"Hörverstehen", liD:"Wort hören, dann tippen.",
  wl:"Vokabelliste", wlD:"Alle Vokabeln als durchsuchbare Liste.",
  resetQ:"Allen Lernfortschritt und alle Abzeichen löschen?", deleted:"Gelöscht.", streak:"Tage in Folge",
  pwT:"Zugangscode eingeben", pwD:"Bitte gib das Passwort ein, um den Vokabeltrainer zu öffnen.",
  level:"Level", toNextLevel:"XP bis zum nächsten Level", badgesT:"Dein Fortschritt", badgesD:"Sammle Abzeichen beim Üben. Alles bleibt nur auf diesem Gerät gespeichert.",
  newBadge:"Neues Abzeichen!"
}
};

function t(k) { return (TX[LANG] || TX.en)[k] || TX.en[k] || k; }

function setLang(lang) {
  LANG = lang;
  document.getElementById('btn-en').className = lang==='en' ? 'on' : '';
  document.getElementById('btn-de').className = lang==='de' ? 'on' : '';
  document.documentElement.lang = lang;
  var ids = ['land-d:landD','start-txt:startTxt','ey1:step1','ey2:step2',
    'yrt:yrT','yrd:yrD','unt:unT','und:unD','mot:moT','mod:moD','lit:liT',
    'it1:it1','id1:id1','it2:it2','id2:id2','it3:it3','id3:id3',
    'abt:abt','abp:abp','pw-t:pwT','pw-d:pwD','bdt:badgesT','bdd:badgesD'];
  ids.forEach(function(pair) {
    var parts = pair.split(':');
    var el = document.getElementById(parts[0]);
    if (el) el.textContent = t(parts[1]);
  });
  ['btxt-yr','btxt-un','btxt-mo','btxt-le','btxt-li','btxt-bd'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.textContent = t('back');
  });
  var nl = document.getElementById('nav-lbl');
  if (nl && !S.jg) nl.textContent = t('navSel');
  var lq = document.getElementById('lq');
  if (lq) lq.placeholder = t('search');
  if (typeof renderLevelPill === 'function') renderLevelPill();
  if (document.getElementById('s-badges').classList.contains('active')) renderBadgesScreen();
}

// ═══ DOM helpers ═══
function $(id) { return document.getElementById(id); }

function go(id) {
  var screens = document.querySelectorAll('.screen');
  for (var i = 0; i < screens.length; i++) screens[i].classList.remove('active');
  $('s-' + id).classList.add('active');
  window.scrollTo({top: 0, behavior: 'instant'});
  if (id === 'badges') renderBadgesScreen();
}

function goHome() { go('landing'); }

function getV(jg, u) {
  return V.filter(function(v) { return v.jahrgang === jg && v.unit === u; });
}

function getUnits(jg) {
  var s = {};
  V.forEach(function(v) { if (v.jahrgang === jg) s[v.unit] = true; });
  var order = ['GRS','WB','U1','U2','U3','U4','U5','MS','MS1','AC1','AC2','AC3','AC4','TS1','TS2','TS3','T1','T2','T3','T4','T5','T6','TR'];
  return Object.keys(s).sort(function(a, b) {
    var ia = order.indexOf(a); var ib = order.indexOf(b);
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
  });
}

function speak(w, slow) {
  if (!window.speechSynthesis) return;
  speechSynthesis.cancel();
  var u = new SpeechSynthesisUtterance(w);
  u.lang = 'en-GB'; u.rate = slow ? 0.55 : 0.82;
  var voices = speechSynthesis.getVoices();
  var gb = voices.find(function(v) { return v.lang === 'en-GB'; }) || voices.find(function(v) { return v.lang.indexOf('en') === 0; });
  if (gb) u.voice = gb;
  speechSynthesis.speak(u);
}
if (window.speechSynthesis) speechSynthesis.onvoiceschanged = function() {};

function lev(a, b) {
  var m = a.length, n = b.length;
  var d = [];
  for (var i = 0; i <= m; i++) { d[i] = []; for (var j = 0; j <= n; j++) d[i][j] = 0; }
  for (var i = 0; i <= m; i++) d[i][0] = i;
  for (var j = 0; j <= n; j++) d[0][j] = j;
  for (var j = 1; j <= n; j++) for (var i = 1; i <= m; i++) {
    d[i][j] = Math.min(d[i-1][j]+1, d[i][j-1]+1, d[i-1][j-1] + (a[i-1]===b[j-1]?0:1));
  }
  return d[m][n];
}

function chkTyp(inp, v) {
  var c = function(s) { return s.toLowerCase().replace(/[^a-zäöüß\s]/g, '').trim(); };
  var i = c(inp); if (!i) return false;
  var tg = c(v.en);
  return i === tg || (tg.length >= 4 && lev(i, tg) <= 1);
}

function speakBtn(w) {
  var safe = w.replace(/'/g, "\\'");
  return '<button class="tts" onclick="event.stopPropagation();speak(\'' + safe + '\')"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19"/><path d="M15.5 8.5a5 5 0 010 7"/></svg></button>';
}

// Meaning text: German translation, or English definition in EN mode.
function meaning(v) {
  if (LANG === 'de') return v.de.join('; ');
  return v.def || v.de.join('; ');
}

// ═══ PASSWORD GATE ═══
function checkPW() {
  var inp = $('pw-in');
  if (inp.value === PW) {
    sessionStorage.setItem('gsis-auth', '1');
    go('year');
  } else {
    inp.classList.add('err');
    inp.value = '';
    setTimeout(function() { inp.classList.remove('err'); }, 500);
  }
}

// ═══ NAV ═══
function toggleNav() { $('navdd').classList.toggle('open'); }

function buildNav() {
  var html = '';
  [5,6,7,8,9].forEach(function(y) {
    var cnt = V.filter(function(v) { return v.jahrgang === y; }).length;
    var cls = S.jg === y ? 'navi cur' : 'navi';
    html += '<button class="' + cls + '" onclick="pickYr(' + y + ');document.getElementById(\'navdd\').classList.remove(\'open\')">K0' + y + ' · ' + cnt + ' ' + t('vocab') + '</button>';
  });
  $('navm').innerHTML = html;
}

// ═══ YEAR ═══
function renderYears() {
  var colors = [['#006B3D','#fff'],['#007D46','#fff'],['#009B59','#fff'],['#00B36B','#fff'],['#2DC680','#003A21']];
  var html = '';
  [5,6,7,8,9].forEach(function(y, i) {
    var cnt = V.filter(function(v) { return v.jahrgang === y; }).length;
    html += '<button class="ybtn" style="background:' + colors[i][0] + ';color:' + colors[i][1] + '" onclick="pickYr(' + y + ')"><span class="ynum">K0' + y + '</span><span class="ylabel">' + t('yr') + ' ' + y + '</span><span class="ycount">' + cnt + ' ' + t('vocab') + '</span></button>';
  });
  $('ygrid').innerHTML = html;
}

function pickYr(y) {
  S.jg = y;
  document.body.classList.toggle('big', y <= 6);
  $('nav-lbl').textContent = 'K0' + y;
  buildNav();
  renderUnits();
  go('unit');
}

// ═══ UNITS ═══
function renderUnits() {
  $('yr-ey').textContent = 'K0' + S.jg;
  var us = getUnits(S.jg);
  var html = '';
  us.forEach(function(u) {
    var c = getV(S.jg, u).length;
    var th = THEMES[S.jg + '-' + u] || u;
    html += '<button class="ucard" onclick="pickU(\'' + u + '\')"><div class="ucode">' + u + '</div><div class="utheme">' + th + '</div><div class="ucnt">' + c + ' ' + t('vocab') + '</div></button>';
  });
  $('ugrid').innerHTML = html;
}

function pickU(u) {
  S.unit = u;
  renderModes();
  go('mode');
}

// ═══ MODES ═══
function renderModes() {
  var th = THEMES[S.jg + '-' + S.unit] || S.unit;
  $('mbc').innerHTML = 'K0' + S.jg + ' <span class="bcs">›</span> ' + th;
  var modes = [
    {id:'cards', tk:'fc', dk:'fcD', ic:'<rect x="3" y="5" width="18" height="14" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/>'},
    {id:'matching', tk:'ma', dk:'maD', ic:'<circle cx="6" cy="7" r="2"/><circle cx="18" cy="7" r="2"/><circle cx="6" cy="17" r="2"/><circle cx="18" cy="17" r="2"/><line x1="8" y1="7" x2="16" y2="17"/><line x1="8" y1="17" x2="16" y2="7"/>'},
    {id:'typing', tk:'ty', dk:'tyD', ic:'<rect x="2" y="6" width="20" height="12" rx="2"/><line x1="7" y1="14" x2="17" y2="14"/>'},
    {id:'listening', tk:'li', dk:'liD', ic:'<polygon points="11 5 6 9 2 9 2 15 6 15 11 19"/><path d="M15.5 8.5a5 5 0 010 7"/><path d="M19 5a10 10 0 010 14"/>'},
    {id:'list', tk:'wl', dk:'wlD', ic:'<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>'}
  ];
  var html = '';
  modes.forEach(function(m) {
    html += '<button class="mcard" onclick="pickM(\'' + m.id + '\')"><div class="mic"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + m.ic + '</svg></div><div class="mtx"><div class="mtt">' + t(m.tk) + '</div><div class="mde">' + t(m.dk) + '</div></div><svg class="marr" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg></button>';
  });
  $('mlist').innerHTML = html;
}

function pickM(m) {
  if (m === 'list') { renderList(); go('list'); return; }
  S.mode = m; S.idx = 0; S.ok = 0; S.no = 0;
  var pool = getV(S.jg, S.unit);
  if (m === 'typing' || m === 'listening') pool = pool.filter(function(v) { return !v.phrase; });
  S.cards = pickSessionCards(pool, SS);
  if (!S.cards.length) { alert('No vocabulary available.'); return; }

  go('learn'); startM();
}

// ═══ VOCAB LIST ═══
function renderList() {
  var th = THEMES[S.jg + '-' + S.unit] || S.unit;
  $('lbc').innerHTML = 'K0' + S.jg + ' <span class="bcs">›</span> ' + th;
  var all = getV(S.jg, S.unit);

  function draw(f) {
    var q = f.toLowerCase();
    var rows = all.filter(function(v) {
      return !q || v.en.toLowerCase().indexOf(q) >= 0 || v.de.join(' ').toLowerCase().indexOf(q) >= 0 || (v.def || '').toLowerCase().indexOf(q) >= 0;
    });
    var defCol = LANG === 'en' ? 'Definition' : 'Deutsch';
    var html = '<table class="vtbl"><thead><tr><th></th><th>English</th><th>' + defCol + '</th></tr></thead><tbody>';
    rows.forEach(function(v) {
      var tags = v.tags.length ? ' <span style="color:var(--i3);font-size:11px">(' + v.tags.join(', ') + ')</span>' : '';
      html += '<tr><td>' + speakBtn(v.en) + '</td><td class="ven">' + v.en + tags + '</td><td class="vde">' + meaning(v) + '</td></tr>';
    });
    html += '</tbody></table>';
    $('larea').innerHTML = html;
  }
  draw('');
  $('lq').value = '';
  $('lq').oninput = function(e) { draw(e.target.value); };
}

// ═══ LEARN ENGINE ═══
function updPips() {
  var n = S.cards.length;
  var html = '';
  for (var i = 0; i < n; i++) html += '<div class="pip ' + (i < S.idx ? 'pip-d' : i === S.idx ? 'pip-c' : 'pip-t') + '"></div>';
  $('pips').innerHTML = html;
  $('cnt').textContent = Math.min(S.idx + 1, n) + ' / ' + n;
}

function startM() {
  updPips();
  if (S.mode === 'cards') rFC();
  else if (S.mode === 'matching') rMA();
  else if (S.mode === 'typing') rTY();
  else if (S.mode === 'listening') rLI();
}

function adv() {
  S.idx++;
  if (S.idx >= S.cards.length) { showRes(); return; }
  updPips(); startM();
}

// ─ Flashcards ─
function rFC() {
  var v = S.cards[S.idx];
  var tagHtml = v.tags.length ? '<div class="fch">' + v.tags.join(' · ') + '</div>' : '';
  $('area').innerHTML =
    '<div class="fcwrap"><div class="fc" id="fc">' +
    '<div class="fcf fcfr">' + speakBtn(v.en) + '<div class="fcw">' + v.en + '</div>' + tagHtml + '<div class="fch">' + t('tapFlip') + '</div></div>' +
    '<div class="fcf fcba"><div class="fcw" style="font-size:20px;color:var(--g9)">' + meaning(v) + '</div><div class="fch" style="margin-top:10px;color:var(--i5)">' + v.en + '</div></div>' +
    '</div></div>' +
    '<div class="fcact" id="fca" style="display:none">' +
    '<button class="bno" onclick="fcR(1)">' + t('again') + '</button>' +
    '<button class="bok" onclick="fcR(3)">' + t('okish') + '</button>' +
    '<button class="byes" onclick="fcR(5)">' + t('gotIt') + '</button></div>';
  var card = $('fc');
  card.onclick = function() {
    card.classList.toggle('flipped');
    setTimeout(function() { $('fca').style.display = 'flex'; }, 300);
  };
}

function fcR(r) {
  var v = S.cards[S.idx];
  var correct = r >= 4;
  if (correct) S.ok++; else S.no++;
  srsRecord(v.id, correct);
  adv();
}

// ─ Matching ─
function rMA() {
  var batch = S.cards.slice(S.idx, Math.min(S.idx + 6, S.cards.length));
  var enB = shuffle(batch.map(function(v, i) { return {i: i, t: v.en}; }));
  var deB = shuffle(batch.map(function(v, i) { return {i: i, t: meaning(v)}; }));
  var html = '<div class="mgrid" id="mg">';
  enB.forEach(function(b) { html += '<button class="mbtn" data-s="en" data-vi="' + b.i + '">' + b.t + '</button>'; });
  deB.forEach(function(b) { html += '<button class="mbtn" data-s="de" data-vi="' + b.i + '">' + b.t + '</button>'; });
  html += '</div>';
  $('area').innerHTML = html;
  $('cnt').textContent = batch.length + ' ' + t('pairs');
  $('pips').innerHTML = '<div class="pip pip-c" style="flex:1"></div>';

  var sel = null, matched = 0;
  var btns = $('mg').querySelectorAll('.mbtn');
  for (var k = 0; k < btns.length; k++) {
    (function(btn) {
      btn.addEventListener('click', function() {
        if (btn.classList.contains('hit')) return;
        if (!sel) { sel = btn; btn.classList.add('sel'); return; }
        if (sel === btn) { sel.classList.remove('sel'); sel = null; return; }
        if (sel.getAttribute('data-s') === btn.getAttribute('data-s')) {
          sel.classList.remove('sel'); sel = btn; btn.classList.add('sel'); return;
        }
        if (sel.getAttribute('data-vi') === btn.getAttribute('data-vi')) {
          var w = batch[parseInt(btn.getAttribute('data-vi'), 10)];
          sel.classList.remove('sel'); sel.classList.add('hit'); btn.classList.add('hit');
          matched++; S.ok++; srsRecord(w.id, true); sel = null;
          if (matched === batch.length) { S.idx += batch.length - 1; setTimeout(adv, 500); }
        } else {
          S.no++;
          var w1 = batch[parseInt(sel.getAttribute('data-vi'), 10)];
          var w2 = batch[parseInt(btn.getAttribute('data-vi'), 10)];
          srsRecord(w1.id, false); srsRecord(w2.id, false);
          btn.classList.add('miss'); sel.classList.add('miss');
          var s2 = sel;
          setTimeout(function() { btn.classList.remove('miss','sel'); s2.classList.remove('miss','sel'); }, 400);
          sel = null;
        }
      });
    })(btns[k]);
  }
}

// ─ Typing ─
function rTY() {
  var v = S.cards[S.idx];
  $('area').innerHTML =
    '<div class="tprom"><div class="tword">' + meaning(v) + '</div><div class="thint">' + t('typeH') + '</div></div>' +
    '<div class="trow"><input class="tinp" id="ti" autocomplete="off" autocapitalize="none" spellcheck="false"><button class="tsub" id="ts">' + t('check') + '</button></div>' +
    '<div class="tfb" id="tf"></div>';
  var done = false;
  function chk() {
    if (done) { adv(); return; }
    var ok = chkTyp($('ti').value, v);
    done = true;
    srsRecord(v.id, ok);
    if (ok) { S.ok++; $('ti').classList.add('ok'); $('tf').className = 'tfb ok'; $('tf').innerHTML = '✓ ' + t('correct'); }
    else { S.no++; $('ti').classList.add('no'); $('tf').className = 'tfb no'; $('tf').innerHTML = '✗ ' + t('wrongWas') + ' <strong>' + v.en + '</strong>'; }
    $('ts').textContent = t('next'); speak(v.en);
  }
  $('ts').onclick = chk;
  $('ti').onkeydown = function(e) { if (e.key === 'Enter') chk(); };
  setTimeout(function() { $('ti').focus(); }, 100);
}

// ─ Listening ─
function rLI() {
  var v = S.cards[S.idx];
  var safe = v.en.replace(/'/g, "\\'");
  $('area').innerHTML =
    '<div class="tprom">' +
    '<button class="tts" onclick="speak(\'' + safe + '\')" style="width:64px;height:64px;margin-bottom:14px"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19"/><path d="M15.5 8.5a5 5 0 010 7"/><path d="M19 5a10 10 0 010 14"/></svg></button>' +
    '<div class="thint">' + t('listenH') + '</div>' +
    '<button style="margin-top:8px;font-size:12px;color:var(--i3);text-decoration:underline" onclick="speak(\'' + safe + '\',true)">' + t('slower') + '</button></div>' +
    '<div class="trow"><input class="tinp" id="ti" autocomplete="off" autocapitalize="none" spellcheck="false"><button class="tsub" id="ts">' + t('check') + '</button></div>' +
    '<div class="tfb" id="tf"></div>';
  setTimeout(function() { speak(v.en); }, 300);
  var done = false;
  function chk() {
    if (done) { adv(); return; }
    var ok = chkTyp($('ti').value, v);
    done = true;
    srsRecord(v.id, ok);
    if (ok) { S.ok++; $('ti').classList.add('ok'); $('tf').className = 'tfb ok'; $('tf').innerHTML = '✓ ' + t('correct') + ' — ' + meaning(v); }
    else { S.no++; $('ti').classList.add('no'); $('tf').className = 'tfb no'; $('tf').innerHTML = '✗ ' + t('wrongWas') + ' <strong>' + v.en + '</strong> — ' + meaning(v); }
    $('ts').textContent = t('next');
  }
  $('ts').onclick = chk;
  $('ti').onkeydown = function(e) { if (e.key === 'Enter') chk(); };
  setTimeout(function() { $('ti').focus(); }, 100);
}

// ═══ RESULT ═══
function showRes() {
  var tot = S.ok + S.no;
  var pct = tot ? Math.round(100 * S.ok / tot) : 0;
  var p = loadProgress();
  var td = new Date().toISOString().slice(0, 10);
  var isNewStreakDay = false;
  if (p._ld !== td) {
    var yd = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    p._streak = (p._ld === yd) ? (p._streak || 0) + 1 : 1;
    p._ld = td; saveProgress(p);
    isNewStreakDay = true;
  }
  var stk = p._streak || 1;
  var award = recordSession(S.mode, S.ok, S.no, isNewStreakDay);

  go('result');
  var badgesHtml = award.newBadges.length ?
    '<div class="new-badges">' + award.newBadges.map(function(b) {
      return '<div class="nb-card"><span class="nb-ic">' + b.ic + '</span>' + t('newBadge') + ' ' + bt(b.t) + '</div>';
    }).join('') + '</div>' : '';

  $('rarea').innerHTML =
    (stk >= 2 ? '<div class="strk">🔥 ' + stk + ' ' + t('streak') + '</div>' : '') +
    '<div class="rlbl">' + t('result') + '</div><div class="rscore">' + pct + '%</div>' +
    '<div class="rstats"><div><div class="rn">' + S.ok + '</div><div class="rl">' + t('right') + '</div></div>' +
    '<div><div class="rn">' + S.no + '</div><div class="rl">' + t('wrng') + '</div></div>' +
    '<div><div class="rn">' + tot + '</div><div class="rl">' + t('total') + '</div></div></div>' +
    '<div class="xp-row">+' + award.xpGained + ' XP</div>' +
    badgesHtml +
    '<div class="rbtns"><button class="bp" onclick="pickM(S.mode)">' + t('retry') + '</button>' +
    '<button class="bs" onclick="go(\'mode\')">' + t('diffMode') + '</button>' +
    '<button class="bs" onclick="goHome()">' + t('home') + '</button></div>';
  renderLevelPill();
}

// ═══ INIT ═══
function initApp() {
  $('home-btn').onclick = goHome;
  $('btn-en').onclick = function() { setLang('en'); };
  $('btn-de').onclick = function() { setLang('de'); };
  $('navtr').onclick = toggleNav;
  $('lvl-pill').onclick = function() { go('badges'); };
  $('start-btn').onclick = function() { go('pw'); };
  $('b-yr').onclick = function() { go('landing'); };
  $('b-un').onclick = function() { go('year'); };
  $('b-mo').onclick = function() { go('unit'); };
  $('b-le').onclick = function() { go('mode'); };
  $('b-li').onclick = function() { go('mode'); };
  $('b-bd').onclick = function() { goHome(); };
  $('pw-sub').onclick = checkPW;
  $('pw-in').onkeydown = function(e) { if (e.key === 'Enter') checkPW(); };
  $('reset-lnk').onclick = function(e) {
    e.preventDefault();
    if (confirm(t('resetQ'))) {
      localStorage.removeItem(PK); localStorage.removeItem(BK);
      alert(t('deleted'));
      renderLevelPill();
    }
  };

  document.addEventListener('click', function(e) {
    if (!e.target.closest('.navdd')) $('navdd').classList.remove('open');
  });

  renderYears();
  buildNav();
  renderLevelPill();
  console.log('GSIS Grundwortschatz: ' + V.length + ' words loaded.');
}

loadData().then(function() {
  $('app-loading').style.display = 'none';
  $('app-main').style.display = '';
  initApp();
}).catch(function(err) {
  $('app-loading').innerHTML = '<p>Could not load vocabulary data. Please check your connection and reload.</p>';
  console.error(err);
});
