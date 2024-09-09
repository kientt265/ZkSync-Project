const FundCoreL2 = artifacts.require("FundCoreL2");

module.exports = async function (deployer, network) {
  if (network === 'zkSyncTestnet') {
    const l1BridgeAddress = "0x75a768bBBE1e082d7Be9E390A6FCecF728B60d84"; // Địa chỉ của FundBridgeL1 trên Ethereum
    const l1MessengerAddress = "0x0000000000000000000000000000000000008008";

    console.log("Deploying FundCoreL2 with params:", l1BridgeAddress, l1MessengerAddress);
    await deployer.deploy(FundCoreL2, l1BridgeAddress, l1MessengerAddress);
    console.log("FundCoreL2 deployed at:", FundCoreL2.address);
  }
};
