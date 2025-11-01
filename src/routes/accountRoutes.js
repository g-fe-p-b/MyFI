import { Router } from 'express';
import { authenticateToken } from "../middlewares/authMiddleware.js";
const router = Router();
import { createAccount, getBalance, getAccountById, deleteAccount } from '../controllers/accountController.js';

router.post('/', authenticateToken, createAccount);
router.get('/:accountId/balance', authenticateToken, getBalance);
router.get('/:accountId', authenticateToken, getAccountById);
router.delete('/:accountId', authenticateToken, deleteAccount);
export default router;