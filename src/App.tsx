import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import InventoryPage from './pages/inventory/InventoryPage';
import SalesPage from './pages/sales/SalesPage';
import ReportsPage from './pages/reports/ReportsPage';
import UsersPage from './pages/users/UsersPage';
import { useAuth } from './context/AuthContext';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

        <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/inventory"
            element={
              <PrivateRoute>
                <InventoryPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/sales"
            element={
              <PrivateRoute>
                <SalesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <PrivateRoute>
                <ReportsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/users"
            element={
              <PrivateRoute>
                <UsersPage />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}