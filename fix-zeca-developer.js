// CORREÇÃO COMPLETA - Zeca como Desenvolvedor
console.log('🔧 CORRIGINDO DADOS DO Zeca COMO DESENVOLVEDOR');
console.log('===============================================');

// Limpar dados inconsistentes
console.log('🧹 Limpando dados antigos...');
localStorage.removeItem('beef-sync-user');
localStorage.removeItem('beef_sync_user_name');
localStorage.removeItem('beef_sync_user_role');
localStorage.removeItem('beef_sync_user');

// Configurar Zeca corretamente como Desenvolvedor
console.log('👨‍💻 Configurando Zeca como Desenvolvedor...');
const ZecaUser = {
    username: 'Zeca',
    name: 'Zeca',
    role: 'developer',
    permissions: ['read', 'write', 'delete', 'admin', 'manage_users']
};

// Salvar dados corretos
localStorage.setItem('beef-sync-user', JSON.stringify(ZecaUser));
localStorage.setItem('beef_sync_user_name', 'Zeca');
localStorage.setItem('beef_sync_user_role', 'Desenvolvedor');

console.log('✅ Dados salvos:');
console.log('Nome:', 'Zeca');
console.log('Role:', 'Desenvolvedor');
console.log('Permissões:', ZecaUser.permissions.join(', '));

// Forçar atualização do header
console.log('🔄 Atualizando header...');
if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('userDataUpdated'));
}

// Verificar se os dados foram salvos corretamente
setTimeout(() => {
    console.log('🔍 VERIFICAÇÃO FINAL:');
    const savedName = localStorage.getItem('beef_sync_user_name');
    const savedRole = localStorage.getItem('beef_sync_user_role');
    const savedUser = JSON.parse(localStorage.getItem('beef-sync-user') || '{}');

    console.log('Nome no localStorage:', savedName);
    console.log('Role no localStorage:', savedRole);
    console.log('Usuário completo:', savedUser);

    if (savedName === 'Zeca' && savedRole === 'Desenvolvedor') {
        console.log('✅ CORREÇÃO APLICADA COM SUCESSO!');
        console.log('📋 AGORA:');
        console.log('1. O header deve mostrar "Zeca" como "Desenvolvedor"');
        console.log('2. Na página de configurações deve aparecer "Zeca" como "Desenvolvedor"');
        console.log('3. Ao pressionar F5, deve manter os dados corretos');

        // Recarregar página para aplicar mudanças
        console.log('🔄 Recarregando página em 2 segundos...');
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    } else {
        console.log('❌ Ainda há problemas nos dados');
    }
}, 1000);

console.log('===============================================');
