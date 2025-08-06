const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function clearAllData() {
  try {
    console.log('🧹 Limpando todos os dados...')

    // Limpar em ordem devido às foreign keys
    await prisma.invoiceAnimal.deleteMany({})
    await prisma.weight.deleteMany({})
    await prisma.cost.deleteMany({})
    await prisma.gestation.deleteMany({})
    await prisma.sale.deleteMany({})
    await prisma.animal.deleteMany({})
    await prisma.invoice.deleteMany({})
    await prisma.saleEvent.deleteMany({})
    await prisma.gta.deleteMany({})
    await prisma.alert.deleteMany({})
    await prisma.marketPrice.deleteMany({})

    console.log('✅ Todos os dados foram removidos!')
  } catch (error) {
    console.error('❌ Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

clearAllData()
