# CREDKarma Web Application

A modern full-stack web application for tracking credit behavior and earning karma points with a gamified rewards system.

![CREDKarma](https://img.shields.io/badge/CREDKarma-Credit%20Tracking-6366f1?style=for-the-badge&logo=creditcard&logoColor=white)

## 🎯 Features

### User Features
- **Authentication System**: Secure login/register with JWT tokens
- **Credit Behavior Tracking**: Track various credit-related behaviors
- **Karma Points System**: Earn points for positive credit behaviors
- **Rewards Marketplace**: Unlock rewards based on karma score
- **Interactive Dashboard**: View statistics and progress
- **Behavior Feed**: Paginated table view of all credit behaviors
- **Profile Management**: View karma score and user details

### Admin Features
- **Analytics Dashboard**: Comprehensive overview of platform statistics
- **User Management**: View and manage all users
- **Behavior Statistics**: Detailed charts and metrics
- **System Monitoring**: Track platform growth and engagement

### UI/UX Features
- **Modern Design**: Clean, minimalist interface with purple accent theme
- **Responsive Layout**: Works seamlessly on desktop and mobile devices
- **Interactive Modals**: Click rewards to view details and unlock
- **Toast Notifications**: Real-time feedback with react-hot-toast
- **Font Awesome Icons**: Consistent iconography throughout
- **Smooth Animations**: Subtle transitions and hover effects

## 🛠 Tech Stack

### Frontend
- **React 19.1.0** with TypeScript
- **React Router v6** for navigation
- **React Hook Form** with Yup validation
- **Recharts** for data visualization
- **React Hot Toast** for notifications
- **Font Awesome** for icons
- **CSS3** with modern styling

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Express Validator** for input validation
- **Helmet.js** for security headers
- **Express Rate Limit** for API protection

### Deployment
- **Firebase Hosting** for frontend
- **Firebase Functions** for serverless backend
- **MongoDB Atlas** for cloud database

## 📁 Project Structure

```
credkarma-web/
├── frontend/                 # React TypeScript application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API services
│   │   ├── types/           # TypeScript definitions
│   │   ├── App.tsx          # Main app component
│   │   └── App.css          # Global styles
│   └── package.json
├── backend/                 # Express.js API server
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── scripts/            # Database setup scripts
│   └── server.js           # Server entry point
├── functions/              # Firebase Functions (production)
├── firebase.json           # Firebase configuration
└── package.json           # Root package with scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js v18 or higher
- MongoDB (local or Atlas account)
- Firebase CLI (`npm install -g firebase-tools`)
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd credkarma-web
   ```

2. **Install dependencies:**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables:**

   Create `.env` file in the backend directory:
   ```env
   NODE_ENV=development
   JWT_SECRET=your-secret-key
   MONGODB_URI=mongodb://localhost:27017/credkarma
   PORT=5001
   ```

4. **Set up the database:**
   ```bash
   cd backend
   npm run setup-db
   ```
   - Choose Option 2 for MongoDB Atlas (recommended)
   - Or Option 3 for local MongoDB

5. **Seed initial data:**
   ```bash
   npm run seed-db
   ```

### Development

Run both frontend and backend concurrently:
```bash
npm start
```

Or run them separately:
```bash
npm run frontend   # React app on http://localhost:3000
npm run backend    # API server on http://localhost:5001
```

### Test Accounts

After seeding the database, you can use these test accounts:
- **Admin**: username: `admin`, password: `admin123`
- **User**: username: `testuser`, password: `password123`

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Users
- `GET /api/users/me` - Get current user profile
- `GET /api/users/leaderboard` - Get karma leaderboard

### Behaviors
- `GET /api/behaviors` - Get user's behaviors
- `POST /api/behaviors` - Log new behavior
- `GET /api/behaviors/summary` - Get behavior statistics

### Rewards
- `GET /api/rewards` - Get all rewards with unlock status
- `POST /api/rewards/:id/unlock` - Unlock a reward
- `POST /api/rewards/seed` - Seed sample rewards (dev only)

### Admin Dashboard
- `GET /api/dashboard/analytics` - Get platform analytics (admin only)

## 🔐 Security Features

- **JWT Authentication** with 7-day expiry
- **Password Hashing** using bcrypt (10 rounds)
- **Rate Limiting**: 
  - General: 100 requests per 15 minutes
  - Auth endpoints: 5 requests per 15 minutes
- **Input Validation** on all endpoints
- **CORS Protection** with whitelisted origins
- **Security Headers** via Helmet.js
- **Role-Based Access Control** (User/Admin)

## 🎨 UI Components

### Navigation
- **Routes**:
  - `/` - Redirects based on auth status
  - `/login` - User login page
  - `/register` - User registration with terms acceptance
  - `/routes/dashboard` - Admin analytics (admin only)
  - `/routes/feed` - Behavior feed
  - `/routes/karma` - Karma score details (admin only)
  - `/routes/rewards` - Rewards marketplace

### Key Features
- **Behavior Feed**: Paginated table with 10 items per page
- **Rewards Modal**: Click any reward to view details
- **Responsive Sidebar**: Collapsible navigation menu
- **Real-time Updates**: Toast notifications for all actions
- **Terms & Conditions**: Required checkbox on registration

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- Desktop: 1024px and above
- Tablet: 768px - 1023px
- Mobile: Below 768px

## 🚀 Deployment

### Firebase Setup

1. **Create Firebase project:**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create a new project
   - Enable Hosting and Functions

2. **Configure Firebase:**
   ```bash
   firebase login
   firebase use your-project-id
   ```

3. **Set environment variables:**
   ```bash
   firebase functions:config:set \
     mongodb.uri="your-mongodb-atlas-uri" \
     jwt.secret="your-production-jwt-secret"
   ```

4. **Deploy:**
   ```bash
   npm run deploy
   ```

### MongoDB Atlas Setup

1. Create free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Add network access: `0.0.0.0/0` (for Firebase Functions)
3. Create database user with read/write permissions
4. Get connection string and update Firebase config

## 🧪 Testing

Run tests:
```bash
cd frontend
npm test
```

Test database connection:
```bash
cd backend
npm run test-db
```

## 📝 Scripts Reference

### Root Directory
- `npm start` - Start full stack development
- `npm run install:all` - Install all dependencies
- `npm run deploy` - Deploy to Firebase
- `npm run deploy:functions` - Deploy backend only
- `npm run deploy:hosting` - Deploy frontend only

### Backend Scripts
- `npm run setup-db` - Interactive database setup
- `npm run seed-db` - Seed initial data
- `npm run test-db` - Test database connection

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed:**
   - Check if MongoDB is running locally
   - Verify Atlas connection string
   - Check network/firewall settings

2. **Firebase Deployment Errors:**
   - Ensure Firebase CLI is installed
   - Check if you're logged in: `firebase login`
   - Verify project ID in `.firebaserc`

3. **CORS Issues in Production:**
   - Check Firebase rewrites configuration
   - Verify API endpoints use relative paths

4. **Build Errors:**
   - Clear node_modules and reinstall
   - Check Node.js version (v18+ required)
   - Run `npm audit fix --legacy-peer-deps`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Font Awesome for icons
- React Hot Toast for notifications
- Recharts for data visualization
- MongoDB Atlas for database hosting
- Firebase for deployment platform