import { prisma } from '../../lib/prisma'

export default async function handler(req, res) {
  try {
    const weights = await prisma.weight.findMany({
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

    console.log('Total de pesagens:', weights.length)
    res.status(200).json(weights)
  } catch (error) {
    console.error('Erro ao listar pesos:', error)
    res.status(500).json({ message: 'Erro ao listar pesos' })
  }
}
