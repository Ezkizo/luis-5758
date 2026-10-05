import path from 'path';
import { fileURLToPath } from 'url';
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

// Configuración para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === 'production') {
  // Apuntamos a la carpeta dist del cliente
  const clientBuildPath = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientBuildPath));

  // Redirige cualquier ruta no reconocida de la API al index.html de React
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

app.use(errorHandler);
// Arrancar el servidor
app.listen(env.PORT, () => {
  console.log(`Backend listo y escuchando en http://localhost:${env.PORT}`);
});