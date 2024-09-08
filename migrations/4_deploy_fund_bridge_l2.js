const FundBridgeL2 = artifacts.require("FundBridgeL2");
const FundCoreL2 = artifacts.require("FundCoreL2");
const FundCoreL1 = artifacts.require("FundCoreL1");
const FundBridgeL1 = artifacts.require("FundBridgeL1");

module.exports = async function (deployer, network) {
  if (network === 'zkSyncTestnet') {
    const fundCoreL2 = await FundCoreL2.deployed();
    const fundCoreL1 = await FundCoreL1.deployed();
    const fundBridgeL1 = await FundBridgeL1.deployed();
    const l1SourceAddress = fundBridgeL1.address;
    const l1MessengerAddress = "0x..."; // Địa chỉ của L1Messenger trên mạng L2 zkSync

    await deployer.deploy(FundBridgeL2, fundCoreL2.address, l1SourceAddress, l1MessengerAddress);
    console.log("FundBridgeL2 deployed at:", FundBridgeL2.address);

    // Cập nhật địa chỉ L2 target trong các contract L1
    await fundCoreL1.updateL2Target(FundBridgeL2.address);
    await fundBridgeL1.updateL2Target(FundBridgeL2.address);
    console.log("Updated L2 target address in L1 contracts");
  }
};