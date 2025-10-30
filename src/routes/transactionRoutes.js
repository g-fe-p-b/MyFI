import { Router } from 'express';
const router = Router();
import { create, getTransactionsByAccount, transferFunds } from '../controllers/transactionController.js';

router.post('/', create);
router.get('/:accountId', getTransactionsByAccount);
router.post('/transfer', transferFunds);
export default router;