/* Irrigation Zone Card v0.1.0 | MIT License */

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
  if (!config || typeof config.entity !== "string" || !/^sensor\.[a-z0-9_]+$/.test(config.entity)) {
    throw new Error("entity must be a sensor entity ID (Smart Irrigation duration).");
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

// src/editor.js
var labels = {
  de: { entity: "Berechnete Dauer (Smart Irrigation)", name: "Zonenname", icon: "Symbol", irrigation_needed_entity: "Bew\xE4sserung n\xF6tig", bucket_entity: "Wasserbilanz (live)", water_used_entity: "Wasserverbrauch", moisture_entity: "Bodenfeuchte", valve_entity: "Ventil (optional)", bucket_min: "Wasserbilanz: Skalenminimum (< 0)", bucket_max: "Wasserbilanz: Skalenmaximum (> 0)", show_control: "Manuelle Ventilsteuerung anzeigen", confirm_open: "Vor manuellem \xD6ffnen best\xE4tigen", language: "Sprache" },
  en: { entity: "Calculated duration (Smart Irrigation)", name: "Zone name", icon: "Icon", irrigation_needed_entity: "Irrigation needed", bucket_entity: "Water balance (live)", water_used_entity: "Water used", moisture_entity: "Soil moisture", valve_entity: "Valve (optional)", bucket_min: "Water balance: scale minimum (< 0)", bucket_max: "Water balance: scale maximum (> 0)", show_control: "Show manual valve control", confirm_open: "Confirm before opening manually", language: "Language" }
};
var IrrigationZoneEditor = class extends HTMLElement {
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
      this._form.addEventListener("value-changed", (event) => {
        event.stopPropagation();
        const config = { ...this._config, ...event.detail.value };
        for (const key of Object.keys(config)) if (config[key] === "" || config[key] === null || config[key] === void 0) delete config[key];
        this._config = config;
        this.dispatchEvent(new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true }));
      });
      this._form.schema = [
        { name: "entity", required: true, selector: { entity: { domain: "sensor" } } },
        { name: "name", selector: { text: {} } },
        { name: "icon", selector: { icon: {} } },
        ...["irrigation_needed_entity", "bucket_entity", "water_used_entity", "moisture_entity", "valve_entity"].map((name) => ({ name, selector: { entity: { domain: name === "valve_entity" ? ["switch", "valve"] : name === "irrigation_needed_entity" ? "binary_sensor" : "sensor" } } })),
        { name: "bucket_min", selector: { number: { mode: "box", min: -1e4, max: -0.01, step: "any" } } },
        { name: "bucket_max", selector: { number: { mode: "box", min: 0.01, max: 1e4, step: "any" } } },
        { name: "show_control", selector: { boolean: {} } },
        { name: "confirm_open", selector: { boolean: {} } },
        { name: "language", selector: { select: { options: [{ value: "auto", label: "Auto" }, { value: "de", label: "Deutsch" }, { value: "en", label: "English" }] } } }
      ];
    }
    const lang = this._config.language && this._config.language !== "auto" ? this._config.language : this._hass.language;
    this._form.hass = this._hass;
    this._form.data = { show_control: true, confirm_open: true, language: "auto", ...this._config };
    this._form.computeLabel = (schema) => labels[lang?.startsWith("de") ? "de" : "en"][schema.name] || schema.name;
  }
};
if (!customElements.get("irrigation-zone-card-editor")) customElements.define("irrigation-zone-card-editor", IrrigationZoneEditor);

// src/card.js
var translations = {
  de: { zone: "Bew\xE4sserungszone", watering: "Ventil aktiv", needed: "Bew\xE4sserung n\xF6tig", balanced: "Kein Wasserbedarf", unknown: "Wasserbedarf unbekannt", moisture: "Bodenfeuchte", balance: "Wasserbilanz \xB7 live", reserve: "Wasservorrat", deficit: "Wasserdefizit", neutral: "Ausgeglichen", duration: "Berechnete Dauer", used: "Wasserverbrauch", valve: "Zonenventil", open: "\xD6ffnen", close: "Schlie\xDFen", opening: "\xD6ffnet \u2026", closing: "Schlie\xDFt \u2026", on: "Ge\xF6ffnet", off: "Geschlossen", unavailable: "Nicht verf\xFCgbar", pending: "Wird gesendet \u2026", confirm: "Ventil manuell \xF6ffnen? Es bleibt ge\xF6ffnet, bis es geschlossen wird. Die berechnete Dauer startet keinen Timer.", manual: "Manuell \xB7 ohne Abschalttimer", failed: "Ventil konnte nicht geschaltet werden.", missing: "Nicht verf\xFCgbar", details: "Zonendetails \xF6ffnen", noData: "Die konfigurierten Sensoren liefern noch keine Werte." },
  en: { zone: "Irrigation zone", watering: "Valve active", needed: "Irrigation needed", balanced: "No irrigation needed", unknown: "Water demand unknown", moisture: "Soil moisture", balance: "Water balance \xB7 live", reserve: "Water reserve", deficit: "Water deficit", neutral: "Balanced", duration: "Calculated duration", used: "Water used", valve: "Zone valve", open: "Open", close: "Close", opening: "Opening \u2026", closing: "Closing \u2026", on: "Open", off: "Closed", unavailable: "Unavailable", pending: "Sending \u2026", confirm: "Open valve manually? It stays open until closed. The calculated duration does not start a timer.", manual: "Manual \xB7 no shutoff timer", failed: "Could not control the valve.", missing: "Unavailable", details: "Open zone details", noData: "The configured sensors have no readings yet." }
};
var escape = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
var icon = (value) => `<ha-icon icon="${escape(value)}"></ha-icon>`;
var IrrigationZoneCard = class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._pending = false;
  }
  setConfig(config) {
    this._config = validateConfig(config);
    this._render();
  }
  set hass(value) {
    const old = this._hass;
    this._hass = value;
    if (!this._config) return;
    if (!old || old.language !== value.language || old.locale !== value.locale || old.themes !== value.themes || entityKeys.some((key) => old.states[this._config[key]] !== value.states[this._config[key]])) this._render();
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
    const model = zoneModel(this._config, this._hass.states);
    const action = model.action;
    if (!action) return;
    if (["turn_on", "open_valve"].includes(action.service) && this._config.confirm_open && !window.confirm(this._t.confirm)) return;
    this._pending = true;
    this._error = "";
    this._render();
    try {
      await this._hass.callService(action.domain, action.service, { entity_id: this._config.valve_entity });
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
    const config = this._config;
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
      ${config.valve_entity ? `<div class="control">${icon(m.active ? "mdi:pipe-valve" : "mdi:valve-closed")}<div class="control-copy"><div class="control-title">${escape(t.valve)} \xB7 ${escape(valveState)}</div><div class="control-state">${escape(t.manual)}</div></div>${config.show_control ? `<button id="control" class="${close ? "close" : ""}" ${!m.action || this._pending ? "disabled" : ""}>${escape(this._pending ? t.pending : close ? t.close : t.open)}</button>` : ""}</div>` : ""}
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
