const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ai-incident');
        console.log('MongoDB Connected for Seeding...');

        const userExists = await User.findOne({ email: 'test@indore.com' });

        if (userExists) {
            console.log('Test user already exists.');
        } else {
            const user = await User.create({
                name: 'Test Operator',
                email: 'test@indore.com',
                password: 'test123', // Will be hashed by pre-save hook
                scansLeft: 100,
                subscription: 'premium',
                currentPlan: 'premium'
            });
            console.log('Test user seeded successfully: test@indore.com / test123');
        }

        process.exit();
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seedUser();
