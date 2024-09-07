// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {FundCoreL1} from "./FundCoreL1.sol";

contract FundCoreL2 {
    FundCoreL1 public fundCoreL1;
    
    constructor(address _fundCoreL1) {
        fundCoreL1 = FundCoreL1(_fundCoreL1);
    }

    mapping(uint256 => mapping(address => uint256)) public contributions;
    mapping(uint256 => bool) public fundRaiserStatus;

    event ContributionMade(
        uint256 indexed fundRaiserId,
        address indexed contributor,
        uint256 amount
    );

    event FundWithdrawal(
        uint256 indexed fundRaiserId,
        address indexed contributor,
        uint256 amount
    );

    function contribute(uint256 _fundRaiserId) public payable {
        // Use the getter function to retrieve Member data
        FundCoreL1.Member memory member = fundCoreL1.getMember(msg.sender);
        require(member.id != 0, "You must be a registered member to contribute!");
        
        // Use the getter function to retrieve FundRaiser data
        FundCoreL1.FundRaiser memory fundRaiser = fundCoreL1.getFundRaiser(_fundRaiserId);
        require(fundRaiser.isActive, "Fundraiser is not active");
        require(msg.value > 0, "Contribution must be greater than zero");

        contributions[_fundRaiserId][msg.sender] += msg.value;
        fundRaiserStatus[_fundRaiserId] = true;

        emit ContributionMade(_fundRaiserId, msg.sender, msg.value);
    }

    function withdrawFund(uint256 _fundRaiserId, uint256 _amount) public {
        require(fundCoreL1.getMember(msg.sender).id != 0, "You must be a registered member to withdraw!");
        
        require(fundRaiserStatus[_fundRaiserId], "Fundraiser is not active");
        require(_amount > 0 && _amount <= contributions[_fundRaiserId][msg.sender], "Invalid withdrawal amount");

        contributions[_fundRaiserId][msg.sender] -= _amount;
        payable(msg.sender).transfer(_amount);

        emit FundWithdrawal(_fundRaiserId, msg.sender, _amount);
    }
}
