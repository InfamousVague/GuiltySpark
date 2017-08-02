module.exports = function(markets) {
    const coins = {}

    markets.map((coin, i) => {
        coins[Object.keys(coin)[0]] = {
            bid: Object.keys(
                coin[Object.keys(coin)[0]]
            ).map(exchange => parseFloat(
                coin[Object.keys(coin)[0]][exchange].bid)
            ),
            ask: Object.keys(
                coin[Object.keys(coin)[0]]
            ).map(exchange => parseFloat(
                coin[Object.keys(coin)[0]][exchange].ask)
            ),
            last: Object.keys(
                coin[Object.keys(coin)[0]]
            ).map(exchange => parseFloat(
                coin[Object.keys(coin)[0]][exchange].last)
            )
        }
    })

    return coins
}