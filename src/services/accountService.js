import Account from '../models/Account.js';
import Customer from '../models/Customer.js';
import idGenerator from '../utils/idGenerator.js';

const {generateAccountId} = idGenerator;

class AccountService {
    async createAccount({ customerId, initialDeposit, accountType, branch}){
        if(!customerId || typeof initialDeposit != 'number' || isNaN(initialDeposit)){
            const error = new Error ('Fill all the fields with valid values');
            error.statusCode = 400;
            throw error;
        }
        if(initialDeposit < 0){
            const error = new Error ('Initial deposit must be non-negative');
            error.statusCode = 400;
            throw error;
        }
        const customer = await Customer.findOne({ customerId});
        if(!customer){
            const error = new Error ('Customer not found.');
            error.statusCode = 400;
            throw error;
        }
        if(!['checking', 'savings'].includes(accountType)){
            const error = new Error ('Invalid account type. Must be "checking" or "savings"');
            error.statusCode = 400;
            throw error;
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
        await customer.save();
        return newAccount;
    }

    async getBalance({ accountId }){
        const account = await Account.findOne({ accountId });
        if(!account){
            const error = new Error ('Account not found.');
            error.statusCode = 404;
            throw error;
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
        await Account.updateOne(
            { customerId: account.customerId},
            { $pull: { accounts: account._id } }
        );
        return true;
    };
};

export default new AccountService();