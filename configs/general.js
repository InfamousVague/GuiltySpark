module.exports = {
    exchanges: [
        'kraken.com',
        'poloniex.com',
        'bittrex.com',
        'shapeshift.io'
    ],
    supportedCurrencies: [
        'ETH',
        'ETC',
        'LTC',
        'XMR',
        'BTC',
        'ZEC',
        'FCT',
        'DCR',
        //'AMP',
        //'NAV',
        //'BURST',
        'VTC',
        //'RADS',
        'DGB',
        'GNT',
        'DGD',
        'BTS',
        'LSK',
        'PPC',
        'DOGE',
        'WAVES',
        'MAID',
        'STEEM',
        'DASH',
        'XRP',
        'GNO',
        'ZEC',
        'SC',
        'POT',
        'CLAM',
        'LBC',
        'NMC',
        'DGB',
        'MLN',
        'ICN',
        'REP',
        'EOS',
        'OMG'
    ],
    feedInterval: 15000, // How often to update prices (not chain prices), websockets, etc.
    base: 'BTC',
    convertTo: 'ETH',
    apiEnabled: true,
    redisEnabled: false,
    web3Settings: {
        provider: 'http://localhost:8545',
        testRPC: true,
        gasLimit: 2000000
    },
    minimumDataPoints: 1, // Anything lower will stop updating on chain prices
    liteMode: true, // Only pushes last prices to chain
    floatPercision: 1000000, // Solidity hates floats, this should be noted for anyone using the oracle
    chainPushInterval: 300000 // How often should we push price data to the chain
}