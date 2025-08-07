// Script para adicionar feedbacks fictícios ao localStorage
const dummyFeedbacks = [
  {
    id: 1,
    text: 'Sistema muito intuitivo e fácil de usar. Gostaria de ver mais relatórios de vendas por região.',
    type: 'suggestion',
    priority: 'medium',
    user: 'Bento',
    date: new Date('2024-08-01T10:30:00Z').toISOString(),
    status: 'pending'
  },
  {
    id: 2,
    text: 'Excelente ferramenta para gestão de rebanho. Sugestão: adicionar gráficos de evolução de peso.',
    type: 'feature',
    priority: 'high',
    user: 'Nilson',
    date: new Date('2024-08-02T14:15:00Z').toISOString(),
    status: 'in_progress'
  },
  {
    id: 3,
    text: 'Interface muito limpa e profissional. Sistema atende perfeitamente às necessidades.',
    type: 'improvement',
    priority: 'low',
    user: 'Mauricio',
    date: new Date('2024-08-03T09:45:00Z').toISOString(),
    status: 'completed'
  },
  {
    id: 4,
    text: 'Relatórios BI são muito úteis para tomada de decisão. Parabéns pelo desenvolvimento!',
    type: 'suggestion',
    priority: 'medium',
    user: 'Jorge',
    date: new Date('2024-08-04T16:20:00Z').toISOString(),
    status: 'pending'
  },
  {
    id: 5,
    text: 'Gostaria de ver mais opções de exportação de dados para Excel.',
    type: 'feature',
    priority: 'high',
    user: 'Bento',
    date: new Date('2024-08-05T11:00:00Z').toISOString(),
    status: 'pending'
  }
];

// Salvar no localStorage
if (typeof window !== 'undefined') {
  localStorage.setItem('beef-sync-feedbacks', JSON.stringify(dummyFeedbacks));
  console.log('✅ Feedbacks fictícios adicionados ao localStorage');
  console.log('📝 Total de feedbacks:', dummyFeedbacks.length);
} else {
  console.log('⚠️ Este script deve ser executado no navegador');
  console.log('📝 Feedbacks prontos para adicionar:', dummyFeedbacks);
}
