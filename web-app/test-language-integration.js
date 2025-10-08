// Test script to verify language integration
const webhookService = require('./app/lib/webhook.ts');

// Mock fetch for testing
global.fetch = jest.fn();

describe('Language Integration Test', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('should include language in webhook request headers', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ response: 'Test response' })
    };
    
    fetch.mockResolvedValueOnce(mockResponse);

    const request = {
      message: 'Test message',
      userId: 'test-user',
      sessionId: 'test-session',
      language: 'ak', // Akan language
      metadata: {
        source: 'text',
        browser: 'test-browser'
      }
    };

    await webhookService.sendMessage(request);

    expect(fetch).toHaveBeenCalledWith(
      'https://n8n.granite-automations.app/webhook/hansard-chatbot',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Language': 'ak'
        }),
        body: expect.stringContaining('"language":"ak"')
      })
    );
  });

  test('should not include language header when language is not provided', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ response: 'Test response' })
    };
    
    fetch.mockResolvedValueOnce(mockResponse);

    const request = {
      message: 'Test message',
      userId: 'test-user',
      sessionId: 'test-session',
      metadata: {
        source: 'text',
        browser: 'test-browser'
      }
    };

    await webhookService.sendMessage(request);

    expect(fetch).toHaveBeenCalledWith(
      'https://n8n.granite-automations.app/webhook/hansard-chatbot',
      expect.objectContaining({
        method: 'POST',
        headers: expect.not.objectContaining({
          'X-Language': expect.anything()
        })
      })
    );
  });
});

console.log('Language integration test completed successfully!');
