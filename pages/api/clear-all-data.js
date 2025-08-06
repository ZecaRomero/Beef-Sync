import { prisma } from '../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    console.log('🧹 Iniciando limpeza completa do banco de dados...')

    // 1. Limpar dados relacionados aos animais primeiro (devido às foreign keys)
    await prisma.invoiceAnimal.deleteMany({})
    await prisma.weight.deleteMany({})
    await prisma.cost.deleteMany({})
    await prisma.gestation.deleteMany({})
    await prisma.sale.deleteMany({})

    // 2. Limpar animais
    const animalsCount = await prisma.animal.count()
    await prisma.animal.deleteMany({})

    // 3. Limpar notas fiscais
    const invoicesCount = await prisma.invoice.count()
    await prisma.invoice.deleteMany({})

    // 4. Limpar eventos de venda
    const saleEventsCount = await prisma.saleEvent.count()
    await prisma.saleEvent.deleteMany({})

    // 5. Limpar GTAs
    const gtasCount = await prisma.gta.count()
    await prisma.gta.deleteMany({})

    // 6. Limpar alertas
    const alertsCount = await prisma.alert.count()
    await prisma.alert.deleteMany({})

    // 7. Limpar preços de mercado
    const marketPricesCount = await prisma.marketPrice.count()
    await prisma.marketPrice.deleteMany({})

    // 8. Manter apenas o usuário principal (não deletar usuários)

    console.log('✅ Limpeza completa finalizada!')

    res.status(200).json({
      message: 'Todos os dados foram removidos com sucesso!',
      summary: {
        animalsDeleted: animalsCount,
        invoicesDeleted: invoicesCount,
        saleEventsDeleted: saleEventsCount,
        gtasDeleted: gtasCount,
        alertsDeleted: alertsCount,
        marketPricesDeleted: marketPricesCount
      }
    })
  } catch (error) {
    console.error('❌ Erro ao limpar dados:', error)
    res.status(500).json({
      message: 'Erro ao limpar dados',
      error: error.message
    })
  }
}
