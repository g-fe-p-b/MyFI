const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const customerRoutes = require('./routes/customerRoutes');
const accountRoutes = require('./routes/accountRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const moment = require('moment-timezone');
const app = express();

dotenv.config();
connectDB();
const PORT = process.env.PORT || 3000;
const TIMEZONE = process.env.TIMEZONE || 'UTC';

app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));
app.use((req, res, next) => {
    req.requestTime = moment().tz(TIMEZONE).format();
    next();
});

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);
app.use('/api/customers', customerRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/transactions', transactionRoutes);
app.get('/', (req, res) => {
    res.send('Welcome to the MyFI API');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;