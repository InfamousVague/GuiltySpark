var GuiltySpark = artifacts.require("./GuiltySpark.sol");
var GuiltySparkLite = artifacts.require("./GuiltySparkLite.sol");

const { liteMode } = require('../configs/general')

module.exports = function(deployer) {
  if (liteMode) {
    deployer.deploy(GuiltySparkLite);
  } else {
    deployer.deploy(GuiltySpark);
  }
};
