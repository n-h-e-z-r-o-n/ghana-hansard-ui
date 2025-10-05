// Webhook service for Hansard chatbot integration
export interface WebhookRequest {
  message: string;
  userId?: string;
  sessionId?: string;
  timestamp?: string;
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

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          ...request,
          timestamp: request.timestamp || new Date().toISOString(),
        }),
        signal: AbortSignal.timeout(this.timeout),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Webhook response:', data);

      return {
        success: true,
        message: 'Message sent successfully',
        data: data,
      };
    } catch (error) {
      console.error('Webhook error:', error);
      
      let errorMessage = 'Failed to send message to chatbot';
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Request timeout - chatbot is taking too long to respond';
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Network error - unable to connect to chatbot service';
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
