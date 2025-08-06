import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Por enquanto retorna array vazio até implementar tabela de materiais
      // TODO: Implementar tabela de materiais no banco de dados
      const materials = [];
      
      res.status(200).json(materials);
    } catch (error) {
      console.error('Erro ao buscar materiais:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  } else if (req.method === 'POST') {
    try {
      // TODO: Implementar criação de materiais
      const materialData = req.body;
      
      // Por enquanto apenas retorna sucesso
      res.status(201).json({ 
        message: 'Material criado com sucesso',
        id: Date.now() // ID temporário
      });
    } catch (error) {
      console.error('Erro ao criar material:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}