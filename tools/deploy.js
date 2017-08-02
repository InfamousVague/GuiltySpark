const fs = require('fs')
const solc = require('solc')
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

const input = fs.readFileSync('./contracts/FairOracle.sol')
const output = solc.compile(input.toString(), 1)
const bytecode = output.contracts[':FairOracle'].bytecode
const abi = JSON.parse(output.contracts[':FairOracle'].interface)

const contract = web3.eth.contract(abi)

const contractInstance = contract.new({
    data: '0x' + bytecode,
    from: web3.eth.coinbase,
    gas: 900000
}, (err, res) => {
    if (err) {
        console.log(err);
        return;
    }

    // Log the tx, you can explore status with eth.getTransaction()
    console.log(res.transactionHash)

    // If we have an address property, the contract was deployed
    if (res.address) {
        console.log('Contract address: ' + res.address)
        fs.writeFileSync('./configs/contract.js', `{ address: '${res.address}' }`)
    }
})