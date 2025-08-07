// TESTE DE ATUALIZAÇÃO DO USUÁRIO - Execute no console
console.log('🔧 TESTANDO ATUALIZAÇÃO DO USUÁRIO NO HEADER');
console.log('=============================================');

// Função para simular mudança de nome
function mudarNomeUsuario(novoNome) {
    console.log(`📝 Mudando nome do usuário para: ${novoNome}`);
    
    // Atualizar localStorage
    localStorage.setItem('beef_sync_user_name', novoNome);
    
    // Atualizar objeto completo do usuário
    const currentUser = JSON.parse(localStorage.getItem('beef-sync-user') || '{}');
    const updatedUser = {
        ...currentUser,
        name: novoNome
    };
    localStorage.setItem('beef-sync-user', JSON.stringify(updatedUser));
    
    // Disparar evento customizado para atualizar o header
    window.dispatchEvent(new Event('userDataUpdated'));
    
    console.log(`✅ Nome atualizado para: ${novoNome}`);
    console.log('🔄 Header deve atualizar automaticamente');
}

// Função para simular mudança de role
function mudarRoleUsuario(novaRole) {
    console.log(`👤 Mudando role do usuário para: ${novaRole}`);
    
    // Atualizar localStorage
    localStorage.setItem('beef_sync_user_role', novaRole);
    
    // Disparar evento customizado
    window.dispatchEvent(new Event('userDataUpdated'));
    
    console.log(`✅ Role atualizada para: ${novaRole}`);
}

// Função para verificar dados atuais
function verificarDadosUsuario() {
    console.log('🔍 DADOS ATUAIS DO USUÁRIO:');
    console.log('Nome:', localStorage.getItem('beef_sync_user_name'));
    console.log('Role:', localStorage.getItem('beef_sync_user_role'));
    
    const user = JSON.parse(localStorage.getItem('beef-sync-user') || '{}');
    console.log('Objeto completo:', user);
}

// Disponibilizar funções globalmente
window.mudarNomeUsuario = mudarNomeUsuario;
window.mudarRoleUsuario = mudarRoleUsuario;
window.verificarDadosUsuario = verificarDadosUsuario;

console.log('✅ FUNÇÕES DISPONÍVEIS:');
console.log('- mudarNomeUsuario("Novo Nome") - Muda o nome do usuário');
console.log('- mudarRoleUsuario("Nova Role") - Muda a role do usuário');
console.log('- verificarDadosUsuario() - Mostra dados atuais');
console.log('');
console.log('🧪 TESTE RÁPIDO:');
console.log('1. Execute: mudarNomeUsuario("José Carlos")');
console.log('2. Observe se o header atualiza automaticamente');
console.log('3. Execute: verificarDadosUsuario()');
console.log('4. Pressione F5 e veja se mantém o nome');
console.log('=============================================');

// Verificar dados atuais
verificarDadosUsuario();