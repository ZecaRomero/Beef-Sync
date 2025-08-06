# ✅ Sistema de Sêmen Integrado ao Banco de Dados

## 🎯 Status da Implementação

O sistema de estoque de sêmen está **COMPLETAMENTE INTEGRADO** ao banco de dados PostgreSQL/SQLite com Prisma ORM.

## 🗄️ Estrutura do Banco de Dados

### Tabelas Criadas:

#### 1. **semen_containers** (Botijões)
- `id`: ID único
- `botijaoNumero`: Número do botijão (único)
- `marca`, `modelo`: Informações do equipamento
- `capacidade`: Capacidade total em doses
- `temperatura`, `nivelNitrogeno`: Monitoramento
- `status`: ATIVO, MANUTENCAO, INATIVO
- `proximaManutencao`: Data da próxima manutenção

#### 2. **semen_canecas** (Canecas dentro dos botijões)
- `id`: ID único
- `numero`: Identificação da caneca (A1, B2, etc.)
- `capacidade`: Capacidade em doses
- `ocupacao`: Doses atualmente armazenadas
- `posicoes`: Posições específicas (1-10, 11-20)

#### 3. **semen_stock** (Estoque de sêmen)
- `id`: ID único
- `nomeTouro`, `rg`, `raca`: Dados do touro
- `fornecedor`, `notaFiscal`: Dados da compra
- `quantidadeTotal`, `quantidadeDisponivel`, `quantidadeUsada`: Controle de estoque
- `valorUnitario`: Preço por dose
- `dataEntrada`, `dataColeta`, `dataVencimento`: Controle de datas
- `posicao`: Posição específica na caneca
- `status`: DISPONIVEL, RESERVADO, USADO, VENCIDO

#### 4. **semen_movements** (Movimentações)
- `id`: ID único
- `tipo`: ENTRADA, SAIDA, TRANSFERENCIA
- `quantidade`: Quantidade movimentada
- `motivo`: Razão da movimentação
- `destinatario`: Para onde foi o sêmen
- `valorUnitario`: Valor da operação

## 🔧 APIs Implementadas

### 1. **GET /api/semen-stock**
- Retorna todo o estoque com dados dos containers e canecas
- Inclui informações do usuário responsável
- Ordenado por data de criação (mais recente primeiro)

### 2. **POST /api/semen-stock**
- Cria nova entrada de sêmen no estoque
- Cria automaticamente container e caneca se não existirem
- Atualiza ocupação da caneca
- Registra movimentação de entrada

### 3. **PUT /api/semen-stock**
- Atualiza dados do estoque existente
- Controle de versioning com `updatedAt`

### 4. **GET /api/semen-containers**
- Lista todos os botijões com suas canecas
- Calcula ocupação real baseada no estoque
- Inclui dados de manutenção e status

### 5. **POST /api/semen-containers**
- Cria novo botijão
- Validação de número único
- Configurações padrão inteligentes

### 6. **GET /api/semen-movements**
- Histórico completo de movimentações
- Inclui dados do estoque e containers relacionados
- Ordenado cronologicamente

### 7. **POST /api/semen-movements**
- Registra nova movimentação
- Para saídas: atualiza automaticamente o estoque
- Controla ocupação das canecas
- Valida quantidade disponível

## 🌱 Dados de Teste Populados

O script `scripts/seed-semen-data.js` criou:

### 📦 3 Botijões:
- **001**: CryoTech CT-500 (500 doses) - ATIVO
- **002**: FreezeMax FM-300 (300 doses) - ATIVO  
- **003**: CryoTech CT-200 (200 doses) - MANUTENÇÃO

### 🏺 5 Canecas:
- **001-A1**: 50 doses (posições 1-10)
- **001-B2**: 50 doses (posições 11-20)
- **001-C3**: 50 doses (posições 21-25)
- **002-A1**: 30 doses (posições 1-30)
- **002-B2**: 30 doses (posições 31-60)

### 🧬 3 Lotes de Sêmen:
- **Touro Alpha** (Nelore): 50 doses, 45 disponíveis - R$ 120/dose
- **Touro Beta** (Angus): 30 doses, 28 disponíveis - R$ 150/dose
- **Touro Gamma** (Brahman): 25 doses, 0 disponíveis (esgotado) - R$ 100/dose

### 📊 2 Movimentações:
- **Entrada**: Touro Alpha - 50 doses
- **Saída**: Inseminação - 3 doses do Touro Alpha

## 🚀 Como Testar

### 1. **Iniciar o Servidor**
```bash
npm run dev
```

### 2. **Acessar o Sistema**
- Abrir http://localhost:3000
- Ir para "Reprodução" → "🧬 Estoque de Sêmen"

### 3. **Testar Funcionalidades**

#### ✅ Visualizar Estoque:
- Dashboard com 6 cards de estatísticas
- Lista de lotes com informações completas
- Filtros por touro, botijão, status
- Busca textual

#### ✅ Nova Entrada:
- Clicar em "Nova Entrada"
- Preencher dados do touro e localização
- Sistema cria container/caneca automaticamente
- Registra movimentação de entrada

#### ✅ Registrar Saída:
- Clicar em "Usar" em um lote
- Selecionar motivo (inseminação, venda, etc.)
- Sistema atualiza estoque automaticamente
- Registra movimentação de saída

#### ✅ Transferir Localização:
- Clicar em "Mover" em um lote
- Definir nova localização
- Sistema registra transferência

### 4. **Verificar no Banco**
```bash
npx prisma studio
```
- Visualizar dados em tempo real
- Verificar relacionamentos
- Confirmar integridade dos dados

## 🔍 Validações Implementadas

### ✅ Entrada de Dados:
- Campos obrigatórios validados
- Tipos de dados corretos (números, datas)
- Valores positivos para quantidades
- Datas válidas

### ✅ Regras de Negócio:
- Não permite saída maior que estoque disponível
- Atualiza status automaticamente (USADO quando zerado)
- Controla ocupação das canecas
- Registra todas as movimentações

### ✅ Integridade Referencial:
- Relacionamentos entre tabelas
- Cascade delete onde apropriado
- Foreign keys validadas

## 📊 Funcionalidades Avançadas

### 🎯 Alertas Automáticos:
- Doses vencendo em 30 dias
- Doses já vencidas
- Estoque baixo por touro

### 📈 Estatísticas em Tempo Real:
- Total de doses disponíveis
- Número de touros diferentes
- Botijões ativos
- Valor total do estoque
- Alertas de vencimento

### 🔄 Sincronização Automática:
- Ocupação das canecas atualizada automaticamente
- Status do estoque baseado na quantidade
- Histórico completo de movimentações

## 🎉 Resultado Final

O sistema está **100% funcional** com:

- ✅ **Banco de dados integrado** com Prisma ORM
- ✅ **APIs RESTful completas** com validações
- ✅ **Interface moderna** e responsiva
- ✅ **Dados de teste** populados
- ✅ **Rastreabilidade total** por botijão/caneca
- ✅ **Controle de estoque** em tempo real
- ✅ **Histórico de movimentações** completo
- ✅ **Alertas de vencimento** automáticos

**O sistema está pronto para uso em produção!** 🚀

---

**Para testar**: Inicie o servidor (`npm run dev`) e acesse a aba "🧬 Estoque de Sêmen" no módulo de reprodução.