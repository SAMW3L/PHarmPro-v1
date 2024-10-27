import React from 'react';
import { Menu, Package, BarChart, LogOut, ShoppingCart, Users, LayoutDashboard, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/', bgColor: 'hover:bg-blue-50 hover:text-blue-600' },
    { icon: Package, label: 'Inventory', path: '/inventory', bgColor: 'hover:bg-green-50 hover:text-green-600' },
    { icon: ShoppingCart, label: 'Sales', path: '/sales', bgColor: 'hover:bg-purple-50 hover:text-purple-600' },
    { icon: BarChart, label: 'Reports', path: '/reports', bgColor: 'hover:bg-orange-50 hover:text-orange-600' },
    { icon: Users, label: 'Users', path: '/users', adminOnly: true, bgColor: 'hover:bg-pink-50 hover:text-pink-600' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="bg-white shadow-sm fixed w-full z-10">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 lg:hidden"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="ml-4 text-xl font-semibold text-gray-900">PharmaCare</h1>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.role}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'block' : 'hidden'} lg:block fixed inset-y-0 left-0 top-16 w-64 bg-white border-r transition-all duration-300 ease-in-out z-20`}>
          <nav className="mt-5 px-2 space-y-1">
            {menuItems
              .filter(item => !item.adminOnly || user?.role === 'admin')
              .map((item) => {
                const isActive = isActivePath(item.path);
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`w-full group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors duration-150 ease-in-out
                      ${isActive 
                        ? 'bg-blue-50 text-blue-600' 
                        : `text-gray-600 ${item.bgColor}`}`}
                  >
                    <item.icon className="mr-4 h-6 w-6" />
                    {item.label}
                  </button>
                );
              })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 lg:pl-64 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}