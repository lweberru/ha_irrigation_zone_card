# Changelog

## Unveröffentlicht

- Niederländische Übersetzung (`language: nl`) für beide Karten und Editoren sowie `README.nl.md`.
- Alle Texte liegen jetzt in `src/i18n/`, eine Datei pro Sprache. Neue Sprachen brauchen nur eine Datei und einen Eintrag in `src/i18n/index.js`; Editor-Auswahl und Konfigurationsprüfung übernehmen sie automatisch. Fehlende Texte fallen auf Englisch zurück.
- Regionale HA-Sprachen wie `nl-BE` oder `de-CH` verwenden ihre Grundsprache.
- Neuer Logiktest stellt sicher, dass jede Sprache dieselben Schlüssel wie Englisch hat.

## 0.5.0 — 2026-10-24

- Neuer kompakter Bereich „Bewässerungsregeln“ für automatisch ausgewählte Zonen: Defizitschwelle, Mindestabstand mit Herkunft Zone/Global, Bodenfeuchte-Sperre und Laufzeitlimit.
- Von Smart Irrigation gemeldete zonenspezifische Sperren und Hinweise auf zentrale Schutzprüfungen; fehlende Schutzvorschau bleibt sichtbar unbekannt.
- Geteilte Systemabfragen mit der Übersichtskarte, Aktualisierung bei Konfigurationsänderungen und minütlich für die Schutzvorschau.
- Optional `show_rules: false`, auch im visuellen Editor. Deutsch/Englisch, mobile Darstellung und helle/dunkle Themes.
- 24 Logiktests und 23 Browserprüfungen. Keine Änderungen an Bewässerungseinstellungen oder Automationen.

## 0.4.0 — 2026-10-24

- Angewandte ET als kompakte, separat anklickbare Kennzahl bei der Wasserbilanz; Vorzeichen und Sensoreinheit bleiben erhalten.
- Auffälliger Hinweis für gemeldete Zonenprobleme mit übersetzten bekannten Ursachen und Detaildialog. Unbekannte oder fehlende Problemzustände erscheinen ausdrücklich als unbekannt.
- ET- und Problemsensor werden mit `zone` automatisch über stabile Kennungen gefunden. Neue optionale Felder `et_entity` und `problem_entity` im Editor und in YAML.
- Wert und Skala der Wasserbilanz öffnen den nativen HA-Sensordialog mit verfügbarem Verlauf; Diagrammsymbol und Tastaturbedienung.
- 21 Logiktests und 22 Browserprüfungen, einschließlich Live-Updates und sicherer Darstellung von Problemtexten.

## 0.3.0 — 2026-10-24

- Neue zentrale Karte **Irrigation Overview** (`custom:irrigation-overview-card`) in derselben HACS-Datei.
- Gesamtstatus, nächster Planzeitpunkt, Bedarf und Anzahl der bedürftigen Zonen; vorgemerkte Starts und reine Planung werden unterschieden.
- Eigener Frostbereich mit gemeldeter Temperatur, Frostgrenze, aktiver Sperre sowie ausgeschaltetem oder unbekanntem Schutz.
- Regenprognose, Regengrenze und weitere gemeldete Schutzprüfungen.
- Automatisch zugeordnete zentrale Aktionen für Berechnung und Wetter; Regenprognose-Sperre und Regengrenze, optional eigene Automation und Hauptventil.
- Visueller Editor, Deutsch/Englisch, HA-Zeitzone, helle/dunkle Themes und mobile Vorschau.
- 18 Logiktests und 18 Browserprüfungen; zentrale Zuordnung zusätzlich mit echten API-Antworten geprüft.

## 0.2.0 — 2026-10-24

- Neue Zonenauswahl: `zone` genügt, um Smart-Irrigation-Sensoren automatisch über stabile interne Kennungen zuzuordnen, auch nach Änderungen der Entity-IDs.
- Name, hinterlegter Bodenfeuchtesensor und verknüpftes Ventil werden aus der Zonenkonfiguration übernommen. Gemeinsam genutzte Ventile werden gekennzeichnet.
- Optionale manuelle Überschreibungen bleiben verfügbar; bestehende Konfigurationen ohne `zone` funktionieren weiter.
- Der Editor bietet eine Zonenliste und eingeklappte Überschreibungen. Zonenwechsel setzen vorherige Sensorzuordnungen und den Namen zurück.
- Gemeinsame Lesezugriffe, Aktualisierung bei Zonen-/Registry-Änderungen und Wiederverbindung sowie sichtbare Fehler bei fehlender Zuordnung.
- Zwölf Logiktests und zehn Browserprüfungen; Zuordnung zusätzlich mit echten Home-Assistant-API-Antworten geprüft.

## 0.1.0 — 2026-10-24

Erstes Release der Irrigation Zone Card für Home Assistant und HACS.

- Bodenfeuchte als Ring und Live-Wasserbilanz mit Defizit-/Vorratsskala.
- Berechnete Bewässerungsdauer und Wasserverbrauch mit Sensor-Einheiten.
- Optionales Zonenventil als `switch` oder `valve`, mit Bestätigung vor manuellem Öffnen und Fehleranzeige.
- Visueller Karteneditor, deutsche und englische Texte, helle und dunkle Themes sowie mobiles Layout.
- Fertige JavaScript-Datei ohne externe Laufzeitabhängigkeiten, Vorgarten-Beispiel und interaktive lokale Vorschau.
- Sieben Logiktests und sieben Browserprüfungen.

Manuelle Ventilsteuerung startet keinen Abschalttimer. Das Release ist zur Installation als benutzerdefiniertes HACS-Dashboard-Repository vorgesehen.
