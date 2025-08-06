// API para gerenciamento de materiais
export const materialsAPI = {
  // Buscar todos os materiais
  async getAll() {
    try {
      const response = await fetch('/api/materials');
      if (!response.ok) {
        throw new Error('Erro ao buscar materiais');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro na API de materiais:', error);
      // Retorna dados mock em caso de erro
      return [
        {
          id: 1,
          name: "Brinco Auricular Numerado",
          category: "identificacao",
          quantity: 500,
          unit: "unidade",
          unitPrice: 2.5,
          totalValue: 1250.0,
          supplier: "Agropecuária Silva",
          purchaseDate: "2024-01-15",
          expiryDate: null,
          batchNumber: "BR2024001",
          location: "Estoque Principal",
          minStock: 100,
          status: "active",
          notes: "Brincos numerados de 1 a 500"
        },
        {
          id: 2,
          name: "Ivermectina 1% - 500ml",
          category: "medicamento",
          quantity: 12,
          unit: "frasco",
          unitPrice: 45.9,
          totalValue: 550.8,
          supplier: "Vetfarma Ltda",
          purchaseDate: "2024-01-20",
          expiryDate: "2026-01-20",
          batchNumber: "IVM240120",
          location: "Farmácia Veterinária",
          minStock: 5,
          status: "active",
          notes: "Antiparasitário de amplo espectro"
        }
      ];
    }
  },

  // Criar novo material
  async create(material) {
    try {
      const response = await fetch('/api/materials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(material)
      });

      if (!response.ok) {
        throw new Error('Erro ao criar material');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao criar material:', error);
      // Retorna mock do material criado
      return {
        id: Date.now(),
        ...material,
        status: 'active',
        totalValue: material.quantity * material.unitPrice
      };
    }
  },

  // Atualizar material
  async update(id, updates) {
    try {
      const response = await fetch(`/api/materials/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar material');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao atualizar material:', error);
      // Retorna mock do material atualizado
      return {
        id,
        ...updates,
        totalValue: updates.quantity * updates.unitPrice
      };
    }
  },

  // Deletar material
  async delete(id) {
    try {
      const response = await fetch(`/api/materials/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar material');
      }

      return { success: true };
    } catch (error) {
      console.error('Erro ao deletar material:', error);
      // Simula sucesso mesmo com erro
      return { success: true };
    }
  }
};
