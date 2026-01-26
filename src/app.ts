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


export const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

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

app.register(authRoutes)
app.register(passwordRecoveryRoutes)
app.register(carsRoutes)
app.register(evaluationsRoutes)

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

