import asyncio
import cv2
import numpy as np
from typing import Dict, List, Optional, Any
import httpx
import json
from ultralytics import YOLO
from app.core.config import settings
from app.models.database import Clip as ClipModel, ProcessingJob as ProcessingJobModel
from app.models.schemas import JobStatus
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update


class AIService:
    def __init__(self):
        self.ollama_client = httpx.AsyncClient(base_url=settings.OLLAMA_BASE_URL)
        self.yolo_model = None
    
    def load_yolo_model(self):
        """Load YOLO model for object detection"""
        if not self.yolo_model:
            self.yolo_model = YOLO(settings.YOLO_MODEL_PATH)
        return self.yolo_model
    
    async def detect_highlights(self, clip_id: int) -> Dict[str, Any]:
        """Detect highlights in a video using YOLO and OpenCV"""
        try:
            # Load YOLO model
            model = self.load_yolo_model()
            
            # Get clip file path from database
            # TODO: Add database session to get file path
            
            # Mock implementation for now
            highlights = {
                "kill_moments": [
                    {"timestamp": 45.2, "confidence": 0.85},
                    {"timestamp": 123.7, "confidence": 0.92}
                ],
                "action_scenes": [
                    {"timestamp": 67.3, "confidence": 0.78},
                    {"timestamp": 189.1, "confidence": 0.81}
                ],
                "weapon_pickups": [
                    {"timestamp": 12.5, "confidence": 0.73}
                ]
            }
            
            return highlights
            
        except Exception as e:
            print(f"Error detecting highlights: {e}")
            return {}
    
    async def generate_metadata(self, clip_id: int, game_title: Optional[str] = None) -> Dict[str, Any]:
        """Generate AI metadata using Ollama LLM"""
        try:
            # Create prompt for metadata generation
            prompt = f"""
            Generate engaging gaming content metadata for a {game_title or 'gaming'} clip.
            
            Create:
            1. A catchy title (max 60 characters)
            2. An engaging description (max 200 characters)
            3. 5-10 relevant hashtags
            4. Platform-specific optimizations for YouTube Shorts, TikTok, and Instagram Reels
            
            Response should be in JSON format.
            """
            
            # Call Ollama API
            response = await self.ollama_client.post("/api/generate", json={
                "model": settings.OLLAMA_MODEL,
                "prompt": prompt,
                "stream": False,
                "format": "json"
            })
            
            if response.status_code == 200:
                result = response.json()
                
                # Parse the AI response
                try:
                    metadata = json.loads(result.get("response", "{}"))
                except:
                    # Fallback metadata if JSON parsing fails
                    metadata = {
                        "title": "Epic Gaming Moment!",
                        "description": "Check out this amazing gameplay highlight!",
                        "hashtags": ["#gaming", "#highlights", "#epic", "#gameplay"],
                        "platform_optimizations": {
                            "youtube": {"title": "Epic Gaming Moment - You Won't Believe This!"},
                            "tiktok": {"title": "Gaming vibes ✨", "hashtags": ["#fyp", "#gaming"]},
                            "instagram": {"title": "Epic gameplay 🎮", "hashtags": ["#reels", "#gaming"]}
                        }
                    }
                
                return metadata
            else:
                raise Exception(f"Ollama API error: {response.status_code}")
                
        except Exception as e:
            print(f"Error generating metadata: {e}")
            # Return fallback metadata
            return {
                "title": "Gaming Highlight",
                "description": "Amazing gameplay moment",
                "hashtags": ["#gaming", "#highlights"],
                "platform_optimizations": {}
            }
    
    async def generate_thumbnail(self, clip_id: int) -> Optional[str]:
        """Generate thumbnail from video using OpenCV"""
        try:
            # Get clip file path
            # TODO: Get from database
            
            # Mock thumbnail generation
            thumbnail_path = f"thumbnails/clip_{clip_id}_thumb.jpg"
            
            # In real implementation:
            # 1. Extract frame from video at highlight timestamp
            # 2. Apply AI enhancements (text overlay, effects)
            # 3. Save as thumbnail
            
            return thumbnail_path
            
        except Exception as e:
            print(f"Error generating thumbnail: {e}")
            return None
    
    async def analyze_game_content(self, video_path: str) -> Dict[str, Any]:
        """Analyze video content to detect game type and events"""
        try:
            cap = cv2.VideoCapture(video_path)
            
            if not cap.isOpened():
                raise Exception("Could not open video file")
            
            # Get video properties
            fps = cap.get(cv2.CAP_PROP_FPS)
            frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            duration = frame_count / fps
            
            # Sample frames for analysis
            sample_frames = []
            sample_interval = max(1, int(frame_count / 10))  # Sample 10 frames
            
            for i in range(0, frame_count, sample_interval):
                cap.set(cv2.CAP_PROP_POS_FRAMES, i)
                ret, frame = cap.read()
                if ret:
                    sample_frames.append(frame)
            
            cap.release()
            
            # Analyze frames with YOLO
            model = self.load_yolo_model()
            detections = []
            
            for frame in sample_frames:
                results = model(frame)
                # Process YOLO results
                for r in results:
                    if r.boxes is not None:
                        detections.extend(r.boxes.cls.tolist())
            
            # Determine game type and events based on detections
            analysis = {
                "duration": duration,
                "fps": fps,
                "detected_objects": detections,
                "game_type": "unknown",  # Could be enhanced with game-specific detection
                "action_density": len(detections) / len(sample_frames) if sample_frames else 0
            }
            
            return analysis
            
        except Exception as e:
            print(f"Error analyzing game content: {e}")
            return {"error": str(e)}
    
    async def optimize_for_platform(self, metadata: Dict[str, Any], platform: str) -> Dict[str, Any]:
        """Optimize metadata for specific platform"""
        platform_configs = {
            "youtube": {
                "max_title_length": 60,
                "max_description_length": 5000,
                "optimal_duration": (15, 60),  # 15-60 seconds
                "aspect_ratio": "9:16"
            },
            "tiktok": {
                "max_title_length": 150,
                "max_description_length": 300,
                "optimal_duration": (15, 180),  # 15-180 seconds
                "aspect_ratio": "9:16"
            },
            "instagram": {
                "max_title_length": 125,
                "max_description_length": 2200,
                "optimal_duration": (15, 90),  # 15-90 seconds
                "aspect_ratio": "9:16"
            }
        }
        
        config = platform_configs.get(platform, {})
        optimized = metadata.copy()
        
        # Truncate title if needed
        if "max_title_length" in config:
            title = optimized.get("title", "")
            if len(title) > config["max_title_length"]:
                optimized["title"] = title[:config["max_title_length"]-3] + "..."
        
        # Add platform-specific hashtags
        platform_hashtags = {
            "youtube": ["#shorts", "#youtube"],
            "tiktok": ["#fyp", "#viral", "#tiktok"],
            "instagram": ["#reels", "#instagram", "#viral"]
        }
        
        if platform in platform_hashtags:
            existing_hashtags = optimized.get("hashtags", [])
            optimized["hashtags"] = list(set(existing_hashtags + platform_hashtags[platform]))
        
        return optimized
