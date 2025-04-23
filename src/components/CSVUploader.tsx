
import React, { useState, useCallback } from 'react';
import Papa from 'papaparse';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { supabase } from '@/integrations/supabase/client';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';

const CSVUploader = () => {
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);
  const [rowData, setRowData] = useState<any[]>([]);
  const [fileName, setFileName] = useState<string>('');

  const processFile = useCallback(async (file: File) => {
    setFileName(file.name);
    
    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        // Create column definitions from headers
        const cols = Object.keys(results.data[0]).map(key => ({
          field: key,
          headerName: key,
          sortable: true,
          filter: true
        }));
        setColumnDefs(cols);
        setRowData(results.data);

        try {
          // Store in Supabase
          const { error } = await supabase.from('csv_uploads').insert({
            file_name: file.name,
            headers: cols,
            data: results.data
          });

          if (error) throw error;

          toast({
            title: 'Success',
            description: `CSV file "${file.name}" uploaded and processed successfully`,
          });
        } catch (error) {
          console.error('Error storing CSV data:', error);
          toast({
            title: 'Error',
            description: 'Failed to store CSV data',
            variant: 'destructive',
          });
        }
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        toast({
          title: 'Error',
          description: 'Failed to parse CSV file',
          variant: 'destructive',
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
    </div>
  );
};

export default CSVUploader;
