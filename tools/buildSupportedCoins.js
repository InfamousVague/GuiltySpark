const normalize = require('crypto-normalize')
const coinMarketCap = require('./extraTickers/coinmarketcap.js')
const coinCap = require('./extraTickers/coincap.js')

const {
    supportedCurrencies,
    exchanges,
    base
} = require('../configs/general')

const validData = (value) => {
  return (
        value.bid &&
        value.ask &&
        value.last &&
        !isNaN(value.bid) &&
        !isNaN(value.ask) &&
        !isNaN(value.last)
  )
}

module.exports = function () {
  return supportedCurrencies.map(currency => {
    return new Promise((resolve, reject) => {
      // Get ticker valeus for currency on all supported exchanges
      const tickers = Promise.all([
        coinMarketCap(currency), // Inject coinMarketCap for total support
        coinCap(currency),
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
        let support = 0

        values.map((value, i) => {
          if (i === 0) {
            if (validData(value)) {
              support++
              markets['coinmarketcap.com'] = value
            }
          } else if (i === 1) {
            if (validData(value)) {
              support++
              markets['coincap.io'] = value
            }
          } else if (validData(value)) {
            support++
            markets[exchanges[i - 2]] = value
          } else {
            // console.warn('Removed non functioning datapoint.')
          }
        })

        global.GuiltySparkGlobals[`${currency}_support`] = support

        // Resolve a list of market values for givin currency
        resolve({
          [currency]: markets
        })
      })
    })
  })
}
