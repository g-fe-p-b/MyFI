import authService from "../services/authService.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

class AuthController {

    async create(req, res, next) {
        try {
            const {
                name,
                email,
                password,
                cpf,
            } = req.body;

            if (!name || !email || !cpf || !password) {
                return res.status(400).json({ message: "Name, e-mail, CPF & password are required." });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = await authService.createUser({
                name,
                email,
                password: hashedPassword,
                cpf,
            });
            res.status(201).json(newUser);
        } catch (error) {
            next(error);
        }   
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: "E-mail & senha are required." });
            }
            const user = await authService.findUserByEmail(email);
            if (!user) {
                throw new UnauthorizedError("Invalid Credentials.");
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw new UnauthorizedError("Invalid Credentials.");
            }
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

            res.status(200).json({ 
                message: 'Login successful',
                token
             });
        } catch (error) {
            next(error);
        }
    }
}

export default new AuthController();