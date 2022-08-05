import axios from 'axios'

function CosmosDirectory(){
  const directoryProtocol = process.env.DIRECTORY_PROTOCOL || 'https'
  const directoryDomain = process.env.DIRECTORY_DOMAIN || 'cosmos.directory'
  const rpcBase = `${directoryProtocol}://rpc.${directoryDomain}`
  const restBase = `${directoryProtocol}://rest.${directoryDomain}`
  const chainsUrl = `${directoryProtocol}://chains.${directoryDomain}`
  const validatorsUrl = `${directoryProtocol}://validators.${directoryDomain}`
  const statusUrl = `${directoryProtocol}://status.${directoryDomain}`

  function rpcUrl(path){
    return rpcBase + '/' + path
  }

  function restUrl(path){
    return restBase + '/' + path
  }

  function getStatus(){
    return axios.get(statusUrl)
      .then(res => res.data)
  }

  function getChains(){
    return axios.get(chainsUrl)
      .then(res => res.data)
  }

  function getChain(path){
    return axios.get([chainsUrl, path].join('/'))
      .then(res => { return {...res.data, path} })
  }

  function getChainStatus(path){
    return axios.get(statusUrl + '/' + path)
      .then(res => res.data)
  }

  function getChainData(path) {
    return axios.get([chainsUrl, path, 'chain'].join('/'))
      .then(res => { return {...res.data, path} })
  }

  async function getChainAssetlist(path) {
    return axios.get([chainsUrl, path, 'assetlist'].join('/'))
      .then(res => res.data)
  }

  function getChainValidators(path){
    return axios.get([validatorsUrl, 'chains', path].join('/'))
      .then(res => res.data)
  }

  function getValidators(){
    return axios.get(validatorsUrl)
      .then(res => res.data)
  }

  return {
    rpcUrl,
    restUrl,
    chainsUrl,
    getStatus,
    getChains,
    getChain,
    getChainStatus,
    getChainData,
    getChainAssetlist,
    getChainValidators,
    getValidators
  }
}

export default CosmosDirectory