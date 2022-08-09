export default function ChainValidator(data, chain){
  const { delegations } = data
  const totalSlashes = data.slashes?.length
  const blockPeriod = data.missed_blocks_periods && data.missed_blocks_periods.slice(-1)[0] 
  const uptime = blockPeriod?.blocks && ((blockPeriod.blocks - blockPeriod.missed) / blockPeriod.blocks)
  const missedBlocks = blockPeriod?.missed
  const totalTokens = delegations?.total_tokens_display
  const totalUsd = delegations?.total_usd
  const totalUsers = delegations?.total_count
  const status = data.active ? 'Active' : data.jailed ? 'Jailed' : data.active != null ? 'Inactive' : 'Unknown'

  return {
    ...data,
    chain,
    totalTokens,
    totalUsd,
    totalUsers,
    totalSlashes,
    uptime,
    missedBlocks,
    status
  }
}
