import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const semenStock = await prisma.semenStock.findMany({
        include: {
          container: true,
          caneca: true,
          user: {
            select: {
              name: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      // Formatar dados para o frontend
      const formattedStock = semenStock.map(stock => ({
        id: stock.id,
        nomeTouro: stock.nomeTouro,
        rg: stock.rg,
        raca: stock.raca,
        fornecedor: stock.fornecedor,
        notaFiscal: stock.notaFiscal,
        quantidadeTotal: stock.quantidadeTotal,
        quantidadeDisponivel: stock.quantidadeDisponivel,
        quantidadeUsada: stock.quantidadeUsada,
        valorUnitario: stock.valorUnitario,
        dataEntrada: stock.dataEntrada,
        dataColeta: stock.dataColeta,
        dataVencimento: stock.dataVencimento,
        botijaoNumero: stock.container.botijaoNumero,
        canecaNumero: stock.caneca.numero,
        posicao: stock.posicao,
        status: stock.status.toLowerCase(),
        responsavel: stock.responsavel,
        observacoes: stock.observacoes
      }));

      res.status(200).json(formattedStock);
    } catch (error) {
      console.error('Erro ao buscar estoque de sêmen:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  } else if (req.method === 'POST') {
    try {
      const {
        nomeTouro,
        rg,
        raca,
        fornecedor,
        notaFiscal,
        quantidadeDoses,
        valorUnitario,
        dataColeta,
        dataVencimento,
        botijaoNumero,
        canecaNumero,
        posicao,
        responsavel,
        observacoes
      } = req.body;

      // Validações básicas
      if (!nomeTouro || !rg || !raca || !quantidadeDoses || !botijaoNumero || !canecaNumero) {
        return res.status(400).json({ 
          error: 'Campos obrigatórios: nomeTouro, rg, raca, quantidadeDoses, botijaoNumero, canecaNumero' 
        });
      }

      // Buscar ou criar container
      let container = await prisma.semenContainer.findFirst({
        where: { botijaoNumero }
      });

      if (!container) {
        // Criar container se não existir
        container = await prisma.semenContainer.create({
          data: {
            botijaoNumero,
            capacidade: 500, // Capacidade padrão
            userId: 'default-user-id', // TODO: Usar ID do usuário logado
            status: 'ATIVO'
          }
        });
      }

      // Buscar ou criar caneca
      let caneca = await prisma.semenCaneca.findFirst({
        where: {
          containerId: container.id,
          numero: canecaNumero
        }
      });

      if (!caneca) {
        caneca = await prisma.semenCaneca.create({
          data: {
            numero: canecaNumero,
            capacidade: 50, // Capacidade padrão
            containerId: container.id
          }
        });
      }

      // Criar entrada no estoque
      const semenStock = await prisma.semenStock.create({
        data: {
          nomeTouro,
          rg,
          raca,
          fornecedor: fornecedor || '',
          notaFiscal: notaFiscal || '',
          quantidadeTotal: parseInt(quantidadeDoses),
          quantidadeDisponivel: parseInt(quantidadeDoses),
          quantidadeUsada: 0,
          valorUnitario: parseFloat(valorUnitario) || 0,
          dataColeta: dataColeta ? new Date(dataColeta) : null,
          dataVencimento: dataVencimento ? new Date(dataVencimento) : null,
          posicao: posicao || '',
          status: 'DISPONIVEL',
          responsavel: responsavel || '',
          observacoes: observacoes || '',
          userId: 'default-user-id', // TODO: Usar ID do usuário logado
          containerId: container.id,
          canecaId: caneca.id
        },
        include: {
          container: true,
          caneca: true
        }
      });

      // Atualizar ocupação da caneca
      await prisma.semenCaneca.update({
        where: { id: caneca.id },
        data: {
          ocupacao: {
            increment: parseInt(quantidadeDoses)
          }
        }
      });

      // Registrar movimentação de entrada
      await prisma.semenMovement.create({
        data: {
          tipo: 'ENTRADA',
          responsavel: responsavel || '',
          quantidade: parseInt(quantidadeDoses),
          motivo: 'Compra de sêmen',
          valorUnitario: parseFloat(valorUnitario) || 0,
          observacoes: `Entrada: ${fornecedor} - NF: ${notaFiscal}`,
          userId: 'default-user-id', // TODO: Usar ID do usuário logado
          semenStockId: semenStock.id,
          containerDestinoId: container.id
        }
      });

      res.status(201).json({ 
        message: 'Entrada de sêmen registrada com sucesso',
        id: semenStock.id
      });
    } catch (error) {
      console.error('Erro ao criar entrada de sêmen:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, ...updateData } = req.body;
      
      if (!id) {
        return res.status(400).json({ error: 'ID é obrigatório para atualização' });
      }

      const updatedStock = await prisma.semenStock.update({
        where: { id },
        data: {
          ...updateData,
          updatedAt: new Date()
        }
      });
      
      res.status(200).json({ 
        message: 'Estoque de sêmen atualizado com sucesso',
        data: updatedStock
      });
    } catch (error) {
      console.error('Erro ao atualizar sêmen:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}