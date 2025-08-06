import { prisma } from '../../lib/prisma'

export default async function handler(req, res) {
  try {
    // Buscar vendas reais
    const sales = await prisma.sale.findMany({
      include: {
        animal: {
          select: {
            id: true,
            brinco: true,
            nome: true,
            raca: true,
            sexo: true
          }
        }
      },
      orderBy: { dataVenda: 'desc' },
      take: 50 // Limitar a 50 vendas mais recentes
    });

    // Buscar animais para criar dados de exemplo se não houver vendas
    const animals = await prisma.animal.findMany({
      select: {
        id: true,
        brinco: true,
        nome: true,
        raca: true,
        sexo: true,
        status: true
      },
      where: {
        status: 'ATIVO'
      },
      take: 100 // Limitar a 100 animais
    });

    // Converter para formato BI
    const biData = sales.length > 0 ? sales.map(sale => ({
      date: sale.dataVenda,
      vendas: 1,
      valor: sale.valorVenda || 0,
      categoria: sale.animal?.sexo === 'MACHO' ? 'Boi Gordo' : 'Vaca',
      regiao: sale.estadoComprador || 'SP',
      animal: {
        id: sale.animal?.brinco || sale.animalId,
        nome: sale.animal?.nome,
        raca: sale.animal?.raca,
        sexo: sale.animal?.sexo
      }
    })) : [];

    res.status(200).json({
      sales: biData,
      animals: animals,
      hasRealSales: sales.length > 0,
      totalAnimals: animals.length,
      totalSales: sales.length
    });

  } catch (error) {
    console.error('Erro ao buscar dados para BI:', error);
    res.status(500).json({ 
      message: 'Erro ao buscar dados',
      sales: [],
      animals: [],
      hasRealSales: false,
      totalAnimals: 0,
      totalSales: 0
    });
  }
}