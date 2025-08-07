// CORREÇÃO DO DARK MODE - Execute no console
console.log('🌙 CORRIGINDO PERSISTÊNCIA DO DARK MODE');
console.log('======================================');

// Função para forçar dark mode
function forcarDarkMode() {
    console.log('🔧 Forçando dark mode...');
    
    // Salvar no localStorage
    localStorage.setItem('theme', 'dark');
    
    // Aplicar classe CSS imediatamente
    document.documentElement.classList.add('dark');
    document.documentElement.style.colorScheme = 'dark';
    
    // Também salvar em outras chaves que possam ser usadas
    localStorage.setItem('beef_sync_theme', 'dark');
    localStorage.setItem('darkMode', 'true');
    
    console.log('✅ Dark mode aplicado');
}

// Função para verificar estado do tema
function verificarTema() {
    console.log('🔍 Verificando estado do tema...');
    
    const theme = localStorage.getItem('theme');
    const beefSyncTheme = localStorage.getItem('beef_sync_theme');
    const darkMode = localStorage.getItem('darkMode');
    const hasClass = document.documentElement.classList.contains('dark');
    
    console.log('theme:', theme);
    console.log('beef_sync_theme:', beefSyncTheme);
    console.log('darkMode:', darkMode);
    console.log('Classe CSS aplicada:', hasClass);
    
    return {
        theme,
        beefSyncTheme,
        darkMode,
        hasClass
    };
}

// Função para criar listener persistente
function criarListenerPersistente() {
    console.log('👂 Criando listener para manter dark mode...');
    
    // Listener para mudanças no DOM
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const savedTheme = localStorage.getItem('theme');
                if (savedTheme === 'dark' && !document.documentElement.classList.contains('dark')) {
                    console.log('🔄 Reaplican dark mode...');
                    document.documentElement.classList.add('dark');
                }
            }
        });
    });
    
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
    });
    
    // Listener para storage
    window.addEventListener('storage', (e) => {
        if (e.key === 'theme' && e.newValue === 'dark') {
            document.documentElement.classList.add('dark');
        }
    });
    
    console.log('✅ Listeners criados');
}

// Função para aplicar correção completa
function aplicarCorrecaoCompleta() {
    console.log('🚀 Aplicando correção completa...');
    
    // 1. Forçar dark mode
    forcarDarkMode();
    
    // 2. Criar listeners
    criarListenerPersistente();
    
    // 3. Verificar periodicamente
    setInterval(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark' && !document.documentElement.classList.contains('dark')) {
            console.log('🔄 Corrigindo tema automaticamente...');
            document.documentElement.classList.add('dark');
        }
    }, 1000);
    
    console.log('✅ Correção completa aplicada');
}

// Disponibilizar funções globalmente
window.forcarDarkMode = forcarDarkMode;
window.verificarTema = verificarTema;
window.aplicarCorrecaoCompleta = aplicarCorrecaoCompleta;

console.log('✅ FUNÇÕES DISPONÍVEIS:');
console.log('- forcarDarkMode() - Força dark mode');
console.log('- verificarTema() - Verifica estado atual');
console.log('- aplicarCorrecaoCompleta() - Aplica correção completa');
console.log('');
console.log('🧪 TESTE:');
console.log('1. Execute: aplicarCorrecaoCompleta()');
console.log('2. Faça alguma alteração que cause reload');
console.log('3. O dark mode deve permanecer ativo');
console.log('======================================');

// Aplicar correção automaticamente
aplicarCorrecaoCompleta();

// Verificar estado inicial
verificarTema();