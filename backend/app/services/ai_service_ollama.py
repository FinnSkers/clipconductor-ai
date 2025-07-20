import asyncio
import httpx
import json
from typing import Dict, List, Optional, Any
from app.core.config import settings
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from app.models.database import Clip as ClipModel, ProcessingJob as ProcessingJobModel
from app.models.schemas import JobStatus
import logging

logger = logging.getLogger(__name__)


class OllamaService:
    def __init__(self):
        self.base_url = settings.OLLAMA_BASE_URL
        self.client = httpx.AsyncClient(timeout=60.0)
        self.default_model = "deepseek-r1:latest"  # Using your available model
    
    async def __aenter__(self):
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.client.aclose()
    
    async def list_models(self) -> List[Dict[str, Any]]:
        """Get list of available models"""
        try:
            response = await self.client.get(f"{self.base_url}/api/tags")
            if response.status_code == 200:
                data = response.json()
                return data.get("models", [])
            return []
        except Exception as e:
            logger.error(f"Error listing models: {e}")
            return []
    
    async def generate_text(self, prompt: str, model: Optional[str] = None) -> str:
        """Generate text using Ollama"""
        try:
            model_name = model or self.default_model
            
            payload = {
                "model": model_name,
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": 0.7,
                    "top_p": 0.9,
                    "max_tokens": 500
                }
            }
            
            response = await self.client.post(
                f"{self.base_url}/api/generate",
                json=payload,
                timeout=60.0
            )
            
            if response.status_code == 200:
                result = response.json()
                return result.get("response", "").strip()
            else:
                logger.error(f"Ollama API error: {response.status_code} - {response.text}")
                return ""
                
        except Exception as e:
            logger.error(f"Error generating text: {e}")
            return ""


class AIMetadataService:
    def __init__(self):
        self.ollama = OllamaService()
    
    async def generate_gaming_metadata(self, 
                                     clip_title: str,
                                     game_name: Optional[str] = None,
                                     clip_duration: Optional[int] = None) -> Dict[str, Any]:
        """Generate gaming-specific metadata"""
        
        game_context = f" for {game_name}" if game_name else ""
        duration_context = f" ({clip_duration}s long)" if clip_duration else ""
        
        prompt = f"""
        Create engaging social media metadata for a gaming clip titled "{clip_title}"{game_context}{duration_context}.
        
        Generate:
        1. A catchy title (max 60 characters) that would get clicks
        2. An engaging description (max 200 characters) with emoji
        3. 8-12 trending hashtags relevant to gaming
        4. Platform-specific optimizations
        
        Focus on gaming keywords, action words, and viral potential.
        
        Respond in JSON format:
        {{
            "title": "Epic Gaming Moment!",
            "description": "🎮 Insane clutch play that'll blow your mind! Watch till the end! 🔥",
            "hashtags": ["#gaming", "#epic", "#clutch", "#viral", "#fyp", "#gaming2024"],
            "platforms": {{
                "youtube": {{
                    "title": "YouTube optimized title",
                    "tags": ["gaming", "highlights"]
                }},
                "tiktok": {{
                    "title": "TikTok viral title",
                    "hashtags": ["#fyp", "#gaming", "#viral"]
                }},
                "instagram": {{
                    "title": "Instagram engaging title",
                    "hashtags": ["#reels", "#gaming", "#viral"]
                }}
            }}
        }}
        """
        
        async with self.ollama:
            response = await self.ollama.generate_text(prompt)
            
            try:
                # Try to parse JSON response
                metadata = json.loads(response)
                return metadata
            except json.JSONDecodeError:
                # Fallback if JSON parsing fails
                logger.warning("Failed to parse AI response as JSON, using fallback")
                return self._generate_fallback_metadata(clip_title, game_name)
    
    def _generate_fallback_metadata(self, clip_title: str, game_name: Optional[str] = None) -> Dict[str, Any]:
        """Fallback metadata when AI generation fails"""
        base_title = clip_title or "Epic Gaming Moment"
        game_tag = f"#{game_name.lower().replace(' ', '')}" if game_name else "#gaming"
        
        return {
            "title": f"🎮 {base_title} - You Won't Believe This!",
            "description": f"🔥 Amazing {game_name or 'gaming'} highlight! Watch till the end! 💯",
            "hashtags": [
                "#gaming", "#highlights", "#epic", "#viral", "#fyp", 
                "#gamer", "#clutch", "#insane", game_tag, "#gaming2025"
            ],
            "platforms": {
                "youtube": {
                    "title": f"{base_title} - Epic Gaming Highlight!",
                    "tags": ["gaming", "highlights", "viral", "epic"]
                },
                "tiktok": {
                    "title": f"🎮 {base_title} 🔥",
                    "hashtags": ["#fyp", "#gaming", "#viral", "#epic"]
                },
                "instagram": {
                    "title": f"🎮 {base_title} 💯",
                    "hashtags": ["#reels", "#gaming", "#viral", "#insane"]
                }
            }
        }
    
    async def analyze_gaming_content(self, clip_title: str, file_path: str) -> Dict[str, Any]:
        """Analyze gaming content and suggest improvements"""
        
        prompt = f"""
        Analyze this gaming clip: "{clip_title}"
        
        Provide analysis in JSON format:
        {{
            "content_type": "action/strategy/casual/competitive",
            "engagement_potential": "high/medium/low",
            "suggested_improvements": ["tip1", "tip2"],
            "target_audience": "description",
            "best_platforms": ["youtube", "tiktok", "instagram"],
            "optimal_posting_time": "description"
        }}
        """
        
        async with self.ollama:
            response = await self.ollama.generate_text(prompt)
            
            try:
                return json.loads(response)
            except json.JSONDecodeError:
                return {
                    "content_type": "gaming",
                    "engagement_potential": "medium",
                    "suggested_improvements": ["Add engaging thumbnail", "Include call-to-action"],
                    "target_audience": "Gaming enthusiasts",
                    "best_platforms": ["youtube", "tiktok", "instagram"],
                    "optimal_posting_time": "Peak gaming hours (6-10 PM)"
                }


class AIService:
    def __init__(self):
        self.metadata_service = AIMetadataService()
        self.ollama = OllamaService()
    
    async def generate_metadata(self, clip_id: int, db: AsyncSession = None) -> Dict[str, Any]:
        """Generate AI metadata for a clip"""
        try:
            if db:
                # Get clip info from database
                result = await db.execute(
                    select(ClipModel.title, ClipModel.file_path, ClipModel.duration)
                    .where(ClipModel.id == clip_id)
                )
                clip_data = result.first()
                
                if clip_data:
                    title, file_path, duration = clip_data
                else:
                    title, file_path, duration = f"Gaming Clip {clip_id}", "", None
            else:
                title, file_path, duration = f"Gaming Clip {clip_id}", "", None
            
            # Generate metadata
            metadata = await self.metadata_service.generate_gaming_metadata(
                clip_title=title,
                clip_duration=duration
            )
            
            # Update database with generated metadata
            if db:
                await db.execute(
                    update(ClipModel)
                    .where(ClipModel.id == clip_id)
                    .values(ai_metadata=metadata, status="ready")
                )
                await db.commit()
            
            return metadata
            
        except Exception as e:
            logger.error(f"Error generating metadata for clip {clip_id}: {e}")
            return self.metadata_service._generate_fallback_metadata(f"Gaming Clip {clip_id}")
    
    async def detect_highlights(self, clip_id: int, db: AsyncSession = None) -> Dict[str, Any]:
        """Mock highlight detection (placeholder for computer vision)"""
        # This would integrate with YOLOv8 for actual highlight detection
        mock_highlights = {
            "detected_events": [
                {"type": "kill", "timestamp": 15.5, "confidence": 0.85},
                {"type": "achievement", "timestamp": 32.1, "confidence": 0.92},
                {"type": "epic_moment", "timestamp": 48.7, "confidence": 0.78}
            ],
            "best_moments": [
                {"start": 14.0, "end": 18.0, "score": 0.95},
                {"start": 30.5, "end": 35.0, "score": 0.88}
            ],
            "recommended_clips": [
                {"start": 10.0, "end": 25.0, "title": "Epic Kill Streak"},
                {"start": 40.0, "end": 55.0, "title": "Amazing Play"}
            ]
        }
        
        if db:
            await db.execute(
                update(ClipModel)
                .where(ClipModel.id == clip_id)
                .values(highlights_detected=mock_highlights)
            )
            await db.commit()
        
        return mock_highlights
    
    async def generate_thumbnail(self, clip_id: int, db: AsyncSession = None) -> Optional[str]:
        """Generate thumbnail (placeholder)"""
        # This would use OpenCV to extract and enhance frames
        thumbnail_path = f"thumbnails/clip_{clip_id}_thumb.jpg"
        
        logger.info(f"Generated thumbnail for clip {clip_id}: {thumbnail_path}")
        return thumbnail_path
    
    async def get_available_models(self) -> List[Dict[str, Any]]:
        """Get available Ollama models"""
        async with self.ollama:
            return await self.ollama.list_models()
