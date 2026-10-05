import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { alerts } from '../utils/alerts';

export const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '', email: '', password: '', confirmPassword: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok){
        await alerts.error('Error de Autenticación', data.message || 'Ha ocurrido un error durante el registro');
        console.log('Se ejecuta después del alert, gracias al await');
        return;
      } 

      await alerts.successWithTimer('Registro exitoso.', 'Ahora puedes iniciar sesión.', 5000);
      navigate('/login');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h2>Registro Snail Race</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input 
          type="text" placeholder="Nombre completo" required 
          onChange={(e) => setFormData({...formData, fullName: e.target.value})} 
        />
        <input 
          type="email" placeholder="Correo" required 
          onChange={(e) => setFormData({...formData, email: e.target.value})} 
        />
        <input 
          type="password" placeholder="Contraseña" required 
          onChange={(e) => setFormData({...formData, password: e.target.value})} 
        />
        <input 
          type="password" placeholder="Confirmar Contraseña" required 
          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} 
        />
        <button type="submit">Registrarse</button>
      </form>
      <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
    </div>
  );
};