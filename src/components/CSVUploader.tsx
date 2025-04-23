
import React, { useState, useCallback } from 'react';
import Papa from 'papaparse';
import { AgGridReact } from 'ag-grid-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";

const REQUIRED_HEADERS = [
  'Item ID', 'Item_Name', 'Part_Number', 'Supplier', 'Category', 'Subcategory',
  'Qty', 'Unit_Cost', 'Total Cost', 'Currency', 'Labour_Minutes',
  'Total_Labour_Time', 'Installation_Type', 'Rated_Current_AMP',
  'Number of Poles', 'IP_Rating', 'Breaking_Capacity _Ka', 'Mounting Type',
  'Watt_Loss', 'Stock_Status', 'Lead_Time_Days', 'Remarks'
];

const CSVUploader = () => {
  const [columnDefs, setColumnDefs] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [fileName, setFileName] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [validHeaders, setValidHeaders] = useState(false);
  const [uploadData, setUploadData] = useState(null);

  const validateHeaders = (headers: string[]) => {
    const missingHeaders = REQUIRED_HEADERS.filter(
      header => !headers.includes(header)
    );
    
    if (missingHeaders.length > 0) {
      toast({
        title: 'Header Validation Error',
        description: `Missing required headers: ${missingHeaders.join(', ')}`,
        variant: 'destructive'
      });
      return false;
    }
    return true;
  };

  const processFile = useCallback(async (file: File) => {
    setFileName(file.name);
    
    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        const headers = Object.keys(results.data[0]);
        const isValid = validateHeaders(headers);
        setValidHeaders(isValid);

        if (isValid) {
          const cols = headers.map(key => ({
            field: key,
            headerName: key,
            sortable: true,
            filter: true
          }));
          
          setColumnDefs(cols);
          setRowData(results.data);
          setUploadData(results.data);
          setShowConfirmDialog(true);
        }
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        toast({
          title: 'Error',
          description: 'Failed to parse CSV file',
          variant: 'destructive'
        });
      }
    });
  }, []);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  const handleConfirmUpload = async () => {
    try {
      const { error } = await supabase.from('csv_uploads')
        .insert({
          file_name: fileName,
          headers: columnDefs,
          data: uploadData
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Data uploaded successfully and database updated'
      });

      setShowConfirmDialog(false);
    } catch (error) {
      console.error('Error storing data:', error);
      toast({
        title: 'Error',
        description: 'Failed to update database',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" className="relative">
          Choose CSV File
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </Button>
        {fileName && (
          <span className="text-sm text-gray-600">
            Selected file: {fileName}
          </span>
        )}
      </div>

      {columnDefs.length > 0 && (
        <div className="h-[600px] w-full ag-theme-alpine">
          <AgGridReact
            columnDefs={columnDefs}
            rowData={rowData}
            pagination={true}
            paginationPageSize={15}
            domLayout="autoHeight"
          />
        </div>
      )}

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Data Update</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to update the database with this new data? This will replace the existing data.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
            <Button onClick={handleConfirmUpload}>Confirm Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CSVUploader;
