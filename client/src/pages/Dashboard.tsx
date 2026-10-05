import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { RechargeModal } from '../components/RechargeModal';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';

// Función para simular un día de carreras garantizando EXACTAMENTE 6 victorias en total
const generateDailyResults = () => {
  const snails = [
    { name: 'Snail Red', victorias: 0, color: '#ef4444' },
    { name: 'Snail Blue', victorias: 0, color: '#3b82f6' },
    { name: 'Snail Green', victorias: 0, color: '#10b981' },
    { name: 'Snail Yellow', victorias: 0, color: '#eab308' },
    { name: 'Snail Purple', victorias: 0, color: '#a855f7' },
    { name: 'Snail Pink', victorias: 0, color: '#ec4899' },
  ];

  // Se distribuyen 6 victorias al azar
  for (let i = 0; i < 6; i++) {
    const winnerIndex = Math.floor(Math.random() * 6);
    snails[winnerIndex].victorias += 1;
  }

  return snails;
};

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // useMemo para evitar que las gráficas cambien al abrir/cerrar el modal
  const dailyResults = useMemo(() => generateDailyResults(), []);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1>Snail Race</h1>
          <p>Bienvenido, {user?.fullName}</p>
        </div>
        <button onClick={logout} className="logout-btn">Cerrar Sesión</button>
      </header>

      <main className="dashboard-grid">
        {/* Tarjeta de Saldo */}
        <section className="card balance-card">
          <h2>Saldo Disponible</h2>
          <div className="balance-amount">${user?.balance?.toFixed(2) || '0.00'}</div>
          <button className="primary-btn" onClick={() => setIsModalOpen(true)}>
            + Recargar Saldo
          </button>
        </section>

        {/* Gráfica de Carreras del Día */}
        <section className="card chart-card">
          <h2>Resultados del día</h2>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={dailyResults} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{fill: '#6b7280', fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis tick={{fill: '#6b7280'}} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip cursor={{fill: '#f3f4f6'}} />
                <Legend />
                <Bar dataKey="victorias" name="Victorias del Día" radius={[4, 4, 0, 0]}>
                  {dailyResults.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

      </main>

      <RechargeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};