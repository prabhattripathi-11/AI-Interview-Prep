// Script to update a user's role to admin
// Usage: node backend/scripts/update-user-role.js your-email@example.com

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

async function updateUserRole(email, newRole = 'admin') {
    try {
        // Connect to MongoDB
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✓ Connected to MongoDB');

        // Find the user
        console.log(`\nSearching for user: ${email}`);
        const user = await User.findOne({ email });

        if (!user) {
            console.error(`✗ User not found with email: ${email}`);
            process.exit(1);
        }

        console.log(`✓ Found user: ${user.name} (${user.email})`);
        console.log(`  Current role: ${user.role}`);

        // Update the role
        if (user.role === newRole) {
            console.log(`\n✓ User already has role: ${newRole}`);
        } else {
            user.role = newRole;
            await user.save();
            console.log(`\n✓ Successfully updated role to: ${newRole}`);
        }

        // Verify the update
        const updatedUser = await User.findOne({ email });
        console.log('\nVerification:');
        console.log(`  Name: ${updatedUser.name}`);
        console.log(`  Email: ${updatedUser.email}`);
        console.log(`  Role: ${updatedUser.role}`);
        console.log(`  ID: ${updatedUser._id}`);

        console.log('\n✓ Done! Please log out and log back in to see the changes.');

    } catch (error) {
        console.error('✗ Error:', error.message);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('\n✓ Database connection closed');
    }
}

// Get email from command line arguments
const email = process.argv[2];
const role = process.argv[3] || 'admin';

if (!email) {
    console.error('Usage: node update-user-role.js <email> [role]');
    console.error('Example: node update-user-role.js user@example.com admin');
    process.exit(1);
}

updateUserRole(email, role);
