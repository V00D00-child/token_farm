const { assert } = require('chai');

const DaiToken = artifacts.require('DaiToken');
const DappToken = artifacts.require('DappToken');
const TokenFarm = artifacts.require('TokenFarm');

require('chai')
    .use(require('chai-as-promised'))
    .should();

function tokens(n) {
    return web3.utils.toWei(n, 'Ether');
}

contract('DappToken', ([owner, investor]) => {
    let dappToken, tokenFarm, daiToken;

    beforeEach(async () => {
        // Load contracts
        dappToken = await DappToken.new();
        daiToken = await DaiToken.new();
        tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address);

        // Transfeer all Dapp tokens to TokenFarm (1million) 
        await dappToken.transfer(tokenFarm.address, tokens('1000000'));
    });

    describe('Dapp Token deployment', async () => {
        it('Dapp token should have a name', async () => {
            const name = await dappToken.name();
            assert.equal(name, 'DApp Token');
        });

        it('TokenFarm contract should have 1 million DApp tokens on intial deployment', async () => {
            let balance = await dappToken.balanceOf(tokenFarm.address);
            assert.equal(balance.toString(), tokens('1000000'));
        });
    });
});