import React, { useState } from 'react';
import axios from 'axios';
import ImageUpload from './components/ImageUpload';
import './App.css';

const DEFAULT_PARAMS = {
  nTiles: 12,
  nColors: 6,
  tileSize: 32,
  thicknesses: "[2, 4, 6, 8]",
  sequentialColors: false,
  colors: ["#0081a7","#00afb9","#fdfcdc","#fed9b7","#f07167",
            "#006d8f","#0095a3","#00c3cf","#fcf7c4","#ffe4d4",
            "#f85c51","#005f7a","#00848c","#ffeeb3","#ffcfb5"],
};

function App() {
  const [params, setParams] = useState(DEFAULT_PARAMS);
  const [images, setImages] = useState({
    original: null,
    processed: null,
  });
  const [selectedFile, setSelectedFile] = useState(null);

  const handleParamChange = (e) => {
    const { name, value, type } = e.target;
    setParams(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? e.target.checked : value
    }));
  };

  const handleReset = () => {
    setParams(DEFAULT_PARAMS);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert('Please upload an image first');
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("n_colors", parseInt(params.nColors));
      formData.append("n_tiles", parseInt(params.nTiles));
      formData.append("sequential_colors", params.sequentialColors);
      formData.append("tile_size", parseInt(params.tileSize));
      
      params.colors.forEach(color => formData.append("colors", color));
      
      // Parse thicknesses string to array
      const thicknessArray = JSON.parse(params.thicknesses);
      thicknessArray.forEach(t => formData.append("thicknesses", t));

      const response = await axios.post("http://localhost:8000/process-image/", formData);
      setImages(prev => ({
        ...prev,
        processed: `data:image/png;base64,${response.data.image}`,
      }));
    } catch (error) {
      console.error("Error details:", error);
    }
  };

  return (
    <div className="app-container">
      <div className="control-panel">
        <h2>Parameters</h2>
        
        <div className="parameter-group">
          <label className="parameter-label">Number of Tiles</label>
          <input
            type="number"
            name="nTiles"
            value={params.nTiles}
            onChange={handleParamChange}
            className="parameter-input"
          />
        </div>

        <div className="parameter-group">
          <label className="parameter-label">Number of Colors</label>
          <input
            type="number"
            name="nColors"
            value={params.nColors}
            onChange={handleParamChange}
            className="parameter-input"
          />
        </div>

        <div className="parameter-group">
          <label className="parameter-label">Tile Size</label>
          <input
            type="number"
            name="tileSize"
            value={params.tileSize}
            onChange={handleParamChange}
            className="parameter-input"
          />
        </div>

        <div className="parameter-group">
          <label className="parameter-label">Thicknesses</label>
          <input
            type="text"
            name="thicknesses"
            value={params.thicknesses}
            onChange={handleParamChange}
            className="parameter-input"
          />
        </div>

        <div className="parameter-group">
          <label className="parameter-label">
            <input
              type="checkbox"
              name="sequentialColors"
              checked={params.sequentialColors}
              onChange={handleParamChange}
            />
            Sequential Colors
          </label>
        </div>

        <ImageUpload 
          onImageUpload={(file) => {
            setSelectedFile(file);
            setImages(prev => ({
              ...prev,
              original: URL.createObjectURL(file)
            }));
          }}
        />

        <div className="button-group">
          <button onClick={handleReset} className="button reset-button">
            Reset
          </button>
          <button onClick={handleSubmit} className="button submit-button">
            Submit
          </button>
        </div>
      </div>

      <div className="image-container">
        <h2>Original Image</h2>
        {images.original && <img src={images.original} alt="Original" />}
      </div>

      <div className="image-container">
        <h2>Processed Image</h2>
        {images.processed && <img src={images.processed} alt="Processed" />}
      </div>
    </div>
  );
}

export default App;