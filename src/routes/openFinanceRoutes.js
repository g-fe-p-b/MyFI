import express from 'express';
const router = express.Router();

import openFinanceController from '../controllers/openFinanceController.js';
import apiKeyAuth from '../middlewares/apiKeyAuth.js';

/**
 * Open Finance Routes - Third-party data access
 * All data endpoints require API key from approved consent (x-api-key header)
 * Consent management endpoints are in /consents route
 */

// Customer data endpoints - protected with API key authentication
router.get('/customers/:customerId', apiKeyAuth, openFinanceController.getCustomer.bind(openFinanceController));
router.get('/customers/:customerId/accounts', apiKeyAuth, openFinanceController.getCustomerAccounts.bind(openFinanceController));
router.get('/accounts/:accountId/balance', apiKeyAuth, openFinanceController.getAccountBalance.bind(openFinanceController));
router.get('/accounts/:accountId/transactions', apiKeyAuth, openFinanceController.getAccountTransactions.bind(openFinanceController));

export default router;