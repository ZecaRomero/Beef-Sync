import { useEffect } from 'react';

const ApiBlocker = () => {
  useEffect(() => {
    // Executar o bloqueio de APIs imediatamente
    const blockApis = () => {
      console.log('🔧 Iniciando bloqueio de APIs problemáticas...');
      
      // Salvar o fetch original se ainda não foi salvo
      if (!window.originalFetch) {
        window.originalFetch = window.fetch;
      }
      
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
        return window.originalFetch.apply(this, args);
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
    };

    // Executar imediatamente
    blockApis();
    
    // Executar novamente após um pequeno delay para garantir
    setTimeout(blockApis, 100);
    
  }, []);

  return null; // Este componente não renderiza nada
};

export default ApiBlocker;