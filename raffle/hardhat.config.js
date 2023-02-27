require("@nomicfoundation/hardhat-toolbox");
require("hardhat-gas-reporter")
require("solidity-coverage")
require("./tasks/block-number")
require("hardhat-deploy")
require("@nomiclabs/hardhat-etherscan")
require("dotenv").config()

const GOERLI_API_KEY = process.env.GOERLI_API_KEY
const GOERLI_PRIVATE_KEY = process.env.GOERLI_PRIVATE_KEY
const COIN_MARKET_CAP = process.env.COIN_MARKET_CAP
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/${GOERLI_API_KEY}`,
      accounts: [ GOERLI_PRIVATE_KEY ],
      chainId: 5,
    },
    localhost: {
      url: "http://localhost:8545",
      chainId: 1337
    }
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enabled: false,
    outputFile: "gas-report.txt",
    noColors: true,
    currency: "USD",
    coinmarketcap: COIN_MARKET_CAP
  },
  namedAccounts: {
    deployer: {
      default: 0,
      1: 0
    },
    user: {
      default: 1
    }
  }
};
