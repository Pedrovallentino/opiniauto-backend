import 'dotenv/config'

const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'] as const

for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    throw new Error(`Variável de ambiente obrigatória ausente: ${key}`)
  }
}

export const env = {
  DATABASE_URL: process.env.DATABASE_URL as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
  PORT: Number(process.env.PORT ?? 3333),
}

