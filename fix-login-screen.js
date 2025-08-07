// CORREÇÃO PARA TELA DE LOGIN - Execute no console
console.log('🔑 CORRIGINDO LOGIN NA TELA ATUAL');
console.log('=================================');

// Função para preencher os campos automaticamente
function fillLoginForm() {
    console.log('📝 Preenchendo formulário de login...');
    
    // Encontrar os campos de input
    const usernameField = document.querySelector('input[type="text"], input[name="username"], input[id="username"]');
    const passwordField = document.querySelector('input[type="password"], input[name="password"], input[id="password"]');
    
    if (usernameField) {
        usernameField.value = 'zeca';
        usernameField.dispatchEvent(new Event('input', { bubbles: true }));
        usernameField.dispatchEvent(new Event('change', { bubbles: true }));
        console.log('✅ Campo usuário preenchido: zeca');
    } else {
        console.log('❌ Campo usuário não encontrado');
    }
    
    if (passwordField) {
        passwordField.value = '123';
        passwordField.dispatchEvent(new Event('input', { bubbles: true }));
        passwordField.dispatchEvent(new Event('change', { bubbles: true }));
        console.log('✅ Campo senha preenchido: 123');
    } else {
        console.log('❌ Campo senha não encontrado');
    }
}

// Função para fazer login direto
function directLogin() {
    console.log('🚀 Fazendo login direto...');
    
    // Configurar usuário Zeca diretamente
    const zecaUser = {
        username: 'zeca',
        name: 'Zeca',
        role: 'developer',
        permissions: ['read', 'write', 'delete', 'admin', 'manage_users']
    };
    
    localStorage.setItem('beef-sync-user', JSON.stringify(zecaUser));
    localStorage.setItem('beef_sync_user_name', 'Zeca');
    localStorage.setItem('beef_sync_user_role', 'Desenvolvedor');
    
    console.log('✅ Login direto realizado');
    
    // Redirecionar para página de usuários
    setTimeout(() => {
        window.location.href = '/users';
    }, 500);
}

// Função para clicar no botão de login
function clickLoginButton() {
    console.log('🖱️ Procurando botão de login...');
    
    const loginButton = document.querySelector('button[type="submit"], button:contains("Entrar"), .btn-primary');
    
    if (loginButton) {
        console.log('✅ Botão encontrado, clicando...');
        loginButton.click();
    } else {
        console.log('❌ Botão não encontrado');
    }
}

// Executar correção
console.log('🎯 OPÇÕES DISPONÍVEIS:');
console.log('1. fillLoginForm() - Preenche os campos automaticamente');
console.log('2. directLogin() - Faz login direto sem formulário');
console.log('3. clickLoginButton() - Clica no botão após preencher');

// Tentar correção automática
console.log('🔄 Tentando correção automática...');

// Opção 1: Preencher campos
fillLoginForm();

// Aguardar um pouco e tentar login direto se não funcionar
setTimeout(() => {
    console.log('⚡ Tentando login direto...');
    directLogin();
}, 2000);

console.log('=================================');
console.log('📋 SE NÃO FUNCIONAR AUTOMATICAMENTE:');
console.log('1. Digite "zeca" no campo usuário');
console.log('2. Digite "123" no campo senha');
console.log('3. Clique em "Entrar"');
console.log('4. Ou execute: directLogin()');
console.log('=================================');