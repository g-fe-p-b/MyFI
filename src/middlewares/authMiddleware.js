const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config({path: '../../.env'});
const JWT_SECRET = process.env.JWT_SECRET;

exports.auth = async (req, res, next) => {
    const authToken = req.headers['authorization'];
    try{
        const bearer = await authToken.split(' ');
        const token = bearer[1];

        jwt.verify(token,JWT_SECRET, (err, data) => {
            if(err){
            return res.status(401).json({ message: 'Invalid Token' });
            } else {
                req.token = token;
                req.user = decodedPayload;
            }
            next();
        })
    } catch(error) {
        res.status(401).json({ message: 'Invalid Token', error });
    }
}
