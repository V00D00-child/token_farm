pragma solidity ^0.5.0;

import './DappToken.sol';
import './DaiToken.sol';

contract TokenFarm {
    string public name = "DApp Token Farm";
    DappToken public dappToken;
    DaiToken public daiToken;
    address public owner;

    address[] public stakers; // list of all investor that have staked
    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked; // long term staking status
    mapping(address => bool) public isStaking; // current staking status


    constructor(DappToken _dappToken, DaiToken _daiToken) public {
        dappToken = _dappToken;
        daiToken = _daiToken;
        owner = msg.sender;
    }

    // 1. Stakes Tokens(Deposit)
    function stakeTokens(uint _amount) public {
        // Require amount greater than 0
        require(_amount > 0,"amount cannot be 0");

        // Transfer Mock Dai token to this contract for staking
        daiToken.transferFrom(msg.sender, address(this), _amount);

        // Update staking balance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        // Add user to stakers array *only* if they haven't staked already
        if(!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        // Update staking status
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    // 2. Issuing Tokens TODO: Add feature to issue token every 10 blocks
    function issueTokens() public {

        require(msg.sender == owner, "caller must be the owner");

        // Iusse tokens to all stackers
        for (uint i=0; i < stakers.length; i++) {
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient];

            if (balance > 0) {
                dappToken.transfer(recipient, balance);
            }
        }
    }

    // 3. Unstaking Tokens(Withdraw)
    function unstakeTokens() public {
        // Fetch staking balance of investor
        uint balance = stakingBalance[msg.sender];

        // Require amount is greater than 0
        require(balance > 0,"stake balance cannot be 0");

        // Transfer Mock Dai Token to this contract for staking
        daiToken.transfer(msg.sender, balance);

        // Reset staking balance
        stakingBalance[msg.sender] = 0;

        // Update staking status
        isStaking[msg.sender] = false;
    }

    // 4. Unstaking Tokens by amount(Withdraw)
    function unstakeTokensByAmount(uint _amount) public {
        // Fetch staking balance of investor
        uint balance = stakingBalance[msg.sender];

        // Require current staking balance is greater than 0
        require(balance > 0, "stake balance cannot be 0");

        uint finalBalance = balance - _amount;

        require(finalBalance >= 0, "investor amount to unstake can not be greater than current staking balance");

        // Transfer Mock Dai Token to this contract for staking
        daiToken.transfer(msg.sender, _amount);

        // Reset staking balance
        stakingBalance[msg.sender] = finalBalance;

        // Update staking status
        if (finalBalance == 0 ) {
            isStaking[msg.sender] = false;
        } else {
            isStaking[msg.sender] = true;
        }
    }

}
