import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/server.ts'],
  format: ['esm'],
  target: 'node20',
  sourcemap: false,
  clean: true,
  splitting: false,      // MUITO IMPORTANTE
  bundle: true,           // MUITO IMPORTANTE
  external: ['@prisma/client'], // prisma NÃO bundlar
})