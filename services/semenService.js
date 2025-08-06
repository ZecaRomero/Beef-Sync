// Serviço para gerenciar doses de sêmen
export class SemenService {
  constructor() {
    this.doses = [];
    
    // Carregar dados apenas no cliente
    if (typeof window !== 'undefined') {
      this.doses = this.loadFromStorage() || [];
    }
  }

  // Carregar do localStorage
  loadFromStorage() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const data = localStorage.getItem('semen_doses');
        return data ? JSON.parse(data) : [];
      }
      return [];
    } catch (error) {
      console.error('Erro ao carregar doses de sêmen do localStorage:', error);
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('semen_doses');
      }
      return [];
    }
  }

  // Salvar no localStorage
  saveToStorage() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('semen_doses', JSON.stringify(this.doses));
      }
    } catch (error) {
      console.error('Erro ao salvar doses de sêmen no localStorage:', error);
    }
  }

  // Criar nova dose
  createDose(data) {
    const newDose = {
      id: Date.now(),
      created: new Date().toISOString(),
      quantidadeUsada: 0, // Controle de doses utilizadas
      ...data
    };
    
    this.doses.push(newDose);
    this.saveToStorage();
    return newDose;
  }

  // Atualizar dose
  updateDose(id, data) {
    const doseIndex = this.doses.findIndex(d => d.id === id);
    if (doseIndex === -1) return null;

    this.doses[doseIndex] = { ...this.doses[doseIndex], ...data };
    this.saveToStorage();
    return this.doses[doseIndex];
  }

  // Deletar dose
  deleteDose(id) {
    this.doses = this.doses.filter(d => d.id !== id);
    this.saveToStorage();
  }

  // Obter todas as doses
  getAllDoses() {
    return this.doses;
  }

  // Obter dose por ID
  getDose(id) {
    return this.doses.find(d => d.id === id);
  }

  // Obter touros disponíveis (para usar na FIV)
  getAvailableTouros() {
    return this.doses
      .filter(dose => {
        const dosesDisponiveis = parseInt(dose.quantidadeDoses) - (dose.quantidadeUsada || 0);
        return dosesDisponiveis > 0;
      })
      .map(dose => ({
        id: dose.id,
        nome: dose.nomeTouro,
        raca: dose.raca,
        rg: dose.rg,
        dosesDisponiveis: parseInt(dose.quantidadeDoses) - (dose.quantidadeUsada || 0),
        displayName: `${dose.nomeTouro} - ${dose.raca} (${parseInt(dose.quantidadeDoses) - (dose.quantidadeUsada || 0)} doses)`
      }));
  }

  // Usar dose (quando utilizada na FIV)
  useDose(touroId, quantidade = 1) {
    const dose = this.doses.find(d => d.id === touroId);
    if (!dose) return false;

    const dosesDisponiveis = parseInt(dose.quantidadeDoses) - (dose.quantidadeUsada || 0);
    if (dosesDisponiveis < quantidade) return false;

    dose.quantidadeUsada = (dose.quantidadeUsada || 0) + quantidade;
    this.saveToStorage();
    return true;
  }

  // Devolver dose (se cancelar FIV)
  returnDose(touroId, quantidade = 1) {
    const dose = this.doses.find(d => d.id === touroId);
    if (!dose) return false;

    dose.quantidadeUsada = Math.max(0, (dose.quantidadeUsada || 0) - quantidade);
    this.saveToStorage();
    return true;
  }

  // Buscar touros por nome
  searchTouros(searchTerm) {
    const term = searchTerm.toLowerCase();
    return this.getAvailableTouros().filter(touro => 
      touro.nome.toLowerCase().includes(term) ||
      touro.raca.toLowerCase().includes(term) ||
      touro.rg.includes(term)
    );
  }

  // Relatório de estoque
  getStockReport() {
    const totalDoses = this.doses.reduce((total, dose) => 
      total + parseInt(dose.quantidadeDoses), 0
    );
    
    const dosesUsadas = this.doses.reduce((total, dose) => 
      total + (dose.quantidadeUsada || 0), 0
    );
    
    const dosesDisponiveis = totalDoses - dosesUsadas;
    
    const valorTotal = this.doses.reduce((total, dose) => 
      total + (parseFloat(dose.valor) || 0), 0
    );

    return {
      totalLotes: this.doses.length,
      totalDoses,
      dosesUsadas,
      dosesDisponiveis,
      valorTotal,
      tourosUnicos: new Set(this.doses.map(d => d.nomeTouro)).size,
      percentualUso: totalDoses > 0 ? (dosesUsadas / totalDoses) * 100 : 0
    };
  }
}

// Instância singleton
export const semenService = new SemenService();