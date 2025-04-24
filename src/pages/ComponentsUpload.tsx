
import React from 'react';
import CSVUploader from '@/components/CSVUploader';

const ComponentsUpload = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Upload Electrical Components</h1>
          <p className="text-gray-600 mt-2">
            Upload your electrical components data in CSV format with the required fields.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Required CSV Headers</h2>
          <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 mb-6">
            <div>• Item ID</div>
            <div>• Item_Name</div>
            <div>• Part_Number</div>
            <div>• Supplier</div>
            <div>• Category</div>
            <div>• Subcategory</div>
            <div>• Qty</div>
            <div>• Unit_Cost</div>
            <div>• Total Cost</div>
            <div>• Currency</div>
            <div>• Labour_Minutes</div>
            <div>• Total_Labour_Time</div>
            <div>• Installation_Type</div>
            <div>• Rated_Current_AMP</div>
            <div>• Number of Poles</div>
            <div>• IP_Rating</div>
            <div>• Breaking_Capacity _Ka</div>
            <div>• Mounting Type</div>
            <div>• Watt_Loss</div>
            <div>• Stock_Status</div>
            <div>• Lead_Time_Days</div>
            <div>• Remarks</div>
          </div>
          <CSVUploader />
        </div>
      </div>
    </div>
  );
};

export default ComponentsUpload;
