const _         = require('koa-route')
const Koa       = require('koa')
const app       = new Koa()
const send      = require('koa-send')
const chalk     = require('chalk')
const redis     = require('redis')
const bluebird  = require('bluebird')
const client    = redis.createClient()
const WebSocket = require('ws')

bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

const { 
    exchanges,
    feedInterval,
    base,
    supportedCurrencies
} = require('../configs/general')

const wss = new WebSocket.Server({ port: 3009 })
 
let ticker = null

// Broadcast ticker updates over WS
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data)
    }
  })
}

// Publish method comes from feeder with latest market info
global.publish = function(marketData) {
  ticker = marketData
  wss.broadcast(JSON.stringify(marketData))
}

const controllers = {
    datapoints: ctx => {
        ctx.body = exchanges
    },
    coins: ctx => {
      ctx.body = {
        base,
        supportedCurrencies
      }
    },
    market: ctx => {
      ctx.body = Object.assign({}, ticker)
    }
}

app.use(_.get('/v1/datapoints', controllers.datapoints))
    .use(_.get('/v1/coins', controllers.coins))
    .use(_.get('/v1/market', controllers.market))

app.listen(3008)
console.log(
  chalk.green(`FairOracle API is running on localhost:3008\n`)
)