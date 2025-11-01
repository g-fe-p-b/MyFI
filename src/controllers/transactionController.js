import accountService from '../services/accountService.js';
import AccountService from '../services/accountService.js';
import transactionService from '../services/transactionService.js';



export async function create(req, res) {
    try {
        const newTransaction = await transactionService.createTransaction(req.body);
        res.status(201).json({message: 'Transaction executed successfully!', transaction: newTransaction});
    } catch (error) {
        if (error.statusCode){
            return res.status(error.statusCode).json({message: error.message});
        }
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}
export async function getTransactionsByAccount(req, res) {
    const { accountId } = req.params;
    try {
        const transactions = await transactionService.getTransactionByAccount({ accountId });
        res.status(200).json(transactions);
    } catch (error) {
        if (error.statusCode){
            return res.status(error.statusCode).json({message: error.message});
        }
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}
export async function transferFunds(req, res) {
    try {
        const transfer = await transactionService.transferFunds( req.body );
        res.status(201).json({ message: 'Transfer successful', transfer });
    } catch (error) {
        if (error.statusCode){
            return res.status(error.statusCode).json({message: error.message});
        }
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

export default {create, getTransactionsByAccount, transferFunds };