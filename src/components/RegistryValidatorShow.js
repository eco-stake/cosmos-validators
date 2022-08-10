import React, { useCallback, useMemo, useRef, useState, useEffect, Fragment } from 'react';
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
import ValidatorNetworks from './ValidatorNetworks';

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
    if(params.chainValidator && registryValidator && (!chainValidator || chainValidator.path !== params.chainValidator)){
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

  const { profile, services } = registryValidator || {}
  const { description, contacts } = profile || {}

  function setValidator(validator){
    navigate(`/${registryValidator.path}/${validator.address}`)
  }

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
              <div className="col small">
                <Table>
                  <tbody className="table-sm">
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
                    <tr>
                      <td scope="row">Networks</td>
                      <td><span className="p-0"><ValidatorNetworks registryValidator={registryValidator} setValidator={setValidator} /></span></td>
                    </tr>
                    {contacts?.others && (
                      Object.entries(contacts.others).map(([label, value]) => {
                        if(value) return (
                          <tr key={label}>
                            <td scope="row">{label}</td>
                            <td className="text-break"><span className="p-0">{value}</span></td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </Table>
                {services && (
                  <>
                  <p><strong>Services</strong></p>
                  <ul className="list-group list-group-flush">
                    {services.map(service => {
                      return (
                        <Fragment key={service.title}>
                          <p className="m-0">
                            {service.image && (
                              <img src={service.image} width={20} className="me-2" />
                            )}
                            <strong>{service.title}</strong>
                          </p>
                          {service.url && (
                            <p className="mb-0"><a href={service.url} target="_blank">{service.url}</a></p>
                          )}
                          <p>{service.description}</p>
                        </Fragment>
                      )
                    })}
                  </ul>
                  </>
                )}
              </div>
              <div className="col small">
                {description?.overview && (
                  <>
                    <p>{description.overview}</p>
                  </>
                )}
                {description?.team && (
                  <>
                    <p className="m-0"><strong>Team</strong></p>
                    <p>{description.team}</p>
                  </>
                )}
                {description?.security && (
                  <>
                    <p className="m-0"><strong>Security</strong></p>
                    <p>{description.security}</p>
                  </>
                )}
                <Table>
                  <tbody className="table-sm">
                    {contacts?.telephone && (
                      <tr>
                        <td scope="row">Telephone</td>
                        <td className="text-break">
                          <span className="p-0">
                            <a href={`tel:${contacts.telephone}`} target="_blank">{contacts.telephone}</a>
                          </span>
                        </td>
                      </tr>
                    )}
                    {contacts?.email && (
                      <tr>
                        <td scope="row">Email</td>
                        <td className="text-break">
                          <span className="p-0">
                            <a href={`mailto:${contacts.email}`} target="_blank">{contacts.email}</a>
                          </span>
                        </td>
                      </tr>
                    )}
                    {contacts?.discord && (
                      <tr>
                        <td scope="row">Discord</td>
                        <td className="text-break">
                          <span className="p-0">
                            <a href={contacts.discord} target="_blank">{contacts.discord}</a>
                          </span>
                        </td>
                      </tr>
                    )}
                    {contacts?.telegram && (
                      <tr>
                        <td scope="row">Telegram</td>
                        <td className="text-break">
                          <span className="p-0">
                            <a href={`https://t.me/${contacts.telegram}`} target="_blank">@{contacts.telegram}</a>
                          </span>
                        </td>
                      </tr>
                    )}
                    {contacts?.twitter && (
                      <tr>
                        <td scope="row">Twitter</td>
                        <td className="text-break">
                          <span className="p-0">
                            <a href={`https://twitter.com/${contacts.twitter}`} target="_blank">@{contacts.twitter}</a>
                          </span>
                        </td>
                      </tr>
                    )}
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
        chains={chains}
        chainValidator={chainValidator} 
        registryValidator={registryValidator} 
        show={!!chainValidator} 
        onHide={() => navigate(`/${registryValidator.path}`)} 
        setValidator={setValidator}
        action={chainValidator && (
          <Link to={`/chains/${chainValidator.chain.path}`} className="btn btn-primary btn-sm">
            All {chainValidator.chain.pretty_name} Validators
          </Link>
        )}
      />
    </>
  );
}

export default RegistryValidatorShow