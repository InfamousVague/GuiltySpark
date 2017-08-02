const chalk = require('chalk')
const { base } = require('../configs/general')

module.exports = function(marketData) {
  Object.keys(marketData).map(coin => {
    console.log(`${chalk.green(coin)} - ${Math.floor(marketData[coin].last)} ${base} \n${chalk.green('----------------------')}`)

    console.log(
      chalk.blue(`Bid: ${marketData[coin].bid}`)
    )
    console.log(
      chalk.blue(`Ask: ${marketData[coin].ask}`)
    )
    console.log(
      chalk.blue(`Last: ${marketData[coin].last} \n`)
    )
  })
}