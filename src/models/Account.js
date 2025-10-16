const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  accountId: { type: String},
  accountType: { type: String, enum: ['checking', 'savings'], required: true },
  branch: { type: String, required: false },
  accountNumber: { type: String, unique: true },
  balance: { type: Number, default: 0, min:[0] },
  customerId: { type: String, ref: 'Customer', required: true },
  transactions: [{ type: String, ref: 'Transaction' }],
});
module.exports = mongoose.model('Account', accountSchema);