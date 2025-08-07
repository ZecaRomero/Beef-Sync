// TESTE DE ACESSO DE CONSULTORES - Execute no console
console.log('👨‍💼 TESTANDO ACESSO DE CONSULTORES');
console.log('==================================');

// Função para simular login de consultor
function loginComoConsultor(nome) {
    console.log(`🔑 Fazendo login como ${nome} (consultor)...`);
    
    // Limpar dados antigos
    localStorage.removeItem('beef-sync-user');
    localStorage.removeItem('beef_sync_user_name');
    localStorage.removeItem('beef_sync_user_role');
    
    // Configurar consultor
    const consultorUser = {
        username: nome.toLowerCase(),
        name: nome,
        role: 'consultant',
        permissions: ['read']
    };
    
    localStorage.setItem('beef-sync-user', JSON.stringify(consultorUser));
    localStorage.setItem('beef_sync_user_name', nome);
    localStorage.setItem('beef_sync_user_role', 'Consultor');
    
    console.log('✅ Login realizado como:', nome);
    console.log('🔑 Função: Consultor');
    console.log('📋 Permissões: Apenas leitura');
    
    return consultorUser;
}

// Função para verificar o que o consultor pode acessar
function verificarAcessoConsultor() {
    console.log('🔍 Verificando acesso do consultor...');
    
    const user = JSON.parse(localStorage.getItem('beef-sync-user') || '{}');
    
    if (user.role !== 'consultant') {
        console.log('❌ Usuário não é consultor');
        return;
    }
    
    console.log('👤 Usuário:', user.name);
    console.log('');
    console.log('✅ DEVE TER ACESSO A:');
    console.log('- 📊 Relatórios BI (gráficos e análises)');
    console.log('- 📅 Timeline de Vendas (acompanhar vendas)');
    console.log('- 📋 Relatórios Gerais (consultar relatórios)');
    console.log('');
    console.log('❌ NÃO DEVE TER ACESSO A:');
    console.log('- 🐄 Cadastro de Animais');
    console.log('- 📋 Criar Nota Fiscal');
    console.log('- ⚙️ Configurações do Sistema');
    console.log('- 👥 Gerenciamento de Usuários');
    console.log('');
    console.log('⚠️ TELA DEVE MOSTRAR:');
    console.log('- Aviso de "Acesso Limitado"');
    console.log('- Apenas 3 botões principais');
    console.log('- Informações sobre permissões');
}

// Disponibilizar funções globalmente
window.loginComoConsultor = loginComoConsultor;
window.verificarAcessoConsultor = verificarAcessoConsultor;

// Função para testar todos os consultores
function testarTodosConsultores() {
    console.log('🧪 TESTANDO TODOS OS CONSULTORES:');
    console.log('');
    
    const consultores = ['Bento', 'Mauricio', 'Nilson', 'Jorge'];
    
    consultores.forEach((nome, index) => {
        console.log(`${index + 1}. Para testar ${nome}: loginComoConsultor("${nome}")`);
    });
    
    console.log('');
    console.log('📋 APÓS CADA LOGIN:');
    console.log('1. Execute: verificarAcessoConsultor()');
    console.log('2. Recarregue a página: window.location.reload()');
    console.log('3. Verifique se não aparece botão de "Cadastro de Animais"');
}

window.testarTodosConsultores = testarTodosConsultores;

console.log('✅ FUNÇÕES DISPONÍVEIS:');
console.log('- loginComoConsultor("Nome") - Login como consultor');
console.log('- verificarAcessoConsultor() - Verificar permissões');
console.log('- testarTodosConsultores() - Ver todos os testes');
console.log('');
console.log('🧪 TESTE RÁPIDO PARA BENTO:');
console.log('1. Execute: loginComoConsultor("Bento")');
console.log('2. Execute: window.location.reload()');
console.log('3. Verifique se NÃO aparece "Cadastro de Animais"');
console.log('==================================');

// Mostrar instruções para todos os consultores
testarTodosConsultores();