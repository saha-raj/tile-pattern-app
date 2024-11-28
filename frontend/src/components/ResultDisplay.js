// ResultDisplay.js
import React from 'react';

export default function ResultDisplay({ originalImage, processedImage }) {
  console.log('Rendering images:', { originalImage, processedImage }); // Debug log

  return (
    <div className="grid grid-cols-2 gap-4">
      {originalImage && (
        <div>
          <h3 className="text-sm font-medium mb-2">Original</h3>
          <img src={originalImage} alt="Original" className="w-full rounded-lg" />
        </div>
      )}
      {processedImage ? (
        <div>
          <h3 className="text-sm font-medium mb-2">Processed</h3>
          <img src={processedImage} alt="Processed" className="w-full rounded-lg" />
        </div>
      ) : (
        <div>
          <h3 className="text-sm font-medium mb-2">Processed</h3>
          <p className="text-gray-500 italic">No processed image available.</p>
        </div>
      )}
    </div>
  );
}
