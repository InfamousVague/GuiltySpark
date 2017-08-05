const {
    convertTo,
    base
} = require('../configs/general')

const convert = function(price, to) {
    return (price * (1 / to))
}

module.exports = function(markets) {
    console.log('markets', markets)
    const market = {}

    Object.keys(markets).map(coin => {
        if (coin != base) {
            const coinData = markets[coin]

            market[coin] = {
                bid: convert(
                    markets[coin].bid, 
                    markets[convertTo].bid
                ),
                ask: convert(
                    markets[coin].ask,
                    markets[convertTo].ask
                ),
                last: convert(
                    markets[coin].last,
                    markets[convertTo].last
                )
            }
        } else {
            market[base] = {
                bid: 1 / markets[convertTo].bid,
                ask: 1 / markets[convertTo].ask,
                last: 1 / markets[convertTo].last
            }
        }
    })
    return market
}