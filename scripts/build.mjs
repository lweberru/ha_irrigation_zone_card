import { build } from 'esbuild';
await build({
  entryPoints: ['src/card.js'],
  outfile: 'dist/ha_irrigation_zone_card.js',
  bundle: true,
  format: 'esm',
  target: 'es2022',
  legalComments: 'inline',
  banner: { js: '/* Irrigation Zone Card v0.1.0 | MIT License */' },
});
