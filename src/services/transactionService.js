import Transaction from '../models/Transaction.js';
import Account from '../models/Account.js';
import idGenerator from '../utils/idGenerator.js';
import accountService from './accountService.js';

const {generateTransactionId} = idGenerator;

class TransactionService {

    async createTransaction({description, accountId, transactionType, amount, category}) {
        if (!accountId || !transactionType || !amount) {
            const error = new Error ('Fill all the fields');
            error.statusCode = 400;
            throw error;
        }
        if (!['credit', 'debit'].includes(transactionType)) {
            const error = new Error ('Transaction type must be either credit or debit.');
            error.statusCode = 400;
            throw error;
        }
        if (amount <= 0) {
            const error = new Error ('Amount must be greater than zero.');
            error.statusCode = 400;
            throw error;
        }
        const account = await Account.findOne({ accountId });
        if (!account) {
            const error = new Error ('Account not found.');
            error.statusCode = 404;
            throw error;
        }
        if (transactionType === 'debit' && account.balance < amount) {
            const error = new Error ('Insufficient funds for this debit transaction.');
            error.statusCode = 400;
            throw error;
        }
        const date = new Date();
        const formatter = new Intl.DateTimeFormat("pt-BR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
            timeZone: process.env.TIMEZONE
        });
        const parts = formatter.formatToParts(date);
        const formatted =
                        `${parts.find(p => p.type === "year").value}/` +
                        `${parts.find(p => p.type === "month").value}/` +
                        `${parts.find(p => p.type === "day").value} ` +
                        `${parts.find(p => p.type === "hour").value}:` +
                        `${parts.find(p => p.type === "minute").value}:` +
                        `${parts.find(p => p.type === "second").value}`;
        const transactionId = await generateTransactionId();
        const newTransaction = new Transaction({date: formatted, description, transactionId, accountId, transactionType, amount, category });
        await newTransaction.save();
        account.balance += (transactionType === 'credit' ? amount : -amount);
        await account.save();
        account.transactions.push(newTransaction.transactionId);
        await account.save();
    }

    async getTransactionByAccount({accountId}){
        const transactions = await Transaction.find({ accountId });
        if (transactions.length === 0) {
            const error = new Error ('No transactions found for this account.');
            error.statusCode = 404;
            throw error;
        }
        return transactions;
    }

};

export default new TransactionService();