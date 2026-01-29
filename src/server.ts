import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
require('module-alias/register');

import { app } from './app.js'
import { env } from './config/env.js'

async function start() {
  try {
    await app.listen({ port: env.PORT, host: '0.0.0.0' })
    console.log(`HTTP Server Running on port ${env.PORT}!`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()