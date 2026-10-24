# Irrigation Zone Card

Eine Home-Assistant-Dashboardkarte für **eine Smart-Irrigation-Zone**. Bodenfeuchte als Ring, Wasserbilanz mit Nullpunkt, berechnete Bewässerungsdauer und Wasserverbrauch in einer ruhigen, kompakten Gartenoptik. Optional mit manuellem Zonenventil (`switch.*` oder `valve.*`).

![Kartenvorschau](docs/preview-light.png)

## Installation

### HACS

Die aktuelle Version ist auf der [Release-Seite](https://github.com/lweberru/ha_irrigation_zone_card/releases/latest) verfügbar.

1. In HACS unter **Benutzerdefinierte Repositories** `https://github.com/lweberru/ha_irrigation_zone_card` hinzufügen, Typ **Dashboard**.
2. **Irrigation Zone Card** herunterladen.
3. Falls HACS die Ressource nicht automatisch einträgt: unter **Einstellungen → Dashboards → Ressourcen** `/hacsfiles/ha_irrigation_zone_card/ha_irrigation_zone_card.js` als **JavaScript-Modul** hinzufügen. Ressourcen sind im erweiterten Benutzermodus sichtbar.
4. Browser neu laden. Im Kartenwähler nach **Irrigation Zone** suchen oder die YAML-Konfiguration unten verwenden.

Das Repository liefert die fertige Einzeldatei in `dist/ha_irrigation_zone_card.js`; Home Assistant benötigt weder npm noch zusätzliche Karten. Dateiname und Repo-Struktur folgen den [HACS-Anforderungen](https://www.hacs.xyz/docs/publish/plugin/). Dies ist ein Custom Repository, keine Aufnahme in den HACS-Standardkatalog.

### Manuell / lokale Entwicklung

`dist/ha_irrigation_zone_card.js` nach `<HA-Konfigurationsordner>/www/ha_irrigation_zone_card.js` kopieren und `/local/ha_irrigation_zone_card.js?v=0.1.0` als JavaScript-Modul in den Dashboard-Ressourcen registrieren. Bei Updates den Versionsparameter ändern und den Browser neu laden. Keine `.storage`-Dateien bearbeiten.

## Beispiel: Vorgarten

```yaml
type: custom:irrigation-zone-card
name: Vorgarten
entity: sensor.smart_irrigation_vorgarten
irrigation_needed_entity: binary_sensor.smart_irrigation_vorgarten_irrigation_needed
bucket_entity: sensor.smart_irrigation_vorgarten_live_bucket
water_used_entity: sensor.smart_irrigation_vorgarten_water_used
moisture_entity: sensor.vorgarten_pflanzen_vorgarten_bodenfeuchtigkeit
```

Die Sensor-IDs im Beispiel an die eigene Zone anpassen. Optional eine Ventil-Entität ergänzen:

```yaml
valve_entity: switch.mein_zonenventil # alternativ valve.mein_zonenventil
show_control: true
confirm_open: true
```

Alle Felder sind im visuellen Karteneditor bearbeitbar. Der Kartenwähler sucht als Vorschlag einen Smart-Irrigation-Dauersensor und vorhandene Begleitsensoren. Bodenfeuchte und Ventil werden manuell zugeordnet.

## Optionen

| Feld | Standard | Bedeutung |
| --- | --- | --- |
| `entity` | erforderlich | Smart-Irrigation-Dauersensor |
| `name` | Anzeigename des Sensors | Name der Zone |
| `icon` | `mdi:sprinkler-variant` | Symbol im Kopf |
| `irrigation_needed_entity` | optional | `binary_sensor`: `on` = Bedarf, `off` = kein Bedarf |
| `bucket_entity` | optional | Live-Wasserbilanz-Sensor; bei Weglassen entfällt die Anzeige |
| `moisture_entity` | optional | Bodenfeuchte; Ringfüllung nur bei Einheit `%` |
| `water_used_entity` | optional | Verbrauchssensor mit dessen Einheit und Bezugszeitraum |
| `valve_entity` | optional | `switch.*` oder `valve.*` |
| `show_control` | `true` | Manuelle Schaltfläche am Ventil anzeigen |
| `confirm_open` | `true` | Bestätigung vor manuellem Öffnen |
| `bucket_min` | negatives Skalenmaximum | Linkes Skalenende, kleiner als 0 |
| `bucket_max` | `maximum_bucket` am Dauersensor, sonst `25` | Rechtes Skalenende, größer als 0, in der Einheit der Wasserbilanz |
| `language` | `auto` | `auto`, `de` oder `en`; andere HA-Sprachen erhalten englische Texte |

Zahlen verwenden die Home-Assistant-Benutzersprache. Helle/dunkle Themes und reduzierte Bewegung werden berücksichtigt. In Sections-Ansichten belegt die Karte standardmäßig 12 Spalten und automatische Höhe; die Breite ist über das HA-Layout anpassbar. Werte lassen sich über die Dauer-, Verbrauchs- und Bodenfeuchteflächen im HA-Detaildialog öffnen.

### Bedeutung der Anzeigen

- **Wasserbilanz:** Der Nullpunkt trennt Defizit (negativ) und Vorrat (positiv). Der Marker wird auf die Skala begrenzt, der Zahlenwert bleibt unverändert. Die Bilanz ist keine gemessene Bodenfeuchte. `bucket_min`/`bucket_max` ändern nur die Visualisierung, keine Bewässerungseinstellungen. Skala und Sensor müssen dieselbe Einheit verwenden; die Karte rechnet keine Längenmaße um.
- **Bodenfeuchte:** Der Ring zeigt den Sensorwert, ohne pauschale Gut-/Schlecht-Grenzen für unterschiedliche Böden zu erfinden. Außerhalb 0–100 % wird nur die Ringfüllung begrenzt. Andere Einheiten werden als Zahl ohne Füllung angezeigt.
- **Dauer:** Berechnete Empfehlung, kein Countdown. Sekunden, Minuten und Stunden werden lesbar formatiert; unbekannte Einheiten bleiben erhalten.
- **Wasserverbrauch:** Der Wert des Sensors, kein errechneter Tagesverbrauch. Den Bezugszeitraum bestimmt die verwendete Entität.
- **Status:** Ein aktives oder bewegtes Ventil hat Vorrang, danach gilt der Bedarfssensor. Ohne bekannten Bedarf zeigt die Karte „Wasserbedarf unbekannt“. „Ventil aktiv“ zeigt den gemeldeten Ventilzustand, keinen gemessenen Wasserfluss.
- **Fehlende Daten:** `unknown`, `unavailable` und fehlende Entitäten erscheinen als `—` mit Hinweis. Sie werden nicht in 0 umgewandelt.

### Ventilsteuerung

Die Karte ruft `switch.turn_on`/`switch.turn_off` beziehungsweise `valve.open_valve`/`valve.close_valve` für genau die konfigurierte Entität auf. Bei Valves berücksichtigt sie die gemeldeten OPEN-/CLOSE-Funktionen. Bei unbekanntem Zustand oder bewegtem Ventil ist die Schaltfläche deaktiviert. Fehler werden in der Karte angezeigt; der Zustand kommt weiter von Home Assistant.

**Manuelles Öffnen startet keinen Abschalttimer und keine Smart-Irrigation-Automation.** Ein geöffnetes Ventil muss manuell oder durch eine bestehende Automation geschlossen werden. Daher gibt es standardmäßig eine Bestätigung beim Öffnen. Schließen ist direkt möglich. Mit `show_control: false` wird nur der Zustand dargestellt. Die Karte schreibt keine Smart-Irrigation-Bilanz zurück und verändert keine Automationen.

## Entwicklung und Vorschau

Node.js 22 oder neuer:

```bash
npm ci
npm run build
npm run dev
# http://localhost:5173
```

Die lokale Vorschau zeigt drei Zonen mit **Beispieldaten**, darunter die bei der Entwicklung gelesenen Vorgartenwerte (3,52 mm, 100 %, 0 s). Buttons simulieren Zustandswechsel im Browser. Es werden keine Home-Assistant-Zugangsdaten benötigt und keine realen Ventile geschaltet. Symbole in der Vorschau sind lokale Platzhalter; im Dashboard zeichnet Home Assistant seine eigenen MDI-Icons. Der visuelle Editor verwendet das native `ha-form` und wird in Home Assistant dargestellt.

```bash
npx playwright install chromium
npm run check
```

Prüft Konfiguration, Einheiten, Statuslogik, Skalen und Aktoraktionen sowie Darstellung, Bestätigungsdialog, Serviceaufrufe, Fehler, HTML-Escaping, Detaildialog-Ereignis, Editor-Konfigurationsereignis und mobile Breite im Browser. Screenshots unter `test-results/`. Die Browserprüfungen verwenden simulierte HA-Objekte; eine Prüfung im echten HA-Frontend bleibt für eine Installation erforderlich.

`src/` enthält den Quellcode; `dist/` wird mit eingecheckt, damit HACS auch ohne GitHub-Release installieren kann. Nach Änderungen `npm run build` ausführen. Der Build enthält alle Laufzeitdateien ohne CDN-Abhängigkeiten. CI prüft auch, dass der Distributable aktuell ist. GitHub-Veröffentlichung und Installation auf einem HA-System sind separate Schritte.

## Referenzen

- [Home Assistant: Custom Cards](https://contributors.home-assistant.io/frontend/custom-ui/card/)
- [Home Assistant: Editor und Kartenwähler](https://contributors.home-assistant.io/frontend/custom-ui/card-editor/)
- [Home Assistant: Valve-Zustände und Aktionen](https://www.home-assistant.io/integrations/valve/)
- [HACS: Dashboard-Repository](https://www.hacs.xyz/docs/publish/plugin/)

MIT-Lizenz.
