import Customer from '../models/Customer.js';
import Account from '../models/Account.js';
import Transaction from '../models/Transaction.js';
let counters = {customer: 0, account: 0, transaction: 0};

const prefixMap = {
    customer: 'cus_',
    account: 'acc_',
    transaction: 'txn_'
};
const modelMap = {
    customer: Customer,
    account: Account,
    transaction: Transaction
};
export async function initCounters() {
    for (const type of Object.keys(modelMap)) {
        const Model = modelMap[type];
        const prefix = prefixMap[type];
        const doc = await Model.findOne({ [type + 'Id']: { $regex: `^${prefix}\\d{3}$` } })
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
        newId = `${prefix}${String(counters[type]).padStart(3, '0')}`;
        existingId = await Model.exists({ [type + 'Id']: newId });
    }
    return newId;
}
export default { initCounters: () => initCounters(), generateCustomerId: () => generateId('customer'), generateAccountId: () => generateId('account'), generateTransactionId: () => generateId('transaction') };