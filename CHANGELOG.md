# Changelog

## 0.7.2 — 2026-11-06

- Explain zero calculated duration beside disabled native watering buttons in German and English; enable them again when demand changes.
- Use committed eligible-zone durations for the global action rather than estimated or weather-adjusted planning previews. Unknown data is not treated as zero.
- 34 logic tests and 37 browser checks, including zero-duration no-dispatch and live recovery in both cards.

## 0.7.1 — 2026-11-06

- Distinguish disabled native control, unknown configuration, missing native buttons, and unavailable configured buttons in both cards.
- When native control is already enabled, explain that missing buttons require integration setup/reload instead of incorrectly asking users to enable it again.
- 31 logic tests and 35 browser checks, including the enabled-with-missing-button regression.

## 0.7.0 — 2026-11-06

- Add a native Smart Irrigation direct-control switch to the overview. It changes only the integration setting, confirms enabling and reads back the result; it is explicitly not an emergency stop. Optional `show_native_control` and `confirm_native`.
- Add independent `show_control` / `show_irrigate` options in both cards. Native watering requests the integration's zone/global button, never a local automation or raw valve fallback. Native runs require direct control and an available button.
- Discover native buttons through stable registry IDs; support optional `irrigate_entity` and `confirm_irrigate`. Explain disabled actions, preserve errors, and provide visual-editor fields in English and German.
- Allow an optional external automation label (`automation_name`). A paused external helper no longer overrides native integration planning status.
- Document complementary upstream main-valve automations and setup-only native button availability. 30 logic tests and 34 browser checks.

## 0.6.0 — 2026-11-04

- Move automation and main valve controls to the top of the overview card. The paused automation is directly clickable; the main valve opens/closes without a more-info dialog. Remove their duplicate lower settings rows.
- Integrate zone valve controls next to the demand status, above the readings, and remove the separate bottom row.
- Direct main valve actions support switches and valves, honor capabilities/moving states, show service errors, and confirm opening by default (`confirm_open`). Read-only controls remain available through `show_actions: false` / `show_control: false`.
- Clarify that the card starts no timer of its own; external safety automations/device timers still apply. Document where to configure automatic shutoff in English and German.
- 25 logic tests and 26 browser checks, including direct routing, cancellation, errors, top placement, and responsive layouts.

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
