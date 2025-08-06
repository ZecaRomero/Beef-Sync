import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Por enquanto retorna array vazio até implementar tabela de histórico de compras
      // TODO: Implementar tabela de purchase_history no banco de dados
      const purchaseHistory = [];
      
      res.status(200).json(purchaseHistory);
    } catch (error) {
      console.error('Erro ao buscar histórico de compras:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}