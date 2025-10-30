import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../utils/errs.js'; 
import dotenv from 'dotenv';
dotenv.config();

export const authenticateToken = (req, res, next) => { 
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({message: 'Access denied.'});
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return next(new UnauthorizedError('Invalid or expired token.'));
        }
        req.user = user;
        next();
    });
};

export default authenticateToken;