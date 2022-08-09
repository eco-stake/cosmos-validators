import React, { useCallback, useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import ValidatorName from './ValidatorName';
import ValidatorPublicNodes from './ValidatorPublicNodes';

function ChainValidatorGrid(props) {
  const { chainValidators, nameColumn, gridRef } = props

  const [rowData, setRowData] = useState();
  const [columnDefs, setColumnDefs] = useState([
    nameColumn || { field: 'name', cellRenderer: ValidatorName, flex: 2, headerName: 'Validator Name' },
    { field: 'status' },
    {
      field: 'rank', valueFormatter: params => {
        return params.value?.toLocaleString(undefined, { maximumFractionDigits: 1 })
      }
    },
    {
      field: 'commission.rate', valueFormatter: params => {
        return params.value && `${(params.value * 100).toLocaleString(undefined, { maximumFractionDigits: 2 })}%`
      }, headerName: 'Fee'
    },
    {
      field: 'uptime', valueFormatter: params => {
        if (!params.value) return null

        const value = params.value * 100
        return `${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}%`
      }
    },
    { field: 'missedBlocks' },
    { field: 'totalSlashes', headerName: 'Slashes' },
    {
      field: 'totalTokens', headerName: 'Delegations', valueFormatter: params => {
        if (!params.value) return null
        return `${params.value.toLocaleString(undefined, { maximumFractionDigits: 0 })} ${params.data.chain.symbol}`
      }
    },
    { field: 'totalUsers', headerName: 'Users' },
    {
      field: 'totalUsd', headerName: 'Total USD', valueFormatter: params => {
        if (!params.value) return null
        return `$${params.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
      }
    },
    { field: 'public_nodes', cellRenderer: ValidatorPublicNodes, headerName: 'Public Nodes',
      valueGetter: params => Object.values(params.data.public_nodes || {}),
      filterValueGetter: params => Object.keys(params.data.public_nodes || {})  }
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
    if (chainValidators) {
      setRowData(chainValidators)
    }
  }, [chainValidators]);

  function onRowClicked(params){
    if(gridRef.current.api.getFocusedCell().column.getColId() === 'public_nodes'){
      return;
    }
    props.onRowClicked(params)
  }

  return (
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
      onRowClicked={onRowClicked}
    ></AgGridReact>
  );
}

export default ChainValidatorGrid