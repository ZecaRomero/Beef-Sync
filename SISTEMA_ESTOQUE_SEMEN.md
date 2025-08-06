# 🧬 Sistema Avançado de Estoque de Sêmen

## 🎯 Visão Geral

Sistema completo de gestão de estoque de sêmen bovino com rastreabilidade total por botijão e caneca, controle de entrada/saída, e monitoramento de vencimento.

## 🚀 Funcionalidades Implementadas

### 📦 Gestão de Estoque
- **Controle Total**: Rastreamento por botijão, caneca e posição
- **Status em Tempo Real**: Disponível, reservado, usado, vencido
- **Alertas de Vencimento**: Notificações para doses próximas ao vencimento
- **Filtros Avançados**: Busca por touro, RG, raça, fornecedor, botijão, status

### 📥 Entrada de Sêmen
- **Dados do Fornecedor**: Central de sêmen, nota fiscal, valor
- **Informações do Touro**: Nome, RG, raça, data de coleta
- **Localização Precisa**: Botijão, caneca, posição específica
- **Controle de Qualidade**: Data de vencimento, observações

### 📤 Saída e Movimentação
- **Tipos de Saída**:
  - Inseminação artificial
  - Venda para terceiros
  - Descarte por vencimento
  - Transferência entre locais
- **Rastreabilidade**: Registro completo de origem e destino
- **Histórico**: Log de todas as movimentações

### 🏺 Gestão de Botijões
- **Cadastro de Containers**: Marca, modelo, capacidade
- **Monitoramento**: Temperatura, nível de nitrogênio
- **Manutenção**: Controle de datas e status
- **Organização**: Canecas e posições dentro de cada botijão

## 📊 Dashboard e Relatórios

### 📈 Indicadores Principais
- **Doses Disponíveis**: Total em estoque
- **Touros Diferentes**: Variedade genética
- **Botijões Ativos**: Containers em uso
- **Valor Total**: Investimento em estoque
- **Alertas**: Doses vencendo e vencidas

### 🔍 Filtros e Busca
- **Busca Textual**: Por nome do touro, RG, raça, fornecedor
- **Filtro por Container**: Visualizar por botijão específico
- **Filtro por Status**: Disponível, reservado, usado, vencido
- **Limpeza Rápida**: Reset de todos os filtros

## 🎨 Interface do Usuário

### 📱 Design Responsivo
- **Cards Informativos**: Visualização clara de cada lote
- **Cores Intuitivas**: Status visual por cores
- **Ícones Descritivos**: Identificação rápida de ações
- **Modo Dark**: Suporte completo ao tema escuro

### ⚡ Experiência do Usuário
- **Formulários Inteligentes**: Validação em tempo real
- **Ações Rápidas**: Botões de uso e transferência
- **Feedback Visual**: Estados de loading e confirmações
- **Navegação por Abas**: Organização clara das funcionalidades

## 🔧 Arquitetura Técnica

### 📁 Estrutura de Arquivos
```
components/reproduction/
├── SemenStockManager.js     # Componente principal
├── SemenManager.js          # Sistema anterior (mantido)

pages/api/
├── semen-stock.js          # API do estoque
├── semen-containers.js     # API dos botijões
├── semen-movements.js      # API das movimentações
```

### 🗄️ Estrutura de Dados

#### Estoque de Sêmen
```javascript
{
  id: number,
  nomeTouro: string,
  rg: string,
  raca: string,
  fornecedor: string,
  notaFiscal: string,
  quantidadeTotal: number,
  quantidadeDisponivel: number,
  quantidadeUsada: number,
  valorUnitario: number,
  dataEntrada: date,
  dataColeta: date,
  dataVencimento: date,
  botijaoNumero: string,
  canecaNumero: string,
  posicao: string,
  status: enum,
  responsavel: string,
  observacoes: text
}
```

#### Containers (Botijões)
```javascript
{
  id: number,
  botijaoNumero: string,
  marca: string,
  modelo: string,
  capacidade: number,
  dataAquisicao: date,
  status: enum,
  temperatura: number,
  nivelNitrogeno: number,
  proximaManutencao: date,
  canecas: [
    {
      numero: string,
      capacidade: number,
      ocupacao: number,
      posicoes: string
    }
  ]
}
```

#### Movimentações
```javascript
{
  id: number,
  tipo: enum, // entrada, saida, transferencia
  data: date,
  responsavel: string,
  nomeTouro: string,
  rg: string,
  quantidade: number,
  botijaoOrigem: string,
  canecaOrigem: string,
  botijaoDestino: string,
  canecaDestino: string,
  posicaoDestino: string,
  motivo: string,
  destinatario: string,
  valorUnitario: number,
  observacoes: text
}
```

## 🎯 Benefícios do Sistema

### 🏢 Para o Negócio
- **Controle Total**: Rastreabilidade completa do estoque
- **Redução de Perdas**: Alertas de vencimento
- **Otimização**: Melhor organização do espaço
- **Relatórios**: Dados para tomada de decisão
- **Compliance**: Registro para auditorias

### 👨‍🔬 Para o Técnico
- **Localização Rápida**: Encontrar doses específicas
- **Histórico Completo**: Rastreamento de uso
- **Planejamento**: Controle de estoque mínimo
- **Qualidade**: Monitoramento de vencimento

### 💰 Para o Financeiro
- **Controle de Custos**: Valor por dose e total
- **ROI**: Retorno sobre investimento
- **Perdas**: Controle de descartes
- **Compras**: Planejamento de aquisições

## 🔮 Próximas Funcionalidades

### 📊 Relatórios Avançados
- **Relatório de Uso**: Eficiência por touro
- **Análise de Custos**: Custo por inseminação
- **Previsão de Estoque**: Quando comprar mais
- **Performance**: Taxa de prenhez por lote

### 🔔 Notificações
- **Alertas por Email**: Vencimentos próximos
- **WhatsApp**: Notificações importantes
- **Dashboard**: Alertas em tempo real

### 📱 Integração
- **Código de Barras**: Leitura rápida de doses
- **QR Code**: Identificação de botijões
- **Mobile**: App para uso no campo
- **ERP**: Integração com sistemas existentes

### 🤖 Automação
- **Reposição Automática**: Pedidos quando estoque baixo
- **Rotação**: FIFO automático por vencimento
- **Relatórios**: Geração automática mensal
- **Backup**: Sincronização em nuvem

## 📋 Como Usar

### 1️⃣ Registrar Entrada
1. Clique em "Nova Entrada"
2. Preencha dados do fornecedor e nota fiscal
3. Informe dados do touro (nome, RG, raça)
4. Defina localização (botijão, caneca, posição)
5. Confirme a entrada

### 2️⃣ Registrar Saída
1. Clique em "Registrar Saída" ou "Usar" no card
2. Selecione o motivo (inseminação, venda, etc.)
3. Informe quantidade e destinatário
4. Confirme a operação

### 3️⃣ Transferir Localização
1. Clique em "Mover" no card da dose
2. Defina nova localização
3. Informe motivo da transferência
4. Confirme a movimentação

### 4️⃣ Monitorar Estoque
1. Use filtros para encontrar doses específicas
2. Monitore alertas de vencimento
3. Acompanhe estatísticas no dashboard
4. Consulte histórico de movimentações

## ✅ Status de Implementação

### ✅ Concluído
- [x] Interface principal do sistema
- [x] Formulários de entrada, saída e transferência
- [x] Dashboard com estatísticas
- [x] Filtros e busca avançada
- [x] APIs básicas com dados de exemplo
- [x] Integração com ReproductionManager
- [x] Suporte ao modo dark
- [x] Design responsivo

### 🔄 Em Desenvolvimento
- [ ] Implementação das tabelas no banco de dados
- [ ] Funcionalidades CRUD completas
- [ ] Sistema de alertas por email
- [ ] Relatórios em PDF/Excel
- [ ] Integração com sistema de inseminação

### 🎯 Planejado
- [ ] App mobile
- [ ] Código de barras/QR Code
- [ ] Integração com ERP
- [ ] Análise preditiva
- [ ] Automação de processos

---

**Sistema desenvolvido para otimizar a gestão de sêmen bovino com máxima rastreabilidade e controle** 🐄🧬