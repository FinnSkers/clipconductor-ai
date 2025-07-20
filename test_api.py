#!/usr/bin/env python3
"""
Quick API test script for ClipConductor AI
"""
import requests
import json
import sys

BASE_URL = "http://localhost:8001"

def test_endpoint(method, path, data=None):
    """Test a single API endpoint"""
    url = f"{BASE_URL}{path}"
    try:
        if method == "GET":
            response = requests.get(url)
        elif method == "POST":
            response = requests.post(url, json=data)
        
        print(f"✅ {method} {path} - Status: {response.status_code}")
        if response.status_code == 200:
            try:
                result = response.json()
                if path == "/api/v1/clips/stats":
                    print(f"   📊 Found {result.get('total_clips', 0)} clips ({result.get('total_size_mb', 0)/1024:.1f} GB)")
                elif path == "/api/v1/ai/health":
                    print(f"   🤖 AI Status: {result.get('ollama', {}).get('status', 'unknown')}")
                elif path == "/health":
                    print(f"   🏥 Service: {result.get('service', 'unknown')}")
                else:
                    print(f"   📄 Response: {json.dumps(result, indent=2)[:100]}...")
            except:
                print(f"   📄 Response length: {len(response.text)} bytes")
        else:
            print(f"   ❌ Error: {response.text[:100]}...")
        
        return response.status_code == 200
    except Exception as e:
        print(f"❌ {method} {path} - Error: {str(e)}")
        return False

def main():
    print("🧪 Testing ClipConductor AI API Endpoints\n")
    
    tests = [
        ("GET", "/health"),
        ("GET", "/api/v1/clips/stats"),
        ("GET", "/api/v1/ai/health"),
        ("POST", "/api/v1/notifications/test", {"service": "telegram", "message": "API test"}),
    ]
    
    passed = 0
    for method, path, *data in tests:
        if test_endpoint(method, path, data[0] if data else None):
            passed += 1
        print()
    
    print(f"📈 Results: {passed}/{len(tests)} tests passed")
    if passed == len(tests):
        print("🎉 All API endpoints are working correctly!")
    else:
        print("⚠️  Some endpoints need attention")
        sys.exit(1)

if __name__ == "__main__":
    main()
