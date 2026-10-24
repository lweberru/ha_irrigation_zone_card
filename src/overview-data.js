const readers = new WeakMap();
export function watchOverview(hass, callback) {
  const key = hass.connection || hass;
  let reader = readers.get(key);
  if (!reader) {
    reader = {hass,listeners:new Set(),snapshot:null,pending:false,again:false,cleanup:[],timer:null};
    readers.set(key,reader);
  }
  reader.hass = hass;
  reader.listeners.add(callback);
  if (reader.snapshot) callback(reader.snapshot);
  const refresh = async () => {
    if (reader.pending) { reader.again = true; return; }
    reader.pending = true;
    const results = await Promise.allSettled(['info','config'].map(path=>Promise.resolve().then(()=>reader.hass.callWS({type:`smart_irrigation/${path}`}))));
    const valid = result=>result.status === 'fulfilled' && result.value !== null && typeof result.value === 'object' && !Array.isArray(result.value);
    reader.snapshot = {info:valid(results[0]) ? results[0].value : null,config:valid(results[1]) ? results[1].value : null,error:results.some(result=>!valid(result))};
    reader.pending = false;
    for (const listener of reader.listeners) listener(reader.snapshot);
    if (reader.again && reader.listeners.size) { reader.again = false; void refresh(); }
  };
  if (reader.listeners.size === 1) {
    const connection = hass.connection;
    if (connection?.subscribeMessage) Promise.resolve(connection.subscribeMessage(refresh,{type:'smart_irrigation_config_updated'})).then(unsubscribe=>{
      if (reader.listeners.size) reader.cleanup.push(unsubscribe); else unsubscribe();
    }).catch(()=>{});
    if (connection?.addEventListener) {
      connection.addEventListener('ready',refresh);
      reader.cleanup.push(()=>connection.removeEventListener('ready',refresh));
    }
    reader.timer = setInterval(refresh,60000);
    reader.timer.unref?.();
    void refresh();
  }
  return {refresh,unsubscribe:()=>{
    reader.listeners.delete(callback);
    if (!reader.listeners.size) {
      clearInterval(reader.timer); reader.cleanup.splice(0).forEach(cleanup=>cleanup()); readers.delete(key);
    }
  }};
}
