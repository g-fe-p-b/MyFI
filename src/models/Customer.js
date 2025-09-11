const mongoose = require('mongoose');

const costumerSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  cpf: { type: String, required: true, unique: true },
  accounts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Account' }],
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Customer', costumerSchema);
