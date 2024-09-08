// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "@matterlabs/zksync-contracts/l1/contracts/zksync/interfaces/IZkSync.sol";

contract FundCoreL1 is Ownable {
    IZkSync public zkSync;
    address public l2Target;

    uint256 public minMoneySignUp;
    uint256 public firstId;
    address[] public listMember;

    struct Member {
        uint256 id;
        uint256 age;
        string name;
        uint256 hosted;  
    }
    struct FundRaiser {
        address host;
        string nameFund;
        string reason;
        uint256 goalAmount;
        uint256 endTime;
        uint256 raisedAmount;
        bool isActive;
    }

    mapping(address => Member) public members;
    mapping(uint256 => FundRaiser) public fundRaisers;
    uint256[] public fundRaiserIds;

    event FundRaiserCreated(
        uint256 indexed fundRaiserId,
        address indexed host,
        string nameFund,
        string reason,
        uint256 goalAmount,
        uint256 endTime
    );

    event MinMoneySignUpChanged(
        uint256 oldAmount,
        uint256 newAmount
    );

    constructor(address _zkSync, address _l2Target) {
        zkSync = IZkSync(_zkSync);
        l2Target = _l2Target;
        minMoneySignUp = 1;
        firstId = 1;
    }

    function signUp(uint256 _age, string memory _name) public payable {
        require(msg.value >= minMoneySignUp, "Insufficient funds for sign up!");
        members[msg.sender] = Member(firstId, _age, _name, 0);
        listMember.push(msg.sender);
        firstId++;
    }

    function hostFund(string memory _nameFund, string memory _reason, uint256 _goalAmount, uint256 _durationInMinutes) public {
        require(members[msg.sender].id != 0, "You must be a registered member to host a fund!");
        require(members[msg.sender].hosted <= 3, "You have exceeded the maximum number of hosts");
        require(_goalAmount > 0, "Goal amount must be greater than zero");
        require(_durationInMinutes > 0, "Duration must be greater than zero");

        uint256 fundRaiserId = fundRaiserIds.length;
        uint256 endTime = block.timestamp + (_durationInMinutes * 1 minutes);

        fundRaisers[fundRaiserId] = FundRaiser({
            host: msg.sender,
            nameFund: _nameFund,
            reason: _reason,
            goalAmount: _goalAmount,
            endTime: endTime,
            raisedAmount: 0,
            isActive: true
        });

        fundRaiserIds.push(fundRaiserId);
        members[msg.sender].hosted++;

        emit FundRaiserCreated(fundRaiserId, msg.sender, _nameFund, _reason, _goalAmount, endTime);
    }

    function changeProportionMemberSignUp(uint256 _newAmount) public onlyOwner {
        uint256 oldAmount = minMoneySignUp;
        minMoneySignUp = _newAmount;
        emit MinMoneySignUpChanged(oldAmount, _newAmount);
    }

    function getFundRaiser(uint256 _fundRaiserId) public view returns (FundRaiser memory) {
        return fundRaisers[_fundRaiserId];
    }

    function getMember(address memberAddress) public view returns (Member memory) {
        return members[memberAddress];
    }

    function updateFundRaiser(uint256 _fundRaiserId, address _host, string memory _nameFund, string memory _reason, uint256 _goalAmount, uint256 _endTime, uint256 _raisedAmount, bool _isActive) external onlyOwner {
        fundRaisers[_fundRaiserId] = FundRaiser({
            host: _host,
            nameFund: _nameFund,
            reason: _reason,
            goalAmount: _goalAmount,
            endTime: _endTime,
            raisedAmount: _raisedAmount,
            isActive: _isActive
        });
    }

    function sendMessageToL2(uint256 _fundRaiserId, bool _isActive) external onlyOwner {
        bytes memory message = abi.encode(_fundRaiserId, _isActive);
        zkSync.requestL2Transaction(l2Target, 0, message, 1000000, 800, new bytes[](0), msg.sender);
    }

    function updateL2Target(address _newL2Target) external onlyOwner {
        l2Target = _newL2Target;
    }
}
