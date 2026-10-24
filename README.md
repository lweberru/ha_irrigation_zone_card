# Irrigation Zone Card

**English** | [Deutsch](README.de.md)

A Home Assistant dashboard card for **one Smart Irrigation zone**. A soil moisture ring, water balance with a zero reference, calculated watering duration, and water usage in a calm, compact garden design. An optional zone valve (`switch.*` or `valve.*`) adds manual control.

Since v0.3.0, the same HACS installation also includes **Irrigation Overview**, a central card for planning, rain and frost protection, and integration-wide actions.

![Zone card preview](docs/preview-light.png)

The screenshots show the German interface. Both cards support English and German and follow your Home Assistant language by default. Use `language: en` to select English explicitly.

## Installation

### HACS

The current version is available on the [releases page](https://github.com/lweberru/ha_irrigation_zone_card/releases/latest).

1. In HACS, add `https://github.com/lweberru/ha_irrigation_zone_card` under **Custom repositories**, with type **Dashboard**.
2. Download **Irrigation Zone Card**.
3. If HACS does not register the resource automatically, add `/hacsfiles/ha_irrigation_zone_card/ha_irrigation_zone_card.js` as a **JavaScript module** under **Settings → Dashboards → Resources**. Resources are visible with advanced mode enabled in your user profile.
4. Reload your browser. Search for **Irrigation Zone** in the card picker or use the YAML configuration below.

The repository provides the ready-to-use bundle at `dist/ha_irrigation_zone_card.js`; Home Assistant needs neither npm nor additional cards. The filename and repository layout follow the [HACS requirements](https://www.hacs.xyz/docs/publish/plugin/). This is a custom repository; it is not listed in the default HACS catalog.

### Manual installation / local development

Copy `dist/ha_irrigation_zone_card.js` to `<HA configuration directory>/www/ha_irrigation_zone_card.js` and register `/local/ha_irrigation_zone_card.js?v=0.5.0` as a JavaScript module in your dashboard resources. When updating, change the version parameter and reload your browser. Do not edit `.storage` files.

## Central card: Irrigation Overview

![Central planning, rain and frost protection](docs/overview-light.png)

After updating through HACS, reload your browser and select **Irrigation Overview** in the card picker. Automatic discovery only needs:

```yaml
type: custom:irrigation-overview-card
```

The card displays central data from Smart Irrigation:

- Overall status and the next planned start, distinguishing between an armed start and a start that has not been armed.
- Calculated or forecast total demand and the number of zones needing water, without duplicating individual zone lists.
- **A dedicated frost protection section:** reported temperature and frost threshold in the integration's units, an active frost hold, disabled protection, or a missing reading.
- Rain forecast for the reported period compared with the rain threshold; other active checks such as a rain sensor, wind, minimum watering interval, and soil moisture.
- Weather source and automatic calculation, including calculation time.
- **Calculate all** and **Update weather** through the native global button entities. The rain forecast protection switch and rain threshold are also discovered automatically using stable internal identifiers.

Your own automation and a main valve are optional. Select their actual entity IDs in the editor:

```yaml
type: custom:irrigation-overview-card
name: Garden control
automation_entity: automation.my_irrigation
main_valve_entity: switch.my_main_valve
```

The card can enable or pause the assigned automation. The main valve displays its state; clicking it opens the native HA more-info dialog. The rain threshold can also be edited through that dialog. The rain forecast protection switch enables or disables that protection until changed again. Frost and wind thresholds come from the protection checks; configure them in Smart Irrigation.

**A plan does not guarantee a run:** the preview comes from the integration's planning data. A start time alone does not mean that the start is armed. Your own automations may apply different rules. Without an assigned `automation_entity`, the card does not know whether your automation is enabled and does not guess which automation to use. Direct valve runs appear as active irrigation only when Smart Irrigation reports an active run. The card itself does not start an irrigation run.

The frost section uses the decision reported by `skip_preview` and does not invent a frost threshold. Missing temperature readings are explicitly shown as unknown. Disabled frost protection is labeled accordingly, rather than shown as clearance to irrigate.

| Field | Default | Meaning |
| --- | --- | --- |
| `name` | `Irrigation` / `Bewässerung` | Title |
| `icon` | `mdi:sprinkler-variant` | Icon |
| `automation_entity` | optional | Your `automation.*`; state and enable/pause control |
| `main_valve_entity` | optional | `switch.*` or `valve.*`; state and HA more-info dialog |
| `calculate_entity` | automatic | Global `button.*` entity for all calculations |
| `update_weather_entity` | automatic | Global `button.*` entity for weather updates |
| `precipitation_switch_entity` | automatic | `switch.*` for rain forecast protection |
| `precipitation_threshold_entity` | automatic | `number.*` for the rain threshold |
| `show_actions` | `true` | Show direct service buttons; HA more-info dialogs remain accessible |
| `language` | `auto` | `auto`, `de`, `en` |

Requires the Smart Irrigation endpoints `smart_irrigation/info`, `smart_irrigation/config`, and `smart_irrigation/zones`, plus access to the entity registry. Tested with v2026.10.8. While displayed, the card refreshes planning data when integration settings or relevant entity states change, on reconnection, and once per minute. Multiple overview cards share planning requests; overview and zone cards share zone and registry requests. Subscriptions and timers are cleaned up when cards are removed.

Dates and times use the HA time zone. Unavailable API data is shown as unknown; errors do not turn calculated values into zero. Missing global action entities disable the corresponding buttons. Buttons that have never been pressed and have an HA state of `unknown` remain usable.

## Quick setup: select a zone

Select the desired **Smart Irrigation zone** in the visual card editor. The card automatically uses:

- Zone name, calculated duration, irrigation demand, live water balance, and water usage.
- Applied ET and zone problem status, including any reported cause.
- The soil moisture sensor configured in Smart Irrigation (`soil_moisture_sensor`).
- The linked valve (`linked_entity`), provided it is a `switch` or `valve`.

YAML only needs the internal zone ID (`0` is valid):

```yaml
type: custom:irrigation-zone-card
zone: 0
```

The editor lists zone names and IDs. `zone` is **not a Home Assistant location zone** or a zone name. The card reads Smart Irrigation zones through `smart_irrigation/zones` and finds their sensors using stable `unique_id` identifiers in the HA entity registry. Renamed entity IDs still work; names and entity prefixes are not guessed. This requires a Smart Irrigation version with that zone endpoint and identifiers in the form `smart_irrigation_<id>_<role>`, such as v2026.10.8, which was used for validation.

Use **Override sensors (optional)** to change individual assignments. Explicit entities take precedence; automatic discovery continues for other fields. If Smart Irrigation has no soil moisture sensor or valve assigned, that element is omitted until you assign one manually. Ambiguous, disabled, or missing calculation sensors produce a notice instead of a guessed assignment. API and connection errors also appear in the card.

```yaml
type: custom:irrigation-zone-card
zone: 0
moisture_entity: sensor.my_soil_moisture # optional override
show_control: false # optionally show the valve state without its control button
```

If several zones share a valve, the card labels it **Shared valve**. A manual command operates that shared valve. Selecting a zone does not create independent hydraulic control.

Changing zones in the editor clears existing sensor overrides and the custom name so that the new zone gets its own assignments. You can then add new overrides. Manual configuration without `zone` remains fully supported; **Configure manually** expands the individual fields. Zone and entity registry changes are reloaded while the dashboard is connected. Multiple cards share requests and release subscriptions when removed. If an older integration does not support change subscriptions, reload the view after making changes.

## Example: front garden

```yaml
type: custom:irrigation-zone-card
name: Front garden
entity: sensor.smart_irrigation_front_garden
irrigation_needed_entity: binary_sensor.smart_irrigation_front_garden_irrigation_needed
bucket_entity: sensor.smart_irrigation_front_garden_live_bucket
water_used_entity: sensor.smart_irrigation_front_garden_water_used
moisture_entity: sensor.front_garden_soil_moisture
et_entity: sensor.smart_irrigation_front_garden_et_value
problem_entity: binary_sensor.smart_irrigation_front_garden_problem
```

Replace the example sensor IDs with the actual entities for your zone. Optionally add a valve entity:

```yaml
valve_entity: switch.my_zone_valve # alternatively valve.my_zone_valve
show_control: true
confirm_open: true
```

All fields are editable in the visual card editor. The card picker suggests automatic zone configuration when a zone ID is available, otherwise manual configuration. Existing v0.1.0 cards continue to work unchanged. To switch, select the zone in the editor or replace individual assignments with `zone` in YAML.

## Options

| Field | Default | Meaning |
| --- | --- | --- |
| `zone` | optional | Smart Irrigation zone ID; enables automatic discovery |
| `entity` | required without `zone` | Smart Irrigation duration sensor; optional override with `zone` |
| `name` | zone name or sensor friendly name | Zone name |
| `icon` | `mdi:sprinkler-variant` | Header icon |
| `irrigation_needed_entity` | optional | `binary_sensor`: `on` = demand, `off` = no demand |
| `bucket_entity` | optional | Live water balance sensor; automatically assigned with `zone` |
| `moisture_entity` | optional | Soil moisture; ring fill requires the `%` unit |
| `water_used_entity` | optional | Water usage sensor, with its own unit and reporting period |
| `et_entity` | optional / automatic with `zone` | Applied ET sensor (`et_value`) |
| `problem_entity` | optional / automatic with `zone` | Zone problem `binary_sensor` (`problem`) |
| `valve_entity` | optional | `switch.*` or `valve.*` |
| `show_rules` | `true` | Show irrigation rules and reported holds when configured with `zone` |
| `show_control` | `true` | Show the manual valve control button |
| `confirm_open` | `true` | Ask for confirmation before opening manually |
| `bucket_min` | negative of the scale maximum | Left end of the scale, below 0 |
| `bucket_max` | duration sensor's `maximum_bucket`, otherwise `25` | Right end of the scale, above 0, in the water balance unit |
| `language` | `auto` | `auto`, `de`, or `en`; other HA languages use English text |

Numbers follow the Home Assistant user's locale. Light/dark themes and reduced motion preferences are respected. In Sections views, the card defaults to 12 columns and automatic height; adjust the width through HA's layout options. Click duration, usage, soil moisture, or applied ET to open the corresponding HA more-info dialog. Click the water balance value or scale to open its dialog; a chart icon indicates the available history. History in HA's native sensor dialog depends on stored Recorder data. The card does not store its own history or change Recorder settings. The water balance also supports keyboard activation with Enter or Space.

### Understanding the display

- **Water balance:** zero separates a deficit (negative) from a reserve (positive). The marker is clamped to the scale; the numeric value is unchanged. The balance is not a measured soil moisture reading. `bucket_min`/`bucket_max` only change the visualization, not irrigation settings. The scale and sensor must use the same unit; the card does not convert length units.
- **Soil moisture:** the ring shows the sensor reading without inventing universal good/bad thresholds for different soils. Outside 0–100%, only the ring fill is clamped. Other units appear as a number without ring fill.
- **Duration:** a calculated recommendation, not a countdown. Seconds, minutes, and hours are formatted for readability; unknown units are preserved.
- **Water usage:** the sensor's value, not a calculated daily total. The entity determines the reporting period.
- **Applied ET:** a small value next to the water balance, preserving the sensor's sign and unit. Without a balance sensor, it appears on its own row. The card uses the `et_value` published by Smart Irrigation, which is based on the stored calculation delta. It does not interpret this as pure evaporation, derive a daily value, or turn it into a live counter. The more-info dialog opens the associated sensor. Missing values appear as `—`, including automatically expected ET sensors that were not found.
- **Zone problem:** `on` displays a prominent warning above the demand status. Known `reason` values are translated (`valve_did_not_open`, `valve_did_not_close`, `no_flow`); other messages are displayed as safely escaped text. Clicking opens the problem sensor. If no cause is supplied, the card points to the sensor details. At `off`, the warning is hidden; missing, unknown, or unavailable problem sensors are explicitly shown as **Problem status unknown**. This feature is omitted for manual configurations without `problem_entity`. The integration may retain a reported problem until a successful run; the card does not acknowledge or clear it. Valve state and the close button remain visible during a warning.
- **Status:** an active or moving valve takes priority, followed by the demand sensor. Without a known demand state, the card displays “Water demand unknown.” “Valve active” reflects the reported valve state, not measured water flow.
- **Missing data:** `unknown`, `unavailable`, and missing entities appear as `—` with a notice. They are not converted into zero.

### Irrigation rules

With `zone`, the card also reads the configured Smart Irrigation rules: **deficit threshold**, **minimum interval**, **soil moisture hold**, and **runtime limit**. The minimum interval is labeled as a zone-specific value or a globally inherited value. `0` days remains an explicit value with no interval restriction; missing data is shown as unknown. The deficit threshold is a start threshold, not a target water balance. Seasonal adjustments may change the values actually applied.

![Irrigation rules for a rose bed](docs/rules-light.png)

The card also shows the integration's latest reported holds for this exact zone (soil moisture and minimum interval), plus a notice for central protection holds. It does not calculate its own permission to start from sensor readings or dates. Missing protection status is explicitly indicated. Your own automations must implement these rules themselves.

Values are reloaded when configuration changes; the protection preview also refreshes once per minute. All zone and overview cards share these system requests. Settings are still changed in Smart Irrigation. Manual sensor assignments without `zone` do not receive guessed rules; a zone can be combined with manual sensor overrides. Hide this section with `show_rules: false` or through the visual editor.

### Valve control

The card calls `switch.turn_on`/`switch.turn_off` or `valve.open_valve`/`valve.close_valve` for exactly the configured entity. For valves, it respects the reported OPEN/CLOSE capabilities. The button is disabled when the state is unknown or the valve is moving. Errors appear in the card; state continues to come from Home Assistant.

**Opening manually does not start a shutoff timer or a Smart Irrigation automation.** An open valve must be closed manually or by an existing automation. Opening therefore requires confirmation by default. Closing is immediate. `show_control: false` displays the state only. The card does not write back to the Smart Irrigation water balance or modify automations.

## Development and preview

Node.js 22 or later:

```bash
npm ci
npm run build
npm run dev
# http://localhost:5173
```

The local preview shows three zones with **sample data**, including front garden readings captured during development (3.52 mm, 100%, 0 s). Buttons simulate state changes in the browser. No Home Assistant credentials are needed and no real valves are operated. Preview icons are local placeholders; Home Assistant renders its own MDI icons in the dashboard. The visual editor uses native `ha-form` and is rendered by Home Assistant.

The central preview at `http://localhost:5173/demo/overview.html` shows planned demand, a rain hold, and a frost hold using sample data. All actions there are also simulated entirely in the browser.

```bash
npx playwright install chromium
npm run check
```

Checks cover configuration, units, status logic, scales, actuator actions, rendering, confirmation dialogs, service calls, errors, HTML escaping, more-info events, editor configuration events, and mobile width. Screenshots are saved under `test-results/`. Browser checks use simulated HA objects; an installation still needs verification in the actual HA frontend.

Additional checks cover zone ID `0`, stable discovery after entity IDs are renamed, manual overrides, zone changes, shared valves, shared requests, subscription cleanup, and API errors. Discovery for all three sample zones was validated against real API responses without operating valves.

The central card adds checks for planning status, custom automations, API failures, frost holds, missing temperatures, disabled frost protection, rain values, native global buttons, service errors, more-info dialogs, time zones, and mobile rendering. Further checks cover ET/problem discovery, live changes, signs, safe message rendering, unknown problem states, and the clickable water balance including keyboard access. There are 24 logic tests and 23 browser checks in total. Discovery and protection data were also checked against real API responses without executing actions on the actual system.

`src/` contains the source; `dist/` is committed so HACS can also install without a GitHub release. Run `npm run build` after changes. The build includes all runtime code without CDN dependencies. CI also checks that the distributable is up to date. Publishing on GitHub and installation on an HA system are separate steps.

## References

- [Home Assistant: Custom cards](https://contributors.home-assistant.io/frontend/custom-ui/card/)
- [Home Assistant: Editor and card picker](https://contributors.home-assistant.io/frontend/custom-ui/card-editor/)
- [Home Assistant: Valve states and actions](https://www.home-assistant.io/integrations/valve/)
- [HACS: Dashboard repository](https://www.hacs.xyz/docs/publish/plugin/)
- [Smart Irrigation: Zone WebSocket](https://github.com/altmenorg/HAsmartirrigation/blob/master/custom_components/smart_irrigation/websockets.py)
- [Smart Irrigation: Stable sensor identifiers](https://github.com/altmenorg/HAsmartirrigation/blob/master/custom_components/smart_irrigation/sensor.py)
- [Smart Irrigation: Problem status and cause](https://github.com/altmenorg/HAsmartirrigation/blob/master/custom_components/smart_irrigation/binary_sensor.py)

MIT license.
