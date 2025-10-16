const { TokenExpiredError } = require('jsonwebtoken');
const mongoose = require('mongoose');

const userAuthSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], required: true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true},
  cpf: { type: String, required: true, unique: true },
  token: {},
});

const adminAuthSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], required: true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true},
  cpf: { type: String, required: true, unique: true },
  token: {},
});

module.exports = mongoose.model('UserAuth', userAuthSchema);
module.exports = mongoose.model('AdminAuth', adminAuthSchema);