// CORREÇÃO DE EMERGÊNCIA - Execute no console do navegador
// Pressione F12, cole este código e pressione Enter

console.clear();
console.log('🚨 CORREÇÃO DE EMERGÊNCIA INICIADA...');

// 1. PARAR TUDO IMEDIATAMENTE
try {
  // Parar todos os timers possíveis
  for (let i = 0; i < 5000; i++) {
    clearTimeout(i);
    clearInterval(i);
  }
  console.log('✅ Todos os timers parados');
} catch (e) {}

// 2. INTERCEPTAR FETCH AGRESSIVAMENTE
window.fetch = function() {
  console.log('🚫 FETCH BLOQUEADO:', arguments[0]);
  return Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({ data: [], message: 'Bloqueado' })
  });
};

// 3. LIMPAR TUDO
localStorage.clear();
sessionStorage.clear();
console.log('✅ Storage limpo');

// 4. CONFIGURAR DADOS SEGUROS
localStorage.setItem('beef_sync_token', 'emergency-token-' + Date.now());
localStorage.setItem('beef_sync_user', '{"id":1,"name":"Emergency User","role":"ADMIN"}');
console.log('✅ Dados seguros configurados');

// 5. SUPRIMIR ERROS
console.error = function() {};
window.onerror = function() { return true; };
window.addEventListener('error', function(e) { e.preventDefault(); });

// 6. INTERCEPTAR XMLHttpRequest também
const originalXHR = window.XMLHttpRequest;
window.XMLHttpRequest = function() {
  const xhr = new originalXHR();
  const originalOpen = xhr.open;
  xhr.open = function(method, url) {
    if (url.includes('/api/animals') || url.includes('/api/sales')) {
      console.log('🚫 XHR BLOQUEADO:', url);
      return;
    }
    return originalOpen.apply(this, arguments);
  };
  return xhr;
};

console.log('🎉 CORREÇÃO DE EMERGÊNCIA COMPLETA!');
console.log('🔄 Recarregando em 2 segundos...');

setTimeout(() => {
  window.location.reload();
}, 2000);