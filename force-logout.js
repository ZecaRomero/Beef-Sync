// FORÇAR LOGOUT - Execute no console
console.log('🚪 FORÇANDO LOGOUT...');

// Limpar todos os dados de autenticação
localStorage.clear();
sessionStorage.clear();

// Remover especificamente os dados do usuário
localStorage.removeItem('beef-sync-user');
localStorage.removeItem('beef_sync_user_name');
localStorage.removeItem('beef_sync_user_role');
localStorage.removeItem('beef_sync_user');

console.log('✅ Dados limpos com sucesso');

// Redirecionar para login
console.log('🔄 Redirecionando para login...');
window.location.href = '/login';

console.log('📋 INSTRUÇÕES APÓS LOGOUT:');
console.log('1. Na tela de login, use:');
console.log('   - Usuário: zeca');
console.log('   - Senha: 123');
console.log('2. Após login, clique em "Usuários" no menu');