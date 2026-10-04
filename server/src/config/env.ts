import dotenv from 'dotenv';

dotenv.config();

// Validación de variables de entorno críticas
if (!process.env.JWT_SECRET) {
  console.error('ERROR: Falta JWT_SECRET en las variables de entorno.');
  process.exit(1); // Detiene la ejecución
}

export const env = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET,
};