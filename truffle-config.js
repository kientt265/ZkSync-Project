const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();

module.exports = {
  networks: {
    sepolia: {
      provider: () => new HDWalletProvider(
        process.env.PRIVATE_KEY,
        'https://sepolia.infura.io/v3/5f441fac55ed481da6b5f67d061c5ac3'
      ),
      network_id: 11155111, // Sepolia's network ID
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      networkCheckTimeout: 1000000
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
    }
  },
  contracts_directory: './contracts/L2'
};
