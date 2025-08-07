// CORREÇÃO PASSO A PASSO - Execute uma linha por vez no console

// PASSO 1: Fazer logout completo
console.log('🚪 PASSO 1: Fazendo logout...');
localStorage.clear();
sessionStorage.clear();
console.log('✅ Logout concluído');

// PASSO 2: Configurar usuário Zeca
console.log('🔑 PASSO 2: Configurando usuário Zeca...');
localStorage.setItem('beef-sync-user', '{"username":"Zeca","name":"Zeca","role":"developer","permissions":["read","write","delete","admin","manage_users"]}');
localStorage.setItem('beef_sync_user_name', 'Zeca');
localStorage.setItem('beef_sync_user_role', 'Desenvolvedor');
console.log('✅ Usuário Zeca configurado');

// PASSO 3: Recarregar página
console.log('🔄 PASSO 3: Recarregando página...');
setTimeout(() => {
    window.location.reload();
}, 1000);

// PASSO 4: Após recarregar, execute este comando para ir aos usuários
// window.location.href = '/users';

console.log('📋 APÓS RECARREGAR, execute: window.location.href = "/users"');
