const normalize = require('crypto-normalize')
const coinMarketCap = require('./extraTickers/coinmarketcap.js')

const {
    supportedCurrencies,
    exchanges,
    base
} = require('../configs/general')

module.exports = supportedCurrencies.map(currency => {
    return new Promise((resolve, reject) => {
        // Get ticker valeus for currency on all supported exchanges
        const tickers = Promise.all([
            coinMarketCap(currency), // Inject coinMarketCap for total support
            ...exchanges.map(exchange => normalize.ticker(
                currency, 
                base, 
                exchange
            ))
        ]).catch(err => {
            console.error(`Error getting ticker value for ${currency}`, err)
        })

        // Assign the market data to the appropriot exchange
        tickers.then(values => {
            const markets = {}

            values.map((value, i) => {
                if (i === 0) {
                    markets['coinmarketcap.com'] = value
                } else if (value.bid && value.ask && value.last) {
                    markets[exchanges[i - 1]] = value
                } else {
                    console.warn('Removed non functioning datapoint.')
                }
            })

            console.log('markets', markets)

            // Resolve a list of market values for givin currency
            resolve({
                [currency]: markets
            })
        })
    })
})