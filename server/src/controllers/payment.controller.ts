import { Request, Response } from "express";
import { processPayment } from "../services/snailpay.service.js";
import { db } from "../db/in-memory.js";
import { AppError } from "../utils/AppError.js";

export const recharge = async (req: Request, res: Response) => {
  const { amount, cardNumber, cvv, expirationDate, cardHolderName } = req.body;
  const { id: userId, email } = res.locals.user as {
    id: string;
    email: string;
  };

  // Validación
  if (!amount || !cardNumber || !cvv || !expirationDate || !cardHolderName) {
    throw new AppError(
      400,
      "Todos los datos de la tarjeta y el monto son obligatorios",
    );
  }

  if (amount <= 0) throw new AppError(400, "El monto debe ser mayor a 0");

  // Llamamos a SnailPay pasándole su trigger (cvv)
  const snailPayResponse = await processPayment({
    card_number: cardNumber,
    cvv,
    amount,
    expiration_date: expirationDate,
    card_holder_name: cardHolderName,
  });

  // 2. Guardar transacción (Solo guardamos los últimos 4 dígitos por seguridad)
  const savedTx = db.saveTransaction({
    id: snailPayResponse.id,
    status: snailPayResponse.status,
    status_detail: snailPayResponse.status_detail,
    transaction_amount: snailPayResponse.transaction_amount,
    date_created: snailPayResponse.date_created,
    reference: `RECHARGE-${Date.now()}`,
    payer_id: userId,
    payer_email: email,
    card_last_four: cardNumber.slice(-4),
  });

  // 3. Actualizar saldo solo si fue aprobada
  let currentBalance = db.findUserById(userId)?.balance || 0;
  if (snailPayResponse.status === "approved") {
    currentBalance = db.updateUserBalance(userId, amount);
  }

  // 4. Se devuelve la respuesta con lo guardado + datos sensibles en tránsito
  res.status(200).json({
    transaction: {
      ...savedTx,
      cardNumber,
      cvv,
    },
    newBalance: currentBalance,
  });
};
