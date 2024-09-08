const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();

module.exports = {
  networks: {
    sepolia: {
      provider: () => new HDWalletProvider(process.env.PRIVATE_KEY, 'https://site1.moralis-nodes.com/sepolia/b27771f043504aa2b234cc8d1ff3b7d7'),
      network_id: 11155111, // Sepolia network ID
      gas: 8000000, // Increase this value
      gasPrice: 20000000000, // Set a specific gas price if needed
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    zkSyncTestnet: {
      provider: () => new HDWalletProvider(process.env.PRIVATE_KEY, 'https://site1.moralis-nodes.com/zksync-sepolia/fde5617ad1ce44a98ae39fce5eada7a9'),
      network_id: 300, // Chain ID của zkSync Sepolia Testnet
      gasPrice: 250000000, // Giá gas mặc định, có thể điều chỉnh
      gas: 6000000,
      networkCheckTimeout: 10000,
      timeoutBlocks: 200,
      skipDryRun: true,
      zksync: true,
      ethNetwork: 'sepolia',
      verifyURL: 'https://explorer.sepolia.era.zksync.dev/contract_verification'
    }
  },
  compilers: {
    solc: {
      version: "0.8.19",
    }
  },
  contracts_directory: './contracts/L2'
};
