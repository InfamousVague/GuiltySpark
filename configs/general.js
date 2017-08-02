module.exports = {
    exchanges: [
        'kraken.com',
        'poloniex.com',
        'bittrex.com'
    ],
    supportedCurrencies: [
        'ETH',
        'ETC',
        'LTC',
        'XMR',
        'BTC',
        'ZEC'
    ],
    feedInterval: 15000,
    base: 'USD',
    apiEnabled: true,
    redisEnabled: false,
    web3Provider: 'http://localhost:8545',
    testRPC: true
}