import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import ConsentService from '../src/services/consentService.js';
import Customer from '../src/models/Customer.js';
import Consent from '../src/models/Consent.js';

describe('ConsentService (integration with in-memory MongoDB)', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { dbName: 'testdb' });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // clear collections
    await Customer.deleteMany({});
    await Consent.deleteMany({});
  });

  test('createConsent creates a consent and returns apiKey', async () => {
    const customer = new Customer({ customerId: 'cus_001', name: 'Test', email: 't@example.com', cpf: '12345678900', password: 'pass12345' });
    await customer.save();

    const payload = {
      customerId: 'cus_001',
      requester: { name: 'Third Party', institutionId: 'inst_1' },
      scopes: ['CUSTOMER_BASIC', 'ACCOUNTS_READ']
    };

    const result = await ConsentService.createConsent(payload);
    expect(result).toHaveProperty('apiKey');
    expect(result).toHaveProperty('consentId');

    // confirm stored in DB
    const stored = await Consent.findOne({ customerId: 'cus_001' });
    expect(stored).not.toBeNull();
    expect(stored.scopes).toEqual(expect.arrayContaining(['CUSTOMER_BASIC']));
  });

  test('approveConsent sets status to AUTHORIZED', async () => {
    const customer = new Customer({ customerId: 'cus_002', name: 'Approve', email: 'a@example.com', cpf: '98765432100', password: 'pass12345' });
    await customer.save();

    const payload = {
      customerId: 'cus_002',
      requester: { name: 'Third Party 2' },
      scopes: ['CUSTOMER_BASIC']
    };
    const created = await ConsentService.createConsent(payload);

    // created.consentId may be the object id string
    const consentId = created.consentId;
    const approved = await ConsentService.approveConsent({ consentId, customerId: 'cus_002' });
    expect(approved.status).toBe('AUTHORIZED');
  });
});
