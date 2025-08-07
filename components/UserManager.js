import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useAuth } from '../contexts/AuthContext';
import { 
  UserIcon, 
  ShieldCheckIcon, 
  EyeIcon, 
  PencilIcon,
  TrashIcon,
  PlusIcon,
  LockClosedIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const UserManager = () => {
  const { user, userRoles, checkPermission } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    name: '',
    role: 'consultant',
    permissions: ['read']
  });

  const handleAddUser = () => {
    if (newUser.username && newUser.name) {
      // Em uma implementação real, salvaria no backend
      console.log('Novo usuário:', newUser);
      setShowAddUser(false);
      setNewUser({ username: '', name: '', role: 'consultant', permissions: ['read'] });
    }
  };

  const handleDeleteUser = (username) => {
    if (confirm(`Tem certeza que deseja excluir o usuário ${username}?`)) {
      console.log('Usuário excluído:', username);
    }
  };

  const handleEditUser = (username) => {
    setSelectedUser(username);
  };

  const canManageUsers = checkPermission('manage_users');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            👥 Gerenciamento de Usuários
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Controle de acesso e permissões do sistema
          </p>
        </div>
        {canManageUsers && (
          <Button onClick={() => setShowAddUser(true)} className="bg-blue-600 hover:bg-blue-700">
            <PlusIcon className="h-4 w-4 mr-2" />
            Adicionar Usuário
          </Button>
        )}
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {Object.keys(userRoles).length}
              </div>
              <div className="text-sm text-blue-800 dark:text-blue-200">Total de Usuários</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {Object.values(userRoles).filter(u => u.role === 'developer').length}
              </div>
              <div className="text-sm text-green-800 dark:text-green-200">Desenvolvedores</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {Object.values(userRoles).filter(u => u.role === 'consultant').length}
              </div>
              <div className="text-sm text-purple-800 dark:text-purple-200">Consultores</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {user?.name || 'N/A'}
              </div>
              <div className="text-sm text-orange-800 dark:text-orange-200">Usuário Atual</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Usuários */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserGroupIcon className="h-5 w-5 mr-2" />
            Usuários do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(userRoles).map(([username, userData]) => (
              <div
                key={username}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedUser === username
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
                onClick={() => setSelectedUser(selectedUser === username ? null : username)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        {userData.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        @{username}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {userData.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={userData.role === 'developer' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {userData.role === 'developer' ? 'Desenvolvedor' : 'Consultor'}
                    </Badge>
                    
                    {canManageUsers && username !== 'zeca' && (
                      <div className="flex space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditUser(username);
                          }}
                          className="h-6 w-6 p-0"
                        >
                          <PencilIcon className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteUser(username);
                          }}
                          className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                        >
                          <TrashIcon className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Detalhes expandidos */}
                {selectedUser === username && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">
                          Permissões:
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {userData.permissions.map((permission) => (
                            <Badge key={permission} variant="outline" className="text-xs">
                              {permission}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">
                          Ações:
                        </h4>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <EyeIcon className="h-3 w-3 mr-1" />
                            Ver Detalhes
                          </Button>
                          {canManageUsers && (
                            <Button size="sm" variant="outline">
                              <PencilIcon className="h-3 w-3 mr-1" />
                              Editar
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal Adicionar Usuário */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Adicionar Novo Usuário</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="username">Nome de Usuário</Label>
                <Input
                  id="username"
                  value={newUser.username}
                  onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                  placeholder="ex: joao"
                />
              </div>
              
              <div>
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  placeholder="João Silva"
                />
              </div>
              
              <div>
                <Label htmlFor="role">Função</Label>
                <select
                  id="role"
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                >
                  <option value="consultant">Consultor</option>
                  <option value="developer">Desenvolvedor</option>
                </select>
              </div>
              
              <div className="flex space-x-2">
                <Button onClick={handleAddUser} className="flex-1">
                  Adicionar
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddUser(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default UserManager;