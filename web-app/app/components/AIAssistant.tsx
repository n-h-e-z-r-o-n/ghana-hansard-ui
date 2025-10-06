'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  MicrophoneIcon, 
  PaperAirplaneIcon, 
  XMarkIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  CpuChipIcon,
  DocumentTextIcon,
  SpeakerWaveIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import webhookService, { WebhookRequest } from '../lib/webhook';
import WhisperService from '../lib/whisperService';
import WhisperFallback from '../lib/whisperFallback';
import AudioProcessor, { AudioLevel } from '../lib/audioProcessor';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isVoice?: boolean;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI Parliamentary Assistant. I can help you analyze debates, find information about bills, or answer questions about parliamentary proceedings. You can use text input or voice commands (if supported by your browser). How can I assist you today?",
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState('');
  const [recognitionSupported, setRecognitionSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [webhookConnected, setWebhookConnected] = useState<boolean | null>(null);
  const [whisperReady, setWhisperReady] = useState(false);
  const [whisperInitializing, setWhisperInitializing] = useState(false);
  const [audioLevel, setAudioLevel] = useState<AudioLevel>({ level: 0, isActive: false });
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const whisperServiceRef = useRef<WhisperService | null>(null);
  const whisperFallbackRef = useRef<WhisperFallback | null>(null);
  const audioProcessorRef = useRef<AudioProcessor | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check for speech recognition support and browser capabilities
  useEffect(() => {
    const checkBrowserSupport = () => {
      const speechSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
      const mediaSupported = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
      
      setRecognitionSupported(speechSupported);
      
      if (!speechSupported) {
        if (mediaSupported) {
          setVoiceError('Speech recognition not available, but audio recording is supported. You can record audio and we\'ll process it.');
        } else {
          setVoiceError('Voice features are not supported in this browser. Please use text input.');
        }
      }
    };

    const initializeWebhook = async () => {
      // Generate session and user IDs
      const newSessionId = webhookService.generateSessionId();
      const newUserId = webhookService.generateUserId();
      
      setSessionId(newSessionId);
      setUserId(newUserId);
      
      // Test webhook connection
      try {
        const connected = await webhookService.testConnection();
        setWebhookConnected(connected);
        console.log('Webhook connection test:', connected ? 'Connected' : 'Failed');
      } catch (error) {
        console.error('Webhook initialization error:', error);
        setWebhookConnected(false);
      }
    };

    const initializeWhisper = async () => {
      try {
        setWhisperInitializing(true);
        whisperServiceRef.current = WhisperService.getInstance();
        whisperFallbackRef.current = WhisperFallback.getInstance();
        audioProcessorRef.current = AudioProcessor.getInstance();
        
        // Initialize fallback first (always works)
        await whisperFallbackRef.current.initialize();
        
        // Initialize Whisper in the background without blocking the UI
        whisperServiceRef.current.initialize()
          .then(() => {
            setWhisperReady(true);
            console.log('Whisper service initialized successfully');
          })
          .catch((error) => {
            console.error('Whisper initialization error:', error);
            setWhisperReady(false);
            console.log('Falling back to Web Speech API');
          })
          .finally(() => {
            setWhisperInitializing(false);
          });
      } catch (error) {
        console.error('Whisper setup error:', error);
        setWhisperReady(false);
        setWhisperInitializing(false);
      }
    };

    checkBrowserSupport();
    initializeWebhook();
    initializeWhisper();
  }, []);

  // Cleanup effect
  useEffect(() => {
    return () => {
      // Cleanup resources when component unmounts
      if (whisperServiceRef.current) {
        whisperServiceRef.current.dispose();
      }
      if (whisperFallbackRef.current) {
        whisperFallbackRef.current.dispose();
      }
      if (audioProcessorRef.current) {
        audioProcessorRef.current.dispose();
      }
    };
  }, []);

  const addMessage = (text: string, isUser: boolean, isVoice = false, shouldSpeak = false) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date(),
      isVoice,
    };
    setMessages(prev => [...prev, newMessage]);
    
    // Speak AI responses if requested
    if (!isUser && shouldSpeak && 'speechSynthesis' in window) {
      setTimeout(() => speakText(text), 500);
    }
  };

  const sendToWebhook = async (message: string, isVoice: boolean = false): Promise<string> => {
    try {
      const webhookRequest: WebhookRequest = {
        message,
        userId,
        sessionId,
        metadata: {
          source: isVoice ? 'voice' : 'text',
          browser: navigator.userAgent,
        },
      };

      const response = await webhookService.sendMessage(webhookRequest);
      
      if (response.success && response.data?.response) {
        return response.data.response;
      } else {
        throw new Error(response.error || 'No response from chatbot');
      }
    } catch (error) {
      console.error('Webhook error:', error);
      throw error;
    }
  };

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    addMessage(userMessage, true);
    setInputValue('');
    
    // Show processing indicator
    setIsProcessing(true);
    
    try {
      // Send to webhook
      const response = await sendToWebhook(userMessage, false);
      addMessage(response, false);
    } catch (error) {
      console.error('Error getting response from webhook:', error);
      
      // Fallback to local response if webhook fails
      const fallbackResponses = [
        "I'm having trouble connecting to the chatbot service right now. Let me provide a local response: I understand you're asking about parliamentary data. Please try again in a moment for the full AI experience.",
        "The chatbot service is temporarily unavailable. Here's a local response: Based on parliamentary data, I can help you with debates, bills, and member information. Please try again shortly.",
        "Connection issue with the AI service. Local response: I can assist with parliamentary analytics, voting patterns, and legislative tracking. Please retry for enhanced AI responses."
      ];
      const fallbackResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      addMessage(fallbackResponse, false);
    } finally {
      setIsProcessing(false);
    }
  };

  const startRecording = async () => {
    try {
      setVoiceError('');
      setIsListening(true);
      
      // Check if Whisper is ready, otherwise use fallback
      if (whisperReady && whisperServiceRef.current && audioProcessorRef.current) {
        // Use Whisper for transcription
        const stream = await audioProcessorRef.current.startAudioMonitoring((level) => {
          setAudioLevel(level);
        });
        
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm;codecs=opus'
        });
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          try {
            setIsProcessing(true);
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            
            // Try Whisper first, fallback to Web Speech API if it fails
            let result;
            try {
              result = await whisperServiceRef.current!.transcribe(audioBlob);
            } catch (whisperError) {
              console.log('Whisper failed, trying fallback:', whisperError);
              if (whisperFallbackRef.current) {
                result = await whisperFallbackRef.current.transcribe(audioBlob);
              } else {
                throw whisperError;
              }
            }
            
            if (result.text.trim()) {
              setTranscript(result.text);
              addMessage(result.text, true, true);
              
              // Generate AI response
              try {
                const response = await sendToWebhook(result.text, true);
                addMessage(response, false, false, true);
              } catch (error) {
                console.error('Error getting webhook response for voice:', error);
                const response = generateAIResponse(result.text);
                addMessage(response, false, false, true);
              }
            } else {
              addMessage("I didn't catch that. Please try speaking again.", false);
            }
          } catch (error) {
            console.error('Transcription error:', error);
            addMessage("Sorry, I couldn't understand your voice. Please try again.", false);
          } finally {
            setIsProcessing(false);
            setIsRecording(false);
            setIsListening(false);
            audioProcessorRef.current?.stopAudioMonitoring();
          }
        };

        mediaRecorder.start();
        setIsRecording(true);
        setIsListening(true);
        setTranscript('Listening... Speak now.');
        
      } else if (recognitionSupported) {
        // Fallback to Web Speech API if Whisper is not ready
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        recognition.maxAlternatives = 1;
        
        recognition.onstart = () => {
          console.log('Speech recognition started');
          setIsRecording(true);
          setIsListening(true);
        };
        
        recognition.onresult = (event: any) => {
          let finalTranscript = '';
          let interimTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }
          
          if (interimTranscript) {
            setTranscript(interimTranscript);
          }
          
          if (finalTranscript) {
            console.log('Speech recognition result:', finalTranscript);
            setTranscript(finalTranscript);
            addMessage(finalTranscript, true, true);
          
            setTimeout(async () => {
              try {
                setIsProcessing(true);
                const response = await sendToWebhook(finalTranscript, true);
                addMessage(response, false, false, true);
              } catch (error) {
                console.error('Error getting webhook response for voice:', error);
                const response = generateAIResponse(finalTranscript);
                addMessage(response, false, false, true);
              } finally {
                setIsProcessing(false);
                setIsRecording(false);
                setIsListening(false);
              }
            }, 1000);
          }
        };
        
        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          let errorMessage = "Sorry, I couldn't understand your voice. Please try again.";
          
          switch (event.error) {
            case 'no-speech':
              errorMessage = "No speech detected. Please speak clearly and try again.";
              break;
            case 'audio-capture':
              errorMessage = "Microphone access denied. Please allow microphone access and try again.";
              break;
            case 'not-allowed':
              errorMessage = "Microphone access denied. Please allow microphone access and try again.";
              break;
            case 'network':
              errorMessage = "Network error. Please check your connection and try again.";
              break;
            case 'aborted':
              errorMessage = "Speech recognition was interrupted. Please try again.";
              break;
            default:
              errorMessage = `Speech recognition error: ${event.error}. Please try again.`;
          }
          
          setVoiceError(errorMessage);
          addMessage(errorMessage, false);
          setIsRecording(false);
          setIsListening(false);
        };
        
        recognition.onend = () => {
          console.log('Speech recognition ended');
          setIsRecording(false);
          setIsListening(false);
        };
        
        recognition.start();
      } else {
        throw new Error('No speech recognition support available');
      }
    } catch (error) {
      console.error('Error accessing microphone:', error);
      const errorMessage = 'Microphone access denied. Please allow microphone access and try again.';
      setVoiceError(errorMessage);
      addMessage(errorMessage, false);
      setIsRecording(false);
      setIsListening(false);
    }
  };

  const stopRecording = () => {
    console.log('Stopping recording...', { isRecording, recognitionRef: recognitionRef.current });
    
    // Stop Web Speech API recognition
    if (recognitionRef.current) {
      console.log('Stopping speech recognition');
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    
    // Stop MediaRecorder (for both Whisper and fallback)
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      console.log('Stopping media recorder');
      mediaRecorderRef.current.stop();
    }
    
    // Stop audio monitoring
    if (audioProcessorRef.current) {
      audioProcessorRef.current.stopAudioMonitoring();
    }
    
    // Force state update
    setIsRecording(false);
    setIsListening(false);
    setVoiceError(''); // Clear any errors
  };

  // Text-to-Speech function for AI responses
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => {
        setIsSpeaking(true);
      };
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      utterance.onerror = () => {
        setIsSpeaking(false);
      };
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    
    try {
      // Use Web Speech API for real speech recognition
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onstart = () => {
          console.log('Speech recognition started');
        };
        
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          console.log('Speech recognition result:', transcript);
          setTranscript(transcript);
          addMessage(transcript, true, true);
          
          // Generate AI response based on actual transcript
          setTimeout(() => {
            const response = generateAIResponse(transcript);
            addMessage(response, false, false, true);
            setIsProcessing(false);
          }, 1000);
        };
        
        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          addMessage("Sorry, I couldn't understand your voice. Please try again or use text input.", false);
          setIsProcessing(false);
        };
        
        recognition.onend = () => {
          console.log('Speech recognition ended');
        };
        
        // Start recognition
        recognition.start();
      } else {
        // Fallback for browsers without speech recognition - simulate processing
        addMessage("Audio recorded successfully! Processing...", false);
        
        // Simulate processing time
        setTimeout(() => {
          const simulatedTranscript = "I heard your audio message. While speech recognition isn't available in this browser, I can still help you with parliamentary data. Please use text input for the best experience.";
          setTranscript(simulatedTranscript);
          addMessage(simulatedTranscript, true, true);
          
          setTimeout(() => {
            const response = "I understand you're trying to use voice input. For the best experience with parliamentary data analysis, I recommend using text input. You can ask me about debates, bills, voting patterns, or member information.";
            addMessage(response, false, false, true);
        setIsProcessing(false);
          }, 1000);
        }, 2000);
      }
    } catch (error) {
      console.error('Error with speech recognition:', error);
      addMessage("There was an error processing your voice input. Please try again or use text input.", false);
      setIsProcessing(false);
    }
  };

  const generateAIResponse = (transcript: string) => {
    const lowerTranscript = transcript.toLowerCase();
    
    // Healthcare related queries
    if (lowerTranscript.includes('healthcare') || lowerTranscript.includes('health') || lowerTranscript.includes('medical')) {
      return "I found information about healthcare legislation. The recent Healthcare Funding Division debate showed mixed sentiment with 45% positive and 40% negative reactions. Would you like me to provide more details about specific healthcare bills?";
    }
    
    // Education related queries
    if (lowerTranscript.includes('education') || lowerTranscript.includes('school') || lowerTranscript.includes('teacher')) {
      return "Based on your query about education, I can see the Education Review Bill had strong bipartisan support with 78% positive sentiment. The debate focused on funding expansion and teacher training improvements. Would you like me to analyze specific aspects?";
    }
    
    // Speaker related queries
    if (lowerTranscript.includes('speaker') || lowerTranscript.includes('member') || lowerTranscript.includes('who spoke')) {
      return "I can see you're asking about speakers. The top speakers this month are Rt Hon. Jane Smith (24 times), David Johnson MP (19 times), and Dr. Sarah Williams (17 times). Would you like me to show you their speaking patterns or topics?";
    }
    
    // Sentiment analysis queries
    if (lowerTranscript.includes('sentiment') || lowerTranscript.includes('feeling') || lowerTranscript.includes('opinion')) {
      return "I've analyzed the sentiment data. Recent debates show 45% positive, 35% neutral, and 20% negative sentiment overall. Healthcare topics show more polarization while education topics are generally positive. Would you like a breakdown by topic?";
    }
    
    // Bills and legislation queries
    if (lowerTranscript.includes('bill') || lowerTranscript.includes('legislation') || lowerTranscript.includes('law')) {
      return "I found information about recent bills. There were 59 new bills introduced this month, with the Education Review Bill and Healthcare Funding Division being the most discussed. Would you like me to provide details about specific bills?";
    }
    
    // Voting patterns queries
    if (lowerTranscript.includes('vote') || lowerTranscript.includes('voting') || lowerTranscript.includes('pattern')) {
      return "I can analyze voting patterns for you. The infrastructure bill showed interesting cross-party support, while healthcare funding had more partisan divisions. Would you like me to break down the voting data by party or specific bills?";
    }
    
    // Trending topics queries
    if (lowerTranscript.includes('trending') || lowerTranscript.includes('popular') || lowerTranscript.includes('hot topic')) {
      return "The current trending topics in parliament are Healthcare Reform, Education Funding, Economic Policy, Climate Change, and Infrastructure. Would you like me to provide sentiment analysis for any of these topics?";
    }
    
    // General parliamentary queries
    if (lowerTranscript.includes('parliament') || lowerTranscript.includes('debate') || lowerTranscript.includes('session')) {
      return "I can help you with parliamentary information. There have been 178 total debates this month with an average duration of 29 minutes. The most active period was in April with 170 debates. What specific aspect would you like to explore?";
    }
    
    // Default response for unrecognized queries
    return `I heard you say "${transcript}". I can help you with parliamentary data, debate analysis, member information, bill tracking, sentiment analysis, and voting patterns. Could you be more specific about what you'd like to know?`;
  };

  return (
    <>
      {/* Active Floating Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
               className="fixed bottom-6 right-6 w-16 h-16 bg-green-800 hover:bg-green-900 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center z-50 animate-pulse"
            >
        {isOpen ? (
          <XMarkIcon className="w-7 h-7" />
        ) : (
          <CpuChipIcon className="w-7 h-7" />
        )}
      </button>

      {/* Active Indicator */}
      {!isOpen && (
        <div className="fixed bottom-20 right-6 bg-green-800 text-white text-xs px-2 py-1 rounded-full shadow-lg z-50 animate-bounce">
          AI Active
        </div>
      )}

      {/* Active Popup Widget */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-xl shadow-2xl border-2 border-green-200 z-40 flex flex-col animate-slide-up">
          {/* Active Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-red-50 via-yellow-50 to-green-50 rounded-t-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-800 rounded-full flex items-center justify-center animate-pulse">
                <CpuChipIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">AI Assistant</h3>
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-green-800 font-medium">Parliamentary Analytics</p>
                  {webhookConnected === true && (
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-600 font-medium">AI Connected</span>
                    </div>
                  )}
                  {webhookConnected === false && (
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-xs text-yellow-600 font-medium">Local Mode</span>
                    </div>
                  )}
                  {webhookConnected === null && (
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-gray-600 font-medium">Connecting...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Enhanced Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-3 rounded-xl shadow-sm ${
                    message.isUser
                        ? 'bg-green-800 text-white'
                      : 'bg-white border border-gray-200 text-gray-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                    {message.isVoice && (
                      <MicrophoneIcon className="w-4 h-4" />
                    )}
                    <span className="text-xs opacity-75 font-medium">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                    </div>
                    {!message.isUser && 'speechSynthesis' in window && (
                      <button
                        onClick={() => speakText(message.text)}
                        className="text-gray-400 hover:text-green-600 transition-colors"
                        title="Speak this message"
                      >
                        <SpeakerWaveIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
              </div>
            ))}
            
            {/* Enhanced Processing indicator */}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 px-4 py-3 rounded-xl shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full"></div>
                    <span className="text-sm text-gray-700 font-medium">
                      {webhookConnected ? 'AI is thinking...' : 'Processing locally...'}
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Enhanced Input Area */}
          <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-red-50 via-yellow-50 to-green-50">
            {/* Enhanced Input Mode Toggle */}
            <div className="flex bg-white rounded-xl p-1 mb-4 shadow-sm border border-gray-200">
              <button
                onClick={() => setInputMode('text')}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  inputMode === 'text'
                    ? 'bg-green-800 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <DocumentTextIcon className="w-5 h-5" />
                <span>Text</span>
              </button>
              <button
                onClick={() => setInputMode('voice')}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  inputMode === 'voice'
                    ? 'bg-green-800 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <MicrophoneIcon className="w-5 h-5" />
                <span>Voice</span>
              </button>
            </div>

            {/* Enhanced Input Form */}
            {inputMode === 'text' ? (
              <form onSubmit={handleTextSubmit} className="flex space-x-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about parliamentary data..."
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm font-medium shadow-sm text-gray-900 placeholder-gray-500"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="p-3 bg-green-800 text-white rounded-xl hover:bg-green-900 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all duration-200"
                >
                  <PaperAirplaneIcon className="w-5 h-5" />
                </button>
              </form>
            ) : (
              <div className="flex flex-col space-y-4">
                {/* Voice Error Display */}
                {voiceError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
                    <ExclamationTriangleIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="text-sm font-medium">{voiceError}</span>
                  </div>
                )}

                {/* Real-time Transcript Display */}
                {transcript && (
                  <div className="p-4 bg-gradient-to-r from-red-50 via-yellow-50 to-green-50 rounded-xl border border-red-200">
                    <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-red-800 font-medium">
                        <strong>Transcribed:</strong>
                      </p>
                      <div className="flex items-center space-x-2">
                        {isListening && (
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                            <span className="text-xs text-red-600">Listening...</span>
                          </div>
                        )}
                        <button
                          onClick={() => setTranscript('')}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                          title="Clear transcript"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-800 bg-white p-2 rounded border">{transcript}</p>
                  </div>
                )}

                {/* Voice Recording Button */}
                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      console.log('Button clicked:', { isRecording, isListening });
                      if (isRecording || isListening) {
                        stopRecording();
                      } else {
                        startRecording();
                      }
                    }}
                    disabled={!whisperReady && !recognitionSupported && !(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)}
                    className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${
                      isRecording || isListening
                        ? 'bg-green-600 hover:bg-green-700 animate-pulse scale-110'
                        : whisperReady
                        ? 'bg-green-800 hover:bg-green-900 hover:scale-105'
                        : recognitionSupported
                        ? 'bg-green-700 hover:bg-green-800 hover:scale-105'
                        : (navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
                        ? 'bg-green-600 hover:bg-green-700 hover:scale-105'
                        : 'bg-gray-400 cursor-not-allowed'
                    } text-white`}
                  >
                    {isRecording || isListening ? (
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        <div className="w-4 h-4 bg-green-600 rounded"></div>
                      </div>
                    ) : (
                    <MicrophoneIcon className="w-8 h-8" />
                    )}
                  </button>
                </div>

                {/* Voice Status */}
                <div className="text-center">
                  <p className="text-sm text-gray-600 font-medium">
                    {isRecording || isListening ? (
                      <span className="flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                        <span>Listening... Click to stop</span>
                      </span>
                    ) : whisperReady ? (
                      '🎤 Whisper Ready - Click to start recording'
                    ) : whisperInitializing ? (
                      '🔄 Initializing Whisper...'
                    ) : recognitionSupported ? (
                      '🎤 Web Speech API - Click to start recording'
                    ) : navigator.mediaDevices && navigator.mediaDevices.getUserMedia ? (
                      '🎤 Audio recording available (limited)'
                    ) : (
                      '❌ Voice not supported in this browser'
                    )}
                  </p>
                  
                  {/* Audio Level Indicator */}
                  {isRecording && audioLevel.isActive && (
                    <div className="mt-2 flex justify-center">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 transition-all duration-100"
                          style={{ width: `${Math.min(audioLevel.level * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  {/* Browser Support Info */}
                  {!whisperReady && !recognitionSupported && (
                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-xs text-yellow-800">
                        <strong>Voice Support:</strong><br/>
                        {whisperInitializing ? (
                          '🔄 Loading Whisper model...'
                        ) : (
                          <>
                            • Chrome/Edge: Full Whisper + Web Speech support<br/>
                            • Safari: Web Speech API only<br/>
                            • Firefox: Audio recording only<br/>
                            • Mobile: Varies by browser
                          </>
                        )}
                      </p>
                    </div>
                  )}
                  
                  {/* Whisper Status */}
                  {whisperReady && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-xs text-green-800">
                        <strong>✅ Whisper AI Ready:</strong><br/>
                        Client-side transcription with enhanced accuracy
                      </p>
                    </div>
                  )}
                  
                  {/* Emergency Stop Button */}
                  {(isRecording || isListening) && (
                      <button
                        onClick={stopRecording}
                        className="mt-2 px-3 py-1 bg-green-600 text-white text-xs rounded-full hover:bg-green-700 transition-colors"
                      >
                      Force Stop
                    </button>
                  )}
                </div>

                {/* Text-to-Speech Controls */}
                {messages.length > 1 && (
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => {
                        const lastAIMessage = messages.filter(m => !m.isUser).pop();
                        if (lastAIMessage) speakText(lastAIMessage.text);
                      }}
                      disabled={isSpeaking}
                      className="px-4 py-2 bg-green-800 text-white rounded-lg hover:bg-green-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
                    >
                      <SpeakerWaveIcon className="w-4 h-4" />
                      <span className="text-sm font-medium">Speak Last Response</span>
                    </button>
                    {isSpeaking && (
                        <button
                          onClick={stopSpeaking}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center space-x-2"
                        >
                        <XMarkIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">Stop</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
