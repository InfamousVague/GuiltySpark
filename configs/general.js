module.exports = {
    exchanges: [
        'kraken.com',
        //'poloniex.com',
        'bittrex.com'
    ],
    supportedCurrencies: [
        'ETH',
        'ETC',
        'LTC',
        'XMR',
        'BTC',
        'ZEC',
        'DASH',
        'XRP',
    ],
    feedInterval: 15000, // How often to update prices (not chain prices), websockets, etc.
    base: 'USD',
    apiEnabled: true,
    redisEnabled: false,
    web3Settings: {
        provider: 'http://localhost:8545',
        testRPC: true,
        gasLimit: 2000000
    },
    liteMode: true, // Only pushes last prices to chain
    floatPercision: 1000000, // Solidity hates floats, this should be noted for anyone using the oracle
    chainPushInterval: 300000 // How often should we push price data to the chain
}