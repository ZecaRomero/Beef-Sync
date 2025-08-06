import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const animal = await prisma.animal.findUnique({
        where: { id }
      });

      if (!animal) {
        return res.status(404).json({ error: 'Animal não encontrado' });
      }

      res.status(200).json(animal);
    } catch (error) {
      console.error('Erro ao buscar animal:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  } else if (req.method === 'PUT') {
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

      const animal = await prisma.animal.update({
        where: { id },
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
        }
      });

      res.status(200).json(animal);
    } catch (error) {
      console.error('Erro ao atualizar animal:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.animal.delete({
        where: { id }
      });

      res.status(200).json({ message: 'Animal excluído com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir animal:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}