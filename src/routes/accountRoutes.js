const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

router.post('/:customerId', accountController.createAccount);
router.get('/:accountId/balance', accountController.getBalance);
router.get('/:accountId', accountController.getAccountById);

module.exports = router;