'use client';

export interface TranscriptionResult {
  text: string;
  confidence?: number;
  language?: string;
  duration?: number;
}

/**
 * Fallback transcription service that uses Web Speech API
 * This is used when Whisper is not available or fails to load
 */
class WhisperFallback {
  private static instance: WhisperFallback;
  private isInitialized = false;

  constructor() {}

  public static getInstance(): WhisperFallback {
    if (!WhisperFallback.instance) {
      WhisperFallback.instance = new WhisperFallback();
    }
    return WhisperFallback.instance;
  }

  /**
   * Initialize the fallback service
   */
  public async initialize(): Promise<void> {
    this.isInitialized = true;
    console.log('Whisper fallback service initialized');
  }

  /**
   * Transcribe audio using Web Speech API
   */
  public async transcribe(audioBlob: Blob): Promise<TranscriptionResult> {
    return new Promise((resolve, reject) => {
      // Create an audio element to play the blob
      const audio = new Audio();
      const url = URL.createObjectURL(audioBlob);
      audio.src = url;

      // Check if Web Speech API is available
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        reject(new Error('Speech recognition not available'));
        return;
      }

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        console.log('Fallback speech recognition started');
        // Play the audio
        audio.play().catch(console.error);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        console.log('Fallback speech recognition result:', transcript);
        
        resolve({
          text: transcript,
          language: 'en',
          duration: audio.duration || 0,
        });
        
        // Clean up
        URL.revokeObjectURL(url);
      };

      recognition.onerror = (event: any) => {
        console.error('Fallback speech recognition error:', event.error);
        reject(new Error(`Speech recognition error: ${event.error}`));
        URL.revokeObjectURL(url);
      };

      recognition.onend = () => {
        console.log('Fallback speech recognition ended');
        URL.revokeObjectURL(url);
      };

      // Start recognition
      recognition.start();
    });
  }

  /**
   * Check if the service is ready
   */
  public isReady(): boolean {
    return this.isInitialized;
  }

  /**
   * Get model information
   */
  public getModelInfo(): { model: string; language: string; task: string } {
    return {
      model: 'Web Speech API',
      language: 'en',
      task: 'transcribe',
    };
  }

  /**
   * Clean up resources
   */
  public dispose(): void {
    this.isInitialized = false;
  }
}

export default WhisperFallback;
