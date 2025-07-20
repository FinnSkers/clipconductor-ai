# 🎬 ClipConductor AI
### *Your AI-Powered Assistant for Effortless Gaming Content Creation*

![ClipConductor Hero Banner](assets/banner.png)

> **ClipConductor AI** automatically watches your gaming clips, detects highlights with AI, creates engaging metadata, and shares them across YouTube, TikTok, Instagram, and more.  
> Save hours of manual editing and focus on what you do best—**gaming**.

[🚀 Get Started](#-get-started) • [📖 Docs](#-documentation) • [⭐ Star Us](https://github.com/your-username/clipconductor-ai/stargazers)

---

## ✨ Why ClipConductor?

✅ **Hands-Free Automation**  
Detects, edits, and distributes your clips across platforms.

✅ **AI-Generated Content**  
Catchy titles, descriptions, hashtags, and thumbnails generated with LLMs.

✅ **Multi-Platform Ready**  
Publish simultaneously to YouTube, TikTok, Instagram, Twitter/X, Discord.

✅ **Privacy First**  
All processing runs locally—no need for expensive API keys or cloud services.

✅ **Beautiful Dashboard**  
Manage settings, monitor tasks, and track analytics from a single web interface.

---

## 🚀 Key Features

### 🎥 Intelligent Clip Detection
- Watches your game folder or stream recordings in real-time.
- Automatically trims long videos into bite-sized, shareable clips.

### 🧠 AI-Powered Metadata Generation
- Uses **local LLMs** (Ollama) to create engaging titles, descriptions, and hashtags.
- Generates thumbnails and captions for better reach.

### 📤 Omnichannel Publishing
- Uploads clips to **YouTube Shorts**, **TikTok**, **Instagram Reels**, and more.
- Configurable scheduling and platform-specific optimizations.

### 📲 Smart Notifications
- Telegram, Slack, or Discord updates for upload status and system health.

### 📊 Analytics Dashboard
- Track clip performance across platforms with AI-powered recommendations.

---

## 🌐 Get Started

### � Current Status - Backend Ready!

The backend is fully functional and ready for development. Here's how to get started:

```bash
# Clone the repository
git clone https://github.com/FinnSkers/clipconductor-ai.git
cd clipconductor-ai

# Install Python dependencies
cd backend
pip install fastapi uvicorn sqlalchemy pydantic pydantic-settings alembic asyncpg python-dotenv httpx

# Start the backend
python run.py
```

**🎯 Available Now:**
- 🌐 **Backend API**: [http://localhost:8000](http://localhost:8000)  
- 📖 **API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)  
- 💚 **Health Check**: [http://localhost:8000/health](http://localhost:8000/health)
- 🤖 **AI Endpoints**: Gaming metadata generation with local Ollama models
- 🧠 **3 LLM Models**: deepseek-r1:latest, medgemma:4b, nidum-gemma (5.2GB + 2.5GB + 4.1GB)

**🤖 AI Features Ready:**
```bash
# Test Ollama integration
curl -X POST http://localhost:8000/api/v1/ai/test-ollama

# Generate gaming metadata
curl -X POST http://localhost:8000/api/v1/ai/generate-metadata \
  -H "Content-Type: application/json" \
  -d '{"clip_title":"Epic Boss Fight","game_name":"Dark Souls"}'

# Check AI health
curl http://localhost:8000/api/v1/ai/health
```

**🔧 Check Status:**
```bash
python check_status.py
```

### 🐳 Full Docker Deployment (Coming Soon)

```bash
# Start all services (requires Docker)
docker compose up --build -d
```  

---

## 🗺 Roadmap

✅ **Backend Infrastructure** (Complete)  
✅ **FastAPI Application** with health checks and API docs  
✅ **Database Models** for clips, users, platforms, jobs  
✅ **Docker Configuration** ready for deployment  
✅ **AI-powered metadata generation** (Ollama integration complete!)  
✅ **Local LLM Integration** with 3 available models (deepseek-r1, medgemma, nidum-gemma)  
✅ **Gaming-specific AI endpoints** for content creation  
🔜 Computer vision highlights (YOLOv8 integration)  
🔜 Multi-platform publishing (YouTube, TikTok, Instagram)  
🔜 Real-time folder monitoring  
🔜 Frontend Dashboard (Next.js)  
🔜 Advanced analytics dashboard  
🔜 Teams & multi-user support  
🔜 Cloud hosting templates (AWS, GCP, DigitalOcean)  

---

## 🤝 Contribute

We 💚 contributions!  
- 📂 Fork the repo  
- 💡 Create a new branch  
- ✅ Submit a pull request  
- 🌟 Star us to support the project  

Read our [CONTRIBUTING.md](CONTRIBUTING.md) for details.

---

## 📜 License

[MIT License](LICENSE) © 2025 ClipConductor AI

---

## ⭐ Show Your Support

If you like this project, please give it a ⭐ on GitHub.

[![GitHub Stars](https://img.shields.io/github/stars/your-username/clipconductor-ai?style=social)](https://github.com/your-username/clipconductor-ai/stargazers)
