import { prisma } from '../../lib/prisma'

export default async function handler(req, res) {
  try {
    const animals = await prisma.animal.findMany({
      include: {
        costs: true,
        sales: true
      },
      orderBy: { createdAt: 'desc' }
    })

    console.log('Total de animais:', animals.length)
    res.status(200).json(animals)
  } catch (error) {
    console.error('Erro ao listar animais:', error)
    res.status(500).json({ message: 'Erro ao listar animais' })
  }
}