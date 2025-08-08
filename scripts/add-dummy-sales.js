const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('💰 Adicionando vendas fictícias para apresentação...');

  // Buscar usuário
  const user = await prisma.user.findFirst({
    where: { email: 'Zeca@beef-sync.com' }
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

  // Criar vendas fictícias
  const sales = [
    {
      animalId: animals[0].id,
      userId: user.id,
      valor: 45000,
      dataVenda: new Date('2024-08-01'),
      comprador: 'Luciano Abramo Ciambelli',
      comissao: 2250,
      taxas: 500,
      observacoes: 'Venda realizada no leilão de agosto'
    },
    {
      animalId: animals[1].id,
      userId: user.id,
      valor: 32000,
      dataVenda: new Date('2024-08-02'),
      comprador: 'Dona Monica',
      comissao: 1600,
      taxas: 300,
      observacoes: 'Venda direta para cliente fidelizado'
    },
    {
      animalId: animals[2].id,
      userId: user.id,
      valor: 42000,
      dataVenda: new Date('2024-08-03'),
      comprador: 'Reginaldo Faria',
      comissao: 2100,
      taxas: 400,
      observacoes: 'Venda no leilão de agosto'
    },
    {
      animalId: animals[3].id,
      userId: user.id,
      valor: 38000,
      dataVenda: new Date('2024-08-04'),
      comprador: 'Ana Oliveira',
      comissao: 1900,
      taxas: 350,
      observacoes: 'Venda direta para cliente novo'
    },
    {
      animalId: animals[4].id,
      userId: user.id,
      valor: 52000,
      dataVenda: new Date('2024-08-05'),
      comprador: 'Carlos Lima',
      comissao: 2600,
      taxas: 600,
      observacoes: 'Venda no leilão de agosto'
    }
  ];

  for (const saleData of sales) {
    try {
      const sale = await prisma.sale.create({
        data: saleData
      });
      console.log(`✅ Venda criada: R$ ${sale.valor} - ${sale.comprador}`);
    } catch (error) {
      if (error.code === 'P2002') {
        console.log(`⚠️ Venda já existe para o animal ${saleData.animalId}`);
      } else {
        console.error(`❌ Erro ao criar venda:`, error.message);
      }
    }
  }

  console.log('🎉 Vendas fictícias adicionadas com sucesso!');
  console.log(`📊 Total de vendas criadas: ${sales.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
