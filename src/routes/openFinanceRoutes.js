import express from 'express';
const router = express.Router();

import openFinanceController from '../controllers/openFinanceController.js';
import { login } from '../controllers/customerController.js';
import authenticateToken from '../middlewares/authMiddleware.js';

router.use(authenticateToken);

router.get('/:connectionId/customers/:customerId', openFinanceController.getCustomerData.bind(openFinanceController));
router.get('/:connectionId/customers/:customerId/accounts', openFinanceController.getCustomerAccounts.bind(openFinanceController));
router.get('/:connectionId/accounts/:accountId/balance', openFinanceController.getAccountBalance.bind(openFinanceController));
router.get('/:connectionId/accounts/:accountId/transactions', openFinanceController.getAccountTransactions.bind(openFinanceController));

router.post('/consents', openFinanceController.createConsent.bind(openFinanceController));
router.get('/:connectionId/consents/:id', openFinanceController.getConsent.bind(openFinanceController));
router.delete('/consents/:id', openFinanceController.revokeConsent.bind(openFinanceController));
router.post('/login', login)

export default router;