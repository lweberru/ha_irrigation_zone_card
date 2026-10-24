export const entityKeys = ['entity', 'irrigation_needed_entity', 'bucket_entity', 'water_used_entity', 'moisture_entity', 'valve_entity'];

export function numeric(value) {
  if (value === null || value === undefined || String(value).trim() === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}
export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function validateConfig(config) {
  const zone = config?.zone !== undefined && config.zone !== '';
  if (zone && !((typeof config.zone === 'number' && Number.isSafeInteger(config.zone) && config.zone >= 0) ||
    (typeof config.zone === 'string' && /^(0|[1-9]\d*)$/.test(config.zone) && Number.isSafeInteger(Number(config.zone))))) {
    throw new Error('zone must be a non-negative Smart Irrigation zone ID.');
  }
  if ((!zone || config.entity) && (typeof config?.entity !== 'string' || !/^sensor\.[a-z0-9_]+$/.test(config.entity))) {
    throw new Error('Select a Smart Irrigation zone or define a duration sensor entity.');
  }
  for (const key of entityKeys.slice(1)) {
    if (config[key] !== undefined && config[key] !== '' &&
      (typeof config[key] !== 'string' || !/^[a-z_]+\.[a-z0-9_]+$/.test(config[key]))) {
      throw new Error(`${key}: invalid entity ID`);
    }
  }
  if (config.valve_entity && !/^(switch|valve)\./.test(config.valve_entity)) throw new Error('valve_entity must be a switch or valve.');
  if (config.irrigation_needed_entity && !config.irrigation_needed_entity.startsWith('binary_sensor.')) throw new Error('irrigation_needed_entity must be a binary_sensor.');
  for (const key of ['bucket_entity', 'water_used_entity', 'moisture_entity']) {
    if (config[key] && !config[key].startsWith('sensor.')) throw new Error(`${key} must be a sensor.`);
  }
  for (const key of ['bucket_min', 'bucket_max']) {
    if (config[key] !== undefined && (typeof config[key] !== 'number' || !Number.isFinite(config[key]))) throw new Error(`${key} must be a finite number.`);
  }
  if (config.bucket_min !== undefined && config.bucket_min >= 0) throw new Error('bucket_min must be below zero.');
  if (config.bucket_max !== undefined && config.bucket_max <= 0) throw new Error('bucket_max must be above zero.');
  for (const key of ['show_control', 'confirm_open']) {
    if (config[key] !== undefined && typeof config[key] !== 'boolean') throw new Error(`${key} must be a boolean.`);
  }
  if (config.language !== undefined && !['auto', 'de', 'en'].includes(config.language)) throw new Error('language must be auto, de or en.');
  for (const key of ['name', 'icon']) if (config[key] !== undefined && typeof config[key] !== 'string') throw new Error(`${key} must be a string.`);
  return { show_control: true, confirm_open: true, ...config };
}

export function valveAction(entityId, state, features = 3) {
  const domain = entityId?.split('.')[0];
  if (domain === 'switch' && ['on', 'off'].includes(state)) return { domain, service: state === 'on' ? 'turn_off' : 'turn_on' };
  if (domain !== 'valve') return null;
  if (state === 'open' && (features & 2)) return { domain, service: 'close_valve' };
  if (state === 'closed' && (features & 1)) return { domain, service: 'open_valve' };
  return null;
}

export function zoneModel(config, states) {
  const main = states[config.entity];
  const bucket = states[config.bucket_entity];
  const valve = states[config.valve_entity];
  const needed = states[config.irrigation_needed_entity]?.state;
  const active = ['on', 'open', 'opening', 'closing'].includes(valve?.state);
  const balance = numeric(bucket?.state);
  const capacity = numeric(main?.attributes?.maximum_bucket);
  const max = config.bucket_max ?? (capacity > 0 ? capacity : 25);
  const min = config.bucket_min ?? -max;
  const position = balance === null ? null : clamp((balance - min) / (max - min) * 100, 0, 100);
  const zero = -min / (max - min) * 100;
  const moistureEntity = states[config.moisture_entity];
  const moisture = numeric(moistureEntity?.state);
  const moisturePercent = moistureEntity?.attributes?.unit_of_measurement === '%' && moisture !== null;
  const status = active ? 'watering' : needed === 'on' ? 'needed' : needed === 'off' ? 'balanced' : 'unknown';
  return { main, balance, min, max, zero, position, moisture,
    moisturePercent, moistureFill: moisturePercent ? clamp(moisture, 0, 100) : 0,
    status, active, valve,
    action: config.valve_entity ? valveAction(config.valve_entity, valve?.state, valve?.attributes?.supported_features ?? 0) : null,
  };
}

export function durationParts(state) {
  const value = numeric(state?.state);
  if (value === null) return null;
  const factor = { s: 1, sec: 1, min: 60, h: 3600 }[state?.attributes?.unit_of_measurement];
  if (!factor) return { raw: true, value, unit: state?.attributes?.unit_of_measurement || '' };
  const seconds = Math.max(0, Math.round(value * factor));
  if (seconds < 60) return { value: seconds, unit: 's' };
  if (seconds < 3600) return { value: Math.floor(seconds / 60), unit: 'min', remainder: seconds % 60, remainderUnit: 's' };
  return { value: Math.floor(seconds / 3600), unit: 'h', remainder: Math.floor(seconds % 3600 / 60), remainderUnit: 'min' };
}
