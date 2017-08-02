# FairOracle

Fair oracle is an oracle 

## Use It!
Simply use 
```
npm i && npm run full
```
If you're not using a public node please also make sure TestRPC is running.

## The API

### `/v1/coins`
Returns a list of supported assets

### `/v1/datapoints` 
Returns a list of the datapoints used in aggrigation

### `/v1/market`
Get a list of the market data over HTTP

## Websockets

You can also access market data in real time via websockets. E.g.

```js
const WebSocket = require('ws')
 
const ws = new WebSocket('ws://localhost:3009')
 
ws.on('message', function incoming(data) {
  console.log(data)
})
```

## On Chain Methods

### Public
#### FairOracle.getAsset(bytes8 asset)
Returns an asset from the oracle 
```
returns (uint, uint, uint, uint) // bid, ask, last, time
```
#### FairOracle.getAssets(bytes8[] assets)
Returns a list of assets from the oracle
```
returns (bytes8[], uint[], uint[], uint[], uint) // assets, bids, asks, lasts, time
```

### Owner Only
#### FairOracle.updateMarket(bytes8[] assets, uint[] bids, uint[] asks, uint[] lasts)
Update the oracle prices

#### FairOracle.close()
Selfdestruct the oracle contract

