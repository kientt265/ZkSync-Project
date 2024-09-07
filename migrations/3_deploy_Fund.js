const FundUpdate = artifacts.require("FundUpdate");
const MockV3Aggregator = artifacts.require("MockV3Aggregator");

module.exports = async function (deployer, network) {
  // Định nghĩa giá trị tối thiểu để đăng ký (trong USD)
  const minUsdSignUp = web3.utils.toWei("10", "ether"); // Ví dụ: 10 USD
  // Địa chỉ của Chainlink Price Feed
  let priceFeedAddress;
  // Xác định địa chỉ Price Feed dựa trên mạng
  if (network === "development" || network === "test" || network === "ganache") {
    // Đối với mạng phát triển local, triển khai một mock Price Feed
    const DECIMALS = "8";
    const INITIAL_PRICE = "200000000000"; // 2000 USD với 8 số thập phân
    await deployer.deploy(MockV3Aggregator, DECIMALS, INITIAL_PRICE);
    priceFeedAddress = MockV3Aggregator.address;
  } else if (network === "mainnet") {
    priceFeedAddress = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419"; // Mainnet ETH/USD
  } else if (network === "goerli") {
    priceFeedAddress = "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e"; // Goerli ETH/USD
  } else if (network === "sepolia") {
    priceFeedAddress = "0x694AA1769357215DE4FAC081bf1f309aDC325306"; // Sepolia ETH/USD
  } else {
    throw new Error("Unsupported network");
  }
  await deployer.deploy(FundUpdate, minUsdSignUp, priceFeedAddress);
  const fundUpdate = await FundUpdate.deployed();

  console.log("FundUpdate deployed at:", fundUpdate.address);
  console.log("Minimum USD Sign Up:", web3.utils.fromWei(minUsdSignUp, "ether"), "USD");
  console.log("Price Feed Address:", priceFeedAddress);
};