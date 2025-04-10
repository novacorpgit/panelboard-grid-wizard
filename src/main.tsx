
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

createRoot(document.getElementById("root")!).render(<App />);
