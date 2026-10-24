# Changelog

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
