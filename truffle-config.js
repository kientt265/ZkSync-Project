const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();

module.exports = {
  networks: {
    sepolia: {
      provider: () => new HDWalletProvider(
        process.env.PRIVATE_KEY,
        `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
      ),
      network_id: 11155111, // Sepolia's network ID
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      networkCheckTimeout: 1000000 // Thêm dòng này, đơn vị là milliseconds
    },
    zkSyncTestnet: {
      provider: () => new HDWalletProvider(process.env.PRIVATE_KEY, 'https://sepolia.era.zksync.dev'),
      network_id: 300, // Chain ID của zkSync Sepolia Testnet
      gasPrice: 500000000, // Giá gas mặc định, có thể điều chỉnh
      gas: 8000000,
      networkCheckTimeout: 10000000,
      timeoutBlocks: 500,
      skipDryRun: true,
      zksync: true,
      //ethNetwork: 'sepolia',
      //verifyURL: 'https://explorer.sepolia.era.zksync.dev/contract_verification'
    }
  },
  compilers: {
    solc: {
      version: "0.8.19",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  },
  plugins: [
    'truffle-plugin-verify'
  ],
  api_keys: {
    etherscan: process.env.ETHERSCAN_API_KEY
  }
};
