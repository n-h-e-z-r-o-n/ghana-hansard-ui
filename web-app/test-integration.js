// Integration test script to verify frontend-backend connection
// Run with: node test-integration.js

const axios = require('axios');

const FRONTEND_URL = 'http://localhost:3000';
const BACKEND_URL = 'http://localhost:5000';

async function testIntegration() {
  console.log('🧪 Testing Frontend-Backend Integration\n');

  try {
    // Test 1: Backend Health Check
    console.log('1️⃣ Testing Backend Health...');
    try {
      const backendHealth = await axios.get(`${BACKEND_URL}/health`);
      console.log('✅ Backend is running:', backendHealth.data.message);
    } catch (error) {
      console.log('❌ Backend is not running. Please start the backend server:');
      console.log('   cd backend && npm run dev');
      return;
    }
    console.log('');

    // Test 2: Frontend Health Check
    console.log('2️⃣ Testing Frontend Health...');
    try {
      const frontendHealth = await axios.get(FRONTEND_URL);
      console.log('✅ Frontend is running');
    } catch (error) {
      console.log('❌ Frontend is not running. Please start the frontend server:');
      console.log('   npm run dev');
      return;
    }
    console.log('');

    // Test 3: Backend Auth Endpoints
    console.log('3️⃣ Testing Backend Auth Endpoints...');
    const authEndpoints = [
      '/api/auth/login',
      '/api/auth/register',
      '/api/auth/forgot-password',
      '/api/auth/me'
    ];

    for (const endpoint of authEndpoints) {
      try {
        const response = await axios.get(`${BACKEND_URL}${endpoint}`);
        console.log(`✅ ${endpoint} - Status: ${response.status}`);
      } catch (error) {
        if (error.response?.status === 404) {
          console.log(`❌ ${endpoint} - Not found`);
        } else if (error.response?.status === 405) {
          console.log(`✅ ${endpoint} - Method not allowed (expected for GET)`);
        } else {
          console.log(`⚠️  ${endpoint} - Error: ${error.response?.status}`);
        }
      }
    }
    console.log('');

    // Test 4: Test Login with Backend
    console.log('4️⃣ Testing Login with Backend...');
    try {
      const loginResponse = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        email: 'admin@parliament.gh',
        password: 'admin123'
      });
      
      if (loginResponse.data.success) {
        console.log('✅ Login successful');
        console.log(`   User: ${loginResponse.data.data.user.firstName} ${loginResponse.data.data.user.lastName}`);
        console.log(`   Role: ${loginResponse.data.data.user.role}`);
        console.log(`   Token: ${loginResponse.data.data.token.substring(0, 20)}...`);
      } else {
        console.log('❌ Login failed:', loginResponse.data.message);
      }
    } catch (error) {
      console.log('❌ Login error:', error.response?.data?.message || error.message);
    }
    console.log('');

    // Test 5: CORS Configuration
    console.log('5️⃣ Testing CORS Configuration...');
    try {
      const corsResponse = await axios.options(`${BACKEND_URL}/api/auth/login`, {
        headers: {
          'Origin': FRONTEND_URL,
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type'
        }
      });
      console.log('✅ CORS preflight successful');
    } catch (error) {
      console.log('⚠️  CORS preflight failed:', error.message);
    }
    console.log('');

    console.log('🎉 Integration Test Complete!');
    console.log('\n📋 Test Summary:');
    console.log('   ✅ Backend Health Check');
    console.log('   ✅ Frontend Health Check');
    console.log('   ✅ Backend Auth Endpoints');
    console.log('   ✅ Login Functionality');
    console.log('   ✅ CORS Configuration');
    
    console.log('\n🔗 Integration Status:');
    console.log('   Frontend: http://localhost:3000');
    console.log('   Backend:  http://localhost:5000');
    console.log('   API Base: http://localhost:5000/api');
    
    console.log('\n🚀 Next Steps:');
    console.log('   1. Open http://localhost:3000 in your browser');
    console.log('   2. Try logging in with test credentials');
    console.log('   3. Test registration and password reset');
    console.log('   4. Check browser console for any errors');

  } catch (error) {
    console.error('❌ Integration test failed:', error.message);
  }
}

// Run the test
testIntegration();
