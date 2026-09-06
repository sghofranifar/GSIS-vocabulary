/* ═══════════════════════════════════════════════════════════════
   DATA LOADER
   Loads the vocabulary from data/vocab-{5..9}.json (one file per
   Jahrgang) plus data/themes.json (unit -> display name) and builds
   the flat word list V that the rest of the app works with.

   Why split like this: each Jahrgang lives in its own small,
   human-readable JSON file. To add or correct a word, open the file
   for that Jahrgang and edit the one object — no need to touch code.
   See README.md for the full editing guide.
   ═══════════════════════════════════════════════════════════════ */

var GRADES = [5, 6, 7, 8, 9];
var V = [];
var THEMES = {};

function loadData() {
  return fetch('data/themes.json')
    .then(function(r) { return r.json(); })
    .then(function(themes) {
      THEMES = themes;
      return Promise.all(GRADES.map(function(g) {
        return fetch('data/vocab-' + g + '.json')
          .then(function(r) { return r.json(); })
          .then(function(list) {
            list.forEach(function(v) {
              v.jahrgang = g;
              v.theme = THEMES[g + '-' + v.unit] || v.unit;
              if (!v.tags) v.tags = [];
            });
            return list;
          });
      }));
    })
    .then(function(lists) {
      V = [];
      lists.forEach(function(list) { V = V.concat(list); });
    });
}
