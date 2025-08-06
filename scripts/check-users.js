const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    console.log('🔍 Verificando usuários no banco...');
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true
      }
    });
    
    console.log(`📊 Encontrados ${users.length} usuários:`);
    users.forEach((user, index) => {
      console.log(`${index + 1}. ID: ${user.id}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Nome: ${user.name}`);
      console.log(`   Criado: ${user.createdAt}`);
      console.log('---');
    });
    
    if (users.length === 0) {
      console.log('❌ Nenhum usuário encontrado!');
      console.log('💡 Execute: node scripts/setup-db.js');
    } else {
      console.log('✅ Usuários encontrados!');
    }
    
  } catch (error) {
    console.error('❌ Erro ao verificar usuários:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers(); 