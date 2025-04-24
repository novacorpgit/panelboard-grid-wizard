
import React from 'react';
import PanelboardGrid from '@/components/PanelboardGrid';
import CSVUploader from '@/components/CSVUploader';

const Index = () => {
  const navigate = typeof window !== "undefined" ? (path: string) => window.location.pathname = path : () => {};

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Low Voltage Panelboard Components</h1>
          <p className="text-gray-600 mt-2">
            Interactive grid system for low voltage electrical distribution equipment management
          </p>
        </div>
        
        <div className="flex mb-6 gap-4">
          <button
            onClick={() => navigate("/stardelta-tree")}
            className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
          >
            View Star-Delta Starter Tree Grid
          </button>
          <button
            onClick={() => navigate("/components-upload")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Upload Components Data
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Upload Data</h2>
          <CSVUploader />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <PanelboardGrid />
        </div>
        
        <div className="mt-4 text-sm text-gray-500">
          <p>
            Right-click anywhere in the grid to add additional columns. Use the navigation buttons to filter by component type.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
