'use client';

export interface AudioProcessorConfig {
  sampleRate: number;
  channels: number;
  bitDepth: number;
  maxDuration: number; // in seconds
}

export interface AudioLevel {
  level: number;
  isActive: boolean;
}

class AudioProcessor {
  private static instance: AudioProcessor;
  private config: AudioProcessorConfig;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private microphone: MediaStreamAudioSourceNode | null = null;
  private stream: MediaStream | null = null;
  private animationFrameId: number | null = null;

  constructor() {
    this.config = {
      sampleRate: 16000, // Whisper expects 16kHz
      channels: 1, // Mono
      bitDepth: 16,
      maxDuration: 300, // 5 minutes max
    };
  }

  public static getInstance(): AudioProcessor {
    if (!AudioProcessor.instance) {
      AudioProcessor.instance = new AudioProcessor();
    }
    return AudioProcessor.instance;
  }

  /**
   * Initialize audio context and analyser
   */
  public async initialize(): Promise<void> {
    if (this.audioContext) {
      return;
    }

    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: this.config.sampleRate,
      });

      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.8;

      console.log('Audio processor initialized');
    } catch (error) {
      console.error('Failed to initialize audio processor:', error);
      throw new Error('Failed to initialize audio processing');
    }
  }

  /**
   * Start monitoring audio levels from microphone
   */
  public async startAudioMonitoring(
    onLevelUpdate: (level: AudioLevel) => void
  ): Promise<MediaStream> {
    if (!this.audioContext) {
      await this.initialize();
    }

    try {
      // Get microphone access
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: this.config.sampleRate,
          channelCount: this.config.channels,
        },
      });

      if (!this.audioContext || !this.analyser) {
        throw new Error('Audio context not initialized');
      }

      // Create microphone source
      this.microphone = this.audioContext.createMediaStreamSource(this.stream);
      this.microphone.connect(this.analyser);

      // Start monitoring audio levels
      this.monitorAudioLevel(onLevelUpdate);

      return this.stream;
    } catch (error) {
      console.error('Failed to start audio monitoring:', error);
      throw new Error('Failed to access microphone');
    }
  }

  /**
   * Monitor audio levels and call callback
   */
  private monitorAudioLevel(onLevelUpdate: (level: AudioLevel) => void): void {
    if (!this.analyser) return;

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);

    const updateLevel = () => {
      this.analyser!.getByteFrequencyData(dataArray);
      
      // Calculate average level
      const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
      const normalizedLevel = average / 255;
      
      onLevelUpdate({
        level: normalizedLevel,
        isActive: normalizedLevel > 0.01, // Threshold for detecting speech
      });

      this.animationFrameId = requestAnimationFrame(updateLevel);
    };

    updateLevel();
  }

  /**
   * Stop audio monitoring
   */
  public stopAudioMonitoring(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }

    if (this.microphone) {
      this.microphone.disconnect();
      this.microphone = null;
    }
  }

  /**
   * Convert audio blob to the format expected by Whisper
   */
  public async processAudioForWhisper(audioBlob: Blob): Promise<Float32Array> {
    if (!this.audioContext) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.onload = async (event) => {
        try {
          const arrayBuffer = event.target?.result as ArrayBuffer;
          
          if (!this.audioContext) {
            throw new Error('Audio context not available');
          }

          const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
          
          // Convert to mono if stereo
          let audioData: Float32Array;
          if (audioBuffer.numberOfChannels > 1) {
            audioData = this.convertToMono(audioBuffer);
          } else {
            audioData = audioBuffer.getChannelData(0);
          }

          // Resample to 16kHz if needed
          if (audioBuffer.sampleRate !== this.config.sampleRate) {
            audioData = this.resampleAudio(audioData, audioBuffer.sampleRate, this.config.sampleRate);
          }

          resolve(audioData);
        } catch (error) {
          console.error('Failed to process audio:', error);
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
   * Convert stereo audio to mono
   */
  private convertToMono(audioBuffer: AudioBuffer): Float32Array {
    const leftChannel = audioBuffer.getChannelData(0);
    const rightChannel = audioBuffer.getChannelData(1);
    const monoData = new Float32Array(leftChannel.length);

    for (let i = 0; i < leftChannel.length; i++) {
      monoData[i] = (leftChannel[i] + rightChannel[i]) / 2;
    }

    return monoData;
  }

  /**
   * Resample audio to target sample rate
   */
  private resampleAudio(
    audioData: Float32Array,
    sourceSampleRate: number,
    targetSampleRate: number
  ): Float32Array {
    if (sourceSampleRate === targetSampleRate) {
      return audioData;
    }

    const ratio = sourceSampleRate / targetSampleRate;
    const newLength = Math.floor(audioData.length / ratio);
    const resampledData = new Float32Array(newLength);

    for (let i = 0; i < newLength; i++) {
      const sourceIndex = Math.floor(i * ratio);
      resampledData[i] = audioData[sourceIndex];
    }

    return resampledData;
  }

  /**
   * Create a WAV blob from audio data
   */
  public createWavBlob(audioData: Float32Array, sampleRate: number): Blob {
    const length = audioData.length;
    const buffer = new ArrayBuffer(44 + length * 2);
    const view = new DataView(buffer);

    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * 2, true);

    // Convert float32 to int16
    let offset = 44;
    for (let i = 0; i < length; i++) {
      const sample = Math.max(-1, Math.min(1, audioData[i]));
      view.setInt16(offset, sample * 0x7FFF, true);
      offset += 2;
    }

    return new Blob([buffer], { type: 'audio/wav' });
  }

  /**
   * Get audio duration from blob
   */
  public async getAudioDuration(audioBlob: Blob): Promise<number> {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.onloadedmetadata = () => {
        resolve(audio.duration);
      };
      audio.onerror = () => {
        reject(new Error('Failed to load audio metadata'));
      };
      audio.src = URL.createObjectURL(audioBlob);
    });
  }

  /**
   * Check if audio duration is within limits
   */
  public isDurationValid(duration: number): boolean {
    return duration <= this.config.maxDuration;
  }

  /**
   * Clean up resources
   */
  public dispose(): void {
    this.stopAudioMonitoring();

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.analyser = null;
  }
}

export default AudioProcessor;
