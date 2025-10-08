// Webhook service for Hansard chatbot integration
export interface WebhookRequest {
  message: string;
  userId?: string;
  sessionId?: string;
  timestamp?: string;
  language?: string;
  metadata?: {
    source: 'text' | 'voice';
    browser?: string;
    userAgent?: string;
  };
}

export interface WebhookResponse {
  success: boolean;
  message: string;
  data?: {
    response: string;
    suggestions?: string[];
    metadata?: {
      processingTime?: number;
      model?: string;
      confidence?: number;
    };
  };
  error?: string;
}

class WebhookService {
  private webhookUrl: string;
  private timeout: number;

  constructor() {
    this.webhookUrl = 'https://n8n.granite-automations.app/webhook/hansard-chatbot';
    this.timeout = 30000; // 30 seconds timeout
  }

  async sendMessage(request: WebhookRequest): Promise<WebhookResponse> {
    try {
      console.log('Sending message to webhook:', request);

      const headers: Record<string, string> = {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
      };

      // Add language headers if provided (matching Python example)
      if (request.language) {
        headers['X-Lang'] = request.language;
        headers['Accept-Language'] = request.language;
      }

      // Create form data payload (matching Python example)
      const formData = new FormData();
      formData.append('message', request.message);
      
      if (request.userId) {
        formData.append('userId', request.userId);
      }
      
      if (request.sessionId) {
        formData.append('sessionId', request.sessionId);
      }
      
      if (request.language) {
        formData.append('lang', request.language);
      }
      
      if (request.timestamp) {
        formData.append('timestamp', request.timestamp);
      } else {
        formData.append('timestamp', new Date().toISOString());
      }

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers,
        body: formData,
        signal: AbortSignal.timeout(this.timeout),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Webhook response:', data);

      // Handle the actual webhook response format: {"output": "response text"}
      const responseText = data.output || data.response || data.message || 'No response received';
      
      return {
        success: true,
        message: 'Message sent successfully',
        data: {
          response: responseText,
          rawData: data
        },
      };
    } catch (error) {
      console.error('Webhook error:', error);
      console.error('Request details:', {
        url: this.webhookUrl,
        message: request.message,
        language: request.language,
        userId: request.userId,
        sessionId: request.sessionId
      });
      
      let errorMessage = 'Failed to send message to chatbot';
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Request timeout - chatbot is taking too long to respond';
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Network error - unable to connect to chatbot service. Please check your internet connection.';
        } else if (error.message.includes('CORS')) {
          errorMessage = 'CORS error - cross-origin request blocked. Please check server configuration.';
        } else if (error.message.includes('HTTP error')) {
          errorMessage = `Server error: ${error.message}`;
        } else {
          errorMessage = `Chatbot error: ${error.message}`;
        }
      }

      return {
        success: false,
        message: errorMessage,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Test webhook connectivity
  async testConnection(): Promise<boolean> {
    try {
      const testRequest: WebhookRequest = {
        message: 'test connection',
        language: 'en',
        metadata: {
          source: 'text',
          browser: navigator.userAgent,
        },
      };

      const response = await this.sendMessage(testRequest);
      return response.success;
    } catch (error) {
      console.error('Webhook connection test failed:', error);
      return false;
    }
  }

  // Generate session ID for tracking conversations
  generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Generate user ID for tracking
  generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export const webhookService = new WebhookService();
export default webhookService;
