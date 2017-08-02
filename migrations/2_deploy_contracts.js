var FairOracle = artifacts.require("./FairOracle.sol");

module.exports = function(deployer) {
  deployer.deploy(FairOracle);
};
