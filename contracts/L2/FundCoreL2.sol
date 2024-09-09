// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@matterlabs/zksync-contracts/l2/system-contracts/interfaces/IL1Messenger.sol";

contract FundCoreL2 is Ownable {
    address public l1Source;
    IL1Messenger public l1Messenger;

    constructor(address _l1Source, address _l1Messenger) {
        require(_l1Source != address(0), "L1 source address cannot be zero");
        require(_l1Messenger != address(0), "L1 messenger address cannot be zero");
        l1Source = _l1Source;
        l1Messenger = IL1Messenger(_l1Messenger);
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

    event FundRaiserStatusUpdated(uint256 indexed fundRaiserId, bool isActive);

    function contribute(uint256 _fundRaiserId) public payable {
        require(fundRaiserStatus[_fundRaiserId], "Fundraiser is not active");
        require(msg.value > 0, "Contribution must be greater than zero");

        contributions[_fundRaiserId][msg.sender] += msg.value;

        emit ContributionMade(_fundRaiserId, msg.sender, msg.value);
    }

    function withdrawFund(uint256 _fundRaiserId, uint256 _amount) public {
        require(fundRaiserStatus[_fundRaiserId], "Fundraiser is not active");
        require(_amount > 0 && _amount <= contributions[_fundRaiserId][msg.sender], "Invalid withdrawal amount");

        contributions[_fundRaiserId][msg.sender] -= _amount;
        payable(msg.sender).transfer(_amount);

        emit FundWithdrawal(_fundRaiserId, msg.sender, _amount);
    }

    function setFundRaiserStatus(uint256 _fundRaiserId, bool _isActive) external onlyOwner {
        require(fundRaiserStatus[_fundRaiserId] != _isActive, "Status is already set to the requested value");
        fundRaiserStatus[_fundRaiserId] = _isActive;
        emit FundRaiserStatusUpdated(_fundRaiserId, _isActive);
    }

    function processL1Message(uint256 _fundRaiserId, bool _isActive) external {
        require(msg.sender == l1Source, "Only L1 source can call this");
        fundRaiserStatus[_fundRaiserId] = _isActive;
        emit FundRaiserStatusUpdated(_fundRaiserId, _isActive);
    }

    function sendMessageToL1(uint256 _fundRaiserId, address _host, string memory _nameFund, string memory _reason, uint256 _goalAmount, uint256 _endTime, uint256 _raisedAmount, bool _isActive) external onlyOwner {
        bytes memory message = abi.encode(_fundRaiserId, _host, _nameFund, _reason, _goalAmount, _endTime, _raisedAmount, _isActive);
        l1Messenger.sendToL1(message);
    }

    function updateFundRaiserFromL1(uint256 _fundRaiserId, bool _isActive) external {
        require(msg.sender == l1Source, "Only L1 source can call this");
        fundRaiserStatus[_fundRaiserId] = _isActive;
        emit FundRaiserStatusUpdated(_fundRaiserId, _isActive);
    }
}
