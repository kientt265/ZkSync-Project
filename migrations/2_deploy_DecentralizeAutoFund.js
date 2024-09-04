// 1_decentralize_auto_fund_migration.js
const DecentralizeAutoFund = artifacts.require("DecentralizeAutoFund");

module.exports = function (deployer) {
  // Thay đổi giá trị _minMoneySignUp phù hợp với yêu cầu của bạn
  const minMoneySignUp = web3.utils.toWei("1", "ether"); // Ví dụ, 1 ETH

  deployer.deploy(DecentralizeAutoFund, minMoneySignUp);
};
