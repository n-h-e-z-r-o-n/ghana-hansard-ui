# Ghana Parliamentary Hub - Interactive Analytics Platform

A comprehensive, modern web application built with Next.js that provides an interactive, voice-enabled analytics platform for Ghana's Parliament. This multi-page dashboard offers real-time insights, data visualization, AI-powered analysis, and complete parliamentary management capabilities.

## 🚀 Features

### 📊 **Dashboard Overview**
- **Real-time Metrics**: Track total debates, active members, new bills, and average duration
- **Interactive Charts**: Visualize debate activity trends and sentiment analysis
- **Member Analytics**: Monitor top speakers and participation rates
- **AI Insights**: Get automated analysis and recommendations

### 🏛️ **Complete Parliamentary Management**
- **Debates Page**: Comprehensive debate tracking with search, filtering, and detailed views
- **Bills & Legislation**: Legislative workflow management with status tracking
- **Members Directory**: Complete member profiles with performance analytics
- **Schedule Management**: Parliamentary calendar with session tracking
- **Archives System**: Historical document management and retrieval
- **Analytics Dashboard**: Advanced data visualization and insights

### 🎯 **Key Components**
- **Unified Navigation**: Consistent navigation across all pages
- **AI Assistant Widget**: Active floating AI assistant with voice capabilities
- **Data Visualization**: Interactive charts using Recharts library
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Search & Filtering**: Advanced search across all parliamentary data

### 🔧 **Technical Features**
- **Modern UI**: Clean, professional design with Tailwind CSS
- **Type Safety**: Built with TypeScript for better development experience
- **Component Architecture**: Modular, reusable React components
- **Performance Optimized**: Fast loading with Next.js 15 and Turbopack
- **Voice Input**: Microphone integration with Web Speech API
- **Dual Input Modes**: Toggle between text and voice input for AI Assistant
- **Real-time Processing**: Live speech-to-text conversion
- **Export Functionality**: Download and share data across all pages

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
│   ├── components/
│   │   ├── Navigation.tsx   # Unified navigation component
│   │   └── AIAssistant.tsx  # AI Assistant floating widget
│   ├── debates/
│   │   └── page.tsx         # Debates management page
│   ├── bills/
│   │   └── page.tsx         # Bills & Legislation page
│   ├── members/
│   │   └── page.tsx         # Members directory page
│   ├── schedule/
│   │   └── page.tsx         # Parliamentary schedule page
│   ├── archives/
│   │   └── page.tsx         # Archives management page
│   ├── analytics/
│   │   └── page.tsx         # Analytics dashboard page
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

## 📄 Page Overview

### 🏠 **Dashboard** (`/`)
- **Overview Metrics**: Key parliamentary statistics and trends
- **Interactive Charts**: Debate activity and sentiment analysis
- **Recent Activity**: Latest debates and hot topics
- **AI Insights**: Automated analysis and recommendations

### 🎤 **Debates** (`/debates`)
- **Comprehensive Search**: Advanced filtering by topic, speaker, date
- **Debate Listings**: Grid and list view options
- **Detailed Views**: Complete debate information with transcripts
- **Sentiment Analysis**: Real-time mood tracking
- **Speaker Analytics**: Performance metrics and participation rates

### 📋 **Bills & Legislation** (`/bills`)
- **Legislative Tracking**: Complete bill lifecycle management
- **Status Monitoring**: Real-time progress updates
- **Committee Assignments**: Bill routing and review process
- **Voting Records**: Historical voting patterns and results
- **Document Management**: Bill texts and amendments

### 👥 **Members** (`/members`)
- **Member Directory**: Complete parliamentary member profiles
- **Performance Analytics**: Attendance, speaking time, efficiency metrics
- **Contact Information**: Direct communication channels
- **Committee Assignments**: Roles and responsibilities
- **Voting Records**: Individual member voting history

### 📅 **Schedule** (`/schedule`)
- **Parliamentary Calendar**: Complete session and meeting schedule
- **Live Sessions**: Real-time session monitoring
- **Committee Meetings**: Detailed meeting information
- **Public Hearings**: Public access events and schedules
- **Export Options**: Calendar integration and sharing

### 📚 **Archives** (`/archives`)
- **Document Management**: Historical parliamentary records
- **Search & Filter**: Advanced document discovery
- **Metadata System**: Comprehensive document classification
- **Access Control**: Public, restricted, and confidential access levels
- **Download Options**: Document retrieval and sharing

### 📊 **Analytics** (`/analytics`)
- **Data Visualization**: Interactive charts and graphs
- **Performance Metrics**: KPI tracking and trend analysis
- **Comparative Analysis**: Cross-party and cross-regional insights
- **Export Functionality**: Data download and sharing
- **Real-time Updates**: Live data refresh and monitoring

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

#### **Active Floating Widget**
- **Prominent Position**: Bottom-right corner with gradient floating button
- **Always Visible**: Persistent presence with "AI Active" indicator
- **Expandable Panel**: Large conversation area with modern design
- **Gradient Styling**: Blue to purple gradient with enhanced shadows
- **Pulse Animation**: Visual indication that AI is active and ready

#### **Enhanced Interface**
- **Modern Design**: Rounded corners, gradients, and enhanced shadows
- **Dual Input Modes**: Toggle between text and voice input
- **Voice Interface**: Large microphone button (20x20) with scale animations
- **Text Interface**: Enhanced input field with gradient send button
- **Message Bubbles**: Gradient message bubbles with better spacing

#### **Conversation Management**
- **Message History**: Persistent conversation storage across sessions
- **Timestamps**: Each message includes time stamp
- **Voice Indicators**: Visual markers for voice messages
- **Auto-scroll**: Automatic scrolling to latest messages
- **Processing States**: Visual feedback for recording and processing

## 🏗️ Code Architecture

### Main Components

#### **Unified Navigation Component**
```typescript
// Located in app/components/Navigation.tsx
- Header with logo, search, and user profile
- Desktop sidebar with navigation links
- Mobile hamburger menu with slide-out panel
- Quick filters (Date Range, Party)
- Responsive design for all screen sizes
- Consistent navigation across all pages
```

#### **AI Assistant Widget**
```typescript
// Located in app/components/AIAssistant.tsx
- Active floating widget (bottom-right corner)
- Gradient styling with pulse animation
- Dual input modes (text and voice)
- Web Speech API integration for real-time recognition
- Enhanced interface with modern design
- Message history with timestamps
- Voice message indicators
- Auto-scroll to latest messages
- Processing states and error handling
```

#### **Dashboard Page**
```typescript
// Located in app/page.tsx
- Key metrics cards with trend indicators
- Interactive charts (Line, Pie, Bar)
- Recent debates and hot topics
- AI insights and recommendations
- Responsive grid layout
```

#### **Debates Page**
```typescript
// Located in app/debates/page.tsx
- Advanced search and filtering system
- Grid and list view options
- Detailed debate modal with transcripts
- Sentiment analysis charts
- Speaker performance metrics
- Export and sharing functionality
```

#### **Bills & Legislation Page**
```typescript
// Located in app/bills/page.tsx
- Legislative workflow tracking
- Bill status monitoring and updates
- Committee assignment management
- Voting records and patterns
- Document management system
- Advanced filtering and search
```

#### **Members Page**
```typescript
// Located in app/members/page.tsx
- Complete member directory
- Performance analytics and metrics
- Contact information and social links
- Committee assignments and roles
- Voting records and attendance
- Member comparison and ranking
```

#### **Schedule Page**
```typescript
// Located in app/schedule/page.tsx
- Parliamentary calendar management
- Live session monitoring
- Committee meeting tracking
- Public hearing schedules
- Export and sharing options
- Real-time status updates
```

#### **Archives Page**
```typescript
// Located in app/archives/page.tsx
- Historical document management
- Advanced search and filtering
- Document classification system
- Access control levels
- Metadata management
- Download and sharing functionality
```

#### **Analytics Page**
```typescript
// Located in app/analytics/page.tsx
- Comprehensive data visualizations
- Interactive charts and graphs
- Performance metrics and KPIs
- Comparative analysis tools
- Export and sharing functionality
- Real-time data updates
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

## 🌟 Key Features & Capabilities

### 🔍 **Advanced Search & Filtering**
- **Global Search**: Search across all parliamentary data
- **Multi-dimensional Filters**: Filter by party, committee, region, date
- **Real-time Results**: Instant filtering and search results
- **Saved Searches**: Save and reuse common search queries

### 📊 **Data Visualization**
- **Interactive Charts**: Line, Bar, Pie, Area, Radar, Composed charts
- **Real-time Updates**: Live data refresh and monitoring
- **Export Options**: Download charts and data in multiple formats
- **Responsive Design**: Charts adapt to all screen sizes

### 🤖 **AI-Powered Analytics**
- **Voice Interaction**: Natural language queries via microphone
- **Smart Responses**: Context-aware AI responses
- **Sentiment Analysis**: Real-time mood and opinion tracking
- **Predictive Insights**: Trend analysis and forecasting

### 📱 **Mobile-First Design**
- **Responsive Layout**: Optimized for all device sizes
- **Touch-Friendly**: Intuitive touch interactions
- **Progressive Web App**: App-like experience on mobile
- **Offline Capability**: Basic functionality without internet

### 🔐 **Security & Privacy**
- **HTTPS Required**: Secure connections for all features
- **Data Privacy**: No permanent storage of sensitive data
- **Access Control**: Role-based access to different features
- **Audit Trail**: Complete activity logging and tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework and App Router
- **Tailwind CSS** for the utility-first CSS framework
- **Heroicons** for the comprehensive icon set
- **Recharts** for the powerful charting library
- **TypeScript Team** for the type safety and developer experience
- **Ghana Parliament** for the inspiration and democratic values
- **Open Source Community** for the tools and libraries that made this possible

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation for common solutions
- Review the troubleshooting section for known issues

## 🚀 Future Enhancements

- **Real-time Data Integration**: Live parliamentary data feeds
- **Advanced AI Features**: Machine learning-powered insights
- **Mobile App**: Native mobile applications
- **API Development**: RESTful API for external integrations
- **Multi-language Support**: Localization for different languages
- **Advanced Analytics**: Predictive modeling and forecasting

---

**Built with ❤️ for Ghana's Parliamentary Democracy**

*Empowering transparency, accountability, and citizen engagement through technology*