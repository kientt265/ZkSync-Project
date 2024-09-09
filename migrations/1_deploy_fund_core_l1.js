const FundCoreL1 = artifacts.require("FundCoreL1");

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = async function (deployer, network) {
  if (network === 'sepolia') {
    const zkSyncAddress = "0x4e39E90746A9ee410A8Ce173C7B96D3AfEd444a5"; // Địa chỉ của zkSync contract trên Sepolia
    const dummyL2TargetAddress = "0x0000000000000000000000000000000000000000"; // Địa chỉ giả tạm thời

    await sleep(5000); // Đợi 5 giây trước khi deploy
    await deployer.deploy(FundCoreL1, zkSyncAddress, dummyL2TargetAddress);
    console.log("FundCoreL1 deployed at:", FundCoreL1.address);
  }
};