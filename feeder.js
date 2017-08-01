const normalize = require('crypto-normalize')

const { 
    exchanges,
    feedInterval,
    base,
    supportedCurrencies
} = require('./config')

const feed = function() {
    // Ready promises for fetching market data on all currencies
    const coins = supportedCurrencies.map(currency => {
        return new Promise((resolve, reject) => {
            // Get ticker valeus for currency on all supported exchanges
            const tickers = Promise.all(
                exchanges.map(exchange => normalize.ticker(currency, base, exchange))
            )

            // Assign the market data to the appropriot exchange
            tickers.then(values => {
                const markets = {}

                values.map((value, i) => {
                    markets[exchanges[i]] = value
                })

                // Resolve a list of market values for givin currency
                resolve({
                    [currency]: markets
                })
            })
        })
    })

    // Finally, get all markets for all coins
    const market = Promise.all(coins).then(markets => {
        console.log('markets', markets)
    })
}

setInterval(feed, feedInterval)