# Database Setup Guide for CREDKarma

MongoDB is not currently installed on your system. Here are three options to get your database working:

## Option 1: Use MongoDB Atlas (Cloud - Recommended for Quick Setup)

MongoDB Atlas provides a free cloud database that's perfect for development.

### Steps:
1. **Create a MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for a free account

2. **Create a Cluster**
   - Click "Build a Cluster"
   - Choose the FREE tier (M0)
   - Select your preferred region
   - Click "Create Cluster"

3. **Set up Database Access**
   - Go to "Database Access" in the left menu
   - Click "Add New Database User"
   - Create a username and password (save these!)
   - Give the user "Read and write to any database" permission

4. **Set up Network Access**
   - Go to "Network Access" in the left menu
   - Click "Add IP Address"
   - For development, click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production, add only your server's IP

5. **Get Your Connection String**
   - Go to "Clusters" and click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - It will look like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<dbname>?retryWrites=true&w=majority`

6. **Update Your .env File**
   ```
   MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/credkarma?retryWrites=true&w=majority
   ```

## Option 2: Install MongoDB Locally (macOS)

### Using Homebrew:
```bash
# Add MongoDB tap
brew tap mongodb/brew

# Install MongoDB Community Edition
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Verify it's running
brew services list
```

### After Installation:
Your local MongoDB URI will be:
```
MONGODB_URI=mongodb://localhost:27017/credkarma
```

## Option 3: Use Docker (If you have Docker installed)

### Create docker-compose.yml:
```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:latest
    container_name: credkarma-mongodb
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_DATABASE: credkarma
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

### Run Docker:
```bash
# Start MongoDB container
docker-compose up -d

# Check if it's running
docker ps
```

### Docker MongoDB URI:
```
MONGODB_URI=mongodb://localhost:27017/credkarma
```

## Quick Setup Script (for MongoDB Atlas)

I've created a setup script to help you configure MongoDB Atlas quickly: