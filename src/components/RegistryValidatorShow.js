import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from "react-router-dom";
import GridHeader from './GridHeader';
import AppHeader from './AppHeader';
import ChainName from './ChainName';
import ValidatorName from './ValidatorName';
import RegistryValidator from '../models/RegistryValidator';
import ChainValidatorModal from './ChainValidatorModal';
import ChainValidatorGrid from './ChainValidatorGrid';
import {
  Table
} from 'react-bootstrap'

function RegistryValidatorShow(props) {
  const { validators, chains, directory } = props

  const [registryValidator, setRegistryValidator] = useState();
  const [chainValidator, setChainValidator] = useState();
  const params = useParams();

  const navigate = useNavigate();

  const gridRef = useRef();
  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const gridStyle = useMemo(() => ({ height: '370px', width: '100%' }), []);

  useEffect(() => {
    if(params.registryValidator && validators && !registryValidator){
      directory.getValidator(params.registryValidator).then(data => {
        setRegistryValidator(RegistryValidator(data.validator, chains))
      })
    }
  }, [params.registryValidator, validators, registryValidator]);

  useEffect(() => {
    if(params.chainValidator && registryValidator && !chainValidator){
      setChainValidator(registryValidator.validators.find(el => el.address === params.chainValidator))
    }else if(!params.chainValidator && chainValidator){
      setChainValidator(null)
    }
  }, [params.chainValidator, registryValidator, chainValidator]);

  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current.api.setQuickFilter(
      document.getElementById('filter-text-box').value
    );
  }, []);

  return (
    <>
      <AppHeader active="validators" />
      <div style={containerStyle}>
        <div className="d-flex justify-content-around align-items-center mb-3">
          <nav className="me-auto" aria-label="breadcrumb">
            <ol className="breadcrumb m-0">
              {[
                <li key="chains" className="breadcrumb-item"><Link to="/">Validators</Link></li>,
                <li key="chain" className="breadcrumb-item active" aria-current="page"><ValidatorName data={registryValidator || {}} /></li>
              ]}
            </ol>
          </nav>
        </div>
        {registryValidator ? (
          <>
            <div className="row">
              <div className="col">
                <Table>
                  <tbody className="table-sm small">
                    <tr>
                      <td scope="row">Average Rank</td>
                      <td className="text-break"><span className="p-0">{registryValidator.averageRank?.toLocaleString(undefined, { maximumFractionDigits: 1 })}</span></td>
                    </tr>
                    <tr>
                      <td scope="row">Average Uptime</td>
                      <td className="text-break"><span className="p-0">{registryValidator.averageUptime && (registryValidator.averageUptime * 100)?.toLocaleString(undefined, { maximumFractionDigits: 2 })}%</span></td>
                    </tr>
                    <tr>
                      <td scope="row">Total Slashes</td>
                      <td className="text-break"><span className="p-0">{registryValidator.totalSlashes}</span></td>
                    </tr>
                    <tr>
                      <td scope="row">Total Users</td>
                      <td className="text-break"><span className="p-0">{registryValidator.total_users}</span></td>
                    </tr>
                    <tr>
                      <td scope="row">Total USD</td>
                      <td className="text-break"><span className="p-0">${registryValidator.total_usd?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></td>
                    </tr>
                  </tbody>
                </Table>
              </div>
              <div className="col">
                <Table>
                  <tbody className="table-sm small">
                  </tbody>
                </Table>
              </div>
            </div>
            <GridHeader onFilterTextBoxChanged={onFilterTextBoxChanged} />
            <div style={gridStyle} className="ag-theme-alpine">
              <ChainValidatorGrid
                gridRef={gridRef}
                chainValidators={registryValidator.validators}
                nameColumn={{ field: 'name', cellRenderer: (params) => <ChainName data={params.data.chain} />, flex: 2, headerName: 'Chain Name' }}
                onRowClicked={(row) => row.data.chain && navigate(`/${registryValidator.path}/${row.data.address}`)}
              />
            </div>
          </>
        ) : (
          <div className="pt-3 text-center">
            <span className="spinner-border" role="status" aria-hidden="true"></span>
          </div>
        )}
      </div>
      <ChainValidatorModal 
        chainValidator={chainValidator} 
        registryValidator={registryValidator} 
        show={!!chainValidator} 
        onHide={() => navigate(`/${registryValidator.path}`)} 
      />
    </>
  );
}

export default RegistryValidatorShow