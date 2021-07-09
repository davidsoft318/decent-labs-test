/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("dotenv").config();
require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-solhint');
require('solidity-coverage');
require("@nomiclabs/hardhat-etherscan");

module.exports = {
  defaultNetwork: "hardhat",
  solidity: {
    version: "0.7.6",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      gas: "auto",
      gasPrice: "auto",
      forking: {
        url: process.env.RPC_NODE_URL
        //blockNumber: 11997864,
      }
    },
  },

  mocha: {
    timeout: 2000000
  }
};
