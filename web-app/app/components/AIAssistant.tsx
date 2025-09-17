'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  MicrophoneIcon, 
  PaperAirplaneIcon, 
  XMarkIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  SpeakerWaveIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

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
      text: "Hello! I'm your AI Parliamentary Assistant. I can help you analyze debates, find information about bills, or answer questions about parliamentary proceedings. How can I assist you today?",
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');
  const [transcript, setTranscript] = useState('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (text: string, isUser: boolean, isVoice = false) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date(),
      isVoice,
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    addMessage(inputValue, true);
    setInputValue('');
    
    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I understand you're asking about parliamentary data. Let me analyze the recent debates and provide you with insights.",
        "Based on the current parliamentary session, I can see there's been increased activity in healthcare discussions. Would you like me to provide a detailed breakdown?",
        "I've found relevant information about the bills you mentioned. The sentiment analysis shows mixed reactions from different parties.",
        "Let me search through the parliamentary records for that specific topic. I'll provide you with a comprehensive analysis.",
        "I can help you track the progress of specific bills or analyze member participation patterns. What specific data would you like to explore?"
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      addMessage(randomResponse, false);
    }, 1000);
  };

  const startRecording = async () => {
    try {
      // Check if Web Speech API is available
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        // Use Web Speech API directly for better real-time recognition
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onstart = () => {
          console.log('Speech recognition started');
          setIsRecording(true);
        };
        
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          console.log('Speech recognition result:', transcript);
          setTranscript(transcript);
          addMessage(transcript, true, true);
          
          // Generate AI response based on actual transcript
          setTimeout(() => {
            const response = generateAIResponse(transcript);
            addMessage(response, false);
            setIsRecording(false);
          }, 1000);
        };
        
        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          addMessage("Sorry, I couldn't understand your voice. Please try again or use text input.", false);
          setIsRecording(false);
        };
        
        recognition.onend = () => {
          console.log('Speech recognition ended');
          setIsRecording(false);
        };
        
        // Start recognition
        recognition.start();
      } else {
        // Fallback to MediaRecorder for browsers without Web Speech API
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          await processAudio(audioBlob);
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
      }
    } catch (error) {
      console.error('Error accessing microphone:', error);
      addMessage('Microphone access denied. Please allow microphone access and try again.', false);
    }
  };

  const stopRecording = () => {
    if (isRecording) {
      // Stop Web Speech API recognition
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      // Stop MediaRecorder fallback
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
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
            addMessage(response, false);
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
        // Fallback for browsers without speech recognition
        addMessage("Speech recognition is not supported in this browser. Please use text input instead.", false);
        setIsProcessing(false);
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
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50"
      >
        {isOpen ? (
          <XMarkIcon className="w-6 h-6" />
        ) : (
          <SpeakerWaveIcon className="w-6 h-6" />
        )}
      </button>

      {/* Popup Widget */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl border border-gray-200 z-40 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-50 rounded-t-lg">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <SpeakerWaveIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">AI Assistant</h3>
                <p className="text-xs text-gray-500">Parliamentary Analytics</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <ChevronDownIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.isUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    {message.isVoice && (
                      <MicrophoneIcon className="w-3 h-3" />
                    )}
                    <span className="text-xs opacity-75">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
            
            {/* Processing indicator */}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                    <span className="text-sm text-gray-600">Processing audio...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200">
            {/* Input Mode Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1 mb-3">
              <button
                onClick={() => setInputMode('text')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  inputMode === 'text'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <DocumentTextIcon className="w-4 h-4" />
                <span>Text</span>
              </button>
              <button
                onClick={() => setInputMode('voice')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  inputMode === 'voice'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <MicrophoneIcon className="w-4 h-4" />
                <span>Voice</span>
              </button>
            </div>

            {/* Input Form */}
            {inputMode === 'text' ? (
              <form onSubmit={handleTextSubmit} className="flex space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about parliamentary data..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <PaperAirplaneIcon className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div className="flex flex-col space-y-3">
                {transcript && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Transcribed:</strong> {transcript}
                    </p>
                  </div>
                )}
                <div className="flex justify-center">
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isRecording
                        ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                        : 'bg-blue-600 hover:bg-blue-700'
                    } text-white shadow-lg`}
                  >
                    <MicrophoneIcon className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-center text-xs text-gray-500">
                  {isRecording ? 'Listening... Click to stop' : 'Click to start recording'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
