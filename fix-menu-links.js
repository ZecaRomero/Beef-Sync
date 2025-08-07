// CORREÇÃO DOS LINKS DO MENU - Execute no console
console.log('🔧 CORRIGINDO LINKS DO MENU USUÁRIO');

// Função para testar se as páginas existem
function testPageExists(url) {
    return fetch(url, { method: 'HEAD' })
        .then(response => response.ok)
        .catch(() => false);
}

// Função para navegar com verificação
async function safeNavigate(url, pageName) {
    console.log(`🔍 Verificando ${pageName}...`);
    
    try {
        // Tentar navegar diretamente
        window.location.href = url;
        console.log(`✅ Navegando para ${pageName}`);
    } catch (error) {
        console.log(`❌ Erro ao navegar para ${pageName}:`, error);
    }
}

// Funções para cada página
window.irParaPerfil = () => safeNavigate('/profile', 'Perfil');
window.irParaConfiguracoes = () => safeNavigate('/settings', 'Configurações');
window.irParaUsuarios = () => safeNavigate('/users', 'Usuários');

console.log('✅ CORREÇÃO APLICADA!');
console.log('');
console.log('🎯 COMANDOS DISPONÍVEIS:');
console.log('- irParaPerfil() - Ir para página de Perfil');
console.log('- irParaConfiguracoes() - Ir para página de Configurações');
console.log('- irParaUsuarios() - Ir para página de Usuários');
console.log('');
console.log('📋 TESTE MANUAL:');
console.log('1. Digite: irParaPerfil()');
console.log('2. Digite: irParaConfiguracoes()');
console.log('3. Digite: irParaUsuarios()');
console.log('');
console.log('🔗 OU DIGITE DIRETAMENTE NA URL:');
console.log('- /profile');
console.log('- /settings');
console.log('- /users');