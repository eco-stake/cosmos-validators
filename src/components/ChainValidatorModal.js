import React, { useState, useEffect } from 'react';

import {
  Modal,
  Table
} from 'react-bootstrap'
import Coins from './Coins';
import ValidatorName from './ValidatorName';
import ValidatorProfiles from './ValidatorProfiles';
import ValidatorWebsite from './ValidatorWebsite';

function ChainValidatorModal(props) {
  const { registryValidator, chainValidator } = props

  const validator = chainValidator

  function uptime() {
    if(!validator.uptime) return 

    const value = validator.uptime * 100
    return `${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}%`
  }

  console.log(validator)
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
                        <td className="align-middle" scope="row">Networks</td>
                        <td className="w-75">
                          {/* <ValidatorNetworks validator={validator} registryData={registryData} network={network} networks={networks} /> */}
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td scope="row">REStake</td>
                      <td>
                      </td>
                    </tr>
                    <tr>
                      <td scope="row">Commission</td>
                      <td><span className="p-0">{validator.commission.rate * 100}%</span></td>
                    </tr>
                    <tr>
                      <td scope="row">Voting power</td>
                      <td><span className="p-0"><Coins coins={validator.tokens} asset={validator.chain.baseAsset} /></span></td>
                    </tr>
                    <tr>
                      <td scope="row">Rank</td>
                      <td><span className="p-0">#{validator.rank}</span></td>
                    </tr>
                    <tr>
                      <td scope="row">Contact</td>
                      <td><a className="p-0" href={`mailto:${validator.description?.security_contact}`}>{validator.description?.security_contact}</a></td>
                    </tr>
                  </tbody>
                </Table>
              </div>
              <div className="col small">
                <p>
                  {validator.description.details}
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
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ChainValidatorModal