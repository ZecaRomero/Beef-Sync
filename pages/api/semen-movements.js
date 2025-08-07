import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const movements = await prisma.semenMovement.findMany({
        include: {
          semenStock: {
            select: {
              nomeTouro: true,
              rg: true
            }
          },
          containerOrigem: {
            select: {
              botijaoNumero: true
            }
          },
          containerDestino: {
            select: {
              botijaoNumero: true
            }
          },
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
      const formattedMovements = movements.map(movement => ({
        id: movement.id,
        tipo: movement.tipo.toLowerCase(),
        data: movement.data,
        responsavel: movement.responsavel,
        nomeTouro: movement.semenStock?.nomeTouro || '',
        rg: movement.semenStock?.rg || '',
        quantidade: movement.quantidade,
        botijaoOrigem: movement.containerOrigem?.botijaoNumero || null,
        botijaoDestino: movement.containerDestino?.botijaoNumero || null,
        motivo: movement.motivo,
        destinatario: movement.destinatario,
        valorUnitario: movement.valorUnitario,
        observacoes: movement.observacoes
      }));

      res.status(200).json(formattedMovements);
    } catch (error) {
      console.error('Erro ao buscar movimentações:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  } else if (req.method === 'POST') {
    try {
      const {
        tipo,
        responsavel,
        quantidade,
        motivo,
        destinatario,
        valorUnitario,
        observacoes,
        containerOrigemId,
        containerDestinoId
      } = req.body;
      
      let semenStockId = req.body.semenStockId;

      // Validações básicas
      if (!tipo || !responsavel || !quantidade) {
        return res.status(400).json({ 
          error: 'Campos obrigatórios: tipo, responsavel, quantidade' 
        });
      }

      // Para saídas, buscar o estoque pelo touro e localização se não tiver semenStockId
      if (tipo === 'SAIDA') {
        let stockId = semenStockId;
        
        // Se não tem semenStockId, buscar pelo nome do touro e RG
        if (!stockId && req.body.nomeTouro && req.body.rg) {
          const stock = await prisma.semenStock.findFirst({
            where: {
              nomeTouro: req.body.nomeTouro,
              rg: req.body.rg,
              quantidadeDisponivel: {
                gt: 0
              }
            }
          });
          stockId = stock?.id;
        }

        if (stockId) {
          const semenStock = await prisma.semenStock.findUnique({
            where: { id: stockId }
          });

          if (!semenStock) {
            return res.status(404).json({ error: 'Estoque de sêmen não encontrado' });
          }

          if (semenStock.quantidadeDisponivel < parseInt(quantidade)) {
            return res.status(400).json({ error: 'Quantidade insuficiente em estoque' });
          }

          // Atualizar estoque
          await prisma.semenStock.update({
            where: { id: stockId },
            data: {
              quantidadeDisponivel: {
                decrement: parseInt(quantidade)
              },
              quantidadeUsada: {
                increment: parseInt(quantidade)
              },
              status: semenStock.quantidadeDisponivel - parseInt(quantidade) === 0 ? 'USADO' : semenStock.status
            }
          });

          // Atualizar ocupação da caneca
          const caneca = await prisma.semenCaneca.findUnique({
            where: { id: semenStock.canecaId }
          });

          if (caneca) {
            await prisma.semenCaneca.update({
              where: { id: caneca.id },
              data: {
                ocupacao: {
                  decrement: parseInt(quantidade)
                }
              }
            });
          }

          // Usar o stockId encontrado para a movimentação
          semenStockId = stockId;
        }
      }

      // Registrar movimentação
      const movement = await prisma.semenMovement.create({
        data: {
          tipo: tipo.toUpperCase(),
          responsavel,
          quantidade: parseInt(quantidade),
          motivo: motivo || '',
          destinatario: destinatario || '',
          valorUnitario: parseFloat(valorUnitario) || 0,
          observacoes: observacoes || '',
          userId: 'default-user-id', // TODO: Usar ID do usuário logado
          semenStockId: semenStockId || null,
          containerOrigemId: containerOrigemId || null,
          containerDestinoId: containerDestinoId || null
        }
      });

      res.status(201).json({ 
        message: 'Movimentação registrada com sucesso',
        id: movement.id
      });
    } catch (error) {
      console.error('Erro ao criar movimentação:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}