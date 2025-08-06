import { prisma } from '../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { animalId, valorVenda, nomeComprador, dataVenda, observacoes } = req.body;

    console.log('📝 Registrando venda simples:', {
      animalId,
      valorVenda,
      nomeComprador,
      dataVenda
    });

    // Validações básicas
    if (!animalId || !valorVenda) {
      return res.status(400).json({ 
        message: 'Animal ID e valor da venda são obrigatórios' 
      });
    }

    // Verificar se o animal existe
    const animal = await prisma.animal.findUnique({
      where: { id: animalId }
    });

    if (!animal) {
      return res.status(404).json({ 
        message: 'Animal não encontrado' 
      });
    }

    // Criar registro de venda
    const sale = await prisma.sale.create({
      data: {
        animalId: animalId,
        valorVenda: parseFloat(valorVenda),
        nomeComprador: nomeComprador || 'Comprador do Leilão',
        dataVenda: dataVenda ? new Date(dataVenda) : new Date(),
        observacoes: observacoes || `Venda registrada em ${new Date().toLocaleString('pt-BR')}`,
        // Campos adicionais que podem ser úteis
        precoKg: null,
        pesoVenda: null,
        comissao: 0,
        taxas: 0
      },
      include: {
        animal: true
      }
    });

    console.log('✅ Venda registrada:', sale);

    // Resposta de sucesso
    res.status(201).json({
      success: true,
      message: `Venda de ${animal.brinco} registrada com sucesso!`,
      sale: {
        id: sale.id,
        animal: animal.brinco,
        buyer: sale.nomeComprador,
        value: sale.valorVenda,
        date: sale.dataVenda,
        notes: sale.observacoes
      }
    });

  } catch (error) {
    console.error('❌ Erro ao registrar venda:', error);
    
    // Tratamento de erros específicos
    if (error.code === 'P2002') {
      return res.status(400).json({ 
        message: 'Este animal já possui uma venda registrada' 
      });
    }

    res.status(500).json({ 
      success: false,
      message: 'Erro interno do servidor ao registrar venda',
      error: error.message 
    });
  }
}