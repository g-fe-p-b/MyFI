const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

router.post('/:accountId', transactionController.createTransaction);
router.get('/all/:accountId', transactionController.getAllTransactions);
router.get('/:accountId', transactionController.getTransactionsByAccount);
module.exports = router;