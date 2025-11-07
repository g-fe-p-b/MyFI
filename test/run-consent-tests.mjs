import assert from 'assert';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import ConsentService from '../src/services/consentService.js';
import Customer from '../src/models/Customer.js';
import Consent from '../src/models/Consent.js';

async function run() {
  const mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  try{
    await mongoose.connect(uri, { dbName: 'testdb' });
    await Customer.deleteMany({});
    await Consent.deleteMany({});

    console.log('Running createConsent test...');
    const customer = new Customer({ customerId: 'cus_001', name: 'Test', email: 't@example.com', cpf: '12345678900', password: 'pass12345' });
    await customer.save();

    const payload = {
      customerId: 'cus_001',
      requester: { name: 'Third Party', institutionId: 'inst_1' },
      scopes: ['CUSTOMER_BASIC', 'ACCOUNTS_READ']
    };

    const result = await ConsentService.createConsent(payload);
    assert.ok(result.apiKey, 'apiKey should be returned');
    assert.ok(result.consentId, 'consentId should be returned');

    const stored = await Consent.findOne({ customerId: 'cus_001' });
    assert.ok(stored, 'Consent should be stored');
    assert.deepStrictEqual(stored.scopes.sort(), ['ACCOUNTS_READ','CUSTOMER_BASIC'].sort());

    console.log('createConsent test passed');

    console.log('Running approveConsent test...');
    const customer2 = new Customer({ customerId: 'cus_002', name: 'Approve', email: 'a@example.com', cpf: '98765432100', password: 'pass12345' });
    await customer2.save();

    const payload2 = { customerId: 'cus_002', requester: { name: 'Third Party 2' }, scopes: ['CUSTOMER_BASIC'] };
    const created = await ConsentService.createConsent(payload2);
    const consentId = created.consentId;
    const approved = await ConsentService.approveConsent({ consentId, customerId: 'cus_002' });
    assert.strictEqual(approved.status, 'AUTHORIZED');
    console.log('approveConsent test passed');

    console.log('\nAll tests passed');
  } catch (err){
    console.error('Test failed:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    await mongoServer.stop();
  }
}

run();
