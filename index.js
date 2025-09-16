const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { initCounters } = require('./src/utils/idGenerator');
const app = require('./server');

dotenv.config({path: './.env'});

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI).then(async () => {
    console.log('Connected to MongoDB');
    await initCounters();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});