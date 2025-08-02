'use client';

import { useState, useEffect } from 'react';
import { generateRandomSeed, getLocaleDisplayName, getLocaleFlag } from '@/lib/utils';

export default function ControlPanel({ 
  onParametersChange, 
  initialParams = {} 
}) {
  const [parameters, setParameters] = useState({
    seed: initialParams.seed || 42,
    locale: initialParams.locale || 'en-US',
    avgLikes: initialParams.avgLikes || 5,
    avgReviews: initialParams.avgReviews || 3
  });

  const [isSeedRandom, setIsSeedRandom] = useState(false);

  // Available locales
  const locales = [
    { code: 'en-US', name: 'English (USA)', flag: '🇺🇸' },
    { code: 'de-DE', name: 'Deutsch (Deutschland)', flag: '🇩🇪' },
    { code: 'fr-FR', name: 'Français (France)', flag: '🇫🇷' },
    { code: 'ja-JP', name: '日本語 (日本)', flag: '🇯🇵' }
  ];

  // Generate random seed
  const handleRandomSeed = () => {
    const newSeed = generateRandomSeed();
    setParameters(prev => ({ ...prev, seed: newSeed }));
    setIsSeedRandom(true);
  };

  // Handle parameter changes
  const handleParameterChange = (key, value) => {
    const newParams = { ...parameters, [key]: value };
    setParameters(newParams);
    onParametersChange(newParams);
  };

  // Handle seed input
  const handleSeedChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setParameters(prev => ({ ...prev, seed: value }));
    setIsSeedRandom(false);
  };

  // Handle seed blur (update parent)
  const handleSeedBlur = () => {
    onParametersChange(parameters);
  };

  // Handle slider changes
  const handleSliderChange = (key, value) => {
    handleParameterChange(key, parseFloat(value));
  };

  // Handle input changes
  const handleInputChange = (key, value) => {
    const numValue = parseFloat(value) || 0;
    handleParameterChange(key, numValue);
  };

  // Initial load
  useEffect(() => {
    onParametersChange(parameters);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Book Store Parameters
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Language/Region Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Language/Region
          </label>
          <select
            value={parameters.locale}
            onChange={(e) => handleParameterChange('locale', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            {locales.map((locale) => (
              <option key={locale.code} value={locale.code}>
                {locale.flag} {locale.name}
              </option>
            ))}
          </select>
        </div>

        {/* Seed Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Seed Value
          </label>
          <div className="flex space-x-2">
            <input
              type="number"
              value={parameters.seed}
              onChange={handleSeedChange}
              onBlur={handleSeedBlur}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter seed"
            />
            <button
              onClick={handleRandomSeed}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              �� Random
            </button>
          </div>
          {isSeedRandom && (
            <p className="text-xs text-green-600 dark:text-green-400">
              ✓ Random seed generated
            </p>
          )}
        </div>

        {/* Average Likes Slider */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Average Likes per Book: {parameters.avgLikes}
          </label>
          <input
            type="range"
            min="0"
            max="10"
            step="0.1"
            value={parameters.avgLikes}
            onChange={(e) => handleSliderChange('avgLikes', e.target.value)}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>0</span>
            <span>5</span>
            <span>10</span>
          </div>
        </div>

        {/* Average Reviews Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Average Reviews per Book
          </label>
          <input
            type="number"
            min="0"
            max="10"
            step="0.1"
            value={parameters.avgReviews}
            onChange={(e) => handleInputChange('avgReviews', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="0.0 - 10.0"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Fractional values work probabilistically
          </p>
        </div>

      </div>

      {/* Current Parameters Display */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Current Parameters:
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-500 dark:text-gray-400">Seed:</span>
            <span className="ml-2 font-mono text-gray-900 dark:text-white">
              {parameters.seed}
            </span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Locale:</span>
            <span className="ml-2 text-gray-900 dark:text-white">
              {getLocaleFlag(parameters.locale)} {getLocaleDisplayName(parameters.locale)}
            </span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Avg Likes:</span>
            <span className="ml-2 text-gray-900 dark:text-white">
              {parameters.avgLikes}
            </span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Avg Reviews:</span>
            <span className="ml-2 text-gray-900 dark:text-white">
              {parameters.avgReviews}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}