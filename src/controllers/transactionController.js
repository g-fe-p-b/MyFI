const Transaction = require('../models/Transaction');
const Account = require('../models/Account');
const {generateTransactionId} = require('../utils/idGenerator');

exports.createTransaction = async (req, res) => {
    const { accountId, transactionType, amount } = req.body;
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
        if (type === 'debit' && account.balance < amount) {
            return res.status(400).json({ message: 'Insufficient funds for this debit transaction.' });
        }
        const transactionId = await generateTransactionId();
        const newTransaction = new Transaction({ transactionId, accountId, transactionType, amount });
        await newTransaction.save();
        account.balance += (transactionType === 'credit' ? amount : -amount);
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