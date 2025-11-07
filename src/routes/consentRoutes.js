import { Router } from 'express';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import {
  requestConsent,
  listCustomerConsents,
  approveConsent,
  rejectConsent,
  revokeConsent,
  fetchDataForConsent
} from '../controllers/consentController.js';

const router = Router();

// Third-party requests consent (returns consent id + apiKey to requester)
router.post('/request', requestConsent);

// Customer views their consents (customerId inferred from token)
router.get('/customer', authenticateToken, listCustomerConsents);

// Customer approves a consent
router.post('/:consentId/approve', authenticateToken, approveConsent);
router.post('/:consentId/reject', authenticateToken, rejectConsent);
router.post('/:consentId/revoke', authenticateToken, revokeConsent);

// Third-party fetches data (must provide x-api-key header returned at creation)
router.get('/:consentId/data', fetchDataForConsent);

export default router;
