import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { alerts } from "../utils/alerts";

export const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        await alerts.error(
          "Error de Autenticación",
          data.message || "Ha ocurrido un error durante el registro",
        );
        return;
      }

      await alerts.successWithTimer(
        "Registro exitoso.",
        "Ahora puedes iniciar sesión.",
        5000,
      );
      navigate("/login");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="card auth-card">
        <h2 className="auth-title">Registro Snail Race</h2>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            className="auth-input"
            type="text"
            placeholder="Nombre completo"
            required
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
          />
          <input
            className="auth-input"
            type="email"
            placeholder="Correo"
            required
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <input
            className="auth-input"
            type="password"
            placeholder="Contraseña"
            required
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <input
            className="auth-input"
            type="password"
            placeholder="Confirmar Contraseña"
            required
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
          />
          <button type="submit" className="primary-btn">
            Crear Cuenta
          </button>
        </form>
        <p className="auth-link">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
};
