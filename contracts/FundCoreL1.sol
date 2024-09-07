// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract FundCoreL1 is Ownable {
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

    constructor(uint256 _minMoneySignUp) Ownable() {
        minMoneySignUp = _minMoneySignUp;
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

    // Add getter function for FundRaiser struct
    function getFundRaiser(uint256 _fundRaiserId) public view returns (FundRaiser memory) {
        return fundRaisers[_fundRaiserId];
    }

    // This function should be public or external
    function getMember(address memberAddress) public view returns (Member memory) {
        // Implementation
    }
}
