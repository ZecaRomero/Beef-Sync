const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('💰 Adicionando custos fictícios aos animais...');

  // Buscar usuário
  const user = await prisma.user.findFirst({
    where: { email: 'zeca@beef-sync.com' }
  });

  if (!user) {
    console.log('❌ Usuário não encontrado. Execute primeiro o script add-dummy-data.js');
    return;
  }

  // Buscar animais existentes
  const animals = await prisma.animal.findMany({
    where: { userId: user.id }
  });

  console.log(`📊 Animais encontrados: ${animals.length}`);

  if (animals.length === 0) {
    console.log('❌ Nenhum animal encontrado. Execute primeiro o script add-dummy-data.js');
    return;
  }

  // Tipos de custos fictícios
  const costTypes = [
    { tipo: 'ALIMENTACAO', subtipo: 'Ração', valor: 1500, observacoes: 'Ração premium para engorda', descricao: 'Ração premium para engorda' },
    { tipo: 'SAUDE', subtipo: 'Vacinação', valor: 800, observacoes: 'Vacinação contra aftosa', descricao: 'Vacinação contra aftosa' },
    { tipo: 'TRANSPORTE', subtipo: 'Frete', valor: 1200, observacoes: 'Transporte para leilão', descricao: 'Transporte para leilão' },
    { tipo: 'MANUTENCAO', subtipo: 'Cercas', valor: 500, observacoes: 'Manutenção de cercas', descricao: 'Manutenção de cercas' },
    { tipo: 'ALIMENTACAO', subtipo: 'Sal Mineral', valor: 300, observacoes: 'Suplemento mineral', descricao: 'Suplemento mineral' },
    { tipo: 'SAUDE', subtipo: 'Vermífugo', valor: 400, observacoes: 'Tratamento vermífugo', descricao: 'Tratamento vermífugo' },
    { tipo: 'TRANSPORTE', subtipo: 'Combustível', valor: 600, observacoes: 'Combustível para transporte', descricao: 'Combustível para transporte' },
    { tipo: 'MANUTENCAO', subtipo: 'Bebedouros', valor: 250, observacoes: 'Manutenção de bebedouros', descricao: 'Manutenção de bebedouros' }
  ];

  let totalCostsAdded = 0;

  for (const animal of animals) {
    // Adicionar 2-4 custos por animal
    const numCosts = Math.floor(Math.random() * 3) + 2; // 2-4 custos
    
    for (let i = 0; i < numCosts; i++) {
      const costType = costTypes[Math.floor(Math.random() * costTypes.length)];
      const data = new Date();
      data.setDate(data.getDate() - Math.floor(Math.random() * 365)); // Último ano
      
      try {
        await prisma.cost.create({
          data: {
            animalId: animal.id,
            tipo: costType.tipo,
            descricao: costType.descricao,
            valor: costType.valor + Math.floor(Math.random() * 500), // Variação no valor
            data: data,
            observacoes: costType.observacoes,
            userId: user.id
          }
        });
        totalCostsAdded++;
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`⚠️ Custo já existe para ${animal.brinco}`);
        } else {
          console.error(`❌ Erro ao criar custo para ${animal.brinco}:`, error.message);
        }
      }
    }
  }

  console.log(`✅ Custos adicionados com sucesso!`);
  console.log(`📊 Total de custos criados: ${totalCostsAdded}`);
  console.log(`🐄 Média de custos por animal: ${(totalCostsAdded / animals.length).toFixed(1)}`);

  // Verificar custos criados
  const totalCosts = await prisma.cost.count({
    where: { userId: user.id }
  });

  console.log(`💰 Total de custos no banco: ${totalCosts}`);

  // Calcular investimento total
  const costs = await prisma.cost.findMany({
    where: { userId: user.id }
  });

  const totalInvestment = costs.reduce((sum, cost) => sum + cost.valor, 0);
  console.log(`💵 Investimento total: R$ ${totalInvestment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
