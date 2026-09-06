# GSIS Grundwortschatz

Vokabeltrainer für den Englisch-Grundwortschatz des Deutschen Stroms an der GSIS (Klasse 5–9), basierend auf der Green-Line-Reihe. Läuft komplett im Browser, keine Anmeldung, keine Serverkosten.

## Projektstruktur

```
index.html          Grundgerüst der Seite
css/style.css        Gesamtes Design
js/
  data.js            Lädt die Vokabeldateien
  srs.js             Spaced-Repetition-Logik (welches Wort kommt wann dran)
  badges.js          Level & Abzeichen
  app.js             Übungsmodi, Navigation, Übersetzungen (EN/DE der Oberfläche)
data/
  vocab-5.json … vocab-9.json   Die eigentlichen Vokabeln, eine Datei pro Klassenstufe
  themes.json        Anzeigenamen der Units (z. B. "GRS" -> "Greetings & Basics")
assets/              Logo-Bilder
```

Der wichtigste Punkt für die Fachschaft: **Vokabeln ändern heißt nur, eine JSON-Datei in `data/` zu bearbeiten** – kein Programmieren nötig, kein Durchsuchen von Code.

## Vokabeln bearbeiten oder ergänzen

Jede Datei `data/vocab-<Klasse>.json` enthält eine Liste von Wort-Objekten. Ein Eintrag sieht so aus:

```json
{
  "id": "jg5-grs-hello-b5d4d8",
  "unit": "GRS",
  "sub": "CI",
  "en": "Hello.",
  "de": ["Hallo."],
  "def": "a friendly word you say when you meet someone",
  "tags": [],
  "phrase": true
}
```

| Feld | Bedeutung |
|---|---|
| `id` | Eindeutige Kennung. Bei neuen Wörtern: nach demselben Muster selbst vergeben (klein geschrieben, Bindestriche, muss einmalig sein) oder einfach eine neue eindeutige Zeichenkette erfinden. |
| `unit` | Kürzel der Unit (z. B. `U1`, `AC2`). Muss zu einem Eintrag in `themes.json` passen, sonst wird nur das Kürzel angezeigt. |
| `sub` | Optionaler Hinweis, aus welchem Buchabschnitt das Wort stammt (aktuell nicht in der Oberfläche sichtbar – Rohdaten für später). |
| `en` | Das englische Wort oder die Redewendung, die gelernt werden soll. |
| `de` | Liste möglicher deutscher Übersetzungen (mehrere sind erlaubt, z. B. bei Synonymen). |
| `def` | Kurze **englische** Definition (8–15 Wörter), wird im EN-Modus statt der deutschen Übersetzung angezeigt. Muss die tatsächliche Bedeutung dieses Eintrags treffen – siehe Warnhinweis unten. |
| `tags` | Grammatik-Hinweise, z. B. `"pl"` (Plural), `"AE"` (amerikanisches Englisch), `"infml"` (umgangssprachlich). Meist leer `[]`. |
| `phrase` | `true`, wenn `en` ein ganzer Satz/Ausdruck ist (z. B. "What's your name?"), sonst `false`. |

**Ein Wort korrigieren:** die passende Datei öffnen, den Eintrag über die Suche (Strg+F) nach dem englischen Wort finden, Feld ändern, speichern.

**Ein Wort hinzufügen:** einen neuen Eintrag nach diesem Muster ans Ende der passenden `unit`-Gruppe einfügen (auf Kommas zwischen Objekten achten – ein JSON-Validator wie [jsonlint.com](https://jsonlint.com) hilft, Tippfehler zu finden, bevor man committet).

**Eine neue Unit oder ein neues Theme anlegen:** in `data/themes.json` einen Eintrag `"<Klasse>-<Unit>": "Anzeigename"` ergänzen.

⚠️ **Wichtig bei `def` (der KI-generierten Definition):** Die ursprüngliche Beta-Version hatte hier einen ernsten Fehler – Definitionen wurden über ein fehlerhaftes Muster-Matching erzeugt und trafen oft ein anderes Wort als gemeint (z. B. bekam "What's your name?" die Definition von "your"). Alle rund 4.169 Definitionen wurden deshalb komplett neu geschrieben, jede einzeln passend zur `de`-Übersetzung. Beim manuellen Ergänzen neuer Wörter bitte darauf achten, dass `def` wirklich die Bedeutung *dieses* Eintrags beschreibt (bei Phrasen: die Bedeutung der ganzen Phrase, nicht eines einzelnen Wortes darin).

## Lokal testen

Die Seite lädt ihre Daten per `fetch()` aus den JSON-Dateien – das funktioniert nur über `http(s)`, **nicht** durch Doppelklick auf `index.html` (der Browser blockiert `fetch` bei lokal geöffneten Dateien aus Sicherheitsgründen).

Im Projektordner einen kleinen lokalen Server starten:

```
python3 -m http.server 8080
```

Dann im Browser `http://localhost:8080` öffnen. Zugangscode: `learnvocab`.

## Veröffentlichen (GitHub Pages)

1. Im GitHub-Repository unter **Settings → Pages** als Quelle den Branch wählen, von dem veröffentlicht werden soll, und als Ordner `/ (root)`.
2. Nach ein paar Minuten ist die Seite unter der von GitHub angezeigten Adresse erreichbar.
3. Jede Änderung, die auf diesen Branch gepusht wird, aktualisiert die veröffentlichte Seite automatisch.

## Zugangscode

Der Zugangscode (`learnvocab`, in `js/app.js`) ist **kein echter Schutz** – er steht im Klartext im öffentlich einsehbaren Quellcode und hält nur zufällige Besucher fern, keine gezielten Zugriffe. Das ist bewusst so belassen worden (einfacher Betrieb ohne Login-System). Für echten Zugriffsschutz pro Klasse/Schüler wäre ein Login-System mit Server nötig.

## Spaced Repetition (wie die App entscheidet, welches Wort dran ist)

Jedes Wort hat pro Gerät einen Lernstatus (`box` 1–5, `due`-Datum) in `localStorage`. Bei jeder Antwort in jedem Übungsmodus wird dieser Status aktualisiert (`js/srs.js`):

- Richtig beantwortet → eine Box höher, größerer Abstand bis zur nächsten Abfrage (1 → 3 → 7 → 16 Tage).
- Falsch beantwortet → zurück auf Box 1, kommt bald wieder dran.

Bei jeder neuen Übungsrunde werden zuerst fällige und schwache Wörter ausgewählt, erst danach werden Lücken mit noch nicht fälligen Wörtern aufgefüllt. Das war in der Beta-Version nur als Anzeige vorhanden, wurde aber nie tatsächlich zur Auswahl genutzt – das ist jetzt behoben.

## Level & Abzeichen

Da es (bewusst) kein Login gibt, können Lehrkräfte den Fortschritt nicht einsehen. Um Schüler:innen trotzdem sichtbares Feedback zu geben, sammeln sie auf ihrem eigenen Gerät XP, Level und Abzeichen (`js/badges.js`) – z. B. für Streaks, gemeisterte Wörter oder perfekte Runden. Alles bleibt lokal, nichts wird übertragen.

## Bereits behobene Datenfehler (zur Info)

Beim Umbau kamen zwei getrennte Fehler in den Originaldaten ans Licht:

1. **Die KI-Definitionen (`def`)** – wie oben beschrieben, alle 4.169 neu erzeugt.
2. **Rund 30 deutsche Übersetzungen (`de`)** waren durch einen Fehler bei der ursprünglichen Dateneingabe verschoben oder abgeschnitten (z. B. bekam "cheese" die Übersetzung "oder Müsli)", die eigentlich zu "cereal" gehörte; "haggis" war mitten im Wort abgeschnitten). Diese wurden anhand des Kontexts rekonstruiert und korrigiert.

Bei folgenden 4 Einträgen in Jahrgang 9 (Unit U2/U3) war die ursprüngliche Übersetzung so beschädigt, dass sie nicht mehr rekonstruierbar war. Sie wurden mit einer allgemein korrekten Standardübersetzung ersetzt – **bitte bei Gelegenheit gegen das Green-Line-Buch prüfen**, falls dort ein spezifischerer Begriff verwendet wird:

- `jg9-u2-testimonial-8c4626` ("testimonial") → aktuell "Zeugnis, Referenzschreiben"
- `jg9-u2-wisdom-b46773` ("wisdom") → aktuell "Weisheit"
- `jg9-u2-satisfaction-543583` ("satisfaction") → aktuell "Zufriedenheit"
- `jg9-u3-to-approve-a9c732` ("to approve") → aktuell "genehmigen, billigen"

## Ideen für später

- Das `sub`-Feld (Buchabschnitt) ist in den Daten vorhanden, wird aber in der Oberfläche noch nicht genutzt – ließe sich für feineres Üben einsetzen ("nur Übung 2").
- Eine optionale, freiwillige Rückmeldung des Fortschritts an die Lehrkraft (z. B. per Klassencode) wäre ein größerer Umbau (bräuchte einen einfachen Server) und wurde bewusst zurückgestellt, solange kein Login gewünscht ist.
