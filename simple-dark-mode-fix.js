// CORREÇÃO SIMPLES DO DARK MODE
console.log('🌙 MANTENDO DARK MODE ATIVO');

// Forçar dark mode permanente
localStorage.setItem('theme', 'dark');
document.documentElement.classList.add('dark');
document.documentElement.style.colorScheme = 'dark';

// Criar função que mantém dark mode sempre ativo
function manterDarkMode() {
    if (!document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }
}

// Executar a cada 500ms para garantir persistência
setInterval(manterDarkMode, 500);

// Listener para mudanças
new MutationObserver(() => {
    manterDarkMode();
}).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
});

console.log('✅ Dark mode forçado permanentemente');
console.log('🔒 Agora ele não deve mais voltar para branco');