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

contract('TokenFarm', ([owner, investor]) => {
    let daiToken, dappToken, tokenFarm;

    beforeEach(async () => {

        // Load contracts
        daiToken = await DaiToken.new();
        dappToken = await DappToken.new();
        tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address);

        // Transfeer all Dapp tokens to TokenFarm (1million) 
        await dappToken.transfer(tokenFarm.address, tokens('1000000'));

        // Transfer 100 Mock (+18 zeros) Dai tokens to investor
        await daiToken.transfer(investor, tokens('100'), { from: owner });
    });

    describe('TokenFarm contract', async () => {

        it('Token Farm should have a name', async () => {
            const name = await tokenFarm.name();
            assert.equal(name, 'DApp Token Farm');
        });

        it('TokenFarm contract should have 1 million DApp tokens on intial deployment', async () => {
            let balance = await dappToken.balanceOf(tokenFarm.address);
            assert.equal(balance.toString(), tokens('1000000'));
        });

        it('Ensure that only owner can issue tokens', async () => {
            let result;
            result = await tokenFarm.issueTokens({ from: investor}).should.be.rejected;
        });

        it('Should allow investor to stake Dai tokens', async () => {

            let investorWalletBalance;
            let tokenFarmBalance;
            let investorStakingBalance;
            let isStaking;

            // Check investor balance before staking
            investorWalletBalance = await daiToken.balanceOf(investor);
            assert.equal(investorWalletBalance.toString(), tokens('100'), 'Investor Mock DAI wallet balance correct before staking');

            // Stake Mock DAI tokens
            await daiToken.approve(tokenFarm.address, tokens('100'), { from: investor });
            await tokenFarm.stakeTokens(tokens('100'),{ from: investor });

            // Check balance after staking
            investorWalletBalance = await daiToken.balanceOf(investor);
            assert.equal(investorWalletBalance.toString(), tokens('0'), 'Investor Mock DAI wallet balance correct after staking');

            tokenFarmBalance = await daiToken.balanceOf(tokenFarm.address);
            assert.equal(tokenFarmBalance.toString(), tokens('100'), 'Token Farm Mock DAI balance correct after staking');

            investorStakingBalance = await tokenFarm.stakingBalance(investor);
            assert.equal(investorStakingBalance.toString(), tokens('100'), 'investor staking balance correct after staking');

            isStaking = await tokenFarm.isStaking(investor);
            assert.equal(isStaking.toString(), 'true', 'investor staking staus correct after staking');
        });

        it('Should reward investors with Dapp tokens for staking mDai tokens', async () => {
            let investorReward;
            let investorWalletBalance;
            let tokenFarmBalance;
            let investorStakingBalance;
            let isStaking;

            // Check investor balance before staking
            investorWalletBalance = await daiToken.balanceOf(investor);
            assert.equal(investorWalletBalance.toString(), tokens('100'), 'Investor Mock DAI wallet balance correct before staking');

            // Stake Mock DAI tokens
            await daiToken.approve(tokenFarm.address, tokens('100'), { from: investor });
            await tokenFarm.stakeTokens(tokens('100'),{ from: investor });

            // Check balance after staking
            investorWalletBalance = await daiToken.balanceOf(investor);
            assert.equal(investorWalletBalance.toString(), tokens('0'), 'Investor Mock DAI wallet balance correct after staking');

            tokenFarmBalance = await daiToken.balanceOf(tokenFarm.address);
            assert.equal(tokenFarmBalance.toString(), tokens('100'), 'Token Farm Mock DAI balance correct after staking');

            investorStakingBalance = await tokenFarm.stakingBalance(investor);
            assert.equal(investorStakingBalance.toString(), tokens('100'), 'investor staking balance correct after staking');

            isStaking = await tokenFarm.isStaking(investor);
            assert.equal(isStaking.toString(), 'true', 'investor staking staus correct after staking');

            // Issue Tokens
            await tokenFarm.issueTokens({ from: owner});

            // Unstake tokens
            await tokenFarm.unstakeTokens({ from: investor});

            // Check balance after unstaking
            investorReward = await dappToken.balanceOf(investor);
            assert.equal(investorReward.toString(), tokens('100'), 'investor DApp token wallet balance correct after issuance');

            investorWalletBalance = await daiToken.balanceOf(investor);
            assert.equal(investorWalletBalance.toString(), tokens('100'), 'Investor Mock DAI wallet balance correct after staking');
        
            // Check investor staking staus after unstacking
            tokenFarmBalance = await daiToken.balanceOf(tokenFarm.address);
            assert.equal(tokenFarmBalance.toString(), tokens('0'), 'Token Farm Mock DAI balance correct after staking');

            investorStakingBalance = await tokenFarm.stakingBalance(investor);
            assert.equal(investorStakingBalance.toString(), tokens('0'), 'investor staking balance correct after staking');

            isStaking = await tokenFarm.isStaking(investor);
            assert.equal(isStaking.toString(), 'false', 'invest staking status correct after staking');
        });

        it('Should allow investor to unstake Dai tokens by a given ammount', async () => {

            let investorWalletBalance;
            let tokenFarmBalance;
            let investorStakingBalance;
            let isStaking;

            // Check investor balance before staking
            investorWalletBalance = await daiToken.balanceOf(investor);
            assert.equal(investorWalletBalance.toString(), tokens('100'), 'Investor Mock DAI wallet balance correct before staking');

            // Stake Mock DAI tokens
            await daiToken.approve(tokenFarm.address, tokens('100'), { from: investor });
            await tokenFarm.stakeTokens(tokens('100'),{ from: investor });

            // Check balance after staking
            investorWalletBalance = await daiToken.balanceOf(investor);
            assert.equal(investorWalletBalance.toString(), tokens('0'), 'Investor Mock DAI wallet balance correct after staking');

            tokenFarmBalance = await daiToken.balanceOf(tokenFarm.address);
            assert.equal(tokenFarmBalance.toString(), tokens('100'), 'Token Farm Mock DAI balance correct after staking');

            investorStakingBalance = await tokenFarm.stakingBalance(investor);
            assert.equal(investorStakingBalance.toString(), tokens('100'), 'investor staking balance correct after staking');

            isStaking = await tokenFarm.isStaking(investor);
            assert.equal(isStaking.toString(), 'true', 'investor staking staus correct after staking');

            // Unstake tokens
            await tokenFarm.unstakeTokensByAmount(tokens('20'), { from: investor});

            // Check balance after unstaking
            investorWalletBalance = await daiToken.balanceOf(investor);
            assert.equal(investorWalletBalance.toString(), tokens('20'), 'Investor Mock DAI wallet balance correct after staking');
        
            // Check investor staking stauts after unstacking
            tokenFarmBalance = await daiToken.balanceOf(tokenFarm.address);
            assert.equal(tokenFarmBalance.toString(), tokens('80'), 'Token Farm Mock DAI balance correct after staking');

            investorStakingBalance = await tokenFarm.stakingBalance(investor);
            assert.equal(investorStakingBalance.toString(), tokens('80'), 'investor staking balance correct after staking');

            isStaking = await tokenFarm.isStaking(investor);
            assert.equal(isStaking.toString(), 'true', 'invest staking status correct after staking');
        });

        it('Should allow investor to unstake all Dai tokens by a given ammount', async () => {

            let investorWalletBalance;
            let tokenFarmBalance;
            let investorStakingBalance;
            let isStaking;

            // Check investor balance before staking
            investorWalletBalance = await daiToken.balanceOf(investor);
            assert.equal(investorWalletBalance.toString(), tokens('100'), 'Investor Mock DAI wallet balance correct before staking');

            // Stake Mock DAI tokens
            await daiToken.approve(tokenFarm.address, tokens('100'), { from: investor });
            await tokenFarm.stakeTokens(tokens('100'),{ from: investor });

            // Check balance after staking
            investorWalletBalance = await daiToken.balanceOf(investor);
            assert.equal(investorWalletBalance.toString(), tokens('0'), 'Investor Mock DAI wallet balance correct after staking');

            tokenFarmBalance = await daiToken.balanceOf(tokenFarm.address);
            assert.equal(tokenFarmBalance.toString(), tokens('100'), 'Token Farm Mock DAI balance correct after staking');

            investorStakingBalance = await tokenFarm.stakingBalance(investor);
            assert.equal(investorStakingBalance.toString(), tokens('100'), 'investor staking balance correct after staking');

            isStaking = await tokenFarm.isStaking(investor);
            assert.equal(isStaking.toString(), 'true', 'investor staking staus correct after staking');

            // Unstake tokens
            await tokenFarm.unstakeTokensByAmount(tokens('100'), { from: investor});

            // Check balance after unstaking
            investorWalletBalance = await daiToken.balanceOf(investor);
            assert.equal(investorWalletBalance.toString(), tokens('100'), 'Investor Mock DAI wallet balance correct after staking');
        
            // Check investor staking stauts after unstacking
            tokenFarmBalance = await daiToken.balanceOf(tokenFarm.address);
            assert.equal(tokenFarmBalance.toString(), tokens('0'), 'Token Farm Mock DAI balance correct after staking');

            investorStakingBalance = await tokenFarm.stakingBalance(investor);
            assert.equal(investorStakingBalance.toString(), tokens('0'), 'investor staking balance correct after staking');

            isStaking = await tokenFarm.isStaking(investor);
            assert.equal(isStaking.toString(), 'false', 'invest staking status correct after staking');
        });

        it('Should not allow investor to unstake Dai tokens if ammount is greater than currrent staking balance', async () => {

            let investorWalletBalance;
            let tokenFarmBalance;
            let investorStakingBalance;
            let isStaking;

            // Check investor balance before staking
            investorWalletBalance = await daiToken.balanceOf(investor);
            assert.equal(investorWalletBalance.toString(), tokens('100'), 'Investor Mock DAI wallet balance correct before staking');

            // Stake Mock DAI tokens
            await daiToken.approve(tokenFarm.address, tokens('100'), { from: investor });
            await tokenFarm.stakeTokens(tokens('100'),{ from: investor });

            // Check balance after staking
            investorWalletBalance = await daiToken.balanceOf(investor);
            assert.equal(investorWalletBalance.toString(), tokens('0'), 'Investor Mock DAI wallet balance correct after staking');

            tokenFarmBalance = await daiToken.balanceOf(tokenFarm.address);
            assert.equal(tokenFarmBalance.toString(), tokens('100'), 'Token Farm Mock DAI balance correct after staking');

            investorStakingBalance = await tokenFarm.stakingBalance(investor);
            assert.equal(investorStakingBalance.toString(), tokens('100'), 'investor staking balance correct after staking');

            isStaking = await tokenFarm.isStaking(investor);
            assert.equal(isStaking.toString(), 'true', 'investor staking staus correct after staking');

            // Unstake tokens
            await tokenFarm.unstakeTokensByAmount(tokens('120'), { from: investor}).should.be.rejected;

            // Check balance after unstaking
            investorWalletBalance = await daiToken.balanceOf(investor);
            assert.equal(investorWalletBalance.toString(), tokens('0'), 'Investor Mock DAI wallet balance correct after staking');
        
            // Check investor staking stauts after unstacking
            tokenFarmBalance = await daiToken.balanceOf(tokenFarm.address);
            assert.equal(tokenFarmBalance.toString(), tokens('100'), 'Token Farm Mock DAI balance correct after staking');

            investorStakingBalance = await tokenFarm.stakingBalance(investor);
            assert.equal(investorStakingBalance.toString(), tokens('100'), 'investor staking balance correct after staking');

            isStaking = await tokenFarm.isStaking(investor);
            assert.equal(isStaking.toString(), 'true', 'invest staking status correct after staking');
        });
    });
});