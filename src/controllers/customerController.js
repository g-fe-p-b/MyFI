import CustomerService from '../services/customerService.js';
import Customer from '../models/Customer.js';

export async function create(req, res) {
  try {
      const newCustomer = await CustomerService.createCustomer(req.body);
      res.status(201).json({message: 'Customer created successfully', customer: newCustomer});
  } catch (error) {
    if (error.statusCode){
      return res.status(error.statusCode).json({message: error.message});
    }
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}
export async function login(req, res) {
  try {
    const token = await CustomerService.login(req.body);
    res.status(200).json({message: 'Login successful! The token expires in 1 hour', token: token });
  } catch (error){
    if (error.statusCode){
      return res.status(error.statusCode).json({message:error.message});
    }
    console.error(error);
    res.status(500).json({message: 'Server error', error: error.message});
  }
}
export async function getAllCustomers(req, res) {
  try {
    const customers = await Customer.find();
    res.status(200).json({customers});
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}
export async function getCustomer(req, res) {
  const { customerId } = req.params;
  const loggedInUser = req.user;
  try {
    const customer = await CustomerService.getCustomerById({ customerId, loggedInUser });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}
export async function deleteCustomer(req, res) {
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
}

export default {create, login, getAllCustomers, getCustomer, deleteCustomer};