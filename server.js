const express = require('express');
const customerRoutes = require('./src/routes/customerRoutes');
const accountRoutes = require('./src/routes/accountRoutes');
const transactionRoutes = require('./src/routes/transactionRoutes');
const authRoutes = require('./src/routes/authRoutes');
const openFinanceRoutes = require('./src/routes/openFinanceRoutes');
const authMiddleware = require('./src/middlewares/authMiddleware');

const app = express();
app.use(express.json());

app.use('/customers', authMiddleware, customerRoutes);
app.use('/transactions', authMiddleware, transactionRoutes);
app.use('/accounts', authMiddleware, accountRoutes);
app.use('/openfinance', openFinanceRoutes);
app.use('/auth', authRoutes);
app.get('/', (req, res) => {
    res.send('Welcome to MyFI API');
});
app.use(require('./src/middlewares/errorHandler'));

module.exports = app;