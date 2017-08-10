const fetch = require('node-fetch')
const normalize = require('crypto-normalize')
const { base } = require('../../configs/general')

module.exports = function (coin) {
  const symbol = normalize.translate(coin, 'coincap.io')
  return fetch(`http://coincap.io/api/v2/?run=convert&from=${symbol}&to=${base}&volume=1`)
        .then(res => {
          return res.json()
        }).then(json => {
          return {
            bid: json.data,
            ask: json.data,
            last: json.data
          }
        }).catch(e => {
          return {
            bid: null,
            ask: null,
            last: null
          }
        })
}
