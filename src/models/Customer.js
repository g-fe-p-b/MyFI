const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  customerId: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  cpf: { type: String, required: true, unique: true },
  accounts: [{ type: String, ref: 'Account' }],
});
module.exports = mongoose.model('Customer', customerSchema);
