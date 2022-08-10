import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";

import {
  Modal,
  Table,
  Button,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap'
import Coins from './Coins';
import ValidatorName from './ValidatorName';
import ValidatorNetworks from './ValidatorNetworks';
import ValidatorProfiles from './ValidatorProfiles';
import ValidatorWebsite from './ValidatorWebsite';

function ChainValidatorModal(props) {
  const { registryValidators, chainValidator, chains } = props

  let registryValidator = props.registryValidator
  if(!registryValidator && registryValidators){
    registryValidator = registryValidators.find(el => chainValidator && el.path === chainValidator.path)
  }

  const validator = chainValidator

  const navigate = useNavigate();

  function uptime() {
    if(!validator.uptime) return 

    const value = validator.uptime * 100
    return `${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}%`
  }

  return (
    <>
      <Modal size='lg' show={props.show} onHide={props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>
            <ValidatorName data={validator} width={30} height={30} />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {validator && (
            <div className="row">
              <div className="col">
                <Table>
                  <tbody className="table-sm small">
                    <tr>
                      <td scope="row">Validator Address</td>
                      <td className="text-break"><span className="p-0">{validator.address}</span></td>
                    </tr>
                    <tr>
                      <td scope="row">Status</td>
                      <td>{validator.status}</td>
                    </tr>
                    <tr>
                      <td scope="row">Uptime</td>
                      <td>{uptime()}</td>
                    </tr>
                    <tr>
                      <td scope="row">REStake</td>
                      <td>
                      </td>
                    </tr>
                    <tr>
                      <td scope="row">Commission</td>
                      <td><span className="p-0">{validator.commission ? `${validator.commission.rate * 100}%` : 'Unknown'}</span></td>
                    </tr>
                    <tr>
                      <td scope="row">Voting power</td>
                      <td><span className="p-0"><Coins coins={validator.tokens} asset={validator.chain.baseAsset} /></span></td>
                    </tr>
                    <tr>
                      <td scope="row">Rank</td>
                      <td><span className="p-0">#{validator.rank}</span></td>
                    </tr>
                  </tbody>
                </Table>
              </div>
              <div className="col small">
                <Table>
                  <tbody className="table-sm small">
                    <tr>
                      <td scope="row">Contact</td>
                      <td><a className="p-0" href={`mailto:${validator.description?.security_contact}`}>{validator.description?.security_contact}</a></td>
                    </tr>
                    <tr>
                      <td scope="row">Website</td>
                      <td className="text-break"><ValidatorWebsite className="text-decoration-underline p-0" validator={validator} /></td>
                    </tr>
                    <tr>
                      <td className="align-middle" scope="row">Profiles</td>
                      <td>
                        <ValidatorProfiles validator={validator} />
                      </td>
                    </tr>
                    {validator?.path && (
                      <tr>
                        <td className="align-middle" scope="row">Chains</td>
                        <td className="w-75">
                          <ValidatorNetworks registryValidator={registryValidator} setValidator={props.setValidator || ((validator) => navigate(`/chains/${validator.chain.path}/${validator.address}`))} />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
                <p>
                  {validator.description?.details}
                </p>
                {Object.entries(validator.public_nodes || {}).length > 0 && (
                  <>
                    <p className="m-0"><strong>Public Nodes</strong></p>
                    <Table className="table-sm">
                      <tbody>
                        {Object.entries(validator.public_nodes).map(([type, nodes]) => {
                          return (
                            <tr key={type}>
                              <td>
                                {type.toUpperCase()}
                              </td>
                              <td className="list-group list-group-flush flex-fill">
                                {nodes.map(api => {
                                  return <a href={api.address} target="_blank" className="text-reset text-decoration-underline">{api.address}</a>
                                }).reduce((prev, curr) => [prev, <br />, curr])}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </Table>
                  </>
                )}
                <p className="text-end">
                  {props.action ? props.action : (
                    validator.path ? (
                      <Link to={`/${validator.path}`} className="btn btn-primary btn-sm">
                        View full profile
                      </Link>
                    ) : (
                      <OverlayTrigger
                        placement="top"
                        rootClose={true}
                        overlay={
                          <Tooltip id={`tooltip-registry-${validator.address}`}>This validator hasn't been claimed in the Validator Registry yet.</Tooltip>
                        }
                      >
                        <span>
                          <Button size="sm" disabled={true}>
                            View full profile
                          </Button>
                        </span>
                      </OverlayTrigger>
                    )
                  )}
                </p>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ChainValidatorModal