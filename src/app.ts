/**
 * @module App
 * @description Configuração central da aplicação Fastify. Define middlewares, plugins,
 * provedores de tipos para validação (Zod) e registra as rotas da API.
 * 
 * @requires fastify - Framework web.
 * @requires @fastify/jwt - Gestão de autenticação via JSON Web Token.
 * @requires @fastify/cors - Configuração de Cross-Origin Resource Sharing.
 * @requires fastify-type-provider-zod - Integração do Zod para validação de tipos em tempo de execução.
 */

import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import fastifyCors from '@fastify/cors'
import fastifyCookie from '@fastify/cookie'
import fastifyCsrfProtection from '@fastify/csrf-protection'
import fastifyRateLimit from '@fastify/rate-limit'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { env } from './config/env'
import { authRoutes } from './http/routes/auth'
import { passwordRecoveryRoutes } from './http/routes/password-recovery'
import { carsRoutes } from './http/routes/cars'
import { evaluationsRoutes } from './http/routes/evaluations'

/**
 * @constant app
 * @description Instância principal do Fastify configurada com ZodTypeProvider.
 */
export const app = fastify().withTypeProvider<ZodTypeProvider>()

// Configuração de Compiladores para Validação e Serialização via Zod
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

// Registro de Middlewares Globais
app.register(fastifyCors, {
  origin: '*', // Em produção, altere para o domícnio do frontend (ex: 'http://localhost:5173')
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
})

app.register(fastifyCookie)
app.register(fastifyCsrfProtection)
app.register(fastifyRateLimit, {
  max: 100,
  timeWindow: '1 minute'
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

// Configuração do Swagger para Documentação da API
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'OpiniAuto API',
      description: 'API para avaliação de carros - Projeto Final PPI II',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

// Registro de Grupos de Rotas
app.register(authRoutes)
app.register(passwordRecoveryRoutes)
app.register(carsRoutes)
app.register(evaluationsRoutes)

/**
 * @interface FastifyJWT
 * @description Extensão da tipagem do JWT para incluir dados de sub e role.
 */
declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      sub: string
      role: 'USER' | 'ADMIN'
    }
    user: {
      sub: string
      role: 'USER' | 'ADMIN'
    }
  }
}

