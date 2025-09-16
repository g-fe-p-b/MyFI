const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

router.post('/new', transactionController.createTransaction);
router.get('/:accountId', transactionController.getTransactionsByAccount);
router.post('/transfer', transactionController.transferFunds);
module.exports = router;