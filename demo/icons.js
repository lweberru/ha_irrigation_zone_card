// Local stand-ins for the HA elements. The shipped card uses HA's own icons and form.
const paths = {
  'mdi:tune-variant':'M3 6h6M13 6h8M9 3v6M3 12h12M19 12h2M15 9v6M3 18h2M9 18h12M5 15v6',
  'mdi:water-minus-outline':'M12 2S4 10 4 15a8 8 0 0 0 11 7M12 2s8 8 8 13M15 18h8',
  'mdi:chart-line':'M3 3v18h18M6 16l5-5 4 2 6-8',
  'mdi:weather-sunny':'M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10M12 1v2M12 21v2M1 12h2M21 12h2M4 4l2 2M18 18l2 2M4 20l2-2M18 6l2-2',
  'mdi:alert-circle-outline':'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20M12 6v7M12 17h.01',
  'mdi:snowflake':'M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7M9 4l3 3 3-3M9 20l3-3 3 3M4 10l4-1-1-4M20 14l-4 1 1 4M4 14l4 1-1 4M20 10l-4-1 1-4',
  'mdi:check':'m5 12 4 4L19 6',
  'mdi:refresh':'M20 10a8 8 0 1 0-1 7M20 4v6h-6',
  'mdi:shield-alert-outline':'m12 2 8 4v6c0 6-8 10-8 10S4 18 4 12V6ZM12 7v6M12 17h.01',
  'mdi:help-circle-outline':'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20M9 8a3 3 0 0 1 6 0c0 3-3 2-3 6M12 18h.01',
  'mdi:pause-circle-outline':'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20M9 8v8M15 8v8',
  'mdi:calendar-check':'M4 5h16v16H4ZM4 9h16M8 2v5M16 2v5m-8 9 3 3 5-6',
  'mdi:calendar-clock':'M4 5h16v16H4ZM4 9h16M8 2v5M16 2v5M12 12v4l3 2',
  'mdi:weather-rainy':'M5 15a4 4 0 0 1 0-8 6 6 0 0 1 11-2 5 5 0 0 1 3 10M8 18l-1 3M13 18l-1 3M18 18l-1 3',
  'mdi:weather-pouring':'M5 13a4 4 0 0 1 0-8 6 6 0 0 1 11-2 5 5 0 0 1 3 10M8 16l-2 6M13 16l-2 6M18 16l-2 6',
  'mdi:weather-windy':'M3 8h12a3 3 0 1 0-3-3M3 12h17a2 2 0 1 1-2 2M3 16h8a3 3 0 1 1-3 3',
  'mdi:weather-sync':'M5 12a4 4 0 0 1 0-8 6 6 0 0 1 11-2 5 5 0 0 1 3 10M18 17a5 5 0 1 0 1 4M18 14v3h-3',
  'mdi:autorenew':'M19 8a8 8 0 0 0-14 1M5 4v5h5M5 16a8 8 0 0 0 14-1M19 20v-5h-5',
  'mdi:calculator-variant-outline':'M5 2h14v20H5ZM8 5h8v4H8ZM8 13h1M15 13h1M8 17h1M15 17h1',
  'mdi:sprout':'M12 21v-9M12 15C4 16 2 10 3 5c6 0 9 3 9 8M12 12c0-6 4-9 9-9 1 7-3 11-9 9',
  'mdi:sprinkler-variant':'M8 20h8M12 20v-5M7 15h10M5 11l-2-2M8 7 7 4M12 6V2M16 7l1-3M19 11l2-2',
  'mdi:timer-outline':'M9 2h6M12 7a7 7 0 1 0 0 14 7 7 0 0 0 0-14M12 10v4l3 2M18 6l2-2',
  'mdi:water-outline':'M12 3s-7 8-7 12a7 7 0 0 0 14 0c0-4-7-12-7-12Z',
  'mdi:dots-horizontal':'M5 12h.01M12 12h.01M19 12h.01',
  'mdi:pipe-valve':'M2 10h5v7H2M17 10h5v7h-5M7 9h10v9H7ZM12 9V4M8 4h8',
  'mdi:valve-closed':'M2 10h5v7H2M17 10h5v7h-5M7 9h10v9H7ZM12 9V4M8 4h8',
};
class DemoIcon extends HTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return;
    this.attachShadow({mode:'open'}).innerHTML = `<style>:host{display:inline-flex;width:var(--mdc-icon-size,24px);height:var(--mdc-icon-size,24px)}svg{width:100%;height:100%}</style><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="${paths[this.getAttribute('icon')] || paths['mdi:sprout']}"/></svg>`;
  }
}
customElements.define('ha-icon',DemoIcon);
