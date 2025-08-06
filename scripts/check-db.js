const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('🔍 Verificando banco de dados...');

    // Verificar usuários
    const users = await prisma.user.findMany();
    console.log(`👥 Usuários encontrados: ${users.length}`);
    users.forEach(user => {
      console.log(`  - ${user.email} (${user.name})`);
    });

    // Verificar animais
    const animals = await prisma.animal.findMany();
    console.log(`🐄 Animais encontrados: ${animals.length}`);
    animals.forEach(animal => {
      console.log(`  - ${animal.serie} ${animal.brinco} (${animal.status})`);
    });

    // Verificar estrutura da tabela
    const animalCount = await prisma.animal.count();
    console.log(`📊 Total de animais na tabela: ${animalCount}`);

  } catch (error) {
    console.error('❌ Erro ao verificar banco:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase(); 