import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const containers = await prisma.semenContainer.findMany({
        include: {
          canecas: {
            include: {
              semenStock: {
                select: {
                  quantidadeDisponivel: true
                }
              }
            }
          },
          user: {
            select: {
              name: true
            }
          }
        },
        orderBy: {
          botijaoNumero: 'asc'
        }
      });

      // Formatar dados para o frontend
      const formattedContainers = containers.map(container => ({
        id: container.id,
        botijaoNumero: container.botijaoNumero,
        marca: container.marca,
        modelo: container.modelo,
        capacidade: container.capacidade,
        dataAquisicao: container.dataAquisicao,
        status: container.status.toLowerCase(),
        temperatura: container.temperatura,
        nivelNitrogeno: container.nivelNitrogeno,
        proximaManutencao: container.proximaManutencao,
        canecas: container.canecas.map(caneca => ({
          id: caneca.id,
          numero: caneca.numero,
          capacidade: caneca.capacidade,
          ocupacao: caneca.semenStock.reduce((sum, stock) => sum + stock.quantidadeDisponivel, 0),
          posicoes: caneca.posicoes
        }))
      }));

      res.status(200).json(formattedContainers);
    } catch (error) {
      console.error('Erro ao buscar containers:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  } else if (req.method === 'POST') {
    try {
      const {
        botijaoNumero,
        marca,
        modelo,
        capacidade,
        dataAquisicao,
        temperatura,
        nivelNitrogeno,
        proximaManutencao,
        observacoes
      } = req.body;

      // Validações básicas
      if (!botijaoNumero) {
        return res.status(400).json({ 
          error: 'Número do botijão é obrigatório' 
        });
      }

      // Verificar se já existe
      const existingContainer = await prisma.semenContainer.findFirst({
        where: { botijaoNumero }
      });

      if (existingContainer) {
        return res.status(400).json({ 
          error: 'Já existe um botijão com este número' 
        });
      }

      const container = await prisma.semenContainer.create({
        data: {
          botijaoNumero,
          marca: marca || '',
          modelo: modelo || '',
          capacidade: parseInt(capacidade) || 500,
          dataAquisicao: dataAquisicao ? new Date(dataAquisicao) : null,
          temperatura: parseFloat(temperatura) || -196,
          nivelNitrogeno: parseFloat(nivelNitrogeno) || 100,
          proximaManutencao: proximaManutencao ? new Date(proximaManutencao) : null,
          observacoes: observacoes || '',
          userId: 'default-user-id', // TODO: Usar ID do usuário logado
          status: 'ATIVO'
        }
      });

      res.status(201).json({ 
        message: 'Container registrado com sucesso',
        id: container.id
      });
    } catch (error) {
      console.error('Erro ao criar container:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, ...updateData } = req.body;
      
      if (!id) {
        return res.status(400).json({ error: 'ID é obrigatório para atualização' });
      }

      const updatedContainer = await prisma.semenContainer.update({
        where: { id },
        data: {
          ...updateData,
          updatedAt: new Date()
        }
      });
      
      res.status(200).json({ 
        message: 'Container atualizado com sucesso',
        data: updatedContainer
      });
    } catch (error) {
      console.error('Erro ao atualizar container:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}