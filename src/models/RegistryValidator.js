import _ from 'lodash'
import ChainValidator from "./ChainValidator"

export default function RegistryValidator(data, chains){
  const validators = _.uniqBy(data.chains, 'name').map(el => ChainValidator(el, chains[el.name])).filter(el => !!el.chain).sort((a, b) => (a.totalUsd || 0) < (b.totalUsd || 0) ? 1 : -1)
  const chainCount = validators.length
  const activeChains = validators.filter(el => el.active)
  const totalSlashes = validators.reduce((sum, chain) => sum + chain.totalSlashes, 0)

  const allUptime = activeChains.filter(chain => chain.uptime != null)
  const averageUptime = allUptime.length > 0 ? (allUptime.reduce((sum, chain) => sum + chain.uptime, 0) / allUptime.length) : null

  const allRanked = validators.filter(chain => chain.rank != null)
  const averageRank = allRanked.length > 0 ? allRanked.reduce((sum, chain) => sum + chain.rank, 0) / allRanked.length : null

  const image = validators.find(el => el.image)?.image

  return {
    ...data,
    moniker: data.name,
    image,
    validators,
    activeChains,
    chainCount,
    totalSlashes,
    averageUptime,
    averageRank,
  }
}