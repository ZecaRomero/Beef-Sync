const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Verificando dados no banco...');
  
  // Verificar animais
  const animals = await prisma.animal.findMany();
  console.log(`📊 Total de animais: ${animals.length}`);
  
  animals.forEach(animal => {
    console.log(`  - ${animal.brinco}: ${animal.status} (R$ ${animal.valorVenda || 0})`);
  });
  
  // Verificar vendas
  const sales = await prisma.sale.findMany();
  console.log(`💰 Total de vendas: ${sales.length}`);
  
  sales.forEach(sale => {
    console.log(`  - R$ ${sale.valor} - ${sale.comprador}`);
  });
  
  // Verificar status dos animais
  const activeAnimals = animals.filter(a => a.status === 'ATIVO').length;
  const soldAnimals = animals.filter(a => a.status === 'VENDIDO').length;
  
  console.log(`✅ Animais ativos: ${activeAnimals}`);
  console.log(`💵 Animais vendidos: ${soldAnimals}`);
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
