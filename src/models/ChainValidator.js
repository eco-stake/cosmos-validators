export default function ChainValidator(data){
  const { delegations } = data
  const totalSlashes = data.slashes?.length || 0
  const missed_block_period = data.missed_blocks_periods && data.missed_blocks_periods.slice(-1)[0] 
  const uptime = missed_block_period?.blocks && ((missed_block_period.blocks - missed_block_period.missed) / missed_block_period.blocks)
  const totalUsd = delegations?.total_usd

  return {
    ...data,
    totalUsd,
    totalSlashes,
    uptime
  }
}
