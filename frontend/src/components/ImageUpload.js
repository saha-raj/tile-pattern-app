import React from 'react';

function ImageUpload({ onImageUpload }) {
  const handleChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onImageUpload(file);
    }
  };

  return (
    <div className="parameter-group">
      <label className="parameter-label">Upload Image</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="parameter-input"
      />
    </div>
  );
}

export default ImageUpload;