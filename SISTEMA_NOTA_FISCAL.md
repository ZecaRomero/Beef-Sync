# 📋 Sistema de Notas Fiscais - Beef Sync

## 🎯 Visão Geral

O sistema de Notas Fiscais foi implementado para substituir o evento específico do "Leilão 03/08" por um sistema mais flexível e completo de gestão de vendas, permitindo:

- ✅ Criação de Notas Fiscais de venda
- ✅ Controle de preços por animal
- ✅ Gestão de compradores com dados completos
- ✅ Controle por estado (UF)
- ✅ Status de NF (Pendente, Emitida, Paga, Cancelada)
- ✅ Integração com sistema de animais

## 🚀 Funcionalidades Principais

### 1. **Gestão de Notas Fiscais**
- Criação de NF com número único
- Dados completos do comprador (Nome, CPF/CNPJ, Endereço, Cidade, Estado, CEP)
- Seleção múltipla de animais
- Definição de preço individual por animal
- Cálculo automático do valor total
- Observações personalizadas
- Controle de status

### 2. **Controle de Animais**
- Animais são automaticamente marcados como "VENDIDO" ao serem incluídos em uma NF
- Preço de venda é registrado individualmente
- Animais voltam para "ATIVO" se removidos da NF ou NF excluída
- Integração com sistema existente de animais

### 3. **Relatórios e Analytics**
- Controle de vendas por estado
- Análise de preços por animal
- Histórico de compradores
- Valor total de vendas

## 🛠️ Como Usar

### **Acessar o Sistema**
1. Na tela principal, clique no botão **"📋 NOTA FISCAL"**
2. Ou acesse através do **MarketPriceManager** na aba **"📋 NF"**

### **Criar Nova NF**
1. Clique em **"Nova NF"**
2. Preencha os dados da NF:
   - Número da NF (obrigatório)
   - Data da venda
   - Status inicial

3. Preencha os dados do comprador:
   - Nome/Razão Social (obrigatório)
   - CPF/CNPJ
   - Endereço completo
   - Cidade e Estado
   - CEP

4. Selecione os animais:
   - Escolha animais disponíveis (status ATIVO)
   - Defina o preço individual de cada animal
   - O valor total é calculado automaticamente

5. Adicione observações se necessário
6. Clique em **"Criar NF"**

### **Editar NF Existente**
1. Na lista de NFs, clique no ícone de edição (✏️)
2. Modifique os dados necessários
3. Adicione ou remova animais
4. Clique em **"Atualizar NF"**

### **Excluir NF**
1. Na lista de NFs, clique no ícone de exclusão (🗑️)
2. Confirme a exclusão
3. Os animais voltarão automaticamente para status "ATIVO"

## 📊 Status de NF

- **PENDENTE**: NF criada, aguardando emissão
- **EMITIDA**: NF oficialmente emitida
- **PAGA**: Pagamento recebido
- **CANCELADA**: NF cancelada

## 🗃️ Estrutura do Banco de Dados

### **Tabela: invoices**
- `id`: ID único da NF
- `numero`: Número da NF (único)
- `compradorNome`: Nome do comprador
- `compradorCpfCnpj`: CPF/CNPJ
- `compradorEndereco`: Endereço completo
- `compradorCidade`: Cidade
- `compradorEstado`: Estado (UF)
- `compradorCep`: CEP
- `valorTotal`: Valor total da NF
- `dataVenda`: Data da venda
- `observacoes`: Observações
- `status`: Status da NF
- `createdAt`: Data de criação
- `updatedAt`: Data de atualização

### **Tabela: invoice_animals**
- `id`: ID único
- `invoiceId`: ID da NF
- `animalId`: ID do animal
- `preco`: Preço individual do animal

## 🔄 Integração com Sistema Existente

### **Animais**
- Campo `valorVenda` atualizado automaticamente
- Status alterado para "VENDIDO" quando incluído em NF
- Volta para "ATIVO" quando removido da NF

### **Preços de Mercado**
- Sistema mantém compatibilidade com preços existentes
- Preços podem ser usados como referência para NFs

### **Relatórios BI**
- Dados de NF integrados aos relatórios existentes
- Análises por estado, comprador e período

## 🎨 Interface

### **Cores e Ícones**
- 📋 Verde/Azul para NFs
- 🐄 Ícones de animais
- 💰 Valores em verde
- 📍 Estados com badges coloridos
- ✅ Status com cores específicas

### **Responsividade**
- Interface adaptável para desktop e mobile
- Tabelas com scroll horizontal
- Formulários organizados em grid responsivo

## 🔧 APIs Disponíveis

### **GET /api/invoices**
Retorna todas as NFs com animais relacionados

### **POST /api/invoices**
Cria nova NF

### **PUT /api/invoices**
Atualiza NF existente

### **DELETE /api/invoices/[id]**
Exclui NF e restaura animais

### **GET /api/buyers**
Retorna lista de compradores únicos

## 📈 Melhorias Futuras

- [ ] Impressão de NF em PDF
- [ ] Integração com sistemas fiscais
- [ ] Relatórios avançados por estado
- [ ] Dashboard de vendas por período
- [ ] Notificações automáticas
- [ ] Backup automático de NFs
- [ ] Integração com WhatsApp para envio de NFs

## 🎉 Benefícios

✅ **Organização**: Controle completo de vendas
✅ **Flexibilidade**: Não limitado a eventos específicos
✅ **Rastreabilidade**: Histórico completo de vendas
✅ **Compliance**: Dados estruturados para fiscalização
✅ **Analytics**: Relatórios detalhados por estado/comprador
✅ **Automação**: Status de animais atualizado automaticamente

---

**Data de Implementação**: 04/08/2025
**Versão**: 1.0
**Status**: ✅ Implementado e Funcional