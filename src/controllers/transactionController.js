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
    const { fromAccountId, toAccountId, amount, description, category } = req.body;
    try {
        const fromAccount = await Account.findOne({ accountId: fromAccountId });
        const toAccount = await Account.findOne({ accountId: toAccountId });
        if (!fromAccountId || !toAccountId || !amount) {
            return res.status(400).json({ message: 'Fill all fields' });
        }
        if (fromAccountId === toAccountId) {
            return res.status(400).json({ message: 'Cannot transfer to the same account.' });
        }
        if (amount <= 0) {
            return res.status(400).json({ message: 'Amount must be greater than zero.' });
        }
        if (!fromAccount) {
            return res.status(404).json({ message: 'Source account not found.' });
        }
        if (!toAccount) {
            return res.status(404).json({ message: 'Destination account not found.' });
        }
        if (fromAccount.balance < amount) {
            return res.status(400).json({ message: 'Insufficient funds in source account.' });
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
        const fromTransactionId = await generateTransactionId();
        const toTransactionId = await generateTransactionId();
        const fromTransaction = new Transaction({date: formatted, description: description || `Transfer to ${toAccountId}`, transactionId: fromTransactionId, accountId: fromAccountId, transactionType: 'debit', amount, category: category || 'transfer' });
        const toTransaction = new Transaction({date: formatted, description: description || `Transfer from ${fromAccountId}`, transactionId: toTransactionId, accountId: toAccountId, transactionType: 'credit', amount, category: category || 'transfer' });
        await fromTransaction.save();
        await toTransaction.save();
        fromAccount.balance -= amount;
        toAccount.balance += amount;
        await fromAccount.save();
        await toAccount.save();
        fromAccount.transactions.push(fromTransaction.transactionId);
        toAccount.transactions.push(toTransaction.transactionId);
        await fromAccount.save();
        await toAccount.save();
        res.status(201).json({ message: 'Transfer successful', fromTransaction, toTransaction });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

export default {create, getTransactionsByAccount, transferFunds };