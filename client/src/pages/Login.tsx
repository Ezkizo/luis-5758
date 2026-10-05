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
      const res = await fetch('http://localhost:3000/api/auth/login', {
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
    <div style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h2>Iniciar Sesión en Snail Race</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input 
          type="email" placeholder="Correo electrónico" required 
          value={email} onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          type="password" placeholder="Contraseña" required 
          value={password} onChange={(e) => setPassword(e.target.value)} 
        />
        <button type="submit">Entrar</button>
      </form>
      <p>¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link></p>
    </div>
  );
};