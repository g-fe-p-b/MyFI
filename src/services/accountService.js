const Account = require('../models/Account');
const Customer = require('../models/Customer');
const {generateAccountId} = require('../utils/idGenerator');

class accountService {
    async createAccount({ customerId, initialDeposit, accountType, branch}){
        if(!customerId || typeof initialDeposit != 'number' || isNaN(initialDeposit)){
            throw {status: 400, message: 'Fill all the fields with valid values'};
        }
        if(initialDeposit < 0){
            throw {status: 400, message: 'Initial deposit must be non-negative'};
        }
        const customer = await Customer.findOne({ customerId});
        if(!customer){
            throw{ status: 404, message: 'Customer not found.'};
        }
        if(!['checking', 'savings'].includes(accountType)){
            throw {status:400, message: 'Invalid account type. Must be "checking" or "savings"'};
        }
        const accountNumber = Math.floor(100000000 + Math.random() * 900000000).toString();
        const existingAccount = await Account.findOne({ accountNumber });
        while (existingAccount) {
            accountNumber = Math.floor(100000000 + Math.random() * 900000000).toString();
            existingAccount = await Account.findOne({ accountNumber });   
        }
        const accountId = await generateAccountId();
        const newAccount = new Account({ accountId, customerId, accountType, branch, accountNumber, balance: initialDeposit});
        await newAccount.save();
        customer.accounts.push(newAccount.accountId);
        await customer.save();
        return newAccount;
    }

    async getBalance({ accountId }){
        const account = await Account.findOne({ accountId });
        if(!account){
            throw {status: 404, message: 'Account not found.'};
        }
        return new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRl'}).format(account.balance);
    }

    async getAccountById(accountId) {
        const account = await Account.findOne({ accountId });
        if(!account){
            throw {status: 404, message: 'Account not found.'};
        }
        return account;
    }

    async deleteAccount(accountId) {
        const account = await Account.findOneAndDelete({ accountId });
        if(!account){
            throw {status: 404, message: 'Account not found.'};
        }
        await Customer.updateOne(
            { customerId: account.customerId},
            { $pull: { accounts: account._id } }
        );
        return true;
    };
};

module.exports = new accountService();