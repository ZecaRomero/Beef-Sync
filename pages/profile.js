import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { 
  UserIcon, 
  EnvelopeIcon, 
  ShieldCheckIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

export default function ProfilePage() {
  const { user, userRoles } = useAuth();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    role: '',
    description: ''
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Carregar dados do perfil
    const userRole = userRoles[user.username];
    if (userRole) {
      setProfileData({
        name: userRole.name,
        email: `${user.username}@beef-sync.com`,
        role: userRole.role === 'developer' ? 'Desenvolvedor' : 'Consultor',
        description: userRole.description
      });
    }
  }, [user, userRoles, router]);

  const handleSave = () => {
    // Aqui você salvaria os dados no backend
    console.log('Salvando perfil:', profileData);
    
    // Atualizar localStorage
    localStorage.setItem('beef_sync_user_name', profileData.name);
    
    setEditing(false);
    
    // Mostrar notificação de sucesso
    alert('Perfil atualizado com sucesso!');
  };

  const handleCancel = () => {
    // Restaurar dados originais
    const userRole = userRoles[user.username];
    if (userRole) {
      setProfileData({
        name: userRole.name,
        email: `${user.username}@beef-sync.com`,
        role: userRole.role === 'developer' ? 'Desenvolvedor' : 'Consultor',
        description: userRole.description
      });
    }
    setEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              👤 Meu Perfil
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Gerencie suas informações pessoais
            </p>
          </div>
          {!editing ? (
            <Button onClick={() => setEditing(true)} className="bg-blue-600 hover:bg-blue-700">
              <PencilIcon className="h-4 w-4 mr-2" />
              Editar Perfil
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                <CheckIcon className="h-4 w-4 mr-2" />
                Salvar
              </Button>
              <Button onClick={handleCancel} variant="outline">
                <XMarkIcon className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informações Principais */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserIcon className="h-5 w-5 mr-2" />
                  Informações Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome Completo</Label>
                  {editing ? (
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                      {profileData.name}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                    {profileData.email}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">O email não pode ser alterado</p>
                </div>

                <div>
                  <Label htmlFor="role">Função</Label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                    {profileData.role}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">A função é definida pelo administrador</p>
                </div>

                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                    {profileData.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Informações do Sistema */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShieldCheckIcon className="h-5 w-5 mr-2" />
                  Permissões
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {user.permissions?.map((permission) => (
                    <div key={permission} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {permission === 'read' && 'Visualizar'}
                        {permission === 'write' && 'Editar'}
                        {permission === 'delete' && 'Excluir'}
                        {permission === 'admin' && 'Administrador'}
                        {permission === 'manage_users' && 'Gerenciar Usuários'}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Estatísticas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Último login:</span>
                    <span className="text-sm font-medium">Hoje</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Conta criada:</span>
                    <span className="text-sm font-medium">2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                    <span className="text-sm font-medium text-green-600">Ativo</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}