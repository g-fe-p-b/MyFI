const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
   _id: { type: String, required: true },
  date: { type: Date, default: () => new Date().toISOString().split('T')[0].replace(/-/g, '/') },
  amount: { type: Number, required: true },
  description: { type: Text, required: true },
  transactionType: { type: String, enum: ['credit', 'debit'], required: true },
  category: { type: String, required: true },
  accountID: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Transaction', transactionSchema);