# ClipConductor AI - Frontend Documentation

## 🎯 Overview

The ClipConductor AI frontend is a modern Next.js application that provides an intuitive interface for managing gaming clips, AI processing, and multi-platform distribution. Built with React, TypeScript, and Tailwind CSS for a responsive and user-friendly experience.

**🚀 Latest Update**: Enhanced with a comprehensive UI component library featuring professional interactions, advanced data management, and improved user experience.

## 🛠️ Tech Stack

### Core Technologies
- **Next.js 14.2.5**: React framework with app router and server-side rendering
- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Utility-first CSS framework for rapid styling

### Key Dependencies
- **@tanstack/react-query**: Server state management and caching
- **Framer Motion 11.18.2**: Smooth animations and transitions
- **Lucide React 0.400.0**: Modern icon library (400+ icons)
- **React Hot Toast 2.5.2**: Toast notifications system
- **Axios 1.10.0**: HTTP client for API communication
- **clsx 2.1.1**: Conditional CSS class utility

### Development Tools
- **ESLint**: Code linting and style enforcement
- **PostCSS**: CSS processing and optimization
- **TypeScript 5.5.3**: Type checking and IntelliSense
- **Hot Reload**: Instant development feedback

## 🏗️ Project Structure

```
frontend/
├── components/             # Reusable UI components
│   ├── ui/                # Core component library
│   │   ├── Button.tsx     # Versatile button with variants & loading
│   │   ├── Modal.tsx      # Accessible modal dialogs
│   │   ├── SearchBar.tsx  # Enhanced search with filters
│   │   ├── DataTable.tsx  # Sortable, selectable data tables
│   │   ├── FileUpload.tsx # Drag & drop file upload
│   │   ├── ProgressBar.tsx # Progress indicators
│   │   └── index.ts       # Component exports
├── pages/                  # Next.js pages (file-based routing)
│   ├── _app.tsx           # App wrapper with providers
│   ├── index.tsx          # Dashboard home page
│   ├── setup.tsx          # 6-step onboarding wizard
│   ├── clips.tsx          # Enhanced clips management
│   ├── ai-metadata.tsx    # AI metadata generation
│   └── health.tsx         # System health monitoring
├── lib/                   # Utilities and configurations
│   └── api.ts             # Axios API client and services
├── styles/                # Global styles and themes
│   ├── globals.css        # Global CSS imports
│   └── tailwind.css       # Tailwind CSS imports
├── public/                # Static assets
└── package.json           # Dependencies and scripts
```

## 🎨 UI Component Library

### Core Components
- **Button**: 5 variants (primary, secondary, danger, ghost, outline) with loading states
- **Modal**: Responsive dialogs with animations and accessibility features  
- **SearchBar**: Real-time search with filter integration and clear functionality
- **DataTable**: Generic sortable tables with row selection and batch operations
- **FileUpload**: Drag & drop with validation, progress tracking, and file management
- **ProgressBar**: Multi-variant progress indicators with animations

## ⚡ Features Implemented

### 🎮 Dashboard (`/`)
- **Real-time Statistics**: Live clips count, collection size, and game breakdown
- **System Health**: AI service status and model availability
- **Quick Actions**: Direct access to key features
- **Auto-refresh**: Updates every 30 seconds
- **Responsive Design**: Works on desktop and mobile

### 🛠️ Setup Wizard (`/setup`)
- **5-Step Onboarding Process**:
  1. **Welcome**: Platform introduction and overview
  2. **Folder Configuration**: Outplayed clips directory selection
  3. **Service Selection**: Choose platforms (YouTube, TikTok, Instagram)
  4. **AI Models**: Configure Ollama models and settings
  5. **Notifications**: Set up Telegram, Discord, Slack alerts
- **Progress Tracking**: Visual step indicator
- **Local Storage**: Preserves setup state between sessions
- **Validation**: Form validation and error handling

### 📊 Enhanced Clips Management (`/clips`)
- **Advanced Data Table**: Sortable, searchable clips with batch selection
- **Real-time Search**: Filter clips by name, game, or status instantly
- **Drag & Drop Upload**: Modal-based file upload with progress tracking
- **Processing Status**: Visual progress bars and status indicators
- **Batch Operations**: Multi-select for bulk processing and actions
- **Platform Metadata**: Quick copy buttons for YouTube, TikTok, Instagram

### 🤖 AI Integration (`/ai-metadata`)
- **Custom Prompts**: Generate metadata with custom prompts
- **Model Selection**: Choose from available Ollama models
- **Real-time Processing**: Live AI text generation
- **Export Options**: Save and export generated content

### 💊 Health Monitoring (`/health`)
- **System Status**: Backend, AI, and database health
- **Performance Metrics**: Response times and uptime
- **Service Dependencies**: Ollama, Redis, PostgreSQL status
- **Error Reporting**: Detailed error logs and diagnostics

## 🔌 API Integration

### Client Configuration
```typescript
// Base API client with automatic retry and error handling
const api = axios.create({
  baseURL: 'http://localhost:8001/api/v1',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
});
```

### React Query Setup
```typescript
// Server state management with caching and background updates
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchInterval: 30000, // 30 seconds for dashboard
      retry: 3
    }
  }
});
```

### Key API Endpoints Used
- `GET /clips/stats` - Dashboard statistics
- `GET /ai/health` - AI service status
- `POST /clips/scan` - Trigger clips scanning
- `POST /clips/process` - Process clips with AI
- `POST /notifications/test` - Test notification services
- `GET /ai/models` - Available Ollama models

## 🎨 UI/UX Design

### Design System
- **Color Palette**: Dark theme optimized for gaming content
- **Typography**: Clean, readable fonts with proper hierarchy
- **Animations**: Smooth transitions using Framer Motion
- **Icons**: Consistent iconography with Lucide React
- **Responsive**: Mobile-first design approach

### Key Components
- **StatCard**: Displays metrics with icons and trends
- **QuickActionCard**: Interactive feature shortcuts
- **ProgressIndicator**: Step-by-step navigation
- **NotificationToasts**: User feedback system
- **LoadingStates**: Skeleton loaders and spinners

## 🔄 State Management

### Local State (React useState)
- Form inputs and validation
- UI state (modals, dropdowns)
- Component-level data

### Server State (React Query)
- API data caching
- Background refetching
- Optimistic updates
- Error boundary handling

### Persistent State (localStorage)
- Setup configuration
- User preferences
- Session data

## 🚀 Development Workflow

### Getting Started
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Development Commands
```bash
# Linting
npm run lint

# Type checking
npm run type-check

# Clean build
npm run clean
```

## 🧪 Current Status

### ✅ Completed Features
- **Dashboard**: Fully functional with real-time data
- **Setup Wizard**: 5-step onboarding with all configurations
- **API Integration**: All endpoints connected and working
- **Responsive Design**: Works across all device sizes
- **Error Handling**: Comprehensive error boundaries
- **Loading States**: Proper loading indicators
- **Notifications**: Toast system for user feedback

### 🔄 In Progress
- **Clips Management**: Advanced filtering and sorting
- **AI Metadata**: Batch processing interface
- **Platform Integration**: OAuth flows for social media
- **Analytics**: Usage statistics and insights

### 📋 Planned Features
- **User Authentication**: Login system and user management
- **Settings Panel**: Advanced configuration options
- **Export System**: Bulk export capabilities
- **Theme System**: Light/dark mode toggle
- **Keyboard Shortcuts**: Power user features

## 🎯 Next Steps

### Immediate Priorities
1. **Complete Ollama Integration**: Finish model selection and configuration
2. **Enhanced Clips Interface**: Add filtering, search, and bulk operations
3. **Platform Connections**: Implement YouTube, TikTok, Instagram OAuth
4. **Error Boundaries**: Add comprehensive error handling

### Medium Term Goals
1. **Performance Optimization**: Code splitting and lazy loading
2. **Accessibility**: WCAG compliance and keyboard navigation
3. **Testing**: Unit and integration test coverage
4. **Documentation**: Component library and API docs

### Long Term Vision
1. **Mobile App**: React Native companion app
2. **Plugin System**: Extensible architecture
3. **Advanced Analytics**: Business intelligence dashboard
4. **Multi-tenancy**: Support for multiple users/teams

## 🔧 Configuration

### Environment Variables
```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8001/api/v1

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_DEBUG=false

# External Services
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

### Tailwind Configuration
```javascript
// Custom theme colors for gaming aesthetic
colors: {
  gaming: {
    400: '#8B5FBF',
    500: '#7C3AED',
    600: '#6D28D9'
  },
  dark: {
    50: '#1F2937',
    100: '#374151',
    200: '#4B5563'
  }
}
```

## 🐛 Troubleshooting

### Common Issues
1. **API Connection Errors**: Verify backend is running on port 8001
2. **Build Failures**: Check TypeScript errors and dependencies
3. **Styling Issues**: Ensure Tailwind CSS is properly configured
4. **Hot Reload**: Restart dev server if changes not reflecting

### Debug Tools
- **React Query Devtools**: Monitor API calls and cache
- **React Developer Tools**: Component inspection
- **Network Tab**: API request/response debugging
- **Console Logs**: Error tracking and debugging

## 📚 Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [React Query Docs](https://tanstack.com/query/latest)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Framer Motion Docs](https://www.framer.com/motion/)

### Best Practices
- Follow React Hooks best practices
- Use TypeScript for all components
- Implement proper error boundaries
- Optimize images and assets
- Follow accessibility guidelines

The frontend is now fully operational and ready for gaming content creation! 🎮✨
