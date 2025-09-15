const Transaction = require('../models/Transaction');
const Account = require('../models/Account');
const {generateTransactionId} = require('../utils/idGenerator');
const dotenv = require('dotenv');
dotenv.config({path: "../../.env"});

exports.createTransaction = async (req, res) => {
    const { description, accountId, transactionType, amount, category } = req.body;
    try {
        if (!accountId || !transactionType || !amount) {
            return res.status(400).json({ message: 'Fill all fields' });
        }
        if (!['credit', 'debit'].includes(transactionType)) {
            return res.status(400).json({ message: 'Transaction type must be either credit or debit.' });
        }
        if (amount <= 0) {
            return res.status(400).json({ message: 'Amount must be greater than zero.' });
        }
        const account = await Account.findOne({ accountId });
        if (!account) {
            return res.status(404).json({ message: 'Account not found.' });
        }
        if (transactionType === 'debit' && account.balance < amount) {
            return res.status(400).json({ message: 'Insufficient funds for this debit transaction.' });
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
        const transactionId = generateTransactionId();
        const newTransaction = new Transaction({date: formatted, description, transactionId, accountId, transactionType, amount, category });
        await newTransaction.save();
        account.balance += (transactionType === 'credit' ? amount : -amount);
        await account.save();
        account.transactions.push(newTransaction.transactionId);
        await account.save();
        res.status(201).json(newTransaction);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.getTransactionsByAccount = async (req, res) => {
    const { accountId } = req.params;
    try {
        const transactions = await Transaction.find({ accountId });
        if (transactions.length === 0) {
            return res.status(404).json({ message: 'No transactions found for this account.' });
        }
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};