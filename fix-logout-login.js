// Script completo: Logout + Login + Acesso aos Usuários
console.log("🔄 CORREÇÃO COMPLETA - Logout e Login");
console.log("=====================================");

// Função para fazer logout completo
function doLogout() {
  console.log("🚪 Fazendo logout...");

  // Limpar todos os dados de autenticação
  localStorage.removeItem("beef-sync-user");
  localStorage.removeItem("beef_sync_user_name");
  localStorage.removeItem("beef_sync_user_role");
  localStorage.removeItem("beef_sync_user");

  // Limpar outros dados que possam interferir
  sessionStorage.clear();

  console.log("✅ Logout realizado com sucesso");
}

// Função para fazer login como Zeca
function doLogin() {
  console.log("🔑 Fazendo login como Zeca...");

  // Configurar dados do usuário Zeca
  const ZecaUser = {
    username: "Zeca",
    name: "Zeca",
    role: "developer",
    permissions: ["read", "write", "delete", "admin", "manage_users"],
  };

  // Salvar dados de autenticação
  localStorage.setItem("beef-sync-user", JSON.stringify(ZecaUser));
  localStorage.setItem("beef_sync_user_name", "Zeca");
  localStorage.setItem("beef_sync_user_role", "Desenvolvedor");

  console.log("✅ Login realizado como:", ZecaUser.name);
  console.log("🔐 Permissões:", ZecaUser.permissions.join(", "));
}

// Função para verificar se pode acessar usuários
function checkUserAccess() {
  console.log("🔍 Verificando acesso aos usuários...");

  const user = JSON.parse(localStorage.getItem("beef-sync-user") || "{}");

  if (!user.username) {
    console.log("❌ Usuário não encontrado");
    return false;
  }

  const hasPermission =
    user.permissions && user.permissions.includes("manage_users");
  console.log("👤 Usuário:", user.name);
  console.log(
    "🔐 Pode gerenciar usuários:",
    hasPermission ? "✅ SIM" : "❌ NÃO"
  );

  return hasPermission;
}

// Função para navegar para usuários
function goToUsers() {
  console.log("🚀 Navegando para página de usuários...");

  // Tentar diferentes formas de navegação
  try {
    // Opção 1: URL direta
    window.location.href = "/users";
  } catch (error) {
    console.log("❌ Erro na navegação:", error);

    // Opção 2: Reload e depois navegar
    setTimeout(() => {
      window.location.href = "/users";
    }, 1000);
  }
}

// Executar sequência completa
async function executeFullFix() {
  console.log("🚀 Iniciando correção completa...");

  // Passo 1: Logout
  doLogout();

  // Aguardar um pouco
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Passo 2: Login
  doLogin();

  // Aguardar um pouco
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Passo 3: Verificar acesso
  const canAccess = checkUserAccess();

  if (canAccess) {
    console.log("✅ CORREÇÃO CONCLUÍDA COM SUCESSO!");
    console.log("🔗 Redirecionando para página de usuários...");

    // Aguardar um pouco e navegar
    setTimeout(() => {
      goToUsers();
    }, 1000);
  } else {
    console.log("❌ ERRO: Ainda não foi possível configurar o acesso");
  }
}

// Executar a correção
executeFullFix();

console.log("=====================================");
console.log("📋 INSTRUÇÕES:");
console.log("1. Este script fará logout e login automaticamente");
console.log("2. Aguarde o redirecionamento para /users");
console.log("3. Se não funcionar, recarregue a página e tente novamente");
console.log("4. Ou navegue manualmente para: /users");
console.log("=====================================");
