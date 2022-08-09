import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { AgGridReact } from 'ag-grid-react';
import GridHeader from './GridHeader';
import AppHeader from './AppHeader';
import {divide, pow} from 'mathjs'
import ChainName from './ChainName';

function ChainListing(props) {
  const { validators, chains } = props

  const navigate = useNavigate();
  const gridRef = useRef();
  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
  const [rowData, setRowData] = useState();
  const [columnDefs, setColumnDefs] = useState([
    { field: 'name', cellRenderer: ChainName, flex: 2, headerName: 'Chain Name' },
    { field: 'height' },
    { field: 'params.actual_block_time', headerName: 'Block Time', valueFormatter: params => {
      return params.value?.toLocaleString(undefined, { maximumFractionDigits: 2 })
    } },
    { field: 'params.max_validators', headerName: 'Max Validators' },
    { field: 'params.total_supply', headerName: 'Total Tokens', valueFormatter: params => {
      if(!params.value) return null
      const value = divide(params.value, pow(10, params.data.decimals))
      return `${value.toLocaleString(undefined, { maximumFractionDigits: 0 })} ${params.data.symbol}`
    } },
    { field: 'params.bonded_ratio', headerName: 'Staked %', valueFormatter: params => {
      if(!params.value) return null

      const value = params.value * 100
      return `${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}%`
    } },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      filter: true,
      resizable: true,
      sortable: true
    };
  }, []);

  const onGridReady = useCallback((params) => {
    setRowData(Object.values(chains))
  }, [chains]);

  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current.api.setQuickFilter(
      document.getElementById('filter-text-box').value
    );
  }, []);

  return (
    <>
      <AppHeader active="chains" />
      <div style={containerStyle}>
        <GridHeader onFilterTextBoxChanged={onFilterTextBoxChanged} breadcrumbs={[
          <li key="chains" className="breadcrumb-item active" aria-current="page">Chains</li>,
        ]} />
        {validators && chains ? (
          <div style={gridStyle} className="ag-theme-alpine">
            <AgGridReact
              ref={gridRef}
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              suppressRowClickSelection={true}
              suppressCellFocus={true}
              // enableCellTextSelection={true}
              // ensureDomOrder={true}
              onGridReady={onGridReady}
              onRowClicked={(row) => navigate(`/chains/${row.data.path}`)}
            ></AgGridReact>
          </div>
        ) : (
          <div className="pt-3 text-center">
            <span className="spinner-border" role="status" aria-hidden="true"></span>
          </div>
        )}
      </div>
    </>
  );
}

export default ChainListing