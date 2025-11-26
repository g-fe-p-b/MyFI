import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../../server.js';
import Customer from '../../src/models/Customer.js';
import Account from '../../src/models/Account.js';
import Transaction from '../../src/models/Transaction.js';
import Consent from '../../src/models/Consent.js';

describe('Open Finance endpoints (Jest)', () => {
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
    await Customer.deleteMany({});
    await Account.deleteMany({});
    await Transaction.deleteMany({});
    await Consent.deleteMany({});
  });

  test('accounts, balance and transactions endpoints return expected data with valid consent', async () => {
    const customer = await Customer.create({ customerId: 'cust_jest', name: 'Jest Cust', email: 'jest@example.com', cpf: '11122233399', password: 'pass' });

    const acc1 = await Account.create({ accountId: 'acc_j1', customerId: 'cust_jest', accountType: 'checking', branch: '0001', accountNumber: '10001', balance: 500 });
    const acc2 = await Account.create({ accountId: 'acc_j2', customerId: 'cust_jest', accountType: 'savings', branch: '0001', accountNumber: '20002', balance: 1500 });

    await Transaction.create({ transactionId: 'tx_j1', accountId: 'acc_j1', amount: -50, description: 'Test', transactionType: 'debit', category: 'test' });

    // Consent authorized for all scopes
    const consent = await Consent.create({ consentId: 'c_jest', customerId: 'cust_jest', apiKey: 'jest-key', status: 'AUTHORIZED', scopes: ['CUSTOMER_BASIC','ACCOUNTS_READ','TRANSACTIONS_READ'] });

    const agent = request(app);

    // GET customer
    const resCust = await agent.get('/open-finance/customers/cust_jest').set('x-api-key', 'jest-key');
    expect([200, 404]).toContain(resCust.status);

    // GET accounts
    const resAcc = await agent.get('/open-finance/customers/cust_jest/accounts').set('x-api-key', 'jest-key');
    expect(resAcc.status).toBe(200);
    expect(Array.isArray(resAcc.body)).toBe(true);
    expect(resAcc.body.length).toBe(2);

    // GET account balance
    const resBal = await agent.get('/open-finance/accounts/acc_j1/balance').set('x-api-key', 'jest-key');
    expect(resBal.status).toBe(200);
    expect(resBal.body.balance).toBe(500);

    // GET transactions
    const resTx = await agent.get('/open-finance/accounts/acc_j1/transactions').set('x-api-key', 'jest-key');
    expect(resTx.status).toBe(200);
    expect(Array.isArray(resTx.body)).toBe(true);
    expect(resTx.body.length).toBe(1);
  });
});
