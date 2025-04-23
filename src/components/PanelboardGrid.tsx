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

LicenseManager.setLicenseKey("[TRIAL]_this_{AG_Charts_and_AG_Grid}_Enterprise_key_{AG-078795}_is_granted_for_evaluation_only___Use_in_production_is_not_permitted___Please_report_misuse_to_legal@ag-grid.com___For_help_with_purchasing_a_production_key_please_contact_info@ag-grid.com___You_are_granted_a_{Single_Application}_Developer_License_for_one_application_only___All_Front-End_JavaScript_developers_working_on_the_application_would_need_to_be_licensed___This_key_will_deactivate_on_{30 April 2025}____[v3]_[0102]_MTc0NTk2NzYwMDAwMA==39b1546fe2d969966a31bbc6b46371db");

interface CategoryData {
  id: string;
  name: string;
  color: string;
  filterValue: string;
}

const PanelboardGrid: React.FC = () => {
  const gridRef = useRef<AgGridReact>(null);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [columnApi, setColumnApi] = useState<ColumnApi | null>(null);
  const [quickFilter, setQuickFilter] = useState('');
  const [rowData, setRowData] = useState<any[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const categories: CategoryData[] = [
    { id: 'circuit-breakers', name: 'Circuit Breakers (MCB, MCCB, ACB)', color: '#E5DEFF', filterValue: 'Main' },
    { id: 'rcd', name: 'Residual Current Devices (RCD, RCCB, RCBO)', color: '#D3E4FD', filterValue: 'Distribution' },
    { id: 'fuse-links', name: 'Fuse Links', color: '#FDE1D3', filterValue: 'Sub' },
    { id: 'contactors', name: 'Contactors', color: '#F2FCE2', filterValue: 'Main' },
    { id: 'overload-relays', name: 'Overload Relays', color: '#FEF7CD', filterValue: 'Distribution' },
    { id: 'timers', name: 'Timers', color: '#FFDEE2', filterValue: 'Sub' },
    { id: 'push-buttons', name: 'Push Buttons & Selector Switches', color: '#F1F0FB', filterValue: 'Lighting' },
  ];

  useEffect(() => {
    setRowData(panelboardData);
    console.log("Panelboard tree data:", panelboardData);
  }, []);

  useEffect(() => {
    if (rowData) {
      const calculateSum = (data: any[]): number => {
        let sum = 0;
        for (const item of data) {
          if (item.children && item.children.length > 0) {
            sum += calculateSum(item.children);
          } else if (item.quantity && item.price) {
            sum += item.quantity * item.price;
          }
        }
        return sum;
      };
      setTotalPrice(calculateSum(rowData));
    }
  }, [rowData]);

  const [columnDefs, setColumnDefs] = useState<(ColDef | ColGroupDef)[]>([
    { 
      headerName: 'Product Code', 
      field: 'productCode', 
      sortable: true, 
      filter: true, 
      checkboxSelection: true,
      headerCheckboxSelection: true,
      pinned: 'left',
      width: 150
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
      cellStyle: { backgroundColor: '#f0f8ff' },
      cellEditor: 'agNumberCellEditor',
      cellEditorParams: {
        min: 0,
        max: 1000
      },
      singleClickEdit: true,
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
    console.log("Grid ready, row count:", params.api.getDisplayedRowCount());
  };

  const onCellValueChanged = (event: CellValueChangedEvent) => {
    if (event.colDef.field === 'quantity') {
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

  const onFilterTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuickFilter(e.target.value);
    if (gridApi) {
      gridApi.setQuickFilter(e.target.value);
    }
  };

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

  const navigationCategories = [
    { id: 'circuit-breakers', name: 'Circuit Breakers', icon: <CircuitBoard className="mr-2" size={16} /> },
    { id: 'rcd', name: 'RCDs', icon: <Shield className="mr-2" size={16} /> },
    { id: 'fuse-links', name: 'Fuse Links', icon: <Link className="mr-2" size={16} /> },
    { id: 'contactors', name: 'Contactors', icon: <ToggleLeft className="mr-2" size={16} /> },
    { id: 'overload-relays', name: 'Relays', icon: <AlertTriangle className="mr-2" size={16} /> },
    { id: 'timers', name: 'Timers', icon: <Clock className="mr-2" size={16} /> },
    { id: 'push-buttons', name: 'Buttons & Switches', icon: <CircleDot className="mr-2" size={16} /> }
  ];

  const getDataPath = (data: any) => {
    if (data.productCode && data.productCode.startsWith('SD001-')) {
      return ["Star-Delta Motor Starter 22kW - With Sub components", data.description];
    }
    if (data.productCode === 'SDMS22KWSC') {
      return ["Star-Delta Motor Starter 22kW - With Sub components"];
    }
    return [data.description];
  };

  const gridRowClassRules = {
    "bg-yellow-200": (params: any) => params.data && params.data.type === "Starter-Sub",
  };

  const navigateToCategory = (categoryId: string) => {
    if (gridApi) {
      gridApi.setFilterModel(null);
      const category = categories.find(cat => cat.id === categoryId);
      if (category) {
        setActiveFilter(categoryId);
        gridApi.setColumnFilterModel('type', {
          type: 'equals',
          filter: category.filterValue
        });
        console.log(`Filtering for category: ${category.name}, type: ${category.filterValue}`);
        const rowNodes: any[] = [];
        gridApi.forEachNode((node) => rowNodes.push(node));
        const categoryIndex = rowNodes.findIndex(node => 
          node.data && node.data.id === categoryId
        );
        if (categoryIndex >= 0) {
          gridApi.ensureIndexVisible(categoryIndex);
          gridApi.clearFocusedCell();
          gridApi.deselectAll();
          gridApi.getDisplayedRowAtIndex(categoryIndex)?.setSelected(true);
          toast({
            title: `Filtered to ${category.name}`,
            description: `Showing ${category.filterValue} type components`,
          });
        }
      }
    }
  };

  const resetFilters = () => {
    if (gridApi) {
      gridApi.setFilterModel(null);
      setActiveFilter(null);
      gridApi.onFilterChanged();
      toast({
        title: "Filters Reset",
        description: "Showing all components",
      });
    }
  };

  const onRowClicked = (event: any) => {
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="mb-4 flex flex-wrap justify-between items-center gap-2">
        <div className="flex flex-wrap gap-2">
          {navigationCategories.map((category) => (
            <Button
              key={category.id}
              variant={activeFilter === category.id ? "default" : "outline"}
              className="flex items-center"
              onClick={() => navigateToCategory(category.id)}
            >
              {category.icon}
              {category.name}
            </Button>
          ))}
          {activeFilter && (
            <Button
              variant="ghost"
              className="flex items-center"
              onClick={resetFilters}
            >
              Show All
            </Button>
          )}
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
          treeData={true}
          getDataPath={getDataPath}
          groupDefaultExpanded={-1}
          rowClassRules={gridRowClassRules}
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
