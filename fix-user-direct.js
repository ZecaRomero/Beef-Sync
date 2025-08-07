// CORREÇÃO DIRETA - Execute este código
// Copie e cole no console do navegador (F12 > Console)

// Limpar tudo
localStorage.clear();

// Configurar Zeca
localStorage.setItem('beef-sync-user', '{"username":"Zeca","name":"Zeca","role":"developer","permissions":["read","write","delete","admin","manage_users"]}');
localStorage.setItem('beef_sync_user_name', 'Zeca');
localStorage.setItem('beef_sync_user_role', 'Desenvolvedor');

// Ir para página de usuários
window.location.href = '/users';

console.log('✅ CORREÇÃO APLICADA - Redirecionando...');
