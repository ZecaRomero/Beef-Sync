# 📖 Guia Completo do Sistema de Estoque de Sêmen

## 🎯 Visão Geral

O Sistema de Estoque de Sêmen é uma solução completa para gestão de sêmen bovino com rastreabilidade total, controle de vencimento e relatórios avançados.

## 🚀 Como Acessar

1. **Iniciar o Sistema**

   ```bash
   npm run dev
   ```

2. **Navegar para o Módulo**
   - Abrir http://localhost:3000
   - Clicar em "Reprodução" no menu
   - Selecionar a aba "🧬 Estoque de Sêmen"

## � Dasshboard Principal

### 📈 Cards de Estatísticas

O dashboard exibe 6 cards com informações em tempo real:

- **🔵 Doses Disponíveis**: Total de doses em estoque
- **� Tou ros Diferentes**: Variedade genética disponível
- **🟣 Botijões Ativos**: Containers em funcionamento
- **🟠 Valor Total**: Investimento total em estoque
- **🟡 Vencendo (30d)**: Doses que vencem em 30 dias
- **🔴 Vencidas**: Doses já vencidas

### 🔍 Sistema de Filtros

- **Busca Textual**: Digite nome do touro, RG, raça ou fornecedor
- **Filtro por Botijão**: Selecione um botijão específico
- **Filtro por Status**: Disponível, reservado, usado, vencido
- **Limpar Filtros**: Reset todos os filtros aplicados

## 📥 Registrar Nova Entrada

### 1️⃣ Clique em "Nova Entrada"

Botão verde no canto superior direito

### 2️⃣ Preencha os Dados Gerais

- **Data**: Data da operação (padrão: hoje)
- **Responsável**: Nome de quem está registrando
- **Tipo**: Entrada (já selecionado)

### 3️⃣ Dados da Compra

- **Fornecedor**: Central de sêmen ou fornecedor
- **Nota Fiscal**: Número da NF (opcional)
- **Valor por Dose**: Preço unitário em R$

### 4️⃣ Dados do Touro

- **Nome do Touro**: Identificação do reprodutor
- **RG**: Registro genealógico
- **Raça**: Raça do animal
- **Quantidade de Doses**: Número de doses adquiridas
- **Data da Coleta**: Quando o sêmen foi coletado
- **Data de Vencimento**: Validade do sêmen

### 5️⃣ Localização no Estoque

- **Número do Botijão**: Container onde será armazenado
- **Número da Caneca**: Caneca dentro do botijão
- **Posição na Caneca**: Posição específica (ex: 1-10)

### 6️⃣ Observações

Campo livre para anotações adicionais

### 7️⃣ Confirmar

Clique em "Registrar Entrada"

**💡 Dica**: Se o botijão ou caneca não existirem, serão criados automaticamente!

## 📤 Registrar Saída

### 1️⃣ Duas Formas de Acessar

- **Botão "Registrar Saída"** no header
- **Botão "Usar"** em cada card de lote

### 2️⃣ Dados da Saída

- **Motivo da Saída**:
  - Inseminação
  - Venda
  - Descarte
  - Transferência
  - Vencimento
  - Outros
- **Destinatário/Animal**: Para onde vai o sêmen
- **Quantidade**: Número de doses utilizadas

### 3️⃣ Confirmação

O sistema:

- ✅ Valida se há estoque suficiente
- ✅ Atualiza automaticamente as quantidades
- ✅ Registra a movimentação
- ✅ Atualiza ocupação da caneca

## 🔄 Transferir Localização

### 1️⃣ Clique em "Mover" no Card

Botão azul em cada lote de sêmen

### 2️⃣ Nova Localização

- **Botijão Destino**: Novo container
- **Caneca Destino**: Nova caneca
- **Posição Destino**: Nova posição

### 3️⃣ Dados da Transferência

- **Quantidade**: Doses a transferir
- **Motivo**: Razão da movimentação

## 📋 Abas do Sistema

### 🏠 Estoque Atual

- **Visualização**: Cards com todos os lotes
- **Informações**: Touro, localização, doses, vencimento
- **Ações**: Usar, mover, visualizar detalhes
- **Alertas**: Ícones para doses vencendo/vencidas

### 🏺 Botijões

- **Lista**: Todos os containers cadastrados
- **Detalhes**: Marca, modelo, capacidade, temperatura
- **Canecas**: Ocupação de cada caneca
- **Status**: Ativo, manutenção, inativo

### 📊 Movimentações

- **Histórico**: Todas as operações realizadas
- **Tipos**: Entrada, saída, transferência
- **Detalhes**: Data, responsável, quantidade, motivo
- **Ordenação**: Mais recentes primeiro

## 📈 Sistema de Relatórios

### 1️⃣ Acessar Relatórios

Clique no botão "Relatórios" (roxo) no header

### 2️⃣ Tipos de Relatórios

#### 📊 Relatório de Estoque

- **Resumo**: Total de doses, touros, valor
- **Detalhes**: Lista completa com localização
- **Alertas**: Doses vencendo

#### 📈 Movimentações

- **Período**: Selecione data inicial e final
- **Totais**: Entradas, saídas, transferências
- **Detalhes**: Histórico completo do período

#### ⏰ Controle de Vencimentos

- **Alertas**: Vencendo em 30, 7 dias e vencidas
- **Lista**: Ordenada por proximidade do vencimento
- **Status**: Visual por cores

#### 💰 Relatório Financeiro

- **Valor em Estoque**: Investimento atual
- **Compras**: Gastos no período
- **Vendas**: Receitas no período
- **Valor Médio**: Preço médio por dose

### 3️⃣ Exportação

- **PDF**: Para impressão e arquivamento
- **Excel**: Para análises adicionais

## 🎨 Interface e Navegação

### 🌙 Modo Dark

- **Alternância**: Botão no header principal
- **Persistência**: Mantém preferência entre sessões
- **Compatibilidade**: Todos os componentes suportam

### 📱 Responsividade

- **Desktop**: Layout completo com 3 colunas
- **Tablet**: 2 colunas adaptativas
- **Mobile**: 1 coluna com scroll vertical

### 🎯 Indicadores Visuais

- **Cores por Status**:

  - 🟢 Verde: Disponível
  - 🟡 Amarelo: Reservado
  - ⚫ Cinza: Usado
  - 🔴 Vermelho: Vencido

- **Alertas de Vencimento**:
  - ⚠️ Amarelo: Vencendo em 30 dias
  - ⚠️ Vermelho: Já vencido

## 🔧 Funcionalidades Avançadas

### 🤖 Automações

- **Criação Automática**: Botijões e canecas criados conforme necessário
- **Atualização de Status**: Status muda automaticamente quando estoque zera
- **Ocupação de Canecas**: Calculada automaticamente
- **Validações**: Impede saídas maiores que estoque

### 📊 Cálculos Inteligentes

- **Valor Total**: Doses × Valor unitário
- **Dias para Vencimento**: Calculado automaticamente
- **Ocupação**: Percentual de uso das canecas
- **Estatísticas**: Atualizadas em tempo real

### 🔍 Busca Avançada

- **Múltiplos Campos**: Busca em nome, RG, raça, fornecedor
- **Filtros Combinados**: Busca + filtros simultâneos
- **Resultados Instantâneos**: Sem necessidade de botão buscar

## ⚠️ Alertas e Validações

### 🚨 Alertas Automáticos

- **Estoque Baixo**: Quando doses acabando
- **Vencimento Próximo**: 30 dias antes
- **Já Vencido**: Destaque visual vermelho
- **Operação Inválida**: Quantidade insuficiente

### ✅ Validações

- **Campos Obrigatórios**: Marcados com \*
- **Tipos de Dados**: Números, datas, textos
- **Limites**: Quantidades positivas
- **Duplicatas**: Evita registros duplicados

## 🎯 Dicas de Uso

### 💡 Boas Práticas

1. **Registre Imediatamente**: Entrada assim que receber
2. **Use Códigos Padrão**: Botijões numerados sequencialmente
3. **Canecas Organizadas**: Use padrão A1, B2, C3...
4. **Posições Claras**: Ex: 1-10, 11-20, 21-30
5. **Observações Úteis**: Anote informações relevantes

### 🔄 Fluxo Recomendado

1. **Recebimento**: Registrar entrada com todos os dados
2. **Armazenamento**: Definir localização precisa
3. **Uso**: Registrar saídas imediatamente
4. **Controle**: Verificar vencimentos semanalmente
5. **Relatórios**: Gerar mensalmente para análise

### 📈 Monitoramento

- **Diário**: Verificar alertas de vencimento
- **Semanal**: Revisar movimentações
- **Mensal**: Gerar relatórios completos
- **Trimestral**: Análise financeira detalhada

## 🆘 Solução de Problemas

### ❌ Problemas Comuns

#### "Erro ao carregar dados"

- **Causa**: Servidor não iniciado
- **Solução**: Execute `npm run dev`

#### "Quantidade insuficiente"

- **Causa**: Tentativa de saída maior que estoque
- **Solução**: Verifique quantidade disponível

#### "Campos obrigatórios"

- **Causa**: Dados essenciais não preenchidos
- **Solução**: Preencha campos marcados com \*

#### "Botijão não encontrado"

- **Causa**: Número de botijão inválido
- **Solução**: Verifique numeração ou deixe criar automaticamente

### 🔧 Manutenção

- **Backup**: Dados salvos automaticamente no banco
- **Performance**: Sistema otimizado para milhares de registros
- **Atualizações**: Interface atualiza automaticamente

## 📞 Suporte

### 🆘 Em Caso de Dúvidas

1. **Consulte este guia** primeiro
2. **Verifique os alertas** na interface
3. **Teste em ambiente controlado**
4. **Documente o problema** se persistir

### 📚 Recursos Adicionais

- **Documentação Técnica**: `SISTEMA_ESTOQUE_SEMEN.md`
- **Melhorias Futuras**: `IDEIAS_MELHORIAS_SEMEN.md`
- **Integração BD**: `INTEGRACAO_BANCO_SEMEN.md`

---

**🎉 Parabéns! Você agora domina o Sistema de Estoque de Sêmen!**

_Sistema desenvolvido para máxima eficiência na gestão reprodutiva bovina_ 🐄🧬
