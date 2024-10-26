import React from 'react';
import { Menu, Package, BarChart, LogOut, ShoppingCart, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { icon: Package, label: 'Inventory', path: '/inventory' },
    { icon: ShoppingCart, label: 'Sales', path: '/sales' },
    { icon: BarChart, label: 'Reports', path: '/reports' },
    { icon: Users, label: 'Users', path: '/users', adminOnly: true },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="ml-4 text-xl font-semibold text-gray-900">PharmaCare</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">{user?.name}</span>
              <button 
                onClick={handleLogout}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'block' : 'hidden'} md:block w-64 bg-white border-r`}>
          <nav className="mt-5 px-2">
            {menuItems
              .filter(item => !item.adminOnly || user?.role === 'admin')
              .map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="w-full group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  <item.icon className="mr-4 h-6 w-6" />
                  {item.label}
                </button>
              ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}