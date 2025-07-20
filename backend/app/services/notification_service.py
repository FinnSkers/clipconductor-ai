"""
ClipConductor AI - Notification Service
Handles Telegram, Discord, and Slack notifications for various events
"""

import asyncio
import json
from typing import Optional, Dict, Any, List
from datetime import datetime
import httpx
from app.core.config import settings


class NotificationService:
    """Service for sending notifications to various platforms"""
    
    def __init__(self):
        self.client = httpx.AsyncClient()
        # Load notification settings from environment or config
        self.telegram_bot_token = getattr(settings, 'TELEGRAM_BOT_TOKEN', None)
        self.telegram_chat_id = getattr(settings, 'TELEGRAM_CHAT_ID', None)
        self.discord_webhook = getattr(settings, 'DISCORD_WEBHOOK', None)
        self.slack_webhook = getattr(settings, 'SLACK_WEBHOOK', None)
        
    async def __aenter__(self):
        return self
        
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.client.aclose()

    async def send_telegram_message(
        self, 
        message: str, 
        bot_token: Optional[str] = None, 
        chat_id: Optional[str] = None,
        parse_mode: str = "Markdown"
    ) -> bool:
        """Send message to Telegram"""
        try:
            token = bot_token or self.telegram_bot_token
            chat = chat_id or self.telegram_chat_id
            
            if not token or not chat:
                print("⚠️ Telegram credentials not configured")
                return False
            
            url = f"https://api.telegram.org/bot{token}/sendMessage"
            payload = {
                "chat_id": chat,
                "text": message,
                "parse_mode": parse_mode,
                "disable_web_page_preview": True
            }
            
            response = await self.client.post(url, json=payload)
            
            if response.status_code == 200:
                print("✅ Telegram notification sent successfully")
                return True
            else:
                print(f"❌ Telegram notification failed: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Telegram notification error: {e}")
            return False

    async def send_discord_webhook(
        self, 
        message: str, 
        webhook_url: Optional[str] = None,
        embeds: Optional[List[Dict]] = None
    ) -> bool:
        """Send message to Discord via webhook"""
        try:
            url = webhook_url or self.discord_webhook
            
            if not url:
                print("⚠️ Discord webhook not configured")
                return False
            
            payload = {
                "content": message,
                "username": "ClipConductor AI",
                "avatar_url": "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            }
            
            if embeds:
                payload["embeds"] = embeds
            
            response = await self.client.post(url, json=payload)
            
            if response.status_code in [200, 204]:
                print("✅ Discord notification sent successfully")
                return True
            else:
                print(f"❌ Discord notification failed: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Discord notification error: {e}")
            return False

    async def send_slack_webhook(
        self, 
        message: str, 
        webhook_url: Optional[str] = None,
        blocks: Optional[List[Dict]] = None
    ) -> bool:
        """Send message to Slack via webhook"""
        try:
            url = webhook_url or self.slack_webhook
            
            if not url:
                print("⚠️ Slack webhook not configured")
                return False
            
            payload = {
                "text": message,
                "username": "ClipConductor AI",
                "icon_emoji": ":robot_face:"
            }
            
            if blocks:
                payload["blocks"] = blocks
            
            response = await self.client.post(url, json=payload)
            
            if response.status_code == 200:
                print("✅ Slack notification sent successfully")
                return True
            else:
                print(f"❌ Slack notification failed: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Slack notification error: {e}")
            return False

    def format_clip_notification(self, clip_info: Dict, metadata: Optional[Dict] = None) -> str:
        """Format clip processing notification"""
        game = clip_info.get('game_name', 'Unknown Game')
        filename = clip_info.get('original_filename', 'Unknown')
        
        message = f"🎮 *New Clip Processed!*\n\n"
        message += f"🎯 **Game:** {game}\n"
        message += f"📁 **File:** `{filename}`\n"
        
        if metadata:
            title = metadata.get('title', 'N/A')
            hashtags = metadata.get('hashtags', [])
            
            message += f"📝 **Title:** {title}\n"
            message += f"🏷️ **Hashtags:** {len(hashtags)} generated\n"
            
            if hashtags:
                message += f"📱 **Top Tags:** {' '.join(hashtags[:5])}\n"
        
        message += f"\n⏰ {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
        
        return message

    def format_error_notification(self, error_type: str, details: str) -> str:
        """Format error notification"""
        message = f"🚨 *ClipConductor AI Error*\n\n"
        message += f"❌ **Type:** {error_type}\n"
        message += f"📋 **Details:** {details}\n"
        message += f"\n⏰ {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
        
        return message

    def format_stats_notification(self, stats: Dict) -> str:
        """Format daily stats notification"""
        message = f"📊 *Daily ClipConductor Stats*\n\n"
        
        total_clips = stats.get('total_clips', 0)
        processed_today = stats.get('processed_today', 0)
        total_size = stats.get('total_size_mb', 0)
        
        message += f"🎮 **Total Clips:** {total_clips}\n"
        message += f"✅ **Processed Today:** {processed_today}\n"
        message += f"💾 **Total Size:** {total_size:.1f} GB\n"
        
        games = stats.get('games', {})
        if games:
            message += f"\n**Top Games:**\n"
            for game, data in list(games.items())[:3]:
                if isinstance(data, dict):
                    count = data.get('count', 0)
                    message += f"• {game}: {count} clips\n"
        
        message += f"\n⏰ {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
        
        return message

    async def notify_clip_processed(
        self, 
        clip_info: Dict, 
        metadata: Optional[Dict] = None,
        platforms: Optional[List[str]] = None
    ):
        """Send notification when a clip is processed"""
        message = self.format_clip_notification(clip_info, metadata)
        
        platforms = platforms or ['telegram']
        
        tasks = []
        if 'telegram' in platforms:
            tasks.append(self.send_telegram_message(message))
        if 'discord' in platforms:
            tasks.append(self.send_discord_webhook(message))
        if 'slack' in platforms:
            tasks.append(self.send_slack_webhook(message))
        
        if tasks:
            await asyncio.gather(*tasks, return_exceptions=True)

    async def notify_error(
        self, 
        error_type: str, 
        details: str,
        platforms: Optional[List[str]] = None
    ):
        """Send error notification"""
        message = self.format_error_notification(error_type, details)
        
        platforms = platforms or ['telegram']
        
        tasks = []
        if 'telegram' in platforms:
            tasks.append(self.send_telegram_message(message))
        if 'discord' in platforms:
            tasks.append(self.send_discord_webhook(message))
        if 'slack' in platforms:
            tasks.append(self.send_slack_webhook(message))
        
        if tasks:
            await asyncio.gather(*tasks, return_exceptions=True)

    async def notify_daily_stats(
        self, 
        stats: Dict,
        platforms: Optional[List[str]] = None
    ):
        """Send daily statistics notification"""
        message = self.format_stats_notification(stats)
        
        platforms = platforms or ['telegram']
        
        tasks = []
        if 'telegram' in platforms:
            tasks.append(self.send_telegram_message(message))
        if 'discord' in platforms:
            tasks.append(self.send_discord_webhook(message))
        if 'slack' in platforms:
            tasks.append(self.send_slack_webhook(message))
        
        if tasks:
            await asyncio.gather(*tasks, return_exceptions=True)

    async def test_notifications(
        self, 
        telegram_token: Optional[str] = None,
        telegram_chat: Optional[str] = None,
        discord_webhook: Optional[str] = None,
        slack_webhook: Optional[str] = None
    ) -> Dict[str, bool]:
        """Test all notification services"""
        results = {}
        
        test_message = f"🧪 *ClipConductor AI Test*\n\nThis is a test notification from your ClipConductor AI setup!\n\n⏰ {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
        
        # Test Telegram
        if telegram_token and telegram_chat:
            results['telegram'] = await self.send_telegram_message(
                test_message, telegram_token, telegram_chat
            )
        
        # Test Discord
        if discord_webhook:
            results['discord'] = await self.send_discord_webhook(
                test_message, discord_webhook
            )
        
        # Test Slack
        if slack_webhook:
            results['slack'] = await self.send_slack_webhook(
                test_message, slack_webhook
            )
        
        return results


# Global notification service instance
notification_service = NotificationService()


# Example usage
if __name__ == "__main__":
    async def test():
        async with NotificationService() as notifier:
            # Test clip notification
            clip_info = {
                "game_name": "VALORANT",
                "original_filename": "Valorant_07-20-2025_15-30-45-123.mp4"
            }
            
            metadata = {
                "title": "🎮 VALORANT Epic Clutch - July 20, 2025 - You Won't Believe This!",
                "hashtags": ["#gaming", "#valorant", "#clutch", "#epic", "#viral"]
            }
            
            await notifier.notify_clip_processed(clip_info, metadata)
    
    asyncio.run(test())
