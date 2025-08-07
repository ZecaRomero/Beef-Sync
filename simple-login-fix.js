// SOLUÇÃO SIMPLES - Execute no console da tela de login
console.log('🔑 FAZENDO LOGIN COMO Zeca...');

// Login direto sem formulário
const ZecaUser = {
    username: 'Zeca',
    name: 'Zeca',
    role: 'developer',
    permissions: ['read', 'write', 'delete', 'admin', 'manage_users']
};

localStorage.setItem('beef-sync-user', JSON.stringify(ZecaUser));
localStorage.setItem('beef_sync_user_name', 'Zeca');
localStorage.setItem('beef_sync_user_role', 'Desenvolvedor');

console.log('✅ Login realizado como Zeca');
console.log('🚀 Redirecionando para página de usuários...');

// Ir direto para usuários
window.location.href = '/users';

console.log('📋 Se não redirecionar, digite na URL: /users');
