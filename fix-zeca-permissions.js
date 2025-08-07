// Script para corrigir imediatamente as permissões do usuário Zeca
(function () {
  console.log('🔧 Corrigindo permissões do usuário Zeca...');

  // Configurar usuário Zeca com todas as permissões
  const ZecaUser = {
    username: 'Zeca',
    name: 'Zeca',
    role: 'developer',
    permissions: ['read', 'write', 'delete', 'admin', 'manage_users']
  };

  // Limpar dados antigos
  localStorage.removeItem('beef-sync-user');
  localStorage.removeItem('beef_sync_user_name');
  localStorage.removeItem('beef_sync_user_role');
  localStorage.removeItem('beef_sync_user');

  // Configurar novos dados
  localStorage.setItem('beef-sync-user', JSON.stringify(ZecaUser));
  localStorage.setItem('beef_sync_user_name', 'Zeca');
  localStorage.setItem('beef_sync_user_role', 'Desenvolvedor');

  // Também salvar no formato alternativo se necessário
  localStorage.setItem('beef_sync_user', JSON.stringify({
    id: 1,
    name: 'Zeca',
    email: 'Zeca@beef-sync.com',
    role: 'developer'
  }));

  console.log('✅ Usuário Zeca configurado com sucesso!');
  console.log('📋 Dados salvos:', ZecaUser);
  console.log('🔄 Recarregue a página para aplicar as mudanças');

  // Forçar reload da página após 2 segundos
  setTimeout(() => {
    console.log('🔄 Recarregando página...');
    window.location.reload();
  }, 2000);
})();
