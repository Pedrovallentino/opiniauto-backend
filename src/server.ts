/**
 * @module Server
 * @description Ponto de entrada principal da aplicação. Responsável por inicializar o servidor HTTP Fastify
 * e configurar a escuta na porta definida nas variáveis de ambiente.
 * 
 * @requires app - Instância configurada do Fastify.
 * @requires env - Configurações de variáveis de ambiente.
 */

import { app } from './app'
import { env } from './config/env'

/**
 * @function start
 * @description Inicializa o servidor e lida com erros críticos de inicialização.
 */
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

