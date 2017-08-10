const redis = require('redis')
const Web3 = require('web3')
const chalk = require('chalk')
const contract = require('truffle-contract')

global.GuiltySparkGlobals = {
  lastUpdate: 0,
  disabledAssets: []
} // Used for logging

const {
    feedInterval,
    apiEnabled,
    redisEnabled,
    web3Settings,
    chainPushInterval,
    liteMode
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

// Connect to the GuiltySpark contract
const GuiltySpark = (liteMode) ? contract(
    require('./build/contracts/GuiltySparkLite.json')
) : contract(
    require('./build/contracts/GuiltySpark.json')
)

GuiltySpark.setProvider(provider)
GuiltySpark.defaults({
  from: web3.eth.coinbase
})

global.publish = () => { /* noop */ }

if (apiEnabled) require('./api')

const dispatch = function (marketData) {
  logger(marketData)

  if (apiEnabled) global.publish(marketData)
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
  if (Date.now() - global.GuiltySparkGlobals.lastUpdate > chainPushInterval) {
    global.GuiltySparkGlobals.lastUpdate = Date.now()
    let chainInfo = (liteMode) ? [
      solidityReady.assets,
      solidityReady.lasts
    ] : [
      solidityReady.assets,
      solidityReady.bids,
      solidityReady.asks,
      solidityReady.lasts
    ]

    GuiltySpark.deployed().then(function (instance) {
      instance.updateMarket(
                ...chainInfo,
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

// Converts prices to another currency
const convertTo = require('./tools/convertTo')

// Primary function which kicks off feeding the chain new price data
const feed = function () {
  console.log(
        chalk.magenta(
            '📈 Aggrigating data from exchanges...'
        )
    )
    // Ready promises for fetching market data on all currencies
  const coins = require('./tools/buildSupportedCoins')()
    // Finally, get all markets for all coins
  Promise.all(coins).then(markets => {
    const chainData = removeOutliersGetMean(
            format(markets)
        )

    dispatch(
            (convertTo) ? convertTo(chainData) : chainData
        )

    setTimeout(feed, feedInterval)
  }).catch(err => {
    console.error('Error getting markets for all coins.', err)
  })
}

feed()
