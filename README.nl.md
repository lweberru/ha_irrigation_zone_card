# Irrigation Zone Card

[English](README.md) | [Deutsch](README.de.md) | **Nederlands**

Een dashboardkaart voor Home Assistant voor **één Smart Irrigation-zone**. Een bodemvochtring, waterbalans met nulpunt, berekende beregeningsduur en waterverbruik in een rustig, compact tuinontwerp. Met een optionele zoneklep (`switch.*` of `valve.*`) krijg je handmatige bediening.

Sinds v0.3.0 bevat dezelfde HACS-installatie ook **Irrigation Overview**, een centrale kaart voor planning, regen- en vorstbeveiliging en acties voor de hele integratie.

![Voorbeeld van de zonekaart](docs/preview-light.png)

De schermafbeeldingen tonen de Duitse interface. Beide kaarten ondersteunen Engels, Duits en Nederlands en volgen standaard de taal van Home Assistant. Met `language: nl` kies je expliciet Nederlands.

## Installatie

### HACS

De actuele versie staat op de [releasepagina](https://github.com/lweberru/ha_irrigation_zone_card/releases/latest).

1. Voeg in HACS onder **Custom repositories** `https://github.com/lweberru/ha_irrigation_zone_card` toe, met type **Dashboard**.
2. Download **Irrigation Zone Card**.
3. Als HACS de resource niet automatisch registreert, voeg dan `/hacsfiles/ha_irrigation_zone_card/ha_irrigation_zone_card.js` toe als **JavaScript-module** onder **Instellingen → Dashboards → Resources**. Resources zijn zichtbaar als de geavanceerde modus in je gebruikersprofiel aan staat.
4. Herlaad de browser. Zoek **Irrigation Zone** in de kaartkiezer of gebruik de YAML-configuratie hieronder.

De repository levert de kant-en-klare bundel in `dist/ha_irrigation_zone_card.js`; Home Assistant heeft geen npm of extra kaarten nodig. Bestandsnaam en opbouw van de repository volgen de [HACS-vereisten](https://www.hacs.xyz/docs/publish/plugin/). Dit is een custom repository; hij staat niet in de standaardcatalogus van HACS.

### Handmatige installatie / lokale ontwikkeling

Kopieer `dist/ha_irrigation_zone_card.js` naar `<HA-configuratiemap>/www/ha_irrigation_zone_card.js` en registreer `/local/ha_irrigation_zone_card.js?v=0.5.0` als JavaScript-module in de dashboardresources. Pas bij een update de versieparameter aan en herlaad de browser. Bewerk geen `.storage`-bestanden.

## Centrale kaart: Irrigation Overview

![Centrale planning, regen- en vorstbeveiliging](docs/overview-light.png)

Herlaad na de update via HACS de browser en kies **Irrigation Overview** in de kaartkiezer. Voor automatisch koppelen is alleen dit nodig:

```yaml
type: custom:irrigation-overview-card
```

De kaart toont centrale gegevens uit Smart Irrigation:

- Algemene status en de volgende geplande start, met onderscheid tussen een ingeplande start en een start die niet is ingepland.
- Berekende of voorspelde totale behoefte en het aantal zones met behoefte, zonder de lijsten per zone te herhalen.
- **Een eigen vorstbeveiligingsdeel:** gemelde temperatuur en vorstgrens in de eenheden van de integratie, een actieve vorstblokkade, uitgeschakelde beveiliging of een ontbrekende meting.
- Regenverwachting voor de gemelde periode vergeleken met de regengrens; andere actieve controles zoals regensensor, wind, minimaal beregeningsinterval en bodemvocht.
- Weerbron en automatische berekening, inclusief het tijdstip van berekenen.
- **Alles berekenen** en **Weer bijwerken** via de ingebouwde globale knopentiteiten. De schakelaar voor de blokkade bij regenverwachting en de regengrens worden ook automatisch gevonden via stabiele interne kenmerken.

Een eigen automatisering en een hoofdklep zijn optioneel. Kies hun echte entiteit-ID's in de editor:

```yaml
type: custom:irrigation-overview-card
name: Tuinbediening
automation_entity: automation.mijn_beregening
main_valve_entity: switch.mijn_hoofdklep
```

De kaart kan de toegewezen automatisering inschakelen of pauzeren. De hoofdklep toont zijn status; klikken opent het standaard more-info-venster van HA. Ook de regengrens kun je via dat venster wijzigen. De schakelaar voor de blokkade bij regenverwachting zet die beveiliging aan of uit totdat je hem weer omzet. Vorst- en windgrenzen komen uit de beveiligingscontroles; stel ze in Smart Irrigation in.

**Een planning is geen garantie dat er beregend wordt:** het voorbeeld komt uit de planningsgegevens van de integratie. Een starttijd alleen betekent niet dat de start is ingepland. Eigen automatiseringen kunnen andere regels toepassen. Zonder toegewezen `automation_entity` weet de kaart niet of je automatisering aan staat en raadt hij niet welke automatisering bedoeld is. Directe klepruns verschijnen alleen als actieve beregening wanneer Smart Irrigation een actieve run meldt. De kaart start zelf geen beregening.

Het vorstdeel gebruikt de beslissing die `skip_preview` meldt en verzint geen vorstgrens. Ontbrekende temperatuurmetingen worden uitdrukkelijk als onbekend getoond. Uitgeschakelde vorstbeveiliging wordt als zodanig benoemd en niet als vrijgave om te beregenen getoond.

| Veld | Standaard | Betekenis |
| --- | --- | --- |
| `name` | `Irrigation` / `Bewässerung` / `Beregening` | Titel |
| `icon` | `mdi:sprinkler-variant` | Pictogram |
| `automation_entity` | optioneel | Je eigen `automation.*`; status en inschakelen/pauzeren |
| `main_valve_entity` | optioneel | `switch.*` of `valve.*`; status en more-info-venster van HA |
| `calculate_entity` | automatisch | Globale `button.*`-entiteit voor alle berekeningen |
| `update_weather_entity` | automatisch | Globale `button.*`-entiteit voor weerupdates |
| `precipitation_switch_entity` | automatisch | `switch.*` voor de blokkade bij regenverwachting |
| `precipitation_threshold_entity` | automatisch | `number.*` voor de regengrens |
| `show_actions` | `true` | Directe actieknoppen tonen; more-info-vensters van HA blijven bereikbaar |
| `language` | `auto` | `auto`, `en`, `de`, `nl` |

Vereist de Smart Irrigation-endpoints `smart_irrigation/info`, `smart_irrigation/config` en `smart_irrigation/zones`, plus toegang tot het entiteitenregister. Getest met v2026.10.8. Zolang de kaart zichtbaar is, ververst hij de planningsgegevens als instellingen van de integratie of relevante entiteitstoestanden veranderen, na het opnieuw verbinden en eens per minuut. Meerdere overzichtskaarten delen hun planningsverzoeken; overzichts- en zonekaarten delen zone- en registerverzoeken. Abonnementen en timers worden opgeruimd als kaarten worden verwijderd.

Datums en tijden gebruiken de tijdzone van HA. Niet-beschikbare API-gegevens worden als onbekend getoond; fouten maken van berekende waarden geen nul. Ontbrekende globale actie-entiteiten schakelen de bijbehorende knoppen uit. Knoppen die nog nooit zijn ingedrukt en in HA de status `unknown` hebben, blijven bruikbaar.

## Snel instellen: kies een zone

Kies in de visuele kaarteditor de gewenste **Smart Irrigation-zone**. De kaart gebruikt dan automatisch:

- Zonenaam, berekende duur, beregeningsbehoefte, live waterbalans en waterverbruik.
- Toegepaste ET en de probleemstatus van de zone, inclusief een eventueel gemelde oorzaak.
- De bodemvochtsensor die in Smart Irrigation is ingesteld (`soil_moisture_sensor`).
- De gekoppelde klep (`linked_entity`), mits dat een `switch` of `valve` is.

In YAML is alleen het interne zone-ID nodig (`0` is geldig):

```yaml
type: custom:irrigation-zone-card
zone: 0
```

De editor toont zonenamen en ID's. `zone` is **geen Home Assistant-locatiezone** en geen zonenaam. De kaart leest Smart Irrigation-zones via `smart_irrigation/zones` en vindt hun sensoren via stabiele `unique_id`-kenmerken in het entiteitenregister van HA. Hernoemde entiteit-ID's blijven werken; namen en entiteitvoorvoegsels worden niet geraden. Dit vereist een Smart Irrigation-versie met dat zone-endpoint en kenmerken in de vorm `smart_irrigation_<id>_<rol>`, zoals v2026.10.8, waarmee getest is.

Met **Sensoren overschrijven (optioneel)** wijzig je afzonderlijke koppelingen. Expliciete entiteiten gaan voor; voor de overige velden blijft automatisch koppelen werken. Heeft Smart Irrigation geen bodemvochtsensor of klep toegewezen, dan ontbreekt dat onderdeel totdat je er handmatig een toewijst. Dubbelzinnige, uitgeschakelde of ontbrekende berekeningssensoren geven een melding in plaats van een geraden koppeling. Ook API- en verbindingsfouten verschijnen in de kaart.

```yaml
type: custom:irrigation-zone-card
zone: 0
moisture_entity: sensor.mijn_bodemvocht # optioneel overschrijven
show_control: false # optioneel de klepstatus tonen zonder bedieningsknop
```

Als meerdere zones een klep delen, noemt de kaart die **Gedeelde klep**. Een handmatige opdracht bedient die gedeelde klep. Een zone kiezen geeft geen eigen hydraulische bediening.

Bij het wisselen van zone in de editor worden bestaande sensoroverschrijvingen en de eigen naam gewist, zodat de nieuwe zone zijn eigen koppelingen krijgt. Daarna kun je opnieuw overschrijven. Handmatige configuratie zonder `zone` blijft volledig ondersteund; **Handmatig instellen** klapt de afzonderlijke velden uit. Wijzigingen in zones en entiteitenregister worden opnieuw geladen zolang het dashboard verbonden is. Meerdere kaarten delen verzoeken en geven abonnementen vrij als ze worden verwijderd. Ondersteunt een oudere integratie geen abonnementen op wijzigingen, herlaad dan na een wijziging de weergave.

## Voorbeeld: voortuin

```yaml
type: custom:irrigation-zone-card
name: Voortuin
entity: sensor.smart_irrigation_voortuin
irrigation_needed_entity: binary_sensor.smart_irrigation_voortuin_irrigation_needed
bucket_entity: sensor.smart_irrigation_voortuin_live_bucket
water_used_entity: sensor.smart_irrigation_voortuin_water_used
moisture_entity: sensor.voortuin_bodemvocht
et_entity: sensor.smart_irrigation_voortuin_et_value
problem_entity: binary_sensor.smart_irrigation_voortuin_problem
```

Vervang de voorbeeld-ID's door de echte entiteiten van je zone. Voeg eventueel een klepentiteit toe:

```yaml
valve_entity: switch.mijn_zoneklep # of valve.mijn_zoneklep
show_control: true
confirm_open: true
```

Alle velden zijn te bewerken in de visuele kaarteditor. De kaartkiezer stelt automatische zoneconfiguratie voor als er een zone-ID beschikbaar is, en anders handmatige configuratie. Bestaande kaarten uit v0.1.0 blijven ongewijzigd werken. Om over te stappen kies je de zone in de editor of vervang je afzonderlijke koppelingen in YAML door `zone`.

## Opties

| Veld | Standaard | Betekenis |
| --- | --- | --- |
| `zone` | optioneel | Smart Irrigation-zone-ID; schakelt automatisch koppelen in |
| `entity` | verplicht zonder `zone` | Duursensor van Smart Irrigation; optioneel overschrijven met `zone` |
| `name` | zonenaam of weergavenaam van de sensor | Zonenaam |
| `icon` | `mdi:sprinkler-variant` | Pictogram in de kop |
| `irrigation_needed_entity` | optioneel | `binary_sensor`: `on` = behoefte, `off` = geen behoefte |
| `bucket_entity` | optioneel | Sensor voor de live waterbalans; automatisch gekoppeld met `zone` |
| `moisture_entity` | optioneel | Bodemvocht; de ring wordt alleen gevuld bij de eenheid `%` |
| `water_used_entity` | optioneel | Waterverbruiksensor, met eigen eenheid en meetperiode |
| `et_entity` | optioneel / automatisch met `zone` | Sensor voor toegepaste ET (`et_value`) |
| `problem_entity` | optioneel / automatisch met `zone` | Zoneprobleem-`binary_sensor` (`problem`) |
| `valve_entity` | optioneel | `switch.*` of `valve.*` |
| `show_rules` | `true` | Beregeningsregels en gemelde blokkades tonen bij configuratie met `zone` |
| `show_control` | `true` | Knop voor handmatige klepbediening tonen |
| `confirm_open` | `true` | Om bevestiging vragen voor handmatig openen |
| `bucket_min` | negatief van het schaalmaximum | Linkerkant van de schaal, onder 0 |
| `bucket_max` | `maximum_bucket` van de duursensor, anders `25` | Rechterkant van de schaal, boven 0, in de eenheid van de waterbalans |
| `language` | `auto` | `auto`, `en`, `de` of `nl`; andere HA-talen krijgen Engelse teksten |

Getallen volgen de landinstelling van de Home Assistant-gebruiker. Lichte/donkere thema's en de voorkeur voor minder beweging worden gerespecteerd. In Sections-weergaven is de kaart standaard 12 kolommen breed met automatische hoogte; pas de breedte aan via de lay-outopties van HA. Klik op duur, verbruik, bodemvocht of toegepaste ET om het bijbehorende more-info-venster van HA te openen. Klik op de waarde of schaal van de waterbalans om het venster daarvan te openen; een grafiekpictogram geeft aan dat er geschiedenis beschikbaar is. De geschiedenis in het standaard sensorvenster van HA hangt af van de opgeslagen Recorder-gegevens. De kaart slaat zelf geen geschiedenis op en wijzigt geen Recorder-instellingen. De waterbalans is ook met Enter of spatie te bedienen.

### De weergave begrijpen

- **Waterbalans:** nul scheidt een tekort (negatief) van een voorraad (positief). De markering blijft binnen de schaal; de getalwaarde verandert niet. De balans is geen gemeten bodemvochtwaarde. `bucket_min`/`bucket_max` veranderen alleen de weergave, niet de beregeningsinstellingen. Schaal en sensor moeten dezelfde eenheid gebruiken; de kaart rekent lengte-eenheden niet om.
- **Bodemvocht:** de ring toont de sensorwaarde zonder universele goed/slecht-grenzen voor verschillende bodems te verzinnen. Buiten 0–100% wordt alleen de vulling van de ring begrensd. Andere eenheden verschijnen als getal zonder ringvulling.
- **Duur:** een berekend advies, geen aftelling. Seconden, minuten en uren worden leesbaar opgemaakt; onbekende eenheden blijven behouden.
- **Waterverbruik:** de waarde van de sensor, geen berekend dagtotaal. De entiteit bepaalt de meetperiode.
- **Toegepaste ET:** een kleine waarde naast de waterbalans, met behoud van teken en eenheid van de sensor. Zonder balanssensor staat hij op een eigen regel. De kaart gebruikt de `et_value` die Smart Irrigation publiceert, gebaseerd op de opgeslagen berekeningsdelta. Hij ziet dit niet als pure verdamping, leidt er geen dagwaarde uit af en maakt er geen live teller van. Het more-info-venster opent de bijbehorende sensor. Ontbrekende waarden verschijnen als `—`, ook bij automatisch verwachte ET-sensoren die niet gevonden zijn.
- **Zoneprobleem:** `on` toont een opvallende waarschuwing boven de behoeftestatus. Bekende `reason`-waarden worden vertaald (`valve_did_not_open`, `valve_did_not_close`, `no_flow`); andere meldingen worden als veilig ge-escapete tekst getoond. Klikken opent de probleemsensor. Zonder oorzaak verwijst de kaart naar de sensordetails. Bij `off` is de waarschuwing verborgen; ontbrekende, onbekende of niet-beschikbare probleemsensoren worden uitdrukkelijk getoond als **Probleemstatus onbekend**. Bij handmatige configuratie zonder `problem_entity` ontbreekt deze functie. De integratie kan een gemeld probleem vasthouden tot een geslaagde run; de kaart bevestigt of wist het niet. Klepstatus en sluitknop blijven zichtbaar tijdens een waarschuwing.
- **Status:** een actieve of bewegende klep gaat voor, daarna de behoeftesensor. Zonder bekende behoeftestatus toont de kaart „Waterbehoefte onbekend". „Klep actief" geeft de gemelde klepstatus weer, geen gemeten waterstroom.
- **Ontbrekende gegevens:** `unknown`, `unavailable` en ontbrekende entiteiten verschijnen als `—` met een melding. Ze worden niet omgezet in nul.

### Beregeningsregels

Met `zone` leest de kaart ook de ingestelde Smart Irrigation-regels: **tekortdrempel**, **minimale tussenpoos**, **bodemvochtblokkade** en **maximale looptijd**. De minimale tussenpoos wordt aangeduid als zonespecifieke waarde of als globaal overgenomen waarde. `0` dagen blijft een expliciete waarde zonder intervalbeperking; ontbrekende gegevens worden als onbekend getoond. De tekortdrempel is een startdrempel, geen doelwaarde voor de waterbalans. Seizoensaanpassingen kunnen de werkelijk toegepaste waarden veranderen.

![Beregeningsregels voor een rozenperk](docs/rules-light.png)

De kaart toont ook de laatst gemelde blokkades van de integratie voor precies deze zone (bodemvocht en minimale tussenpoos), plus een melding bij centrale beveiligingsblokkades. Hij berekent zelf geen startvrijgave uit sensorwaarden of datums. Een ontbrekende beveiligingsstatus wordt uitdrukkelijk aangegeven. Eigen automatiseringen moeten deze regels zelf toepassen.

Waarden worden opnieuw geladen als de configuratie verandert; het beveiligingsvoorbeeld ververst daarnaast eens per minuut. Alle zone- en overzichtskaarten delen deze systeemverzoeken. Instellingen wijzig je nog steeds in Smart Irrigation. Handmatige sensorkoppelingen zonder `zone` krijgen geen geraden regels; een zone kan wel worden gecombineerd met handmatige sensoroverschrijvingen. Verberg dit deel met `show_rules: false` of via de visuele editor.

### Klepbediening

De kaart roept `switch.turn_on`/`switch.turn_off` of `valve.open_valve`/`valve.close_valve` aan voor precies de ingestelde entiteit. Bij kleppen houdt hij rekening met de gemelde OPEN/CLOSE-mogelijkheden. De knop is uitgeschakeld als de status onbekend is of de klep beweegt. Fouten verschijnen in de kaart; de status blijft van Home Assistant komen.

**Handmatig openen start geen uitschakeltimer en geen Smart Irrigation-automatisering.** Een open klep moet handmatig of door een bestaande automatisering worden gesloten. Openen vraagt daarom standaard om bevestiging. Sluiten gebeurt direct. `show_control: false` toont alleen de status. De kaart schrijft niets terug naar de waterbalans van Smart Irrigation en wijzigt geen automatiseringen.

## Ontwikkeling en voorbeeld

Node.js 22 of nieuwer:

```bash
npm ci
npm run build
npm run dev
# http://localhost:5173
```

Het lokale voorbeeld toont drie zones met **voorbeeldgegevens**, waaronder metingen uit de voortuin die tijdens de ontwikkeling zijn vastgelegd (3,52 mm, 100%, 0 s). Knoppen simuleren statuswijzigingen in de browser. Er zijn geen Home Assistant-inloggegevens nodig en er worden geen echte kleppen bediend. De pictogrammen in het voorbeeld zijn lokale plaatsvervangers; Home Assistant toont in het dashboard zijn eigen MDI-pictogrammen. De visuele editor gebruikt de standaard `ha-form` en wordt door Home Assistant weergegeven.

Het centrale voorbeeld op `http://localhost:5173/demo/overview.html` toont geplande behoefte, een regenblokkade en een vorstblokkade met voorbeeldgegevens. Ook daar worden alle acties volledig in de browser gesimuleerd.

```bash
npx playwright install chromium
npm run check
```

Zie de [Engelse README](README.md#development-and-preview) voor een volledig overzicht van wat de tests controleren.

### Een taal toevoegen

Alle teksten staan in `src/i18n/`, één bestand per taal. Om een taal toe te voegen kopieer je `src/i18n/en.js` naar `src/i18n/<code>.js`, vertaal je de waarden (de sleutels blijven gelijk) en registreer je het bestand in `src/i18n/index.js`. De taal verschijnt dan automatisch in de editors en wordt geaccepteerd als `language`. Ontbrekende teksten vallen terug op Engels; `npm test` controleert dat elke taal dezelfde sleutels heeft als Engels.

## Referenties

- [Home Assistant: Custom cards](https://contributors.home-assistant.io/frontend/custom-ui/card/)
- [Home Assistant: Editor en kaartkiezer](https://contributors.home-assistant.io/frontend/custom-ui/card-editor/)
- [Home Assistant: Kleptoestanden en acties](https://www.home-assistant.io/integrations/valve/)
- [HACS: Dashboard-repository](https://www.hacs.xyz/docs/publish/plugin/)
- [Smart Irrigation: Zone-WebSocket](https://github.com/altmenorg/HAsmartirrigation/blob/master/custom_components/smart_irrigation/websockets.py)
- [Smart Irrigation: Stabiele sensorkenmerken](https://github.com/altmenorg/HAsmartirrigation/blob/master/custom_components/smart_irrigation/sensor.py)
- [Smart Irrigation: Probleemstatus en oorzaak](https://github.com/altmenorg/HAsmartirrigation/blob/master/custom_components/smart_irrigation/binary_sensor.py)

MIT-licentie.
