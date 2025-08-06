// Script para bloquear chamadas de API problemáticas
// Adicione este script no <head> do seu _document.js ou index.html

(function() {
  console.log('🔧 Iniciando bloqueio de APIs problemáticas...');
  
  // Salvar o fetch original
  const originalFetch = window.fetch;
  
  // Interceptar todas as chamadas fetch
  window.fetch = function(...args) {
    const url = args[0];
    
    // Se for uma string de URL, verificar se é problemática
    if (typeof url === 'string') {
      // Lista de URLs problemáticas para bloquear
      const blockedPaths = [
        '/api/animals',
        '/api/sales',
        '/api/dashboard',
        '/api/gestations',
        '/api/costs',
        '/api/weights',
        '/api/alerts'
      ];
      
      // Verificar se a URL contém algum dos caminhos bloqueados
      const isBlocked = blockedPaths.some(path => url.includes(path));
      
      if (isBlocked) {
        console.log(`🚫 BLOQUEADO: ${url}`);
        
        // Retornar uma resposta mock imediatamente
        return Promise.resolve({
          ok: true,
          status: 200,
          statusText: 'OK',
          headers: new Headers({
            'Content-Type': 'application/json'
          }),
          json: () => Promise.resolve({
            data: [],
            animals: [],
            sales: [],
            message: 'API bloqueada - usando dados mock',
            success: true,
            total: 0
          }),
          text: () => Promise.resolve('{"data":[],"message":"API bloqueada"}'),
          blob: () => Promise.resolve(new Blob()),
          arrayBuffer: () => Promise.resolve(new ArrayBuffer(0))
        });
      }
    }
    
    // Se não for bloqueada, fazer a chamada normal
    return originalFetch.apply(this, args);
  };
  
  // Limpar localStorage problemático
  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('token') || key.includes('auth'))) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      console.log(`🧹 Removido: ${key}`);
    });
    
    // Configurar dados seguros
    localStorage.setItem('beef_sync_token', 'safe-mock-token-' + Date.now());
    localStorage.setItem('beef_sync_user', JSON.stringify({
      id: 1,
      name: 'Usuário Mock',
      email: 'mock@example.com',
      role: 'USER'
    }));
    
    console.log('✅ localStorage configurado com dados seguros');
  } catch (error) {
    console.warn('⚠️ Erro ao configurar localStorage:', error);
  }
  
  // Parar timers problemáticos
  try {
    for (let i = 0; i < 1000; i++) {
      clearTimeout(i);
      clearInterval(i);
    }
    console.log('✅ Timers limpos');
  } catch (error) {
    console.warn('⚠️ Erro ao limpar timers:', error);
  }
  
  console.log('✅ Bloqueio de APIs ativado com sucesso!');
})();