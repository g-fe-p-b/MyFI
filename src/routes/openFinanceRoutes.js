const express = require('express');
const router = express.Routes();
const openFinanceController = require('../controllers/openFinanceController');

router.get('/customers/:customerId',);
router.get('/customers/:customerId/balance',);
router.get('/accounts/:accountId/balance',);
router.get('/accounts/:accountId/transactions',);
router.post('/consents',);
router.get('/consents/:id',);
router.delete('/consents/:id',);
module.exports = router;