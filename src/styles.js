export const styles = `
:host { display:block; container-type:inline-size; --iz-green:#36856b; --iz-blue:#498bb0; --iz-amber:#ad722c; }
:host([dark]) { --iz-green:#83c6a5; --iz-blue:#8dbdd8; --iz-amber:#dfb777; --iz-button-text:#132c21; --iz-problem:var(--error-color,#f2a69f); }
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
.balance-detail { display:block; width:100%; padding:0; border:0; background:transparent; text-align:start; border-radius:6px; }
.balance-label { display:flex; align-items:center; justify-content:space-between; gap:4px; }
.balance-label ha-icon { --mdc-icon-size:14px; flex-shrink:0; }
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
.et-detail { display:flex; align-items:center; gap:5px; width:100%; border:0; background:transparent; padding:10px 0 0; text-align:start; font-size:9px; color:var(--secondary-text-color,#77877f); line-height:1.4; }
.et-detail ha-icon { --mdc-icon-size:15px; color:var(--iz-amber); flex-shrink:0; }
.et-detail strong { margin-left:auto; font-size:12px; font-weight:550; white-space:nowrap; color:var(--primary-text-color,#233c33); }
.et-detail small { font-size:9px; font-weight:400; }
.problem-banner { margin-top:16px; padding:12px; border-radius:13px; color:var(--iz-problem,var(--error-color,#b34b43)); background:color-mix(in srgb,var(--iz-problem,var(--error-color,#b34b43)) 9%,transparent); border:1px solid color-mix(in srgb,var(--iz-problem,var(--error-color,#b34b43)) 30%,transparent); }
.problem-banner.unknown { color:var(--iz-amber); background:color-mix(in srgb,var(--iz-amber) 9%,transparent); border-color:color-mix(in srgb,var(--iz-amber) 30%,transparent); }
.problem-content { display:flex; align-items:flex-start; gap:10px; width:100%; padding:0; border:0; background:transparent; color:inherit; text-align:start; }
.problem-content ha-icon { flex-shrink:0; --mdc-icon-size:20px; }
.problem-content>span { min-width:0; overflow-wrap:anywhere; }
.problem-content strong { display:block; font-size:12px; line-height:1.4; }
.problem-content span span { display:block; font-size:10px; line-height:1.5; margin-top:3px; }
@keyframes breathe { 50% { opacity:.35; } }
@media (prefers-reduced-motion:reduce) { *,*::before,*::after { animation:none!important; transition:none!important; } }
@container (max-width:340px) { .wrap { padding:18px; } .overview { gap:16px; } .ring { width:112px; height:112px; } .ring-value { font-size:27px; } .balance-value { font-size:25px; } .stat { padding:13px; } }
@container (max-width:260px) { .overview { flex-direction:column; align-items:stretch; } .ring { margin:auto; } .stats { grid-template-columns:1fr; } .control { flex-wrap:wrap; } }
`;
