const FundCoreL2 = artifacts.require("FundCoreL2");
const FundCoreL1 = artifacts.require("FundCoreL1");

module.exports = async function (deployer, network) {
  if (network === 'zkSyncTestnet') {
    const fundCoreL1 = await FundCoreL1.deployed();
    const l1SourceAddress = fundCoreL1.address;
    const l1MessengerAddress = "0x..."; // Địa chỉ của L1Messenger trên mạng L2 zkSync

    await deployer.deploy(FundCoreL2, l1SourceAddress, l1MessengerAddress);
    console.log("FundCoreL2 deployed at:", FundCoreL2.address);
  }
};