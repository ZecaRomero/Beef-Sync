import { prisma } from '../../lib/prisma'

export default async function handler(req, res) {
  try {
    const costs = await prisma.cost.findMany({
      include: {
        animal: {
          select: {
            brinco: true,
            nome: true,
            raca: true,
            categoria: true
          }
        }
      },
      orderBy: { data: 'desc' }
    })

    console.log('Total de custos:', costs.length)
    res.status(200).json(costs)
  } catch (error) {
    console.error('Erro ao listar custos:', error)
    res.status(500).json({ message: 'Erro ao listar custos' })
  }
}
