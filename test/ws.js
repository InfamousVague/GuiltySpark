const WebSocket = require('ws')

const ws = new WebSocket('ws://localhost:3009')

ws.on('message', function incoming (data) {
  console.log(data)
})
