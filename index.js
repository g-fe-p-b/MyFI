import { config } from 'dotenv';
import { connect } from 'mongoose';
import { initCounters } from './src/utils/idGenerator.js';
import app from './server.js';

config({path: './.env'});

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

connect(MONGO_URI).then(async () => {
    console.log('Connected to MongoDB');
    await initCounters();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});