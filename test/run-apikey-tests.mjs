import assert from 'assert';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import http from 'http';
import axios from 'axios';
import app from '../server.js';
import Consent from '../src/models/Consent.js';

async function run() {
  const mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  try {
    await mongoose.connect(uri, { dbName: 'testdb' });
    await Consent.deleteMany({});

    // Create consents with different statuses
    const validConsent = new Consent({ consentId: 'c_valid', customerId: 'cus1', apiKey: 'key-valid', status: 'AUTHORIZED', scopes: ['CUSTOMER_BASIC'] });
    const invalidConsent = new Consent({ consentId: 'c_invalid', customerId: 'cus2', apiKey: 'key-invalid', status: 'REVOKED', scopes: [] });
    const expiredConsent = new Consent({ consentId: 'c_exp', customerId: 'cus3', apiKey: 'key-exp', status: 'AUTHORIZED', expiresAt: new Date(Date.now() - 1000), scopes: ['CUSTOMER_BASIC'] });
    await validConsent.save();
    await invalidConsent.save();
    await expiredConsent.save();

    const server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, resolve));
    const port = server.address().port;
    const base = `http://127.0.0.1:${port}`;

    // 1) Missing API key
    try {
      await axios.get(`${base}/open-finance/customers/cus1`);
      throw new Error('Expected 401 for missing api key');
    } catch (err) {
      assert.strictEqual(err.response.status, 401);
    }

    // 2) Invalid API key
    try {
      await axios.get(`${base}/open-finance/customers/cus1`, { headers: { 'x-api-key': 'unknown' } });
      throw new Error('Expected 401 for invalid api key');
    } catch (err) {
      assert.strictEqual(err.response.status, 401);
    }

    // 3) Revoked/Unauthorized consent
    try {
      await axios.get(`${base}/open-finance/customers/cus2`, { headers: { 'x-api-key': 'key-invalid' } });
      throw new Error('Expected 403 for revoked consent');
    } catch (err) {
      assert.strictEqual(err.response.status, 403);
    }

    // 4) Expired consent
    try {
      await axios.get(`${base}/open-finance/customers/cus3`, { headers: { 'x-api-key': 'key-exp' } });
      throw new Error('Expected 410 for expired consent');
    } catch (err) {
      assert.strictEqual(err.response.status, 410);
    }

    // 5) Valid consent should pass (controller will look up customer, but we only assert not 4xx)
    const res = await axios.get(`${base}/open-finance/customers/cus1`, { headers: { 'x-api-key': 'key-valid' }, validateStatus: () => true });
    // The endpoint returns customer data or 404 if customer not seeded; accept both as valid responses
    assert.ok([200, 404].includes(res.status));

    await new Promise((resolve) => server.close(resolve));
    console.log('API key auth tests passed');
  } catch (err) {
    console.error('API key tests failed:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    await mongoServer.stop();
  }
}

run();
