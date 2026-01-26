import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export async function passwordRecoveryRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post("/password/recover", {
    schema: {
      tags: ["Auth"],
      summary: "Request password recovery",
      body: z.object({
        email: z.string().email(),
      }),
      response: {
        200: z.object({
          message: z.string(),
        }),
      },
    },
  }, async (request, reply) => {
    // TODO: Implementar envio de email com token de recuperação
    // 1. Verificar se email existe
    // 2. Gerar token de recuperação (semelhante ao refresh token, mas com expiração curta)
    // 3. Salvar token no banco
    // 4. Enviar email (AWS SES ou SMTP)
    
    return reply.status(200).send({ 
      message: "If the email exists, a recovery link has been sent." 
    });
  });

  app.withTypeProvider<ZodTypeProvider>().post("/password/reset", {
    schema: {
      tags: ["Auth"],
      summary: "Reset password using recovery token",
      body: z.object({
        token: z.string(),
        newPassword: z.string().min(6),
      }),
      response: {
        200: z.object({
          message: z.string(),
        }),
      },
    },
  }, async (request, reply) => {
    // TODO: Implementar reset de senha
    // 1. Validar token
    // 2. Hash da nova senha
    // 3. Atualizar usuário
    // 4. Invalidar token
    
    return reply.status(200).send({ 
      message: "Password reset successfully." 
    });
  });
}
