import _ from 'lodash'

function Coins(props) {
  const { asset, coins, fullPrecision, inBaseDenom, hideValue, className } = props
  const { decimals, symbol, prices } = asset
  const { coingecko } = prices || {}

  let coinAmount = coins
  if(coins.amount) coinAmount = coins.amount

  function amount(coinAmount){
    if(inBaseDenom) return coinAmount

    const prec = precision(coinAmount, decimals)
    return _.round(coinAmount / Math.pow(10, decimals), prec).toLocaleString(undefined, {maximumFractionDigits: prec})
  }

  function value(coinAmount){
    return (coinAmount / Math.pow(10, decimals) * coingecko.usd).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })
  }

  if(!coinAmount){
    return null
  }

  function precision(coinAmount){
    if(fullPrecision) return decimals;
    if(coinAmount >= (1000 * Math.pow(10, decimals))) return 2
    if(coinAmount >= (100 * Math.pow(10, decimals))) return 3
    return 6
  }

  return (
    <span className={['d-inline-block m-0 coins', className].join(' ')}>
      <span>
        <span className="amount">{amount(coinAmount)}</span>&nbsp;
        <span className="denom">{symbol}</span>
      </span>
      {!!coingecko?.usd && !hideValue && !!coinAmount && (
        <>
          <br />
          <em className="text-muted">
            <span className="amount">${value(coinAmount)}</span>
          </em>
        </>
      )}
    </span>
  )
}

export default Coins;
