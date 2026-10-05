import crypto from 'crypto';
import { AppError } from '../utils/AppError.js';

interface PaymentRequest {
  card_number: string;
  cvv: string;
  amount: number; 
  expiration_date: string;
  card_holder_name: string;
}

interface PaymentResponse {
  id: string;
  status: 'approved' | 'rejected';
  status_detail: string;
  transaction_amount: number;
  date_created: string;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const processPayment = async (data: PaymentRequest): Promise<PaymentResponse> => {
  // Simula latencia de red entre 1 y 2.5 segundos
  await delay(Math.random() * 1500 + 1000);

  // Trigger 1: Timeout / Caída (CVV 999)
  if (data.cvv === '999') {
    throw new AppError(504, 'Tiempo de espera agotado. No fue posible procesar la transacción');
  }

  // Trigger 2: Tarjeta Rechazada (CVV 000)
  if (data.cvv === '000') {
    return {
      id: crypto.randomUUID(),
      status: 'rejected',
      status_detail: 'Fondos insuficientes o tarjeta declinada',
      transaction_amount: data.amount,
      date_created: new Date().toISOString(),
    };
  }

  // Trigger 3: Aprobado (Cualquier otro CVV)
  return {
    id: crypto.randomUUID(),
    status: 'approved',
    status_detail: 'Aprobado',
    transaction_amount: data.amount,
    date_created: new Date().toISOString(),
  };
};