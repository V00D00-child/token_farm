# Token Farm (STAKE, UNSTAKE, EARN INTREST!!:gem: :gem::raised_hands:)
## Decentralized finance Blockchain app. This Digital Bank lets you earn intrest from depositing cryptocurrency.

## Smart Contracts
DaiToken - Mock okens that investors can depoit into bank to earn intrest.
DappToken - Mock token that is paid out to investor by the bank as intrest for staking Mock Dai tokens.
TokenFarm - This Digital Bank that allow investors to staking Mock Dai token, and in return for pay staked investors Mock Dapp Token

## Tech stack
- node v12.18.3
- MetaMask (crypto wallet) - https://metamask.io/
- truffle v5.1.39 (used to compile, test, debug and deploy smart contracts) - https://www.trufflesuite.com/docs/truffle/overview
- web3 v1.2.11 (Javascript API that interacts with a local or remote ethereum node using HTTP) - https://web3js.readthedocs.io/en/v1.3.4/
- Ganache (local development blockchain) https://www.trufflesuite.com/ganache
- ReactJS v16.8.4 (clients side app)

## Testing smart contracts
"npm run block:test"

## Set up to run locally
1. npm install
2. Install Ganache and start it up locally(this is our local blockchain network)
3. Connect MetaMask to local blockchain network
4. Run smart contract deployment script "npm run block:deploy" (note: whenever a change is made to smart contract make sure to compile by running "npm run block:compile")
5. Start React app "npm run start"
6. Go to localhost:3000/ in the browser
7. Stake, unstake and earn tokens!!

## On init deployment
After smart contracts are deployed to Blockchain, we transferr 1million Dapp tokens to the Token Farm(Digital Bank) and also transefer 100 Dai tokens to the investors wallet.

## Features
ThisDecentralized finance Blockchain app allows investors to:
  - Stake Dia tokens
  - Unstake Dia tokens
  - Earn intrests from Token Farm in the form of Dapp tokens

### Stake token
Investor can choose how many Dai token that want to stake with the Token Farm(Digital Bank)

### Earn intrest for staking tokens(TokenFarm will only issue tokens to investors that are staking)
Once smart contract have been deployed to blockchain and React app is running locally run issue token script "npm run block:issue-token".

### Unstake tokens
1. Unstake total amount: 
2. Unstake partial ammount: 




