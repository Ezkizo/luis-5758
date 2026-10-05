import { useState, useMemo, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { RechargeModal } from "../components/RechargeModal";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
  PieChart,
  Pie,
} from "recharts";

// 1. Se generan los resultados del día 6 carreras 6 primeras posiciones aleatorias
const generateDailyResults = () => {
  const snails = [
    { name: "Snail Red", victorias: 0, color: "#ef4444" },
    { name: "Snail Blue", victorias: 0, color: "#3b82f6" },
    { name: "Snail Green", victorias: 0, color: "#10b981" },
    { name: "Snail Yellow", victorias: 0, color: "#eab308" },
    { name: "Snail Purple", victorias: 0, color: "#a855f7" },
    { name: "Snail Pink", victorias: 0, color: "#ec4899" },
  ];

  for (let i = 0; i < 6; i++) {
    const winnerIndex = Math.floor(Math.random() * 6);
    snails[winnerIndex].victorias += 1;
  }
  return snails;
};

// 2. Simula las apuestas del usuario
const generateBets = () => {
  const ganadas = Math.floor(Math.random() * 7); // 0 a 6
  const perdidas = 6 - ganadas;

  return [
    { name: "Ganadas", value: ganadas },
    { name: "Perdidas", value: perdidas },
  ];
};

const DONUT_COLORS = ["#10b981", "#ef4444"];

export const Dashboard = () => {
  const { user, token, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);

  // Memorizamos resultados del día y apuestas simuladas
  const dailyResults = useMemo(() => generateDailyResults(), []);
  const donutData = useMemo(() => generateBets(), []);

  // Fetch al endpoint,se vuelve a ejecutar si el balance cambia/recarga
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/payments/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.status === "success") {
          // Mapeamos las recargas
          const recharges = data.data.map((tx: any) => ({
            id: tx.id,
            date_created: tx.date_created,
            description: `Recarga SnailPay (Terminación ${tx.card_last_four})`,
            amount: tx.transaction_amount,
            type: "credit",
          }));
          setTransactions(recharges);
        }
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };
    fetchHistory();
  }, [token, user?.balance]);

  // Si tiene al menos una recarga, se muestra el donut de apuestas y el historial de recargas.
  const hasRecharged = transactions.length > 0;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1>Snail Race</h1>
          <p>Bienvenido, {user?.fullName}</p>
        </div>
        <button onClick={logout} className="logout-btn">
          Cerrar Sesión
        </button>
      </header>

      <main className="dashboard-grid">
        <section className="card balance-card">
          <h2>Saldo Disponible</h2>
          <div className="balance-amount">
            ${user?.balance?.toFixed(2) || "0.00"}
          </div>
          <button className="primary-btn" onClick={() => setIsModalOpen(true)}>
            + Recargar Saldo
          </button>
        </section>

        <section className="card chart-card">
          <h2>Resultados del día</h2>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <BarChart
                data={dailyResults}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e5e7eb"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip cursor={{ fill: "#f3f4f6" }} />
                <Legend />
                <Bar
                  dataKey="victorias"
                  name="Victorias del Día"
                  radius={[4, 4, 0, 0]}
                >
                  {dailyResults.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* --- RENDERIZADO CONDICIONAL --- */}
        {!hasRecharged ? (
          <section
            className="card empty-state-card"
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "40px",
            }}
          >
            <h2>Aún no tienes actividad</h2>
            <p style={{ color: "#6b7280", marginBottom: "20px" }}>
              Haz tu primer recarga para participar en las carreras de
              caracoles y ver tus estadísticas.
            </p>
            <button
              className="primary-btn"
              style={{ maxWidth: "200px" }}
              onClick={() => setIsModalOpen(true)}
            >
              Hacer mi primera recarga
            </button>
          </section>
        ) : (
          <>
            <section className="card chart-card">
              <h2>Mis Apuestas de Hoy</h2>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={donutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={110}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {donutData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={DONUT_COLORS[index % DONUT_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip cursor={{ fill: "#f3f4f6" }} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="card history-card">
              <h2>Historial de Recargas</h2>
              <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginTop: "10px",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        borderBottom: "2px solid #e5e7eb",
                        textAlign: "left",
                        position: "sticky",
                        top: 0,
                        background: "white",
                      }}
                    >
                      <th style={{ padding: "10px" }}>Descripción</th>
                      <th style={{ padding: "10px", textAlign: "right" }}>
                        Monto
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr
                        key={tx.id}
                        style={{ borderBottom: "1px solid #f3f4f6" }}
                      >
                        <td
                          style={{ padding: "12px 10px", fontSize: "0.9rem" }}
                        >
                          {tx.description}
                        </td>
                        <td
                          style={{
                            padding: "12px 10px",
                            textAlign: "right",
                            fontWeight: "bold",
                            color: tx.type === "credit" ? "#10b981" : "#ef4444",
                          }}
                        >
                          {tx.type === "credit" ? "+" : ""}$
                          {Math.abs(tx.amount).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>

      <RechargeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
