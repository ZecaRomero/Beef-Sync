// Script para testar e corrigir o acesso à página de usuários
console.log('🧪 Testando acesso à página de usuários...');

// Função para configurar o usuário Zeca
function setupZecaUser() {
  const ZecaUser = {
    username: 'Zeca',
    name: 'Zeca',
    role: 'developer',
    permissions: ['read', 'write', 'delete', 'admin', 'manage_users']
  };

  // Limpar localStorage
  localStorage.clear();

  // Configurar usuário
  localStorage.setItem('beef-sync-user', JSON.stringify(ZecaUser));
  localStorage.setItem('beef_sync_user_name', 'Zeca');
  localStorage.setItem('beef_sync_user_role', 'Desenvolvedor');

  console.log('✅ Usuário Zeca configurado:', ZecaUser);
}

// Função para testar permissões
function testPermissions() {
  const user = JSON.parse(localStorage.getItem('beef-sync-user') || '{}');

  const userRoles = {
    'Zeca': {
      name: 'Zeca',
      role: 'developer',
      permissions: ['read', 'write', 'delete', 'admin', 'manage_users'],
      description: 'Desenvolvedor - Acesso completo'
    }
  };

  const userRole = userRoles[user.username];
  const hasPermission = userRole && userRole.permissions.includes('manage_users');

  console.log('🔐 Teste de permissões:');
  console.log('Usuário:', user.username);
  console.log('Pode gerenciar usuários:', hasPermission ? '✅ SIM' : '❌ NÃO');

  return hasPermission;
}

// Função para navegar para a página de usuários
function navigateToUsers() {
  console.log('🔗 Navegando para página de usuários...');

  // Se estamos no Next.js, usar o router
  if (typeof window !== 'undefined' && window.location) {
    window.location.href = '/users';
  }
}

// Executar teste completo
function runFullTest() {
  console.log('🚀 Iniciando teste completo...');

  // 1. Configurar usuário
  setupZecaUser();

  // 2. Testar permissões
  const hasPermission = testPermissions();

  if (hasPermission) {
    console.log('✅ Teste passou! Redirecionando para página de usuários...');
    setTimeout(() => {
      navigateToUsers();
    }, 1000);
  } else {
    console.log('❌ Teste falhou! Usuário não tem permissões adequadas.');
  }
}

// Executar o teste
runFullTest();

// Também exportar funções para uso manual
window.setupZecaUser = setupZecaUser;
window.testPermissions = testPermissions;
window.navigateToUsers = navigateToUsers;

console.log('📝 Funções disponíveis:');
console.log('- setupZecaUser(): Configura usuário Zeca');
console.log('- testPermissions(): Testa permissões');
console.log('- navigateToUsers(): Navega para página de usuários');
