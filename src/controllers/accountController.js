const accountService = require('../services/accountService');

exports.createAccount = async (req, res) => {
    try {
        const newAccount = await accountService.createAccount(req.body);
        res.status(201).json({message: 'Account created successfully', account: newAccount, body: req.body});
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getBalance = async (req, res) => {
    try {
        const balance = await accountService.getBalance(req.params.accountId);
        res.status(200).json({balance});
    } catch (error) {
        res.status(500).json({message:'Server Error', error});
    }
};
exports.getAccountById = async (req, res) => {
    try {
        const account = await accountService.getAccountById(req.params.accountId);
        res.status(200).json(account);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.deleteAccount = async (req, res) => {
    try {
        accountService.deleteAccount(req.params.accountId);
        res.status(204).json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};