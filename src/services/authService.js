const Auth = require('../models/Auth');
const { generateCustomerId } = require('../utils/idGenerator');
const { isValidCPF } = require('../utils/cpfValidator');

class authService {
    async registerUser({name, cpf, email, password}){
        if (!name || !cpf || !email || !password) {
            return res.status(400).json({ message: 'Fill all the fields' });}
        if (!isValidCPF(cpf)) {
            return res.status(400).json({ message: 'Type a valid CPF' });}
        const existingEmail = await Customer.findOne({ email });
        if (existingEmail) {
            return res.status(409).json({ message: 'This email already exists in the system.' });}
        const existingCPF = await Customer.findOne({ cpf });
        if (existingCPF) {
            return res.status(409).json({ message: 'This CPF already exists in the system.' });}
        const customerId = await generateCustomerId();
        const newUserAuth = new UserAuth({ customerId, name, cpf, email });
        await newUserAuth.save();
        return newUserAuth;
    }

    async registerAdmin({name, cpf, email, password, JWT}){
        if (!name || !cpf || !email || !password || !JWT) {
            return res.status(400).json({ message: 'Fill all the fields' });}
        if (!isValidCPF(cpf)) {
            return res.status(400).json({ message: 'Type a valid CPF' });}
        const existingEmail = await Customer.findOne({ email });
        if (existingEmail) {
            return res.status(409).json({ message: 'This email already exists in the system.' });}
        const existingCPF = await Customer.findOne({ cpf });
        if (existingCPF) {
            return res.status(409).json({ message: 'This CPF already exists in the system.' });}
        if (JWT!=JWT_SECRET){
            throw {status:403, message: 'Not Allowed!'}
        }
        const customerId = await generateCustomerId();
        const newAdminAuth = new AdminAuth({ customerId, name, cpf, email });
        await newAdminAuth.save();
        return newAdminAuth;
    }
}

module.exports = new authService();