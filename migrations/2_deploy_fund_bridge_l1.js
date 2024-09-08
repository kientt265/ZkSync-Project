const FundBridgeL1 = artifacts.require("FundBridgeL1");
const FundCoreL1 = artifacts.require("FundCoreL1");

module.exports = async function (deployer, network) {
  if (network === 'sepolia') {
    const fundCoreL1 = await FundCoreL1.deployed();
    const zkSyncAddress = await fundCoreL1.zkSync();
    const dummyL2TargetAddress = "0x0000000000000000000000000000000000000000"; // Địa chỉ giả tạm thời

    await deployer.deploy(FundBridgeL1, zkSyncAddress, dummyL2TargetAddress);
    console.log("FundBridgeL1 deployed at:", FundBridgeL1.address);
  }
};