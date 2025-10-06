'use client';

// Dynamic import to handle SSR issues
let pipeline: any = null;
let env: any = null;

// Initialize transformers dynamically
const initializeTransformers = async () => {
  if (typeof window === 'undefined') {
    throw new Error('Transformers can only be used in the browser');
  }

  try {
    const transformers = await import('@xenova/transformers');
    pipeline = transformers.pipeline;
    env = transformers.env;
    
    // Configure transformers to use local models
    env.allowRemoteModels = false;
    env.allowLocalModels = true;
    
    return { pipeline, env };
  } catch (error) {
    console.error('Failed to load transformers:', error);
    throw new Error('Failed to load AI models. Please refresh the page and try again.');
  }
};

export interface TranscriptionResult {
  text: string;
  confidence?: number;
  language?: string;
  duration?: number;
}

export interface WhisperConfig {
  model: string;
  language?: string;
  task?: 'transcribe' | 'translate';
  chunk_length_s?: number;
  stride_length_s?: number;
}

class WhisperService {
  private static instance: WhisperService;
  private transcriber: any = null;
  private isInitialized = false;
  private isInitializing = false;
  private config: WhisperConfig;

  constructor() {
    this.config = {
      model: 'Xenova/whisper-tiny.en', // Lightweight model for browser
      language: 'en',
      task: 'transcribe',
      chunk_length_s: 30,
      stride_length_s: 5,
    };
  }

  public static getInstance(): WhisperService {
    if (!WhisperService.instance) {
      WhisperService.instance = new WhisperService();
    }
    return WhisperService.instance;
  }

  /**
   * Initialize the Whisper model
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    if (this.isInitializing) {
      // Wait for initialization to complete
      while (this.isInitializing) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return;
    }

    this.isInitializing = true;

    try {
      console.log('Initializing Whisper model...');
      
      // Initialize transformers first
      await initializeTransformers();
      
      if (!pipeline) {
        throw new Error('Failed to load transformers pipeline');
      }
      
      // Load the Whisper model
      this.transcriber = await pipeline(
        'automatic-speech-recognition',
        this.config.model,
        {
          quantized: true, // Use quantized model for better performance
          progress_callback: (progress: any) => {
            console.log('Model loading progress:', progress);
          }
        }
      );

      this.isInitialized = true;
      console.log('Whisper model initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Whisper model:', error);
      throw new Error('Failed to initialize Whisper model. Please try again.');
    } finally {
      this.isInitializing = false;
    }
  }

  /**
   * Convert audio blob to the format expected by Whisper
   */
  private async prepareAudio(audioBlob: Blob): Promise<Float32Array> {
    return new Promise((resolve, reject) => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const fileReader = new FileReader();

      fileReader.onload = async (event) => {
        try {
          const arrayBuffer = event.target?.result as ArrayBuffer;
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          
          // Convert to mono and get the audio data
          const audioData = audioBuffer.getChannelData(0);
          resolve(audioData);
        } catch (error) {
          reject(new Error('Failed to process audio data'));
        }
      };

      fileReader.onerror = () => {
        reject(new Error('Failed to read audio file'));
      };

      fileReader.readAsArrayBuffer(audioBlob);
    });
  }

  /**
   * Transcribe audio blob to text
   */
  public async transcribe(audioBlob: Blob): Promise<TranscriptionResult> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.transcriber) {
      throw new Error('Whisper model not initialized');
    }

    try {
      console.log('Starting transcription...');
      
      // Prepare audio data
      const audioData = await this.prepareAudio(audioBlob);
      
      // Perform transcription
      const result = await this.transcriber(audioData, {
        language: this.config.language,
        task: this.config.task,
        chunk_length_s: this.config.chunk_length_s,
        stride_length_s: this.config.stride_length_s,
      });

      console.log('Transcription completed:', result);

      return {
        text: result.text || '',
        language: result.language || this.config.language,
        duration: audioBlob.size / 16000, // Rough estimate
      };
    } catch (error) {
      console.error('Transcription failed:', error);
      throw new Error('Transcription failed. Please try again.');
    }
  }

  /**
   * Transcribe audio from MediaRecorder chunks
   */
  public async transcribeFromChunks(audioChunks: Blob[]): Promise<TranscriptionResult> {
    try {
      // Combine audio chunks into a single blob
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      return await this.transcribe(audioBlob);
    } catch (error) {
      console.error('Failed to transcribe from chunks:', error);
      throw error;
    }
  }

  /**
   * Check if the service is ready
   */
  public isReady(): boolean {
    return this.isInitialized && this.transcriber !== null;
  }

  /**
   * Get model information
   */
  public getModelInfo(): { model: string; language: string; task: string } {
    return {
      model: this.config.model,
      language: this.config.language || 'en',
      task: this.config.task || 'transcribe',
    };
  }

  /**
   * Update configuration
   */
  public updateConfig(newConfig: Partial<WhisperConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Clean up resources
   */
  public dispose(): void {
    this.transcriber = null;
    this.isInitialized = false;
    this.isInitializing = false;
  }
}

export default WhisperService;
