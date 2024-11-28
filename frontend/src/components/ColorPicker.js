// ColorPicker.js
import React from 'react';

export default function ColorPicker({ colors, onColorChange }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">Colors</label>
      <div className="flex flex-wrap gap-2">
        {colors.map((color, index) => (
          <div
            key={index}
            className="w-8 h-8 rounded-full cursor-pointer border-2"
            style={{ backgroundColor: color }}
            onClick={() => onColorChange(index, color)}
          />
        ))}
      </div>
    </div>
  );
}