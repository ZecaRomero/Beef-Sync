# 🐄 Como Editar Animais - Guia Rápido

## 📍 **Onde Encontrar**

A gestão de animais agora está integrada no **MarketPriceManager**:

1. **Abra o componente MarketPriceManager** (botão de preços de mercado)
2. **Clique na aba "🐄 Animais"** no header
3. **Você verá todos os animais cadastrados**

## ✅ **Funcionalidades Disponíveis**

### 📋 **Lista de Animais**
- **Tabela Completa**: Brinco, Nome, Raça, Sexo, Status
- **Busca Visual**: Fácil identificação dos animais
- **Status Colorido**: Verde (Ativo), Azul (Vendido), Vermelho (Morto)

### ➕ **Adicionar Novo Animal**
- **Botão "Novo Animal"**: No header e na tabela
- **Formulário Completo**: Série, RG, Sexo, Raça, etc.
- **Validações**: Campos obrigatórios e regras de negócio

### ✏️ **Editar Animal Existente**
- **Botão de Edição**: Ícone de lápis em cada linha
- **Formulário Pré-preenchido**: Com dados atuais do animal
- **Atualização Instantânea**: Dados salvos imediatamente

### 🗑️ **Excluir Animal**
- **Botão de Exclusão**: Ícone de lixeira em cada linha
- **Confirmação**: Pergunta antes de excluir
- **Remoção Segura**: Remove do banco de dados

## 🎯 **Como Usar Passo a Passo**

### 1. **Acessar a Gestão**
```
MarketPriceManager → Aba "🐄 Animais"
```

### 2. **Adicionar Novo Animal**
- Clique em "➕ Novo Animal"
- Preencha os campos obrigatórios:
  - **Série**: RPT, BENT, CJCJ, CJCG
  - **RG**: Número único (até 6 dígitos)
  - **Sexo**: Macho ou Fêmea
  - **Raça**: Preenchida automaticamente
- Clique em "Salvar"

### 3. **Editar Animal Existente**
- Encontre o animal na tabela
- Clique no ícone ✏️ (Editar)
- Modifique os campos desejados
- Clique em "Atualizar"

### 4. **Excluir Animal**
- Encontre o animal na tabela
- Clique no ícone 🗑️ (Excluir)
- Confirme a exclusão
- Animal será removido permanentemente

## 📊 **Informações Exibidas**

### **Colunas da Tabela:**
- **Brinco**: Identificação única (ex: CJCJ 15397)
- **Nome**: Nome do animal (se informado)
- **Raça**: Raça do animal
- **Sexo**: 🐂 Macho ou 🐄 Fêmea
- **Status**: ATIVO, VENDIDO, MORTO

### **Cores dos Status:**
- 🟢 **Verde**: Animal Ativo
- 🔵 **Azul**: Animal Vendido
- 🔴 **Vermelho**: Animal Morto

## 🔧 **Funcionalidades Especiais**

### **Auto-preenchimento por Série:**
- **RPT**: Automaticamente define como Fêmea/Receptora
- **CJCJ**: Abre modal para dados de nascimento
- **Outras séries**: Preenche raça automaticamente

### **Validações:**
- **RG único**: Não permite duplicatas
- **Campos obrigatórios**: Série, RG, Sexo, Raça
- **Formato correto**: Validações de entrada

### **Integração com BI:**
- Animais editados aparecem automaticamente no BI Analytics
- Dados sincronizados em tempo real
- Relatórios atualizados automaticamente

## 🎨 **Interface Visual**

### **Design Moderno:**
- Cards coloridos para status
- Ícones intuitivos para ações
- Tabela responsiva
- Tema escuro/claro

### **Feedback Visual:**
- Hover effects nos botões
- Loading states
- Mensagens de sucesso/erro
- Confirmações de ação

## 📱 **Responsividade**

- **Desktop**: Tabela completa com todas as colunas
- **Tablet**: Colunas adaptadas
- **Mobile**: Layout otimizado para toque

## 🔄 **Sincronização**

### **Dados em Tempo Real:**
- Alterações salvas imediatamente no banco
- Lista atualizada automaticamente
- Integração com outros componentes

### **Backup Automático:**
- Todas as alterações são persistidas
- Histórico de modificações
- Recuperação de dados

## 💡 **Dicas de Uso**

### **Para Melhor Organização:**
- Use nomes descritivos para os animais
- Mantenha os status atualizados
- Utilize as observações para informações extras

### **Para Performance:**
- A lista carrega automaticamente
- Use o botão de atualização se necessário
- Filtros futuros serão implementados

## 🚀 **Próximas Funcionalidades**

- [ ] Filtros por raça, sexo, status
- [ ] Busca por brinco/nome
- [ ] Exportação para Excel
- [ ] Histórico de alterações
- [ ] Upload de fotos dos animais
- [ ] Relatórios individuais por animal

---

**🎯 Agora você pode editar todos os seus animais diretamente na interface!**

Acesse: `MarketPriceManager → Aba "🐄 Animais"` e comece a gerenciar! 🐄✨