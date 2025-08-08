# 🔔 Sistema de Notificações - Beef Sync

## 📋 Visão Geral

O sistema de notificações do Beef Sync foi desenvolvido para automatizar o follow-up pós-venda de GTAs (Guias de Trânsito Animal) e outros alertas importantes do sistema.

## 🎯 Funcionalidades Principais

### ✅ Notificações Automáticas de Follow-up

**📞 Confirmação de Chegada (20 dias)**
- Notificação automática para confirmar se os animais chegaram bem
- Prioridade: ALTA
- Ação: Ligar para o cliente

**🤝 Verificação de Satisfação (2 meses)**
- Follow-up para verificar satisfação com os animais
- Prioridade: MÉDIA
- Ação: Ligar para o cliente

**🎯 Oferta de Novos Animais (8 meses)**
- Oportunidade para oferecer novos animais
- Prioridade: MÉDIA
- Ação: Ligar para o cliente

**⏰ Lembrete 5 Dias Antes**
- Lembrete antecipado para preparar o follow-up
- Prioridade: ALTA
- Ação: Preparar contato

### 🆕 Novos Tipos de Notificações

**🐄 Nascimentos**
- Notificação automática quando um animal nasce
- Prioridade: MÉDIA
- Dados: Série, brinco, sexo, data, mãe, pai

**💰 Vendas**
- Notificação quando uma venda é realizada
- Prioridade: MÉDIA
- Dados: Animal, valor, comprador, forma de pagamento

**🤰 Gestações**
- Notificação quando uma gestação é confirmada
- Prioridade: MÉDIA
- Dados: Animal, data prevista, touro

**🐣 Partos**
- Notificação quando um parto é realizado
- Prioridade: ALTA
- Dados: Animal, data, quantidade de filhotes

**💉 Vacinações**
- Notificação quando uma vacinação é realizada
- Prioridade: MÉDIA
- Dados: Animal, vacina, data, próxima vacinação

**⚖️ Pesagens**
- Notificação quando uma pesagem é realizada
- Prioridade: BAIXA
- Dados: Animal, peso, ganho de peso

**🔔 Alertas do Sistema**
- Notificações do sistema (backup, atualizações, etc.)
- Prioridade: BAIXA
- Dados: Evento, timestamp

### 🔄 Status das Notificações

- **PENDENTE**: Notificação não lida/processada
- **LIDA**: Notificação visualizada pelo usuário
- **RESOLVIDA**: Ação foi executada com sucesso
- **CANCELADA**: Notificação cancelada/desnecessária

### 🎨 Prioridades

- **ALTA**: Ações urgentes (vermelho)
- **MÉDIA**: Ações importantes (amarelo)
- **BAIXA**: Informações gerais (azul)

## 🏗️ Arquitetura do Sistema

### 📊 Modelo de Dados

```prisma
model Notification {
  id            String   @id @default(cuid())
  tipo          String   // GTA_FOLLOWUP, NASCIMENTO, VENDA, GESTACAO, PARTO, VACINACAO, PESAGEM, SYSTEM_ALERT
  titulo        String
  mensagem      String
  prioridade    String   @default("MEDIA") // ALTA, MEDIA, BAIXA
  status        String   @default("PENDENTE") // PENDENTE, LIDA, RESOLVIDA, CANCELADA
  dataCriacao   DateTime @default(now())
  dataLida      DateTime?
  dataResolvida DateTime?
  dataAgendada  DateTime? // Para notificações agendadas
  dados         String?   // JSON com dados adicionais
  userId        String
  gtaId         String?   // Relacionamento com GTA (opcional)

  // Relations
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  gta           GTA?     @relation(fields: [gtaId], references: [id], onDelete: SetNull)
}
```

### 🔌 APIs

#### `GET /api/notifications`
Buscar notificações com filtros:
- `status`: PENDENTE, LIDA, RESOLVIDA
- `tipo`: GTA_FOLLOWUP, NASCIMENTO, VENDA, etc.
- `prioridade`: ALTA, MEDIA, BAIXA
- `limit`: Número máximo de resultados

#### `POST /api/notifications`
Criar nova notificação:
```json
{
  "tipo": "GTA_FOLLOWUP",
  "titulo": "📞 Confirmação de Chegada - GTA",
  "mensagem": "Ligar para João Silva...",
  "prioridade": "ALTA",
  "dataAgendada": "2024-01-15T10:00:00Z",
  "gtaId": "gta-123",
  "dados": "{\"gtaNumero\": \"1234567\", \"compradorNome\": \"João Silva\"}"
}
```

#### `PATCH /api/notifications/[id]`
Atualizar status da notificação:
```json
{
  "status": "LIDA",
  "observacoes": "Cliente confirmou chegada dos animais"
}
```

#### `DELETE /api/notifications/[id]`
Excluir notificação

## 🎨 Componentes Frontend

### `GTANotificationCenter`
Componente principal para gerenciar notificações:
- Lista todas as notificações
- Filtros por status e tipo
- Ações: marcar como lida, resolver, excluir
- Integração com WhatsApp e telefone
- **Responsivo para mobile**

### `NotificationWidget`
Widget para exibir no dashboard:
- Contador de notificações pendentes
- Badge de alta prioridade
- Modal para visualizar notificações
- **Responsivo para mobile**

## 🚀 Como Usar

### 1. Integração no DirectInvoiceManager

O sistema já está integrado no `DirectInvoiceManager`. Quando uma GTA é cadastrada, as notificações são criadas automaticamente:

```javascript
// Exemplo de uso
const gtaData = {
  id: 'gta-123',
  numero: '1234567',
  dataEmissao: new Date().toISOString(),
  compradorNome: 'João Silva',
  compradorTelefone: '11999999999',
  animais: ['Boi 123', 'Vaca 456']
}

// Criar notificações automáticas
const notifications = await notificationService.createGTAAutomaticNotifications(gtaData)
```

### 2. Adicionar ao Dashboard

```javascript
import NotificationWidget from '../components/NotificationWidget'

// No seu componente de dashboard
<NotificationWidget userId={currentUser.id} />
```

### 3. Gerenciar Notificações

```javascript
import GTANotificationCenter from '../components/GTANotificationCenter'

// Componente completo de notificações
<GTANotificationCenter userId={currentUser.id} />
```

## 🔧 Configuração

### 1. Migração do Banco

```bash
npx prisma migrate dev --name add_notifications
```

### 2. Teste do Sistema

```bash
node scripts/test-notifications.js
```

### 3. Verificar Funcionamento

1. Acesse o sistema
2. Cadastre uma GTA no `DirectInvoiceManager`
3. Verifique se as notificações foram criadas
4. Teste as ações: marcar como lida, resolver, etc.

## 📱 Responsividade Mobile

### ✅ Melhorias Implementadas

1. **Cards Responsivos**
   - Padding adaptativo: `p-3 sm:p-4 md:p-6`
   - Texto adaptativo: `text-sm sm:text-base`
   - Grid responsivo: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`

2. **Interface Mobile-First**
   - Botões menores em mobile
   - Espaçamento otimizado
   - Modal full-screen em mobile

3. **Navegação Touch-Friendly**
   - Botões com tamanho adequado para touch
   - Espaçamento entre elementos
   - Scroll suave

4. **Dark Mode por Padrão**
   - Sistema inicia no modo escuro
   - Tema salvo no localStorage
   - Transições suaves

## 📊 Monitoramento

### Contadores Importantes

- **Notificações Pendentes**: Ações que precisam ser executadas
- **Alta Prioridade**: Urgências que requerem atenção imediata
- **Follow-ups Atrasados**: Notificações que passaram da data agendada

### Relatórios

O sistema gera automaticamente:
- Notificações criadas por período
- Taxa de resolução
- Tempo médio de resposta
- Follow-ups mais efetivos

## 🎯 Benefícios

### ✅ Para o Negócio

- **Follow-up Automatizado**: Nunca mais perca contatos importantes
- **Melhor Relacionamento**: Clientes se sentem mais valorizados
- **Oportunidades de Venda**: Novos negócios através do follow-up
- **Redução de Perdas**: Menos problemas pós-venda

### ✅ Para os Usuários

- **Interface Intuitiva**: Fácil de usar e navegar
- **Notificações em Tempo Real**: Alertas instantâneos
- **Ações Rápidas**: Integração com WhatsApp e telefone
- **Histórico Completo**: Todas as interações registradas
- **Mobile-First**: Funciona perfeitamente no celular

## 🔮 Próximas Melhorias

### 📅 Funcionalidades Planejadas

1. **Notificações por Email**: Envio automático de emails
2. **Lembretes Push**: Notificações no navegador
3. **Integração SMS**: Envio de SMS automático
4. **Relatórios Avançados**: Métricas de performance
5. **Personalização**: Configuração de horários e frequências

### 🤖 Automações Futuras

1. **IA para Priorização**: Machine learning para definir prioridades
2. **Análise de Sentimento**: Detectar satisfação do cliente
3. **Agendamento Inteligente**: Melhor horário para contato
4. **Integração CRM**: Sincronização com sistemas externos

## 🆘 Suporte

### Problemas Comuns

1. **Notificações não aparecem**: Verificar se o usuário está logado
2. **Erro ao criar notificação**: Verificar dados obrigatórios
3. **Notificações duplicadas**: Verificar se já existe notificação similar

### Contato

Para dúvidas ou problemas:
- Email: suporte@beef-sync.com
- WhatsApp: (11) 99999-9999
- Documentação: [Link para docs]

---

**🎉 Sistema de Notificações Beef Sync - Transformando Follow-ups em Oportunidades!**
