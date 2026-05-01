import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import readline from 'readline';

// Load environment variables
dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const createSuperAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if superadmin already exists
    const existingSuperAdmin = await User.findOne({ role: 'superadmin' });
    
    if (existingSuperAdmin) {
      console.log('\n⚠️  A superadmin already exists:');
      console.log(`   Name: ${existingSuperAdmin.name}`);
      console.log(`   Email: ${existingSuperAdmin.email}`);
      console.log(`   Username: ${existingSuperAdmin.username}`);
      
      const confirm = await question('\nDo you want to create another superadmin? (yes/no): ');
      
      if (confirm.toLowerCase() !== 'yes' && confirm.toLowerCase() !== 'y') {
        console.log('Operation cancelled.');
        rl.close();
        process.exit(0);
      }
    }

    console.log('\n📝 Create Superadmin Account\n');

    // Get superadmin details
    const name = await question('Enter name: ');
    const username = await question('Enter username: ');
    const email = await question('Enter email: ');
    const password = await question('Enter password (min 6 characters): ');

    // Validate inputs
    if (!name || !username || !email || !password) {
      console.error('❌ All fields are required');
      rl.close();
      process.exit(1);
    }

    if (password.length < 6) {
      console.error('❌ Password must be at least 6 characters');
      rl.close();
      process.exit(1);
    }

    // Check if email or username already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      if (existingUser.email === email) {
        console.error('❌ Email already exists');
      }
      if (existingUser.username === username) {
        console.error('❌ Username already exists');
      }
      rl.close();
      process.exit(1);
    }

    // Create superadmin
    const superadmin = await User.create({
      name,
      username,
      email,
      password,
      role: 'superadmin',
      permissions: [], // Superadmin doesn't need permissions array
      isActive: true,
    });

    console.log('\n✅ Superadmin created successfully!');
    console.log('\nSuperadmin Details:');
    console.log(`   ID: ${superadmin._id}`);
    console.log(`   Name: ${superadmin.name}`);
    console.log(`   Username: ${superadmin.username}`);
    console.log(`   Email: ${superadmin.email}`);
    console.log(`   Role: ${superadmin.role}`);
    console.log('\n🔐 You can now login with these credentials');

    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating superadmin:', error.message);
    rl.close();
    process.exit(1);
  }
};

// Run the script
createSuperAdmin();
