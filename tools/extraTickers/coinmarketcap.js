const fetch = require('node-fetch')
const normalize = require('crypto-normalize')
const { base } = require('../../configs/general')

module.exports = function (coin) {
  const symbol = normalize.translate(coin, 'coinmarketcap.com')
  return fetch(`https://api.coinmarketcap.com/v1/ticker/${symbol}`)
        .then(res => {
          return res.json()
        }).then(json => {
          if (base !== 'USD') {
            return {
              bid: null,
              ask: null,
              last: null
            }
          } else {
            return {
              bid: json[0].price_usd,
              ask: json[0].price_usd,
              last: json[0].price_usd
            }
          }
        }).catch(e => {
          return {
            bid: null,
            ask: null,
            last: null
          }
        })
}
