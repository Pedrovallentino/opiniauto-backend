/**
 * @module EnvironmentConfig
 * @description Gerenciamento e validação de variáveis de ambiente.
 * Garante que a aplicação inicie apenas se as configurações críticas estiverem presentes.
 * 
 * @requires dotenv - Carregamento de variáveis de arquivo .env
 */

import 'dotenv/config'

const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'] as const

// Validação manual de variáveis de ambiente obrigatórias
for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    throw new Error(`Variável de ambiente obrigatória ausente: ${key}`)
  }
}

/**
 * @constant env
 * @description Objeto tipado contendo as configurações da aplicação.
 * @property {string} DATABASE_URL - URL de conexão com o banco de dados.
 * @property {string} JWT_SECRET - Segredo para assinatura de tokens JWT.
 * @property {number} PORT - Porta do servidor (Padrão: 3333).
 */
export const env = {
  DATABASE_URL: process.env.DATABASE_URL as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
  PORT: Number(process.env.PORT ?? 3333),
}

