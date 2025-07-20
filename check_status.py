#!/usr/bin/env python3
"""
Status Check for ClipConductor AI Backend
"""

import asyncio
import sys
import httpx
from pathlib import Path

# Add the backend directory to the Python path
backend_dir = Path(__file__).parent / "backend"
sys.path.insert(0, str(backend_dir))

async def check_backend_status():
    """Check if the backend is running and healthy"""
    print("🔍 Checking ClipConductor AI Backend Status...")
    
    try:
        async with httpx.AsyncClient() as client:
            # Test root endpoint
            print("\n📋 Testing Root Endpoint...")
            response = await client.get("http://localhost:8000/")
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Root endpoint: {data['message']}")
                print(f"✅ Version: {data['version']}")
            else:
                print(f"❌ Root endpoint failed: {response.status_code}")
                return False
            
            # Test health endpoint
            print("\n🏥 Testing Health Endpoint...")
            response = await client.get("http://localhost:8000/health")
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Health status: {data['status']}")
                print(f"✅ Service: {data['service']}")
            else:
                print(f"❌ Health endpoint failed: {response.status_code}")
                return False
            
            # Test API docs
            print("\n📖 Testing API Documentation...")
            response = await client.get("http://localhost:8000/docs")
            if response.status_code == 200:
                print("✅ API documentation accessible")
            else:
                print(f"❌ API docs failed: {response.status_code}")
                return False
            
            print("\n🎉 Backend Status: ALL SYSTEMS GO!")
            print("\n📋 Available Endpoints:")
            print("   • Root: http://localhost:8000/")
            print("   • Health: http://localhost:8000/health")
            print("   • API Docs: http://localhost:8000/docs")
            print("   • OpenAPI: http://localhost:8000/openapi.json")
            
            return True
            
    except httpx.ConnectError:
        print("❌ Cannot connect to backend. Is it running?")
        print("💡 Start with: python backend/run.py")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

if __name__ == "__main__":
    result = asyncio.run(check_backend_status())
    sys.exit(0 if result else 1)
