import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'DELETE') {
    try {
      const invoiceId = parseInt(id);
      
      if (isNaN(invoiceId)) {
        return res.status(400).json({ error: 'ID da nota fiscal inválido' });
      }

      // Buscar a nota fiscal para obter os animais
      const invoice = await prisma.invoice.findUnique({
        where: { id: invoiceId },
        include: {
          animals: true
        }
      });

      if (!invoice) {
        return res.status(404).json({ error: 'Nota fiscal não encontrada' });
      }

      // Obter IDs dos animais para voltar ao status ATIVO
      const animalIds = invoice.animals.map(ia => ia.animalId);

      // Deletar a nota fiscal (cascade irá deletar os relacionamentos)
      await prisma.invoice.delete({
        where: { id: invoiceId }
      });

      // Voltar animais para status ATIVO
      if (animalIds.length > 0) {
        await prisma.animal.updateMany({
          where: {
            id: { in: animalIds }
          },
          data: {
            status: 'ATIVO',
            valorVenda: null
          }
        });
      }

      res.status(200).json({ 
        message: 'Nota fiscal excluída com sucesso',
        animalsReactivated: animalIds.length
      });
    } catch (error) {
      console.error('Erro ao excluir nota fiscal:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}