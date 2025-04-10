
import React from 'react';
import PanelboardGrid from '@/components/PanelboardGrid';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Electrical Panelboard Components</h1>
          <p className="text-gray-600 mt-2">
            Interactive grid system for electrical panelboard component management
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <PanelboardGrid />
        </div>
        
        <div className="mt-4 text-sm text-gray-500">
          <p>
            Right-click anywhere in the grid to add additional columns. Use the navigation buttons to filter by section type.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
