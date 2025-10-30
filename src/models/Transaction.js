import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  transactionId: { type: String},
  date: { type: Date, default: () => new Date().toISOString().split('T')[0].replace(/-/g, '/') },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  transactionType: { type: String, enum: ['credit', 'debit'], required: true },
  category: { type: String, required: true },
  accountId: { type: String, ref: 'Account', required: true }
});
export default mongoose.model('Transaction', transactionSchema);