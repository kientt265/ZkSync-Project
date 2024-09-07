// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {FundCoreL1} from "./FundCoreL1.sol";

contract FundBridgeL2 {
    FundCoreL1 public fundCoreL1;

    constructor(address _fundCoreL1) {
        fundCoreL1 = FundCoreL1(_fundCoreL1);
    }

    function syncFundRaiserData(uint256 _fundRaiserId, address _host, string memory _nameFund, string memory _reason, uint256 _goalAmount, uint256 _endTime, uint256 _raisedAmount, bool _isActive) external {
        // Ensure only authorized contracts or addresses can call this function
        fundCoreL1.fundRaisers(_fundRaiserId) = FundCoreL1.FundRaiser({
            host: _host,
            nameFund: _nameFund,
            reason: _reason,
            goalAmount: _goalAmount,
            endTime: _endTime,
            raisedAmount: _raisedAmount,
            isActive: _isActive
        });
    }
}
