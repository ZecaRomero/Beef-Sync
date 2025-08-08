import { prisma } from '../../../lib/prisma'
import { withAuth } from '../../../lib/auth'

async function handler(req, res) {
  const { method } = req
  const userId = req.user.id

  switch (method) {
    case 'GET':
      try {
        const { status, tipo, prioridade, limit = 50 } = req.query
        
        const where = {
          userId,
          ...(status && { status }),
          ...(tipo && { tipo }),
          ...(prioridade && { prioridade })
        }

        const notifications = await prisma.notification.findMany({
          where,
          orderBy: [
            { prioridade: 'desc' },
            { dataCriacao: 'desc' }
          ],
          take: parseInt(limit),
          include: {
            gta: {
              select: {
                numero: true,
                dataEmissao: true
              }
            }
          }
        })

        res.status(200).json(notifications)
      } catch (error) {
        console.error('Get notifications error:', error)
        res.status(500).json({ message: 'Erro ao buscar notificações' })
      }
      break

    case 'POST':
      try {
        const { tipo, titulo, mensagem, prioridade, dataAgendada, gtaId, dados } = req.body

        if (!tipo || !titulo || !mensagem) {
          return res.status(400).json({ message: 'Tipo, título e mensagem são obrigatórios' })
        }

        const notification = await prisma.notification.create({
          data: {
            tipo,
            titulo,
            mensagem,
            prioridade: prioridade || 'MEDIA',
            dataAgendada: dataAgendada ? new Date(dataAgendada) : null,
            gtaId,
            dados: dados ? JSON.stringify(dados) : null,
            userId
          }
        })

        res.status(201).json(notification)
      } catch (error) {
        console.error('Create notification error:', error)
        res.status(500).json({ message: 'Erro ao criar notificação' })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

export default withAuth(handler)
