// TESTE DE PERSISTÊNCIA DE USUÁRIOS - Execute no console
console.log('💾 TESTANDO PERSISTÊNCIA DE USUÁRIOS');
console.log('====================================');

// Função para verificar usuários salvos
function verificarUsuariosSalvos() {
    console.log('🔍 Verificando usuários no localStorage...');
    
    const savedUsers = localStorage.getItem('beef_sync_users');
    if (savedUsers) {
        const users = JSON.parse(savedUsers);
        console.log('✅ Usuários encontrados:', users.length);
        users.forEach((user, index) => {
            console.log(`${index + 1}. ${user.nome} (${user.role}) - ID: ${user.id}`);
        });
        return users;
    } else {
        console.log('❌ Nenhum usuário salvo encontrado');
        return [];
    }
}

// Função para adicionar usuário de teste
function adicionarUsuarioTeste() {
    console.log('➕ Adicionando usuário de teste...');
    
    const users = verificarUsuariosSalvos();
    const novoUsuario = {
        id: Math.max(...users.map(u => u.id), 0) + 1,
        nome: 'João Silva',
        role: 'Consultor',
        permissoes: ['read']
    };
    
    const updatedUsers = [...users, novoUsuario];
    localStorage.setItem('beef_sync_users', JSON.stringify(updatedUsers));
    
    console.log('✅ Usuário adicionado:', novoUsuario);
    console.log('💾 Dados salvos no localStorage');
    
    return updatedUsers;
}

// Função para limpar usuários
function limparUsuarios() {
    console.log('🧹 Limpando usuários...');
    localStorage.removeItem('beef_sync_users');
    console.log('✅ Usuários removidos do localStorage');
}

// Função para restaurar usuários padrão
function restaurarUsuariosPadrao() {
    console.log('🔄 Restaurando usuários padrão...');
    
    const usuariosPadrao = [
        { id: 1, nome: 'Zeca', role: 'Desenvolvedor', permissoes: ['all'] }
    ];
    
    localStorage.setItem('beef_sync_users', JSON.stringify(usuariosPadrao));
    console.log('✅ Usuários padrão restaurados');
    
    return usuariosPadrao;
}

// Disponibilizar funções globalmente
window.verificarUsuariosSalvos = verificarUsuariosSalvos;
window.adicionarUsuarioTeste = adicionarUsuarioTeste;
window.limparUsuarios = limparUsuarios;
window.restaurarUsuariosPadrao = restaurarUsuariosPadrao;

console.log('✅ FUNÇÕES DISPONÍVEIS:');
console.log('- verificarUsuariosSalvos() - Ver usuários salvos');
console.log('- adicionarUsuarioTeste() - Adicionar usuário de teste');
console.log('- limparUsuarios() - Limpar todos os usuários');
console.log('- restaurarUsuariosPadrao() - Restaurar usuários padrão');
console.log('');
console.log('🧪 TESTE COMPLETO:');
console.log('1. Execute: verificarUsuariosSalvos()');
console.log('2. Execute: adicionarUsuarioTeste()');
console.log('3. Pressione F5 para recarregar');
console.log('4. Execute: verificarUsuariosSalvos() novamente');
console.log('5. O usuário deve persistir após F5');
console.log('====================================');

// Verificação inicial
verificarUsuariosSalvos();