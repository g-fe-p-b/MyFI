import { Router } from 'express';
import { authenticateToken } from "../middlewares/authMiddleware.js";
const router = Router();
import { create, login, getAllCustomers, getCustomer, deleteCustomer } from '../controllers/customerController.js';

router.post('/', create);
router.post('/login', login);
router.get('/', authenticateToken, getAllCustomers);
router.get('/:customerId', authenticateToken, getCustomer);
router.delete('/:customerId', authenticateToken, deleteCustomer);
export default router;