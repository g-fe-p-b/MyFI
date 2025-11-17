import Consent from '../models/Consent.js';

/**
 * API Key Authentication Middleware
 * Validates x-api-key header against consent API keys in database
 */
export default async function apiKeyAuth(req, res, next) {
  try {
    // Prefer x-api-key header
    let apiKey = req.header('x-api-key');
    // Fallbacks for compatibility/testing
    if (!apiKey) apiKey = req.header('API_KEY');
    if (!apiKey) apiKey = req.query.apiKey;

    if (!apiKey) return res.status(401).json({ message: 'API key required' });

    const consent = await Consent.findOne({ apiKey });
    if (!consent) return res.status(401).json({ message: 'Invalid api key' });
    if (consent.status !== 'AUTHORIZED') return res.status(403).json({ message: 'Consent not authorized' });
    if (consent.expiresAt && new Date(consent.expiresAt) < new Date()) return res.status(410).json({ message: 'Consent expired' });

    req.consent = consent;
    next();
  } catch (err) {
    console.error('apiKeyAuth error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}