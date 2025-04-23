
import React, { useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useNavigate } from "react-router-dom";

const mainComponent = {
  productCode: "SDMS22KWSC",
  description: "Star-Delta Motor Starter 22kW - With Sub components",
  supplier: "Schneider Electric",
  qty: 1,
};

const subComponents = [
  {
    productCode: "SD001-01",
    description: "Main Contactor 50A AC3",
    supplier: "Schneider Electric",
    qty: 1,
  },
  {
    productCode: "SD001-02",
    description: "Star Contactor 32A AC3",
    supplier: "Schneider Electric", 
    qty: 1,
  },
  {
    productCode: "SD001-03",
    description: "Delta Contactor 50A AC3",
    supplier: "Schneider Electric",
    qty: 1,
  },
  {
    productCode: "SD001-04",
    description: "Timer Relay 0-30s",
    supplier: "Schneider Electric",
    qty: 1,
  }
];

const getTreeData = () => {
  return [
    {
      ...mainComponent,
      path: [mainComponent.description],
    },
    ...subComponents.map((sub) => ({
      ...sub,
      path: [mainComponent.description, sub.description],
      qty: mainComponent.qty,
    })),
  ];
};

const columnDefs = [
  { 
    field: "description", 
    headerName: "", 
    flex: 2,
  },
  { 
    field: "supplier", 
    headerName: "Supplier", 
    flex: 1 
  },
  { 
    field: "productCode", 
    headerName: "Code", 
    flex: 1 
  },
  { 
    field: "qty", 
    headerName: "Qty", 
    flex: 1,
    editable: true,
    onCellValueChanged: (params: any) => {
      if (params.data.path.length === 1) {  // If main component
        const gridApi = params.api;
        const newQty = params.newValue;
        
        // Update all subcomponents
        gridApi.forEachNode((node: any) => {
          if (node.data.path.length > 1) {  // If subcomponent
            node.setDataValue('qty', newQty);
          }
        });
      }
    }
  }
];

const autoGroupColumnDef = {
  headerName: "",
  field: "description",
  cellRendererParams: {
    suppressCount: true,
  },
  flex: 2,
};

const StarDeltaTree = () => {
  const gridRef = useRef(null);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Main Grid
        </button>
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          Star-Delta Motor Starter Components
        </h1>
        <div
          className="ag-theme-alpine"
          style={{
            height: 400,
            width: "100%",
            background: "white",
            borderRadius: 8,
            boxShadow: "0 2px 12px rgba(0,0,0,0.09)",
          }}
        >
          <AgGridReact
            ref={gridRef}
            rowData={getTreeData()}
            columnDefs={columnDefs}
            treeData={true}
            groupDefaultExpanded={1}
            getDataPath={(data: any) => data.path}
            autoGroupColumnDef={autoGroupColumnDef}
            suppressRowClickSelection={true}
            animateRows={true}
            domLayout="autoHeight"
          />
        </div>
      </div>
    </div>
  );
};

export default StarDeltaTree;
