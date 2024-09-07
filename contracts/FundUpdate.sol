// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Fund is Ownable {
    uint256 public minUsdSignUp;
    uint256 firstId;
    address[] public listMember;
    AggregatorV3Interface internal dataFeed;

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

    mapping(uint256 => mapping(address => uint256)) public contributions;
    mapping(uint256 => FundRaiser) public fundRaisers;
    mapping(address => Member) public members;
    uint256[] public fundRaiserIds;

    // Events
    event FundRaiserCreated(
        uint256 indexed fundRaiserId,
        address indexed host,
        string nameFund,
        string reason,
        uint256 goalAmount,
        uint256 endTime
    );
    event MinUsdSignUpChanged(
        uint256 oldAmount,
        uint256 newAmount
    );
    event FundRaiserEnded(
        uint256 indexed fundRaiserId,
        bool goalMet
    );
    event FundWithdrawal(
        uint256 indexed fundRaiserId,
        address indexed contributor,
        uint256 amount
    );

    // Constructor
    constructor(uint256 _minUsdSignUp, address _priceFeed) Ownable() {
        minUsdSignUp = _minUsdSignUp;
        firstId = 1;
        dataFeed = AggregatorV3Interface(_priceFeed);
        transferOwnership(msg.sender);
    }

    function getLatestPrice() public view returns (uint256) {
        (, int256 price,,,) = dataFeed.latestRoundData();
        return uint256(price * 1e10); // Chuyển đổi 8 decimals thành 18 decimals
    }

    function getUsdValue(uint256 ethAmount) public view returns (uint256) {
        uint256 ethPrice = getLatestPrice();
        return (ethAmount * ethPrice) / 1e18;
    }

    function getEthAmount(uint256 usdAmount) public view returns (uint256) {
        uint256 ethPrice = getLatestPrice();
        return (usdAmount * 1e18) / ethPrice;
    }

    function signUp(uint256 _age, string memory _name) public payable {
        uint256 usdValue = getUsdValue(msg.value);
        require(usdValue >= minUsdSignUp, "Insufficient funds for sign up!");
        members[msg.sender] = Member(firstId, _age, _name, 0);
        listMember.push(msg.sender);
        firstId++;
    }

    function getListMember() public view returns (address[] memory) {
        return listMember;
    }

    function hostFund(string memory _nameFund, string memory _reason, uint256 _goalAmountUsd, uint256 _durationInMinutes) public {
        require(members[msg.sender].id != 0, "You must be a registered member to host a fund!");
        require(members[msg.sender].hosted <= 3, "You have exceeded the maximum number of hosts");
        require(_goalAmountUsd > 0, "Goal amount must be greater than zero");
        require(_durationInMinutes > 0, "Duration must be greater than zero");

        uint256 fundRaiserId = fundRaiserIds.length;
        uint256 endTime = block.timestamp + (_durationInMinutes * 1 minutes);

        fundRaisers[fundRaiserId] = FundRaiser({
            host: msg.sender,
            nameFund: _nameFund,
            reason: _reason,
            goalAmount: _goalAmountUsd,
            endTime: endTime,
            raisedAmount: 0,
            isActive: true
        });

        fundRaiserIds.push(fundRaiserId);
        members[msg.sender].hosted++;

        emit FundRaiserCreated(fundRaiserId, msg.sender, _nameFund, _reason, _goalAmountUsd, endTime);
    }

    function getContribution(uint256 _fundRaiserId, address _member) public view returns (uint256) {
        return contributions[_fundRaiserId][_member];
    }

    function updateFundRaiserStatus(uint256 _fundRaiserId) public {
        FundRaiser storage fundRaiser = fundRaisers[_fundRaiserId];
        if (block.timestamp > fundRaiser.endTime) {
            if (getUsdValue(fundRaiser.raisedAmount) >= fundRaiser.goalAmount) {
                // Goal met, send funds to host
                payable(fundRaiser.host).transfer(fundRaiser.raisedAmount);
                emit FundRaiserEnded(_fundRaiserId, true);
            } else {
                // Goal not met, refund contributors
                uint256 totalContributors = listMember.length;
                for (uint256 i = 0; i < totalContributors; i++) {
                    address contributor = listMember[i];
                    uint256 contributionAmount = contributions[_fundRaiserId][contributor];
                    if (contributionAmount > 0) {
                        payable(contributor).transfer(contributionAmount);
                        contributions[_fundRaiserId][contributor] = 0;
                    }
                }
                emit FundRaiserEnded(_fundRaiserId, false);
            }
            fundRaiser.isActive = false;
        }
    }

    function contribute(uint256 _fundRaiserId) public payable {
        require(members[msg.sender].id != 0, "You must be a registered member to contribute!");
        updateFundRaiserStatus(_fundRaiserId);
        require(fundRaisers[_fundRaiserId].isActive, "Fundraiser is not active");
        require(msg.value > 0, "Contribution must be greater than zero");

        FundRaiser storage fundRaiser = fundRaisers[_fundRaiserId];
        contributions[_fundRaiserId][msg.sender] += msg.value;
        fundRaiser.raisedAmount += msg.value;
    }

    function withdrawFund(uint256 _fundRaiserId, uint256 _amount) public {
        require(members[msg.sender].id != 0, "You must be a registered member to withdraw!");
        require(fundRaisers[_fundRaiserId].isActive, "Fundraiser is not active");
        require(block.timestamp <= fundRaisers[_fundRaiserId].endTime, "Fundraiser has ended");
        uint256 contributedAmount = contributions[_fundRaiserId][msg.sender];
        require(_amount > 0 && _amount <= contributedAmount, "Invalid withdrawal amount");

        contributions[_fundRaiserId][msg.sender] -= _amount;
        payable(msg.sender).transfer(_amount);

        emit FundWithdrawal(_fundRaiserId, msg.sender, _amount);
    }

    function changeMinUsdSignUp(uint256 _newAmount) public onlyOwner {
        uint256 oldAmount = minUsdSignUp;
        minUsdSignUp = _newAmount;
        emit MinUsdSignUpChanged(oldAmount, _newAmount);
    }
}
