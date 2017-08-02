const fs = require('fs')
const solc = require('solc')

module.exports = function() {
  const input = fs.readFileSync('./contracts/FairOracle.sol')
  const output = solc.compile(input.toString(), 1)
  const bytecode = output.contracts[':FairOracle'].bytecode
  const abi = JSON.parse(output.contracts[':FairOracle'].interface)
  
  return abi
}