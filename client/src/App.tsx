import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import type { ReactNode } from 'react';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

// Componente para proteger el Dashboard
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

// Dashboard temporal para probar el flujo
const DashboardPlaceholder = () => {
  const { user, logout } = useAuth();
  return (
    <div style={{ padding: '20px'}}>
      <h1 style={{ lineHeight: 1.3 }}>Bienvenido, {user?.fullName} 🐌</h1>
      <p>Saldo actual: ${user?.balance}</p>
      <button onClick={logout}>Cerrar Sesión</button>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <DashboardPlaceholder />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
