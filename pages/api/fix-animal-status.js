import { prisma } from '../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // Atualizar animais que têm vendas para status VENDIDO
    const updatedFromSales = await prisma.animal.updateMany({
      where: {
        status: 'ATIVO',
        sales: {
          some: {} // Tem pelo menos uma venda
        }
      },
      data: {
        status: 'VENDIDO'
      }
    })

    // Atualizar animais que têm valorVenda preenchido para status VENDIDO
    const updatedFromValue = await prisma.animal.updateMany({
      where: {
        status: 'ATIVO',
        valorVenda: {
          not: null
        }
      },
      data: {
        status: 'VENDIDO'
      }
    })

    const totalUpdated = updatedFromSales.count + updatedFromValue.count

    console.log(`✅ ${totalUpdated} animais tiveram o status corrigido para VENDIDO`)

    res.status(200).json({
      success: true,
      message: `${totalUpdated} animais corrigidos com sucesso`,
      updatedFromSales: updatedFromSales.count,
      updatedFromValue: updatedFromValue.count,
      total: totalUpdated
    })

  } catch (error) {
    console.error('❌ Erro ao corrigir status dos animais:', error)
    res.status(500).json({
      success: false,
      message: 'Erro ao corrigir status',
      error: error.message
    })
  }
}
