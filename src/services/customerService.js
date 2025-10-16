const Customer = require('../models/Customer');
const { generateCustomerId } = require('../utils/idGenerator');
const { isValidCPF } = require('../utils/cpfValidator');

class customerService {
    async createCustomer({name, cpf, email}){
        if (!name || !cpf || !email) {
            return res.status(400).json({ message: 'Fill all fields' });}
        if (!isValidCPF(cpf)) {
            return res.status(400).json({ message: 'Type a valid CPF' });}
        const existingEmail = await Customer.findOne({ email });
        if (existingEmail) {
            return res.status(409).json({ message: 'This email already exists in the system.' });}
        const existingCPF = await Customer.findOne({ cpf });
        if (existingCPF) {
            return res.status(409).json({ message: 'This CPF already exists in the system.' });}
        const customerId = await generateCustomerId();
        const newCustomer = new Customer({ customerId, name, cpf, email });
        await newCustomer.save();
        return newCustomer;
    }
    async getCustomerById({customerId}) {
        const customer = await Customer.findOne({customerId});
    }
}

module.exports = new customerService();