const normalize = require('crypto-normalize')

const { 
    supportedCurrencies,
    exchanges,
    base
} = require('../configs/general')

module.exports = supportedCurrencies.map(currency => {
    return new Promise((resolve, reject) => {
        // Get ticker valeus for currency on all supported exchanges
        const tickers = Promise.all(
            exchanges.map(exchange => normalize.ticker(
                currency, 
                base, 
                exchange
            ))
        ).catch(err => {
            console.error(`Error getting ticker value for ${currency}`, err)
        })

        // Assign the market data to the appropriot exchange
        tickers.then(values => {
            const markets = {}

            values.map((value, i) => {
                if (value.bid && value.ask && value.last) {
                    markets[exchanges[i]] = value
                } else {
                    console.warn('Removed non functioning datapoint.')
                }
            })

            // Resolve a list of market values for givin currency
            resolve({
                [currency]: markets
            })
        })
    })
})