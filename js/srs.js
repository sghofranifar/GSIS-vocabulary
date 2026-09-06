/* ═══════════════════════════════════════════════════════════════
   SPACED REPETITION
   Every practice mode (flashcards, matching, typing, listening)
   reports right/wrong per word here. Words are scheduled into a
   simple 5-box Leitner system:

     box 1 -> due again immediately (same session)
     box 2 -> due again after 1 day
     box 3 -> due again after 3 days
     box 4 -> due again after 7 days
     box 5 -> due again after 16 days   (= "mastered" for badges)

   A wrong answer always drops a word back to box 1.

   Session selection (pickSessionCards) then picks the SS words that
   are most in need of review for the chosen year+unit — due words
   first, weakest (lowest box) first — instead of a pure random pick.
   This is what makes it "real" spaced repetition rather than a
   progress counter nobody reads.
   ═══════════════════════════════════════════════════════════════ */

var PK = 'gsis-vok-v5';
var BOX_INTERVAL_DAYS = [0, 0, 1, 3, 7, 16]; // index = box (1..5)
var MASTER_BOX = 5;

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(PK)) || {}; } catch (e) { return {}; }
}
function saveProgress(p) {
  try { localStorage.setItem(PK, JSON.stringify(p)); } catch (e) {}
}

// Record the result of one word in one practice attempt (any mode).
function srsRecord(id, correct) {
  var p = loadProgress();
  var e = p[id] || { box: 1, due: 0 };
  if (correct) {
    e.box = Math.min(e.box + 1, MASTER_BOX);
  } else {
    e.box = 1;
  }
  e.due = Date.now() + BOX_INTERVAL_DAYS[e.box] * 86400000;
  p[id] = e;
  saveProgress(p);
  return e.box;
}

function srsEntry(id, p) {
  return (p || loadProgress())[id] || { box: 0, due: 0 };
}

function srsIsMastered(id, p) {
  return srsEntry(id, p).box >= MASTER_BOX;
}

function shuffle(a) {
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
  }
  return a;
}

// Pick `count` words out of `pool` for a practice session, prioritising
// words that are due for review (never-seen words count as due), then
// the weakest box first. Falls back to random not-yet-due words if the
// unit doesn't have enough due words to fill a session.
function pickSessionCards(pool, count) {
  var p = loadProgress();
  var now = Date.now();
  var due = [], notDue = [];
  pool.forEach(function(v) {
    var e = p[v.id];
    if (!e || e.due <= now) due.push(v); else notDue.push(v);
  });
  due.sort(function(a, b) {
    var ba = (p[a.id] || { box: 0 }).box, bb = (p[b.id] || { box: 0 }).box;
    if (ba !== bb) return ba - bb; // weakest (lowest box) first
    return (p[a.id] ? p[a.id].due : 0) - (p[b.id] ? p[b.id].due : 0); // most overdue first
  });
  // small shuffle within same-box groups so it's not robotically identical every time
  var grouped = {};
  due.forEach(function(v) { var b = (p[v.id] || { box: 0 }).box; (grouped[b] = grouped[b] || []).push(v); });
  var ordered = [];
  Object.keys(grouped).sort(function(a, b) { return a - b; }).forEach(function(b) {
    ordered = ordered.concat(shuffle(grouped[b]));
  });

  var picked = ordered.slice(0, count);
  if (picked.length < count) {
    picked = picked.concat(shuffle(notDue.slice()).slice(0, count - picked.length));
  }
  return shuffle(picked);
}
