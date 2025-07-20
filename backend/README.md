# ClipConductor AI Backend

FastAPI-based backend service for the ClipConductor AI platform.

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Docker & Docker Compose
- PostgreSQL (optional, handled by Docker)
- Redis (optional, handled by Docker)

### Development Setup

1. **Clone and navigate to backend directory**
```bash
cd backend
```

2. **Create environment file**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Start with Docker Compose (Recommended)**
```bash
# From project root
docker-compose up --build -d
```

5. **Access the application**
- API: http://localhost:8000
- API Documentation: http://localhost:8000/docs
- Database: localhost:5432
- Redis: localhost:6379
- Ollama: localhost:11434

### Manual Development Setup

If you prefer running without Docker:

```bash
# Install dependencies
pip install -r requirements.txt

# Set up database (PostgreSQL)
createdb clipconductor_ai

# Run migrations
alembic upgrade head

# Start Redis
redis-server

# Start Ollama (for AI features)
ollama serve

# Start the development server
python run.py
# or
uvicorn app.main:app --reload
```

## 📁 Project Structure

```
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── endpoints/         # API route handlers
│   │       │   ├── clips.py       # Clip management
│   │       │   ├── users.py       # User management
│   │       │   ├── auth.py        # Authentication
│   │       │   ├── platforms.py   # Social media platforms
│   │       │   └── jobs.py        # Processing jobs
│   │       └── router.py          # API router configuration
│   ├── core/
│   │   ├── config.py             # Application settings
│   │   └── database.py           # Database configuration
│   ├── models/
│   │   ├── database.py           # SQLAlchemy models
│   │   └── schemas.py            # Pydantic schemas
│   ├── services/
│   │   ├── clip_service.py       # Clip business logic
│   │   └── ai_service.py         # AI/ML integration
│   ├── utils/                    # Utility functions
│   └── main.py                   # FastAPI application
├── alembic/                      # Database migrations
├── tests/                        # Test files
├── requirements.txt              # Python dependencies
├── Dockerfile                    # Docker configuration
├── .env.example                  # Environment template
└── run.py                        # Development server script
```

## 🔧 Configuration

Key environment variables:

```env
# Database
POSTGRES_SERVER=db
POSTGRES_USER=clipconductor
POSTGRES_PASSWORD=clipconductor123
POSTGRES_DB=clipconductor_ai

# AI Services
OLLAMA_BASE_URL=http://ollama:11434
OLLAMA_MODEL=llama2
YOLO_MODEL_PATH=yolov8n.pt

# Social Media APIs
YOUTUBE_CLIENT_ID=your_client_id
TIKTOK_CLIENT_KEY=your_client_key
# ... (see .env.example for full list)
```

## 🛠 API Endpoints

### Core Endpoints

- `GET /` - Root endpoint
- `GET /health` - Health check
- `GET /docs` - API documentation (Swagger UI)

### Clips API (`/api/v1/clips`)

- `GET /` - List all clips (paginated)
- `GET /{clip_id}` - Get specific clip
- `POST /` - Create new clip
- `POST /upload` - Upload video file
- `PUT /{clip_id}` - Update clip
- `DELETE /{clip_id}` - Delete clip
- `POST /{clip_id}/generate-metadata` - Generate AI metadata
- `POST /{clip_id}/detect-highlights` - Detect highlights

### Users API (`/api/v1/users`)

- `GET /` - List users
- `POST /` - Create user
- `GET /{user_id}` - Get user details

### Authentication (`/api/v1/auth`)

- `POST /login` - User login
- `POST /logout` - User logout
- `POST /refresh` - Refresh token

### Platforms API (`/api/v1/platforms`)

- `GET /` - List supported platforms
- `POST /{platform}/auth` - Platform authentication
- `POST /{platform}/publish` - Publish to platform
- `GET /{platform}/status` - Platform status

### Jobs API (`/api/v1/jobs`)

- `GET /` - List processing jobs
- `GET /{job_id}` - Get job details
- `POST /{job_id}/cancel` - Cancel job
- `GET /clip/{clip_id}` - Get clip jobs

## 🧠 AI Integration

### Local LLM (Ollama)

The backend integrates with Ollama for local AI processing:

- **Models**: Llama2, CodeLlama, Mistral (configurable)
- **Tasks**: Metadata generation, content analysis
- **Endpoint**: `http://ollama:11434`

### Computer Vision (YOLOv8)

Uses Ultralytics YOLOv8 for:

- Object detection in gaming clips
- Highlight detection
- Action scene identification
- Frame analysis

### Background Processing

Long-running AI tasks are handled via:

- **Celery** for task queuing
- **Redis** as message broker
- Background task monitoring
- Progress tracking

## 🗄 Database

### Schema

- **Users**: User accounts and authentication
- **Clips**: Video files and metadata
- **PlatformCredentials**: Social media API credentials
- **Publications**: Platform publishing records
- **ProcessingJobs**: Background task tracking
- **SystemConfig**: Application configuration

### Migrations

```bash
# Create new migration
alembic revision --autogenerate -m "Description"

# Apply migrations
alembic upgrade head

# Rollback migration
alembic downgrade -1
```

## 🚀 Deployment

### Docker Production

```bash
# Build production image
docker build -t clipconductor-backend .

# Run with production settings
docker run -d \
  -p 8000:8000 \
  -e DEBUG=false \
  -e DATABASE_URL=your_production_db_url \
  clipconductor-backend
```

### Environment Variables for Production

```env
DEBUG=false
SECRET_KEY=your-secure-secret-key
DATABASE_URL=postgresql://user:pass@host:port/db
REDIS_URL=redis://redis:6379

# Add all API keys for social media platforms
YOUTUBE_CLIENT_ID=...
TIKTOK_CLIENT_KEY=...
# etc.
```

## 🧪 Testing

```bash
# Run tests
pytest

# Run with coverage
pytest --cov=app

# Run specific test file
pytest tests/test_clips.py
```

## 📝 Development

### Code Style

- **Formatter**: Black
- **Import sorting**: isort
- **Linting**: Flake8
- **Type checking**: MyPy

```bash
# Format code
black app/

# Sort imports
isort app/

# Lint
flake8 app/

# Type check
mypy app/
```

### Adding New Endpoints

1. Create route handler in `app/api/v1/endpoints/`
2. Add Pydantic schemas in `app/models/schemas.py`
3. Update router in `app/api/v1/router.py`
4. Add tests in `tests/`

### Adding New Services

1. Create service class in `app/services/`
2. Implement business logic
3. Add dependency injection
4. Write unit tests

## 🔍 Monitoring

### Health Checks

- Database connectivity
- Redis connectivity
- Ollama service status
- Disk space monitoring

### Logging

Structured logging with:

- Request/response logging
- Error tracking
- Performance monitoring
- AI processing metrics

## 🤝 Contributing

1. Create feature branch
2. Write tests
3. Follow code style guidelines
4. Update documentation
5. Submit pull request

## 📞 Support

- Issues: GitHub Issues
- Documentation: `/docs` endpoint
- API Reference: `/docs` (Swagger UI)
