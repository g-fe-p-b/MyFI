const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/config/database');
const customerRoutes = require('./src/routes/customerRoutes');
const accountRoutes = require('./src/routes/accountRoutes');
const transactionRoutes = require('./src/routes/transactionRoutes');
const app = express();
dotenv.config({path: './.env'});
app.use(express.json());
connectDB();

app.use('/customers', customerRoutes);
app.use('/transactions', transactionRoutes);
app.use('/accounts', accountRoutes);
app.get('/', (req, res) => {
    res.send('Welcome to MyFI API');
});
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});