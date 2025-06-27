# CREDKarma Quick Start Guide

## 🚀 Database Setup (Required First!)

Since MongoDB is not installed on your system, you have two easy options:

### Option 1: MongoDB Atlas (Recommended - 5 minutes)

1. **Run the setup script:**
   ```bash
   cd backend
   npm run setup-db
   ```

2. **Choose option 2** (Set up MongoDB Atlas)

3. **Follow these steps:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free account
   - Create a free M0 cluster
   - Add a database user (remember the password!)
   - Allow network access from anywhere (for development)
   - Get your connection string
   - Paste it when prompted by the setup script

4. **Seed the database with rewards:**
   ```bash
   npm run seed-db
   ```

### Option 2: Install MongoDB Locally

1. **Install MongoDB:**
   ```bash
   brew tap mongodb/brew
   brew install mongodb-community
   brew services start mongodb-community
   ```

2. **Run the setup script:**
   ```bash
   cd backend
   npm run setup-db
   ```

3. **Choose option 3** (Use local MongoDB)

4. **Seed the database:**
   ```bash
   npm run seed-db
   ```

## 🎯 Start the Application

Once your database is set up:

```bash
# From the project root
npm start
```

This will start both frontend (http://localhost:3000) and backend (http://localhost:5000).

## ✅ Verify Everything Works

1. **Check backend health:**
   ```bash
   curl http://localhost:5000/api/health
   ```

2. **Register a new user** at http://localhost:3000/register

3. **Check the database** (if using local MongoDB):
   ```bash
   mongosh
   use credkarma
   db.users.find()
   ```

## 🛠️ Troubleshooting

### CORS Errors
- Make sure backend is running on port 5000
- Clear browser cache
- Try incognito mode

### Database Connection Errors
- Run `npm run setup-db` in the backend folder
- Make sure MongoDB URI is correct in `.env`
- For Atlas: Check IP whitelist settings
- For local: Ensure MongoDB service is running

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

## 📝 Database Management Commands

```bash
cd backend

# Setup database connection
npm run setup-db

# Seed initial rewards data
npm run seed-db

# Test database connection
node test-cors.js
```

## 🔐 Environment Variables

Your `.env` file should contain:
```
PORT=5000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key-change-this-in-production
```

## 📊 Sample User Behaviors

After registering, you can add behaviors like:
- ✅ "Paid credit card on time" (+20 karma)
- ✅ "Checked credit score" (+10 karma)
- ❌ "Missed payment" (-30 karma)
- ✅ "Reduced credit utilization" (+25 karma)

## 🏆 Available Rewards

The database is seeded with rewards like:
- 🌅 Early Bird (50 karma)
- 💸 Bill Master (100 karma)
- 🏆 Credit Guru (250 karma)
- 💰 Savings Champion (200 karma)
- 🧙‍♂️ Financial Wizard (500 karma)