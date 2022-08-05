import React, { useCallback, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';

function ValidatorRenderer(params) {
  const { image, name } = params.data
  return (
    <span>
      <img src={image} width={20} height={20} className="rounded-circle" /> {name}
    </span>
  )
}

function ChainsRenderer(chains) {
  return (params) => {
    return params.value.map(el => {
      const chain = chains && chains[el]
      if (!chain) return null

      return (
        <span key={chain.path}>
          <img src={chain.image} width={20} height={20} className="rounded-circle" />
        </span>
      )
    })
    ;
  }
}

function RegistryValidatorListing(props) {
  const { validators, chains } = props

  if(!validators || !chains){
    return (
      <div className="pt-3 text-center">
        <div className="sk-spinner sk-spinner-pulse"></div>
      </div>
    )
  }

  const gridRef = useRef();
  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
  const [rowData, setRowData] = useState();
  const [columnDefs, setColumnDefs] = useState([
    { field: 'name', cellRenderer: ValidatorRenderer, flex: 2 },
    { field: 'activeChains', valueGetter: params => params.data.activeChains.map(el => el.name), cellRenderer: ChainsRenderer(chains), headerName: 'Active chains', flex: 2 },
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
      return `$${params.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
    } },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 150,
      filter: true,
      resizable: true,
      sortable: true
    };
  }, []);

  const onGridReady = useCallback((params) => {
    setRowData(validators)
  }, []);

  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current.api.setQuickFilter(
      document.getElementById('filter-text-box').value
    );
  }, []);

  if(!validators){
    return null
  }else{
    if(!rowData) setRowData(validators)
  }

  return (
    <div style={containerStyle}>
      <input
            type="text"
            id="filter-text-box"
            placeholder="Filter..."
            onInput={onFilterTextBoxChanged}
          />
      <div style={gridStyle} className="ag-theme-alpine">
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          suppressRowClickSelection={true}
          suppressCellFocus={true}
          enableCellTextSelection={true}
          ensureDomOrder={true}
          onGridReady={onGridReady}
          // onRowClicked={(row) => console.log(row.data)}
        ></AgGridReact>
      </div>
    </div>
  );
}

export default RegistryValidatorListing