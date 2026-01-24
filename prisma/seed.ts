import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const car = await prisma.carro.create({
    data: {
      marca: 'Toyota',
      modelo: 'Corolla',
      ano: 2024,
      categoria: 'Sedan',
      tipoMotorizacao: 'Híbrido',
      imagem: 'https://placehold.co/600x400/png', // URL válida
      status: 'ATIVO',
    },
  })

  console.log({ car })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
