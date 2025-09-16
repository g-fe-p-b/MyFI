const Customer = require('../models/Customer');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
let counters = {customer: 0, account: 0, transaction: 0};

const prefixMap = {
    customer: 'cus',
    account: 'acc',
    transaction: 'txn'
};
const modelMap = {
    customer: Customer,
    account: Account,
    transaction: Transaction
};
async function initCounters() {
    for (const type of Object.keys(modelMap)) {
        const Model = modelMap[type];
        const prefix = prefixMap[type];
        const doc = await Model.findOne({ [type + 'Id']: { $regex: `^${prefix}\\d{6}$` } })
            .sort({ [type + 'Id']: -1 })
            .lean();
        if (doc) {
            const idNum = parseInt(doc[type + 'Id'].slice(prefix.length), 10);
            counters[type] = idNum;
        } else {
            counters[type] = 0;
        }
    }
}
async function generateId(type) {
    const prefix = prefixMap[type];
    const Model = modelMap[type];
    if (!prefix || !Model) {
        throw new Error('Invalid type for ID generation');
    }
    let newId;
    let existingId = true;
    while (existingId) {
        counters[type]++;
        newId = `${prefix}${String(counters[type]).padStart(6, '0')}`;
        existingId = await Model.exists({ [type + 'Id']: newId });
    }
    return newId;
}
module.exports = { initCounters, generateCustomerId: () => generateId('customer'), generateAccountId: () => generateId('account'), generateTransactionId: () => generateId('transaction') };