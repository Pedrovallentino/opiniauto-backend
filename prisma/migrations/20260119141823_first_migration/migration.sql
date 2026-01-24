-- CreateEnum
CREATE TYPE "Perfil" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "StatusCarro" AS ENUM ('ATIVO', 'INATIVO');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "perfil" "Perfil" NOT NULL DEFAULT 'USER',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Carro" (
    "id" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "categoria" TEXT NOT NULL,
    "tipoMotorizacao" TEXT NOT NULL,
    "status" "StatusCarro" NOT NULL DEFAULT 'ATIVO',
    "imagem" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Carro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Avaliacao" (
    "id" TEXT NOT NULL,
    "notaDesempenho" INTEGER NOT NULL,
    "notaConforto" INTEGER NOT NULL,
    "notaConsumo" INTEGER NOT NULL,
    "notaDesign" INTEGER NOT NULL,
    "notaCustoBeneficio" INTEGER NOT NULL,
    "notaFinal" DOUBLE PRECISION NOT NULL,
    "comentario" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" TEXT NOT NULL,
    "carroId" TEXT NOT NULL,

    CONSTRAINT "Avaliacao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Avaliacao_usuarioId_carroId_key" ON "Avaliacao"("usuarioId", "carroId");

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_carroId_fkey" FOREIGN KEY ("carroId") REFERENCES "Carro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
