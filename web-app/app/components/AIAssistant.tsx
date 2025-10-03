'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  MicrophoneIcon, 
  PaperAirplaneIcon, 
  XMarkIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  CpuChipIcon,
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
      {/* Active Floating Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 hover:from-red-700 hover:via-yellow-600 hover:to-green-700 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center z-50 animate-pulse"
            >
        {isOpen ? (
          <XMarkIcon className="w-7 h-7" />
        ) : (
          <CpuChipIcon className="w-7 h-7" />
        )}
      </button>

      {/* Active Indicator */}
      {!isOpen && (
        <div className="fixed bottom-20 right-6 bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow-lg z-50 animate-bounce">
          AI Active
        </div>
      )}

      {/* Active Popup Widget */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-xl shadow-2xl border-2 border-red-200 z-40 flex flex-col animate-slide-up">
          {/* Active Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-red-50 via-yellow-50 to-green-50 rounded-t-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 rounded-full flex items-center justify-center animate-pulse">
                <CpuChipIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">AI Assistant</h3>
                <p className="text-sm text-red-600 font-medium">Parliamentary Analytics • Active</p>
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
                      ? 'bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-900'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    {message.isVoice && (
                      <MicrophoneIcon className="w-4 h-4" />
                    )}
                    <span className="text-xs opacity-75 font-medium">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
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
                    <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                    <span className="text-sm text-gray-700 font-medium">Processing audio...</span>
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
                    ? 'bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 text-white shadow-lg'
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
                    ? 'bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 text-white shadow-lg'
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
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm font-medium shadow-sm"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="p-3 bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 text-white rounded-xl hover:from-red-700 hover:via-yellow-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all duration-200"
                >
                  <PaperAirplaneIcon className="w-5 h-5" />
                </button>
              </form>
            ) : (
              <div className="flex flex-col space-y-4">
                {transcript && (
                  <div className="p-4 bg-gradient-to-r from-red-50 via-yellow-50 to-green-50 rounded-xl border border-red-200">
                    <p className="text-sm text-red-800 font-medium">
                      <strong>Transcribed:</strong> {transcript}
                    </p>
                  </div>
                )}
                <div className="flex justify-center">
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${
                      isRecording
                        ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 animate-pulse scale-110'
                        : 'bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 hover:from-red-700 hover:via-yellow-600 hover:to-green-700 hover:scale-105'
                    } text-white`}
                  >
                    <MicrophoneIcon className="w-8 h-8" />
                  </button>
                </div>
                <p className="text-center text-sm text-gray-600 font-medium">
                  {isRecording ? '🎤 Listening... Click to stop' : '🎤 Click to start recording'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
