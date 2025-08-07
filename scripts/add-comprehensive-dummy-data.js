const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Adicionando dados fictícios abrangentes para apresentação...');

  // Buscar ou criar usuário
  let user = await prisma.user.findFirst({
    where: { email: 'zeca@beef-sync.com' }
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'zeca@beef-sync.com',
        name: 'Zeca',
        role: 'DEVELOPER',
        permissions: ['all']
      }
    });
    console.log('✅ Usuário criado:', user.name);
  }

  // 1. ADICIONAR MAIS ANIMAIS (25 animais totais)
  console.log('\n📊 Adicionando animais fictícios...');
  
  const animalsData = [
    // Animais Ativos (15)
    { brinco: 'BENT 20006', nome: 'Touro BENT Premium Plus', raca: 'Nelore', categoria: 'REPRODUTOR', peso: 850, status: 'ATIVO', valorVenda: 48000 },
    { brinco: 'CJCG 25005', nome: 'Novilha CJCG Elite Gold', raca: 'Angus', categoria: 'NOVILHA', peso: 420, status: 'ATIVO', valorVenda: 35000 },
    { brinco: 'CJCJ 15005', nome: 'Bezerro CJCJ Promissor Plus', raca: 'Brahman', categoria: 'BEZERRO', peso: 280, status: 'ATIVO', valorVenda: 22000 },
    { brinco: 'BENT 20007', nome: 'Touro BENT Elite Master', raca: 'Nelore', categoria: 'REPRODUTOR', peso: 920, status: 'ATIVO', valorVenda: 52000 },
    { brinco: 'CJCG 25006', nome: 'Novilha CJCG Premium Gold', raca: 'Angus', categoria: 'NOVILHA', peso: 450, status: 'ATIVO', valorVenda: 38000 },
    { brinco: 'CJCJ 15006', nome: 'Bezerro CJCJ Elite Future', raca: 'Brahman', categoria: 'BEZERRO', peso: 320, status: 'ATIVO', valorVenda: 25000 },
    { brinco: 'BENT 20008', nome: 'Touro BENT Master Gold', raca: 'Nelore', categoria: 'REPRODUTOR', peso: 880, status: 'ATIVO', valorVenda: 49000 },
    { brinco: 'CJCG 25007', nome: 'Novilha CJCG Supreme', raca: 'Angus', categoria: 'NOVILHA', peso: 480, status: 'ATIVO', valorVenda: 40000 },
    { brinco: 'CJCJ 15007', nome: 'Bezerro CJCJ Supreme Future', raca: 'Brahman', categoria: 'BEZERRO', peso: 350, status: 'ATIVO', valorVenda: 28000 },
    { brinco: 'BENT 20009', nome: 'Touro BENT Supreme Master', raca: 'Nelore', categoria: 'REPRODUTOR', peso: 950, status: 'ATIVO', valorVenda: 55000 },
    { brinco: 'CJCG 25008', nome: 'Novilha CJCG Master Gold', raca: 'Angus', categoria: 'NOVILHA', peso: 520, status: 'ATIVO', valorVenda: 42000 },
    { brinco: 'CJCJ 15008', nome: 'Bezerro CJCJ Master Future', raca: 'Brahman', categoria: 'BEZERRO', peso: 380, status: 'ATIVO', valorVenda: 30000 },
    { brinco: 'BENT 20010', nome: 'Touro BENT Gold Master', raca: 'Nelore', categoria: 'REPRODUTOR', peso: 980, status: 'ATIVO', valorVenda: 58000 },
    { brinco: 'CJCG 25009', nome: 'Novilha CJCG Gold Supreme', raca: 'Angus', categoria: 'NOVILHA', peso: 550, status: 'ATIVO', valorVenda: 45000 },
    { brinco: 'CJCJ 15009', nome: 'Bezerro CJCJ Gold Future', raca: 'Brahman', categoria: 'BEZERRO', peso: 420, status: 'ATIVO', valorVenda: 32000 },
    
    // Animais Vendidos (10)
    { brinco: 'BENT 20011', nome: 'Touro BENT Vendido 1', raca: 'Nelore', categoria: 'REPRODUTOR', peso: 900, status: 'VENDIDO', valorVenda: 50000, tipoVenda: 'LEILAO' },
    { brinco: 'CJCG 25010', nome: 'Novilha CJCG Vendida 1', raca: 'Angus', categoria: 'NOVILHA', peso: 480, status: 'VENDIDO', valorVenda: 38000, tipoVenda: 'VENDA_DIRETA' },
    { brinco: 'CJCJ 15010', nome: 'Bezerro CJCJ Vendido 1', raca: 'Brahman', categoria: 'BEZERRO', peso: 350, status: 'VENDIDO', valorVenda: 28000, tipoVenda: 'LEILAO' },
    { brinco: 'BENT 20012', nome: 'Touro BENT Vendido 2', raca: 'Nelore', categoria: 'REPRODUTOR', peso: 920, status: 'VENDIDO', valorVenda: 52000, tipoVenda: 'VENDA_ABATE' },
    { brinco: 'CJCG 25011', nome: 'Novilha CJCG Vendida 2', raca: 'Angus', categoria: 'NOVILHA', peso: 500, status: 'VENDIDO', valorVenda: 40000, tipoVenda: 'VENDA_DIRETA' },
    { brinco: 'CJCJ 15011', nome: 'Bezerro CJCJ Vendido 2', raca: 'Brahman', categoria: 'BEZERRO', peso: 380, status: 'VENDIDO', valorVenda: 30000, tipoVenda: 'VENDA_DESCARTE' },
    { brinco: 'BENT 20013', nome: 'Touro BENT Vendido 3', raca: 'Nelore', categoria: 'REPRODUTOR', peso: 950, status: 'VENDIDO', valorVenda: 55000, tipoVenda: 'LEILAO' },
    { brinco: 'CJCG 25012', nome: 'Novilha CJCG Vendida 3', raca: 'Angus', categoria: 'NOVILHA', peso: 520, status: 'VENDIDO', valorVenda: 42000, tipoVenda: 'VENDA_DIRETA' },
    { brinco: 'CJCJ 15012', nome: 'Bezerro CJCJ Vendido 3', raca: 'Brahman', categoria: 'BEZERRO', peso: 400, status: 'VENDIDO', valorVenda: 32000, tipoVenda: 'VENDA_ABATE' },
    { brinco: 'BENT 20014', nome: 'Touro BENT Vendido 4', raca: 'Nelore', categoria: 'REPRODUTOR', peso: 980, status: 'VENDIDO', valorVenda: 58000, tipoVenda: 'LEILAO' },
    { brinco: 'CJCG 25013', nome: 'Novilha CJCG Vendida 4', raca: 'Angus', categoria: 'NOVILHA', peso: 550, status: 'VENDIDO', valorVenda: 45000, tipoVenda: 'VENDA_DIRETA' }
  ];

  let animalsCreated = 0;
  for (const animalData of animalsData) {
    try {
      await prisma.animal.create({
        data: {
          ...animalData,
          userId: user.id,
          sexo: animalData.categoria === 'REPRODUTOR' ? 'MACHO' : 'FEMEA',
          dataNasc: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 365 * 2), // 0-2 anos
          pai: animalData.categoria === 'REPRODUTOR' ? 'Touro Elite' : 'Touro Premium',
          mae: animalData.categoria === 'NOVILHA' ? 'Vaca Elite' : 'Vaca Premium',
          avoMaterno: 'Touro Master',
          receptora: animalData.categoria === 'BEZERRO' ? 'Vaca Receptora Elite' : null,
          observacoes: `Animal de alta qualidade - ${animalData.categoria}`,
          createdAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 365) // Último ano
        }
      });
      animalsCreated++;
    } catch (error) {
      if (error.code !== 'P2002') {
        console.error(`❌ Erro ao criar animal ${animalData.brinco}:`, error.message);
      }
    }
  }

  console.log(`✅ ${animalsCreated} animais criados`);

  // 2. ADICIONAR CUSTOS DETALHADOS
  console.log('\n💰 Adicionando custos detalhados...');
  
  const costTypes = [
    { tipo: 'ALIMENTACAO', descricao: 'Ração Premium', valor: 2000, observacoes: 'Ração de alta qualidade para engorda' },
    { tipo: 'ALIMENTACAO', descricao: 'Sal Mineral', valor: 400, observacoes: 'Suplemento mineral premium' },
    { tipo: 'ALIMENTACAO', descricao: 'Silagem', valor: 800, observacoes: 'Silagem de milho de qualidade' },
    { tipo: 'SAUDE', descricao: 'Vacinação Completa', valor: 1200, observacoes: 'Vacinação contra aftosa e brucelose' },
    { tipo: 'SAUDE', descricao: 'Vermífugo Premium', valor: 600, observacoes: 'Tratamento vermífugo completo' },
    { tipo: 'SAUDE', descricao: 'Vitamina ADE', valor: 300, observacoes: 'Suplemento vitamínico' },
    { tipo: 'TRANSPORTE', descricao: 'Frete Especial', valor: 1500, observacoes: 'Transporte para leilão' },
    { tipo: 'TRANSPORTE', descricao: 'Combustível', valor: 800, observacoes: 'Combustível para transporte' },
    { tipo: 'MANUTENCAO', descricao: 'Cercas Elétricas', valor: 1000, observacoes: 'Manutenção de cercas elétricas' },
    { tipo: 'MANUTENCAO', descricao: 'Bebedouros', valor: 500, observacoes: 'Manutenção de bebedouros' },
    { tipo: 'MANUTENCAO', descricao: 'Cocho', valor: 600, observacoes: 'Manutenção de cochos' },
    { tipo: 'GENETICA', descricao: 'Sêmen Premium', valor: 2500, observacoes: 'Sêmen de touros elite' },
    { tipo: 'GENETICA', descricao: 'Embrião', valor: 5000, observacoes: 'Embrião de alta qualidade' },
    { tipo: 'VETERINARIO', descricao: 'Consulta Especializada', valor: 800, observacoes: 'Consulta veterinária especializada' },
    { tipo: 'VETERINARIO', descricao: 'Exame Laboratorial', valor: 1200, observacoes: 'Exames laboratoriais completos' }
  ];

  const animals = await prisma.animal.findMany({ where: { userId: user.id } });
  let costsCreated = 0;

  for (const animal of animals) {
    // Adicionar 3-6 custos por animal
    const numCosts = Math.floor(Math.random() * 4) + 3;
    
    for (let i = 0; i < numCosts; i++) {
      const costType = costTypes[Math.floor(Math.random() * costTypes.length)];
      const data = new Date();
      data.setDate(data.getDate() - Math.floor(Math.random() * 365));
      
      try {
        await prisma.cost.create({
          data: {
            animalId: animal.id,
            tipo: costType.tipo,
            descricao: costType.descricao,
            valor: costType.valor + Math.floor(Math.random() * 1000),
            data: data,
            observacoes: costType.observacoes,
            userId: user.id
          }
        });
        costsCreated++;
      } catch (error) {
        if (error.code !== 'P2002') {
          console.error(`❌ Erro ao criar custo:`, error.message);
        }
      }
    }
  }

  console.log(`✅ ${costsCreated} custos criados`);

  // 3. ADICIONAR VENDAS DETALHADAS
  console.log('\n💵 Adicionando vendas detalhadas...');
  
  const soldAnimals = animals.filter(a => a.status === 'VENDIDO');
  const buyers = [
    'João Silva Agropecuária',
    'Maria Santos Fazenda',
    'Pedro Costa Rancho',
    'Ana Oliveira Estância',
    'Carlos Lima Pecuária',
    'Roberto Santos Fazenda',
    'Fernanda Costa Agropecuária',
    'Marcelo Oliveira Rancho',
    'Patrícia Lima Estância',
    'Ricardo Santos Pecuária'
  ];

  let salesCreated = 0;
  for (const animal of soldAnimals) {
    const buyer = buyers[Math.floor(Math.random() * buyers.length)];
    const saleValue = animal.valorVenda || 40000;
    const commission = saleValue * 0.05; // 5% de comissão
    const taxes = saleValue * 0.02; // 2% de taxas
    
    try {
      await prisma.sale.create({
        data: {
          animalId: animal.id,
          userId: user.id,
          valor: saleValue,
          dataVenda: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 180), // Últimos 6 meses
          comprador: buyer,
          comissao: commission,
          taxas: taxes,
          observacoes: `Venda realizada com sucesso - ${animal.tipoVenda || 'VENDA_DIRETA'}`,
          formaPagamento: Math.random() > 0.5 ? 'PIX' : 'BOLETO'
        }
      });
      salesCreated++;
    } catch (error) {
      if (error.code !== 'P2002') {
        console.error(`❌ Erro ao criar venda:`, error.message);
      }
    }
  }

  console.log(`✅ ${salesCreated} vendas criadas`);

  // 4. ADICIONAR PESOS (EVOLUÇÃO)
  console.log('\n⚖️ Adicionando evolução de pesos...');
  
  let weightsCreated = 0;
  for (const animal of animals) {
    const baseWeight = animal.peso;
    const numWeights = Math.floor(Math.random() * 4) + 2; // 2-5 pesagens
    
    for (let i = 0; i < numWeights; i++) {
      const weightDate = new Date();
      weightDate.setDate(weightDate.getDate() - Math.floor(Math.random() * 365));
      const weightVariation = Math.floor(Math.random() * 100) - 50; // ±50kg
      
      try {
        await prisma.weight.create({
          data: {
            animalId: animal.id,
            peso: Math.max(100, baseWeight + weightVariation),
            data: weightDate
          }
        });
        weightsCreated++;
      } catch (error) {
        if (error.code !== 'P2002') {
          console.error(`❌ Erro ao criar peso:`, error.message);
        }
      }
    }
  }

  console.log(`✅ ${weightsCreated} pesagens criadas`);

  // 5. ADICIONAR ALERTAS
  console.log('\n🔔 Adicionando alertas...');
  
  const alertTypes = [
    { tipo: 'VACINA', titulo: 'Vacinação Pendente', descricao: 'Animal precisa de vacinação contra aftosa' },
    { tipo: 'PARTO', titulo: 'Parto Previsto', descricao: 'Parto previsto para os próximos dias' },
    { tipo: 'PESO', titulo: 'Pesagem Necessária', descricao: 'Animal precisa ser pesado' },
    { tipo: 'SAUDE', titulo: 'Consulta Veterinária', descricao: 'Animal precisa de consulta veterinária' },
    { tipo: 'MANUTENCAO', titulo: 'Manutenção de Cercas', descricao: 'Cercas precisam de manutenção' }
  ];

  let alertsCreated = 0;
  for (const animal of animals.filter(a => a.status === 'ATIVO')) {
    const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    const alertDate = new Date();
    alertDate.setDate(alertDate.getDate() + Math.floor(Math.random() * 30)); // Próximos 30 dias
    
    try {
      await prisma.alert.create({
        data: {
          tipo: alertType.tipo,
          titulo: `${alertType.titulo} - ${animal.brinco}`,
          descricao: alertType.descricao,
          data: alertDate,
          status: 'PENDENTE',
          prioridade: Math.random() > 0.7 ? 'ALTA' : 'MEDIA',
          userId: user.id
        }
      });
      alertsCreated++;
    } catch (error) {
      if (error.code !== 'P2002') {
        console.error(`❌ Erro ao criar alerta:`, error.message);
      }
    }
  }

  console.log(`✅ ${alertsCreated} alertas criados`);

  // 6. ADICIONAR PREÇOS DE MERCADO
  console.log('\n📈 Adicionando preços de mercado...');
  
  const marketPrices = [
    { categoria: 'GARROTE', precoMedio: 28000, precoMinimo: 25000, precoMaximo: 32000 },
    { categoria: 'NOVILHA', precoMedio: 32000, precoMinimo: 28000, precoMaximo: 38000 },
    { categoria: 'BOI_GORDO', precoMedio: 18000, precoMinimo: 16000, precoMaximo: 22000 },
    { categoria: 'VACA_GORDA', precoMedio: 15000, precoMinimo: 13000, precoMaximo: 18000 },
    { categoria: 'REPRODUTOR', precoMedio: 45000, precoMinimo: 40000, precoMaximo: 55000 },
    { categoria: 'REPRODUTORA', precoMedio: 38000, precoMinimo: 35000, precoMaximo: 45000 },
    { categoria: 'BEZERRO', precoMedio: 22000, precoMinimo: 20000, precoMaximo: 28000 }
  ];

  let pricesCreated = 0;
  for (const price of marketPrices) {
    try {
      await prisma.marketPrice.create({
        data: {
          produto: price.categoria,
          preco: price.precoMedio,
          unidade: 'CABECA',
          mercado: 'LOCAL',
          data: new Date(),
          fonte: 'Centro-Oeste'
        }
      });
      pricesCreated++;
    } catch (error) {
      if (error.code !== 'P2002') {
        console.error(`❌ Erro ao criar preço:`, error.message);
      }
    }
  }

  console.log(`✅ ${pricesCreated} preços de mercado criados`);

  // 7. RESUMO FINAL
  console.log('\n📊 RESUMO DOS DADOS CRIADOS:');
  console.log('=' * 50);
  
  const finalAnimals = await prisma.animal.count({ where: { userId: user.id } });
  const finalCosts = await prisma.cost.count({ where: { userId: user.id } });
  const finalSales = await prisma.sale.count({ where: { userId: user.id } });
  const finalWeights = await prisma.weight.count();
  const finalAlerts = await prisma.alert.count({ where: { userId: user.id } });
  const finalPrices = await prisma.marketPrice.count();

  console.log(`🐄 Animais: ${finalAnimals} (${animals.filter(a => a.status === 'ATIVO').length} ativos, ${animals.filter(a => a.status === 'VENDIDO').length} vendidos)`);
  console.log(`💰 Custos: ${finalCosts} registros`);
  console.log(`💵 Vendas: ${finalSales} transações`);
  console.log(`⚖️ Pesagens: ${finalWeights} registros`);
  console.log(`🔔 Alertas: ${finalAlerts} pendentes`);
  console.log(`📈 Preços de Mercado: ${finalPrices} categorias`);

  // Calcular investimento total
  const allCosts = await prisma.cost.findMany({ where: { userId: user.id } });
  const totalInvestment = allCosts.reduce((sum, cost) => sum + cost.valor, 0);
  
  // Calcular receita total
  const allSales = await prisma.sale.findMany({ where: { userId: user.id } });
  const totalRevenue = allSales.reduce((sum, sale) => sum + sale.valor, 0);
  
  // Calcular ROI médio
  const activeAnimals = animals.filter(a => a.status === 'ATIVO');
  const avgROI = activeAnimals.length > 0 ? 
    activeAnimals.reduce((sum, animal) => {
      const animalCosts = allCosts.filter(c => c.animalId === animal.id);
      const totalCost = animalCosts.reduce((s, c) => s + c.valor, 0);
      const estimatedValue = animal.valorVenda || 40000;
      return sum + (totalCost > 0 ? ((estimatedValue - totalCost) / totalCost) * 100 : 0);
    }, 0) / activeAnimals.length : 0;

  console.log('\n💹 MÉTRICAS FINANCEIRAS:');
  console.log(`💵 Investimento Total: R$ ${totalInvestment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
  console.log(`💰 Receita Total: R$ ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
  console.log(`📊 ROI Médio: ${avgROI.toFixed(1)}%`);
  console.log(`🎯 Lucro Potencial: R$ ${(totalRevenue - totalInvestment).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);

  console.log('\n✅ DADOS FICTÍCIOS CRIADOS COM SUCESSO!');
  console.log('🎉 Sistema pronto para apresentação impressionante!');
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
