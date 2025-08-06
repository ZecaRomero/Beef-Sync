import { prisma } from '../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('🔄 Iniciando atualização financeira...');

    // Buscar todos os animais vendidos
    const soldAnimals = await prisma.animal.findMany({
      where: {
        status: 'VENDIDO',
        valorVenda: {
          not: null
        }
      },
      include: {
        costs: true
      }
    });

    console.log(`📊 Encontrados ${soldAnimals.length} animais vendidos`);

    let updatedCount = 0;

    for (const animal of soldAnimals) {
      // Verificar se já existe um custo de venda
      const existingSaleCost = animal.costs.find(cost => cost.tipo === 'VENDA');
      
      if (!existingSaleCost && animal.valorVenda) {
        // Criar custo de venda
        await prisma.cost.create({
          data: {
            tipo: 'VENDA',
            descricao: `Venda do animal ${animal.brinco}`,
            valor: parseFloat(animal.valorVenda),
            data: animal.dataVenda || new Date(),
            animalId: animal.id,
            observacoes: `Venda registrada no leilão por R$ ${parseFloat(animal.valorVenda).toLocaleString('pt-BR')}`,
            userId: animal.userId
          }
        });

        updatedCount++;
        console.log(`💰 Custo de venda criado para ${animal.brinco}: R$ ${animal.valorVenda}`);
      }
    }

    // Buscar estatísticas atualizadas
    const totalSales = await prisma.cost.aggregate({
      where: {
        tipo: 'VENDA'
      },
      _sum: {
        valor: true
      },
      _count: {
        id: true
      }
    });

    const totalCosts = await prisma.cost.aggregate({
      where: {
        tipo: {
          not: 'VENDA'
        }
      },
      _sum: {
        valor: true
      }
    });

    const stats = {
      totalSalesValue: totalSales._sum.valor || 0,
      totalSalesCount: totalSales._count || 0,
      totalCosts: totalCosts._sum.valor || 0,
      profit: (totalSales._sum.valor || 0) - (totalCosts._sum.valor || 0),
      updatedAnimals: updatedCount
    };

    console.log('📈 Estatísticas financeiras:', stats);

    res.status(200).json({
      success: true,
      message: `Financeiro atualizado! ${updatedCount} animais processados.`,
      stats
    });

  } catch (error) {
    console.error('❌ Erro ao atualizar financeiro:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao atualizar dados financeiros',
      error: error.message 
    });
  }
}