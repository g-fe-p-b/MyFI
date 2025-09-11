const Customer = require('../models/Customer');
const { generateCustomerId } = require('../utils/idGenerator');
const { isValidCPF } = require('../utils/cpfValidator');

exports.createCustomer = async (req, res) => {
    const { name, cpf, email } = req.body;
    try {
        if (!name || !cpf || !email) {
        return res.status(400).json({ message: 'Fill all fields' });
        }
        if (!isValidCPF(cpf)) {
        return res.status(400).json({ message: 'Type a valid CPF' });
        }
        const existingCustomer = await Customer.findOne({ $or: [{ cpf }, {email}]});
        if (existingCustomer) {
            if (existingCustomer.email === email) {
                return res.status(409).json({ message: 'This email already exists in the system.' });
            }
            if (existingCustomer.cpf === cpf) {
                return res.status(409).json({ message: 'This CPF already exists in the system.' });
            }
        }
        const customerId = await generateCustomerId();
        const newCustomer = new Customer({ customerId, name, cpf, email });
        await newCustomer.save();
        res.status(201).json(newCustomer);
    } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

