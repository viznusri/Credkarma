const mongoose = require('mongoose');
const dotenv = require('dotenv');
const readline = require('readline');

// Load environment variables
dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('=== CREDKarma Database Setup ===\n');

async function testConnection(uri) {
  try {
    console.log('Testing database connection...');
    await mongoose.connect(uri);
    console.log('✅ Successfully connected to MongoDB!');
    
    // Test creating a collection
    const testCollection = mongoose.connection.collection('test');
    await testCollection.insertOne({ test: true, timestamp: new Date() });
    console.log('✅ Successfully wrote test data!');
    
    // Clean up test data
    await testCollection.deleteOne({ test: true });
    console.log('✅ Cleaned up test data!');
    
    await mongoose.disconnect();
    return true;
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    return false;
  }
}

async function setupDatabase() {
  console.log('Current MongoDB URI in .env:', process.env.MONGODB_URI || 'Not set');
  console.log('\nChoose an option:');
  console.log('1. Test current connection');
  console.log('2. Set up MongoDB Atlas (Cloud)');
  console.log('3. Use local MongoDB');
  console.log('4. Exit');
  
  rl.question('\nEnter your choice (1-4): ', async (choice) => {
    switch(choice) {
      case '1':
        if (!process.env.MONGODB_URI) {
          console.log('\n❌ No MongoDB URI found in .env file!');
          console.log('Please set up a database first.\n');
          setupDatabase();
        } else {
          const success = await testConnection(process.env.MONGODB_URI);
          if (success) {
            console.log('\n✅ Your database is properly configured!');
            console.log('You can now run: npm start\n');
            rl.close();
          } else {
            console.log('\n');
            setupDatabase();
          }
        }
        break;
        
      case '2':
        console.log('\n=== MongoDB Atlas Setup Guide ===');
        console.log('1. Go to https://www.mongodb.com/cloud/atlas');
        console.log('2. Create a free account and cluster');
        console.log('3. Set up a database user and allow network access');
        console.log('4. Get your connection string\n');
        
        rl.question('Enter your MongoDB Atlas connection string: ', async (uri) => {
          if (uri.includes('mongodb+srv://') || uri.includes('mongodb://')) {
            // Update .env file
            const fs = require('fs');
            const envPath = require('path').join(__dirname, '.env');
            let envContent = '';
            
            try {
              envContent = fs.readFileSync(envPath, 'utf8');
            } catch (e) {
              // File doesn't exist, create it
            }
            
            // Update or add MONGODB_URI
            if (envContent.includes('MONGODB_URI=')) {
              envContent = envContent.replace(/MONGODB_URI=.*/g, `MONGODB_URI=${uri}`);
            } else {
              envContent += `\nMONGODB_URI=${uri}`;
            }
            
            // Ensure other required variables exist
            if (!envContent.includes('PORT=')) {
              envContent = `PORT=5000\n${envContent}`;
            }
            if (!envContent.includes('JWT_SECRET=')) {
              envContent += '\nJWT_SECRET=your-secret-key-change-this-in-production';
            }
            
            fs.writeFileSync(envPath, envContent.trim());
            console.log('\n✅ Updated .env file with new MongoDB URI');
            
            // Test the connection
            const success = await testConnection(uri);
            if (success) {
              console.log('\n✅ Database setup complete!');
              console.log('You can now run: npm start\n');
            }
          } else {
            console.log('\n❌ Invalid MongoDB URI format!');
            console.log('URI should start with mongodb:// or mongodb+srv://\n');
            setupDatabase();
          }
          rl.close();
        });
        break;
        
      case '3':
        console.log('\n=== Local MongoDB Setup ===');
        console.log('Make sure MongoDB is installed and running locally.');
        console.log('Default local URI: mongodb://localhost:27017/credkarma\n');
        
        const localUri = 'mongodb://localhost:27017/credkarma';
        const success = await testConnection(localUri);
        
        if (success) {
          // Update .env file
          const fs = require('fs');
          const envPath = require('path').join(__dirname, '.env');
          let envContent = '';
          
          try {
            envContent = fs.readFileSync(envPath, 'utf8');
          } catch (e) {
            // File doesn't exist, create it
          }
          
          // Update or add MONGODB_URI
          if (envContent.includes('MONGODB_URI=')) {
            envContent = envContent.replace(/MONGODB_URI=.*/g, `MONGODB_URI=${localUri}`);
          } else {
            envContent += `\nMONGODB_URI=${localUri}`;
          }
          
          // Ensure other required variables exist
          if (!envContent.includes('PORT=')) {
            envContent = `PORT=5000\n${envContent}`;
          }
          if (!envContent.includes('JWT_SECRET=')) {
            envContent += '\nJWT_SECRET=your-secret-key-change-this-in-production';
          }
          
          fs.writeFileSync(envPath, envContent.trim());
          console.log('\n✅ Updated .env file with local MongoDB URI');
          console.log('✅ Database setup complete!');
          console.log('You can now run: npm start\n');
        } else {
          console.log('\n❌ Could not connect to local MongoDB!');
          console.log('Please install MongoDB first:');
          console.log('brew tap mongodb/brew');
          console.log('brew install mongodb-community');
          console.log('brew services start mongodb-community\n');
        }
        rl.close();
        break;
        
      case '4':
        console.log('\nExiting...');
        rl.close();
        break;
        
      default:
        console.log('\n❌ Invalid choice!\n');
        setupDatabase();
    }
  });
}

// Start the setup
setupDatabase();