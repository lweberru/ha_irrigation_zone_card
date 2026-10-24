import { build } from 'esbuild';
import { readFile } from 'node:fs/promises';
const { version } = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
await build({
  entryPoints: ['src/card.js'],
  outfile: 'dist/ha_irrigation_zone_card.js',
  bundle: true,
  format: 'esm',
  target: 'es2022',
  legalComments: 'inline',
  banner: { js: `/* Irrigation Zone Card v${version} | MIT License */` },
});
