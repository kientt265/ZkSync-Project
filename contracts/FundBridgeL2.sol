// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@matterlabs/zksync-contracts/l2/system-contracts/interfaces/IL1Messenger.sol";
import "./FundCoreL2.sol";

contract FundBridgeL2 {
    FundCoreL2 public fundCoreL2;
    address public l1Source;
    IL1Messenger public l1Messenger;

    constructor(address _fundCoreL2, address _l1Source, address _l1Messenger) {
        fundCoreL2 = FundCoreL2(_fundCoreL2);
        l1Source = _l1Source;
        l1Messenger = IL1Messenger(_l1Messenger);
    }

    function syncFundRaiserData(uint256 _fundRaiserId, address _host, string memory _nameFund, string memory _reason, uint256 _goalAmount, uint256 _endTime, uint256 _raisedAmount, bool _isActive) external {
        require(msg.sender == l1Source, "Only L1 source can call this");

        bytes memory message = abi.encode(_fundRaiserId, _host, _nameFund, _reason, _goalAmount, _endTime, _raisedAmount, _isActive);
        l1Messenger.sendToL1(message);
    }

    function processL1Message(uint256 _fundRaiserId, bool _isActive) external {
        require(msg.sender == l1Source, "Only L1 source can call this");
        // Update local state
        fundCoreL2.setFundRaiserStatus(_fundRaiserId, _isActive);
        // Send message back to L1 if needed
        bytes memory message = abi.encode(_fundRaiserId, _isActive);
        l1Messenger.sendToL1(message);
    }
}
