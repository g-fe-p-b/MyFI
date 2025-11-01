import { Router } from 'express';
import { authenticateToken } from "../middlewares/authMiddleware.js";
const router = Router();
import { create, getTransactionsByAccount, transferFunds } from '../controllers/transactionController.js';

router.post('/', authenticateToken, create);
router.get('/:accountId', authenticateToken, getTransactionsByAccount);
router.post('/transfer', authenticateToken, transferFunds);
export default router;