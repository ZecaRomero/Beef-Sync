import { prisma } from '../../../lib/prisma'
import { withAuth } from '../../../lib/auth'

async function handler(req, res) {
  const { method } = req
  const { id } = req.query
  const userId = req.user.id

  switch (method) {
    case 'GET':
      try {
        const notification = await prisma.notification.findFirst({
          where: {
            id,
            userId
          },
          include: {
            gta: {
              select: {
                numero: true,
                dataEmissao: true
              }
            }
          }
        })

        if (!notification) {
          return res.status(404).json({ message: 'Notificação não encontrada' })
        }

        res.status(200).json(notification)
      } catch (error) {
        console.error('Get notification error:', error)
        res.status(500).json({ message: 'Erro ao buscar notificação' })
      }
      break

    case 'PATCH':
      try {
        const { status, observacoes } = req.body

        const updateData = {}
        
        if (status) {
          updateData.status = status
          
          // Atualizar timestamps baseado no status
          if (status === 'LIDA' && !updateData.dataLida) {
            updateData.dataLida = new Date()
          } else if (status === 'RESOLVIDA' && !updateData.dataResolvida) {
            updateData.dataResolvida = new Date()
          }
        }

        if (observacoes) {
          updateData.dados = JSON.stringify({ 
            ...(updateData.dados ? JSON.parse(updateData.dados) : {}),
            observacoes 
          })
        }

        const notification = await prisma.notification.updateMany({
          where: {
            id,
            userId
          },
          data: updateData
        })

        if (notification.count === 0) {
          return res.status(404).json({ message: 'Notificação não encontrada' })
        }

        res.status(200).json({ message: 'Notificação atualizada com sucesso' })
      } catch (error) {
        console.error('Update notification error:', error)
        res.status(500).json({ message: 'Erro ao atualizar notificação' })
      }
      break

    case 'DELETE':
      try {
        const notification = await prisma.notification.deleteMany({
          where: {
            id,
            userId
          }
        })

        if (notification.count === 0) {
          return res.status(404).json({ message: 'Notificação não encontrada' })
        }

        res.status(200).json({ message: 'Notificação excluída com sucesso' })
      } catch (error) {
        console.error('Delete notification error:', error)
        res.status(500).json({ message: 'Erro ao excluir notificação' })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'PATCH', 'DELETE'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

export default withAuth(handler)
