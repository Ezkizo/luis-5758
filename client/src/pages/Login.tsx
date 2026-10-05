import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { alerts } from '../utils/alerts';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok)
      {
        await alerts.error('Error de Autenticación', data.message || 'Ha ocurrido un error');
        return;
      }

      login(data.token, data.user);
      navigate('/'); // Redirigir al dashboard
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="card auth-card">
        <h2 className="auth-title">Iniciar Sesión en Snail Race</h2>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <input 
            className="auth-input"
            type="email" 
            placeholder="Correo electrónico" 
            required 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <input 
            className="auth-input"
            type="password" 
            placeholder="Contraseña" 
            required 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <button type="submit" className="primary-btn">Iniciar Sesión</button>
        </form>
        <p className="auth-link">¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link></p>
      </div>
    </div>
  );
};