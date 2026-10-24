/* Irrigation Zone Card v0.3.0 | MIT License */

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

// src/overview-data.js
var readers2 = /* @__PURE__ */ new WeakMap();
function watchOverview(hass, callback) {
  const key = hass.connection || hass;
  let reader = readers2.get(key);
  if (!reader) {
    reader = { hass, listeners: /* @__PURE__ */ new Set(), snapshot: null, pending: false, again: false, cleanup: [], timer: null };
    readers2.set(key, reader);
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
    const results = await Promise.allSettled(["info", "config"].map((path) => Promise.resolve().then(() => reader.hass.callWS({ type: `smart_irrigation/${path}` }))));
    const valid = (result) => result.status === "fulfilled" && result.value !== null && typeof result.value === "object" && !Array.isArray(result.value);
    reader.snapshot = { info: valid(results[0]) ? results[0].value : null, config: valid(results[1]) ? results[1].value : null, error: results.some((result) => !valid(result)) };
    reader.pending = false;
    for (const listener of reader.listeners) listener(reader.snapshot);
    if (reader.again && reader.listeners.size) {
      reader.again = false;
      void refresh();
    }
  };
  if (reader.listeners.size === 1) {
    const connection = hass.connection;
    if (connection?.subscribeMessage) Promise.resolve(connection.subscribeMessage(refresh, { type: "smart_irrigation_config_updated" })).then((unsubscribe) => {
      if (reader.listeners.size) reader.cleanup.push(unsubscribe);
      else unsubscribe();
    }).catch(() => {
    });
    if (connection?.addEventListener) {
      connection.addEventListener("ready", refresh);
      reader.cleanup.push(() => connection.removeEventListener("ready", refresh));
    }
    reader.timer = setInterval(refresh, 6e4);
    reader.timer.unref?.();
    void refresh();
  }
  return { refresh, unsubscribe: () => {
    reader.listeners.delete(callback);
    if (!reader.listeners.size) {
      clearInterval(reader.timer);
      reader.cleanup.splice(0).forEach((cleanup) => cleanup());
      readers2.delete(key);
    }
  } };
}

// src/overview-model.js
var overviewEntityKeys = ["automation_entity", "main_valve_entity", "calculate_entity", "update_weather_entity", "precipitation_switch_entity", "precipitation_threshold_entity"];
var globalRoles = {
  calculate_entity: ["button", "smart_irrigation_calculate_all"],
  update_weather_entity: ["button", "smart_irrigation_update_weather"],
  precipitation_switch_entity: ["switch", "smart_irrigation_skip_irrigation_on_precipitation"],
  precipitation_threshold_entity: ["number", "smart_irrigation_precipitation_threshold"]
};
function validateOverviewConfig(config) {
  if (!config || typeof config !== "object") throw new Error("Invalid overview configuration.");
  for (const key of overviewEntityKeys) {
    if (config[key] !== void 0 && config[key] !== "" && (typeof config[key] !== "string" || !/^[a-z_]+\.[a-z0-9_]+$/.test(config[key]))) throw new Error(`${key}: invalid entity ID`);
    if (!config[key]) continue;
    const domains = key === "automation_entity" ? ["automation"] : key === "main_valve_entity" ? ["switch", "valve"] : [globalRoles[key][0]];
    if (!domains.includes(config[key].split(".")[0])) throw new Error(`${key}: expected ${domains.join(" or ")}.`);
  }
  if (config.language !== void 0 && !["auto", "de", "en"].includes(config.language)) throw new Error("language must be auto, de or en.");
  for (const key of ["name", "icon"]) if (config[key] !== void 0 && typeof config[key] !== "string") throw new Error(`${key} must be a string.`);
  if (config.show_actions !== void 0 && typeof config.show_actions !== "boolean") throw new Error("show_actions must be a boolean.");
  return { show_actions: true, ...config };
}
function resolveOverview(config, discovery) {
  const result = { ...config };
  for (const [key, [domain, uniqueId]] of Object.entries(globalRoles)) {
    if (result[key]) continue;
    const entries = (discovery?.registry || []).filter((entry) => entry.platform === "smart_irrigation" && entry.unique_id === uniqueId && !entry.disabled_by && entry.entity_id?.startsWith(domain + "."));
    if (entries.length === 1) result[key] = entries[0].entity_id;
  }
  return result;
}
function overviewModel(config, states, system, discovery) {
  const info = system?.info;
  const settings = system?.config;
  const allChecks = Array.isArray(info?.skip_preview?.checks) ? info.skip_preview.checks : [];
  const checks = allChecks.filter((check) => check.enabled === true);
  const rain = allChecks.find((check) => check.id === "precipitation");
  const forecast = numeric(rain?.forecast_mm);
  const threshold = numeric(rain?.threshold_mm);
  const duration = numeric(info?.next_irrigation_duration);
  const zoneCount = Array.isArray(discovery?.zones) && !discovery?.error ? discovery.zones.length : null;
  const needed = Array.isArray(info?.next_irrigation_zones) ? info.next_irrigation_zones.length : null;
  const automation = states[config.automation_entity]?.state;
  const running = Array.isArray(settings?.active_valve_runs) && settings.active_valve_runs.length > 0;
  let status = "unknown";
  if (system?.error || !info || !settings) status = "unknown";
  else if (running) status = "running";
  else if (automation === "off") status = "paused";
  else if (config.automation_entity && automation !== "on") status = "unknown";
  else if (info.skip_preview?.should_skip === true) status = "blocked";
  else if (duration === 0) status = "noDemand";
  else if (duration > 0) status = info.start_trigger_armed === true ? "scheduled" : "demand";
  return {
    info,
    settings,
    checks,
    rain,
    forecast,
    threshold,
    duration,
    zoneCount,
    needed,
    automation,
    running,
    status,
    rainFill: forecast !== null && threshold > 0 ? Math.min(100, forecast / threshold * 100) : null,
    estimated: info?.durations_estimated === true,
    valveState: states[config.main_valve_entity]?.state,
    stale: Array.isArray(info?.stale_zones) && info.stale_zones.length > 0
  };
}
function overviewAction(config, states, key) {
  const entity = config[key];
  const state = states[entity]?.state;
  if (!entity || state === void 0 || state === "unavailable") return null;
  if (["calculate_entity", "update_weather_entity"].includes(key) && entity.startsWith("button.")) return { domain: "button", service: "press", entity };
  if (key === "automation_entity" && entity.startsWith("automation.") && ["on", "off"].includes(state)) return { domain: "automation", service: state === "on" ? "turn_off" : "turn_on", entity };
  if (key === "precipitation_switch_entity" && entity.startsWith("switch.") && ["on", "off"].includes(state)) return { domain: "switch", service: state === "on" ? "turn_off" : "turn_on", entity };
  return null;
}

// src/overview-editor.js
var labels2 = {
  de: { name: "Titel", icon: "Symbol", language: "Sprache", show_actions: "Zentrale Aktionen anzeigen", automation_entity: "Eigene Bew\xE4sserungsautomation (optional)", main_valve_entity: "Hauptventil (optional, Status und Details)", calculate_entity: "Alle berechnen (automatisch erkannt)", update_weather_entity: "Wetter aktualisieren (automatisch erkannt)", precipitation_switch_entity: "Regenprognose-Sperre (automatisch erkannt)", precipitation_threshold_entity: "Regenschwelle (automatisch erkannt)" },
  en: { name: "Title", icon: "Icon", language: "Language", show_actions: "Show central actions", automation_entity: "External irrigation automation (optional)", main_valve_entity: "Main valve (optional, status and details)", calculate_entity: "Calculate all (auto-discovered)", update_weather_entity: "Update weather (auto-discovered)", precipitation_switch_entity: "Forecast rain protection (auto-discovered)", precipitation_threshold_entity: "Rain threshold (auto-discovered)" }
};
var IrrigationOverviewEditor = class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  setConfig(config) {
    this._config = { ...config };
    this._render();
  }
  set hass(hass) {
    this._hass = hass;
    this._render();
  }
  _render() {
    if (!this._config || !this._hass) return;
    if (!this._form) {
      this.shadowRoot.innerHTML = "<ha-form></ha-form>";
      this._form = this.shadowRoot.firstElementChild;
      this._form.schema = [
        { name: "name", selector: { text: {} } },
        { name: "icon", selector: { icon: {} } },
        ...overviewEntityKeys.map((name) => ({ name, selector: { entity: { domain: name === "automation_entity" ? "automation" : name === "main_valve_entity" ? ["switch", "valve"] : name.endsWith("switch_entity") ? "switch" : name.endsWith("threshold_entity") ? "number" : "button" } } })),
        { name: "show_actions", selector: { boolean: {} } },
        { name: "language", selector: { select: { options: [{ value: "auto", label: "Auto" }, { value: "de", label: "Deutsch" }, { value: "en", label: "English" }] } } }
      ];
      this._form.addEventListener("value-changed", (event) => {
        event.stopPropagation();
        const config = { ...this._config, ...event.detail.value };
        for (const key of Object.keys(config)) if (config[key] === "" || config[key] === null || config[key] === void 0) delete config[key];
        this._config = config;
        this.dispatchEvent(new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true }));
      });
    }
    const lang = this._config.language && this._config.language !== "auto" ? this._config.language : this._hass.language;
    this._form.hass = this._hass;
    this._form.data = { show_actions: true, language: "auto", ...this._config };
    this._form.computeLabel = (field) => labels2[lang?.startsWith("de") ? "de" : "en"][field.name] || field.name;
  }
};
if (!customElements.get("irrigation-overview-card-editor")) customElements.define("irrigation-overview-card-editor", IrrigationOverviewEditor);

// src/overview-card.js
var text = {
  de: { title: "Bew\xE4sserung", eyebrow: "Smart Irrigation \xB7 Zentrale", unknown: "Status unbekannt", running: "Bew\xE4sserung aktiv", paused: "Automatik pausiert", blocked: "Bew\xE4sserung zur\xFCckgestellt", noDemand: "Kein Bedarf eingeplant", scheduled: "Start vorgemerkt", demand: "Wasserbedarf vorhanden", planning: "N\xE4chster Planzeitpunkt", notArmed: "Start nicht vorgemerkt", armed: "Start vorgemerkt", noStart: "Kein Startzeitpunkt gew\xE4hlt", duration: "Gesamtbedarf", estimated: "Prognose", calculated: "Berechnet", zones: "Zonen mit Bedarf", of: "von", forecast: "Regenprognose", threshold: "Regengrenze", window: "Zeitraum", hours: "h", rainProtection: "Regenprognose-Sperre", freeze: "Frostschutz", rain_sensor: "Regensensor", wind: "Windschutz", precipitation: "Regenprognose", soil_moisture: "Bodenfeuchte", days_between: "Bew\xE4sserungsabstand", postponed: "Aufschub", clear: "Freigegeben", held: "Sperrt", unavailable: "Nicht verf\xFCgbar", disabled: "Ausgeschaltet", active: "Aktiv", inactive: "Aus", limit: "Grenze", heldZones: "Zonen zur\xFCckgestellt", checks: "Schutz & Sperrgr\xFCnde", weather: "Wetterquelle", calculation: "Automatische Berechnung", automatic: "Aktiv", manual: "Aus", calculate: "Alle berechnen", update: "Wetter aktualisieren", automation: "Bew\xE4sserungsautomatik", enable: "Aktivieren", pause: "Pausieren", disable: "Deaktivieren", mainValve: "Hauptventil", on: "Ge\xF6ffnet", off: "Geschlossen", opening: "\xD6ffnet", closing: "Schlie\xDFt", refresh: "Planung neu laden", sending: "Wird gesendet \u2026", error: "Aktion fehlgeschlagen.", offline: "Zentrale Daten nicht verf\xFCgbar. Verbindung und Smart Irrigation pr\xFCfen.", loading: "Planung wird geladen \u2026", stale: "Smart Irrigation meldet veraltete Zonendaten.", external: "Ventile werden \xFCber eigene Automationen gesteuert.", direct: "Direkte Ventilsteuerung durch Smart Irrigation.", forecastNote: "Vorschau der Integrationsplanung; Bedarf und Sperren k\xF6nnen sich bis zum Start \xE4ndern.", noChecks: "Keine aktiven Schutzpr\xFCfungen gemeldet.", missing: "Konfigurierte Entit\xE4t nicht verf\xFCgbar", day: "Tage", freezeOff: "Der Frostschutz ist in Smart Irrigation ausgeschaltet.", freezeUnknown: "Kein g\xFCltiger Temperaturwert verf\xFCgbar.", at: "um", freezeLimit: "Frostgrenze", noFreeze: "Kein Frosthindernis", freezeBlocked: "Frostsperre aktiv", pendingCheck: "Pr\xFCfung nicht gemeldet" },
  en: { title: "Irrigation", eyebrow: "Smart Irrigation \xB7 Overview", unknown: "Status unknown", running: "Irrigation active", paused: "Automation paused", blocked: "Irrigation deferred", noDemand: "No demand planned", scheduled: "Start armed", demand: "Water demand detected", planning: "Next planned start", notArmed: "Start not armed", armed: "Start armed", noStart: "No start trigger selected", duration: "Total demand", estimated: "Forecast", calculated: "Calculated", zones: "Zones needing water", of: "of", forecast: "Rain forecast", threshold: "Rain threshold", window: "Window", hours: "h", rainProtection: "Forecast rain protection", freeze: "Frost protection", rain_sensor: "Rain sensor", wind: "Wind protection", precipitation: "Rain forecast", soil_moisture: "Soil moisture", days_between: "Watering interval", postponed: "Postponed", clear: "Clear", held: "Blocking", unavailable: "Unavailable", disabled: "Disabled", active: "Active", inactive: "Off", limit: "Limit", heldZones: "zones deferred", checks: "Protection & skip conditions", weather: "Weather source", calculation: "Automatic calculation", automatic: "Enabled", manual: "Off", calculate: "Calculate all", update: "Update weather", automation: "Irrigation automation", enable: "Enable", pause: "Pause", disable: "Disable", mainValve: "Main valve", on: "Open", off: "Closed", opening: "Opening", closing: "Closing", refresh: "Reload planning", sending: "Sending \u2026", error: "Action failed.", offline: "Central data unavailable. Check the connection and Smart Irrigation.", loading: "Loading planning \u2026", stale: "Smart Irrigation reports stale zone data.", external: "Valves are controlled by external automations.", direct: "Smart Irrigation controls valves directly.", forecastNote: "Integration planning preview; demand and skip conditions may change before the start.", noChecks: "No active protection checks reported.", missing: "Configured entity unavailable", day: "days", freezeOff: "Frost protection is disabled in Smart Irrigation.", freezeUnknown: "No valid temperature reading available.", at: "at", freezeLimit: "Frost threshold", noFreeze: "No frost restriction", freezeBlocked: "Frost protection blocking", pendingCheck: "Check not reported" }
};
var esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
var icon = (value) => `<ha-icon icon="${esc(value)}"></ha-icon>`;
var extraStyles = `
.system-status{margin:24px 0 4px;display:flex;gap:12px;align-items:center}.system-status .symbol{height:42px;width:42px;display:grid;place-items:center;background:color-mix(in srgb,var(--iz-green) 12%,transparent);color:var(--iz-green);border-radius:50%;flex-shrink:0}.system-status strong{font-size:18px;font-weight:550;line-height:1.35}.system-status.blocked .symbol,.system-status.paused .symbol{color:var(--iz-amber);background:color-mix(in srgb,var(--iz-amber) 12%,transparent)}.plan{margin-top:22px;padding:19px;border-radius:18px;background:color-mix(in srgb,var(--iz-green) 7%,transparent)}.plan-date{font-size:22px;font-weight:550;letter-spacing:-.6px;margin:8px 0;line-height:1.3}.plan-note{font-size:11px;color:var(--secondary-text-color,#77877f)}.totals{display:grid;grid-template-columns:1fr 1fr;margin-top:18px;padding-top:16px;border-top:1px solid var(--divider-color,#e1e9e3);gap:12px}.total strong{display:block;font-size:25px;font-weight:550;letter-spacing:-.5px}.total small{font-size:11px;font-weight:400;letter-spacing:0}.total .label{font-size:10px;margin-top:4px}.section-label{font-size:10px;font-weight:650;letter-spacing:1.3px;text-transform:uppercase;color:var(--secondary-text-color,#77877f);margin:22px 0 12px}.frost{display:flex;align-items:center;gap:14px;padding:16px;border:1px solid color-mix(in srgb,var(--iz-blue) 22%,transparent);border-radius:16px;background:color-mix(in srgb,var(--iz-blue) 6%,transparent)}.frost>ha-icon{--mdc-icon-size:28px;color:var(--iz-blue)}.frost .reading{font-size:23px;font-weight:550;white-space:nowrap}.frost .frost-copy{flex:1;min-width:0}.frost strong{font-size:12px;display:block}.frost p{font-size:10px;margin:5px 0 0;color:var(--secondary-text-color,#77877f);line-height:1.4}.frost.blocking{border-color:var(--iz-amber)}.frost.blocking>ha-icon{color:var(--iz-amber)}.frost.unknown{opacity:.8}.protections{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:10px}.check{padding:12px;border-radius:12px;background:color-mix(in srgb,var(--primary-text-color,#233c33) 4%,transparent);min-width:0}.check-title{display:flex;align-items:center;gap:6px;font-size:11px}.check-title ha-icon{--mdc-icon-size:16px;color:var(--iz-green)}.check.blocking .check-title ha-icon{color:var(--iz-amber)}.check.unknown .check-title ha-icon{color:var(--secondary-text-color,#77877f)}.check-result{font-size:10px;color:var(--secondary-text-color,#77877f);margin-top:6px;overflow-wrap:anywhere}.rain{margin:18px 0}.rain-heading{display:flex;align-items:baseline;justify-content:space-between;gap:12px}.rain-heading strong{font-size:25px;font-weight:550;color:var(--iz-blue);white-space:nowrap}.rain-heading small{font-size:12px}.rain-track{height:7px;border-radius:8px;background:color-mix(in srgb,var(--iz-blue) 15%,transparent);margin:10px 0 7px;overflow:hidden}.rain-fill{height:100%;background:var(--iz-blue);border-radius:8px}.rain-limit{font-size:10px;color:var(--secondary-text-color,#77877f)}.settings{margin-top:20px;border-top:1px solid var(--divider-color,#e1e9e3);padding-top:6px}.setting{display:flex;align-items:center;gap:12px;padding:11px 0;font-size:12px;min-height:48px}.setting>ha-icon{color:var(--iz-green);--mdc-icon-size:19px}.setting-copy{flex:1;min-width:0}.setting-copy .label{font-size:10px;margin-top:4px}.text-action{border:0;background:color-mix(in srgb,var(--iz-green) 10%,transparent);color:var(--iz-green);padding:9px 12px;min-height:40px;border-radius:10px;font-size:11px;font-weight:550;max-width:55%;overflow-wrap:anywhere}.facts{display:flex;justify-content:space-between;gap:12px;font-size:10px;margin-top:18px;color:var(--secondary-text-color,#77877f);line-height:1.6}.facts span{max-width:52%;overflow-wrap:anywhere}.actions{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:18px}.actions button{display:flex;justify-content:center;align-items:center;gap:7px;border:0;padding:13px 8px;border-radius:12px;min-height:46px;background:var(--iz-green);color:var(--iz-button-text,#fff);font-size:11px;font-weight:600}.actions button.secondary{background:color-mix(in srgb,var(--iz-blue) 12%,transparent);color:var(--iz-blue)}.actions ha-icon{--mdc-icon-size:18px}.footnote{font-size:10px;line-height:1.5;color:var(--secondary-text-color,#77877f);margin-top:14px}.unknown .symbol{color:var(--secondary-text-color,#77877f)}@container(max-width:300px){.protections,.actions{grid-template-columns:1fr}.plan-date{font-size:19px}.frost{gap:8px;padding:12px}.frost .reading{font-size:19px}}
`;
var IrrigationOverviewCard = class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._pending = null;
  }
  setConfig(config) {
    this._config = validateOverviewConfig(config);
    this._watch();
    this._render();
  }
  set hass(hass) {
    const old = this._hass;
    this._hass = hass;
    this._watch();
    if (!this._config) return;
    const ids = /* @__PURE__ */ new Set([...overviewEntityKeys.map((key) => this._resolved()[key]), ...(this._discovery?.registry || []).filter((entry) => entry.platform === "smart_irrigation").map((entry) => entry.entity_id), this._system?.config?.rain_sensor, this._system?.config?.freeze_sensor, this._system?.config?.wind_sensor]);
    const changed = !old || [...ids].some((id) => id && old.states[id] !== hass.states[id]);
    if (changed || old.language !== hass.language || old.locale !== hass.locale || old.themes !== hass.themes) this._render();
    if (old && changed && this._systemReader && !this._refreshTimer) this._refreshTimer = setTimeout(() => {
      this._refreshTimer = null;
      void this._systemReader?.refresh();
    }, 300);
  }
  connectedCallback() {
    this._watch();
    this._render();
  }
  disconnectedCallback() {
    this._stop();
  }
  _stop() {
    this._unwatch?.();
    this._systemReader?.unsubscribe();
    this._unwatch = null;
    this._systemReader = null;
    this._connection = null;
    clearTimeout(this._refreshTimer);
    this._refreshTimer = null;
  }
  _watch() {
    if (!this.isConnected || !this._config || !this._hass?.callWS) return;
    const connection = this._hass.connection || this._hass;
    if (this._connection === connection) return;
    this._stop();
    this._connection = connection;
    this._discovery = null;
    this._system = null;
    this._unwatch = watchDiscovery(this._hass, (snapshot) => {
      this._discovery = snapshot;
      this._render();
    });
    this._systemReader = watchOverview(this._hass, (snapshot) => {
      this._system = snapshot;
      this._render();
    });
  }
  _resolved() {
    return resolveOverview(this._config, this._discovery);
  }
  getCardSize() {
    return 15;
  }
  getGridOptions() {
    return { columns: 12, rows: "auto", min_columns: 6 };
  }
  static getStubConfig() {
    return {};
  }
  static getConfigElement() {
    return document.createElement("irrigation-overview-card-editor");
  }
  _number(value) {
    return value === null ? "\u2014" : new Intl.NumberFormat(this._hass.locale?.language || this._hass.language || "en", { maximumFractionDigits: 1 }).format(value);
  }
  _date(value) {
    if (!value || !Number.isFinite(Date.parse(value))) return "\u2014";
    return new Intl.DateTimeFormat(this._hass.locale?.language || this._hass.language || "en", { dateStyle: "medium", timeStyle: "short", timeZone: this._hass.config?.time_zone || "UTC" }).format(new Date(value));
  }
  _duration(seconds) {
    if (seconds === null) return "\u2014";
    if (seconds < 60) return `${this._number(seconds)} s`;
    return `${this._number(seconds / 60)} min`;
  }
  _state(id) {
    const state = this._hass.states[id];
    if (!state || ["unknown", "unavailable"].includes(state.state)) return this._t.unavailable;
    return this._hass.formatEntityState?.(state) || `${state.state} ${state.attributes?.unit_of_measurement || ""}`.trim();
  }
  _more(entityId) {
    if (entityId) this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId }, bubbles: true, composed: true }));
  }
  async _action(key) {
    if (this._pending) return;
    const action = overviewAction(this._resolved(), this._hass.states, key);
    if (!action) return;
    this._pending = key;
    this._error = "";
    this._render();
    try {
      await this._hass.callService(action.domain, action.service, { entity_id: action.entity });
      await this._systemReader?.refresh();
    } catch (error) {
      this._error = `${this._t.error} ${error?.message || ""}`;
    } finally {
      this._pending = null;
      this._render();
    }
  }
  _checkDetail(check) {
    const t = this._t;
    if (check.available === false) return t.unavailable;
    if (check.id === "soil_moisture" && Array.isArray(check.zones)) {
      const held = check.zones.filter((zone) => zone.held).length;
      return held ? `${held} ${t.heldZones}` : t.clear;
    }
    if (check.id === "days_between" && numeric(check.days_since) !== null && numeric(check.days_required) !== null) return `${this._number(check.days_since)} / ${this._number(check.days_required)} ${t.day}`;
    if (check.id === "rain_sensor") return check.raining === true ? t.held : check.raining === false ? t.clear : t.unavailable;
    if (check.id === "postponed" && check.until) return this._date(check.until);
    if (numeric(check.value) !== null) return `${this._number(numeric(check.value))} ${check.unit || ""}${numeric(check.threshold) !== null ? ` \xB7 ${t.limit} ${this._number(numeric(check.threshold))} ${check.unit || ""}` : ""}`;
    return check.skip === true ? t.held : check.skip === false ? t.clear : t.unavailable;
  }
  _render() {
    if (!this._config || !this._hass) return;
    const config = this._resolved(), m = overviewModel(config, this._hass.states, this._system, this._discovery);
    const lang = config.language && config.language !== "auto" ? config.language : this._hass.language;
    const t = this._t = text[lang?.startsWith("de") ? "de" : "en"];
    this.toggleAttribute("dark", !!this._hass.themes?.darkMode);
    const focus = this.shadowRoot.activeElement?.id;
    const rawFreeze = Array.isArray(m.info?.skip_preview?.checks) ? m.info.skip_preview.checks.find((check) => check.id === "freeze") : null;
    const freezeEnabled = rawFreeze?.enabled === true;
    const freezeValid = freezeEnabled && rawFreeze.available !== false && numeric(rawFreeze.value) !== null;
    const freezeClass = freezeEnabled && rawFreeze.skip === true ? "blocking" : !rawFreeze || freezeEnabled && !freezeValid ? "unknown" : "";
    const freezeCaption = !rawFreeze ? t.pendingCheck : !freezeEnabled ? t.freezeOff : !freezeValid ? t.freezeUnknown : rawFreeze.skip === true ? t.freezeBlocked : t.noFreeze;
    const checkIcons = { rain_sensor: "mdi:weather-rainy", wind: "mdi:weather-windy", precipitation: "mdi:weather-pouring", soil_moisture: "mdi:sprout", days_between: "mdi:calendar-clock", postponed: "mdi:pause-circle-outline" };
    const checks = m.checks.filter((check) => !["freeze", "precipitation"].includes(check.id));
    const statusIcon = { blocked: "mdi:shield-alert-outline", running: "mdi:sprinkler", paused: "mdi:pause-circle-outline", unknown: "mdi:help-circle-outline", noDemand: "mdi:check", scheduled: "mdi:calendar-check", demand: "mdi:water-alert" }[m.status];
    const actionButton = (key, label, ico, secondary = false) => `<button id="${key}" data-action="${key}" class="${secondary ? "secondary" : ""}" ${!overviewAction(config, this._hass.states, key) || this._pending ? "disabled" : ""}>${icon(ico)}${esc(this._pending === key ? t.sending : label)}</button>`;
    const precipitationState = this._hass.states[config.precipitation_switch_entity]?.state;
    const missing = overviewEntityKeys.filter((key) => config[key] && (!this._hass.states[config[key]] || this._hass.states[config[key]].state === "unavailable" || !config[key].startsWith("button.") && this._hass.states[config[key]].state === "unknown"));
    const valveText = { on: t.on, open: t.on, off: t.off, closed: t.off, opening: t.opening, closing: t.closing }[m.valveState] || t.unavailable;
    this.shadowRoot.innerHTML = `<style>${styles}${extraStyles}</style><ha-card><div class="wrap">
      <header><div class="zone-icon">${icon(config.icon || "mdi:sprinkler-variant")}</div><div class="heading"><div class="eyebrow">${esc(t.eyebrow)}</div><h2>${esc(config.name || t.title)}</h2></div><button id="refresh" class="more" aria-label="${esc(t.refresh)}" ${!this._systemReader ? "disabled" : ""}>${icon("mdi:refresh")}</button></header>
      <div class="system-status ${m.status}" role="status"><div class="symbol">${icon(statusIcon)}</div><strong>${esc(t[m.status])}</strong></div>
      <div class="plan"><div class="label">${esc(t.planning)}</div><div class="plan-date">${esc(m.info?.active_start_trigger === "none" ? t.noStart : this._date(m.info?.next_irrigation_start))}</div><div class="plan-note">${esc(m.info?.start_trigger_armed === true ? t.armed : m.info?.start_trigger_armed === false ? t.notArmed : t.unavailable)}</div><div class="totals"><div class="total"><strong>${esc(this._duration(m.duration))}</strong><div class="label">${esc(t.duration)} \xB7 ${esc(m.estimated ? t.estimated : t.calculated)}</div></div><div class="total"><strong>${esc(this._number(m.needed))}<small> ${esc(t.of)} ${esc(this._number(m.zoneCount))}</small></strong><div class="label">${esc(t.zones)}</div></div></div></div>
      <div class="section-label">${esc(t.checks)}</div><div class="frost ${freezeClass}" role="status">${icon("mdi:snowflake")}<div class="frost-copy"><strong>${esc(t.freeze)}</strong><p>${esc(freezeCaption)}</p>${numeric(rawFreeze?.threshold) !== null ? `<p>${esc(t.freezeLimit)} ${esc(this._number(numeric(rawFreeze.threshold)))} ${esc(rawFreeze.unit || "")}</p>` : ""}</div><div class="reading">${esc(freezeValid ? this._number(numeric(rawFreeze.value)) : "\u2014")}<small>${esc(freezeValid ? rawFreeze.unit || "" : "")}</small></div></div>
      ${m.rain ? `<div class="rain"><div class="rain-heading"><div class="label">${esc(t.forecast)}${numeric(m.rain.window_hours) !== null ? ` \xB7 ${esc(this._number(numeric(m.rain.window_hours)))} ${esc(t.hours)}` : ""}</div><strong>${esc(this._number(m.forecast))} <small>mm</small></strong></div><div class="rain-track" role="img" aria-label="${esc(t.forecast + ": " + this._number(m.forecast) + " mm \xB7 " + t.threshold + ": " + this._number(m.threshold) + " mm")}"><div class="rain-fill" style="width:${m.rainFill ?? 0}%"></div></div><div class="rain-limit">${esc(t.threshold)} ${esc(this._number(m.threshold))} mm \xB7 ${esc(m.rain.enabled !== true ? t.disabled : m.rain.available === false ? t.unavailable : m.rain.skip === true ? t.held : m.rain.skip === false ? t.clear : t.unavailable)}</div></div>` : ""}
      <div class="protections">${checks.map((check) => `<div class="check ${check.available === false ? "unknown" : check.skip === true ? "blocking" : ""}"><div class="check-title">${icon(checkIcons[check.id] || "mdi:shield-check-outline")}${esc(t[check.id] || check.id)}</div><div class="check-result">${esc(this._checkDetail(check))}</div></div>`).join("")}</div>
      <div class="settings">
        ${config.automation_entity ? `<div class="setting">${icon("mdi:autorenew")}<div class="setting-copy">${esc(t.automation)}<div class="label">${esc(m.automation === "on" ? t.active : m.automation === "off" ? t.inactive : t.unavailable)}</div></div>${config.show_actions ? `<button id="automation_entity" class="text-action" data-action="automation_entity" ${!overviewAction(config, this._hass.states, "automation_entity") || this._pending ? "disabled" : ""}>${esc(m.automation === "on" ? t.pause : t.enable)}</button>` : ""}</div>` : ""}
        ${config.main_valve_entity ? `<div class="setting">${icon("mdi:pipe-valve")}<div class="setting-copy">${esc(t.mainValve)}</div><button id="main-valve" class="text-action" data-entity="${esc(config.main_valve_entity)}">${esc(valveText)}</button></div>` : ""}
        ${config.precipitation_switch_entity ? `<div class="setting">${icon("mdi:weather-pouring")}<div class="setting-copy">${esc(t.rainProtection)}<div class="label">${esc(precipitationState === "on" ? t.active : precipitationState === "off" ? t.inactive : t.unavailable)}</div></div>${config.show_actions ? `<button id="precipitation_switch_entity" class="text-action" data-action="precipitation_switch_entity" ${!overviewAction(config, this._hass.states, "precipitation_switch_entity") || this._pending ? "disabled" : ""}>${esc(precipitationState === "on" ? t.disable : t.enable)}</button>` : ""}</div>` : ""}
        ${config.precipitation_threshold_entity ? `<div class="setting">${icon("mdi:water-outline")}<div class="setting-copy">${esc(t.threshold)}</div><button id="rain-threshold" class="text-action" data-entity="${esc(config.precipitation_threshold_entity)}">${esc(this._state(config.precipitation_threshold_entity))}</button></div>` : ""}
      </div>
      <div class="facts"><span>${esc(t.weather)}<br><strong>${esc(m.settings?.use_weather_service === false ? t.inactive : m.settings?.weather_service || "\u2014")}</strong></span><span>${esc(t.calculation)}<br><strong>${esc(m.settings?.autocalcenabled === true ? `${t.automatic}${m.settings.calctime ? " \xB7 " + m.settings.calctime : ""}` : m.settings?.autocalcenabled === false ? t.manual : "\u2014")}</strong></span></div>
      ${config.show_actions ? `<div class="actions">${actionButton("calculate_entity", t.calculate, "mdi:calculator-variant-outline")}${actionButton("update_weather_entity", t.update, "mdi:weather-sync", true)}</div>` : ""}
      ${!this._system || this._system.error ? `<div class="notice" role="status">${esc(this._system?.error ? t.offline : t.loading)}</div>` : ""}
      ${this._discovery?.error ? `<div class="notice">${esc(t.offline)}</div>` : ""}
      ${m.stale ? `<div class="notice">${esc(t.stale)}</div>` : ""}
      ${missing.length ? `<div class="notice">${esc(t.missing)}: ${missing.map((key) => esc(config[key])).join(", ")}</div>` : ""}
      ${this._error ? `<div role="alert" class="notice error">${esc(this._error)}</div>` : ""}
      <div class="footnote">${esc(m.settings?.direct_valve_control_enabled === true ? t.direct : m.settings?.direct_valve_control_enabled === false ? t.external : "")} ${esc(t.forecastNote)}</div>
    </div></ha-card>`;
    this.shadowRoot.querySelector("#refresh").onclick = () => this._systemReader?.refresh();
    this.shadowRoot.querySelectorAll("[data-action]").forEach((button) => button.onclick = () => this._action(button.dataset.action));
    this.shadowRoot.querySelectorAll("[data-entity]").forEach((button) => button.onclick = () => this._more(button.dataset.entity));
    if (focus) this.shadowRoot.getElementById(focus)?.focus({ preventScroll: true });
  }
};
if (!customElements.get("irrigation-overview-card")) customElements.define("irrigation-overview-card", IrrigationOverviewCard);
window.customCards = window.customCards || [];
if (!window.customCards.some((card) => card.type === "irrigation-overview-card")) window.customCards.push({ type: "irrigation-overview-card", name: "Irrigation Overview", description: "Central Smart Irrigation planning, frost protection, rain forecast and actions.", preview: true, documentationURL: "https://github.com/lweberru/ha_irrigation_zone_card" });

// src/card.js
var translations = {
  de: { zone: "Bew\xE4sserungszone", watering: "Ventil aktiv", needed: "Bew\xE4sserung n\xF6tig", balanced: "Kein Wasserbedarf", unknown: "Wasserbedarf unbekannt", moisture: "Bodenfeuchte", balance: "Wasserbilanz \xB7 live", reserve: "Wasservorrat", deficit: "Wasserdefizit", neutral: "Ausgeglichen", duration: "Berechnete Dauer", used: "Wasserverbrauch", valve: "Zonenventil", open: "\xD6ffnen", close: "Schlie\xDFen", opening: "\xD6ffnet \u2026", closing: "Schlie\xDFt \u2026", on: "Ge\xF6ffnet", off: "Geschlossen", unavailable: "Nicht verf\xFCgbar", pending: "Wird gesendet \u2026", confirm: "Ventil manuell \xF6ffnen? Es bleibt ge\xF6ffnet, bis es geschlossen wird. Die berechnete Dauer startet keinen Timer.", manual: "Manuell \xB7 ohne Abschalttimer", failed: "Ventil konnte nicht geschaltet werden.", missing: "Nicht verf\xFCgbar", details: "Zonendetails \xF6ffnen", noData: "Die konfigurierten Sensoren liefern noch keine Werte." },
  en: { zone: "Irrigation zone", watering: "Valve active", needed: "Irrigation needed", balanced: "No irrigation needed", unknown: "Water demand unknown", moisture: "Soil moisture", balance: "Water balance \xB7 live", reserve: "Water reserve", deficit: "Water deficit", neutral: "Balanced", duration: "Calculated duration", used: "Water used", valve: "Zone valve", open: "Open", close: "Close", opening: "Opening \u2026", closing: "Closing \u2026", on: "Open", off: "Closed", unavailable: "Unavailable", pending: "Sending \u2026", confirm: "Open valve manually? It stays open until closed. The calculated duration does not start a timer.", manual: "Manual \xB7 no shutoff timer", failed: "Could not control the valve.", missing: "Unavailable", details: "Open zone details", noData: "The configured sensors have no readings yet." }
};
Object.assign(translations.de, { sharedValve: "Gemeinsames Ventil", loading: "Zone wird geladen \u2026", zoneMissing: "Die ausgew\xE4hlte Smart-Irrigation-Zone wurde nicht gefunden.", discoveryFailed: "Automatische Zuordnung nicht verf\xFCgbar. Verbindung und Smart-Irrigation-Integration pr\xFCfen oder Entit\xE4ten manuell eintragen.", autoMissing: "Sensoren nicht automatisch gefunden (optional manuell zuweisen)" });
Object.assign(translations.en, { sharedValve: "Shared valve", loading: "Loading zone \u2026", zoneMissing: "The selected Smart Irrigation zone was not found.", discoveryFailed: "Automatic discovery unavailable. Check the connection and Smart Irrigation integration or configure entities manually.", autoMissing: "Sensors not discovered (assign manually if needed)" });
var escape = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
var icon2 = (value) => `<ha-icon icon="${escape(value)}"></ha-icon>`;
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
      <header><div class="zone-icon">${icon2(config.icon || "mdi:sprinkler-variant")}</div><div class="heading"><div class="eyebrow">${escape(t.zone)}</div><h2>${escape(name)}</h2></div><button class="more" aria-label="${escape(t.details)}">${icon2("mdi:dots-horizontal")}</button></header>
      <div class="status ${m.status}" role="status"><span class="dot"></span>${escape(t[m.status])}</div>
      ${config.moisture_entity || config.bucket_entity ? `<div class="overview">
        ${config.moisture_entity ? `<button class="ring ring-button" data-entity="${escape(config.moisture_entity)}" aria-label="${escape(t.moisture + ": " + this._state(config.moisture_entity))}">
          <svg viewBox="0 0 120 120" aria-hidden="true"><circle class="track" cx="60" cy="60" r="54" fill="none" stroke-width="5"/><circle class="arc" cx="60" cy="60" r="54" fill="none" stroke-width="5" pathLength="100" stroke-dasharray="${m.moistureFill} 100"/></svg>
          <div class="ring-content">${icon2("mdi:sprout")}<div class="ring-value">${escape(this._number(m.moisture))}<small>${escape(m.moisture === null ? "" : moistureUnit)}</small></div><div class="ring-label">${escape(t.moisture)}</div></div>
        </button>` : ""}
        ${config.bucket_entity ? `<div class="balance ${m.balance < 0 ? "deficit" : ""}" style="--zero:${m.zero}%;--position:${m.position ?? m.zero}%">
          <div class="label">${escape(t.balance)}</div><div class="balance-value">${escape(this._number(m.balance, true))} <small>${escape(this._hass.states[config.bucket_entity]?.attributes?.unit_of_measurement || "")}</small></div>
          <div class="hint">${escape(m.balance === null ? t.unavailable : m.balance < 0 ? t.deficit : m.balance > 0 ? t.reserve : t.neutral)}</div>
          <div class="balance-bar" role="img" aria-label="${escape(t.balance + ": " + this._state(config.bucket_entity))}"><span class="zero"></span>${m.position === null ? "" : '<span class="marker"></span>'}</div><div class="scale"><span>${escape(this._number(m.min))}</span><span class="center">0</span><span>+${escape(this._number(m.max))}</span></div>
        </div>` : ""}
      </div>` : '<div class="empty-overview"></div>'}
      <div class="stats"><button class="stat" data-entity="${escape(config.entity)}">${icon2("mdi:timer-outline")}<div><div class="stat-value">${durationHTML}</div><div class="label">${escape(t.duration)}</div></div></button>
      ${config.water_used_entity ? `<button class="stat" data-entity="${escape(config.water_used_entity)}">${icon2("mdi:water-outline")}<div><div class="stat-value">${escape(this._state(config.water_used_entity))}</div><div class="label">${escape(t.used)}</div></div></button>` : ""}</div>
      ${config.valve_entity ? `<div class="control">${icon2(m.active ? "mdi:pipe-valve" : "mdi:valve-closed")}<div class="control-copy"><div class="control-title">${escape(config._sharedValve ? t.sharedValve : t.valve)} \xB7 ${escape(valveState)}</div><div class="control-state">${escape(t.manual)}</div></div>${config.show_control ? `<button id="control" class="${close ? "close" : ""}" ${!m.action || this._pending ? "disabled" : ""}>${escape(this._pending ? t.pending : close ? t.close : t.open)}</button>` : ""}</div>` : ""}
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
