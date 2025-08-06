import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const animals = await prisma.animal.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });

      res.status(200).json(animals);
    } catch (error) {
      console.error('Erro ao buscar animais:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  } else if (req.method === 'POST') {
    try {
      const {
        brinco,
        serie,
        nome,
        raca,
        sexo,
        dataNascimento,
        status,
        observacoes,
        valorVenda,
        era,
        pai,
        mae,
        avoMaterno,
        receptora,
        tipoCobertura
      } = req.body;

      // Verificar se já existe um animal com o mesmo brinco
      const existingAnimal = await prisma.animal.findUnique({
        where: { brinco }
      });

      if (existingAnimal) {
        return res.status(400).json({ error: 'Já existe um animal com este brinco' });
      }

      const animal = await prisma.animal.create({
        data: {
          brinco,
          serie,
          nome: nome || brinco,
          raca,
          sexo,
          dataNasc: dataNascimento ? new Date(dataNascimento) : null,
          status: status || 'ATIVO',
          observacoes,
          valorVenda,
          era,
          pai,
          mae,
          avoMaterno,
          receptora,
          tipoCobertura,
          userId: 'clxxx-default-user' // Temporário - deve vir da sessão
        }
      });

      res.status(201).json(animal);
    } catch (error) {
      console.error('Erro ao criar animal:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}