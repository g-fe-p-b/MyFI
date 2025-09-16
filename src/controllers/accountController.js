const Account = require('../models/Account');
const { generateAccountId } = require('../utils/idGenerator');
const Customer = require('../models/Customer');

exports.createAccount = async (req, res) => {
    const { customerId, initialDeposit, accountType, branch } = req.body;
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
        const accountNumber = Math.floor(100000000 + Math.random() * 900000000).toString();
        const existingAccount = await Account.findOne({ accountNumber });
        while (existingAccount) {
            accountNumber = Math.floor(100000000 + Math.random() * 900000000).toString();
            existingAccount = await Account.findOne({ accountNumber });   
        }
        const accountId = await generateAccountId();
        const newAccount = new Account({ accountId, customerId: customerId, accountType: accountType, branch: branch, accountNumber: accountNumber ,balance: initialDeposit });
        await newAccount.save();
        customer.accounts.push(newAccount.accountId);
        await customer.save();
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
        const formattedBalance = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(account.balance);
        res.status(200).json({ balance: formattedBalance });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getAccountById = async (req, res) => {
    const { accountId } = req.params;
    try {
        const account = await Account.findOne({ accountId });
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }
        res.status(200).json(account);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.deleteAccount = async (req, res) => {
    const { accountId } = req.params;
    try {
        const account = await Account.findOneAndDelete({ accountId: accountId });
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }
        await Customer.updateOne(
            { customerId: account.customerId },
            { $pull: { accounts: account._id } }
        );
        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};