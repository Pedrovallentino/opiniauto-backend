import type { FastifyInstance } from 'fastify'

export async function experimentRoutes(app: FastifyInstance) {
  app.get('/experiment/health', async () => {
    return {
      status: 'ok',
      service: 'opiniauto-api',
      environment: 'experiment',
    }
  })

  app.get('/experiment/version', async () => {
    return {
      version: '1.0.0',
      description: 'Versão inicial utilizada nos experimentos do TCC',
    }
  })

  app.get('/experiment/ping', async () => {
    return {
      message: 'pong',
      timestamp: new Date().toISOString(),
    }
  })

  app.get('/experiment/cpu', async () => {
    const start = Date.now()
    let result = 0

    for (let i = 0; i < 5_000_000; i++) {
      result += Math.sqrt(i)
    }

    const durationMs = Date.now() - start

    return {
      status: 'completed',
      durationMs,
      result: Number(result.toFixed(2)),
    }
  })
}