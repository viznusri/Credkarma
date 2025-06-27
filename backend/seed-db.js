const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Reward = require('./models/Reward');

// Load environment variables
dotenv.config();

const rewards = [
  {
    title: '🌅 Early Bird',
    description: 'Log in for 7 consecutive days and build a habit',
    karmaRequired: 50,
    category: 'badge',
    imageUrl: ''
  },
  {
    title: '💸 Bill Master',
    description: 'Pay 5 bills on time - Get 5% cashback on next payment',
    karmaRequired: 100,
    category: 'cashback',
    imageUrl: ''
  },
  {
    title: '🏆 Credit Guru',
    description: 'Maintain good credit behavior for 30 days - Unlock premium features',
    karmaRequired: 250,
    category: 'feature',
    imageUrl: ''
  },
  {
    title: '💰 Savings Champion',
    description: 'Save money for 3 consecutive months - Get 10% bonus on savings',
    karmaRequired: 200,
    category: 'cashback',
    imageUrl: ''
  },
  {
    title: '🎯 Debt Destroyer',
    description: 'Reduce credit utilization below 30% - Get exclusive discounts',
    karmaRequired: 150,
    category: 'discount',
    imageUrl: ''
  },
  {
    title: '🧙‍♂️ Financial Wizard',
    description: 'Reach 500 karma points - Unlock all premium features',
    karmaRequired: 500,
    category: 'feature',
    imageUrl: ''
  },
  {
    title: '📊 Budget Boss',
    description: 'Stick to budget for 2 months - Get 15% off on partner services',
    karmaRequired: 180,
    category: 'discount',
    imageUrl: ''
  },
  {
    title: '🥷 Credit Card Ninja',
    description: 'Pay credit card in full for 3 months - Get 2% extra cashback',
    karmaRequired: 300,
    category: 'cashback',
    imageUrl: ''
  }
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing rewards
    await Reward.deleteMany({});
    console.log('✅ Cleared existing rewards');

    // Insert new rewards
    const insertedRewards = await Reward.insertMany(rewards);
    console.log(`✅ Inserted ${insertedRewards.length} rewards`);

    // Display inserted rewards
    console.log('\nInserted rewards:');
    insertedRewards.forEach(reward => {
      console.log(`- ${reward.title} (${reward.karmaRequired} karma) - ${reward.category}`);
    });

    console.log('\n✅ Database seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
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
seedDatabase();