import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Buscar compradores únicos das notas fiscais
      const buyers = await prisma.invoice.findMany({
        select: {
          compradorNome: true,
          compradorCpfCnpj: true,
          compradorEndereco: true,
          compradorCidade: true,
          compradorEstado: true,
          compradorCep: true
        },
        distinct: ['compradorNome']
      });

      res.status(200).json(buyers);
    } catch (error) {
      console.error('Erro ao buscar compradores:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}