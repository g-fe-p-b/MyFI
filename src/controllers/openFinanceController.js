import ConsentService from '../services/consentService.js';
import Consent from '../models/Consent.js';

/**
 * OpenFinanceController - Handles third-party data access via consents
 * All methods require valid x-api-key from approved consent
 */
class OpenFinanceController {

  /**
   * GET /open-finance/customers/:customerId
   * Retrieve customer basic information via consent
   * Requires: x-api-key header + consent with CUSTOMER_BASIC scope
   */
  async getCustomer(req, res) {
    try {
      const { customerId } = req.params;
      const apiKey = req.header('x-api-key') || req.query.apiKey;
      
      if (!apiKey) {
        return res.status(401).json({ error: 'API key required' });
      }

      // Find consent by API key to verify access
      const consent = await Consent.findOne({ apiKey });
      if (!consent) {
        return res.status(401).json({ error: 'Invalid API key' });
      }
      if (consent.customerId !== customerId) {
        return res.status(403).json({ error: 'Access denied - API key not for this customer' });
      }
      if (consent.status !== 'AUTHORIZED') {
        return res.status(403).json({ error: 'Consent not authorized' });
      }
      if (consent.expiresAt && new Date(consent.expiresAt) < new Date()) {
        return res.status(410).json({ error: 'Consent expired' });
      }
      if (!consent.scopes.includes('CUSTOMER_BASIC')) {
        return res.status(403).json({ error: 'Scope CUSTOMER_BASIC not granted' });
      }

      // Fetch data using existing ConsentService
      const data = await ConsentService.provideDataForConsent({ consentId: consent._id, apiKey });
      res.status(200).json(data);
    } catch (error) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      console.error('getCustomer error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * GET /open-finance/customers/:customerId/accounts
   * Retrieve customer accounts via consent
   * Requires: x-api-key header + consent with ACCOUNTS_READ scope
   */
  async getCustomerAccounts(req, res) {
    try {
      const { customerId } = req.params;
      const apiKey = req.header('x-api-key') || req.query.apiKey;
      
      if (!apiKey) {
        return res.status(401).json({ error: 'API key required' });
      }

      // Find consent by API key
      const consent = await Consent.findOne({ apiKey });
      if (!consent) {
        return res.status(401).json({ error: 'Invalid API key' });
      }
      if (consent.customerId !== customerId) {
        return res.status(403).json({ error: 'Access denied - API key not for this customer' });
      }
      if (consent.status !== 'AUTHORIZED') {
        return res.status(403).json({ error: 'Consent not authorized' });
      }
      if (consent.expiresAt && new Date(consent.expiresAt) < new Date()) {
        return res.status(410).json({ error: 'Consent expired' });
      }
      if (!consent.scopes.includes('ACCOUNTS_READ')) {
        return res.status(403).json({ error: 'Scope ACCOUNTS_READ not granted' });
      }

      // Fetch data using existing ConsentService
      const data = await ConsentService.provideDataForConsent({ consentId: consent._id, apiKey });
      res.status(200).json(data.accounts || []);
    } catch (error) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      console.error('getCustomerAccounts error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * GET /open-finance/accounts/:accountId/balance
   * Retrieve account balance via consent
   * Requires: x-api-key header + consent with ACCOUNTS_READ scope
   */
  async getAccountBalance(req, res) {
    try {
      const { accountId } = req.params;
      const apiKey = req.header('x-api-key') || req.query.apiKey;
      
      if (!apiKey) {
        return res.status(401).json({ error: 'API key required' });
      }

      // Find consent by API key
      const consent = await Consent.findOne({ apiKey });
      if (!consent) {
        return res.status(401).json({ error: 'Invalid API key' });
      }
      if (consent.status !== 'AUTHORIZED') {
        return res.status(403).json({ error: 'Consent not authorized' });
      }
      if (consent.expiresAt && new Date(consent.expiresAt) < new Date()) {
        return res.status(410).json({ error: 'Consent expired' });
      }
      if (!consent.scopes.includes('ACCOUNTS_READ')) {
        return res.status(403).json({ error: 'Scope ACCOUNTS_READ not granted' });
      }

      // Fetch data using existing ConsentService
      const data = await ConsentService.provideDataForConsent({ consentId: consent._id, apiKey });
      const account = data.accounts?.find(a => a.accountId === accountId);
      
      if (!account) {
        return res.status(404).json({ error: 'Account not found' });
      }

      res.status(200).json({ accountId: account.accountId, balance: account.balance });
    } catch (error) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      console.error('getAccountBalance error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * GET /open-finance/accounts/:accountId/transactions
   * Retrieve account transactions via consent
   * Requires: x-api-key header + consent with TRANSACTIONS_READ scope
   * Optional: startDate, endDate query parameters for filtering
   */
  async getAccountTransactions(req, res) {
    try {
      const { accountId } = req.params;
      const { startDate, endDate } = req.query;
      const apiKey = req.header('x-api-key') || req.query.apiKey;
      
      if (!apiKey) {
        return res.status(401).json({ error: 'API key required' });
      }

      // Find consent by API key
      const consent = await Consent.findOne({ apiKey });
      if (!consent) {
        return res.status(401).json({ error: 'Invalid API key' });
      }
      if (consent.status !== 'AUTHORIZED') {
        return res.status(403).json({ error: 'Consent not authorized' });
      }
      if (consent.expiresAt && new Date(consent.expiresAt) < new Date()) {
        return res.status(410).json({ error: 'Consent expired' });
      }
      if (!consent.scopes.includes('TRANSACTIONS_READ')) {
        return res.status(403).json({ error: 'Scope TRANSACTIONS_READ not granted' });
      }

      // Fetch data using existing ConsentService
      const data = await ConsentService.provideDataForConsent({ consentId: consent._id, apiKey });
      let transactions = data.transactions?.filter(t => t.accountId === accountId) || [];

      // Apply date filters if provided
      if (startDate) {
        const start = new Date(startDate);
        transactions = transactions.filter(t => new Date(t.date) >= start);
      }
      if (endDate) {
        const end = new Date(endDate);
        transactions = transactions.filter(t => new Date(t.date) <= end);
      }

      res.status(200).json(transactions);
    } catch (error) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      console.error('getAccountTransactions error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new OpenFinanceController();