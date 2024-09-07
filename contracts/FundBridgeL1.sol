// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {FundCoreL2} from "./FundCoreL2.sol";

contract FundBridgeL1 {
    FundCoreL2 public fundCoreL2;

    constructor(address _fundCoreL2) {
        fundCoreL2 = FundCoreL2(_fundCoreL2);
    }

    function syncFundRaiserStatus(uint256 _fundRaiserId, bool _isActive) external {
        // Ensure only authorized contracts or addresses can call this function
        fundCoreL2.fundRaiserStatus(_fundRaiserId) = _isActive;
    }
}
