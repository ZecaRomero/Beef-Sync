const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedSemenData() {
  try {
    console.log('🌱 Iniciando seed dos dados de sêmen...');

    // Criar usuário padrão se não existir
    let user = await prisma.user.findFirst({
      where: { email: 'admin@beefSync.com' }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: 'admin@beefSync.com',
          name: 'Administrador',
          password: 'admin123',
          role: 'ADMIN'
        }
      });
      console.log('✅ Usuário administrador criado');
    }

    // Criar containers (botijões)
    const containers = [
      {
        botijaoNumero: '001',
        marca: 'CryoTech',
        modelo: 'CT-500',
        capacidade: 500,
        dataAquisicao: new Date('2023-01-15'),
        status: 'ATIVO',
        temperatura: -196,
        nivelNitrogeno: 85,
        proximaManutencao: new Date('2024-06-15'),
        userId: user.id
      },
      {
        botijaoNumero: '002',
        marca: 'FreezeMax',
        modelo: 'FM-300',
        capacidade: 300,
        dataAquisicao: new Date('2023-06-20'),
        status: 'ATIVO',
        temperatura: -196,
        nivelNitrogeno: 92,
        proximaManutencao: new Date('2024-12-20'),
        userId: user.id
      },
      {
        botijaoNumero: '003',
        marca: 'CryoTech',
        modelo: 'CT-200',
        capacidade: 200,
        dataAquisicao: new Date('2024-01-10'),
        status: 'MANUTENCAO',
        temperatura: 0,
        nivelNitrogeno: 0,
        proximaManutencao: new Date('2024-08-10'),
        userId: user.id
      }
    ];

    for (const containerData of containers) {
      const existingContainer = await prisma.semenContainer.findFirst({
        where: { botijaoNumero: containerData.botijaoNumero }
      });

      if (!existingContainer) {
        await prisma.semenContainer.create({ data: containerData });
        console.log(`✅ Container ${containerData.botijaoNumero} criado`);
      }
    }

    // Buscar containers criados
    const createdContainers = await prisma.semenContainer.findMany();

    // Criar canecas para cada container
    const canecasData = [
      // Container 001
      { containerId: createdContainers[0]?.id, numero: 'A1', capacidade: 50, posicoes: '1-10' },
      { containerId: createdContainers[0]?.id, numero: 'B2', capacidade: 50, posicoes: '11-20' },
      { containerId: createdContainers[0]?.id, numero: 'C3', capacidade: 50, posicoes: '21-25' },
      
      // Container 002
      { containerId: createdContainers[1]?.id, numero: 'A1', capacidade: 30, posicoes: '1-30' },
      { containerId: createdContainers[1]?.id, numero: 'B2', capacidade: 30, posicoes: '31-60' },
    ];

    for (const canecaData of canecasData) {
      if (canecaData.containerId) {
        const existingCaneca = await prisma.semenCaneca.findFirst({
          where: { 
            containerId: canecaData.containerId,
            numero: canecaData.numero
          }
        });

        if (!existingCaneca) {
          await prisma.semenCaneca.create({ data: canecaData });
          console.log(`✅ Caneca ${canecaData.numero} criada`);
        }
      }
    }

    // Buscar canecas criadas
    const canecas = await prisma.semenCaneca.findMany({
      include: { container: true }
    });

    // Criar estoque de sêmen
    const semenStockData = [
      {
        nomeTouro: 'Touro Alpha',
        rg: '123456789',
        raca: 'Nelore',
        fornecedor: 'Central de Sêmen ABC',
        notaFiscal: 'NF-001',
        quantidadeTotal: 50,
        quantidadeDisponivel: 45,
        quantidadeUsada: 5,
        valorUnitario: 120.00,
        dataEntrada: new Date('2024-01-15'),
        dataColeta: new Date('2024-01-10'),
        dataVencimento: new Date('2025-01-10'),
        posicao: '1-10',
        status: 'DISPONIVEL',
        responsavel: 'João Silva',
        observacoes: 'Sêmen de alta qualidade',
        userId: user.id,
        containerId: canecas.find(c => c.container.botijaoNumero === '001' && c.numero === 'A1')?.containerId,
        canecaId: canecas.find(c => c.container.botijaoNumero === '001' && c.numero === 'A1')?.id
      },
      {
        nomeTouro: 'Touro Beta',
        rg: '987654321',
        raca: 'Angus',
        fornecedor: 'Central de Sêmen XYZ',
        notaFiscal: 'NF-002',
        quantidadeTotal: 30,
        quantidadeDisponivel: 28,
        quantidadeUsada: 2,
        valorUnitario: 150.00,
        dataEntrada: new Date('2024-02-01'),
        dataColeta: new Date('2024-01-25'),
        dataVencimento: new Date('2024-12-25'),
        posicao: '11-20',
        status: 'DISPONIVEL',
        responsavel: 'Maria Santos',
        observacoes: 'Touro importado',
        userId: user.id,
        containerId: canecas.find(c => c.container.botijaoNumero === '002' && c.numero === 'A1')?.containerId,
        canecaId: canecas.find(c => c.container.botijaoNumero === '002' && c.numero === 'A1')?.id
      },
      {
        nomeTouro: 'Touro Gamma',
        rg: '456789123',
        raca: 'Brahman',
        fornecedor: 'Central de Sêmen ABC',
        notaFiscal: 'NF-003',
        quantidadeTotal: 25,
        quantidadeDisponivel: 0,
        quantidadeUsada: 25,
        valorUnitario: 100.00,
        dataEntrada: new Date('2023-12-01'),
        dataColeta: new Date('2023-11-25'),
        dataVencimento: new Date('2024-11-25'),
        posicao: '21-25',
        status: 'USADO',
        responsavel: 'Pedro Costa',
        observacoes: 'Lote esgotado',
        userId: user.id,
        containerId: canecas.find(c => c.container.botijaoNumero === '001' && c.numero === 'C3')?.containerId,
        canecaId: canecas.find(c => c.container.botijaoNumero === '001' && c.numero === 'C3')?.id
      }
    ];

    for (const stockData of semenStockData) {
      if (stockData.containerId && stockData.canecaId) {
        const existingStock = await prisma.semenStock.findFirst({
          where: { 
            nomeTouro: stockData.nomeTouro,
            rg: stockData.rg
          }
        });

        if (!existingStock) {
          await prisma.semenStock.create({ data: stockData });
          console.log(`✅ Estoque ${stockData.nomeTouro} criado`);

          // Atualizar ocupação da caneca
          await prisma.semenCaneca.update({
            where: { id: stockData.canecaId },
            data: {
              ocupacao: {
                increment: stockData.quantidadeTotal
              }
            }
          });
        }
      }
    }

    // Criar algumas movimentações de exemplo
    const semenStocks = await prisma.semenStock.findMany();
    
    const movementsData = [
      {
        tipo: 'ENTRADA',
        data: new Date('2024-01-15'),
        responsavel: 'João Silva',
        quantidade: 50,
        motivo: 'Compra de sêmen',
        valorUnitario: 120.00,
        observacoes: 'Entrada: Central de Sêmen ABC - NF: NF-001',
        userId: user.id,
        semenStockId: semenStocks[0]?.id,
        containerDestinoId: createdContainers[0]?.id
      },
      {
        tipo: 'SAIDA',
        data: new Date('2024-02-10'),
        responsavel: 'Maria Santos',
        quantidade: 3,
        motivo: 'inseminacao',
        destinatario: 'Vaca Estrela - Brinco 001',
        observacoes: 'Inseminação artificial',
        userId: user.id,
        semenStockId: semenStocks[0]?.id,
        containerOrigemId: createdContainers[0]?.id
      }
    ];

    for (const movementData of movementsData) {
      if (movementData.semenStockId) {
        const existingMovement = await prisma.semenMovement.findFirst({
          where: { 
            semenStockId: movementData.semenStockId,
            tipo: movementData.tipo,
            data: movementData.data
          }
        });

        if (!existingMovement) {
          await prisma.semenMovement.create({ data: movementData });
          console.log(`✅ Movimentação ${movementData.tipo} criada`);
        }
      }
    }

    console.log('🎉 Seed dos dados de sêmen concluído com sucesso!');
  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  seedSemenData();
}

module.exports = { seedSemenData };