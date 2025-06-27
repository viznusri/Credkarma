const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Behavior = require('./models/Behavior');
const User = require('./models/User');

// Load environment variables
dotenv.config();

// Function to generate random date within last 30 days
function getRandomDate() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
  const randomTime = thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime());
  return new Date(randomTime);
}

async function seedBehaviors() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get all users
    const users = await User.find();
    if (users.length === 0) {
      console.log('❌ No users found. Please create some users first.');
      process.exit(1);
    }

    console.log(`Found ${users.length} users. Creating behaviors...`);

    // Clear existing behaviors (optional - comment out if you want to keep existing data)
    // await Behavior.deleteMany({});
    // console.log('✅ Cleared existing behaviors');

    const behaviorTypes = [
      { type: 'payment_on_time', descriptions: [
        'Paid credit card bill on time',
        'Paid electricity bill before due date',
        'Cleared phone bill on time',
        'Paid rent on time',
        'Paid internet bill on schedule'
      ]},
      { type: 'payment_late', descriptions: [
        'Missed credit card payment deadline',
        'Late payment on utility bill',
        'Delayed rent payment',
        'Overdue phone bill payment'
      ]},
      { type: 'credit_utilization_low', descriptions: [
        'Maintained credit usage below 30%',
        'Reduced credit card balance',
        'Kept low balance on all cards',
        'Optimized credit utilization'
      ]},
      { type: 'credit_utilization_high', descriptions: [
        'Credit usage exceeded 70%',
        'High balance on credit cards',
        'Maxed out credit limit',
        'Excessive credit utilization'
      ]},
      { type: 'new_credit_account', descriptions: [
        'Opened new savings account',
        'Got approved for new credit card',
        'Started fixed deposit account',
        'Opened investment account'
      ]},
      { type: 'credit_check', descriptions: [
        'Checked credit score',
        'Credit inquiry for loan',
        'Credit report requested',
        'Hard inquiry on credit'
      ]}
    ];

    const allBehaviors = [];

    // For each user, create random behaviors
    for (const user of users) {
      const numBehaviors = Math.floor(Math.random() * 10) + 5; // 5-15 behaviors per user
      
      for (let i = 0; i < numBehaviors; i++) {
        const behaviorType = behaviorTypes[Math.floor(Math.random() * behaviorTypes.length)];
        const description = behaviorType.descriptions[Math.floor(Math.random() * behaviorType.descriptions.length)];
        
        const karmaPointsMap = {
          'payment_on_time': 10,
          'payment_late': -15,
          'credit_utilization_low': 5,
          'credit_utilization_high': -5,
          'new_credit_account': 3,
          'credit_check': -2
        };

        const behavior = {
          user: user._id,
          type: behaviorType.type,
          description: description,
          karmaPoints: karmaPointsMap[behaviorType.type],
          date: getRandomDate(),
          metadata: {
            amount: Math.floor(Math.random() * 5000) + 100,
            provider: ['Bank of America', 'Chase', 'Wells Fargo', 'Citi', 'Capital One'][Math.floor(Math.random() * 5)]
          }
        };

        allBehaviors.push(behavior);
      }
    }

    // Sort behaviors by date
    allBehaviors.sort((a, b) => a.date - b.date);

    // Insert behaviors
    const insertedBehaviors = await Behavior.insertMany(allBehaviors);
    console.log(`✅ Inserted ${insertedBehaviors.length} behaviors`);

    // Update user karma scores
    for (const user of users) {
      const userBehaviors = await Behavior.find({ user: user._id });
      const totalKarma = userBehaviors.reduce((sum, b) => sum + b.karmaPoints, 0);
      
      await User.findByIdAndUpdate(user._id, { karmaScore: totalKarma });
      console.log(`Updated ${user.username}'s karma score to ${totalKarma}`);
    }

    // Display summary
    console.log('\n📊 Behavior Summary:');
    const summary = await Behavior.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalKarma: { $sum: '$karmaPoints' }
        }
      }
    ]);

    summary.forEach(item => {
      console.log(`- ${item._id}: ${item.count} behaviors, ${item.totalKarma} total karma`);
    });

    console.log('\n✅ Behavior seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding behaviors:', error);
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
seedBehaviors();