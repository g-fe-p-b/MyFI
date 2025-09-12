const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

router.post('/', customerController.createCustomer);
router.get('/', customerController.getAllCustomers);
router.get('/:customerId', customerController.getCustomerById);
router.delete('/:customerId', customerController.deleteCustomer);
module.exports = router;