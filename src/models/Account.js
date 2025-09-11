const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
   _id: { type: String, required: true },
  accountType: { type: String, enum: ['checking', 'savings'], required: true },
  branch: { type: String, required: true },
  accountNumber: { type: String, required: true, unique: true },
  balance: { type: Number, default: 0 },
  customerID: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Account', accountSchema);