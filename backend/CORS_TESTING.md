# CORS Testing Guide

## Issue
The register API and potentially other APIs are experiencing CORS errors.

## Solution Applied
1. Updated CORS configuration to allow all origins in development
2. Added explicit CORS headers for all responses
3. Improved preflight request handling
4. Increased rate limit for auth endpoints from 5 to 10 requests
5. Added proper error handling middleware

## Testing CORS

### 1. Start the Backend Server
```bash
cd backend
npm run dev
```

### 2. Test CORS Configuration
```bash
cd backend
node test-cors.js
```

### 3. Start the Frontend
```bash
cd frontend
npm start
```

### 4. Manual Testing
- Try registering a new user
- Try logging in
- Check browser console for any CORS errors

## Key Changes Made:

1. **Server.js CORS Configuration**:
   - Simplified CORS to allow all origins in development
   - Added explicit CORS headers middleware
   - Better OPTIONS request handling

2. **Frontend API Configuration**:
   - Added `withCredentials: true` to axios instance
   - Ensured proper Content-Type headers

3. **Rate Limiting**:
   - Increased auth endpoint limit from 5 to 10 requests
   - Added `skipSuccessfulRequests: true` option

## If CORS Issues Persist:

1. Clear browser cache and cookies
2. Check if MongoDB is running
3. Verify backend is running on port 5000
4. Check browser network tab for exact error messages
5. Try using a different browser or incognito mode

## Production CORS Configuration
For production, update the CORS origin to specific allowed domains:
```javascript
const corsOptions = {
  origin: ['https://your-domain.com'],
  credentials: true,
  // ... other options
};
```