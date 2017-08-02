# fair-oracle

# Run it
`npm i && npm start`

# API

## Endpoints
There are a few endpoints you can use to fetch data without talking to the chain

### /v1/datapoints
lists supported datapoints that feed the oracle

### /v1/coins
lists all the coins supported by the oracle

## /v1/market
lists last market data from the oracle

## Websockets
A websocket layer is available on port `3009` which will dispatch market data when it's updated.

```js
const WebSocket = require('ws')
 
const ws = new WebSocket('ws://localhost:3009')
 
ws.on('message', function incoming(data) {
  console.log(data)
})
```