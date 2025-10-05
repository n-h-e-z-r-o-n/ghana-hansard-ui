// Simple test script to verify webhook integration
const webhookUrl = 'https://n8n.granite-automations.app/webhook/hansard-chatbot';

async function testWebhook() {
  try {
    console.log('Testing webhook connection...');
    
    const testMessage = {
      message: 'Hello, this is a test message from the Hansard UI',
      userId: 'test_user_123',
      sessionId: 'test_session_456',
      timestamp: new Date().toISOString(),
      metadata: {
        source: 'text',
        browser: 'test-browser',
        userAgent: 'test-agent'
      }
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(testMessage),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Webhook test successful!');
    console.log('Response:', data);
    
    return true;
  } catch (error) {
    console.error('❌ Webhook test failed:', error.message);
    return false;
  }
}

// Run the test
testWebhook().then(success => {
  if (success) {
    console.log('🎉 Webhook integration is working correctly!');
  } else {
    console.log('⚠️ Webhook integration needs attention.');
  }
});
