import ConsentService from '../services/consentService.js';
import Customer from '../models/Customer.js';

/**
 * Helper: Derive customerId from JWT token
 * Used by all customer-authenticated consent endpoints
 */
async function getCustomerIdFromToken(user) {
  const customerCpf = user && user.cpf;
  if (!customerCpf) {
    const error = new Error('Unauthorized');
    error.statusCode = 401;
    throw error;
  }
  const customer = await Customer.findOne({ cpf: customerCpf });
  if (!customer) {
    const error = new Error('Customer not found');
    error.statusCode = 404;
    throw error;
  }
  return customer.customerId;
}

export async function requestConsent(req, res){
  try{
    const payload = req.body;
    const result = await ConsentService.createConsent(payload);
    res.status(201).json({ message: 'Consent request created', consent: result });
  } catch (error){
    if (error.statusCode) return res.status(error.statusCode).json({ message: error.message });
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

export async function listCustomerConsents(req, res){
  try{
    const customerId = await getCustomerIdFromToken(req.user);
    const consents = await ConsentService.getConsentsForCustomer({ customerId, loggedInUser: req.user });
    res.status(200).json({ consents });
  } catch (error){
    if (error.statusCode) return res.status(error.statusCode).json({ message: error.message });
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

export async function approveConsent(req, res){
  try{
    const { consentId } = req.params;
    const customerId = await getCustomerIdFromToken(req.user);
    const consent = await ConsentService.approveConsent({ consentId, customerId });
    res.status(200).json({ message: 'Consent approved', consent });
  } catch (error){
    if (error.statusCode) return res.status(error.statusCode).json({ message: error.message });
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

export async function rejectConsent(req, res){
  try{
    const { consentId } = req.params;
    const customerId = await getCustomerIdFromToken(req.user);
    const consent = await ConsentService.rejectConsent({ consentId, customerId });
    res.status(200).json({ message: 'Consent rejected', consent });
  } catch (error){
    if (error.statusCode) return res.status(error.statusCode).json({ message: error.message });
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

export async function revokeConsent(req, res){
  try{
    const { consentId } = req.params;
    const customerId = await getCustomerIdFromToken(req.user);
    const consent = await ConsentService.revokeConsent({ consentId, customerId });
    res.status(200).json({ message: 'Consent revoked', consent });
  } catch (error){
    if (error.statusCode) return res.status(error.statusCode).json({ message: error.message });
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

export async function fetchDataForConsent(req, res){
  try{
    const { consentId } = req.params;
    // API key provided by requester
    const apiKey = req.header('x-api-key') || req.query.apiKey;
    if (!apiKey) return res.status(401).json({message: 'API key required'});
    const data = await ConsentService.provideDataForConsent({ consentId, apiKey });
    res.status(200).json({ data });
  } catch (error){
    if (error.statusCode) return res.status(error.statusCode).json({ message: error.message });
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

export default { requestConsent, listCustomerConsents, approveConsent, rejectConsent, revokeConsent, fetchDataForConsent };