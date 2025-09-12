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
        const existingEmail = await Customer.findOne({ email });
        if (existingEmail) {
            return res.status(409).json({ message: 'This email already exists in the system.' });
        }
        const existingCPF = await Customer.findOne({ cpf });
        if (existingCPF) {
            return res.status(409).json({ message: 'This CPF already exists in the system.' });
        }
        const customerId = generateCustomerId();
        const newCustomer = new Customer({ customerId, name, cpf, email });
        await newCustomer.save();
        res.status(201).json({message: 'Customer created successfully', customer: newCustomer});
    } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json({customers});
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.getCustomerById = async (req, res) => {
  const { customerId } = req.params;
  try {
    const customer = await Customer.findOne({ customerId: customerId });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.deleteCustomer = async (req, res) => {
  const { customerId } = req.params;
  try {
    const customer = await Customer.findOneAndDelete({ customerId: customerId });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};