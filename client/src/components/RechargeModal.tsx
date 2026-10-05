import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { alerts } from "../utils/alerts";

interface RechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RechargeModal = ({ isOpen, onClose }: RechargeModalProps) => {
  const { token, updateBalance, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    cardNumber: "",
    expirationDate: "",
    cvv: "",
    cardHolderName: user?.fullName || "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/payments/recharge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: Number(formData.amount),
          cardNumber: formData.cardNumber,
          expirationDate: formData.expirationDate,
          cvv: formData.cvv,
          cardHolderName: formData.cardHolderName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        await alerts.error(
          "Error en la recarga",
          data.message || "La transacción fue rechazada",
        );
        return;
      }

      if (data.transaction.status === "rejected") {
        setLoading(false);
        await alerts.error(
          "Recarga Rechazada",
          `La recarga de $${formData.amount} fue rechazada. \nMotivo: ${data.transaction.status_detail}`,
        );
        return;
      }

      updateBalance(data.newBalance);
      alerts.success(
        "¡Recarga Exitosa!",
        `Se han añadido $${formData.amount} a tu cuenta.`,
      );
      onClose();
    } catch (error) {
      alerts.error(
        "Error de red",
        "No se pudo conectar con la pasarela de pagos.",
      );
    } finally {
      setLoading(false);
      setFormData({
        amount: "",
        cardNumber: "",
        expirationDate: "",
        cvv: "",
        cardHolderName: user?.fullName || "",
      });
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 1. Quitar todo lo que no sea número
    let value = e.target.value.replace(/\D/g, "");
    // 2. Insertar la diagonal después del segundo dígito
    if (value.length > 2) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4);
    }
    setFormData({ ...formData, expirationDate: value });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Recargar Saldo</h3>
          <button onClick={onClose} className="close-btn">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Monto a recargar ($)</label>
            <input
              type="number"
              min="1"
              required
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Nombre en la tarjeta</label>
            <input
              type="text"
              required
              value={formData.cardHolderName}
              onChange={(e) =>
                setFormData({ ...formData, cardHolderName: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Número de Tarjeta</label>
            <input
              type="text"
              maxLength={16}
              pattern="\d{15,16}"
              inputMode="numeric"
              placeholder="16 dígitos"
              required
              value={formData.cardNumber}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  cardNumber: e.target.value.replace(/\D/g, "").slice(0, 16),
                })
              }
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Expiración</label>
              <input
                type="text"
                placeholder="MM/AA"
                maxLength={5}
                pattern="(?:0[1-9]|1[0-2])\/\d{2}"
                required
                value={formData.expirationDate}
                onChange={handleDateChange}
                onInput={(e) => {
                  const input = e.currentTarget;
                  input.setCustomValidity(
                    input.validity.valueMissing
                      ? ""
                      : input.validity.patternMismatch
                        ? "Ingresa una fecha válida con el formato MM/AA. El mes debe estar entre 01 y 12."
                        : "",
                  );
                }}
              />
            </div>
            <div className="form-group">
              <label>CVV</label>
              <input
                type="text"
                pattern="\d{3,4}"
                inputMode="numeric"
                maxLength={4}
                required
                value={formData.cvv}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    cvv: e.target.value.replace(/\D/g, "").slice(0, 4),
                  })
                }
                onInput={(e) => {
                  const input = e.currentTarget;
                  input.setCustomValidity(
                    input.validity.valueMissing
                      ? ""
                      : input.validity.patternMismatch
                        ? "Ingresa un CVV válido con 3 o 4 dígitos."
                        : "",
                  );
                }}
              />
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Procesando..." : "Pagar ahora"}
          </button>
        </form>
      </div>
    </div>
  );
};
