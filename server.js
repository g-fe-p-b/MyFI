import express, { json } from 'express';
import customerRoutes from './src/routes/customerRoutes.js';
import accountRoutes from './src/routes/accountRoutes.js';
import transactionRoutes from './src/routes/transactionRoutes.js';
import consentRoutes from './src/routes/consentRoutes.js';

const app = express();
app.use(json());


app.use('/customers', customerRoutes);
app.use('/transactions', transactionRoutes);
app.use('/accounts', accountRoutes);
app.use('/consents', consentRoutes);
app.get('/', (req, res) => {
    res.send('Welcome to MyFI API');
});

export default app;