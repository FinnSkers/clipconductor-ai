"""
ClipConductor AI - Clips Monitoring Service
Monitors the Outplayed folder for new gaming clips and processes them automatically
"""

import asyncio
import re
from pathlib import Path
from typing import List, Dict, Optional, Any
from datetime import datetime
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from app.services.ai_service_ollama import AIService
from app.models.schemas import ClipStatus


class OutplayedClipHandler(FileSystemEventHandler):
    """Handler for Outplayed folder file system events"""
    
    def __init__(self, clip_processor):
        self.clip_processor = clip_processor
        self.video_extensions = {'.mp4', '.mov', '.avi', '.mkv'}
    
    def on_created(self, event):
        """Handle new file creation"""
        if not event.is_directory:
            file_path = Path(event.src_path)
            if file_path.suffix.lower() in self.video_extensions:
                print(f"📹 New clip detected: {file_path.name}")
                # Queue for processing
                asyncio.create_task(self.clip_processor.process_new_clip(file_path))


class ClipsMonitor:
    """Monitors and processes gaming clips from Outplayed folder"""
    
    def __init__(self, outplayed_path: str = "E:\\contentio\\Outplayed"):
        self.outplayed_path = Path(outplayed_path)
        self.ai_service = AIService()
        self.observer = Observer()
        self.is_monitoring = False
        
    def parse_outplayed_filename(self, filename: str) -> Dict[str, Any]:
        """
        Parse Outplayed filename to extract game info
        Format: GameName_MM-DD-YYYY_HH-MM-SS-MS.mp4
        Example: Valorant_07-12-2025_23-41-33-933.mp4
        """
        pattern = r"^(.+?)_(\d{2}-\d{2}-\d{4})_(\d{1,2}-\d{1,2}-\d{1,2}-\d{1,3})\.(.+)$"
        match = re.match(pattern, filename)
        
        if match:
            game_name = match.group(1).replace("_", " ")
            date_str = match.group(2)
            time_str = match.group(3)
            extension = match.group(4)
            
            # Parse timestamp
            try:
                date_parts = date_str.split('-')
                time_parts = time_str.split('-')
                
                if len(date_parts) == 3 and len(time_parts) >= 3:
                    timestamp = datetime(
                        year=int(date_parts[2]),
                        month=int(date_parts[0]),
                        day=int(date_parts[1]),
                        hour=int(time_parts[0]),
                        minute=int(time_parts[1]),
                        second=int(time_parts[2])
                    )
                else:
                    timestamp = None
            except (ValueError, IndexError):
                timestamp = None
            
            return {
                "game_name": game_name,
                "date": date_str,
                "time": time_str,
                "timestamp": timestamp,
                "extension": extension,
                "original_filename": filename
            }
        
        return {
            "game_name": None,
            "date": None,
            "time": None, 
            "timestamp": None,
            "extension": None,
            "original_filename": filename
        }
    
    async def scan_existing_clips(self) -> List[Dict[str, Any]]:
        """Scan existing clips in the Outplayed folder"""
        clips = []
        
        if not self.outplayed_path.exists():
            print(f"❌ Outplayed path not found: {self.outplayed_path}")
            return clips
            
        print(f"🔍 Scanning for clips in: {self.outplayed_path}")
        
        for file_path in self.outplayed_path.rglob("*.mp4"):
            clip_info = self.parse_outplayed_filename(file_path.name)
            clip_info["file_path"] = str(file_path)
            clip_info["file_size"] = file_path.stat().st_size
            clip_info["status"] = ClipStatus.READY
            clips.append(clip_info)
        
        print(f"📊 Found {len(clips)} video clips")
        return clips
    
    async def generate_clip_metadata(self, clip_info: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Generate AI metadata for a gaming clip"""
        try:
            # Create a descriptive clip title
            game_name = clip_info.get("game_name", "Gaming")
            timestamp = clip_info.get("timestamp")
            
            if timestamp:
                clip_title = f"{game_name} Epic Moment - {timestamp.strftime('%B %d, %Y')}"
            else:
                clip_title = f"{game_name} Amazing Play"
            
            # Generate metadata using AI service
            metadata = await self.ai_service.metadata_service.generate_gaming_metadata(
                clip_title=clip_title,
                game_name=game_name,
                clip_duration=None  # Could extract from video file later
            )
            
            return metadata
            
        except Exception as e:
            print(f"❌ Error generating metadata for {clip_info['original_filename']}: {e}")
            return None
    
    async def process_new_clip(self, file_path: Path) -> Optional[Dict[str, Any]]:
        """Process a newly detected clip"""
        try:
            print(f"🚀 Processing new clip: {file_path.name}")
            
            clip_info = self.parse_outplayed_filename(file_path.name)
            clip_info["file_path"] = str(file_path)
            clip_info["file_size"] = file_path.stat().st_size
            
            # Generate AI metadata
            metadata = await self.generate_clip_metadata(clip_info)
            
            if metadata:
                print(f"✅ Generated metadata for: {clip_info['game_name']} clip")
                print(f"📝 Title: {metadata.get('title', 'N/A')}")
                print(f"🏷️ Hashtags: {len(metadata.get('hashtags', []))} tags")
                
                # Here you could save to database, trigger publishing, etc.
                return {
                    "clip_info": clip_info,
                    "metadata": metadata,
                    "status": "processed"
                }
            else:
                print(f"⚠️ Failed to generate metadata for: {file_path.name}")
                return None
                
        except Exception as e:
            print(f"❌ Error processing clip {file_path.name}: {e}")
            return None
    
    def start_monitoring(self):
        """Start monitoring the Outplayed folder"""
        if not self.outplayed_path.exists():
            print(f"❌ Cannot monitor - path does not exist: {self.outplayed_path}")
            return False
        
        handler = OutplayedClipHandler(self)
        self.observer.schedule(handler, str(self.outplayed_path), recursive=True)
        self.observer.start()
        self.is_monitoring = True
        
        print(f"👀 Started monitoring: {self.outplayed_path}")
        print("🎮 Waiting for new gaming clips...")
        return True
    
    def stop_monitoring(self):
        """Stop monitoring the folder"""
        if self.observer.is_alive():
            self.observer.stop()
            self.observer.join()
        self.is_monitoring = False
        print("⏹️ Stopped clip monitoring")
    
    async def process_clip_batch(self, limit: int = 5) -> List[Dict[str, Any]]:
        """Process a batch of existing clips for testing"""
        clips = await self.scan_existing_clips()
        processed = []
        
        print(f"🔄 Processing {min(limit, len(clips))} clips...")
        
        for clip_info in clips[:limit]:
            print(f"\n📹 Processing: {clip_info['original_filename']}")
            metadata = await self.generate_clip_metadata(clip_info)
            
            if metadata:
                processed.append({
                    "clip_info": clip_info,
                    "metadata": metadata
                })
                print(f"✅ Generated: {metadata.get('title', 'N/A')}")
            else:
                print(f"❌ Failed to process: {clip_info['original_filename']}")
        
        print(f"\n🎯 Successfully processed {len(processed)}/{limit} clips")
        return processed


# Example usage
if __name__ == "__main__":
    async def main():
        monitor = ClipsMonitor()
        
        # Process a few clips for testing
        results = await monitor.process_clip_batch(limit=3)
        
        for result in results:
            clip = result["clip_info"]
            meta = result["metadata"]
            print(f"\n🎮 {clip['game_name']} - {clip['original_filename']}")
            print(f"📝 {meta['title']}")
            print(f"🏷️ {', '.join(meta['hashtags'][:5])}...")
    
    asyncio.run(main())
