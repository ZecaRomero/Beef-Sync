const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar usuário padrão
  const user = await prisma.user.upsert({
    where: { email: 'admin@beef-sync.com' },
    update: {},
    create: {
      email: 'admin@beef-sync.com',
      name: 'Administrador',
      password: 'admin123',
      role: 'ADMIN'
    }
  });

  console.log('✅ Usuário criado:', user.email);

  // Criar alguns animais de exemplo
  const animals = [
    {
      brinco: 'BS 001',
      serie: 'BS',
      nome: 'Touro Campeão',
      raca: 'Nelore',
      sexo: 'MACHO',
      dataNasc: new Date('2022-03-15'),
      peso: 450.5,
      categoria: 'REPRODUTOR',
      status: 'ATIVO',
      valorVenda: 15000,
      pai: 'Touro Elite',
      mae: 'Vaca Premium',
      tipoCobertura: 'FIV',
      userId: user.id
    },
    {
      brinco: 'BS 002',
      serie: 'BS',
      nome: 'Novilha Especial',
      raca: 'GIR',
      sexo: 'FEMEA',
      dataNasc: new Date('2023-01-20'),
      peso: 320.0,
      categoria: 'REPRODUTORA',
      status: 'ATIVO',
      valorVenda: 8500,
      pai: 'Touro GIR',
      mae: 'Vaca GIR Elite',
      tipoCobertura: 'IA',
      userId: user.id
    },
    {
      brinco: 'BS 003',
      serie: 'BS',
      nome: 'Bezerro Promissor',
      raca: 'Brahman',
      sexo: 'MACHO',
      dataNasc: new Date('2024-02-10'),
      peso: 180.0,
      categoria: 'BEZERRO',
      status: 'ATIVO',
      valorVenda: 4500,
      pai: 'Touro Brahman',
      mae: 'Vaca Brahman',
      tipoCobertura: 'MONTA_NATURAL',
      userId: user.id
    },
    {
      brinco: 'BS 004',
      serie: 'BS',
      nome: 'Bezerra Desmamada',
      raca: 'Nelore',
      sexo: 'FEMEA',
      dataNasc: new Date('2024-01-05'),
      peso: 160.0,
      categoria: 'BEZERRA',
      status: 'ATIVO',
      valorVenda: 3800,
      pai: 'Touro Nelore PO',
      mae: 'Vaca Nelore',
      tipoCobertura: 'IA',
      userId: user.id
    },
    {
      brinco: 'BS 005',
      serie: 'BS',
      nome: 'Garrote Gordo',
      raca: 'Canchim',
      sexo: 'MACHO',
      dataNasc: new Date('2022-11-30'),
      peso: 380.0,
      categoria: 'GARROTE',
      status: 'ATIVO',
      valorVenda: 7200,
      pai: 'Touro Canchim',
      mae: 'Vaca Canchim',
      tipoCobertura: 'IA',
      userId: user.id
    }
  ];

  for (const animalData of animals) {
    const animal = await prisma.animal.upsert({
      where: { brinco: animalData.brinco },
      update: {},
      create: animalData
    });
    console.log('🐄 Animal criado:', animal.brinco, '-', animal.nome);
  }

  // Criar preços de mercado
  const marketPrices = [
    {
      produto: 'BOI_GORDO',
      preco: 285.50,
      unidade: 'R$/arroba',
      mercado: 'CEPEA/ESALQ',
      data: new Date(),
      fonte: 'Manual'
    },
    {
      produto: 'VACA_GORDA',
      preco: 265.00,
      unidade: 'R$/arroba',
      mercado: 'CEPEA/ESALQ',
      data: new Date(),
      fonte: 'Manual'
    },
    {
      produto: 'GARROTE',
      preco: 295.00,
      unidade: 'R$/arroba',
      mercado: 'CEPEA/ESALQ',
      data: new Date(),
      fonte: 'Manual'
    },
    {
      produto: 'NOVILHA',
      preco: 275.00,
      unidade: 'R$/arroba',
      mercado: 'CEPEA/ESALQ',
      data: new Date(),
      fonte: 'Manual'
    },
    {
      produto: 'BEZERRO_MACHO',
      preco: 1850.00,
      unidade: 'R$/cabeça',
      mercado: 'Mercado Regional',
      data: new Date(),
      fonte: 'Manual'
    },
    {
      produto: 'BEZERRA',
      preco: 1650.00,
      unidade: 'R$/cabeça',
      mercado: 'Mercado Regional',
      data: new Date(),
      fonte: 'Manual'
    }
  ];

  for (const priceData of marketPrices) {
    const price = await prisma.marketPrice.create({
      data: priceData
    });
    console.log('💰 Preço criado:', price.produto, '- R$', price.preco);
  }

  console.log('🎉 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });