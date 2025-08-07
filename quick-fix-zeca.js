// CORREÇÃO RÁPIDA - Execute no console
console.log('⚡ CORREÇÃO RÁPIDA - Zeca DESENVOLVEDOR');

// Configurar dados corretos
localStorage.setItem('beef_sync_user_name', 'Zeca');
localStorage.setItem('beef_sync_user_role', 'Desenvolvedor');

const ZecaUser = {
    username: 'Zeca',
    name: 'Zeca',
    role: 'developer',
    permissions: ['read', 'write', 'delete', 'admin', 'manage_users']
};
localStorage.setItem('beef-sync-user', JSON.stringify(ZecaUser));

// Atualizar header imediatamente
window.dispatchEvent(new Event('userDataUpdated'));

console.log('✅ Zeca configurado como Desenvolvedor');
console.log('🔄 Recarregando página...');

// Recarregar para aplicar todas as mudanças
setTimeout(() => {
    window.location.reload();
}, 1000);
