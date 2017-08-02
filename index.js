const normalize = require('crypto-normalize')
const redis     = require('redis')
const Web3      = require('web3')
const chalk     = require('chalk')
const contract  = require('truffle-contract')

const { 
    exchanges,
    feedInterval,
    base,
    supportedCurrencies,
    apiEnabled,
    redisEnabled,
    floatPercision,
    web3Settings,
    chainPushInterval
} = require('./configs/general')

// Setup web3
const web3 = new Web3()
const provider = new web3.providers.HttpProvider(web3Settings.provider)
web3.setProvider(
    provider
)
console.log(
    chalk.green(`Connected to web3 with provider: ${web3Settings.provider}`)
)

// Connect to the FairOracle contract
const FairOracle = contract(
    require('./build/contracts/FairOracle.json')
)
FairOracle.setProvider(provider)
FairOracle.defaults({
    from: web3.eth.coinbase
})

global.publish = () => { /* noop */ }

if (apiEnabled) require('./api')

let lastChainPush = 0
const dispatch = function(marketData) {
    logger(marketData)

    if (apiEnabled) publish(marketData)
    if (redisEnabled) {
        const client = redis.createClient()

        client.set(
            'market',
            JSON.stringify(marketData),
            redis.print
        )
    }
    
    // Get data in arrays ready for piping to chain
    const solidityReady = prepForSolidity(marketData)
    if (Date.now() - lastChainPush > chainPushInterval) {
        lastChainPush = Date.now()
        FairOracle.deployed().then(function(instance) {
            instance.updateMarket(
                solidityReady.assets,
                solidityReady.bids,
                solidityReady.asks,
                solidityReady.lasts,
                {
                    from: web3.eth.coinbase, 
                    gas: web3Settings.gasLimit
                }
            ).then(result => {
                console.log(
                    chalk.cyan('\nUpdated on chain oracle contract.\n')
                )
            }).catch(err => {
                console.error('Error updating market', err)
            })
        })
    }
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
    const coins = require('./tools/buildSupportedCoins')

    // Finally, get all markets for all coins
    const marketData = Promise.all(coins).then(markets => {
        const chainData = removeOutliersGetMean(
            format(markets)
        )

        dispatch(chainData)
        // TODO: push chaindata to chain
    }).catch(err => {
        console.error('Error getting markets for all coins.', err)
    })
}

feed()
setInterval(feed, feedInterval)