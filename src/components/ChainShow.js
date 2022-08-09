import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from "react-router-dom";
import GridHeader from './GridHeader';
import AppHeader from './AppHeader';
import ChainName from './ChainName';
import ChainValidatorGrid from './ChainValidatorGrid';
import ChainValidator from '../models/ChainValidator';
import ChainValidatorModal from './ChainValidatorModal';

function ChainShow(props) {
  const { validators, chains, directory } = props

  const [chain, setChain] = useState();
  const [chainValidators, setChainValidators] = useState();
  const [chainValidator, setChainValidator] = useState();
  const params = useParams();

  const navigate = useNavigate();
  const gridRef = useRef();
  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);

  useEffect(() => {
    if(params.chain && chains && (!chain || chain.path !== params.chain)){
      setChainValidators()
      setChainValidator()
      setChain(chains[params.chain])
    }
  }, [params.chain, chains, chain]);

  useEffect(() => {
    if(chain && !chainValidators){
      directory.getChainValidators(chain.path).then(data => {
        setChainValidators(data.validators.map(el => ChainValidator(el, chain)))
      })
    }
  }, [chain, chainValidators]);

  useEffect(() => {
    if(params.chainValidator && chainValidators && !chainValidator){
      setChainValidator(chainValidators.find(el => el.address === params.chainValidator))
    }else if(!params.chainValidator && chainValidator){
      setChainValidator(null)
    }
  }, [params.chainValidator, chainValidators, chainValidator]);

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
          <li key="chains" className="breadcrumb-item"><Link to="/chains">Chains</Link></li>,
          <li key="chain" className="breadcrumb-item active" aria-current="page"><ChainName data={chain || {}} /></li>
        ]} />
        {chain && chainValidators ? (
          <div style={gridStyle} className="ag-theme-alpine">
            <ChainValidatorGrid
              gridRef={gridRef}
              chainValidators={chainValidators}
              onRowClicked={(row) => row.data.chain && navigate(`/chains/${chain.path}/${row.data.address}`)}
            />
          </div>
        ) : (
          <div className="pt-3 text-center">
            <span className="spinner-border" role="status" aria-hidden="true"></span>
          </div>
        )}
      </div>
      <ChainValidatorModal 
        chainValidator={chainValidator} 
        registryValidators={validators} 
        show={!!chainValidator} 
        onHide={() => navigate(`/chains/${chain.path}`)} 
      />
    </>
  );
}

export default ChainShow