export class NotificationService {
  constructor() {
    this.baseUrl = '/api/notifications'
  }

  // Criar notificação de follow-up de GTA
  async createGTAFollowUp(gtaData, followUpType) {
    const followUpConfig = {
      'confirmação_chegada': {
        titulo: '📞 Confirmação de Chegada - GTA',
        mensagem: `Ligar para ${gtaData.compradorNome || 'cliente'} para confirmar se os animais da GTA ${gtaData.numero} chegaram bem`,
        prioridade: 'ALTA',
        diasOffset: 20
      },
      'verificação_satisfação': {
        titulo: '🤝 Follow-up Satisfação - GTA',
        mensagem: `Ligar para ${gtaData.compradorNome || 'cliente'} para verificar satisfação com os animais da GTA ${gtaData.numero}`,
        prioridade: 'MEDIA',
        diasOffset: 60
      },
      'oferta_novos_animais': {
        titulo: '🎯 Oferta Novos Animais - GTA',
        mensagem: `Ligar para ${gtaData.compradorNome || 'cliente'} para oferecer novos animais (GTA ${gtaData.numero})`,
        prioridade: 'MEDIA',
        diasOffset: 240
      },
      'lembrete_5_dias': {
        titulo: '⏰ Lembrete Follow-up - GTA',
        mensagem: `Em 5 dias: Ligar para ${gtaData.compradorNome || 'cliente'} sobre GTA ${gtaData.numero}`,
        prioridade: 'ALTA',
        diasOffset: -5
      }
    }

    const config = followUpConfig[followUpType]
    if (!config) {
      throw new Error(`Tipo de follow-up inválido: ${followUpType}`)
    }

    const dataAgendada = new Date(gtaData.dataEmissao)
    dataAgendada.setDate(dataAgendada.getDate() + config.diasOffset)

    const notificationData = {
      tipo: 'GTA_FOLLOWUP',
      titulo: config.titulo,
      mensagem: config.mensagem,
      prioridade: config.prioridade,
      dataAgendada: dataAgendada.toISOString(),
      gtaId: gtaData.id,
      dados: JSON.stringify({
        gtaNumero: gtaData.numero,
        compradorNome: gtaData.compradorNome,
        compradorTelefone: gtaData.compradorTelefone,
        followUpType,
        animais: gtaData.animais || []
      })
    }

    return this.createNotification(notificationData)
  }

  // Criar notificação de nascimento
  async createBirthNotification(animalData) {
    const notificationData = {
      tipo: 'NASCIMENTO',
      titulo: '🐄 Novo Nascimento - Animal',
      mensagem: `Animal ${animalData.serie || animalData.brinco || 'N/A'} nasceu em ${new Date(animalData.dataNascimento).toLocaleDateString('pt-BR')}`,
      prioridade: 'MEDIA',
      dados: JSON.stringify({
        animalId: animalData.id,
        serie: animalData.serie,
        brinco: animalData.brinco,
        sexo: animalData.sexo,
        dataNascimento: animalData.dataNascimento,
        mae: animalData.mae,
        pai: animalData.pai
      })
    }

    return this.createNotification(notificationData)
  }

  // Criar notificação de venda
  async createSaleNotification(saleData) {
    const notificationData = {
      tipo: 'VENDA',
      titulo: '💰 Venda Realizada',
      mensagem: `Venda de ${saleData.animalNome || 'animal'} por R$ ${saleData.valor?.toLocaleString('pt-BR') || 'N/A'} para ${saleData.comprador || 'cliente'}`,
      prioridade: 'MEDIA',
      dados: JSON.stringify({
        animalId: saleData.animalId,
        animalNome: saleData.animalNome,
        valor: saleData.valor,
        comprador: saleData.comprador,
        dataVenda: saleData.dataVenda,
        formaPagamento: saleData.formaPagamento
      })
    }

    return this.createNotification(notificationData)
  }

  // Criar notificação de gestação
  async createGestationNotification(gestationData) {
    const notificationData = {
      tipo: 'GESTACAO',
      titulo: '🤰 Nova Gestação',
      mensagem: `Animal ${gestationData.animalNome || 'N/A'} confirmada gestante - Data prevista: ${new Date(gestationData.dataPrevista).toLocaleDateString('pt-BR')}`,
      prioridade: 'MEDIA',
      dados: JSON.stringify({
        animalId: gestationData.animalId,
        animalNome: gestationData.animalNome,
        dataConfirmacao: gestationData.dataConfirmacao,
        dataPrevista: gestationData.dataPrevista,
        touro: gestationData.touro
      })
    }

    return this.createNotification(notificationData)
  }

  // Criar notificação de parto
  async createPartoNotification(partoData) {
    const notificationData = {
      tipo: 'PARTO',
      titulo: '🐣 Parto Realizado',
      mensagem: `Animal ${partoData.animalNome || 'N/A'} pariu em ${new Date(partoData.dataParto).toLocaleDateString('pt-BR')} - ${partoData.quantidadeFilhotes || 1} filhote(s)`,
      prioridade: 'ALTA',
      dados: JSON.stringify({
        animalId: partoData.animalId,
        animalNome: partoData.animalNome,
        dataParto: partoData.dataParto,
        quantidadeFilhotes: partoData.quantidadeFilhotes,
        observacoes: partoData.observacoes
      })
    }

    return this.createNotification(notificationData)
  }

  // Criar notificação de vacinação
  async createVaccinationNotification(vaccinationData) {
    const notificationData = {
      tipo: 'VACINACAO',
      titulo: '💉 Vacinação Realizada',
      mensagem: `Animal ${vaccinationData.animalNome || 'N/A'} vacinado com ${vaccinationData.vacina || 'vacina'} em ${new Date(vaccinationData.dataVacinacao).toLocaleDateString('pt-BR')}`,
      prioridade: 'MEDIA',
      dados: JSON.stringify({
        animalId: vaccinationData.animalId,
        animalNome: vaccinationData.animalNome,
        vacina: vaccinationData.vacina,
        dataVacinacao: vaccinationData.dataVacinacao,
        proximaVacinacao: vaccinationData.proximaVacinacao
      })
    }

    return this.createNotification(notificationData)
  }

  // Criar notificação de pesagem
  async createWeightNotification(weightData) {
    const notificationData = {
      tipo: 'PESAGEM',
      titulo: '⚖️ Pesagem Realizada',
      mensagem: `Animal ${weightData.animalNome || 'N/A'} pesado: ${weightData.peso}kg em ${new Date(weightData.dataPesagem).toLocaleDateString('pt-BR')}`,
      prioridade: 'BAIXA',
      dados: JSON.stringify({
        animalId: weightData.animalId,
        animalNome: weightData.animalNome,
        peso: weightData.peso,
        dataPesagem: weightData.dataPesagem,
        ganhoPeso: weightData.ganhoPeso
      })
    }

    return this.createNotification(notificationData)
  }

  // Criar notificação de sistema
  async createSystemNotification(systemData) {
    const notificationData = {
      tipo: 'SYSTEM_ALERT',
      titulo: systemData.titulo || '🔔 Alerta do Sistema',
      mensagem: systemData.mensagem || 'Notificação do sistema',
      prioridade: systemData.prioridade || 'BAIXA',
      dados: JSON.stringify({
        systemEvent: systemData.event,
        timestamp: new Date().toISOString(),
        ...systemData
      })
    }

    return this.createNotification(notificationData)
  }

  // Criar notificação genérica
  async createNotification(notificationData) {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('beef_sync_token')}`
        },
        body: JSON.stringify(notificationData)
      })

      if (!response.ok) {
        throw new Error('Erro ao criar notificação')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao criar notificação:', error)
      throw error
    }
  }

  // Buscar notificações
  async getNotifications(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters)
      const response = await fetch(`${this.baseUrl}?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('beef_sync_token')}`
        }
      })

      if (!response.ok) {
        throw new Error('Erro ao buscar notificações')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao buscar notificações:', error)
      throw error
    }
  }

  // Marcar notificação como lida
  async markAsRead(notificationId) {
    try {
      const response = await fetch(`${this.baseUrl}/${notificationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('beef_sync_token')}`
        },
        body: JSON.stringify({ status: 'LIDA' })
      })

      if (!response.ok) {
        throw new Error('Erro ao marcar notificação como lida')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error)
      throw error
    }
  }

  // Marcar notificação como resolvida
  async markAsResolved(notificationId, observacoes = '') {
    try {
      const response = await fetch(`${this.baseUrl}/${notificationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('beef_sync_token')}`
        },
        body: JSON.stringify({ 
          status: 'RESOLVIDA',
          observacoes
        })
      })

      if (!response.ok) {
        throw new Error('Erro ao marcar notificação como resolvida')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao marcar notificação como resolvida:', error)
      throw error
    }
  }

  // Excluir notificação
  async deleteNotification(notificationId) {
    try {
      const response = await fetch(`${this.baseUrl}/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('beef_sync_token')}`
        }
      })

      if (!response.ok) {
        throw new Error('Erro ao excluir notificação')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao excluir notificação:', error)
      throw error
    }
  }

  // Criar notificações automáticas para GTA
  async createGTAAutomaticNotifications(gtaData) {
    const notifications = []
    
    try {
      // Notificação de 5 dias antes
      const notif5Dias = await this.createGTAFollowUp(gtaData, 'lembrete_5_dias')
      notifications.push(notif5Dias)

      // Notificação de confirmação de chegada (20 dias)
      const notifChegada = await this.createGTAFollowUp(gtaData, 'confirmação_chegada')
      notifications.push(notifChegada)

      // Notificação de verificação de satisfação (2 meses)
      const notifSatisfacao = await this.createGTAFollowUp(gtaData, 'verificação_satisfação')
      notifications.push(notifSatisfacao)

      // Notificação de oferta de novos animais (8 meses)
      const notifOferta = await this.createGTAFollowUp(gtaData, 'oferta_novos_animais')
      notifications.push(notifOferta)

      return notifications
    } catch (error) {
      console.error('Erro ao criar notificações automáticas:', error)
      throw error
    }
  }

  // Buscar notificações pendentes
  async getPendingNotifications() {
    return this.getNotifications({ status: 'PENDENTE' })
  }

  // Buscar notificações de alta prioridade
  async getHighPriorityNotifications() {
    return this.getNotifications({ prioridade: 'ALTA', status: 'PENDENTE' })
  }

  // Buscar notificações de GTA
  async getGTANotifications() {
    return this.getNotifications({ tipo: 'GTA_FOLLOWUP' })
  }

  // Buscar notificações por tipo
  async getNotificationsByType(tipo) {
    return this.getNotifications({ tipo })
  }
}

export default new NotificationService()
