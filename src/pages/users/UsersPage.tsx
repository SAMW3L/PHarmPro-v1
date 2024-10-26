import React from 'react';
import Layout from '../../components/Layout';
import { Plus, Search, Edit2, Ban } from 'lucide-react';
import { User } from '../../types';
import AddEditUserModal from '../../components/modals/AddEditUserModal';

export default function UsersPage() {
  const [users, setUsers] = React.useState<User[]>([
    {
      id: '1',
      username: 'admin',
      name: 'System Admin',
      email: 'admin@pharmacare.com',
      role: 'admin',
      active: true,
      lastLogin: '2024-03-15 10:30:00'
    }
  ]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<User | undefined>();

  const handleAddUser = (userData: Partial<User>) => {
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      active: true,
      lastLogin: null
    } as User;
    
    setUsers(prev => [...prev, newUser]);
  };

  const handleEditUser = (userData: Partial<User>) => {
    setUsers(prev =>
      prev.map(u => (u.id === selectedUser?.id ? { ...u, ...userData } : u))
    );
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers(prev =>
      prev.map(user =>
        user.id === userId ? { ...user, active: !user.active } : user
      )
    );
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeColor = (role: User['role']) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'pharmacist':
        return 'bg-blue-100 text-blue-800';
      case 'storekeeper':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
          <button 
            onClick={() => {
              setSelectedUser(undefined);
              setIsModalOpen(true);
            }}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add User
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.active ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLogin || 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button 
                      onClick={() => openEditModal(user)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleToggleUserStatus(user.id)}
                      className={`${user.active ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}`}
                    >
                      <Ban className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddEditUserModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUser(undefined);
        }}
        onSave={selectedUser ? handleEditUser : handleAddUser}
        user={selectedUser}
      />
    </Layout>
  );
}