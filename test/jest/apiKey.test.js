import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../../server.js';
import Consent from '../../src/models/Consent.js';

describe('API Key middleware (Jest)', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { dbName: 'testdb' });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) await mongoServer.stop();
  });

  beforeEach(async () => {
    await Consent.deleteMany({});
  });

  test('rejects missing, invalid, revoked and expired consents and accepts valid', async () => {
    const valid = await Consent.create({ consentId: 'cj1', customerId: 'c1', apiKey: 'k1', status: 'AUTHORIZED', scopes: ['CUSTOMER_BASIC'] });
    const revoked = await Consent.create({ consentId: 'cj2', customerId: 'c2', apiKey: 'k2', status: 'REVOKED', scopes: [] });
    const expired = await Consent.create({ consentId: 'cj3', customerId: 'c3', apiKey: 'k3', status: 'AUTHORIZED', scopes: ['CUSTOMER_BASIC'], expiresAt: new Date(Date.now() - 1000) });

    const agent = request(app);

    // missing
    await agent.get('/open-finance/customers/c1').expect(401);

    // invalid
    await agent.get('/open-finance/customers/c1').set('x-api-key', 'invalid').expect(401);

    // revoked
    await agent.get('/open-finance/customers/c2').set('x-api-key', 'k2').expect(403);

    // expired
    await agent.get('/open-finance/customers/c3').set('x-api-key', 'k3').expect(410);

    // valid (may return 200 or 404 depending on customer seed)
    const res = await agent.get('/open-finance/customers/c1').set('x-api-key', 'k1');
    expect([200, 404]).toContain(res.status);
  });
});
