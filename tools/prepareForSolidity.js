module.exports = function(marketData) {
    const assets    = []
    const bids      = []
    const asks      = []
    const lasts     = []

    Object.keys(marketData).map(coin => {
        assets.push(coin)
        bids.push(marketData[coin].bid)
        asks.push(marketData[coin].ask)
        lasts.push(marketData[coin].last)
    })

    return {
        assets,
        bids,
        asks,
        lasts
    }
}