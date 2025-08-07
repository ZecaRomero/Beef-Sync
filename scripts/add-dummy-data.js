const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Adicionando dados fictícios para apresentação...');

  // Criar ou buscar usuário
  let user = await prisma.user.findFirst({
    where: { email: 'Zeca@beef-sync.com' }
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'Zeca@beef-sync.com',
        name: 'Zeca',
        password: 'password123',
        role: 'DEVELOPER'
      }
    });
    console.log('✅ Usuário criado:', user.name);
  }

  // Verificar animais existentes
  const existingAnimals = await prisma.animal.findMany({
    where: { userId: user.id }
  });

  console.log(`📊 Animais existentes: ${existingAnimals.length}`);

  // Criar animais fictícios adicionais (se não existirem)
  const newAnimals = [
    {
      brinco: 'BENT 20003',
      serie: 'BENT',
      nome: 'Touro BENT Elite Plus',
      raca: 'Nelore',
      sexo: 'MACHO',
      dataNasc: new Date('2022-07-15'),
      peso: 470.0,
      categoria: 'REPRODUTOR',
      status: 'VENDIDO',
      valorVenda: 42000,
      tipoVenda: 'VENDA_DIRETA',
      pai: 'Touro BENT Elite Plus',
      mae: 'Vaca BENT Elite',
      tipoCobertura: 'FIV',
      observacoes: 'Touro de genética superior - Apresentação',
      userId: user.id
    },
    {
      brinco: 'CJCG 25002',
      serie: 'CJCG',
      nome: 'Novilha CJCG Premium Plus',
      raca: 'Angus',
      sexo: 'FEMEA',
      dataNasc: new Date('2023-04-20'),
      peso: 360.0,
      categoria: 'REPRODUTORA',
      status: 'VENDIDO',
      valorVenda: 38000,
      tipoVenda: 'LEILAO',
      pai: 'Touro Angus CJCG Elite',
      mae: 'Vaca Angus CJCG Premium',
      tipoCobertura: 'FIV',
      observacoes: 'Novilha de excelente genética',
      userId: user.id
    },
    {
      brinco: 'CJCJ 15003',
      serie: 'CJCJ',
      nome: 'Bezerro CJCJ Promissor',
      raca: 'Brahman',
      sexo: 'MACHO',
      dataNasc: new Date('2024-01-10'),
      peso: 220.0,
      categoria: 'BEZERRO',
      status: 'VENDIDO',
      valorVenda: 28000,
      tipoVenda: 'LEILAO',
      pai: 'Touro Brahman CJCJ Elite',
      mae: 'Vaca Brahman CJCJ Premium',
      tipoCobertura: 'FIV',
      observacoes: 'Bezerro com excelente potencial',
      userId: user.id
    }
  ];

  for (const animalData of newAnimals) {
    try {
      const animal = await prisma.animal.create({
        data: animalData
      });
      console.log(`✅ Animal criado: ${animal.brinco}`);
    } catch (error) {
      if (error.code === 'P2002') {
        console.log(`⚠️ Animal já existe: ${animalData.brinco}`);
      } else {
        console.error(`❌ Erro ao criar animal ${animalData.brinco}:`, error.message);
      }
    }
  }

  // Criar notas fiscais fictícias adicionais
  const newInvoices = [
    {
      numero: 'NF-2024-004',
      compradorNome: 'Ana Oliveira',
      compradorCpfCnpj: '789.123.456-00',
      compradorEndereco: 'Rancho Água Boa',
      compradorCidade: 'Cuiabá',
      compradorEstado: 'MT',
      compradorCep: '78000-000',
      valorTotal: 25000,
      dataVenda: new Date('2024-08-04'),
      tipoVenda: 'VENDA_DIRETA',
      observacoes: 'Venda direta para cliente novo',
      status: 'EMITIDA'
    },
    {
      numero: 'NF-2024-005',
      compradorNome: 'Carlos Lima',
      compradorCpfCnpj: '321.654.987-00',
      compradorEndereco: 'Fazenda Santa Clara',
      compradorCidade: 'Campo Grande',
      compradorEstado: 'MS',
      compradorCep: '79000-000',
      valorTotal: 52000,
      dataVenda: new Date('2024-08-05'),
      tipoVenda: 'LEILAO',
      observacoes: 'Venda no leilão de agosto',
      status: 'EMITIDA'
    },
    {
      numero: 'NF-2024-006',
      compradorNome: 'Lucia Ferreira',
      compradorCpfCnpj: '654.987.321-00',
      compradorEndereco: 'Sítio São Pedro',
      compradorCidade: 'Curitiba',
      compradorEstado: 'PR',
      compradorCep: '80000-000',
      valorTotal: 35000,
      dataVenda: new Date('2024-08-06'),
      tipoVenda: 'VENDA_DIRETA',
      observacoes: 'Venda direta para cliente fidelizado',
      status: 'EMITIDA'
    }
  ];

  for (const invoiceData of newInvoices) {
    try {
      const invoice = await prisma.invoice.create({
        data: invoiceData
      });
      console.log(`✅ Nota fiscal criada: ${invoice.numero}`);
    } catch (error) {
      if (error.code === 'P2002') {
        console.log(`⚠️ Nota fiscal já existe: ${invoiceData.numero}`);
      } else {
        console.error(`❌ Erro ao criar nota fiscal ${invoiceData.numero}:`, error.message);
      }
    }
  }

  // Criar dados de preços de mercado
  const marketPrices = [
    {
      categoria: 'GARROTE',
      precoMedio: 28000,
      precoMinimo: 25000,
      precoMaximo: 32000,
      data: new Date('2024-08-01'),
      regiao: 'Centro-Oeste',
      observacoes: 'Preços estáveis no mercado'
    },
    {
      categoria: 'NOVILHA',
      precoMedio: 32000,
      precoMinimo: 28000,
      precoMaximo: 38000,
      data: new Date('2024-08-01'),
      regiao: 'Centro-Oeste',
      observacoes: 'Demanda alta para novilhas'
    },
    {
      categoria: 'BOI_GORDO',
      precoMedio: 18000,
      precoMinimo: 16000,
      precoMaximo: 22000,
      data: new Date('2024-08-01'),
      regiao: 'Centro-Oeste',
      observacoes: 'Preços em alta para boi gordo'
    },
    {
      categoria: 'VACA_GORDA',
      precoMedio: 15000,
      precoMinimo: 13000,
      precoMaximo: 18000,
      data: new Date('2024-08-01'),
      regiao: 'Centro-Oeste',
      observacoes: 'Mercado estável para vacas'
    }
  ];

  for (const priceData of marketPrices) {
    try {
      const price = await prisma.marketPrice.create({
        data: priceData
      });
      console.log(`✅ Preço de mercado criado: ${price.categoria}`);
    } catch (error) {
      console.log(`⚠️ Preço de mercado já existe: ${priceData.categoria}`);
    }
  }

  console.log('🎉 Dados fictícios adicionados com sucesso!');
  console.log('📊 Resumo:');
  console.log(`   - Animais: ${existingAnimals.length + newAnimals.length} total`);
  console.log(`   - Notas fiscais: ${newInvoices.length} adicionadas`);
  console.log(`   - Preços de mercado: ${marketPrices.length} criados`);
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
