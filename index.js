const normalize = require('crypto-normalize')
const _         = require('lodash')
const stats     = require('stats-analysis')
const redis     = require('redis')
const client    = redis.createClient()

const { 
    exchanges,
    feedInterval,
    base,
    supportedCurrencies,
    apiEnabled,
    redisEnabled
} = require('./configs/general')

global.publish = () => { /* noop */ }

if (apiEnabled) require('./api')

const logger = require('./tools/logger')

const dispatch = function(marketData) {
    logger(marketData)

    if (apiEnabled) publish(marketData)
    if (redisEnabled) client.set(
        'market',
        JSON.stringify(marketData),
        redis.print
    )
}

// Removes extreme outliers
const removeOutliersGetMean = function(coins) {
    const cleansedOfOutliers = {}
    
    Object.keys(coins).map(coin => {
        cleansedOfOutliers[coin] = {
            bid: _.mean(
                stats.filterOutliers(coins[coin].bid)
            ),
            ask: _.mean(
                stats.filterOutliers(coins[coin].ask)
            ),
            last: _.mean(
                stats.filterOutliers(coins[coin].last)
            )
        }
    })
    
    dispatch(cleansedOfOutliers)
    return cleansedOfOutliers
}

// Join all exchanges into array values 
const format = function(markets) {
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

// Primary function which kicks off feeding the chain new price data
const feed = function() {
    // Ready promises for fetching market data on all currencies
    const coins = supportedCurrencies.map(currency => {
        return new Promise((resolve, reject) => {
            // Get ticker valeus for currency on all supported exchanges
            const tickers = Promise.all(
                exchanges.map(exchange => normalize.ticker(
                    currency, 
                    base, 
                    exchange
                ))
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
    const marketData = Promise.all(coins).then(markets => {
        const chainData = removeOutliersGetMean(
            format(markets)
        )
        // TODO: push chaindata to chain
    })
}

feed()
setInterval(feed, feedInterval)