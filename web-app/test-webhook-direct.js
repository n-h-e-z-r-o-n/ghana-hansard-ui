// Direct webhook test to verify connectivity
const WEBHOOK_URL = "https://n8n.granite-automations.app/webhook/hansard-chatbot";

async function testWebhookDirect() {
  console.log('🧪 Testing webhook directly...');
  
  try {
    // Test 1: Simple form data request (matching Python example)
    const formData = new FormData();
    formData.append('message', 'Hello, testing Ghana parliamentary chatbot response');
    formData.append('lang', 'en');
    formData.append('userId', 'test-user-123');
    
    const headers = {
      'Accept': 'application/json',
      'X-Lang': 'en',
      'Accept-Language': 'en'
    };
    
    console.log('📤 Sending request to:', WEBHOOK_URL);
    console.log('📋 Headers:', headers);
    console.log('📦 Form data:', {
      message: 'Hello, testing Ghana parliamentary chatbot response',
      lang: 'en',
      userId: 'test-user-123'
    });
    
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers,
      body: formData
    });
    
    console.log('📊 Response status:', response.status);
    console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Success! Response:', data);
      return true;
    } else {
      const errorText = await response.text();
      console.log('❌ Error response:', errorText);
      return false;
    }
    
  } catch (error) {
    console.error('❌ Network error:', error);
    return false;
  }
}

// Test 2: Simple text request
async function testWebhookSimple() {
  console.log('\n🧪 Testing webhook with simple text...');
  
  try {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'text/plain'
    };
    
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers,
      body: 'Hello, this is a simple test message'
    });
    
    console.log('📊 Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Success! Response:', data);
      return true;
    } else {
      const errorText = await response.text();
      console.log('❌ Error response:', errorText);
      return false;
    }
    
  } catch (error) {
    console.error('❌ Network error:', error);
    return false;
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting webhook connectivity tests...\n');
  
  const test1 = await testWebhookDirect();
  const test2 = await testWebhookSimple();
  
  console.log('\n📋 Test Results:');
  console.log('Form Data Test:', test1 ? '✅ PASS' : '❌ FAIL');
  console.log('Simple Text Test:', test2 ? '✅ PASS' : '❌ FAIL');
  
  if (test1 || test2) {
    console.log('\n🎉 At least one test passed! Webhook is accessible.');
  } else {
    console.log('\n💥 All tests failed. Check network connectivity and webhook URL.');
  }
}

// Run tests (works in both Node.js 18+ and browser)
runTests();
