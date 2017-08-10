// This code is super ugly but makes for really nice ways to interact with the oracle

const chalk = require('chalk')
const { 
  base, 
  web3Settings, 
  convertTo, 
  whitelist,
  assetsPerPage,
  supportedCurrencies
} = require('../configs/general')

const { version, author } = require('../package.json')
const ansi = require('ansi')
const cursor = ansi(process.stdout)
const jetty = require('jetty')
const keypress = require('keypress')
keypress(process.stdin)

process.stdin.on('keypress', function (ch, key) {
 if (key && key.ctrl && key.name == 'c') {
  process.exit()
 }
})
let bound = false
let page = 1
let toRender = [
  0,
  10
]
let marketCount = 0
let pages = Math.ceil(supportedCurrencies.length / assetsPerPage) - 1
let lastMarketData = false

const logger = function(marketData) {
  lastMarketData = marketData

  cursor.write('\033c')
  cursor.reset()
  cursor.beep()

  const spacing = {
    asset : 1,
    bid   : 20,
    ask   : 40,
    last  : 60,
    points: 80,
    offset: 4,
    tiger : 'bgBlack'
  }

  cursor.goto(1, 1).write(
    chalk.cyan('Live Price Table:')
  )

  cursor.goto(spacing.asset, 2).write(
    chalk.blue('Asset')
  )

  cursor.goto(spacing.bid, 2).write(
    chalk.blue('Bid')
  )

  cursor.goto(spacing.ask, 2).write(
    chalk.blue('Ask')
  )

  cursor.goto(spacing.last, 2).write(
    chalk.blue('Last')
  )

  cursor.goto(spacing.points, 2).write(
    chalk.blue('Data Points')
  )

  cursor.goto(0, 3).write(
    chalk.grey(`-`.repeat(95))
  )

    
  Object.keys(marketData).slice(toRender[0], toRender[1]).map((coin, i) => {
    spacing.tiger = (global.GuiltySparkGlobals.disabledAssets.includes(coin)) ? 'bgRed' : (spacing.tiger === 'bgBlack') ? 'white' : 'bgBlack'
    
    cursor.goto(0, i + spacing.offset).write(
      chalk[spacing.tiger](
        chalk.black(
          ' '.repeat(95)
        )
      )
    )

    cursor.goto(spacing.asset, i + spacing.offset).write(
      chalk[spacing.tiger](
        `${coin}${(whitelist.includes(coin)) ? '*whitelisted' : ''}`
      )
    )

    cursor.goto(spacing.bid, i + spacing.offset).write(
      chalk[spacing.tiger](
        chalk.italic(
          parseFloat(marketData[coin].bid).toFixed(6).toString()
        )
      )
    )

    cursor.goto(spacing.ask, i + spacing.offset).write(
      chalk[spacing.tiger](
        chalk.italic(
          parseFloat(marketData[coin].ask).toFixed(6).toString()
        )
      )
    )

    cursor.goto(spacing.last, i + spacing.offset).write(
      chalk[spacing.tiger](
        chalk.italic(
          parseFloat(marketData[coin].last).toFixed(6).toString()
        )
      )
    )

    cursor.goto(spacing.points, i + spacing.offset).write(
      chalk[spacing.tiger](
        chalk[
          (global.GuiltySparkGlobals[`${coin}_support`] === 2) ? 
            'yellow' : (global.GuiltySparkGlobals[`${coin}_support`] === 1 && base != coin) ? 
              'red' :  (global.GuiltySparkGlobals[`${coin}_support`] === 3 && base != coin) ? 
                'white' : 'green'
        ](
          global.GuiltySparkGlobals[`${coin}_support`].toString()
        )
      )
    )

  })

  cursor.goto(0, assetsPerPage + spacing.offset).write(
    chalk.yellow(
      `Page ${page}/${pages}`
    )
  )

  cursor.goto(0, assetsPerPage + spacing.offset + 1).write(
    chalk.yellow(
      `Base ${base}`
    )
  )

  if (convertTo) {
    cursor.goto(20, assetsPerPage + spacing.offset + 1).write(
      chalk.cyan(
        `Converted To ${convertTo}`
      )
    )
  }
}

process.stdin.on('keypress', function (ch, key) {
  if (key && key.name == 'o') {
    if (page > 1) page--
  } else if (key && key.name == 'p') {
    if (page < pages) page++
  }

  toRender = [
    (page === 1) ? 0 : page * assetsPerPage,
    ((page === 1) ? 0 : page * assetsPerPage) + assetsPerPage
  ]

  if (lastMarketData) logger(lastMarketData)
})
process.stdin.setRawMode(true)
process.stdin.resume()


module.exports = logger