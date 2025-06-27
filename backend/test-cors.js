const axios = require('axios');

// Test CORS configuration
async function testCORS() {
  console.log('Testing CORS configuration...\n');
  
  try {
    // Test OPTIONS request (preflight)
    console.log('1. Testing OPTIONS request (preflight)...');
    const optionsResponse = await axios.options('http://localhost:5000/api/auth/register', {
      headers: {
        'Origin': 'http://localhost:3000',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'content-type'
      }
    });
    console.log('✓ OPTIONS request successful');
    console.log('CORS headers:', optionsResponse.headers);
    
  } catch (error) {
    console.log('✗ OPTIONS request failed:', error.message);
  }
  
  try {
    // Test actual POST request
    console.log('\n2. Testing POST request to /api/auth/register...');
    const postResponse = await axios.post('http://localhost:5000/api/auth/register', 
      {
        username: 'testuser',
        email: 'test@example.com',
        password: 'test123'
      },
      {
        headers: {
          'Origin': 'http://localhost:3000',
          'Content-Type': 'application/json'
        },
        validateStatus: function (status) {
          return status < 500; // Resolve only if the status code is less than 500
        }
      }
    );
    console.log('✓ POST request successful');
    console.log('Response status:', postResponse.status);
    console.log('Response data:', postResponse.data);
    
  } catch (error) {
    console.log('✗ POST request failed:', error.message);
    if (error.response) {
      console.log('Response status:', error.response.status);
      console.log('Response data:', error.response.data);
    }
  }
  
  try {
    // Test health endpoint
    console.log('\n3. Testing health endpoint...');
    const healthResponse = await axios.get('http://localhost:5000/api/health', {
      headers: {
        'Origin': 'http://localhost:3000'
      }
    });
    console.log('✓ Health check successful');
    console.log('Response:', healthResponse.data);
    
  } catch (error) {
    console.log('✗ Health check failed:', error.message);
  }
}

// Run the test
console.log('Make sure the backend server is running on port 5000\n');
testCORS();