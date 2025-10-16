const customerService = require('../services/customerService');

exports.createCustomer = async (req, res) => {
  try {
      const newCustomer = await customerService.createCustomer(req.body);
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
    res.status(204).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};