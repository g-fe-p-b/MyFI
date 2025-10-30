import Customer from '../models/Customer.js';
import idGenerator from '../utils/idGenerator.js';
import { isValidCPF } from '../utils/cpfValidator.js';
import { isValidEmail } from '../utils/emailValidator.js';
import { isValidName } from '../utils/nameValidator.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const {generateCustomerId} = idGenerator;

class CustomerService {
    async createCustomer({name, cpf, email, password}){
        if (!name || !name.trim() || !cpf || !cpf.trim() || !email || !email.trim() || !password) {
            const error = new Error ('Fill all the fields');
            error.statusCode = 400;
            throw error;
        }
        const trimmedName = name.trim();
        const trimmedEmail = email.trim();
        const trimmedCPF = cpf.trim();
        if (trimmedName.length > 50){
            const error = new Error ('Name is too long (maximum 50 characters)');
            error.statusCode = 400;
            throw error;
        }
        if (!isValidName(trimmedName)){
            const error = new Error ('Name contains invalid characters. Only letters and spaces are allowed.');
            error.statusCode = 400;
            throw error;
        }
        if (password.length < 8 ){
            const error = new Error ('Password is too short. Must be at least 8 characters.');
            error.statusCode = 400;
            throw error;
        }
        if (!isValidEmail(trimmedEmail)){
            const error =  new Error ('Type a valid email');
            error.statusCode = 400;
            throw error;
        }
        if (!isValidCPF(trimmedCPF)) {
            const error =  new Error ('Type a valid CPF');
            error.statusCode = 400;
            throw error;
        }
        const existingEmail = await Customer.findOne({ email: trimmedEmail });
        if (existingEmail) {
            const error = new Error ('This email already exists in the system.');
            error.statusCode = 409;
            throw error;
        }
        const existingCPF = await Customer.findOne({ cpf: trimmedCPF });
        if (existingCPF) {
            const error = new Error ('This CPF already exists in the system.');
            error.statusCode = 409;
            throw error;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const customerId = await generateCustomerId();
        const newCustomer = new Customer({ customerId, name: trimmedName, cpf: trimmedCPF, email: trimmedEmail, password: hashedPassword });
        await newCustomer.save();

        return newCustomer;
    }

    async login({cpf, password}){
        const cpfCustomer = await Customer.findOne({cpf});
        if(!cpfCustomer){
            const error = new Error ('CPF and/or password incorrect.')
            error.statusCode = 400;
            throw error;
        }
        const isMatch = await bcrypt.compare(password, cpfCustomer.password);
        if (!isMatch){
            const error = new Error ('CPF and/or password incorrect.')
            error.statusCode = 400;
            throw error;
        }
        const token = jwt.sign(
            {cpf: cpfCustomer.cpf },
            process.env.JWT_SECRET,
            {expiresIn: '1h'}
        );
        return token;
    };

    async getCustomerById({customerId, loggedInUser}) {
        const customer = await Customer.findOne({customerId: customerId});
        if (customer.cpf !== loggedInUser.cpf) {
            const error = new Error ('Access Denied. You only have access to your own data.');
            error.statusCode = 403;
            throw error;
        }
        return customer;
    }
}

export default new CustomerService();