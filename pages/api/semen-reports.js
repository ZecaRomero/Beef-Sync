import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { type, startDate, endDate } = req.query;

      let reportData = {};

      switch (type) {
        case 'estoque':
          reportData = await generateEstoqueReport();
          break;
        case 'movimentacoes':
          reportData = await generateMovimentacoesReport(startDate, endDate);
          break;
        case 'vencimentos':
          reportData = await generateVencimentosReport();
          break;
        case 'financeiro':
          reportData = await generateFinanceiroReport(startDate, endDate);
          break;
        default:
          return res.status(400).json({ error: 'Tipo de relatório inválido' });
      }

      res.status(200).json(reportData);
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function generateEstoqueReport() {
  const semenStock = await prisma.semenStock.findMany({
    include: {
      container: true,
      caneca: true
    },
    where: {
      quantidadeDisponivel: {
        gt: 0
      }
    }
  });

  const totalDoses = semenStock.reduce((sum, item) => sum + item.quantidadeDisponivel, 0);
  const totalTouros = new Set(semenStock.map(item => item.nomeTouro)).size;
  const valorTotal = semenStock.reduce((sum, item) => sum + (item.quantidadeDisponivel * item.valorUnitario), 0);
  
  const today = new Date();
  const dosesVencendo = semenStock.filter(item => {
    if (!item.dataVencimento) return false;
    const diffDays = Math.ceil((new Date(item.dataVencimento) - today) / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays >= 0;
  }).length;

  const detalhes = semenStock.map(item => ({
    nomeTouro: item.nomeTouro,
    rg: item.rg,
    raca: item.raca,
    quantidadeDisponivel: item.quantidadeDisponivel,
    valorUnitario: item.valorUnitario,
    dataVencimento: item.dataVencimento,
    botijaoNumero: item.container.botijaoNumero,
    canecaNumero: item.caneca.numero
  }));

  return {
    totalDoses,
    totalTouros,
    valorTotal,
    dosesVencendo,
    detalhes
  };
}

async function generateMovimentacoesReport(startDate, endDate) {
  const whereClause = {};
  
  if (startDate && endDate) {
    whereClause.data = {
      gte: new Date(startDate),
      lte: new Date(endDate)
    };
  }

  const movimentacoes = await prisma.semenMovement.findMany({
    where: whereClause,
    include: {
      semenStock: {
        select: {
          nomeTouro: true,
          rg: true
        }
      }
    },
    orderBy: {
      data: 'desc'
    }
  });

  const totalEntradas = movimentacoes.filter(m => m.tipo === 'ENTRADA').reduce((sum, m) => sum + m.quantidade, 0);
  const totalSaidas = movimentacoes.filter(m => m.tipo === 'SAIDA').reduce((sum, m) => sum + m.quantidade, 0);
  const totalTransferencias = movimentacoes.filter(m => m.tipo === 'TRANSFERENCIA').reduce((sum, m) => sum + m.quantidade, 0);

  const movimentacoesFormatadas = movimentacoes.map(mov => ({
    data: mov.data,
    tipo: mov.tipo,
    nomeTouro: mov.semenStock?.nomeTouro || '',
    rg: mov.semenStock?.rg || '',
    quantidade: mov.quantidade,
    responsavel: mov.responsavel,
    motivo: mov.motivo
  }));

  return {
    totalEntradas,
    totalSaidas,
    totalTransferencias,
    movimentacoes: movimentacoesFormatadas
  };
}

async function generateVencimentosReport() {
  const semenStock = await prisma.semenStock.findMany({
    include: {
      container: true,
      caneca: true
    },
    where: {
      quantidadeDisponivel: {
        gt: 0
      },
      dataVencimento: {
        not: null
      }
    }
  });

  const today = new Date();
  
  const vencimentos = semenStock.map(item => {
    const diffDays = Math.ceil((new Date(item.dataVencimento) - today) / (1000 * 60 * 60 * 24));
    return {
      ...item,
      diasRestantes: diffDays,
      botijaoNumero: item.container.botijaoNumero,
      canecaNumero: item.caneca.numero
    };
  }).sort((a, b) => a.diasRestantes - b.diasRestantes);

  const vencendo30dias = vencimentos.filter(item => item.diasRestantes <= 30 && item.diasRestantes >= 0).length;
  const vencendo7dias = vencimentos.filter(item => item.diasRestantes <= 7 && item.diasRestantes >= 0).length;
  const vencidas = vencimentos.filter(item => item.diasRestantes < 0).length;

  return {
    vencendo30dias,
    vencendo7dias,
    vencidas,
    vencimentos
  };
}

async function generateFinanceiroReport(startDate, endDate) {
  // Valor total em estoque
  const semenStock = await prisma.semenStock.findMany({
    where: {
      quantidadeDisponivel: {
        gt: 0
      }
    }
  });

  const valorTotalEstoque = semenStock.reduce((sum, item) => sum + (item.quantidadeDisponivel * item.valorUnitario), 0);

  // Compras no período
  const whereClause = {};
  if (startDate && endDate) {
    whereClause.data = {
      gte: new Date(startDate),
      lte: new Date(endDate)
    };
  }

  const compras = await prisma.semenMovement.findMany({
    where: {
      ...whereClause,
      tipo: 'ENTRADA'
    }
  });

  const valorCompras = compras.reduce((sum, compra) => sum + (compra.quantidade * (compra.valorUnitario || 0)), 0);

  // Vendas no período (saídas com valor)
  const vendas = await prisma.semenMovement.findMany({
    where: {
      ...whereClause,
      tipo: 'SAIDA',
      valorUnitario: {
        gt: 0
      }
    }
  });

  const valorVendas = vendas.reduce((sum, venda) => sum + (venda.quantidade * venda.valorUnitario), 0);

  // Valor médio por dose
  const totalDoses = semenStock.reduce((sum, item) => sum + item.quantidadeDisponivel, 0);
  const valorMedio = totalDoses > 0 ? valorTotalEstoque / totalDoses : 0;

  return {
    valorTotalEstoque,
    valorCompras,
    valorVendas,
    valorMedio
  };
}