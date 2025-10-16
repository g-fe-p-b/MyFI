const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register', authMiddleware.registerCustomer);
router.post('/login', authMiddleware.logingCustumer);