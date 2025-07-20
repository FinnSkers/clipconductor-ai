# ClipConductor AI – Backend Overview

## 🚀 Project Purpose
ClipConductor AI is an AI-powered backend platform for automated gaming content creation and multi-platform distribution. It leverages local LLMs (Ollama), computer vision, and a robust FastAPI microservices architecture to process gaming clips, generate metadata, and distribute content across YouTube, TikTok, Instagram, and more.

---

## 🏗️ Architecture & Tech Stack

**Core Stack:**
- **Framework:** FastAPI (async, production-ready)
- **Database:** PostgreSQL (asyncpg), SQLAlchemy ORM, Alembic migrations
- **AI/ML:** Ollama (local LLMs: deepseek-r1, medgemma, nidum-gemma), YOLOv8 (pending), OpenCV (pending)
- **Task Queue:** Celery + Redis (planned)
- **Infrastructure:** Docker Compose, .env config, modular service layer

**Service Flow:**
```
Frontend (Next.js) ←→ Backend (FastAPI) ←→ Task Queue (Celery+Redis)
                                    ↓
              AI Services (Ollama LLMs, YOLOv8, OpenCV)
                                    ↓
              Multi-Platform APIs (YouTube, TikTok, Instagram, etc.)
```

---

## 📁 File Structure

```
backend/app/
├── api/v1/endpoints/   # API route handlers (RESTful)
│   ├── ai.py           # AI endpoints (Ollama integration)
│   ├── clips.py        # Clip CRUD + AI processing
│   ├── users.py        # User management
│   ├── auth.py         # JWT authentication
│   ├── platforms.py    # Social media integrations
│   └── jobs.py         # Background job tracking
├── core/
│   ├── config.py       # Pydantic settings, Ollama config
│   └── database.py     # Async SQLAlchemy setup
├── models/
│   ├── database.py     # SQLAlchemy ORM models
│   └── schemas.py      # Pydantic request/response models
├── services/
│   ├── clip_service.py # Business logic for clips
│   ├── ai_service.py   # AI service layer
│   └── ai_service_ollama.py # Ollama LLM integration
└── main.py             # FastAPI app, CORS, middleware
```

---

## ✅ Current Implementation Status

- **FastAPI backend**: Running at `http://localhost:8000`
- **API docs**: Swagger UI at `/docs`
- **Database**: PostgreSQL, async SQLAlchemy, Alembic migrations
- **Ollama LLMs**: Integrated with 3 local models (deepseek-r1, medgemma, nidum-gemma)
- **AI Endpoints**: Gaming metadata, text generation, content analysis, health check
- **Docker Compose**: Multi-service orchestration (backend, db, redis, ollama)
- **Health Monitoring**: `/health` and `/api/v1/ai/health` endpoints

---

## 🤖 AI Capabilities (as of July 2025)

- **Ollama Integration**: Local LLMs for privacy-first, high-throughput content generation
- **Gaming Metadata Generation**: Titles, descriptions, hashtags, platform-optimized content
- **Content Analysis**: Engagement scoring, platform recommendations
- **Multi-Model Support**: deepseek-r1:latest, medgemma:4b, nidum-gemma (5.2GB, 2.5GB, 4.1GB)
- **Endpoints:**
  - `/api/v1/ai/models` – List available models
  - `/api/v1/ai/test-ollama` – Test LLM connection
  - `/api/v1/ai/generate-text` – General text generation
  - `/api/v1/ai/generate-metadata` – Gaming metadata
  - `/api/v1/ai/analyze-content` – Content analysis
  - `/api/v1/ai/health` – AI health check

---

## 🛠️ How to Run (Development)

```bash
# 1. Clone the repo
cd clipconductor-ai/backend

# 2. Install dependencies
pip install -r requirements.txt

# 3. Start the backend
python run.py

# 4. (Optional) Run with Docker Compose
cd ..
docker compose up --build -d
```

---

## 🟢 What’s Working
- All backend endpoints functional
- Ollama LLMs detected and responding
- Gaming metadata and content analysis endpoints tested and working
- Database connection and migrations verified
- Health checks and API docs available

---

## 🔜 Next Steps / TODO

1. **Computer Vision Integration**
   - Integrate YOLOv8 for highlight detection and auto-trimming
   - Add OpenCV for video processing and thumbnail generation
2. **Task Queue**
   - Add Celery + Redis for background AI/video jobs
3. **Multi-Platform Publishing**
   - Implement YouTube, TikTok, Instagram, Discord API integrations
   - Add scheduling and credential management
4. **Folder Monitoring**
   - Real-time file watcher for new gaming clips
5. **Frontend Dashboard**
   - Next.js/React dashboard for user management and analytics
6. **Testing**
   - Add unit, integration, and E2E tests (mock external APIs)

---

## 📝 Notes
- All AI processing is local and privacy-first
- Modular, service-oriented backend for easy extension
- Designed for high-throughput, automated gaming content workflows

---

## 📬 Questions?
Open an issue or check the API docs at `/docs`.

---

© 2025 ClipConductor AI – Backend Documentation
