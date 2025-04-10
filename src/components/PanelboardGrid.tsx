
import React, { useState, useRef, useCallback, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { 
  ColDef, 
  GridReadyEvent, 
  GridApi, 
  ColumnApi, 
  MenuItemDef,
  ColGroupDef
} from 'ag-grid-community';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { panelboardData } from '@/data/sampleData';
import { Badge } from "@/components/ui/badge";

const PanelboardGrid: React.FC = () => {
  const gridRef = useRef<AgGridReact>(null);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [columnApi, setColumnApi] = useState<ColumnApi | null>(null);
  const [quickFilter, setQuickFilter] = useState('');
  
  // Define default columns
  const [columnDefs, setColumnDefs] = useState<(ColDef | ColGroupDef)[]>([
    { 
      headerName: 'ID', 
      field: 'id', 
      sortable: true, 
      filter: true, 
      checkboxSelection: true,
      headerCheckboxSelection: true,
      pinned: 'left'
    },
    { 
      headerName: 'Description', 
      field: 'description', 
      sortable: true, 
      filter: true, 
      flex: 2 
    },
    { 
      headerName: 'Type', 
      field: 'type', 
      sortable: true, 
      filter: true,
      flex: 1,
      cellRenderer: (params: any) => {
        return <Badge variant="outline">{params.value}</Badge>;
      }
    },
    { 
      headerName: 'Rating (A)', 
      field: 'rating', 
      sortable: true, 
      filter: 'agNumberColumnFilter',
      flex: 1 
    },
    { 
      headerName: 'Poles', 
      field: 'poles', 
      sortable: true, 
      filter: 'agNumberColumnFilter',
      flex: 1
    },
    { 
      headerName: 'Status', 
      field: 'status', 
      sortable: true, 
      filter: true,
      flex: 1,
      cellRenderer: (params: any) => {
        const color = params.value === 'Active' ? 'bg-green-100 text-green-800' : 
                     (params.value === 'Inactive' ? 'bg-red-100 text-red-800' : 
                     'bg-yellow-100 text-yellow-800');
        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>{params.value}</span>;
      }
    },
    { 
      headerName: 'Installation Date', 
      field: 'installDate', 
      sortable: true, 
      filter: 'agDateColumnFilter',
      flex: 1
    }
  ]);

  // Default column configuration
  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    floatingFilter: true,
    flex: 1,
  }), []);

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
    setColumnApi(params.columnApi);
    params.api.sizeColumnsToFit();
  };

  // Handle quick filter changes
  const onFilterTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuickFilter(e.target.value);
    if (gridApi) {
      gridApi.setQuickFilter(e.target.value);
    }
  };

  // Context menu items
  const getContextMenuItems = useCallback((params: any) => {
    const result: (MenuItemDef | string)[] = [
      {
        name: 'Add Column',
        subMenu: [
          {
            name: 'Manufacturer',
            action: () => {
              const newColumns = [...columnDefs];
              newColumns.push({
                headerName: 'Manufacturer',
                field: 'manufacturer',
                sortable: true,
                filter: true
              });
              setColumnDefs(newColumns);
            }
          },
          {
            name: 'Model Number',
            action: () => {
              const newColumns = [...columnDefs];
              newColumns.push({
                headerName: 'Model Number',
                field: 'modelNumber',
                sortable: true,
                filter: true
              });
              setColumnDefs(newColumns);
            }
          },
          {
            name: 'Location',
            action: () => {
              const newColumns = [...columnDefs];
              newColumns.push({
                headerName: 'Location',
                field: 'location',
                sortable: true,
                filter: true
              });
              setColumnDefs(newColumns);
            }
          },
          {
            name: 'Notes',
            action: () => {
              const newColumns = [...columnDefs];
              newColumns.push({
                headerName: 'Notes',
                field: 'notes',
                sortable: true,
                filter: true
              });
              setColumnDefs(newColumns);
            }
          }
        ]
      },
      'separator',
      'copy',
      'export'
    ];
    return result;
  }, [columnDefs]);

  // Navigation sections
  const sections = [
    { id: 'main', name: 'Main Panel' },
    { id: 'sub', name: 'Sub Panels' },
    { id: 'distribution', name: 'Distribution' },
    { id: 'lighting', name: 'Lighting' },
    { id: 'custom', name: 'Custom' }
  ];

  const navigateToSection = (sectionId: string) => {
    if (gridApi) {
      const filterModel: any = {};
      if (sectionId === 'main') {
        filterModel.type = { 
          type: 'equals', 
          filter: 'Main'
        };
      } else if (sectionId === 'sub') {
        filterModel.type = { 
          type: 'equals', 
          filter: 'Sub'
        };
      } else if (sectionId === 'distribution') {
        filterModel.type = { 
          type: 'equals', 
          filter: 'Distribution'
        };
      } else if (sectionId === 'lighting') {
        filterModel.type = { 
          type: 'equals', 
          filter: 'Lighting'
        };
      } else {
        // Clear filter for custom
        gridApi.setFilterModel(null);
        return;
      }
      gridApi.setFilterModel(filterModel);
    }
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="mb-4 flex justify-between items-center">
        <div className="flex space-x-2">
          {sections.map((section) => (
            <Button
              key={section.id}
              variant="outline"
              onClick={() => navigateToSection(section.id)}
            >
              {section.name}
            </Button>
          ))}
        </div>
        <div className="w-64">
          <Input
            placeholder="Search..."
            value={quickFilter}
            onChange={onFilterTextChange}
            className="w-full"
          />
        </div>
      </div>
      
      <div className="flex-grow h-[70vh] w-full ag-theme-alpine">
        <AgGridReact
          ref={gridRef}
          rowData={panelboardData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          animateRows={true}
          rowSelection="multiple"
          enableRangeSelection={true}
          getContextMenuItems={getContextMenuItems}
          suppressRowClickSelection={true}
          pagination={true}
          paginationPageSize={15}
          domLayout="autoHeight"
        />
      </div>
    </div>
  );
};

export default PanelboardGrid;
