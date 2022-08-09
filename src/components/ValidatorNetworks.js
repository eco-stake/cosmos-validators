import React, { useState, useEffect } from 'react';
import _ from 'lodash'
import {
  OverlayTrigger, 
  Tooltip,
} from 'react-bootstrap'

function ValidatorNetworks(props) {
  const { registryValidator, chain, setChainValidator } = props

  if(!registryValidator) return null

  const validatorNetworks = _.uniqBy(_.compact(registryValidator.validators.map(validator => {
    const chainNetwork = validator.chain
    if(chainNetwork){
      const active = chain?.path === chainNetwork.path
      return {
        key: chainNetwork.name,
        name: chainNetwork.pretty_name,
        image: <img src={chainNetwork.image} width={20} height={20} className="rounded-circle" />,
        active,
        validator
      }
    }
  })), 'key').sort((a, b) => a.name > b.name ? 1 : -1)

  return (
    <div className="d-flex flex-wrap gap-1 align-items-center">
      {validatorNetworks.map(validatorNetwork => {
        return (
          <OverlayTrigger
            placement="top"
            rootClose={true}
            key={validatorNetwork.key}
            overlay={
              <Tooltip id={`tooltip-${validatorNetwork.key}`}>{validatorNetwork.name}</Tooltip>
            }
          >
            <span role="button" onClick={() => setChainValidator(validatorNetwork.validator)}>
              {validatorNetwork.image}
            </span>
          </OverlayTrigger>
        )
      })}
    </div>
  );
}

export default ValidatorNetworks
