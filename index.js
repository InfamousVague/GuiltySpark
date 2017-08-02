const normalize = require('crypto-normalize')
const redis     = require('redis')
const Web3      = require('web3')
const chalk     = require('chalk')

const { 
    exchanges,
    feedInterval,
    base,
    supportedCurrencies,
    apiEnabled,
    redisEnabled,
    web3Provider,
    testRPC,
    floatPercision
} = require('./configs/general')

// Setup web3
const web3 = new Web3()
web3.setProvider(
    new web3.providers.HttpProvider(web3Provider)
)
web3.eth.defaultAccount = web3.eth.coinbase
console.log(chalk.green(`Connected to web3 with provider: ${web3Provider}`))

// Automatic contract address detection for testrpc
const contractAddress = (testRPC) ? require('./configs/contract').address : null

const getABI = require('./tools/getabi')
const FairOracleContract = web3.eth.contract(getABI())
const FairOracle = FairOracleContract.at(contractAddress)

global.publish = () => { /* noop */ }

if (apiEnabled) require('./api')

const dispatch = function(marketData) {
    logger(marketData)

    if (apiEnabled) publish(marketData)
    if (redisEnabled) {
        const client    = redis.createClient()

        client.set(
            'market',
            JSON.stringify(marketData),
            redis.print
        )
    }
    
    const solidityReady = prepForSolidity(marketData)
    console.log(solidityReady)
    console.log('update', FairOracle.updateMarket)

    FairOracle.updateMarket(
        solidityReady.assets,
        solidityReady.bids,
        solidityReady.asks,
        solidityReady.lasts,
        {
            gas: 3000000
        }, 
        function(err, tx) {
            if (err) console.log(err)
            console.log('tx', tx)
        }
    )
}

// Pretty log data to console 
const logger = require('./tools/logger')

// Removes extreme outliers
const removeOutliersGetMean = require('./tools/removeOutliersGetMean')

// Join all exchanges into array values 
const format = require('./tools/format')

// This prepares all the data into the format the solidity contract expects
const prepForSolidity = require('./tools/prepareForSolidity')

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

        dispatch(chainData)
        // TODO: push chaindata to chain
    })
}

feed()
setInterval(feed, feedInterval)