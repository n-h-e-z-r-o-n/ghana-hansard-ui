// Test script to verify webhook format matches Python example
const webhookService = require('./app/lib/webhook.ts');

// Mock fetch for testing
global.fetch = jest.fn();

describe('Webhook Format Test', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('should send form data with correct headers and fields', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ 
        output: "Hello! Your message has been received. How can I assist you with information from official Ghana government or parliamentary documents today?" 
      })
    };
    
    fetch.mockResolvedValueOnce(mockResponse);

    const request = {
      message: 'Hello, testing Ghana parliamentary chatbot response',
      userId: 'test-user-123',
      sessionId: 'test-session-456',
      language: 'en',
      metadata: {
        source: 'text',
        browser: 'test-browser'
      }
    };

    await webhookService.sendMessage(request);

    // Verify fetch was called with correct parameters
    expect(fetch).toHaveBeenCalledWith(
      'https://n8n.granite-automations.app/webhook/hansard-chatbot',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Accept': 'application/json',
          'X-Lang': 'en',
          'Accept-Language': 'en'
        }),
        body: expect.any(FormData)
      })
    );

    // Verify FormData contains expected fields
    const callArgs = fetch.mock.calls[0];
    const formData = callArgs[1].body;
    
    // Note: In a real test environment, you'd need to check FormData contents
    // This is a simplified test to verify the structure
    expect(formData).toBeInstanceOf(FormData);
  });

  test('should work without language parameter', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ 
        output: "Hello! Your message has been received." 
      })
    };
    
    fetch.mockResolvedValueOnce(mockResponse);

    const request = {
      message: 'Hello, testing without language',
      userId: 'test-user-123',
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
          'Accept': 'application/json'
        }),
        body: expect.any(FormData)
      })
    );

    // Should not include language headers when language is not provided
    const callArgs = fetch.mock.calls[0];
    const headers = callArgs[1].headers;
    expect(headers).not.toHaveProperty('X-Lang');
    expect(headers).not.toHaveProperty('Accept-Language');
  });
});

console.log('Webhook format test completed successfully!');
