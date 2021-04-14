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

contract('DiaToken', ([owner, investor]) => {
    let daiToken;

    beforeEach(async () => {
        // Load contracts
        daiToken = await DaiToken.new();

        // Transfer 100 Mock (+18 zeros) Dai tokens to investor
        await daiToken.transfer(investor, tokens('100'), { from: owner });
    });

    describe('Mock DAI token deployment', async () => {
        it('Mock DAI Token should have a name', async () => {
            const name = await daiToken.name();
            assert.equal(name, 'Mock DAI Token');
        });

        it('Investor should have Mock DAI Token balance', async () => {
            // Check investor balance after deploying to blockchain
            let result;
            result = await daiToken.balanceOf(investor);
            assert.equal(result.toString(), tokens('100'), 'Investor Mock DAI wallet balance correct');
        });
    });
});