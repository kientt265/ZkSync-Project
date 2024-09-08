// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@matterlabs/zksync-contracts/l1/contracts/zksync/interfaces/IZkSync.sol";

contract FundBridgeL1 {
    IZkSync public zkSync;
    address public l2Target;

    constructor(address _zkSync, address _l2Target) {
        zkSync = IZkSync(_zkSync);
        l2Target = _l2Target;
    }

    function syncFundRaiserStatus(uint256 _fundRaiserId, bool _isActive) external {
        // Ensure only authorized contracts or addresses can call this function
        // Implement access control here

        bytes memory message = abi.encode(_fundRaiserId, _isActive);
        uint256 gasLimit = 1000000; // Adjust as needed
        uint256 gasPerPubdataByteLimit = 800; // Adjust as needed

        zkSync.requestL2Transaction(
            l2Target,
            0, // value
            message,
            gasLimit,
            gasPerPubdataByteLimit,
            new bytes[](0), // empty factory deps
            msg.sender // refundRecipient
        );
    }
}
