let counters = {customer: 0, account: 0, transaction: 0};

function generateId(type) {
    counters [type]++;
    const prefix = {
        customer: 'cus',
        account: 'acc',
        transaction: 'txn'
    }[type];
    return `${prefix}${String(counters[type]).padStart(6, '0')}`;
}

module.exports = { generateCustomerId: () => generateId('customer'), generateAccountId: () => generateId('account'), generateTransactionId: () => generateId('transaction') };