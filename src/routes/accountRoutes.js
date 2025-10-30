import { Router } from 'express';
const router = Router();
import { createAccount, getBalance, getAccountById, deleteAccount } from '../controllers/accountController.js';

router.post('/', createAccount);
router.get('/:accountId/balance', getBalance);
router.get('/:accountId', getAccountById);
router.delete('/:accountId', deleteAccount);
export default router;