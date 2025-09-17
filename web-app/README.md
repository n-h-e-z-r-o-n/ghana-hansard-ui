# Ghana Parliamentary Hub - Interactive Analytics Platform

A modern, responsive web application built with Next.js that provides an interactive, voice-enabled analytics platform for Ghana's Parliament. This dashboard offers real-time insights, data visualization, and AI-powered analysis of parliamentary proceedings.

## 🚀 Features

### 📊 **Dashboard Overview**
- **Real-time Metrics**: Track total debates, active members, new bills, and average duration
- **Interactive Charts**: Visualize debate activity trends and sentiment analysis
- **Member Analytics**: Monitor top speakers and participation rates
- **AI Insights**: Get automated analysis and recommendations

### 🎯 **Key Components**
- **Header Navigation**: Search functionality and user profile management
- **Sidebar Navigation**: Intuitive menu with filters and AI assistant access
- **Data Visualization**: Interactive charts using Recharts library
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### 🔧 **Technical Features**
- **Modern UI**: Clean, professional design with Tailwind CSS
- **Type Safety**: Built with TypeScript for better development experience
- **Component Architecture**: Modular, reusable React components
- **Performance Optimized**: Fast loading with Next.js 15 and Turbopack
- **Voice Input**: Microphone integration with speech-to-text capabilities
- **Dual Input Modes**: Toggle between text and voice input for AI Assistant
- **User Onboarding**: Interactive tour and guidance for new users
- **Smart Notifications**: Contextual prompts to encourage AI Assistant usage

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.3 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Icons**: Heroicons (v2.2.0)
- **Charts**: Recharts (v3.2.1)
- **Additional**: Lucide React for additional icons

## 📁 Project Structure

```
web-app/
├── app/
│   ├── globals.css          # Global styles and Tailwind configuration
│   ├── layout.tsx           # Root layout with metadata
│   └── page.tsx             # Main dashboard page
├── public/                  # Static assets
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ghana-hansard-ui/web-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
```bash
npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` (or the port shown in terminal)

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production with Turbopack
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎤 AI Assistant with Microphone Integration

### Voice Input Features
The AI Assistant includes advanced microphone functionality with the following capabilities:

#### **Dual Input Modes**
- **Text Mode**: Traditional text input with send button
- **Voice Mode**: Microphone recording with real-time feedback
- **Toggle Switch**: Easy switching between input modes

#### **Voice Recording Process**
1. **Permission Request**: Automatically requests microphone access
2. **Real-time Recognition**: Uses Web Speech API for live speech-to-text
3. **Visual Feedback**: Recording status indicators and processing states
4. **Speech-to-Text**: Real transcription using browser's native speech recognition
5. **Error Handling**: Graceful fallback for unsupported browsers

#### **Technical Implementation**
```typescript
// Speech recognition state management
const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');
const [isRecording, setIsRecording] = useState(false);
const [isProcessing, setIsProcessing] = useState(false);
const recognitionRef = useRef<any>(null);

// Web Speech API integration
const startRecording = async () => {
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setTranscript(transcript);
      addMessage(transcript, true, true);
      generateAIResponse(transcript);
    };
    
    recognition.start();
    setIsRecording(true);
  }
};
```

#### **Browser Compatibility**
- **Supported**: Chrome, Edge, Safari (Web Speech API)
- **Required**: HTTPS connection for microphone access
- **Fallback**: MediaRecorder API for unsupported browsers
- **User Feedback**: Clear messaging for unsupported browsers

#### **Security & Privacy**
- **Browser Processing**: Speech recognition handled by browser's Web Speech API
- **No Storage**: Audio data is not permanently stored
- **Permission Handling**: Proper user consent and error handling
- **HTTPS Required**: Microphone access requires secure context
- **Local Processing**: Speech recognition happens locally in the browser

### AI Assistant Widget Features

#### **Popup Design**
- **Fixed Position**: Bottom-right corner with floating button
- **Expandable**: Collapsible conversation area
- **Responsive**: Adapts to different screen sizes
- **Non-intrusive**: Doesn't interfere with main content

#### **Conversation Management**
- **Message History**: Persistent conversation storage
- **Timestamps**: Each message includes time stamp
- **Voice Indicators**: Visual markers for voice messages
- **Auto-scroll**: Automatic scrolling to latest messages

## 🏗️ Code Architecture

### Main Components

#### **Header Component**
```typescript
// Located in app/page.tsx (lines 82-110)
- Logo with parliamentary building design
- Search bar with magnifying glass icon
- User profile dropdown
```

#### **Sidebar Navigation**
```typescript
// Located in app/page.tsx (lines 113-167)
- Navigation menu items
- Filter dropdowns (Date Range, Party)
- AI Assistant button
```

#### **Key Metrics Cards**
```typescript
// Located in app/page.tsx (lines 178-203)
- Total Debates: 178 (+12%)
- Active Members: 15 (+5%)
- New Bills: 59 (-3%)
- Average Duration: 29m (+8%)
```

#### **Data Visualization**
```typescript
// Located in app/page.tsx (lines 205-253)
- Line Chart: Debate activity trends (6 months)
- Pie Chart: Sentiment distribution
- Responsive containers for mobile compatibility
```

#### **AI Assistant Widget**
```typescript
// Located in app/components/AIAssistant.tsx
- Floating popup widget (bottom-right corner)
- Expandable/collapsible conversation area
- Dual input modes (text and voice)
- Microphone integration with MediaRecorder API
- Real-time recording status indicators
- Speech-to-text processing simulation
- Message history with timestamps
- Voice message indicators
- Auto-scroll to latest messages
- Responsive design for all screen sizes
```

#### **AI Analysis Insights**
```typescript
// Located in app/page.tsx (lines 330-347)
- Static AI-generated insights display
- Recent analysis updates with timestamps
- Parliamentary data analysis summaries
- Sentiment analysis results
```

### Data Structure

#### **Debate Data**
```typescript
const debateData = [
  { month: 'Jan', debates: 120, bills: 45 },
  { month: 'Feb', debates: 160, bills: 65 },
  // ... more data
];
```

#### **Speaker Information**
```typescript
const topSpeakers = [
  { 
    initials: 'JS', 
    name: 'Rt Hon. Jane Smith', 
    title: 'Speaker of Parliament', 
    count: 24, 
    color: 'bg-blue-500' 
  },
  // ... more speakers
];
```

#### **Recent Debates**
```typescript
const recentDebates = [
  {
    title: 'Education Review Bill',
    category: 'Education',
    date: '15 June 2023',
    duration: '2h 45m',
    sentiment: 'positive',
    description: 'Detailed description...'
  },
  // ... more debates
];
```

## 🎨 Styling Guide

### Color Palette
- **Primary Blue**: `#1E40AF` (bg-blue-900)
- **Secondary Purple**: `#7C3AED` (from-purple-600)
- **Success Green**: `#10B981` (text-green-600)
- **Warning Red**: `#EF4444` (text-red-600)
- **Neutral Gray**: `#6B7280` (text-gray-500)

### Component Styling
- **Cards**: White background with subtle shadows (`shadow-sm`)
- **Buttons**: Rounded corners (`rounded-lg`) with hover effects
- **Icons**: Consistent sizing (`w-5 h-5`) with proper spacing
- **Typography**: Clear hierarchy with proper font weights

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: `< 768px` - Single column layout
- **Tablet**: `768px - 1024px` - Two column layout
- **Desktop**: `> 1024px` - Three column layout

### Grid System
```typescript
// Key metrics cards
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

// Main content area
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
```

## 🔧 Customization

### Adding New Metrics
1. Add data to the metrics array (lines 179-184)
2. Update the mapping function (lines 185-202)
3. Ensure responsive grid accommodates new items

### Adding New Chart Types
1. Import new chart components from Recharts
2. Add data structure for new chart
3. Implement chart component with ResponsiveContainer

### Modifying Navigation
1. Update navigation items array (lines 118-126)
2. Add corresponding icons from Heroicons
3. Implement navigation logic as needed

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Next.js will automatically use the next available port
   # Check terminal output for the correct port
   ```

2. **Icon Import Errors**
   ```bash
   # Ensure icons are imported from correct Heroicons path
   # Check @heroicons/react/24/outline for available icons
   ```

3. **Chart Not Rendering**
   ```bash
   # Verify Recharts is properly installed
   # Check ResponsiveContainer wrapper is present
   ```

4. **Microphone Not Working**
   ```bash
   # Check browser permissions for microphone access
   # Ensure HTTPS connection (required for microphone API)
   # Verify browser supports MediaRecorder API
   # Check console for permission denied errors
   ```

5. **Voice Input Issues**
   ```bash
   # Test microphone in browser settings first
   # Check if other applications can access microphone
   # Try refreshing the page and granting permissions again
   # Fallback to text input if voice fails
   ```

### Development Tips

- Use `npm run dev` for development with hot reload
- Check browser console for runtime errors
- Use TypeScript for better error catching
- Test responsive design on different screen sizes
- Test microphone functionality on HTTPS (required for production)
- Test voice input in different browsers for compatibility

### Real Speech-to-Text Integration

The current implementation includes a mock speech-to-text system. To integrate with real services:

#### **Option 1: Web Speech API (Browser Native)**
```typescript
// Replace the processAudio function with:
const processAudio = async (audioBlob: Blob) => {
  const recognition = new (window as any).webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  
  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;
    setTranscript(transcript);
    setInputValue(transcript);
  };
  
  recognition.start();
};
```

#### **Option 2: Cloud Services (Google, Azure, AWS)**
```typescript
// Example with Google Cloud Speech-to-Text
const processAudio = async (audioBlob: Blob) => {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'recording.wav');
  
  const response = await fetch('/api/speech-to-text', {
    method: 'POST',
    body: formData,
  });
  
  const { transcript } = await response.json();
  setTranscript(transcript);
  setInputValue(transcript);
};
```

#### **Option 3: Real-time Streaming (Advanced)**
```typescript
// For real-time speech recognition
const startRecording = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mediaRecorder = new MediaRecorder(stream, {
    mimeType: 'audio/webm;codecs=opus'
  });
  
  // Process audio chunks in real-time
  mediaRecorder.ondataavailable = async (event) => {
    if (event.data.size > 0) {
      await processAudioChunk(event.data);
    }
  };
};
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **Heroicons** for the beautiful icon set
- **Recharts** for the charting library
- **Ghana Parliament** for the inspiration

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation for common solutions

---

**Built with ❤️ for Ghana's Parliamentary Democracy**