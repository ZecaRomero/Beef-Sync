// TESTE DOS LINKS DO MENU - Execute no console
console.log('🔗 TESTANDO LINKS DO MENU USUÁRIO');
console.log('================================');

// Função para testar navegação
function testNavigation(page, description) {
    console.log(`🧪 Testando: ${description}`);
    
    try {
        // Simular clique e navegação
        window.history.pushState({}, '', page);
        console.log(`✅ Navegação para ${page} simulada com sucesso`);
        
        // Voltar para página atual
        setTimeout(() => {
            window.history.back();
        }, 1000);
        
    } catch (error) {
        console.log(`❌ Erro ao navegar para ${page}:`, error);
    }
}

// Função para navegar diretamente
function goToPage(page) {
    console.log(`🚀 Navegando para: ${page}`);
    window.location.href = page;
}

// Testar links disponíveis
console.log('📋 LINKS DISPONÍVEIS:');
console.log('1. /profile - Página de Perfil');
console.log('2. /settings - Página de Configurações');
console.log('3. /users - Página de Usuários');

// Funções para uso manual
window.goToProfile = () => goToPage('/profile');
window.goToSettings = () => goToPage('/settings');
window.goToUsers = () => goToPage('/users');

console.log('================================');
console.log('🎯 COMANDOS DISPONÍVEIS:');
console.log('- goToProfile() - Ir para Perfil');
console.log('- goToSettings() - Ir para Configurações');
console.log('- goToUsers() - Ir para Usuários');
console.log('================================');

// Teste automático
console.log('🔄 Iniciando teste automático em 2 segundos...');
setTimeout(() => {
    testNavigation('/profile', 'Página de Perfil');
    
    setTimeout(() => {
        testNavigation('/settings', 'Página de Configurações');
        
        setTimeout(() => {
            testNavigation('/users', 'Página de Usuários');
            console.log('✅ Todos os testes concluídos!');
        }, 2000);
    }, 2000);
}, 2000);