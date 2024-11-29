from fastapi import FastAPI, File, Form, UploadFile, HTTPException  # Added HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import logging
import numpy as np
import base64
import cv2  # Added cv2
from io import BytesIO
from PIL import Image
from typing import List
from image_processor import process_image

app = FastAPI()

# Configure logging
logging.basicConfig(level=logging.DEBUG)

@app.get("/test")
def test():
    return {"status": "API is running"}

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    # allow_origins=["http://localhost:3000"],  # Update this for production as needed
    allow_origins=[
        "http://localhost:3000",
        "*"  # Temporarily allow all origins while testing
    ]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/process-image/")
async def process_image_endpoint(
    file: UploadFile = File(...),
    n_colors: int = Form(...),
    n_tiles: int = Form(...),
    sequential_colors: bool = Form(...),
    tile_size: int = Form(...),
    colors: List[str] = Form(...),
    thicknesses: List[int] = Form(...),
):
    try:
        # Read the file content
        content = await file.read()
        
        # Log input parameters
        print(f"Processing image with parameters:")
        print(f"n_colors: {n_colors}")
        print(f"n_tiles: {n_tiles}")
        print(f"tile_size: {tile_size}")
        print(f"colors: {colors}")
        print(f"thicknesses: {thicknesses}")
        
        # Process the image
        try:
            result = process_image(
                content,
                colors,
                thicknesses,
                n_tiles,
                n_colors,
                tile_size,
                sequential_colors
            )
        except Exception as e:
            print(f"Error in process_image: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Image processing error: {str(e)}")
        
        # Convert result to bytes
        success, encoded_img = cv2.imencode('.png', result)
        if not success:
            raise HTTPException(status_code=500, detail="Failed to encode processed image")
        
        return {"image": base64.b64encode(encoded_img.tobytes()).decode()}
        
    except Exception as e:
        print(f"Endpoint error: {str(e)}")
        print(f"Error type: {type(e)}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))
