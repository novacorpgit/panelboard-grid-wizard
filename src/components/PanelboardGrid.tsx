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
  ColGroupDef,
  CellValueChangedEvent
} from 'ag-grid-community';
import { LicenseManager } from 'ag-grid-enterprise';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { panelboardData } from '@/data/sampleData';
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";

// Set the AG Grid Enterprise license key
LicenseManager.setLicenseKey("[TRIAL]_this_{AG_Charts_and_AG_Grid}_Enterprise_key_{AG-078795}_is_granted_for_evaluation_only___Use_in_production_is_not_permitted___Please_report_misuse_to_legal@ag-grid.com___For_help_with_purchasing_a_production_key_please_contact_info@ag-grid.com___You_are_granted_a_{Single_Application}_Developer_License_for_one_application_only___All_Front-End_JavaScript_developers_working_on_the_application_would_need_to_be_licensed___This_key_will_deactivate_on_{30 April 2025}____[v3]_[0102]_MTc0NTk2NzYwMDAwMA==39b1546fe2d969966a31bbc6b46371db");

const PanelboardGrid: React.FC = () => {
  const gridRef = useRef<AgGridReact>(null);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [columnApi, setColumnApi] = useState<ColumnApi | null>(null);
  const [quickFilter, setQuickFilter] = useState('');
  const [rowData, setRowData] = useState(panelboardData);
  
  // Define default columns
  const [columnDefs, setColumnDefs] = useState<(ColDef | ColGroupDef)[]>([
    { 
      headerName: 'Product Code', 
      field: 'productCode', 
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
      headerName: 'Quantity', 
      field: 'quantity', 
      sortable: true, 
      filter: 'agNumberColumnFilter',
      flex: 1,
      editable: true,
      cellEditor: 'agNumberCellEditor',
      cellEditorParams: {
        min: 0,
        max: 1000
      }
    },
    { 
      headerName: 'Price ($)', 
      field: 'price', 
      sortable: true, 
      filter: 'agNumberColumnFilter',
      flex: 1,
      valueFormatter: (params: any) => {
        return params.value ? `$${params.value.toFixed(2)}` : '';
      }
    },
    { 
      headerName: 'Labor ($)', 
      field: 'laborCharge', 
      sortable: true, 
      filter: 'agNumberColumnFilter',
      flex: 1,
      valueFormatter: (params: any) => {
        return params.value ? `$${params.value.toFixed(2)}` : '';
      }
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

  // Handle cell value changes
  const onCellValueChanged = (event: CellValueChangedEvent) => {
    if (event.colDef.field === 'quantity') {
      toast({
        title: "Quantity Updated",
        description: `${event.data.description}: Quantity changed from ${event.oldValue} to ${event.newValue}`,
      });
    }
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
          rowData={rowData}
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
          editType="fullRow"
          onCellValueChanged={onCellValueChanged}
        />
      </div>
    </div>
  );
};

export default PanelboardGrid;
