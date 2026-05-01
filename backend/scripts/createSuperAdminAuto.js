import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

import User from '../models/User.js';

const createSuperAdmin = async () => {
  try {
    // Get credentials from command line arguments or use defaults
    const args = process.argv.slice(2);
    const name = args[0] || 'Super Admin';
    const username = args[1] || 'superadmin';
    const email = args[2] || 'superadmin@blog.com';
    const password = args[3] || 'superadmin123';

    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║           CREATE SUPERADMIN ACCOUNT                        ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check if superadmin already exists
    const existingSuperAdmin = await User.findOne({ role: 'superadmin' });
    
    if (existingSuperAdmin) {
      console.log('⚠️  Superadmin(s) already exist:');
      const allSuperAdmins = await User.find({ role: 'superadmin' });
      allSuperAdmins.forEach((admin, index) => {
        console.log(`\n   ${index + 1}. ${admin.name}`);
        console.log(`      Email: ${admin.email}`);
        console.log(`      Username: ${admin.username}`);
      });
      console.log('\n📝 Creating additional superadmin...\n');
    }

    // Check if email or username already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      if (existingUser.email === email) {
        console.error('❌ Email already exists:', email);
        console.log('\n💡 User details:');
        console.log(`   Name: ${existingUser.name}`);
        console.log(`   Username: ${existingUser.username}`);
        console.log(`   Role: ${existingUser.role}`);
        console.log(`   Active: ${existingUser.isActive}`);
        
        // If user exists but is not superadmin, offer to upgrade
        if (existingUser.role !== 'superadmin') {
          console.log('\n🔄 Upgrading existing user to superadmin...');
          existingUser.role = 'superadmin';
          existingUser.permissions = [];
          await existingUser.save();
          
          console.log('\n✅ User upgraded to superadmin successfully!');
          console.log('\nSuperadmin Details:');
          console.log(`   ID: ${existingUser._id}`);
          console.log(`   Name: ${existingUser.name}`);
          console.log(`   Username: ${existingUser.username}`);
          console.log(`   Email: ${existingUser.email}`);
          console.log(`   Role: ${existingUser.role}`);
          console.log('\n🔐 You can now login with existing credentials\n');
        } else {
          console.log('\n✅ User is already a superadmin\n');
        }
        
        await mongoose.connection.close();
        process.exit(0);
      }
      if (existingUser.username === username) {
        console.error('❌ Username already exists:', username);
        await mongoose.connection.close();
        process.exit(1);
      }
    }

    // Validate inputs
    if (!name || !username || !email || !password) {
      console.error('❌ All fields are required');
      console.log('\nUsage: node createSuperAdminAuto.js [name] [username] [email] [password]');
      console.log('Example: node createSuperAdminAuto.js "John Doe" johndoe john@example.com password123\n');
      await mongoose.connection.close();
      process.exit(1);
    }

    if (password.length < 6) {
      console.error('❌ Password must be at least 6 characters');
      await mongoose.connection.close();
      process.exit(1);
    }

    console.log('📝 Creating superadmin with:');
    console.log(`   Name: ${name}`);
    console.log(`   Username: ${username}`);
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${'*'.repeat(password.length)}\n`);

    // Create superadmin
    const superadmin = await User.create({
      name,
      username,
      email,
      password,
      role: 'superadmin',
      permissions: [], // Superadmin doesn't need permissions array
      isActive: true,
      isEmailVerified: true, // Auto-verify superadmin
    });

    console.log('✅ Superadmin created successfully!\n');
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║              SUPERADMIN DETAILS                            ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
    console.log(`   ID: ${superadmin._id}`);
    console.log(`   Name: ${superadmin.name}`);
    console.log(`   Username: ${superadmin.username}`);
    console.log(`   Email: ${superadmin.email}`);
    console.log(`   Role: ${superadmin.role}`);
    console.log(`   Active: ${superadmin.isActive}`);
    console.log(`   Email Verified: ${superadmin.isEmailVerified}`);
    console.log(`   Created: ${superadmin.createdAt}`);
    console.log('\n🔐 Login Credentials:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log('\n🚀 You can now login at: http://localhost:5173/login\n');

    await mongoose.connection.close();
    console.log('🔌 Database connection closed\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error creating superadmin:', error.message);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

// Run the script
createSuperAdmin();
