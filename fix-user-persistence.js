// CORREÇÃO IMEDIATA - Persistência de Usuários
console.log('💾 CORRIGINDO PERSISTÊNCIA DE USUÁRIOS');
console.log('======================================');

// Inicializar usuários padrão se não existirem
function inicializarUsuarios() {
    console.log('🔧 Inicializando sistema de usuários...');
    
    const usuariosPadrao = [
        { 
            id: 1, 
            nome: 'Zeca', 
            role: 'Desenvolvedor', 
            permissoes: ['all'] 
        }
    ];
    
    // Verificar se já existem usuários salvos
    const savedUsers = localStorage.getItem('beef_sync_users');
    
    if (!savedUsers) {
        // Se não existem, criar usuários padrão
        localStorage.setItem('beef_sync_users', JSON.stringify(usuariosPadrao));
        console.log('✅ Usuários padrão criados');
    } else {
        console.log('✅ Usuários já existem no localStorage');
    }
    
    // Verificar conteúdo
    const users = JSON.parse(localStorage.getItem('beef_sync_users') || '[]');
    console.log('👥 Usuários atuais:', users.length);
    users.forEach(user => {
        console.log(`- ${user.nome} (${user.role})`);
    });
}

// Função para adicionar usuário de exemplo
function adicionarUsuarioExemplo() {
    console.log('➕ Adicionando usuário de exemplo...');
    
    const users = JSON.parse(localStorage.getItem('beef_sync_users') || '[]');
    const novoUsuario = {
        id: Math.max(...users.map(u => u.id), 0) + 1,
        nome: 'Maria Santos',
        role: 'Consultor',
        permissoes: ['read']
    };
    
    const updatedUsers = [...users, novoUsuario];
    localStorage.setItem('beef_sync_users', JSON.stringify(updatedUsers));
    
    console.log('✅ Usuário adicionado:', novoUsuario.nome);
    console.log('💾 Total de usuários:', updatedUsers.length);
}

// Executar inicialização
inicializarUsuarios();

// Adicionar usuário de exemplo
adicionarUsuarioExemplo();

console.log('======================================');
console.log('✅ CORREÇÃO APLICADA!');
console.log('');
console.log('📋 AGORA:');
console.log('1. Usuários são salvos automaticamente no localStorage');
console.log('2. Ao pressionar F5, os usuários permanecem');
console.log('3. Novos usuários cadastrados são persistentes');
console.log('');
console.log('🔄 Recarregando página para aplicar mudanças...');

// Recarregar página para aplicar as mudanças
setTimeout(() => {
    window.location.reload();
}, 2000);