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

  it('Debe devolver un error de sistema estructurado con CVV 999', async () => {
    const result = await processPayment({ ...baseRequest, cvv: '999' });
    
    expect(result.status).toBe('system_error');
    expect(result.status_detail).toContain('Error interno');
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('date_created');
  });
});