const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

// Load environment variables
dotenv.config();

const users = [
  {
    username: 'admin',
    email: 'admin@credkarma.com',
    password: 'admin123',
    role: 'admin',
    karmaScore: 500
  },
  {
    username: 'john_doe',
    email: 'john@example.com',
    password: 'user123',
    role: 'user',
    karmaScore: 150
  },
  {
    username: 'jane_smith',
    email: 'jane@example.com',
    password: 'user123',
    role: 'user',
    karmaScore: 75
  },
  {
    username: 'mike_wilson',
    email: 'mike@example.com',
    password: 'user123',
    role: 'user',
    karmaScore: 200
  },
  {
    username: 'sarah_jones',
    email: 'sarah@example.com',
    password: 'user123',
    role: 'user',
    karmaScore: 320
  }
];

async function seedUsers() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing users (optional - comment out if you want to keep existing data)
    // await User.deleteMany({});
    // console.log('✅ Cleared existing users');

    // Create users
    for (const userData of users) {
      // Check if user already exists
      const existingUser = await User.findOne({ 
        $or: [{ email: userData.email }, { username: userData.username }] 
      });
      
      if (existingUser) {
        console.log(`⚠️  User ${userData.username} already exists, skipping...`);
        continue;
      }

      const user = new User(userData);
      await user.save();
      console.log(`✅ Created ${userData.role}: ${userData.username} (${userData.email})`);
    }

    // Display login credentials
    console.log('\n📋 Login Credentials:');
    console.log('===================');
    console.log('👤 Admin Account:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('   Role: Administrator');
    console.log('   Access: Analytics, Karma Score, Behavior Feed, Rewards');
    console.log('');
    console.log('👤 User Accounts:');
    console.log('   Username: john_doe, jane_smith, mike_wilson, sarah_jones');
    console.log('   Password: user123');
    console.log('   Role: User');
    console.log('   Access: Behavior Feed, Rewards');
    console.log('');

    const totalUsers = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: 'admin' });
    const userCount = await User.countDocuments({ role: 'user' });
    
    console.log(`📊 Total Users: ${totalUsers}`);
    console.log(`   Admins: ${adminCount}`);
    console.log(`   Users: ${userCount}`);

    console.log('\n✅ User seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    process.exit(1);
  }
}

// Check if MongoDB URI is set
if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env file!');
  console.error('Please run: node setup-db.js first');
  process.exit(1);
}

// Run the seed function
seedUsers();