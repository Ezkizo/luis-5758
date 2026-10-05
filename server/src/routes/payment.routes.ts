import { Router } from 'express';
import { getSuccessfulPayments, recharge } from '../controllers/payment.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

// Protegemos el endpoint con el middleware de JWT
router.use(requireAuth);
router.post('/recharge', recharge);
router.get('/history', getSuccessfulPayments);

export default router;