import express, { Request, Response } from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { errorHandler } from './middlewares/errorHandler.js';
import authRoutes from './routes/auth.routes.js';
import paymentRoutes from './routes/payment.routes.js';

const app = express();

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

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);

app.use(errorHandler);
// Arrancar el servidor
app.listen(env.PORT, () => {
  console.log(`Backend listo y escuchando en http://localhost:${env.PORT}`);
});