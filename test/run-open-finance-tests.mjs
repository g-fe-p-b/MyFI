import assert from 'assert';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import axios from 'axios';
import http from 'http';
import app from '../server.js';
import ConsentService from '../src/services/consentService.js';
import Customer from '../src/models/Customer.js';
import Account from '../src/models/Account.js';
import Transaction from '../src/models/Transaction.js';
import Consent from '../src/models/Consent.js';

async function run() {
  const mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  try{
    await mongoose.connect(uri, { dbName: 'testdb' });
    await Customer.deleteMany({});
    await Account.deleteMany({});
    await Transaction.deleteMany({});
    await Consent.deleteMany({});

    // Seed customer, accounts, transactions
    const customer = new Customer({ customerId: 'cus_of_1', name: 'OF Test', email: 'of@example.com', cpf: '11122233344', password: 'pass' });
    await customer.save();

    const acc1 = new Account({ accountId: 'acc_1', customerId: 'cus_of_1', accountType: 'checking', branch: '0001', accountNumber: '12345', balance: 1000 });
    const acc2 = new Account({ accountId: 'acc_2', customerId: 'cus_of_1', accountType: 'savings', branch: '0001', accountNumber: '54321', balance: 2500 });
    await acc1.save();
    await acc2.save();

    const tx1 = new Transaction({ transactionId: 'tx_1', accountId: 'acc_1', amount: -100, description: 'Payment', transactionType: 'debit', category: 'payments' });
    const tx2 = new Transaction({ transactionId: 'tx_2', accountId: 'acc_2', amount: 200, description: 'Deposit', transactionType: 'credit', category: 'income' });
    await tx1.save();
    await tx2.save();

    // Create consent for all scopes
    const payload = {
      customerId: 'cus_of_1',
      requester: { name: 'Third Party OF' },
      scopes: ['CUSTOMER_BASIC','ACCOUNTS_READ','TRANSACTIONS_READ']
    };

    const created = await ConsentService.createConsent(payload);
    assert.ok(created.apiKey, 'apiKey should be returned');

    // Approve consent
    const consentId = created.consentId;
    await ConsentService.approveConsent({ consentId, customerId: 'cus_of_1' });

    // Start the app on an ephemeral port
    const server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, resolve));
    const port = server.address().port;
    const base = `http://127.0.0.1:${port}`;

    const headers = { 'x-api-key': created.apiKey };

    // GET customer
    const resCust = await axios.get(`${base}/open-finance/customers/cus_of_1`, { headers });
    assert.ok(resCust.data.customer, 'Customer data should be present');
    assert.strictEqual(resCust.data.customer.customerId, 'cus_of_1');

    // GET accounts
    const resAcc = await axios.get(`${base}/open-finance/customers/cus_of_1/accounts`, { headers });
    assert.ok(Array.isArray(resAcc.data), 'Accounts array expected');
    assert.strictEqual(resAcc.data.length, 2);

    // GET account balance
    const resBal = await axios.get(`${base}/open-finance/accounts/acc_1/balance`, { headers });
    assert.strictEqual(typeof resBal.data.balance, 'number');
    assert.strictEqual(resBal.data.balance, 1000);

    // GET transactions for account
    const resTx = await axios.get(`${base}/open-finance/accounts/acc_1/transactions`, { headers });
    assert.ok(Array.isArray(resTx.data), 'Transactions array expected');
    assert.strictEqual(resTx.data.length, 1);

    console.log('Open Finance route tests passed');
+    await new Promise((resolve) => server.close(resolve));
  } catch (err){
    console.error('Open Finance tests failed:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    await mongoServer.stop();
  }
}

run();
