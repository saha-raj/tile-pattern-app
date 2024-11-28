// ParameterControls.js
import React from 'react';

export default function ParameterControls({
  nTiles,
  nColors,
  thicknesses,
  sequentialColors,
  onParamChange
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Number of Tiles</label>
        <input
          type="number"
          value={nTiles}
          onChange={(e) => onParamChange('nTiles', parseInt(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Colors to Use</label>
        <input
          type="number"
          value={nColors}
          onChange={(e) => onParamChange('nColors', parseInt(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Line Thickness</label>
        <div className="flex gap-2">
          {thicknesses.map((t, i) => (
            <button
              key={i}
              className={`px-3 py-1 rounded ${t.selected ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => onParamChange('thicknesses', t.value)}
            >
              {t.value}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={sequentialColors}
            onChange={(e) => onParamChange('sequentialColors', e.target.checked)}
            className="rounded border-gray-300"
          />
          <span className="ml-2 text-sm">Use Sequential Colors</span>
        </label>
      </div>
    </div>
  );
}