import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const invoices = await prisma.invoice.findMany({
        include: {
          animals: {
            include: {
              animal: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      // Formatar os dados para o frontend
      const formattedInvoices = invoices.map(invoice => ({
        ...invoice,
        animais: invoice.animals.map(ia => ({
          id: ia.animal.id,
          brinco: ia.animal.brinco,
          nome: ia.animal.nome,
          raca: ia.animal.raca,
          sexo: ia.animal.sexo,
          preco: ia.preco
        }))
      }));

      res.status(200).json(formattedInvoices);
    } catch (error) {
      console.error('Erro ao buscar notas fiscais:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  } else if (req.method === 'POST') {
    try {
      const {
        numero,
        tipoVenda,
        compradorNome,
        compradorCpfCnpj,
        compradorEndereco,
        compradorCidade,
        compradorEstado,
        compradorCep,
        animais,
        valorTotal,
        dataVenda,
        observacoes,
        status
      } = req.body;

      // Criar a nota fiscal
      const invoice = await prisma.invoice.create({
        data: {
          numero,
          tipoVenda: tipoVenda || "VENDA_DIRETA",
          compradorNome,
          compradorCpfCnpj,
          compradorEndereco,
          compradorCidade,
          compradorEstado,
          compradorCep,
          valorTotal,
          dataVenda: new Date(dataVenda),
          observacoes,
          status,
          animals: {
            create: animais.map(animal => ({
              animalId: animal.id,
              preco: animal.preco
            }))
          }
        },
        include: {
          animals: {
            include: {
              animal: true
            }
          }
        }
      });

      // Atualizar status dos animais para VENDIDO
      await prisma.animal.updateMany({
        where: {
          id: {
            in: animais.map(a => a.id)
          }
        },
        data: {
          status: 'VENDIDO',
          valorVenda: undefined // Será definido individualmente
        }
      });

      // Atualizar valor de venda individual de cada animal
      for (const animal of animais) {
        await prisma.animal.update({
          where: { id: animal.id },
          data: { valorVenda: animal.preco }
        });
      }

      res.status(201).json(invoice);
    } catch (error) {
      console.error('Erro ao criar nota fiscal:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  } else if (req.method === 'PUT') {
    try {
      const {
        id,
        numero,
        compradorNome,
        compradorCpfCnpj,
        compradorEndereco,
        compradorCidade,
        compradorEstado,
        compradorCep,
        animais,
        valorTotal,
        dataVenda,
        observacoes,
        status
      } = req.body;

      // Buscar a NF atual para comparar animais
      const currentInvoice = await prisma.invoice.findUnique({
        where: { id },
        include: {
          animals: true
        }
      });

      if (!currentInvoice) {
        return res.status(404).json({ error: 'Nota fiscal não encontrada' });
      }

      // Animais que estavam na NF anterior
      const previousAnimalIds = currentInvoice.animals.map(ia => ia.animalId);
      
      // Animais que estarão na NF atualizada
      const newAnimalIds = animais.map(a => a.id);

      // Animais removidos da NF (voltar para ATIVO)
      const removedAnimalIds = previousAnimalIds.filter(id => !newAnimalIds.includes(id));
      
      // Animais adicionados à NF (marcar como VENDIDO)
      const addedAnimalIds = newAnimalIds.filter(id => !previousAnimalIds.includes(id));

      // Atualizar a nota fiscal
      const updatedInvoice = await prisma.invoice.update({
        where: { id },
        data: {
          numero,
          compradorNome,
          compradorCpfCnpj,
          compradorEndereco,
          compradorCidade,
          compradorEstado,
          compradorCep,
          valorTotal,
          dataVenda: new Date(dataVenda),
          observacoes,
          status,
          animals: {
            deleteMany: {},
            create: animais.map(animal => ({
              animalId: animal.id,
              preco: animal.preco
            }))
          }
        },
        include: {
          animals: {
            include: {
              animal: true
            }
          }
        }
      });

      // Atualizar status dos animais removidos para ATIVO
      if (removedAnimalIds.length > 0) {
        await prisma.animal.updateMany({
          where: {
            id: { in: removedAnimalIds }
          },
          data: {
            status: 'ATIVO',
            valorVenda: null
          }
        });
      }

      // Atualizar status dos animais adicionados para VENDIDO
      if (addedAnimalIds.length > 0) {
        await prisma.animal.updateMany({
          where: {
            id: { in: addedAnimalIds }
          },
          data: {
            status: 'VENDIDO'
          }
        });
      }

      // Atualizar valor de venda individual de cada animal
      for (const animal of animais) {
        await prisma.animal.update({
          where: { id: animal.id },
          data: { valorVenda: animal.preco }
        });
      }

      res.status(200).json(updatedInvoice);
    } catch (error) {
      console.error('Erro ao atualizar nota fiscal:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}