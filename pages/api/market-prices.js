import { prisma } from '../../lib/prisma'

export default async function handler(req, res) {
  try {
    const marketPrices = await prisma.marketPrice.findMany({
      orderBy: { data: 'desc' },
      take: 10 // Últimos 10 preços
    })

    // Se não houver dados, retornar preços simulados
    if (marketPrices.length === 0) {
      const simulatedPrices = [
        {
          id: '1',
          categoria: 'GARROTE',
          precoMedio: 28000,
          precoMinimo: 25000,
          precoMaximo: 32000,
          data: new Date(),
          regiao: 'Centro-Oeste',
          observacoes: 'Preços estáveis no mercado'
        },
        {
          id: '2',
          categoria: 'NOVILHA',
          precoMedio: 32000,
          precoMinimo: 28000,
          precoMaximo: 38000,
          data: new Date(),
          regiao: 'Centro-Oeste',
          observacoes: 'Demanda alta para novilhas'
        },
        {
          id: '3',
          categoria: 'BOI_GORDO',
          precoMedio: 18000,
          precoMinimo: 16000,
          precoMaximo: 22000,
          data: new Date(),
          regiao: 'Centro-Oeste',
          observacoes: 'Preços em alta para boi gordo'
        },
        {
          id: '4',
          categoria: 'VACA_GORDA',
          precoMedio: 15000,
          precoMinimo: 13000,
          precoMaximo: 18000,
          data: new Date(),
          regiao: 'Centro-Oeste',
          observacoes: 'Mercado estável para vacas'
        },
        {
          id: '5',
          categoria: 'REPRODUTOR',
          precoMedio: 45000,
          precoMinimo: 40000,
          precoMaximo: 55000,
          data: new Date(),
          regiao: 'Centro-Oeste',
          observacoes: 'Alta demanda para reprodutores'
        },
        {
          id: '6',
          categoria: 'REPRODUTORA',
          precoMedio: 38000,
          precoMinimo: 35000,
          precoMaximo: 45000,
          data: new Date(),
          regiao: 'Centro-Oeste',
          observacoes: 'Boa procura para reprodutoras'
        },
        {
          id: '7',
          categoria: 'BEZERRO',
          precoMedio: 22000,
          precoMinimo: 20000,
          precoMaximo: 28000,
          data: new Date(),
          regiao: 'Centro-Oeste',
          observacoes: 'Mercado aquecido para bezerros'
        }
      ]
      
      res.status(200).json(simulatedPrices)
    } else {
      res.status(200).json(marketPrices)
    }
  } catch (error) {
    console.error('Erro ao buscar preços de mercado:', error)
    res.status(500).json({ message: 'Erro ao buscar preços de mercado' })
  }
}
