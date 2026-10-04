import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/in-memory.js';
import { AppError } from '../utils/AppError.js';
import { env } from '../config/env.js';

export const register = async (req: Request, res: Response) => {
  const { fullName, email, password, confirmPassword } = req.body;

  // 1. Validaciones básicas
  if (!fullName || !email || !password || !confirmPassword) {
    throw new AppError(400, 'Todos los campos son obligatorios');
  }
  if (password !== confirmPassword) {
    throw new AppError(400, 'Las contraseñas no coinciden');
  }
  if (db.findUserByEmail(email)) {
    throw new AppError(409, 'El correo ya está registrado');
  }

  // 2. Seguridad: Hashing de contraseñas con bcrypt y salt.
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  // 3. Persistencia
  const newUser = db.createUser({ fullName, email, passwordHash });

  // 4. Limpieza del payload (Un presenter rápido)
  const { passwordHash: _, ...userResponse } = newUser;

  res.status(201).json({
    message: 'Usuario registrado exitosamente',
    user: userResponse
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError(400, 'Correo y contraseña son obligatorios');
  }

  const user = db.findUserByEmail(email);
  if (!user) {
    throw new AppError(401, 'Credenciales inválidas');
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isValidPassword) {
    throw new AppError(401, 'Credenciales inválidas');
  }

  // Generar token stateless para identificar al usuario en las recargas
  const token = jwt.sign({ id: user.id, email: user.email }, env.JWT_SECRET, {
    expiresIn: '8h' 
  });

  const { passwordHash: _, ...userResponse } = user;

  res.status(200).json({
    token,
    user: userResponse
  });
};