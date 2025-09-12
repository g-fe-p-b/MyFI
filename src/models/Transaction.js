const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionId: { type: String},
  date: { type: Date, default: () => new Date().toISOString().split('T')[0].replace(/-/g, '/') },
  amount: { type: Number, required: true },
  transactionType: { type: String, enum: ['credit', 'debit'], required: true },
  accountId: { type: String, ref: 'Account', required: true },
});
module.exports = mongoose.model('Transaction', transactionSchema);