import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middlewares/errorHandler.js';

// Se cargan las variables de entorno desde el archivo .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors());
app.use(express.json()); // Permite recibir JSON en los req.body

// Endpoint de prueba (Healthcheck)
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'La API está funcionando correctamente' 
  });
});

app.use(errorHandler);
// Arrancar el servidor
app.listen(PORT, () => {
  console.log(`Backend listo y escuchando en http://localhost:${PORT}`);
});