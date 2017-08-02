const _ = require('lodash')
const stats = require('stats-analysis')

module.exports = function(coins) {
    const cleansedOfOutliers = {}
    
    Object.keys(coins).map(coin => {
        cleansedOfOutliers[coin] = {
            bid: _.mean(
                stats.filterOutliers(coins[coin].bid)
            ),
            ask: _.mean(
                stats.filterOutliers(coins[coin].ask)
            ),
            last: _.mean(
                stats.filterOutliers(coins[coin].last)
            )
        }
    })
    return cleansedOfOutliers
}