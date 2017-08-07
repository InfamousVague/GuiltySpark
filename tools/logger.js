const chalk = require('chalk')
const { base, web3Settings, convertTo } = require('../configs/general')
const { version, author } = require('../package.json')
const ansi = require('ansi')
const cursor = ansi(process.stdout)
const jetty = require('jetty')

console.log(chalk.cyan(`
   ▄██████▄  ███    █▄   ▄█   ▄█           ███     ▄██   ▄      
  ███    ███ ███    ███ ███  ███       ▀█████████▄ ███   ██▄    
  ███    █▀  ███    ███ ███▌ ███          ▀███▀▀██ ███▄▄▄███    
 ▄███        ███    ███ ███▌ ███           ███   ▀ ▀▀▀▀▀▀███    
▀▀███ ████▄  ███    ███ ███▌ ███           ███     ▄██   ███    
  ███    ███ ███    ███ ███  ███           ███     ███   ███    
  ███    ███ ███    ███ ███  ███▌    ▄     ███     ███   ███    
  ████████▀  ████████▀  █▀   █████▄▄██    ▄████▀    ▀█████▀     
   ▄████████    ▄███████▄    ▄████████    ▄████████    ▄█   ▄█▄ 
  ███    ███   ███    ███   ███    ███   ███    ███   ███ ▄███▀ 
  ███    █▀    ███    ███   ███    ███   ███    ███   ███▐██▀   
  ███          ███    ███   ███    ███  ▄███▄▄▄▄██▀  ▄█████▀    
▀███████████ ▀█████████▀  ▀███████████ ▀▀███▀▀▀▀▀   ▀▀█████▄    
         ███   ███          ███    ███ ▀███████████   ███▐██▄   
   ▄█    ███   ███          ███    ███   ███    ███   ███ ▀███▄ 
 ▄████████▀   ▄████▀        ███    █▀    ███    ███   ███   ▀█▀ 
                                         ███    ███   ▀        
                                         
  Version ${version} by ${author}
   `))

module.exports = function(marketData) {
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
    chalk.grey(`---------------------------------------------------------------------------------------------`)
  )

    
  Object.keys(marketData).map((coin, i) => {
    spacing.tiger = (GuiltySparkGlobals.disabledAssets.includes(coin)) ? 'bgRed' : (spacing.tiger === 'bgBlack') ? 'white' : 'bgBlack'
    
    cursor.goto(0, i + spacing.offset).write(
      chalk[spacing.tiger](
        chalk.black(
          '                                                                                             '
        )
      )
    )

    cursor.goto(spacing.asset, i + spacing.offset).write(
      chalk[spacing.tiger](
        coin
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
          (GuiltySparkGlobals[`${coin}_support`] === 2) ? 
            'yellow' : (GuiltySparkGlobals[`${coin}_support`] === 1 && base != coin) ? 
              'red' :  (GuiltySparkGlobals[`${coin}_support`] === 3 && base != coin) ? 
                'white' : 'green'
        ](
          GuiltySparkGlobals[`${coin}_support`].toString()
        )
      )
    )

  })

  cursor.goto(0, Object.keys(marketData).length + spacing.offset + 1).write(
    chalk.yellow(
      `Base ${base}`
    )
  )

  if (convertTo) {
    cursor.goto(20, Object.keys(marketData).length + spacing.offset + 1).write(
      chalk.cyan(
        `Converted To ${convertTo}`
      )
    )
  }

  cursor.goto(0, Object.keys(marketData).length + spacing.offset + 3).write(
    chalk.green(
      'GuiltySpark API listening on http://localhost:3008/v1/'
    )
  )
  
  cursor.goto(0, Object.keys(marketData).length + spacing.offset + 4).write(
    chalk.green(
      `Connected to web3 provider ${web3Settings.provider}`
    )
  )

  cursor.goto(0, Object.keys(marketData).length + spacing.offset + 5).write(
    chalk.grey(
      `Version ${version} by ${author}\n`
    )
  )
}