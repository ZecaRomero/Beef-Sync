const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testNotifications() {
  try {
    console.log('🧪 Testando sistema de notificações...')

    // Buscar um usuário para testar
    const user = await prisma.user.findFirst()
    if (!user) {
      console.log('❌ Nenhum usuário encontrado. Crie um usuário primeiro.')
      return
    }

    console.log(`✅ Usuário encontrado: ${user.name} (${user.email})`)

    // Criar notificações de todos os tipos
    const notifications = [
      // GTA Follow-up
      {
        tipo: 'GTA_FOLLOWUP',
        titulo: '📞 Confirmação de Chegada - GTA',
        mensagem: 'Ligar para João Silva para confirmar se os animais da GTA 1234567 chegaram bem',
        prioridade: 'ALTA',
        status: 'PENDENTE',
        dataAgendada: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 dias
        dados: JSON.stringify({
          gtaNumero: '1234567',
          compradorNome: 'João Silva',
          compradorTelefone: '11999999999',
          followUpType: 'confirmação_chegada',
          animais: ['Boi 123', 'Vaca 456']
        })
      },
      // Nascimento
      {
        tipo: 'NASCIMENTO',
        titulo: '🐄 Novo Nascimento - Animal',
        mensagem: 'Animal RPT 789 nasceu em 15/01/2024',
        prioridade: 'MEDIA',
        status: 'PENDENTE',
        dados: JSON.stringify({
          animalId: 'animal-123',
          serie: 'RPT',
          brinco: '789',
          sexo: 'MACHO',
          dataNascimento: '2024-01-15',
          mae: 'Vaca 456',
          pai: 'Touro 123'
        })
      },
      // Venda
      {
        tipo: 'VENDA',
        titulo: '💰 Venda Realizada',
        mensagem: 'Venda de Boi 123 por R$ 5.000,00 para Maria Santos',
        prioridade: 'MEDIA',
        status: 'PENDENTE',
        dados: JSON.stringify({
          animalId: 'animal-123',
          animalNome: 'Boi 123',
          valor: 5000,
          comprador: 'Maria Santos',
          dataVenda: '2024-01-15',
          formaPagamento: 'PIX'
        })
      },
      // Gestação
      {
        tipo: 'GESTACAO',
        titulo: '🤰 Nova Gestação',
        mensagem: 'Animal Vaca 456 confirmada gestante - Data prevista: 15/03/2024',
        prioridade: 'MEDIA',
        status: 'PENDENTE',
        dados: JSON.stringify({
          animalId: 'animal-456',
          animalNome: 'Vaca 456',
          dataConfirmacao: '2024-01-15',
          dataPrevista: '2024-03-15',
          touro: 'Touro 123'
        })
      },
      // Parto
      {
        tipo: 'PARTO',
        titulo: '🐣 Parto Realizado',
        mensagem: 'Animal Vaca 789 pariu em 15/01/2024 - 1 filhote',
        prioridade: 'ALTA',
        status: 'PENDENTE',
        dados: JSON.stringify({
          animalId: 'animal-789',
          animalNome: 'Vaca 789',
          dataParto: '2024-01-15',
          quantidadeFilhotes: 1,
          observacoes: 'Parto normal'
        })
      },
      // Vacinação
      {
        tipo: 'VACINACAO',
        titulo: '💉 Vacinação Realizada',
        mensagem: 'Animal Boi 123 vacinado com Febre Aftosa em 15/01/2024',
        prioridade: 'MEDIA',
        status: 'PENDENTE',
        dados: JSON.stringify({
          animalId: 'animal-123',
          animalNome: 'Boi 123',
          vacina: 'Febre Aftosa',
          dataVacinacao: '2024-01-15',
          proximaVacinacao: '2024-07-15'
        })
      },
      // Pesagem
      {
        tipo: 'PESAGEM',
        titulo: '⚖️ Pesagem Realizada',
        mensagem: 'Animal Vaca 456 pesado: 450kg em 15/01/2024',
        prioridade: 'BAIXA',
        status: 'PENDENTE',
        dados: JSON.stringify({
          animalId: 'animal-456',
          animalNome: 'Vaca 456',
          peso: 450,
          dataPesagem: '2024-01-15',
          ganhoPeso: 25
        })
      },
      // Sistema
      {
        tipo: 'SYSTEM_ALERT',
        titulo: '🔔 Alerta do Sistema',
        mensagem: 'Backup automático realizado com sucesso',
        prioridade: 'BAIXA',
        status: 'LIDA',
        dados: JSON.stringify({
          systemEvent: 'backup',
          timestamp: new Date().toISOString()
        })
      }
    ]

    for (const notificationData of notifications) {
      const notification = await prisma.notification.create({
        data: {
          ...notificationData,
          userId: user.id
        }
      })
      console.log(`✅ Notificação criada: ${notification.titulo}`)
    }

    // Buscar todas as notificações do usuário
    const allNotifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { dataCriacao: 'desc' }
    })

    console.log(`\n📊 Resumo das notificações:`)
    console.log(`• Total: ${allNotifications.length}`)
    console.log(`• Pendentes: ${allNotifications.filter(n => n.status === 'PENDENTE').length}`)
    console.log(`• Lidas: ${allNotifications.filter(n => n.status === 'LIDA').length}`)
    console.log(`• Resolvidas: ${allNotifications.filter(n => n.status === 'RESOLVIDA').length}`)
    console.log(`• Alta prioridade: ${allNotifications.filter(n => n.prioridade === 'ALTA').length}`)

    // Mostrar tipos de notificações
    const tipos = [...new Set(allNotifications.map(n => n.tipo))]
    console.log(`\n🎯 Tipos de notificações criadas:`)
    tipos.forEach(tipo => {
      const count = allNotifications.filter(n => n.tipo === tipo).length
      console.log(`• ${tipo}: ${count}`)
    })

    console.log('\n🎉 Teste concluído com sucesso!')
    console.log('💡 Agora você pode testar o sistema de notificações no frontend.')
    console.log('🔔 Clique no sino no header para ver as notificações!')

  } catch (error) {
    console.error('❌ Erro ao testar notificações:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testNotifications()
