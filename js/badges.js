/* ═══════════════════════════════════════════════════════════════
   BADGES & LEVELS
   Since the app has no login (see README, "Why no accounts"),
   progress can't be seen by teachers — but students can still get
   motivating feedback on THEIR device: XP, a level, and a fixed set
   of badges for milestones. All stored locally, same privacy model
   as before (nothing leaves the device).
   ═══════════════════════════════════════════════════════════════ */

var BK = 'gsis-badges-v1';

var BADGES = [
  { id: 'first_session', ic: '🌱', t: { en: 'First Steps', de: 'Erster Schritt' }, d: { en: 'Complete your first practice round', de: 'Schließe deine erste Übungsrunde ab' } },
  { id: 'sessions_10', ic: '📚', t: { en: 'Getting Started', de: 'Fleißig dabei' }, d: { en: 'Complete 10 practice rounds', de: '10 Übungsrunden abgeschlossen' } },
  { id: 'sessions_50', ic: '🏆', t: { en: 'Dedicated Learner', de: 'Übungsprofi' }, d: { en: 'Complete 50 practice rounds', de: '50 Übungsrunden abgeschlossen' } },
  { id: 'streak_3', ic: '🔥', t: { en: '3-Day Streak', de: '3 Tage in Folge' }, d: { en: 'Practise 3 days in a row', de: 'An 3 Tagen in Folge geübt' } },
  { id: 'streak_7', ic: '🔥', t: { en: '7-Day Streak', de: '7 Tage in Folge' }, d: { en: 'Practise 7 days in a row', de: 'An 7 Tagen in Folge geübt' } },
  { id: 'streak_30', ic: '⚡', t: { en: '30-Day Streak', de: '30 Tage in Folge' }, d: { en: 'Practise 30 days in a row', de: 'An 30 Tagen in Folge geübt' } },
  { id: 'perfect_round', ic: '🎯', t: { en: 'Perfect Round', de: 'Perfekte Runde' }, d: { en: 'Score 100% in one round', de: '100 % in einer Runde erreicht' } },
  { id: 'perfect_10', ic: '💎', t: { en: 'Perfectionist', de: 'Perfektionist:in' }, d: { en: 'Score 100% in 10 rounds', de: '10-mal 100 % erreicht' } },
  { id: 'words_50', ic: '🌟', t: { en: '50 Words Mastered', de: '50 Wörter gemeistert' }, d: { en: 'Fully master 50 words', de: '50 Wörter vollständig gemeistert' } },
  { id: 'words_200', ic: '✨', t: { en: '200 Words Mastered', de: '200 Wörter gemeistert' }, d: { en: 'Fully master 200 words', de: '200 Wörter vollständig gemeistert' } },
  { id: 'words_500', ic: '👑', t: { en: '500 Words Mastered', de: '500 Wörter gemeistert' }, d: { en: 'Fully master 500 words', de: '500 Wörter vollständig gemeistert' } },
  { id: 'all_modes', ic: '🎮', t: { en: 'All-Rounder', de: 'Allrounder' }, d: { en: 'Try all 4 practice modes', de: 'Alle 4 Übungsmodi ausprobiert' } },
  { id: 'unit_master', ic: '🗺️', t: { en: 'Unit Master', de: 'Einheiten-Meister:in' }, d: { en: 'Fully master an entire unit', de: 'Eine ganze Einheit gemeistert' } },
  { id: 'year_master', ic: '🎓', t: { en: 'Year Champion', de: 'Jahrgangs-Champion' }, d: { en: 'Fully master an entire year', de: 'Einen ganzen Jahrgang gemeistert' } }
];

function loadBadgeData() {
  try {
    var d = JSON.parse(localStorage.getItem(BK));
    if (d) return d;
  } catch (e) {}
  return { xp: 0, badges: [], sessions: 0, perfect: 0, modesUsed: [] };
}
function saveBadgeData(d) {
  try { localStorage.setItem(BK, JSON.stringify(d)); } catch (e) {}
}

function levelFromXP(xp) { return Math.floor(1 + Math.sqrt(xp / 40)); }
function xpForLevel(lvl) { return Math.pow(lvl - 1, 2) * 40; }
function levelProgress(xp) {
  var lvl = levelFromXP(xp);
  var cur = xpForLevel(lvl), next = xpForLevel(lvl + 1);
  return { lvl: lvl, pct: Math.max(0, Math.min(100, Math.round(100 * (xp - cur) / (next - cur)))) };
}

function countMasteredWords(filterFn) {
  var p = loadProgress();
  var n = 0;
  V.forEach(function(v) { if (filterFn(v) && srsIsMastered(v.id, p)) n++; });
  return n;
}

// Call once when a practice round finishes. Updates XP/streak-linked
// badges and returns { xpGained, newBadges } for the result screen.
function recordSession(mode, ok, no, isNewStreakDay) {
  var d = loadBadgeData();
  var total = ok + no;
  var perfect = total > 0 && no === 0;
  var xpGained = ok * 10 + (perfect ? 20 : 0) + (isNewStreakDay ? 15 : 0);

  d.xp += xpGained;
  d.sessions += 1;
  if (perfect) d.perfect += 1;
  if (d.modesUsed.indexOf(mode) === -1) d.modesUsed.push(mode);

  var p = loadProgress();
  var stk = p._streak || 0;
  var wordsMastered = countMasteredWords(function() { return true; });
  var unitMastered = S.jg && S.unit && getV(S.jg, S.unit).length > 0 &&
    getV(S.jg, S.unit).every(function(v) { return srsIsMastered(v.id, p); });
  var yearMastered = S.jg && V.filter(function(v) { return v.jahrgang === S.jg; }).length > 0 &&
    V.filter(function(v) { return v.jahrgang === S.jg; }).every(function(v) { return srsIsMastered(v.id, p); });

  var have = function(id) { return d.badges.indexOf(id) !== -1; };
  var earn = function(id) { if (!have(id)) d.badges.push(id); };

  var checks = {
    first_session: d.sessions >= 1,
    sessions_10: d.sessions >= 10,
    sessions_50: d.sessions >= 50,
    streak_3: stk >= 3,
    streak_7: stk >= 7,
    streak_30: stk >= 30,
    perfect_round: perfect,
    perfect_10: d.perfect >= 10,
    words_50: wordsMastered >= 50,
    words_200: wordsMastered >= 200,
    words_500: wordsMastered >= 500,
    all_modes: d.modesUsed.length >= 4,
    unit_master: unitMastered,
    year_master: yearMastered
  };

  var newBadges = [];
  Object.keys(checks).forEach(function(id) {
    if (checks[id] && !have(id)) { earn(id); newBadges.push(id); }
  });

  saveBadgeData(d);
  return { xpGained: xpGained, newBadges: newBadges.map(function(id) {
    return BADGES.filter(function(b) { return b.id === id; })[0];
  }) };
}

function bt(x) { return x[LANG] || x.en; }

function renderLevelPill() {
  var el = $('lvl-pill');
  if (!el) return;
  var d = loadBadgeData();
  var lp = levelProgress(d.xp);
  el.innerHTML =
    '<span class="lvl-badge">' + lp.lvl + '</span>' +
    '<span class="lvl-num">Lvl ' + lp.lvl + '</span>' +
    '<span class="lvl-track"><span class="lvl-fill" style="width:' + lp.pct + '%"></span></span>';
}

function renderBadgesScreen() {
  var d = loadBadgeData();
  var lp = levelProgress(d.xp);
  var nextXp = xpForLevel(lp.lvl + 1);
  $('lvl-hero').innerHTML =
    '<div class="lvl-badge">' + lp.lvl + '</div>' +
    '<div class="lvl-hero-num">' + t('level') + ' ' + lp.lvl + ' &middot; ' + d.xp + ' XP</div>' +
    '<div class="lvl-track"><span class="lvl-fill" style="width:' + lp.pct + '%"></span></div>' +
    '<div class="lvl-hero-sub">' + (nextXp - d.xp) + ' XP ' + t('toNextLevel') + '</div>';

  var html = '';
  BADGES.forEach(function(b) {
    var on = d.badges.indexOf(b.id) !== -1;
    html += '<div class="bcard ' + (on ? 'on' : 'off') + '">' +
      '<div class="bic">' + b.ic + '</div>' +
      '<div class="btt">' + bt(b.t) + '</div>' +
      '<div class="bde">' + bt(b.d) + '</div>' +
      '</div>';
  });
  $('bgrid').innerHTML = html;
}
