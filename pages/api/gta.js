import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const gtas = await prisma.gTA.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });

      res.status(200).json(gtas);
    } catch (error) {
      console.error('Erro ao buscar GTAs:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  } else if (req.method === 'POST') {
    try {
      const {
        numero,
        origem,
        destino,
        dataEmissao,
        finalidade,
        transportador
      } = req.body;

      const gta = await prisma.gTA.create({
        data: {
          numero,
          origem,
          destino,
          dataEmissao: dataEmissao ? new Date(dataEmissao) : null,
          finalidade,
          transportador
        }
      });

      res.status(201).json(gta);
    } catch (error) {
      console.error('Erro ao criar GTA:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}