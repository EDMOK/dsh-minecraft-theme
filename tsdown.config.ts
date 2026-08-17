import type { UserConfig } from 'tsdown'

const id = '@deepseek-ai/dsh-client-ui-minecraft-pixel'

const configs: UserConfig[] = [{
  name: id,
  entry: ['src/index.ts'],
  outDir: 'lib',
  format: ['esm'],
  platform: 'node',
  target: 'es2024',
  fixedExtension: false,
  dts: false,
  clean: false,
  external: ['@deepseek-ai/cordis'],
  copy: [
    { from: 'src/styles/*', to: 'lib/styles' },
    { from: 'src/assets/*', to: 'lib/assets' },
  ],
}, {
  name: `${id}/client`,
  entry: { client: 'src/client/index.ts' },
  outDir: 'lib',
  format: 'cjs',
  platform: 'browser',
  target: 'es2024',
  dts: false,
  sourcemap: true,
  clean: false,
  external: ['react', '@deepseek-ai/cordis'],
  noExternal: (specifier: string) => (specifier === 'react' || specifier === '@deepseek-ai/cordis' ? undefined : true),
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV ?? 'production'),
    'import.meta.env.MODE': JSON.stringify(process.env.NODE_ENV ?? 'production'),
    'import.meta.env': JSON.stringify({ MODE: process.env.NODE_ENV ?? 'production' }),
  },
  outputOptions: {
    entryFileNames: 'client.js',
    banner: `window.__ModuleLoader__.load({ id: ${JSON.stringify(id)}, factory: (require) => {`,
    footer: 'return module.exports; } });',
    intro: 'var module = { exports: {} }; var exports = module.exports;',
  },
}]

export default configs
