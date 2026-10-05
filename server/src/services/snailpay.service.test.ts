import { describe, it, expect } from 'vitest';
import { processPayment } from './snailpay.service.js';
import { AppError } from '../utils/AppError.js';

describe('SnailPay Service', () => {
  const baseRequest = {
    card_number: '4111111111111111',
    amount: 500,
    expiration_date: '12/28',
    card_holder_name: 'Luis F'
  };

  it('Debe aprobar la transacción con un CVV estándar', async () => {
    const result = await processPayment({ ...baseRequest, cvv: '123' });
    
    expect(result.status).toBe('approved');
    expect(result.transaction_amount).toBe(500);
    expect(result.status_detail).toBe('Aprobado');
    expect(result).toHaveProperty('id');
  });

  it('Debe rechazar la transacción con CVV 000 (Fondos insuficientes)', async () => {
    const result = await processPayment({ ...baseRequest, cvv: '000' });
    
    expect(result.status).toBe('rejected');
    expect(result.transaction_amount).toBe(500);
    expect(result.status_detail).toContain('Fondos insuficientes');
  });

  it('Debe lanzar un error 504 (Gateway Timeout) con CVV 999', async () => {
    // Se verifica que la promesa sea rechazada y lance error
    await expect(processPayment({ ...baseRequest, cvv: '999' })).rejects.toThrow(AppError);
    
    // Captura del error para validar el código HTTP exacto
    try {
      await processPayment({ ...baseRequest, cvv: '999' });
    } catch (error: any) {
      expect(error.statusCode).toBe(504);
      expect(error.message).toContain('Tiempo de espera agotado');
    }
  });
});