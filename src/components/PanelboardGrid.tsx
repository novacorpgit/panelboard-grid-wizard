import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
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
  CellValueChangedEvent,
  ValueFormatterParams,
  IsFullWidthRowParams
} from 'ag-grid-community';
import { LicenseManager } from 'ag-grid-enterprise';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { panelboardData } from '@/data/sampleData';
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { CircuitBoard, Shield, Link, ToggleLeft, AlertTriangle, Clock, CircleDot } from 'lucide-react';

// Set the AG Grid Enterprise license key
LicenseManager.setLicenseKey("[TRIAL]_this_{AG_Charts_and_AG_Grid}_Enterprise_key_{AG-078795}_is_granted_for_evaluation_only___Use_in_production_is_not_permitted___Please_report_misuse_to_legal@ag-grid.com___For_help_with_purchasing_a_production_key_please_contact_info@ag-grid.com___You_are_granted_a_{Single_Application}_Developer_License_for_one_application_only___All_Front-End_JavaScript_developers_working_on_the_application_would_need_to_be_licensed___This_key_will_deactivate_on_{30 April 2025}____[v3]_[0102]_MTc0NTk2NzYwMDAwMA==39b1546fe2d969966a31bbc6b46371db");

// Interface for category data
interface CategoryData {
  id: string;
  name: string;
  color: string;
  isFullWidth: boolean;
}

const PanelboardGrid: React.FC = () => {
  const gridRef = useRef<AgGridReact>(null);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [columnApi, setColumnApi] = useState<ColumnApi | null>(null);
  const [quickFilter, setQuickFilter] = useState('');
  const [rowData, setRowData] = useState<any[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  
  // Process data to include category headers
  useEffect(() => {
    const categories = [
      { id: 'circuit-breakers', name: 'Circuit Breakers (MCB, MCCB, ACB)', color: '#E5DEFF', filterValue: 'Circuit Breaker' },
      { id: 'rcd', name: 'Residual Current Devices (RCD, RCCB, RCBO)', color: '#D3E4FD', filterValue: 'RCD' },
      { id: 'fuse-links', name: 'Fuse Links', color: '#FDE1D3', filterValue: 'Fuse' },
      { id: 'contactors', name: 'Contactors', color: '#F2FCE2', filterValue: 'Contactor' },
      { id: 'overload-relays', name: 'Overload Relays', color: '#FEF7CD', filterValue: 'Relay' },
      { id: 'timers', name: 'Timers', color: '#FFDEE2', filterValue: 'Timer' },
      { id: 'push-buttons', name: 'Push Buttons & Selector Switches', color: '#F1F0FB', filterValue: 'Switch' },
    ];

    // Group the data by categories
    const processedData: any[] = [];
    
    categories.forEach(category => {
      // Add category header row
      processedData.push({
        id: category.id,
        name: category.name,
        isFullWidth: true,
        color: category.color,
      });
      
      // Add items for this category
      const categoryItems = panelboardData.filter(item => 
        item.type.includes(category.filterValue)
      );
      
      processedData.push(...categoryItems);
    });
    
    setRowData(processedData);
  }, []);
  
  // Calculate total price whenever row data changes
  useEffect(() => {
    if (rowData) {
      const total = rowData.reduce((sum, row) => {
        // Skip category headers
        if (row.isFullWidth) return sum;
        
        const quantity = row.quantity || 0;
        const price = row.price || 0;
        return sum + (quantity * price);
      }, 0);
      setTotalPrice(total);
    }
  }, [rowData]);
  
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
      cellStyle: { backgroundColor: '#f0f8ff' }, // Light blue background to indicate editable
      cellEditor: 'agNumberCellEditor',
      cellEditorParams: {
        min: 0,
        max: 1000
      },
      singleClickEdit: true, // Enable single-click editing
      valueFormatter: (params: ValueFormatterParams) => {
        return params.value === 0 ? '' : params.value;
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
      headerName: 'Total ($)', 
      field: 'total',
      sortable: true, 
      filter: 'agNumberColumnFilter',
      flex: 1,
      valueGetter: (params: any) => {
        const quantity = params.data.quantity || 0;
        const price = params.data.price || 0;
        return quantity * price;
      },
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
      // Update the row data with the new quantity
      const updatedRowData = rowData.map(row => {
        if (row.productCode === event.data.productCode) {
          return { ...row, quantity: event.newValue };
        }
        return row;
      });
      setRowData(updatedRowData);
      
      toast({
        title: "Quantity Updated",
        description: `${event.data.description}: Quantity changed from ${event.oldValue || 0} to ${event.newValue}`,
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

  // Navigation categories
  const categories = [
    { id: 'circuit-breakers', name: 'Circuit Breakers', icon: <CircuitBoard className="mr-2" size={16} /> },
    { id: 'rcd', name: 'RCDs', icon: <Shield className="mr-2" size={16} /> },
    { id: 'fuse-links', name: 'Fuse Links', icon: <Link className="mr-2" size={16} /> },
    { id: 'contactors', name: 'Contactors', icon: <ToggleLeft className="mr-2" size={16} /> },
    { id: 'overload-relays', name: 'Relays', icon: <AlertTriangle className="mr-2" size={16} /> },
    { id: 'timers', name: 'Timers', icon: <Clock className="mr-2" size={16} /> },
    { id: 'push-buttons', name: 'Buttons & Switches', icon: <CircleDot className="mr-2" size={16} /> }
  ];

  // Function to determine if row is full width (category header)
  const isFullWidthRow = (params: IsFullWidthRowParams) => {
    return params.rowNode.data.isFullWidth;
  };

  // Full width row renderer for category headers
  const fullWidthCellRenderer = (params: any) => {
    const categoryData = params.data;
    return (
      <div 
        className="flex items-center font-bold text-lg p-2" 
        style={{ backgroundColor: categoryData.color, width: '100%' }}
      >
        {categoryData.name}
      </div>
    );
  };

  // Navigate to a specific category
  const navigateToCategory = (categoryId: string) => {
    if (gridApi) {
      // Find the row index for the category
      const rowNodes: any[] = [];
      gridApi.forEachNode((node) => rowNodes.push(node));
      
      const categoryIndex = rowNodes.findIndex(node => 
        node.data && node.data.id === categoryId
      );
      
      if (categoryIndex >= 0) {
        // Navigate to the category row
        gridApi.ensureIndexVisible(categoryIndex);
        
        // Highlight the row (optional)
        gridApi.clearFocusedCell();
        
        // Optionally select the row
        gridApi.deselectAll();
        gridApi.getDisplayedRowAtIndex(categoryIndex)?.setSelected(true);
      }
    }
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="mb-4 flex flex-wrap justify-between items-center gap-2">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant="outline"
              className="flex items-center"
              onClick={() => navigateToCategory(category.id)}
            >
              {category.icon}
              {category.name}
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
          paginationPageSizeSelector={[10, 15, 25, 50]}
          domLayout="autoHeight"
          onCellValueChanged={onCellValueChanged}
          isFullWidthRow={isFullWidthRow}
          fullWidthCellRenderer={fullWidthCellRenderer}
        />
      </div>
      
      <div className="mt-4 flex justify-end items-center p-2 bg-gray-100 rounded">
        <div className="font-bold mr-2">Total:</div>
        <div className="text-lg">${totalPrice.toFixed(2)}</div>
      </div>
    </div>
  );
};

export default PanelboardGrid;
