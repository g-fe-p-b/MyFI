import Consent from '../models/Consent.js';
import Customer from '../models/Customer.js';
import Account from '../models/Account.js';
import Transaction from '../models/Transaction.js';
import crypto from 'crypto';

class ConsentService {
  async createConsent({ customerId, requester, scopes, expiresAt }){
    if (!customerId || !requester || !requester.name || !Array.isArray(scopes) || scopes.length === 0) {
      const error = new Error('Missing required fields to create consent');
      error.statusCode = 400;
      throw error;
    }
    const customer = await Customer.findOne({ customerId });
    if (!customer) {
      const error = new Error('Customer not found');
      error.statusCode = 404;
      throw error;
    }
    const apiKey = crypto.randomBytes(24).toString('hex');
    const consent = new Consent({ customerId, requester, scopes, expiresAt, apiKey });
    await consent.save();
    // Return minimal info and apiKey for the requester
    return { consentId: consent._id || consent.consentId, apiKey, status: consent.status, expiresAt: consent.expiresAt };
  }

  async getConsentsForCustomer({ customerId, loggedInUser }){
    if (!loggedInUser || loggedInUser.cpf == null) {
      const error = new Error('Unauthorized'); error.statusCode = 401; throw error;
    }
    const customer = await Customer.findOne({ customerId });
    if (!customer) { const error = new Error('Customer not found'); error.statusCode = 404; throw error; }
    if (customer.cpf !== loggedInUser.cpf) { const error = new Error('Access denied'); error.statusCode = 403; throw error; }
    const consents = await Consent.find({ customerId }).sort({ createdAt: -1 });
    return consents;
  }

  async getConsentById({ consentId, loggedInUser }){
    const consent = await Consent.findOne({ _id: consentId }) || await Consent.findOne({ consentId });
    if(!consent){ const error = new Error('Consent not found'); error.statusCode = 404; throw error; }
    // only the customer who owns the consent can view full details
    if (loggedInUser){
      const customer = await Customer.findOne({ customerId: consent.customerId });
      if (!customer) { const error = new Error('Customer not found'); error.statusCode = 404; throw error; }
      if (customer.cpf !== loggedInUser.cpf){ const error = new Error('Access denied'); error.statusCode = 403; throw error; }
    }
    return consent;
  }

  async approveConsent({ consentId, customerId }){
    const consent = await Consent.findOne({ _id: consentId }) || await Consent.findOne({ consentId });
    if(!consent){ const error = new Error('Consent not found'); error.statusCode = 404; throw error; }
    if (consent.customerId !== customerId){ const error = new Error('Access denied'); error.statusCode = 403; throw error; }
    if (consent.status === 'AUTHORIZED'){ const error = new Error('Consent already authorized'); error.statusCode = 400; throw error; }
    consent.status = 'AUTHORIZED';
    consent.approvedBy = customerId;
    consent.approvedAt = new Date();
    await consent.save();
    return consent;
  }

  async rejectConsent({ consentId, customerId }){
    const consent = await Consent.findOne({ _id: consentId }) || await Consent.findOne({ consentId });
    if(!consent){ const error = new Error('Consent not found'); error.statusCode = 404; throw error; }
    if (consent.customerId !== customerId){ const error = new Error('Access denied'); error.statusCode = 403; throw error; }
    consent.status = 'REJECTED';
    consent.approvedBy = customerId;
    consent.approvedAt = new Date();
    await consent.save();
    return consent;
  }

  async revokeConsent({ consentId, customerId }){
    const consent = await Consent.findOne({ _id: consentId }) || await Consent.findOne({ consentId });
    if(!consent){ const error = new Error('Consent not found'); error.statusCode = 404; throw error; }
    if (consent.customerId !== customerId){ const error = new Error('Access denied'); error.statusCode = 403; throw error; }
    consent.status = 'REVOKED';
    await consent.save();
    return consent;
  }

  async provideDataForConsent({ consentId, apiKey }){
    const consent = await Consent.findOne({ _id: consentId }) || await Consent.findOne({ consentId });
    if(!consent){ const error = new Error('Consent not found'); error.statusCode = 404; throw error; }
    if (consent.apiKey !== apiKey){ const error = new Error('Invalid api key'); error.statusCode = 401; throw error; }
    if (consent.status !== 'AUTHORIZED') { const error = new Error('Consent not authorized'); error.statusCode = 403; throw error; }
    if (consent.expiresAt && new Date(consent.expiresAt) < new Date()){ const error = new Error('Consent expired'); error.statusCode = 410; throw error; }
    // Build response according to scopes
    const response = {};
    const customer = await Customer.findOne({ customerId: consent.customerId }).lean();
    if (!customer) { const error = new Error('Customer not found'); error.statusCode = 404; throw error; }
    if (consent.scopes.includes('CUSTOMER_BASIC')){
      response.customer = { customerId: customer.customerId, name: customer.name, email: customer.email, cpf: customer.cpf };
    }
    if (consent.scopes.includes('ACCOUNTS_READ') || consent.scopes.includes('TRANSACTIONS_READ')){
      const accounts = await Account.find({ customerId: consent.customerId }).lean();
      if (consent.scopes.includes('ACCOUNTS_READ')){
        response.accounts = accounts.map(a => ({ accountId: a.accountId, accountType: a.accountType, branch: a.branch, accountNumber: a.accountNumber, balance: a.balance }));
      }
      if (consent.scopes.includes('TRANSACTIONS_READ')){
        const accountIds = accounts.map(a => a.accountId);
        const transactions = await Transaction.find({ accountId: { $in: accountIds } }).lean();
        response.transactions = transactions;
      }
    }
    return response;
  }
}

export default new ConsentService();
