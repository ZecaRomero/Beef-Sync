// TESTE DE LOGIN DO Jorge - Execute no console
console.log('👤 TESTANDO LOGIN DO Jorge');
console.log('==========================');

// Limpar dados antigos
console.log('🧹 Limpando dados antigos...');
localStorage.removeItem('beef-sync-user');
localStorage.removeItem('beef_sync_user_name');
localStorage.removeItem('beef_sync_user_role');

// Simular login do Jorge
console.log('🔑 Fazendo login como Jorge...');

const JorgeUser = {
    username: 'Jorge',
    name: 'Jorge',
    role: 'consultant',
    permissions: ['read']
};

// Salvar dados do Jorge
localStorage.setItem('beef-sync-user', JSON.stringify(JorgeUser));
localStorage.setItem('beef_sync_user_name', 'Jorge');
localStorage.setItem('beef_sync_user_role', 'Consultor');

console.log('✅ Login do Jorge realizado!');
console.log('👤 Nome:', JorgeUser.name);
console.log('🔑 Função:', JorgeUser.role);
console.log('📋 Permissões:', JorgeUser.permissions.join(', '));

// Verificar se os dados foram salvos
setTimeout(() => {
    const savedUser = localStorage.getItem('beef-sync-user');
    const savedName = localStorage.getItem('beef_sync_user_name');
    const savedRole = localStorage.getItem('beef_sync_user_role');

    console.log('🔍 VERIFICAÇÃO:');
    console.log('Usuário salvo:', savedUser);
    console.log('Nome salvo:', savedName);
    console.log('Role salva:', savedRole);

    if (savedUser && savedName === 'Jorge' && savedRole === 'Consultor') {
        console.log('✅ Dados salvos corretamente!');
        console.log('🔄 Recarregando página...');

        // Recarregar página para aplicar mudanças
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    } else {
        console.log('❌ Problema ao salvar dados');
    }
}, 500);

console.log('==========================');
console.log('📋 O QUE DEVE ACONTECER:');
console.log('1. Jorge deve ver tela de consultor');
console.log('2. Apenas relatórios BI e Timeline');
console.log('3. Sem acesso a cadastro de animais');
console.log('4. Sem acesso a criar nota fiscal');
console.log('==========================');
