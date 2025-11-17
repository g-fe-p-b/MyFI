import AccountService from '../services/accountService.js';

const accountService = AccountService;

export async function createAccount(req, res) {
    try {
        const newAccount = await AccountService.createAccount(req.body);
        res.status(201).json({message: 'Account created successfully', account: newAccount, body: req.body});
    } catch (error) {
        if (error.statusCode){
            return res.status(error.statusCode).json({message: error.message});
        }
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}
export async function getBalance(req, res) {
    try {
        const balance = await AccountService.getBalance(req.params);
        res.status(200).json({balance});
    } catch (error) {
        if(error.statusCode){
            return res.status(error.statusCode).json({message: error.message});
        }
        console.error(error);
        res.status(500).json({message:'Server Error', error: error.message});
    }
}
export async function getAccountById(req, res) {
    try {
        const account = await accountService.getAccountById(req.params.accountId);
        res.status(200).json(account);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}
export async function deleteAccount(req, res) {
    try {
            await AccountService.deleteAccount(req.params.accountId);
        res.status(204).json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}