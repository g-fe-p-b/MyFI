const express = require('express');
const customerRoutes = require('./src/routes/customerRoutes');
const accountRoutes = require('./src/routes/accountRoutes');
const transactionRoutes = require('./src/routes/transactionRoutes');

const app = express();
app.use(express.json());

app.use('/customers', customerRoutes);
app.use('/transactions', transactionRoutes);
app.use('/accounts', accountRoutes);
app.get('/', (req, res) => {
    res.send('Welcome to MyFI API');
});

module.exports = app;