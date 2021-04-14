const DappToken = artifacts.require('DappToken');
const DaiToken = artifacts.require('DaiToken');
const TokenFarm = artifacts.require('TokenFarm');

// Deploy smart contract to Blockchain (the first account[0] is the deployer)
module.exports = async function(deployer, network, accounts) {

    // Deploy Mock Dai Token
    await deployer.deploy(DaiToken);
    const daiToken = await DaiToken.deployed();

    // Deploy Dapp Token
    await deployer.deploy(DappToken);
    const dappToken = await DappToken.deployed();

    // Deploy TokenFarm
    await deployer.deploy(TokenFarm, dappToken.address, daiToken.address);
    const tokenFarm = await TokenFarm.deployed();

    // Transfeer all Dapp tokens to TokenFarm (1million) 
    await dappToken.transfer(tokenFarm.address, '1000000000000000000000000');

    // Transfer 100 Mock (+18 zeros) Dai tokens to investor wallet
    await daiToken.transfer(accounts[1],'100000000000000000000');
};
