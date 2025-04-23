
import React, { useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useNavigate } from "react-router-dom";

const mainComponent = {
  productCode: "SDMS22KWSC",
  description: "Star-Delta Motor Starter 22kW - With Sub components",
  modelNumber: "SDMS-22KW-SC",
  manufacturer: "Schneider Electric",
  group: "Main",
  type: "Motor Starter",
};

// Subcomponents data for tree hierarchy
const subComponents = [
  {
    productCode: "SD001-01",
    description: "Main Contactor 50A AC3",
    modelNumber: "LC1D50A",
    manufacturer: "Schneider Electric",
    function: "Motor Control",
    category: "Contactor",
  },
  {
    productCode: "SD001-02",
    description: "Star Contactor 32A AC3",
    modelNumber: "LC1D32A",
    manufacturer: "Schneider Electric",
    function: "Motor Control",
    category: "Contactor",
  },
  {
    productCode: "SD001-03",
    description: "Delta Contactor 50A AC3",
    modelNumber: "LC1D50A",
    manufacturer: "Schneider Electric",
    function: "Motor Control",
    category: "Contactor",
  },
  {
    productCode: "SD001-04",
    description: "Timer Relay 0-30s",
    modelNumber: "RE22R1AMR",
    manufacturer: "Schneider Electric",
    function: "Control",
    category: "Timer",
  },
  {
    productCode: "SD001-05",
    description: "Thermal Overload Relay 30-50A",
    modelNumber: "LRD350",
    manufacturer: "Schneider Electric",
    function: "Protection",
    category: "Overload",
  },
  {
    productCode: "SD001-06",
    description: "Control Circuit MCB 6A 1P",
    modelNumber: "A9F74106",
    manufacturer: "Schneider Electric",
    function: "Breaker",
    category: "MCB",
  },
  {
    productCode: "SD001-07",
    description: "Power Circuit MCB 63A 3P",
    modelNumber: "A9F75363",
    manufacturer: "Schneider Electric",
    function: "Breaker",
    category: "MCB",
  },
  {
    productCode: "SD001-08",
    description: "Start Button (Green)",
    modelNumber: "XB4BA31",
    manufacturer: "Schneider Electric",
    function: "Control",
    category: "Button",
  },
  {
    productCode: "SD001-09",
    description: "Stop Button (Red)",
    modelNumber: "XB4BA42",
    manufacturer: "Schneider Electric",
    function: "Control",
    category: "Button",
  },
  {
    productCode: "SD001-10",
    description: "Control Relay 24VDC 4CO",
    modelNumber: "RXM4AB2BD",
    manufacturer: "Schneider Electric",
    function: "Control",
    category: "Relay",
  },
  {
    productCode: "SD001-11",
    description: "Control Transformer 415/24V 100VA",
    modelNumber: "ABL6TS10U",
    manufacturer: "Schneider Electric",
    function: "Power",
    category: "Transformer",
  },
  {
    productCode: "SD001-12",
    description: "Auxiliary Contact Block",
    modelNumber: "LADN22",
    manufacturer: "Schneider Electric",
    function: "Control",
    category: "Auxiliary",
  },
  {
    productCode: "SD001-13",
    description: "Terminal Block Set",
    modelNumber: "AB1VV435U",
    manufacturer: "Schneider Electric",
    function: "Panel",
    category: "Terminal",
  },
  {
    productCode: "SD001-14",
    description: "Control Wiring Kit 1.5mm²",
    modelNumber: "CW-KIT-1.5",
    manufacturer: "Generic",
    function: "Panel",
    category: "Wiring",
  },
  {
    productCode: "SD001-15",
    description: "Power Wiring Kit 10mm²",
    modelNumber: "PW-KIT-10",
    manufacturer: "Generic",
    function: "Panel",
    category: "Wiring",
  },
];

// Prepare tree data structure
const getTreeData = () => [
  {
    ...mainComponent,
    children: subComponents,
  },
];

const columnDefs = [
  { field: "description", headerName: "Description", flex: 2 },
  { field: "productCode", headerName: "Code", flex: 1 },
  { field: "modelNumber", headerName: "Model", flex: 1 },
  { field: "manufacturer", headerName: "Manufacturer", flex: 1.5 },
  { field: "function", headerName: "Function", flex: 1, hide: false },
  { field: "category", headerName: "Category", flex: 1 },
];

const autoGroupColumnDef = {
  headerName: "Component / Sub-Component",
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
          Star-Delta Motor Starter 22kW Hierarchy
        </h1>
        <div
          className="ag-theme-alpine"
          style={{
            height: 500,
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
            getDataPath={(data: any) =>
              data.children ? [data.description] : [mainComponent.description, data.description]
            }
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
