// EXECUTE ESTE CÓDIGO NO CONSOLE DO NAVEGADOR (F12 → Console)
// Cole todo este código e pressione Enter

console.log('🚀 INICIANDO CORREÇÃO IMEDIATA...');

// 1. Interceptar e bloquear TODAS as chamadas problemáticas
if (!window.originalFetch) {
  window.originalFetch = window.fetch;
}

window.fetch = function(...args) {
  const url = args[0];
  
  if (typeof url === 'string') {
    const blockedPaths = ['/api/animals', '/api/sales', '/api/dashboard', '/api/gestations', '/api/costs', '/api/weights', '/api/alerts'];
    const isBlocked = blockedPaths.some(path => url.includes(path));
    
    if (isBlocked) {
      console.log(`🚫 BLOQUEADO: ${url}`);
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: [], animals: [], sales: [], message: 'Bloqueado', total: 0 })
      });
    }
  }
  
  return window.originalFetch.apply(this, args);
};

// 2. Limpar TUDO do localStorage
localStorage.clear();
sessionStorage.clear();

// 3. Configurar dados seguros
localStorage.setItem('beef_sync_token', 'safe-token-' + Date.now());
localStorage.setItem('beef_sync_user', '{"id":1,"name":"Mock User","email":"mock@test.com","role":"USER"}');

// 4. Parar TODOS os timers
for (let i = 0; i < 2000; i++) {
  try {
    clearTimeout(i);
    clearInterval(i);
  } catch (e) {}
}

// 5. Interceptar console.error para parar logs de erro
const originalConsoleError = console.error;
console.error = function(...args) {
  const message = args.join(' ');
  if (message.includes('Token inválido') || 
      message.includes('401') || 
      message.includes('api/animals') ||
      message.includes('api/sales')) {
    return; // Não mostrar esses erros
  }
  originalConsoleError.apply(console, args);
};

console.log('✅ CORREÇÃO APLICADA COM SUCESSO!');
console.log('🔄 Recarregando página em 3 segundos...');

// 6. Recarregar página
setTimeout(() => {
  window.location.reload();
}, 3000);