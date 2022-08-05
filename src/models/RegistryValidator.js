import _ from 'lodash'
import ChainValidator from "./ChainValidator"

export default function RegistryValidator(data){
  const chains = _.uniqBy(data.chains, 'name').map(el => ChainValidator(el)).sort((a, b) => (a.totalUsd || 0) < (b.totalUsd || 0) ? 1 : -1)
  const chainCount = chains.length
  const activeChains = chains.filter(el => el.active)
  const totalSlashes = chains.reduce((sum, chain) => sum + chain.totalSlashes, 0)

  const allUptime = activeChains.filter(chain => chain.uptime != null)
  const averageUptime = allUptime.length > 0 ? (allUptime.reduce((sum, chain) => sum + chain.uptime, 0) / allUptime.length) : null

  const allRanked = chains.filter(chain => chain.rank != null)
  const averageRank = allRanked.length > 0 ? allRanked.reduce((sum, chain) => sum + chain.rank, 0) / allRanked.length : null

  const image = chains.find(el => el.image)?.image

  return {
    ...data,
    image,
    chains,
    activeChains,
    chainCount,
    totalSlashes,
    averageUptime,
    averageRank
  }
}