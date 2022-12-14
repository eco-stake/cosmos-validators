import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { AgGridReact } from 'ag-grid-react';
import GridHeader from './GridHeader';
import AppHeader from './AppHeader';
import ValidatorName from './ValidatorName';

function ValidatorChainsRenderer (params) {
  return params.value.map(validator => {
    const chain = validator.chain
    if (!chain) return null

    return (
      <span key={chain.path}>
        <img src={chain.image} width={20} height={20} className="rounded-circle" />
      </span>
    )
  })
  ;
}

function RegistryValidatorListing(props) {
  const { validators, chains } = props

  const navigate = useNavigate();
  const gridRef = useRef();
  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
  const [rowData, setRowData] = useState();
  const [columnDefs, setColumnDefs] = useState([
    { field: 'name', cellRenderer: ValidatorName, flex: 2, headerName: 'Validator Name' },
    { 
      field: 'activeChains', 
      filterValueGetter: params => params.data.activeChains.map(el => el.name), 
      cellRenderer: ValidatorChainsRenderer, 
      headerName: 'Active Chains', 
      flex: 2 
    },
    { field: 'averageRank', valueFormatter: params => {
      return params.value?.toLocaleString(undefined, { maximumFractionDigits: 1 })
    } },
    { field: 'averageUptime', valueFormatter: params => {
      if(!params.value) return null

      const value = params.value * 100
      return `${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}%`
    }  },
    { field: 'totalSlashes' },
    { field: 'total_users', headerName: 'Total Users' },
    { field: 'total_usd', headerName: 'Total USD', valueFormatter: params => {
      if(!params.value) return null
      return `$${params.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
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
    setRowData(validators)
  }, [validators]);

  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current.api.setQuickFilter(
      document.getElementById('filter-text-box').value
    );
  }, []);

  return (
    <>
      <AppHeader active="validators" />
      <div style={containerStyle}>
        <GridHeader onFilterTextBoxChanged={onFilterTextBoxChanged} breadcrumbs={[
          <li key="validators" className="breadcrumb-item active" aria-current="page">Validators</li>,
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
              onRowClicked={(row) => navigate(`/${row.data.path}`)}
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

export default RegistryValidatorListing