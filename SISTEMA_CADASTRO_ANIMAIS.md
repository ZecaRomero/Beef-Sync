# 🐄 Sistema de Cadastro de Animais - Beef Sync

## 🎯 Visão Geral

Sistema completo para cadastro de animais com múltiplas formas de entrada de dados:

- ✅ **Cadastro Manual**: Formulário individual para cada animal
- ✅ **Importação em Lote**: Cadastro múltiplo manual ou via Excel
- ✅ **Importação GTA**: Extração automática de dados de PDF de GTA

## 🚀 Funcionalidades Principais

### **1. Cadastro Manual Individual**
- Formulário completo com validações
- Campos: Série, RG, Sexo, Era (meses), Preço, Observações
- Auto-completar raça baseado na série
- Validação de dados obrigatórios

### **2. Importação em Lote**
- **Modo Manual**: Tabela para cadastro múltiplo
- **Modo Excel**: Importação de planilha XLSX/XLS
- Template disponível para download
- Validação em tempo real
- Resumo antes de salvar

### **3. Importação GTA (PDF)**
- Extração automática de texto do PDF
- Reconhecimento de padrões de animais (CJCJ, BENT, RPT, CJCG)
- Extração de dados da GTA (número, origem, destino, etc.)
- Preview dos dados antes da importação

## 📊 Campos de Animal

### **Campos Obrigatórios**
- **Série**: RPT, BENT, CJCJ, CJCG
- **RG**: Número de registro (até 6 dígitos)
- **Sexo**: Macho ou Fêmea

### **Campos Opcionais**
- **Era**: Idade em meses
- **Preço**: Valor do animal em R$
- **Observações**: Informações adicionais

### **Campos Auto-gerados**
- **Brinco**: Série + RG (ex: CJCJ 123456)
- **Nome**: Igual ao brinco por padrão
- **Raça**: Baseada na série
- **Status**: ATIVO por padrão
- **Data de Nascimento**: Calculada pela era (se informada)

## 🔧 Como Usar

### **Acesso ao Sistema**
1. Vá para **MarketPriceManager** → Aba **"🐄 Animais"**
2. Escolha uma das opções:
   - **"Novo"**: Cadastro individual
   - **"📊 Lote/Excel"**: Importação em lote
   - **"📄 GTA PDF"**: Importação de GTA

### **Cadastro Individual**
1. Clique em **"Novo"**
2. Preencha os campos obrigatórios
3. Adicione informações opcionais
4. Clique em **"Salvar"**

### **Importação em Lote - Manual**
1. Clique em **"📊 Lote/Excel"**
2. Selecione **"Cadastro Manual"**
3. Clique em **"Adicionar Animal"** para cada linha
4. Preencha os dados na tabela
5. Verifique o resumo
6. Clique em **"Salvar X Animais"**

### **Importação em Lote - Excel**
1. Clique em **"📊 Lote/Excel"**
2. Selecione **"Importar Excel"**
3. Baixe o template (opcional)
4. Prepare sua planilha com as colunas:
   - **Serie**: RPT, BENT, CJCJ, CJCG
   - **RG**: Número do registro
   - **Sexo**: Macho ou Fêmea
   - **Era**: Idade em meses (opcional)
   - **Preco**: Valor do animal (opcional)
   - **Observacoes**: Observações (opcional)
5. Clique em **"Selecionar Arquivo Excel"**
6. Verifique os dados importados
7. Clique em **"Salvar X Animais"**

### **Importação GTA (PDF)**
1. Clique em **"📄 GTA PDF"**
2. Clique em **"Selecionar Arquivo PDF"**
3. Aguarde o processamento
4. Verifique os dados da GTA extraídos
5. Confira a lista de animais encontrados
6. Clique em **"Importar X Animais"**

## 📋 Formato da Planilha Excel

### **Colunas Obrigatórias**
```
Serie | RG     | Sexo
CJCJ  | 000001 | Macho
BENT  | 000002 | Fêmea
```

### **Colunas Opcionais**
```
Era | Preco   | Observacoes
24  | 5000.00 | Animal de qualidade
18  | 4500.00 | Boa linhagem
```

### **Exemplo Completo**
```
Serie | RG     | Sexo  | Era | Preco   | Observacoes
CJCJ  | 000001 | Macho | 24  | 5000.00 | Animal de qualidade
BENT  | 000002 | Fêmea | 18  | 4500.00 | Boa linhagem
RPT   | 000003 | Fêmea | 30  | 2000.00 | Receptora
CJCG  | 000004 | Macho | 12  | 3000.00 | Bezerro promissor
```

## 🔍 Padrões de GTA Reconhecidos

### **Identificação de Animais**
- **CJCJ 123456** (Nelore)
- **BENT 789012** (Brahman)
- **RPT 345678** (Receptora)
- **CJCG 901234** (Gir)

### **Dados da GTA Extraídos**
- Número da GTA
- Propriedade de origem
- Propriedade de destino
- Data de emissão
- Finalidade do transporte
- Transportador responsável

### **Informações Adicionais**
- Sexo do animal (quando disponível)
- Idade em meses (quando disponível)
- Peso (quando disponível)

## 🗃️ Estrutura do Banco

### **Tabela: animals**
```sql
- id: ID único
- brinco: Série + RG (único)
- serie: RPT, BENT, CJCJ, CJCG
- nome: Nome do animal
- raca: Raça baseada na série
- sexo: MACHO ou FEMEA
- dataNasc: Data de nascimento
- era: Idade em meses
- status: ATIVO, VENDIDO, etc.
- valorVenda: Preço do animal
- observacoes: Observações
```

### **Tabela: gtas**
```sql
- id: ID único
- numero: Número da GTA
- origem: Propriedade de origem
- destino: Propriedade de destino
- dataEmissao: Data de emissão
- finalidade: Finalidade do transporte
- transportador: Responsável pelo transporte
```

## ⚡ Validações

### **Validações Automáticas**
- ✅ Série deve ser válida (RPT, BENT, CJCJ, CJCG)
- ✅ RG deve ter no máximo 6 dígitos
- ✅ Sexo deve ser Macho ou Fêmea
- ✅ Brinco deve ser único no sistema
- ✅ Era deve ser número positivo
- ✅ Preço deve ser número válido

### **Validações de Negócio**
- ✅ Não permite animais duplicados (mesmo brinco)
- ✅ Auto-completa raça baseada na série
- ✅ Calcula data de nascimento pela era
- ✅ Status padrão é ATIVO

## 🎨 Interface

### **Indicadores Visuais**
- 🟢 **Verde**: Dados válidos
- 🔴 **Vermelho**: Dados com erro
- 🟡 **Amarelo**: Dados incompletos
- 🔵 **Azul**: Processando

### **Resumo de Importação**
- **Total**: Quantidade de animais
- **Válidos**: Animais sem erro
- **Com Erro**: Animais com problemas
- **Valor Total**: Soma dos preços

## 🔧 APIs Disponíveis

### **POST /api/animals**
Criar novo animal

### **GET /api/animals**
Listar todos os animais

### **POST /api/gta**
Salvar dados de GTA

### **GET /api/gta**
Listar GTAs importadas

## 📈 Melhorias Futuras

- [ ] Importação de imagens dos animais
- [ ] Validação de CPF/CNPJ na GTA
- [ ] OCR avançado para GTAs manuscritas
- [ ] Integração com sistemas de rastreamento
- [ ] Backup automático de importações
- [ ] Histórico de alterações
- [ ] Relatórios de importação
- [ ] Validação de dados genealógicos

## 🎉 Benefícios

✅ **Eficiência**: Cadastro rápido de múltiplos animais
✅ **Flexibilidade**: Múltiplas formas de entrada de dados
✅ **Automação**: Extração automática de PDFs
✅ **Validação**: Verificação automática de dados
✅ **Rastreabilidade**: Histórico completo de importações
✅ **Integração**: Compatível com sistema de NF

---

**Data de Implementação**: 04/08/2025
**Versão**: 1.0
**Status**: ✅ Implementado e Funcional