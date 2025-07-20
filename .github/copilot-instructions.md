# ClipConductor AI - Copilot Instructions

## Project Overview
ClipConductor AI is an AI-powered platform for automated gaming content creation and multi-platform distribution. The system uses local AI models, computer vision, and microservices architecture to process gaming clips and distribute them across social media platforms.

## Architecture & Tech Stack

### Core Services Architecture
```
Frontend (Next.js/React) ←→ Backend (FastAPI) ←→ Task Queue (Celery + Redis)
                                    ↓
              AI Services (Ollama LLMs + YOLOv8 + OpenCV)
                                    ↓
              Multi-Platform APIs (YouTube, TikTok, Instagram, etc.)
```

### Key Technologies
- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, Chart.js
- **Backend**: FastAPI (Python), SQLAlchemy, Alembic (migrations), Pydantic
- **Database**: PostgreSQL with async support (asyncpg)
- **AI/ML**: YOLOv8 (Ultralytics), Ollama (local LLMs), OpenCV, PyTorch
- **Infrastructure**: Docker Compose, Celery, Redis, PostgreSQL
- **Platforms**: YouTube Shorts, TikTok, Instagram Reels, Twitter/X, Discord

### Current Implementation Status
✅ **Backend Structure**: Complete FastAPI application with proper project structure
✅ **Database Models**: SQLAlchemy models for users, clips, jobs, platforms, publications
✅ **API Endpoints**: RESTful API with clips, users, auth, platforms, jobs endpoints
✅ **AI Services**: Framework for Ollama LLM integration and YOLOv8 computer vision
✅ **Docker Setup**: Full Docker Compose with PostgreSQL, Redis, Ollama services

## Development Workflow

### Project Setup
```bash
# Standard development flow
docker-compose up --build -d

# Backend development
cd backend
pip install -r requirements.txt
python run.py

# Database migrations
alembic upgrade head
alembic revision --autogenerate -m "description"
```

### Service Endpoints
- Frontend Dashboard: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`
- Ollama: `localhost:11434`

### File Structure
```
backend/app/
├── api/v1/endpoints/          # API route handlers
│   ├── clips.py              # Clip CRUD + AI processing
│   ├── users.py              # User management
│   ├── auth.py               # JWT authentication
│   ├── platforms.py          # Social media integrations
│   └── jobs.py               # Background job tracking
├── core/
│   ├── config.py             # Settings with Pydantic
│   └── database.py           # Async SQLAlchemy setup
├── models/
│   ├── database.py           # SQLAlchemy ORM models
│   └── schemas.py            # Pydantic request/response models
├── services/
│   ├── clip_service.py       # Business logic for clips
│   └── ai_service.py         # Ollama + YOLOv8 integration
└── main.py                   # FastAPI app with CORS & middleware
```

## Core Features to Implement

### 1. Clip Processing Pipeline
- Real-time folder monitoring for new clips
- YOLOv8-based highlight detection and frame analysis
- Auto-trimming based on detected key gaming events
- OpenCV for video processing and thumbnail generation

### 2. AI Metadata Generation
- Ollama LLM integration for SEO-optimized titles/descriptions
- Local AI processing (privacy-first approach)
- Platform-specific content optimization
- Hashtag and engagement optimization

### 3. Multi-Platform Distribution
- Platform-specific API integrations with proper rate limiting
- Scheduling system for optimal posting times
- Format optimization per platform (aspect ratios, durations)
- Credential management and OAuth flows

### 4. Notification System
- Real-time updates via Telegram, Slack, Discord bots
- Task progress tracking and error reporting
- System health monitoring

## Key Implementation Patterns

### Database Architecture
- **Async SQLAlchemy**: All database operations use `AsyncSession`
- **Alembic Migrations**: Database schema managed through migrations
- **Pydantic Models**: Request/response validation with `from_attributes=True`
- **Relationship Patterns**: Proper foreign keys between users, clips, jobs, publications

### API Design Standards
- **RESTful Endpoints**: Standard CRUD operations with consistent patterns
- **Background Tasks**: Long-running operations (AI processing) via `BackgroundTasks`
- **Error Handling**: Structured error responses with proper HTTP status codes
- **Pagination**: List endpoints support `page`, `per_page`, and filtering parameters

### AI Integration Architecture
- **Ollama LLMs**: Local inference at `http://ollama:11434` for metadata generation
- **YOLOv8 Computer Vision**: Highlight detection and object recognition in gaming clips
- **Async Processing**: AI tasks run as background jobs with progress tracking
- **Fallback Mechanisms**: Default metadata when AI services are unavailable

### Service Layer Pattern
- **ClipService**: Handles file uploads, database operations, metadata management
- **AIService**: Integrates Ollama, YOLOv8, and OpenCV for content analysis
- **Dependency Injection**: Services injected into endpoints via FastAPI's `Depends()`

### Configuration Management
- **Pydantic Settings**: Environment variables validated and typed via `BaseSettings`
- **Docker Environment**: All services configured through docker-compose environment
- **Security**: API keys and secrets managed through environment variables

## Development Priorities

1. **Phase 1**: Core video processing pipeline with folder monitoring
2. **Phase 2**: AI metadata generation using Ollama
3. **Phase 3**: Multi-platform publishing system
4. **Phase 4**: Web dashboard and user management
5. **Phase 5**: Analytics and insights dashboard

## Testing Strategy
- Unit tests for AI model integrations
- Integration tests for platform API connections
- End-to-end tests for complete clip processing workflow
- Mock external APIs for reliable CI/CD

When implementing new features, prioritize local AI processing, robust error handling, and platform-specific optimizations. The system should be self-contained and privacy-focused while maintaining high throughput for content processing.
