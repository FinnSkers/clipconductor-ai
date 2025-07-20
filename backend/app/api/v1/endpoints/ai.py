from fastapi import APIRouter, HTTPException
from typing import Optional
from pydantic import BaseModel
from app.services.ai_service_ollama import AIService, OllamaService

router = APIRouter()


class GenerateMetadataRequest(BaseModel):
    clip_title: str
    game_name: Optional[str] = None
    clip_duration: Optional[int] = None


class GenerateTextRequest(BaseModel):
    prompt: str
    model: Optional[str] = None


@router.get("/models")
async def get_available_models():
    """Get available Ollama models"""
    try:
        ai_service = AIService()
        models = await ai_service.get_available_models()
        return {
            "success": True,
            "models": models,
            "total": len(models)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching models: {str(e)}")


@router.post("/generate-text")
async def generate_text(request: GenerateTextRequest):
    """Generate text using Ollama"""
    try:
        ollama = OllamaService()
        async with ollama:
            response = await ollama.generate_text(request.prompt, request.model)
        
        return {
            "success": True,
            "response": response,
            "model_used": request.model or ollama.default_model
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating text: {str(e)}")


@router.post("/generate-metadata")
async def generate_gaming_metadata(request: GenerateMetadataRequest):
    """Generate gaming-specific metadata"""
    try:
        ai_service = AIService()
        metadata = await ai_service.metadata_service.generate_gaming_metadata(
            clip_title=request.clip_title,
            game_name=request.game_name,
            clip_duration=request.clip_duration
        )
        
        return {
            "success": True,
            "metadata": metadata
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating metadata: {str(e)}")


@router.post("/test-ollama")
async def test_ollama_connection():
    """Test Ollama connection and basic functionality"""
    try:
        ollama = OllamaService()
        async with ollama:
            # Test with a simple prompt
            test_prompt = "Generate a catchy title for an epic gaming moment in 10 words or less."
            response = await ollama.generate_text(test_prompt)
            
            # Get available models
            models = await ollama.list_models()
            
        return {
            "success": True,
            "connection": "OK",
            "test_response": response,
            "available_models": len(models),
            "models": [model.get("name", "Unknown") for model in models]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ollama connection failed: {str(e)}")


@router.post("/analyze-content")
async def analyze_gaming_content(clip_title: str):
    """Analyze gaming content"""
    try:
        ai_service = AIService()
        analysis = await ai_service.metadata_service.analyze_gaming_content(
            clip_title=clip_title,
            file_path=""  # Placeholder
        )
        
        return {
            "success": True,
            "analysis": analysis
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing content: {str(e)}")


@router.get("/health")
async def ai_health_check():
    """Check AI services health"""
    try:
        ollama = OllamaService()
        async with ollama:
            models = await ollama.list_models()
        
        return {
            "ollama": {
                "status": "healthy",
                "base_url": ollama.base_url,
                "models_available": len(models),
                "default_model": ollama.default_model
            },
            "computer_vision": {
                "status": "not_implemented",
                "note": "YOLOv8 integration pending"
            }
        }
    except Exception as e:
        return {
            "ollama": {
                "status": "unhealthy",
                "error": str(e)
            },
            "computer_vision": {
                "status": "not_implemented"
            }
        }
