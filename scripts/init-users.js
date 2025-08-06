const bcrypt = require('bcryptjs');

// Simulação de usuários para desenvolvimento (sem Prisma)
const users = [
  {
    id: 1,
    email: 'zeca@beefsync.com',
    password: 'zeca123',
    name: 'Zeca (Proprietário)',
    role: 'OWNER'
  },
  {
    id: 2,
    email: 'bento@fazenda.com',
    password: 'bento123',
    name: 'Bento (Dono)',
    role: 'OWNER'
  },
  {
    id: 3,
    email: 'nilson@fazenda.com',
    password: 'nilson123',
    name: 'Nilson (Gerente)',
    role: 'MANAGER'
  },
  {
    id: 4,
    email: 'admin@beefsync.com',
    password: 'admin123',
    name: 'Administrador',
    role: 'ADMIN'
  }
];

// Função para verificar credenciais (para desenvolvimento)
export const validateUser = async (email, password) => {
  const user = users.find(u => u.email === email);
  
  if (!user) {
    return null;
  }
  
  // Para desenvolvimento, comparação simples
  if (user.password === password) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };
  }
  
  return null;
};

console.log('Usuários disponíveis:');
users.forEach(user => {
  console.log(`- Email: ${user.email} | Senha: ${user.password} | Perfil: ${user.role}`);
});

module.exports = { users, validateUser };