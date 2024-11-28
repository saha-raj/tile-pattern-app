import cv2
import numpy as np
from typing import List, Tuple
from dataclasses import dataclass

class PatternMatcher:
    def __init__(self, tile_size: int, pattern_templates: List[np.ndarray]):
        self.tile_size = tile_size
        self.pattern_templates = [cv2.resize(p, (tile_size, tile_size)) for p in pattern_templates]
    
    def match_pattern(self, tile: np.ndarray) -> int:
        best_match_idx = 0
        best_match_score: float = float('inf')  # Add type hint here
        
        for idx, pattern in enumerate(self.pattern_templates):
            pattern_gray = cv2.cvtColor(pattern, cv2.COLOR_BGR2GRAY)
            diff = cv2.absdiff(tile, pattern_gray)
            score = float(np.sum(diff))  # Convert numpy sum to float
            if score < best_match_score:
                best_match_score = score
                best_match_idx = idx
        return best_match_idx
    
@dataclass
class TileParams:
    shape: str
    color: tuple
    thickness: int

def hex_to_bgr(hex_color: str) -> tuple:
    r, g, b = int(hex_color[1:3], 16), int(hex_color[3:5], 16), int(hex_color[5:7], 16)
    return (b, g, r)

def generate_tile_params(n_tiles: int, n_colors: int, color_palette: List[str], thicknesses: List[int], sequential_colors: bool = True) -> List[TileParams]:
    shapes = ['diag_left', 'diag_right', 'vertical', 'horizontal', 'circle', 
              'triangle_up', 'triangle_right', 'triangle_down', 'triangle_left']
    
    if n_colors > len(color_palette):
        raise ValueError("n_colors cannot exceed the length of the color_palette")

    if sequential_colors:
        max_start = len(color_palette) - n_colors
        if max_start < 0:
            raise ValueError("Invalid sequential color configuration")
        start_idx = np.random.randint(0, max_start + 1)
        chosen_colors = [hex_to_bgr(c) for c in color_palette[start_idx:start_idx + n_colors]]
    else:
        chosen_colors = [hex_to_bgr(c) for c in np.random.choice(color_palette, n_colors, replace=False)]
    
    tile_params = []
    for _ in range(n_tiles):
        shape = np.random.choice(shapes)
        thickness = np.random.choice(thicknesses)
        color = chosen_colors[np.random.randint(0, len(chosen_colors))]
        tile_params.append(TileParams(shape, color, thickness))
    
    return tile_params


def draw_pattern(size: int, params: TileParams) -> np.ndarray:
    img = np.full((size, size, 3), (255, 255, 255), dtype=np.uint8)
    center = size // 2
    radius = size // 3
    
    if params.shape == 'diag_left':
        cv2.line(img, (0, 0), (size-1, size-1), params.color, params.thickness)
    elif params.shape == 'diag_right':
        cv2.line(img, (0, size-1), (size-1, 0), params.color, params.thickness)
    elif params.shape == 'vertical':
        cv2.line(img, (center, 0), (center, size-1), params.color, params.thickness)
    elif params.shape == 'horizontal':
        cv2.line(img, (0, center), (size-1, center), params.color, params.thickness)
    elif params.shape == 'circle':
        cv2.circle(img, (center, center), radius, params.color, params.thickness)
    elif params.shape == 'triangle_up':
        pts = np.array([[size//2, 0], [0, size-1], [size-1, size-1]], np.int32)
        cv2.polylines(img, [pts], True, params.color, params.thickness)
    elif params.shape == 'triangle_right':
        pts = np.array([[0, 0], [size-1, size//2], [0, size-1]], np.int32)
        cv2.polylines(img, [pts], True, params.color, params.thickness)
    elif params.shape == 'triangle_down':
        pts = np.array([[0, 0], [size-1, 0], [size//2, size-1]], np.int32)
        cv2.polylines(img, [pts], True, params.color, params.thickness)
    elif params.shape == 'triangle_left':
        pts = np.array([[size-1, 0], [0, size//2], [size-1, size-1]], np.int32)
        cv2.polylines(img, [pts], True, params.color, params.thickness)
    
    return img

def create_patterns(size: int, n_tiles: int, n_colors: int, color_palette: List[str], thicknesses: List[int], sequential_colors: bool = True) -> List[np.ndarray]:
    tile_params = generate_tile_params(n_tiles, n_colors, color_palette, thicknesses, sequential_colors)
    return [draw_pattern(size, params) for params in tile_params]

def process_image(content_array, color_palette, thicknesses, n_tiles, n_colors, tile_size, sequential_colors):
    """
    Process the image based on patterns and return the modified image.
    """
    # Convert content array to grayscale image
    img = cv2.imdecode(np.frombuffer(content_array, np.uint8), cv2.IMREAD_GRAYSCALE)
    if img is None:
        raise ValueError("Could not decode image")
    
    # Generate patterns
    patterns = create_patterns(tile_size, n_tiles, n_colors, color_palette, thicknesses, sequential_colors)
    
    # Create pattern matcher and process image
    matcher = PatternMatcher(tile_size, patterns)
    height, width = img.shape
    result = np.full((height, width, 3), (255, 255, 255), dtype=np.uint8)
    
    # Split and process tiles
    num_tiles_h = height // tile_size
    num_tiles_w = width // tile_size
    
    for i in range(num_tiles_h):
        for j in range(num_tiles_w):
            y1, y2 = i * tile_size, (i + 1) * tile_size
            x1, x2 = j * tile_size, (j + 1) * tile_size
            
            tile = img[y1:y2, x1:x2]
            best_pattern_idx = matcher.match_pattern(tile)
            result[y1:y2, x1:x2] = patterns[best_pattern_idx]
    
    return result
