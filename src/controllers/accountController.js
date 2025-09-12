const Account = require('../models/Account');
const { generateAccountId } = require('../utils/idGenerator');
const Customer = require('../models/Customer');

exports.createAccount = async (req, res) => {
    const { customerId, initialDeposit, accountType } = req.body;
    try {
        if (!customerId || typeof initialDeposit !== 'number' || isNaN(initialDeposit)) {
            return res.status(400).json({ message: 'Fill all fields with valid values' });
        }
        if (initialDeposit < 0) {
            return res.status(400).json({ message: 'Initial deposit must be non-negative.' });
        }
        const customer = await Customer.findOne({ customerId });
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found.' });
        }
        if (!['checking', 'savings'].includes(accountType)) {
            return res.status(400).json({ message: 'Invalid account type. Must be "checking" or "savings".' });
        }
        const accountId = generateAccountId();
        const newAccount = new Account({ accountId, customerId: customerId, balance: initialDeposit, accountType: accountType });
        await newAccount.save();
        res.status(201).json({message: 'Account created successfully', account: newAccount, body: req.body});
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.getBalance = async (req, res) => {
    const { accountId } = req.params;
    try {
        const account = await Account.findOne({ accountId });
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }
        res.status(200).json({ balance: account.balance });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


exports.getAccountById = async (req, res) => {
    const { id } = req.params;
    try {
        const account = await Account.findOne({ accountId: id });
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }
        res.status(200).json(account);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};