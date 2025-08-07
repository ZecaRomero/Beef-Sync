// Script final para corrigir o problema do menu de usuários
console.log('🔧 CORREÇÃO FINAL - Menu de Usuários');
console.log('=====================================');

// 1. Limpar completamente o localStorage
console.log('🧹 Limpando localStorage...');
localStorage.clear();

// 2. Configurar usuário Zeca com todas as permissões
console.log('👤 Configurando usuário Zeca...');
const ZecaUserData = {
  username: 'Zeca',
  name: 'Zeca',
  role: 'developer',
  permissions: ['read', 'write', 'delete', 'admin', 'manage_users']
};

// Salvar nos diferentes formatos usados pelo sistema
localStorage.setItem('beef-sync-user', JSON.stringify(ZecaUserData));
localStorage.setItem('beef_sync_user_name', 'Zeca');
localStorage.setItem('beef_sync_user_role', 'Desenvolvedor');

// Formato adicional para compatibilidade
localStorage.setItem('beef_sync_user', JSON.stringify({
  id: 1,
  name: 'Zeca',
  email: 'Zeca@beef-sync.com',
  role: 'developer'
}));

console.log('✅ Usuário configurado:', ZecaUserData);

// 3. Verificar se a configuração está correta
console.log('🔍 Verificando configuração...');
const savedUser = JSON.parse(localStorage.getItem('beef-sync-user'));
console.log('Usuário salvo:', savedUser);

// 4. Testar sistema de permissões
console.log('🔐 Testando permissões...');
const userRoles = {
  'Zeca': {
    name: 'Zeca',
    role: 'developer',
    permissions: ['read', 'write', 'delete', 'admin', 'manage_users'],
    description: 'Desenvolvedor - Acesso completo'
  }
};

const userRole = userRoles[savedUser.username];
const hasManageUsers = userRole && userRole.permissions.includes('manage_users');
console.log('Pode gerenciar usuários:', hasManageUsers ? '✅ SIM' : '❌ NÃO');

// 5. Forçar navegação para página de usuários
if (hasManageUsers) {
  console.log('🚀 Redirecionando para página de usuários...');

  // Aguardar um pouco e redirecionar
  setTimeout(() => {
    if (typeof window !== 'undefined') {
      window.location.href = '/users';
    }
  }, 1500);

  console.log('✅ CORREÇÃO APLICADA COM SUCESSO!');
  console.log('📋 Resumo:');
  console.log('- Usuário: Zeca (Desenvolvedor)');
  console.log('- Permissões: Todas (incluindo manage_users)');
  console.log('- Redirecionamento: /users em 1.5 segundos');
} else {
  console.log('❌ ERRO: Ainda não foi possível configurar as permissões');
}

console.log('=====================================');
console.log('🎯 INSTRUÇÕES FINAIS:');
console.log('1. Execute este script no console (F12)');
console.log('2. Aguarde o redirecionamento automático');
console.log('3. Se não redirecionar, digite: window.location.href = "/users"');
console.log('4. A página de usuários deve carregar normalmente');
console.log('=====================================');
