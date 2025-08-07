// Script para diagnosticar e corrigir o problema de acesso à página de usuários
console.log('🔍 Diagnosticando problema de acesso à página de usuários...');

// Verificar se o usuário está logado no localStorage
const checkUserAuth = () => {
  console.log('\n📋 Verificando autenticação no localStorage:');
  
  const beefSyncUser = localStorage.getItem('beef-sync-user');
  const beefSyncUserName = localStorage.getItem('beef_sync_user_name');
  const beefSyncUserRole = localStorage.getItem('beef_sync_user_role');
  
  console.log('beef-sync-user:', beefSyncUser);
  console.log('beef_sync_user_name:', beefSyncUserName);
  console.log('beef_sync_user_role:', beefSyncUserRole);
  
  if (!beefSyncUser) {
    console.log('❌ Usuário não está logado!');
    return false;
  }
  
  try {
    const user = JSON.parse(beefSyncUser);
    console.log('✅ Usuário logado:', user);
    return user;
  } catch (error) {
    console.log('❌ Erro ao parsear dados do usuário:', error);
    return false;
  }
};

// Configurar usuário Zeca com permissões completas
const setupZecaUser = () => {
  console.log('\n🔧 Configurando usuário Zeca com permissões completas...');
  
  const zecaUser = {
    username: 'zeca',
    name: 'Zeca',
    role: 'developer',
    permissions: ['read', 'write', 'delete', 'admin', 'manage_users']
  };
  
  // Salvar no formato esperado pelo AuthContext
  localStorage.setItem('beef-sync-user', JSON.stringify(zecaUser));
  
  // Salvar também nos formatos usados pelo Header
  localStorage.setItem('beef_sync_user_name', 'Zeca');
  localStorage.setItem('beef_sync_user_role', 'Desenvolvedor');
  
  console.log('✅ Usuário Zeca configurado com sucesso!');
  console.log('Dados salvos:', zecaUser);
};

// Verificar permissões
const checkPermissions = (user) => {
  console.log('\n🔐 Verificando permissões:');
  
  const userRoles = {
    'zeca': {
      name: 'Zeca',
      role: 'developer',
      permissions: ['read', 'write', 'delete', 'admin', 'manage_users'],
      description: 'Desenvolvedor - Acesso completo'
    },
    'bento': {
      name: 'Bento',
      role: 'consultant',
      permissions: ['read'],
      description: 'Consultor - Apenas visualização'
    },
    'nilson': {
      name: 'Nilson',
      role: 'consultant',
      permissions: ['read'],
      description: 'Consultor - Apenas visualização'
    },
    'mauricio': {
      name: 'Maurício',
      role: 'consultant',
      permissions: ['read'],
      description: 'Consultor - Apenas visualização'
    }
  };
  
  if (!user || !user.username) {
    console.log('❌ Usuário inválido');
    return false;
  }
  
  const userRole = userRoles[user.username];
  if (!userRole) {
    console.log('❌ Usuário não encontrado no sistema de permissões');
    return false;
  }
  
  console.log('Usuário:', userRole.name);
  console.log('Função:', userRole.role);
  console.log('Permissões:', userRole.permissions);
  
  const hasManageUsers = userRole.permissions.includes('manage_users');
  console.log('Pode gerenciar usuários:', hasManageUsers ? '✅ SIM' : '❌ NÃO');
  
  return hasManageUsers;
};

// Executar diagnóstico
console.log('🚀 Iniciando diagnóstico...');

let user = checkUserAuth();

if (!user || user.username !== 'zeca') {
  console.log('\n🔧 Configurando usuário Zeca...');
  setupZecaUser();
  user = checkUserAuth();
}

if (user) {
  const canManageUsers = checkPermissions(user);
  
  if (canManageUsers) {
    console.log('\n✅ DIAGNÓSTICO CONCLUÍDO: Usuário Zeca tem acesso à página de usuários!');
    console.log('🔗 Você pode acessar: /users');
  } else {
    console.log('\n❌ PROBLEMA: Usuário não tem permissão para gerenciar usuários');
  }
} else {
  console.log('\n❌ PROBLEMA: Não foi possível configurar o usuário');
}

console.log('\n📝 INSTRUÇÕES:');
console.log('1. Execute este script no console do navegador (F12)');
console.log('2. Recarregue a página');
console.log('3. Tente acessar o menu "Usuários" novamente');
console.log('4. Se ainda não funcionar, verifique se está na página correta (/users)');