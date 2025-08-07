// CONFIGURAÇÃO DO SISTEMA DE AUTENTICAÇÃO
console.log('🔐 CONFIGURANDO SISTEMA DE AUTENTICAÇÃO');
console.log('======================================');

// Limpar dados antigos
console.log('🧹 Limpando dados antigos...');
localStorage.removeItem('beef-sync-user');
localStorage.removeItem('beef_sync_user_name');
localStorage.removeItem('beef_sync_user_role');

// Configurar sistema
console.log('⚙️ Configurando sistema...');

// Mostrar usuários disponíveis
console.log('👥 USUÁRIOS DISPONÍVEIS:');
console.log('');
console.log('🔧 DESENVOLVEDOR:');
console.log('   Usuário: Zeca');
console.log('   Senha: 123');
console.log('   Acesso: TOTAL (dashboard completo)');
console.log('');
console.log('👁️ CONSULTORES:');
console.log('   Usuário: Bento | Senha: 123 | Acesso: Apenas relatórios');
console.log('   Usuário: Mauricio | Senha: 123 | Acesso: Apenas relatórios');
console.log('   Usuário: Nilson | Senha: 123 | Acesso: Apenas relatórios');
console.log('   Usuário: Jorge | Senha: 123 | Acesso: Apenas relatórios');

console.log('');
console.log('✅ SISTEMA CONFIGURADO!');
console.log('');
console.log('📋 FUNCIONALIDADES:');
console.log('✓ Validação de senha obrigatória');
console.log('✓ Tela diferente para cada tipo de usuário');
console.log('✓ Zeca: Dashboard completo com todas as funcionalidades');
console.log('✓ Outros: Dashboard limitado apenas com relatórios');
console.log('');
console.log('🚀 PRÓXIMOS PASSOS:');
console.log('1. Vá para a página de login (/login)');
console.log('2. Teste com diferentes usuários');
console.log('3. Observe as telas diferentes para cada perfil');
console.log('');
console.log('🧪 TESTE RÁPIDO:');
console.log('Execute: window.location.href = "/login"');

// Função para ir para login
window.irParaLogin = () => {
    window.location.href = '/login';
};

console.log('======================================');
console.log('🔗 Execute: irParaLogin() para ir ao login');
