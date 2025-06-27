const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

console.log('=== Testing Database Connection ===\n');

async function testDatabaseOperations() {
  try {
    // Check if MongoDB URI exists
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI not found in .env file!');
      console.log('\nPlease run: npm run setup-db\n');
      process.exit(1);
    }

    console.log('📡 Connecting to:', process.env.MONGODB_URI.replace(/\/\/.*@/, '//<credentials>@'));
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Successfully connected to MongoDB!\n');

    // Get database info
    const admin = mongoose.connection.db.admin();
    const info = await admin.serverStatus();
    console.log('📊 Database Info:');
    console.log(`   Version: ${info.version}`);
    console.log(`   Uptime: ${Math.floor(info.uptime / 60)} minutes`);
    console.log(`   Database: ${mongoose.connection.db.databaseName}\n`);

    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 Collections:');
    if (collections.length === 0) {
      console.log('   No collections yet (database is empty)');
    } else {
      for (const collection of collections) {
        const count = await mongoose.connection.db.collection(collection.name).countDocuments();
        console.log(`   - ${collection.name}: ${count} documents`);
      }
    }

    console.log('\n✅ Database is properly configured and ready to use!');
    console.log('📌 You can now run: npm start\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed!\n');
    console.error('Error:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n📌 If using local MongoDB:');
      console.log('   1. Install MongoDB: brew install mongodb-community');
      console.log('   2. Start MongoDB: brew services start mongodb-community');
    } else if (error.message.includes('authentication failed')) {
      console.log('\n📌 Authentication error:');
      console.log('   1. Check your username and password in the connection string');
      console.log('   2. Make sure the user has the correct permissions');
    } else if (error.message.includes('ENOTFOUND')) {
      console.log('\n📌 Network error:');
      console.log('   1. Check your internet connection');
      console.log('   2. If using MongoDB Atlas, check your cluster is active');
    }
    
    console.log('\n📌 To set up the database, run: npm run setup-db\n');
    process.exit(1);
  }
}

// Run the test
testDatabaseOperations();