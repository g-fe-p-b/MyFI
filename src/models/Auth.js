import { TokenExpiredError } from 'jsonwebtoken';
import { Schema, model } from 'mongoose';

const userAuthSchema = new Schema({
  name: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], required: true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true},
  cpf: { type: String, required: true, unique: true },
  authorization: {type: String},
  token: {},
});

const adminAuthSchema = new Schema({
  name: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], required: true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true},
  cpf: { type: String, required: true, unique: true },
  token: {},
});

export default model('UserAuth', userAuthSchema);
//export default model('AdminAuth', adminAuthSchema);