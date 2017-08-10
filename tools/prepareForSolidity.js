const { floatPercision } = require('../configs/general')

module.exports = function (marketData) {
  const assets = []
  const bids = []
  const asks = []
  const lasts = []

  Object.keys(marketData).map(coin => {
    if (!global.GuiltySparkGlobals.disabledAssets.includes(coin)) {
      assets.push(coin)
      bids.push(
              Math.floor(
                marketData[coin].bid * floatPercision
              )
            )
      asks.push(
              Math.floor(
                marketData[coin].ask * floatPercision
              )
            )
      lasts.push(
              Math.floor(
                marketData[coin].last * floatPercision
              )
            )
    }
  })

  return {
    assets,
    bids,
    asks,
    lasts
  }
}
