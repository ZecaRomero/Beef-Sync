const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function setupDatabase() {
  try {
    console.log('🔧 Inicializando banco de dados...');

    // Criar usuário de teste
    const hashedPassword = await bcrypt.hash('Zeca123', 10);

    const user = await prisma.user.upsert({
      where: { email: 'Zeca@beefsync.com' },
      update: {},
      create: {
        email: 'Zeca@beefsync.com',
        name: 'Zeca Desenvolvedor',
        password: hashedPassword,
        role: 'ADMIN'
      }
    });

    console.log('✅ Usuário criado:', user.email);

    // Animais de teste removidos - banco limpo para dados reais
    console.log('📝 Banco configurado sem dados mockados');

    console.log('🎉 Banco de dados inicializado com sucesso!');
    console.log('📧 Email: Zeca@beefsync.com');
    console.log('🔑 Senha: Zeca123');

  } catch (error) {
    console.error('❌ Erro ao inicializar banco:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupDatabase();
