'use client';

import { useState } from 'react';
import ControlPanel from './components/ControlPanel';
import BookTable from './components/BookTable';
import BookGallery from './components/BookGallery';

export default function Home() {
  // State for book generation parameters
  const [parameters, setParameters] = useState({
    seed: 42,
    locale: 'en-US',
    avgLikes: 5,
    avgReviews: 3,
  });

  // State for view mode
  const [viewMode, setViewMode] = useState('table');

  // Handler for parameter changes from ControlPanel
  const handleParametersChange = (newParams) => {
    setParameters((prev) => ({
      ...prev,
      ...newParams,
    }));
  };

  // Handler for view mode changes
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-2 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          📚 Book Store Data Generator
        </h1>
        {/* Control Panel */}
        <ControlPanel
          onParametersChange={handleParametersChange}
          initialParams={parameters}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
        />
        {/* Book Display */}
        {viewMode === 'table' ? (
          <BookTable parameters={parameters} />
        ) : (
          <BookGallery parameters={parameters} />
        )}
        <footer className="mt-12 text-center text-xs text-gray-400 dark:text-gray-600">
          &copy; {new Date().getFullYear()} Book Store Generator &mdash; Powered by Next.js & Faker.js
        </footer>
      </div>
    </div>
  );
}