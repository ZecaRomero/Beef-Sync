// Serviço para gerenciar dados de reprodução
export class ReproductionService {
  constructor() {
    this.processes = [];
    this.costs = {
      coleta: 800,
      fiv: 1200,
      te: 600,
      dg: 150,
      sexagem: 200,
      receptora: 2500,
      frete: 300,
      veterinario: 400,
      laboratorio: 500
    };
    
    // Carregar dados apenas no cliente
    if (typeof window !== 'undefined') {
      this.processes = this.loadFromStorage() || [];
    }
  }

  // Salvar no localStorage (simula banco de dados)
  saveToStorage() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('reproduction_processes', JSON.stringify(this.processes));
      }
    } catch (error) {
      console.error('Erro ao salvar dados no localStorage:', error);
    }
  }

  // Carregar do localStorage
  loadFromStorage() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const data = localStorage.getItem('reproduction_processes');
        return data ? JSON.parse(data) : [];
      }
      return [];
    } catch (error) {
      console.error('Erro ao carregar dados do localStorage:', error);
      // Limpar dados corrompidos
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('reproduction_processes');
      }
      return [];
    }
  }

  // Criar novo processo
  createProcess(data) {
    const newProcess = {
      id: Date.now(),
      created: new Date().toISOString(),
      status: 'coleta',
      custoTotal: 0,
      custoRealizado: 0,
      lucroEstimado: 0,
      ...data,
      faseColeta: null,
      faseFIV: null,
      faseTE: null,
      faseDG: null,
      faseSexagem: null,
      faseEntrega: null
    };
    
    this.processes.push(newProcess);
    this.saveToStorage();
    return newProcess;
  }

  // Atualizar processo
  updateProcess(processId, fase, data) {
    const processIndex = this.processes.findIndex(p => p.id === processId);
    if (processIndex === -1) return null;

    this.processes[processIndex][fase] = data;
    
    // Recalcular custos
    this.calculateCosts(processId);
    
    // Auto-criar próximas fases
    this.autoCreateNextPhase(processId, fase);
    
    this.saveToStorage();
    return this.processes[processIndex];
  }

  // Calcular custos automaticamente
  calculateCosts(processId) {
    const process = this.processes.find(p => p.id === processId);
    if (!process) return;

    let custoTotal = 0;
    let custoRealizado = 0;

    // Custos por fase
    if (process.faseColeta?.realizada) {
      custoRealizado += this.costs.coleta + this.costs.veterinario;
    }
    if (process.faseFIV?.realizada) {
      custoRealizado += this.costs.fiv + this.costs.laboratorio;
    }
    if (process.faseTE?.realizada) {
      custoRealizado += this.costs.te + this.costs.veterinario;
    }
    if (process.faseDG?.realizada) {
      custoRealizado += this.costs.dg + this.costs.veterinario;
    }
    if (process.faseSexagem?.realizada) {
      custoRealizado += this.costs.sexagem;
    }

    // Custos de receptoras
    if (process.faseEntrega?.receptoras) {
      process.faseEntrega.receptoras.forEach(receptora => {
        if (receptora.valorReceptora) {
          custoRealizado += parseFloat(receptora.valorReceptora) || 0;
        } else {
          custoRealizado += this.costs.receptora;
        }
        custoRealizado += parseFloat(receptora.valorFrete) || this.costs.frete;
      });
    }

    // Estimar custo total se não finalizado
    custoTotal = custoRealizado;
    if (!process.faseEntrega?.realizada) {
      const embrioes = parseInt(process.faseFIV?.quantidadeEmbrioes) || 1;
      const receptorasEstimadas = Math.min(embrioes, 10); // máximo 10 receptoras
      custoTotal += (receptorasEstimadas * (this.costs.receptora + this.costs.frete));
    }

    // Calcular lucro estimado (valor de venda - custos)
    const valorVendaEstimado = this.calculateEstimatedRevenue(process);
    const lucroEstimado = valorVendaEstimado - custoTotal;

    process.custoTotal = custoTotal;
    process.custoRealizado = custoRealizado;
    process.lucroEstimado = lucroEstimado;
  }

  // Calcular receita estimada
  calculateEstimatedRevenue(process) {
    let totalEmbrioes = 0;
    
    if (process.faseFIV?.totalEmbrioes) {
      totalEmbrioes = process.faseFIV.totalEmbrioes;
    } else if (process.faseFIV?.resultadosFIV) {
      totalEmbrioes = process.faseFIV.resultadosFIV.reduce((total, r) => 
        total + (parseInt(r.quantidadeEmbrioes) || 0), 0
      );
    } else {
      totalEmbrioes = 1;
    }
    
    const taxaSucesso = 0.6; // 60% de taxa de sucesso
    const valorPorBezerro = 3500; // valor médio de venda
    
    return Math.floor(totalEmbrioes * taxaSucesso * valorPorBezerro);
  }

  // Auto-criar próximas fases
  autoCreateNextPhase(processId, currentPhase) {
    const process = this.processes.find(p => p.id === processId);
    if (!process) return;

    switch (currentPhase) {
      case 'faseColeta':
        if (process.faseColeta?.realizada && !process.faseFIV && process.faseColeta?.doadoras) {
          const fivDate = new Date(process.faseColeta.data);
          fivDate.setDate(fivDate.getDate() + 1);
          
          const resultadosFIV = process.faseColeta.doadoras.map(doadora => ({
            doadoraNome: doadora.nome,
            touroAcasalamento: doadora.touroAcasalamento,
            quantidadeOocitos: doadora.quantidadeOocitos,
            quantidadeEmbrioes: '',
            observacoes: ''
          }));
          
          process.faseFIV = {
            data: fivDate.toISOString().split('T')[0],
            laboratorio: '',
            veterinario: '',
            resultadosFIV: resultadosFIV,
            realizada: false
          };
        }
        break;

      case 'faseFIV':
        if (process.faseFIV?.realizada && !process.faseTE) {
          const teDate = new Date(process.faseColeta.data);
          teDate.setDate(teDate.getDate() + 7);
          
          const totalEmbrioes = process.faseFIV.totalEmbrioes || 
            process.faseFIV.resultadosFIV?.reduce((total, r) => total + (parseInt(r.quantidadeEmbrioes) || 0), 0) || 1;
          
          process.faseTE = {
            data: teDate.toISOString().split('T')[0],
            local: '',
            receptoras: this.generateReceptoras(totalEmbrioes),
            veterinario: '',
            observacoes: '',
            realizada: false
          };
        }
        break;

      case 'faseTE':
        if (process.faseTE?.realizada && !process.faseDG) {
          const dgDate = new Date(process.faseTE.data);
          dgDate.setDate(dgDate.getDate() + 30);
          
          process.faseDG = {
            data: dgDate.toISOString().split('T')[0],
            receptoras: process.faseTE.receptoras.map(r => ({
              ...r,
              resultado: '',
              dataRealizada: ''
            })),
            veterinario: '',
            observacoes: '',
            realizada: false
          };
        }
        break;

      case 'faseDG':
        if (process.faseDG?.realizada) {
          const receptorasPrenhas = process.faseDG.receptoras.filter(r => r.resultado === 'prenha');
          
          if (receptorasPrenhas.length > 0 && !process.faseSexagem) {
            process.faseSexagem = {
              data: '',
              receptoras: receptorasPrenhas.map(r => ({
                ...r,
                sexo: '',
                previsaoParto: this.calculatePartoDate(process.faseTE.data)
              })),
              realizada: false
            };
          }

          // Auto-criar entrega para receptoras prenhas
          if (receptorasPrenhas.length > 0 && !process.faseEntrega) {
            const entregaDate = new Date();
            entregaDate.setDate(entregaDate.getDate() + 2);
            
            process.faseEntrega = {
              data: entregaDate.toISOString().split('T')[0],
              receptoras: receptorasPrenhas.map(r => ({
                ...r,
                frente: '',
                dataEntrega: '',
                motorista: '',
                notaFiscal: '',
                valorReceptora: this.costs.receptora,
                valorFrete: this.costs.frete
              })),
              realizada: false
            };
          }
        }
        break;
    }
  }

  // Gerar códigos de receptoras automaticamente
  generateReceptoras(quantidade) {
    const receptoras = [];
    for (let i = 0; i < quantidade; i++) {
      receptoras.push({
        codigo: `RPT${String(Date.now() + i).slice(-4)}`,
        status: 'ativa'
      });
    }
    return receptoras;
  }

  // Calcular data de parto (9 meses após TE)
  calculatePartoDate(teDate) {
    const parto = new Date(teDate);
    parto.setMonth(parto.getMonth() + 9);
    return parto.toISOString().split('T')[0];
  }

  // Obter alertas
  getAlerts() {
    const today = new Date();
    const alerts = [];

    this.processes.forEach(process => {
      // Alerta DG
      if (process.faseTE?.realizada && !process.faseDG?.realizada) {
        const dgDate = new Date(process.faseTE.data);
        dgDate.setDate(dgDate.getDate() + 30);
        const daysDiff = Math.ceil((dgDate - today) / (1000 * 60 * 60 * 24));
        
        if (daysDiff <= 3 && daysDiff >= 0) {
          alerts.push({
            id: process.id,
            type: 'DG',
            priority: daysDiff === 0 ? 'high' : 'medium',
            message: `DG da doadora ${process.faseColeta?.doadora} ${daysDiff === 0 ? 'deve ser feito HOJE' : `em ${daysDiff} dias`}`,
            date: dgDate,
            cost: this.costs.dg + this.costs.veterinario
          });
        }
      }

      // Alerta Parto
      if (process.faseSexagem?.receptoras) {
        process.faseSexagem.receptoras.forEach(receptora => {
          if (receptora.previsaoParto) {
            const partoDate = new Date(receptora.previsaoParto);
            const daysDiff = Math.ceil((partoDate - today) / (1000 * 60 * 60 * 24));
            
            if (daysDiff <= 30 && daysDiff >= 0) {
              alerts.push({
                id: process.id,
                type: 'PARTO',
                priority: daysDiff <= 7 ? 'high' : 'medium',
                message: `Parto da receptora ${receptora.codigo} previsto para ${daysDiff} dias`,
                date: partoDate,
                receptora: receptora.codigo
              });
            }
          }
        });
      }

      // Alerta Entrega
      if (process.faseEntrega && !process.faseEntrega.realizada) {
        const entregaDate = new Date(process.faseEntrega.data);
        const daysDiff = Math.ceil((entregaDate - today) / (1000 * 60 * 60 * 24));
        
        if (daysDiff <= 1 && daysDiff >= 0) {
          alerts.push({
            id: process.id,
            type: 'ENTREGA',
            priority: 'high',
            message: `Entrega das receptoras deve ser feita ${daysDiff === 0 ? 'HOJE' : 'amanhã'}`,
            date: entregaDate
          });
        }
      }
    });

    return alerts.sort((a, b) => {
      if (a.priority === 'high' && b.priority !== 'high') return -1;
      if (b.priority === 'high' && a.priority !== 'high') return 1;
      return new Date(a.date) - new Date(b.date);
    });
  }

  // Relatório financeiro
  getFinancialReport() {
    const report = {
      totalProcessos: this.processes.length,
      processosAtivos: this.processes.filter(p => !p.faseEntrega?.realizada).length,
      custoTotalRealizado: 0,
      custoTotalEstimado: 0,
      lucroEstimado: 0,
      receptorasAtivas: 0,
      bezerrosEsperados: 0
    };

    this.processes.forEach(process => {
      report.custoTotalRealizado += process.custoRealizado || 0;
      report.custoTotalEstimado += process.custoTotal || 0;
      report.lucroEstimado += process.lucroEstimado || 0;
      
      if (process.faseDG?.receptoras) {
        const prenhas = process.faseDG.receptoras.filter(r => r.resultado === 'prenha');
        report.receptorasAtivas += prenhas.length;
        report.bezerrosEsperados += prenhas.length;
      }
    });

    return report;
  }

  // Obter todos os processos
  getAllProcesses() {
    return this.processes;
  }

  // Obter processo por ID
  getProcess(id) {
    return this.processes.find(p => p.id === id);
  }

  // Deletar processo
  deleteProcess(id) {
    this.processes = this.processes.filter(p => p.id !== id);
    this.saveToStorage();
  }

  // Atualizar custos padrão
  updateCosts(newCosts) {
    this.costs = { ...this.costs, ...newCosts };
    
    // Recalcular todos os processos
    this.processes.forEach(process => {
      this.calculateCosts(process.id);
    });
    
    this.saveToStorage();
  }
}

// Instância singleton
export const reproductionService = new ReproductionService();