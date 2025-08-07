// TESTE DO SISTEMA DE AUTENTICAÇÃO - Execute no console
console.log('🔐 TESTANDO SISTEMA DE AUTENTICAÇÃO');
console.log('==================================');

// Função para simular login
function testarLogin(username, password) {
    console.log(`🧪 Testando login: ${username} / ${password}`);
    
    // Simular processo de login
    const userRoles = {
        'zeca': {
            name: 'Zeca',
            role: 'developer',
            permissions: ['read', 'write', 'delete', 'admin', 'manage_users'],
            description: 'Desenvolvedor - Acesso completo'
        },
        'bento': {
            name: 'Bento',
            role: 'consultant',
            permissions: ['read'],
            description: 'Consultor - Apenas visualização'
        },
        'nilson': {
            name: 'Nilson',
            role: 'consultant',
            permissions: ['read'],
            description: 'Consultor - Apenas visualização'
        },
        'mauricio': {
            name: 'Maurício',
            role: 'consultant',
            permissions: ['read'],
            description: 'Consultor - Apenas visualização'
        },
        'jorge': {
            name: 'Jorge',
            role: 'consultant',
            permissions: ['read'],
            description: 'Consultor - Apenas visualização'
        }
    };
    
    // Verificar usuário
    if (!userRoles[username]) {
        console.log('❌ Usuário não encontrado');
        return false;
    }
    
    // Verificar senha
    if (password !== '123') {
        console.log('❌ Senha incorreta');
        return false;
    }
    
    // Login bem-sucedido
    const userData = {
        username,
        name: userRoles[username].name,
        role: userRoles[username].role,
        permissions: userRoles[username].permissions
    };
    
    // Salvar no localStorage
    localStorage.setItem('beef-sync-user', JSON.stringify(userData));
    localStorage.setItem('beef_sync_user_name', userRoles[username].name);
    localStorage.setItem('beef_sync_user_role', userRoles[username].role === 'developer' ? 'Desenvolvedor' : 'Consultor');
    
    console.log('✅ Login bem-sucedido!');
    console.log('👤 Usuário:', userData.name);
    console.log('🔑 Função:', userData.role);
    console.log('📋 Permissões:', userData.permissions.join(', '));
    
    return true;
}

// Função para verificar usuário atual
function verificarUsuarioAtual() {
    console.log('🔍 Verificando usuário atual...');
    
    const user = localStorage.getItem('beef-sync-user');
    if (user) {
        const userData = JSON.parse(user);
        console.log('✅ Usuário logado:', userData.name);
        console.log('🔑 Função:', userData.role);
        console.log('📋 Permissões:', userData.permissions.join(', '));
        
        if (userData.role === 'developer') {
            console.log('🚀 Tela: Dashboard completo (desenvolvedor)');
        } else {
            console.log('👁️ Tela: Dashboard limitado (consultor)');
        }
        
        return userData;
    } else {
        console.log('❌ Nenhum usuário logado');
        return null;
    }
}

// Função para fazer logout
function fazerLogout() {
    console.log('🚪 Fazendo logout...');
    localStorage.removeItem('beef-sync-user');
    localStorage.removeItem('beef_sync_user_name');
    localStorage.removeItem('beef_sync_user_role');
    console.log('✅ Logout realizado');
}

// Disponibilizar funções globalmente
window.testarLogin = testarLogin;
window.verificarUsuarioAtual = verificarUsuarioAtual;
window.fazerLogout = fazerLogout;

console.log('✅ FUNÇÕES DISPONÍVEIS:');
console.log('- testarLogin("usuario", "senha") - Testar login');
console.log('- verificarUsuarioAtual() - Ver usuário atual');
console.log('- fazerLogout() - Fazer logout');
console.log('');
console.log('🧪 TESTES SUGERIDOS:');
console.log('1. testarLogin("zeca", "123") - Login como desenvolvedor');
console.log('2. testarLogin("bento", "123") - Login como consultor');
console.log('3. testarLogin("bento", "456") - Senha incorreta');
console.log('4. testarLogin("inexistente", "123") - Usuário inexistente');
console.log('');
console.log('👥 USUÁRIOS DISPONÍVEIS:');
console.log('- zeca (Desenvolvedor) - Acesso total');
console.log('- bento (Consultor) - Apenas relatórios');
console.log('- mauricio (Consultor) - Apenas relatórios');
console.log('- nilson (Consultor) - Apenas relatórios');
console.log('- jorge (Consultor) - Apenas relatórios');
console.log('==================================');

// Verificar estado atual
verificarUsuarioAtual();