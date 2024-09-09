const FundBridgeL2 = artifacts.require("FundBridgeL2");
const FundCoreL2 = artifacts.require("FundCoreL2");

module.exports = async function (deployer, network) {
  if (network === 'zkSyncTestnet') {
    const fundCoreL2 = await FundCoreL2.deployed();
    const l1BridgeAddress = "0x75a768bBBE1e082d7Be9E390A6FCecF728B60d84"; // Địa chỉ của FundBridgeL1 trên Ethereum
    const l1MessengerAddress = "0x0000000000000000000000000000000000008008";

    await deployer.deploy(FundBridgeL2, fundCoreL2.address, l1BridgeAddress, l1MessengerAddress);
    console.log("FundBridgeL2 deployed at:", FundBridgeL2.address);

    // Không thể cập nhật các contract L1 từ đây
    // Bạn sẽ cần một bước riêng để cập nhật các contract L1 với địa chỉ của FundBridgeL2
  }
};