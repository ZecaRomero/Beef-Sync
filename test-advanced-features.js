// TESTE DAS NOVAS FUNCIONALIDADES - Execute no console
console.log('🚀 TESTANDO FUNCIONALIDADES AVANÇADAS');
console.log('=====================================');

// Função para simular login de consultor e testar funcionalidades
function testarFuncionalidadesAvancadas(usuario = 'bento') {
    console.log(`🔑 Fazendo login como ${usuario} (consultor)...`);
    
    // Limpar dados antigos
    localStorage.removeItem('beef-sync-user');
    localStorage.removeItem('beef_sync_user_name');
    localStorage.removeItem('beef_sync_user_role');
    
    // Configurar consultor
    const consultorUser = {
        username: usuario.toLowerCase(),
        name: usuario.charAt(0).toUpperCase() + usuario.slice(1),
        role: 'consultant',
        permissions: ['read']
    };
    
    localStorage.setItem('beef-sync-user', JSON.stringify(consultorUser));
    localStorage.setItem('beef_sync_user_name', consultorUser.name);
    localStorage.setItem('beef_sync_user_role', 'Consultor');
    
    console.log('✅ Login realizado como:', consultorUser.name);
    console.log('');
    console.log('📊 NOVAS FUNCIONALIDADES DISPONÍVEIS:');
    console.log('');
    console.log('1. 📊 ANÁLISES AVANÇADAS:');
    console.log('   - Médias de preços FIV vs IA');
    console.log('   - Performance por pai/touro');
    console.log('   - Tendências de crescimento');
    console.log('   - Comparações detalhadas');
    console.log('');
    console.log('2. 🔔 SISTEMA DE ALERTAS DE RECEPTORAS:');
    console.log('   - Alerta 2 meses após parto (apta para TE)');
    console.log('   - Alerta se não emprenhar (candidata a descarte)');
    console.log('   - Alerta de inatividade após desmama');
    console.log('   - Gestão automática de status');
    console.log('');
    console.log('3. 📋 RELATÓRIOS GERAIS:');
    console.log('   - Acesso aos relatórios existentes');
    console.log('   - Timeline de vendas');
    console.log('   - BI Analytics');
    
    return consultorUser;
}

// Função para mostrar exemplos de dados
function mostrarExemplosDados() {
    console.log('📈 EXEMPLOS DE ANÁLISES DISPONÍVEIS:');
    console.log('');
    console.log('🧬 FIV vs IA:');
    console.log('- FIV: 15 animais, média R$ 45.000 (+58% vs IA)');
    console.log('- IA: 85 animais, média R$ 28.500');
    console.log('- Diferença: FIV tem preço 58% maior');
    console.log('');
    console.log('👨‍🦳 Performance por Pai:');
    console.log('- Touro Alpha FIV: 8 filhos, média R$ 48.000');
    console.log('- Touro Beta IA: 12 filhos, média R$ 32.000');
    console.log('- Touro Gamma FIV: 5 filhos, média R$ 52.000');
    console.log('');
    console.log('🔔 Alertas de Receptoras:');
    console.log('- Receptora 001: Apta para TE (65 dias após parto)');
    console.log('- Receptora 002: Não emprenhou - candidata a descarte');
    console.log('- Receptora 003: Inativa (125 dias sem serviço)');
}

// Função para mostrar regras de negócio
function mostrarRegrasNegocio() {
    console.log('📋 REGRAS DE NEGÓCIO IMPLEMENTADAS:');
    console.log('');
    console.log('🔔 SISTEMA DE ALERTAS:');
    console.log('');
    console.log('1. APTA PARA TE:');
    console.log('   - Alerta: 2 meses (60-70 dias) após parto');
    console.log('   - Condição: Receptora não prenha');
    console.log('   - Ação: Agendar nova TE');
    console.log('');
    console.log('2. NÃO EMPRENHOU:');
    console.log('   - Alerta: 30+ dias após serviço falhado');
    console.log('   - Condição: Pregnancy status = failed');
    console.log('   - Ação: Marcar como descarte ou nova tentativa');
    console.log('');
    console.log('3. INATIVIDADE APÓS DESMAMA:');
    console.log('   - Aviso: 60-90 dias sem serviço após desmama');
    console.log('   - Crítico: 90+ dias sem serviço');
    console.log('   - Ação: Marcar como inativa ou agendar serviço');
    console.log('');
    console.log('📊 ANÁLISES AUTOMÁTICAS:');
    console.log('- Cálculo automático de médias FIV vs IA');
    console.log('- Ranking de touros por performance');
    console.log('- Tendências de preços e volume');
    console.log('- Análise de rentabilidade');
}

// Disponibilizar funções globalmente
window.testarFuncionalidadesAvancadas = testarFuncionalidadesAvancadas;
window.mostrarExemplosDados = mostrarExemplosDados;
window.mostrarRegrasNegocio = mostrarRegrasNegocio;

console.log('✅ FUNÇÕES DISPONÍVEIS:');
console.log('- testarFuncionalidadesAvancadas("nome") - Testar como consultor');
console.log('- mostrarExemplosDados() - Ver exemplos de dados');
console.log('- mostrarRegrasNegocio() - Ver regras implementadas');
console.log('');
console.log('🧪 TESTE RÁPIDO:');
console.log('1. Execute: testarFuncionalidadesAvancadas("bento")');
console.log('2. Execute: window.location.reload()');
console.log('3. Teste os novos botões: "Análises Avançadas" e "Alertas de Receptoras"');
console.log('=====================================');

// Mostrar exemplos automaticamente
mostrarExemplosDados();
console.log('');
mostrarRegrasNegocio();