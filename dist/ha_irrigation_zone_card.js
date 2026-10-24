/* Irrigation Zone Card v0.2.0 | MIT License */

// src/styles.js
var styles = `
:host { display:block; container-type:inline-size; --iz-green:#36856b; --iz-blue:#498bb0; --iz-amber:#ad722c; }
:host([dark]) { --iz-green:#83c6a5; --iz-blue:#8dbdd8; --iz-amber:#dfb777; --iz-button-text:#132c21; }
* { box-sizing:border-box; }
ha-card { display:block; overflow:hidden; position:relative; border-radius:var(--ha-card-border-radius,24px); background:var(--ha-card-background,var(--card-background-color,#fff)); color:var(--primary-text-color,#233c33); border:1px solid var(--ha-card-border-color,var(--divider-color,#e1e9e3)); font-family:var(--paper-font-body1_-_font-family,inherit); }
.wrap { padding:24px; background:radial-gradient(ellipse at 100% 0%,color-mix(in srgb,var(--iz-green) 9%,transparent),transparent 65%); }
header { display:flex; gap:12px; align-items:center; }
.zone-icon { width:44px; height:44px; border-radius:15px; display:grid; place-items:center; background:color-mix(in srgb,var(--iz-green) 12%,transparent); color:var(--iz-green); flex-shrink:0; }
ha-icon { --mdc-icon-size:22px; display:inline-flex; }
.heading { min-width:0; flex:1; }
.eyebrow { font-size:10px; font-weight:700; letter-spacing:1.8px; text-transform:uppercase; color:var(--secondary-text-color,#77877f); }
h2 { margin:4px 0 0; font-size:23px; line-height:1.2; font-weight:650; letter-spacing:-.6px; overflow-wrap:anywhere; }
button { font:inherit; color:inherit; cursor:pointer; -webkit-tap-highlight-color:transparent; }
button:focus-visible { outline:3px solid var(--primary-color,#498bb0); outline-offset:3px; }
button:disabled { cursor:default; opacity:.55; }
.more { border:0; background:transparent; padding:10px; border-radius:50%; color:var(--secondary-text-color,#77877f); }
.status { display:inline-flex; gap:7px; align-items:center; font-size:11px; font-weight:600; margin-top:18px; padding:7px 11px; border-radius:24px; color:var(--iz-green); background:color-mix(in srgb,var(--iz-green) 10%,transparent); }
.status.needed { color:var(--iz-amber); background:color-mix(in srgb,var(--iz-amber) 12%,transparent); }
.status.watering { color:var(--iz-blue); background:color-mix(in srgb,var(--iz-blue) 12%,transparent); }
.status.unknown { color:var(--secondary-text-color,#77877f); background:var(--secondary-background-color,#f1f3f1); }
.dot { width:6px; height:6px; border-radius:50%; background:currentColor; }
.watering .dot { animation:breathe 2s ease-in-out infinite; }
.overview { display:flex; align-items:center; gap:22px; margin:25px 0; }
.ring { width:136px; height:136px; flex-shrink:0; position:relative; display:grid; place-items:center; color:var(--iz-green); }
.ring svg { position:absolute; inset:0; width:100%; height:100%; transform:rotate(-90deg); overflow:visible; }
.track { stroke:color-mix(in srgb,var(--iz-green) 12%,transparent); }
.arc { stroke:var(--iz-green); transition:stroke-dasharray .6s ease; stroke-linecap:round; }
.ring-content { text-align:center; padding:16px; }
.ring-content ha-icon { --mdc-icon-size:20px; }
.ring-value { font-size:32px; font-weight:600; letter-spacing:-1.5px; line-height:1.3; font-variant-numeric:tabular-nums; }
.ring-value small { font-size:14px; font-weight:500; letter-spacing:0; margin-left:2px; }
.ring-label { font-size:10px; color:var(--secondary-text-color,#77877f); }
.balance { flex:1; min-width:0; }
.label { font-size:12px; color:var(--secondary-text-color,#77877f); line-height:1.4; }
.balance-value { font-size:29px; font-weight:550; letter-spacing:-1px; margin:5px 0 3px; font-variant-numeric:tabular-nums; }
.balance-value small { font-size:13px; font-weight:400; letter-spacing:0; }
.hint { font-size:11px; color:var(--iz-green); }
.deficit .hint,.deficit .balance-value { color:var(--iz-amber); }
.balance-bar { height:8px; border-radius:10px; position:relative; margin-top:19px; background:linear-gradient(to right,color-mix(in srgb,var(--iz-amber) 22%,transparent) var(--zero),color-mix(in srgb,var(--iz-blue) 17%,transparent) var(--zero)); }
.zero { position:absolute; left:var(--zero); height:14px; top:-3px; width:1px; background:var(--secondary-text-color,#77877f); opacity:.5; }
.marker { position:absolute; top:-3px; left:var(--position); width:14px; height:14px; margin-left:-7px; border:3px solid var(--ha-card-background,var(--card-background-color,#fff)); border-radius:50%; background:var(--iz-green); box-shadow:0 0 0 1px var(--iz-green); transition:left .5s ease; }
.deficit .marker { background:var(--iz-amber); box-shadow:0 0 0 1px var(--iz-amber); }
.scale { position:relative; display:flex; justify-content:space-between; margin-top:8px; font-size:9px; color:var(--secondary-text-color,#77877f); }
.scale .center { position:absolute; left:var(--zero); transform:translateX(-50%); }
.stats { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
.stat { display:flex; flex-direction:column; gap:10px; align-items:flex-start; border:0; text-align:start; background:color-mix(in srgb,var(--primary-text-color,#233c33) 4%,transparent); border-radius:16px; padding:16px; min-width:0; }
.stat ha-icon { color:var(--iz-green); --mdc-icon-size:21px; }
.stat:last-child ha-icon { color:var(--iz-blue); }
.stat-value { font-size:23px; font-weight:550; letter-spacing:-.6px; overflow-wrap:anywhere; }
.stat-value small { font-size:12px; letter-spacing:0; font-weight:400; }
.stat .label { font-size:10px; margin-top:3px; }
.control { display:flex; gap:12px; align-items:center; margin-top:18px; padding-top:18px; border-top:1px solid var(--divider-color,#e1e9e3); }
.control-copy { flex:1; min-width:0; }
.control-title { font-size:12px; font-weight:600; }
.control-state { font-size:10px; margin-top:4px; color:var(--secondary-text-color,#77877f); }
.control button { border:0; border-radius:12px; padding:11px 15px; min-height:44px; background:var(--iz-green); color:var(--iz-button-text,#fff); font-size:12px; font-weight:600; }
.control button.close { background:color-mix(in srgb,var(--iz-blue) 14%,transparent); color:var(--iz-blue); }
.notice { font-size:11px; line-height:1.5; margin-top:14px; color:var(--secondary-text-color,#77877f); overflow-wrap:anywhere; }
.error { color:var(--error-color,#b34b43); }
.empty-overview { margin:24px 0; }
.ring-button { border:0; padding:0; border-radius:50%; background:transparent; }
@keyframes breathe { 50% { opacity:.35; } }
@media (prefers-reduced-motion:reduce) { *,*::before,*::after { animation:none!important; transition:none!important; } }
@container (max-width:340px) { .wrap { padding:18px; } .overview { gap:16px; } .ring { width:112px; height:112px; } .ring-value { font-size:27px; } .balance-value { font-size:25px; } .stat { padding:13px; } }
@container (max-width:260px) { .overview { flex-direction:column; align-items:stretch; } .ring { margin:auto; } .stats { grid-template-columns:1fr; } .control { flex-wrap:wrap; } }
`;

// src/model.js
var entityKeys = ["entity", "irrigation_needed_entity", "bucket_entity", "water_used_entity", "moisture_entity", "valve_entity"];
function numeric(value) {
  if (value === null || value === void 0 || String(value).trim() === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}
var clamp = (value, min, max) => Math.min(max, Math.max(min, value));
function validateConfig(config) {
  const zone = config?.zone !== void 0 && config.zone !== "";
  if (zone && !(typeof config.zone === "number" && Number.isSafeInteger(config.zone) && config.zone >= 0 || typeof config.zone === "string" && /^(0|[1-9]\d*)$/.test(config.zone) && Number.isSafeInteger(Number(config.zone)))) {
    throw new Error("zone must be a non-negative Smart Irrigation zone ID.");
  }
  if ((!zone || config.entity) && (typeof config?.entity !== "string" || !/^sensor\.[a-z0-9_]+$/.test(config.entity))) {
    throw new Error("Select a Smart Irrigation zone or define a duration sensor entity.");
  }
  for (const key of entityKeys.slice(1)) {
    if (config[key] !== void 0 && config[key] !== "" && (typeof config[key] !== "string" || !/^[a-z_]+\.[a-z0-9_]+$/.test(config[key]))) {
      throw new Error(`${key}: invalid entity ID`);
    }
  }
  if (config.valve_entity && !/^(switch|valve)\./.test(config.valve_entity)) throw new Error("valve_entity must be a switch or valve.");
  if (config.irrigation_needed_entity && !config.irrigation_needed_entity.startsWith("binary_sensor.")) throw new Error("irrigation_needed_entity must be a binary_sensor.");
  for (const key of ["bucket_entity", "water_used_entity", "moisture_entity"]) {
    if (config[key] && !config[key].startsWith("sensor.")) throw new Error(`${key} must be a sensor.`);
  }
  for (const key of ["bucket_min", "bucket_max"]) {
    if (config[key] !== void 0 && (typeof config[key] !== "number" || !Number.isFinite(config[key]))) throw new Error(`${key} must be a finite number.`);
  }
  if (config.bucket_min !== void 0 && config.bucket_min >= 0) throw new Error("bucket_min must be below zero.");
  if (config.bucket_max !== void 0 && config.bucket_max <= 0) throw new Error("bucket_max must be above zero.");
  for (const key of ["show_control", "confirm_open"]) {
    if (config[key] !== void 0 && typeof config[key] !== "boolean") throw new Error(`${key} must be a boolean.`);
  }
  if (config.language !== void 0 && !["auto", "de", "en"].includes(config.language)) throw new Error("language must be auto, de or en.");
  for (const key of ["name", "icon"]) if (config[key] !== void 0 && typeof config[key] !== "string") throw new Error(`${key} must be a string.`);
  return { show_control: true, confirm_open: true, ...config };
}
function valveAction(entityId, state, features = 3) {
  const domain = entityId?.split(".")[0];
  if (domain === "switch" && ["on", "off"].includes(state)) return { domain, service: state === "on" ? "turn_off" : "turn_on" };
  if (domain !== "valve") return null;
  if (state === "open" && features & 2) return { domain, service: "close_valve" };
  if (state === "closed" && features & 1) return { domain, service: "open_valve" };
  return null;
}
function zoneModel(config, states) {
  const main = states[config.entity];
  const bucket = states[config.bucket_entity];
  const valve = states[config.valve_entity];
  const needed = states[config.irrigation_needed_entity]?.state;
  const active = ["on", "open", "opening", "closing"].includes(valve?.state);
  const balance = numeric(bucket?.state);
  const capacity = numeric(main?.attributes?.maximum_bucket);
  const max = config.bucket_max ?? (capacity > 0 ? capacity : 25);
  const min = config.bucket_min ?? -max;
  const position = balance === null ? null : clamp((balance - min) / (max - min) * 100, 0, 100);
  const zero = -min / (max - min) * 100;
  const moistureEntity = states[config.moisture_entity];
  const moisture = numeric(moistureEntity?.state);
  const moisturePercent = moistureEntity?.attributes?.unit_of_measurement === "%" && moisture !== null;
  const status = active ? "watering" : needed === "on" ? "needed" : needed === "off" ? "balanced" : "unknown";
  return {
    main,
    balance,
    min,
    max,
    zero,
    position,
    moisture,
    moisturePercent,
    moistureFill: moisturePercent ? clamp(moisture, 0, 100) : 0,
    status,
    active,
    valve,
    action: config.valve_entity ? valveAction(config.valve_entity, valve?.state, valve?.attributes?.supported_features ?? 0) : null
  };
}
function durationParts(state) {
  const value = numeric(state?.state);
  if (value === null) return null;
  const factor = { s: 1, sec: 1, min: 60, h: 3600 }[state?.attributes?.unit_of_measurement];
  if (!factor) return { raw: true, value, unit: state?.attributes?.unit_of_measurement || "" };
  const seconds = Math.max(0, Math.round(value * factor));
  if (seconds < 60) return { value: seconds, unit: "s" };
  if (seconds < 3600) return { value: Math.floor(seconds / 60), unit: "min", remainder: seconds % 60, remainderUnit: "s" };
  return { value: Math.floor(seconds / 3600), unit: "h", remainder: Math.floor(seconds % 3600 / 60), remainderUnit: "min" };
}

// src/discovery.js
var hasZone = (config) => config?.zone !== void 0 && config.zone !== "";
var roles = { entity: "duration", irrigation_needed_entity: "irrigation_needed", bucket_entity: "live_bucket", water_used_entity: "water_used" };
function resolveZone(config, discovery) {
  if (!hasZone(config)) return config;
  const zone = discovery?.zones?.find((zone2) => String(zone2.id) === String(config.zone));
  const result = { ...config };
  if (!zone) return { ...result, _discoveryIssue: discovery?.error ? "discoveryFailed" : discovery ? "zoneMissing" : "loading" };
  result.name = config.name || zone.name;
  const registry = discovery.registry || [];
  for (const [key, role] of Object.entries(roles)) {
    if (config[key]) continue;
    const candidates = registry.filter((entry) => entry.platform === "smart_irrigation" && !entry.disabled_by && entry.unique_id === `smart_irrigation_${zone.id}_${role}` && entry.entity_id?.startsWith(key === "irrigation_needed_entity" ? "binary_sensor." : "sensor."));
    if (candidates.length === 1) result[key] = candidates[0].entity_id;
  }
  if (!config.moisture_entity && /^sensor\.[a-z0-9_]+$/.test(zone.soil_moisture_sensor || "")) result.moisture_entity = zone.soil_moisture_sensor;
  if (!config.valve_entity && /^(switch|valve)\.[a-z0-9_]+$/.test(zone.linked_entity || "")) result.valve_entity = zone.linked_entity;
  const users = discovery.zones.filter((item) => item.linked_entity === result.valve_entity);
  result._sharedValve = result.valve_entity && users.length > 1 ? users.length : 0;
  result._autoMissing = Object.keys(roles).filter((key) => !result[key]);
  if (discovery.error) result._discoveryIssue = "discoveryFailed";
  return result;
}
var readers = /* @__PURE__ */ new WeakMap();
function watchDiscovery(hass, callback) {
  const key = hass.connection || hass;
  let reader = readers.get(key);
  if (!reader) {
    reader = { listeners: /* @__PURE__ */ new Set(), snapshot: null, pending: false, again: false, cleanups: [] };
    readers.set(key, reader);
  }
  reader.hass = hass;
  reader.listeners.add(callback);
  if (reader.snapshot) callback(reader.snapshot);
  const refresh = async () => {
    if (reader.pending) {
      reader.again = true;
      return;
    }
    reader.pending = true;
    const results = await Promise.allSettled([
      Promise.resolve().then(() => reader.hass.callWS({ type: "smart_irrigation/zones" })),
      Promise.resolve().then(() => reader.hass.callWS({ type: "config/entity_registry/list" }))
    ]);
    reader.snapshot = {
      zones: results[0].status === "fulfilled" && Array.isArray(results[0].value) ? results[0].value : [],
      registry: results[1].status === "fulfilled" && Array.isArray(results[1].value) ? results[1].value : [],
      error: results.some((result) => result.status === "rejected" || !Array.isArray(result.value))
    };
    reader.pending = false;
    for (const listener of reader.listeners) listener(reader.snapshot);
    if (reader.again && reader.listeners.size) {
      reader.again = false;
      void refresh();
    }
  };
  if (reader.listeners.size === 1) {
    const connection = hass.connection;
    const subscribe = (promise) => Promise.resolve(promise).then((unsubscribe) => {
      if (reader.listeners.size) reader.cleanups.push(unsubscribe);
      else unsubscribe();
    }).catch(() => {
    });
    if (connection?.subscribeEvents) subscribe(connection.subscribeEvents(refresh, "entity_registry_updated"));
    if (connection?.subscribeMessage) subscribe(connection.subscribeMessage(refresh, { type: "smart_irrigation_config_updated" }));
    if (connection?.addEventListener) {
      connection.addEventListener("ready", refresh);
      reader.cleanups.push(() => connection.removeEventListener("ready", refresh));
    }
    void refresh();
  }
  return () => {
    reader.listeners.delete(callback);
    if (!reader.listeners.size) {
      reader.cleanups.splice(0).forEach((cleanup) => cleanup());
      readers.delete(key);
    }
  };
}
function sameEntities(a, b) {
  return entityKeys.every((key) => a?.[key] === b?.[key]);
}

// src/editor.js
var labels = {
  de: { entity: "Berechnete Dauer (Smart Irrigation)", name: "Zonenname", icon: "Symbol", irrigation_needed_entity: "Bew\xE4sserung n\xF6tig", bucket_entity: "Wasserbilanz (live)", water_used_entity: "Wasserverbrauch", moisture_entity: "Bodenfeuchte", valve_entity: "Ventil (optional)", bucket_min: "Wasserbilanz: Skalenminimum (< 0)", bucket_max: "Wasserbilanz: Skalenmaximum (> 0)", show_control: "Manuelle Ventilsteuerung anzeigen", confirm_open: "Vor manuellem \xD6ffnen best\xE4tigen", language: "Sprache" },
  en: { entity: "Calculated duration (Smart Irrigation)", name: "Zone name", icon: "Icon", irrigation_needed_entity: "Irrigation needed", bucket_entity: "Water balance (live)", water_used_entity: "Water used", moisture_entity: "Soil moisture", valve_entity: "Valve (optional)", bucket_min: "Water balance: scale minimum (< 0)", bucket_max: "Water balance: scale maximum (> 0)", show_control: "Show manual valve control", confirm_open: "Confirm before opening manually", language: "Language" }
};
Object.assign(labels.de, { zone: "Smart-Irrigation-Zone", overrides: "Sensoren \xFCberschreiben (optional)" });
Object.assign(labels.en, { zone: "Smart Irrigation zone", overrides: "Override sensors (optional)" });
var IrrigationZoneEditor = class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  setConfig(config) {
    this._config = { ...config };
    this._render();
  }
  connectedCallback() {
    this._watch();
    this._render();
  }
  disconnectedCallback() {
    this._unwatch?.();
    this._unwatch = null;
    this._connection = null;
  }
  set hass(hass) {
    this._hass = hass;
    this._watch();
    this._render();
  }
  _watch() {
    if (!this.isConnected || !this._hass?.callWS) return;
    const connection = this._hass.connection || this._hass;
    if (this._connection === connection) return;
    this._unwatch?.();
    this._discovery = null;
    this._connection = connection;
    this._unwatch = watchDiscovery(this._hass, (snapshot) => {
      this._discovery = snapshot;
      this._render();
    });
  }
  _render() {
    if (!this._config || !this._hass) return;
    if (!this._form) {
      this.shadowRoot.innerHTML = '<style>.notice{font-size:12px;color:var(--secondary-text-color);margin:12px 0}summary{cursor:pointer;padding:16px 0}</style><ha-form id="main"></ha-form><div class="notice" role="status"></div><details><summary></summary><ha-form id="overrides"></ha-form></details>';
      this._form = this.shadowRoot.querySelector("#main");
      this._overrides = this.shadowRoot.querySelector("#overrides");
      const onChange = (event) => {
        event.stopPropagation();
        const config = { ...this._config, ...event.detail.value };
        if (String(config.zone ?? "") !== String(this._config.zone ?? "")) {
          for (const key of entityKeys) delete config[key];
          delete config.name;
        }
        for (const key of Object.keys(config)) if (config[key] === "" || config[key] === null || config[key] === void 0) delete config[key];
        this._config = config;
        this._render();
        this.dispatchEvent(new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true }));
      };
      this._form.addEventListener("value-changed", onChange);
      this._overrides.addEventListener("value-changed", onChange);
    }
    const lang = this._config.language && this._config.language !== "auto" ? this._config.language : this._hass.language;
    const de = lang?.startsWith("de");
    const label = (schema) => labels[de ? "de" : "en"][schema.name] || schema.name;
    const zones = this._discovery?.zones || [];
    const options = [{ value: "", label: de ? "Manuell konfigurieren" : "Configure manually" }, ...zones.map((zone) => ({ value: String(zone.id), label: `${zone.name} (${zone.id})` }))];
    if (hasZone(this._config) && !zones.some((zone) => String(zone.id) === String(this._config.zone))) options.push({ value: String(this._config.zone), label: `Zone ${this._config.zone}` });
    this._form.schema = [
      { name: "zone", selector: { select: { options } } },
      { name: "name", selector: { text: {} } },
      { name: "icon", selector: { icon: {} } },
      { name: "show_control", selector: { boolean: {} } },
      { name: "confirm_open", selector: { boolean: {} } },
      { name: "language", selector: { select: { options: [{ value: "auto", label: "Auto" }, { value: "de", label: "Deutsch" }, { value: "en", label: "English" }] } } }
    ];
    this._overrides.schema = [
      ...entityKeys.map((name) => ({ name, required: name === "entity" && !hasZone(this._config), selector: { entity: { domain: name === "valve_entity" ? ["switch", "valve"] : name === "irrigation_needed_entity" ? "binary_sensor" : "sensor" } } })),
      { name: "bucket_min", selector: { number: { mode: "box", min: -1e4, max: -0.01, step: "any" } } },
      { name: "bucket_max", selector: { number: { mode: "box", min: 0.01, max: 1e4, step: "any" } } }
    ];
    for (const form of [this._form, this._overrides]) {
      form.hass = this._hass;
      form.data = { show_control: true, confirm_open: true, language: "auto", ...this._config, zone: hasZone(this._config) ? String(this._config.zone) : "" };
      form.computeLabel = label;
    }
    this.shadowRoot.querySelector("summary").textContent = label({ name: "overrides" });
    if (!hasZone(this._config)) this.shadowRoot.querySelector("details").open = true;
    this.shadowRoot.querySelector(".notice").textContent = this._discovery?.error ? de ? "Automatische Zuordnung nicht verf\xFCgbar. Entit\xE4ten k\xF6nnen manuell eingetragen werden." : "Automatic discovery unavailable. You can configure entities manually." : de ? "Die Zone ordnet Sensoren, Bodenfeuchte und verkn\xFCpftes Ventil automatisch zu. Ein Zonenwechsel setzt manuelle Sensorzuordnungen und den Namen zur\xFCck." : "The zone automatically assigns sensors, soil moisture and the linked valve. Changing zones clears sensor overrides and the name.";
  }
};
if (!customElements.get("irrigation-zone-card-editor")) customElements.define("irrigation-zone-card-editor", IrrigationZoneEditor);

// src/card.js
var translations = {
  de: { zone: "Bew\xE4sserungszone", watering: "Ventil aktiv", needed: "Bew\xE4sserung n\xF6tig", balanced: "Kein Wasserbedarf", unknown: "Wasserbedarf unbekannt", moisture: "Bodenfeuchte", balance: "Wasserbilanz \xB7 live", reserve: "Wasservorrat", deficit: "Wasserdefizit", neutral: "Ausgeglichen", duration: "Berechnete Dauer", used: "Wasserverbrauch", valve: "Zonenventil", open: "\xD6ffnen", close: "Schlie\xDFen", opening: "\xD6ffnet \u2026", closing: "Schlie\xDFt \u2026", on: "Ge\xF6ffnet", off: "Geschlossen", unavailable: "Nicht verf\xFCgbar", pending: "Wird gesendet \u2026", confirm: "Ventil manuell \xF6ffnen? Es bleibt ge\xF6ffnet, bis es geschlossen wird. Die berechnete Dauer startet keinen Timer.", manual: "Manuell \xB7 ohne Abschalttimer", failed: "Ventil konnte nicht geschaltet werden.", missing: "Nicht verf\xFCgbar", details: "Zonendetails \xF6ffnen", noData: "Die konfigurierten Sensoren liefern noch keine Werte." },
  en: { zone: "Irrigation zone", watering: "Valve active", needed: "Irrigation needed", balanced: "No irrigation needed", unknown: "Water demand unknown", moisture: "Soil moisture", balance: "Water balance \xB7 live", reserve: "Water reserve", deficit: "Water deficit", neutral: "Balanced", duration: "Calculated duration", used: "Water used", valve: "Zone valve", open: "Open", close: "Close", opening: "Opening \u2026", closing: "Closing \u2026", on: "Open", off: "Closed", unavailable: "Unavailable", pending: "Sending \u2026", confirm: "Open valve manually? It stays open until closed. The calculated duration does not start a timer.", manual: "Manual \xB7 no shutoff timer", failed: "Could not control the valve.", missing: "Unavailable", details: "Open zone details", noData: "The configured sensors have no readings yet." }
};
Object.assign(translations.de, { sharedValve: "Gemeinsames Ventil", loading: "Zone wird geladen \u2026", zoneMissing: "Die ausgew\xE4hlte Smart-Irrigation-Zone wurde nicht gefunden.", discoveryFailed: "Automatische Zuordnung nicht verf\xFCgbar. Verbindung und Smart-Irrigation-Integration pr\xFCfen oder Entit\xE4ten manuell eintragen.", autoMissing: "Sensoren nicht automatisch gefunden (optional manuell zuweisen)" });
Object.assign(translations.en, { sharedValve: "Shared valve", loading: "Loading zone \u2026", zoneMissing: "The selected Smart Irrigation zone was not found.", discoveryFailed: "Automatic discovery unavailable. Check the connection and Smart Irrigation integration or configure entities manually.", autoMissing: "Sensors not discovered (assign manually if needed)" });
var escape = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
var icon = (value) => `<ha-icon icon="${escape(value)}"></ha-icon>`;
var IrrigationZoneCard = class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._pending = false;
  }
  connectedCallback() {
    this._watchDiscovery();
  }
  disconnectedCallback() {
    this._unwatch?.();
    this._unwatch = null;
    this._connection = null;
  }
  setConfig(config) {
    this._config = validateConfig(config);
    this._watchDiscovery();
    this._render();
  }
  _watchDiscovery() {
    const connection = this._hass?.connection || this._hass;
    if (!this.isConnected || !hasZone(this._config) || !this._hass?.callWS) {
      if (!hasZone(this._config)) {
        this._unwatch?.();
        this._unwatch = null;
        this._connection = null;
        this._discovery = null;
      }
      return;
    }
    if (this._connection === connection) return;
    this._unwatch?.();
    this._discovery = null;
    this._connection = connection;
    this._unwatch = watchDiscovery(this._hass, (snapshot) => {
      this._discovery = snapshot;
      this._render();
    });
  }
  _resolved() {
    return resolveZone(this._config, this._discovery);
  }
  set hass(value) {
    const old = this._hass;
    const previous = this._config ? this._resolved() : null;
    this._hass = value;
    if (!this._config) return;
    this._watchDiscovery();
    const resolved = this._resolved();
    if (!old || old.language !== value.language || old.locale !== value.locale || old.themes !== value.themes || !sameEntities(previous, resolved) || entityKeys.some((key) => old.states[resolved[key]] !== value.states[resolved[key]])) this._render();
  }
  getCardSize() {
    return this._config?.valve_entity ? 9 : 8;
  }
  getGridOptions() {
    return { columns: 12, rows: "auto", min_columns: 6 };
  }
  static getConfigElement() {
    return document.createElement("irrigation-zone-card-editor");
  }
  static getStubConfig(hass) {
    const entity = Object.keys(hass?.states || {}).find((id) => id.startsWith("sensor.smart_irrigation_") && hass.states[id].attributes?.device_class === "duration");
    const zone = hass?.states[entity]?.attributes?.id;
    if (Number.isSafeInteger(zone) && zone >= 0) return { zone };
    if (!entity) return { entity: "sensor.smart_irrigation_zone" };
    const result = { entity };
    for (const [key, id] of Object.entries({ irrigation_needed_entity: entity.replace("sensor.", "binary_sensor.") + "_irrigation_needed", bucket_entity: entity + "_live_bucket", water_used_entity: entity + "_water_used" })) {
      if (hass.states[id]) result[key] = id;
    }
    return result;
  }
  _number(number, signed = false) {
    if (number === null) return "\u2014";
    return new Intl.NumberFormat(this._hass.locale?.language || this._hass.language || "en", { maximumFractionDigits: 1, signDisplay: signed ? "exceptZero" : "auto" }).format(number);
  }
  _state(id) {
    const state = this._hass.states[id];
    if (!state || ["unknown", "unavailable"].includes(state.state)) return "\u2014";
    return this._hass.formatEntityState ? this._hass.formatEntityState(state) : `${state.state} ${state.attributes?.unit_of_measurement || ""}`.trim();
  }
  _more(id) {
    if (id) this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: id }, bubbles: true, composed: true }));
  }
  async _control() {
    if (this._pending) return;
    const config = this._resolved();
    const model = zoneModel(config, this._hass.states);
    const action = model.action;
    if (!action) return;
    if (["turn_on", "open_valve"].includes(action.service) && config.confirm_open && !window.confirm(`${config._sharedValve ? this._t.sharedValve + " " : ""}${this._t.confirm}`)) return;
    this._pending = true;
    this._error = "";
    this._render();
    try {
      await this._hass.callService(action.domain, action.service, { entity_id: config.valve_entity });
    } catch (error) {
      this._error = `${this._t.failed} ${error?.message || ""}`;
    } finally {
      this._pending = false;
      this._render();
    }
  }
  _render() {
    if (!this._config || !this._hass) return;
    this.toggleAttribute("dark", !!this._hass.themes?.darkMode);
    const focused = this.shadowRoot.activeElement;
    const focusTarget = focused?.id ? { id: focused.id } : focused?.dataset.entity ? { entity: focused.dataset.entity } : focused?.classList.contains("more") ? { more: true } : null;
    const config = this._resolved();
    const lang = config.language === "auto" || !config.language ? this._hass.language : config.language;
    const t = this._t = translations[lang?.startsWith("de") ? "de" : "en"];
    const m = zoneModel(config, this._hass.states);
    const name = config.name || m.main?.attributes?.friendly_name?.replace(/ (Dauer|Duration)$/i, "") || "Smart Irrigation";
    const duration = durationParts(m.main);
    const durationHTML = duration ? `${escape(this._number(duration.value))} <small>${escape(duration.unit)}${duration.remainder ? ` ${duration.remainder} ${duration.remainderUnit}` : ""}</small>` : "\u2014";
    const missing = entityKeys.filter((key) => config[key] && (!this._hass.states[config[key]] || ["unknown", "unavailable"].includes(this._hass.states[config[key]].state)));
    const valveState = { on: t.on, open: t.on, off: t.off, closed: t.off, opening: t.opening, closing: t.closing }[m.valve?.state] || t.unavailable;
    const close = ["turn_off", "close_valve"].includes(m.action?.service);
    const moistureUnit = this._hass.states[config.moisture_entity]?.attributes?.unit_of_measurement || "";
    this.shadowRoot.innerHTML = `<style>${styles}</style><ha-card><div class="wrap">
      <header><div class="zone-icon">${icon(config.icon || "mdi:sprinkler-variant")}</div><div class="heading"><div class="eyebrow">${escape(t.zone)}</div><h2>${escape(name)}</h2></div><button class="more" aria-label="${escape(t.details)}">${icon("mdi:dots-horizontal")}</button></header>
      <div class="status ${m.status}" role="status"><span class="dot"></span>${escape(t[m.status])}</div>
      ${config.moisture_entity || config.bucket_entity ? `<div class="overview">
        ${config.moisture_entity ? `<button class="ring ring-button" data-entity="${escape(config.moisture_entity)}" aria-label="${escape(t.moisture + ": " + this._state(config.moisture_entity))}">
          <svg viewBox="0 0 120 120" aria-hidden="true"><circle class="track" cx="60" cy="60" r="54" fill="none" stroke-width="5"/><circle class="arc" cx="60" cy="60" r="54" fill="none" stroke-width="5" pathLength="100" stroke-dasharray="${m.moistureFill} 100"/></svg>
          <div class="ring-content">${icon("mdi:sprout")}<div class="ring-value">${escape(this._number(m.moisture))}<small>${escape(m.moisture === null ? "" : moistureUnit)}</small></div><div class="ring-label">${escape(t.moisture)}</div></div>
        </button>` : ""}
        ${config.bucket_entity ? `<div class="balance ${m.balance < 0 ? "deficit" : ""}" style="--zero:${m.zero}%;--position:${m.position ?? m.zero}%">
          <div class="label">${escape(t.balance)}</div><div class="balance-value">${escape(this._number(m.balance, true))} <small>${escape(this._hass.states[config.bucket_entity]?.attributes?.unit_of_measurement || "")}</small></div>
          <div class="hint">${escape(m.balance === null ? t.unavailable : m.balance < 0 ? t.deficit : m.balance > 0 ? t.reserve : t.neutral)}</div>
          <div class="balance-bar" role="img" aria-label="${escape(t.balance + ": " + this._state(config.bucket_entity))}"><span class="zero"></span>${m.position === null ? "" : '<span class="marker"></span>'}</div><div class="scale"><span>${escape(this._number(m.min))}</span><span class="center">0</span><span>+${escape(this._number(m.max))}</span></div>
        </div>` : ""}
      </div>` : '<div class="empty-overview"></div>'}
      <div class="stats"><button class="stat" data-entity="${escape(config.entity)}">${icon("mdi:timer-outline")}<div><div class="stat-value">${durationHTML}</div><div class="label">${escape(t.duration)}</div></div></button>
      ${config.water_used_entity ? `<button class="stat" data-entity="${escape(config.water_used_entity)}">${icon("mdi:water-outline")}<div><div class="stat-value">${escape(this._state(config.water_used_entity))}</div><div class="label">${escape(t.used)}</div></div></button>` : ""}</div>
      ${config.valve_entity ? `<div class="control">${icon(m.active ? "mdi:pipe-valve" : "mdi:valve-closed")}<div class="control-copy"><div class="control-title">${escape(config._sharedValve ? t.sharedValve : t.valve)} \xB7 ${escape(valveState)}</div><div class="control-state">${escape(t.manual)}</div></div>${config.show_control ? `<button id="control" class="${close ? "close" : ""}" ${!m.action || this._pending ? "disabled" : ""}>${escape(this._pending ? t.pending : close ? t.close : t.open)}</button>` : ""}</div>` : ""}
      ${config._discoveryIssue ? `<div class="notice" role="status">${escape(t[config._discoveryIssue])}</div>` : ""}
      ${config._autoMissing?.length ? `<div class="notice">${escape(t.autoMissing)}: ${config._autoMissing.map(escape).join(", ")}</div>` : ""}
      ${missing.length ? `<div class="notice">${escape(t.missing)}: ${missing.map((key) => escape(config[key])).join(", ")}</div>` : ""}
      ${this._error ? `<div role="alert" class="notice error">${escape(this._error)}</div>` : ""}
    </div></ha-card>`;
    this.shadowRoot.querySelector(".more").addEventListener("click", () => this._more(config.entity));
    this.shadowRoot.querySelectorAll("[data-entity]").forEach((button) => button.addEventListener("click", () => this._more(button.dataset.entity)));
    this.shadowRoot.querySelector("#control")?.addEventListener("click", () => this._control());
    if (focusTarget) {
      const buttons = [...this.shadowRoot.querySelectorAll("button")];
      buttons.find((button) => focusTarget.id ? button.id === focusTarget.id : focusTarget.entity ? button.dataset.entity === focusTarget.entity : button.classList.contains("more"))?.focus({ preventScroll: true });
    }
  }
};
if (!customElements.get("irrigation-zone-card")) customElements.define("irrigation-zone-card", IrrigationZoneCard);
window.customCards = window.customCards || [];
if (!window.customCards.some((card) => card.type === "irrigation-zone-card")) window.customCards.push({ type: "irrigation-zone-card", name: "Irrigation Zone", description: "Smart Irrigation: water balance, soil moisture and zone valve.", preview: true, documentationURL: "https://github.com/lweberru/ha_irrigation_zone_card" });
export {
  IrrigationZoneCard,
  translations
};
