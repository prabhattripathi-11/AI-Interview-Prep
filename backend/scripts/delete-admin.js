const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/interviewprep';

mongoose.connect(uri)
    .then(async () => {
        console.log('Connected to DB');
        const result = await User.deleteOne({ email: 'admin@example.com' });
        if (result.deletedCount > 0) {
            console.log('✅ User admin@example.com deleted successfully');
        } else {
            console.log('⚠️ User admin@example.com not found');
        }
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Error:', err);
        process.exit(1);
    });
