import ConsentService from '../services/consentService.js';
import Customer from '../models/Customer.js';

export async function requestConsent(req, res){
  try{
    const payload = req.body;
    const result = await ConsentService.createConsent(payload);
    // Return apiKey to the requester so they can fetch data later
    res.status(201).json({ message: 'Consent request created', consent: result });
  } catch (error){
    if (error.statusCode) return res.status(error.statusCode).json({ message: error.message });
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

export async function listCustomerConsents(req, res){
  try{
    // derive customerId from token
    const customerCpf = req.user && req.user.cpf;
    if (!customerCpf) return res.status(401).json({ message: 'Unauthorized' });
    const customer = await Customer.findOne({ cpf: customerCpf });
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    const customerId = customer.customerId;
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
    // derive customerId from logged user (token contains cpf)
    const customerCpf = req.user && req.user.cpf;
    if (!customerCpf) return res.status(401).json({ message: 'Unauthorized' });
    const customer = await Customer.findOne({ cpf: customerCpf });
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    const customerId = customer.customerId;
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
    const customerCpf = req.user && req.user.cpf;
    if (!customerCpf) return res.status(401).json({ message: 'Unauthorized' });
    const customer = await Customer.findOne({ cpf: customerCpf });
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    const customerId = customer.customerId;
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
    const customerCpf = req.user && req.user.cpf;
    if (!customerCpf) return res.status(401).json({ message: 'Unauthorized' });
    const customer = await Customer.findOne({ cpf: customerCpf });
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    const customerId = customer.customerId;
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
