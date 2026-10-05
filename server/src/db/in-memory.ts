import crypto from 'crypto';
import { AppError } from '../utils/AppError.js';

export interface User {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  balance: number;
}

export interface Transaction {
  id: string;
  status: 'approved' | 'rejected';
  status_detail: string;
  transaction_amount: number;
  date_created: string;
  authorization_code?: string;
  reference: string;
  payer_id: string;
  payer_email: string;
  card_last_four: string;
}

const users: User[] = [];
const transactions: Transaction[] = [];

export const db = {
  // --- USERS ---
  createUser: (userData: Omit<User, 'id' | 'balance'>): User => {
    const newUser: User = {
      ...userData,
      id: crypto.randomUUID(),
      balance: 0, 
    };
    users.push(newUser);
    return newUser;
  },

  findUserByEmail: (email: string): User | undefined => {
    return users.find(u => u.email === email);
  },

  findUserById: (id: string): User | undefined => {
    return users.find(u => u.id === id);
  },

  updateUserBalance: (userId: string, amountToAdd: number): number => {
    const user = users.find(u => u.id === userId);
    if (!user) throw new AppError(404, 'Usuario no encontrado');
    
    user.balance += amountToAdd;
    return user.balance;
  },

  // --- TRANSACTIONS ---
  saveTransaction: (txData: Transaction): Transaction => {
    transactions.push(txData);
    return txData;
  },

  getUserTransactions: (userId: string): Transaction[] => {
    return transactions
      .filter(tx => tx.payer_id === userId && tx.status === 'approved')
      .sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime());
  }
};