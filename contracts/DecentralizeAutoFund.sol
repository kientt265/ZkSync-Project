// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DecentralizeAutoFund {
    uint256 public minMoneySignUp;
    uint256 public maxHostCount = 3;
    uint256 public firstId;
    uint256 public hostIdCounter;

    struct Member {
        uint256 id;
        uint256 age;
        string name;
        bool isActive;
    }

    struct HostFund {
        uint256 id;
        address host;
        uint256 amount;
        uint256 endTime;
        uint256 totalVotes;
        bool isCompleted;
    }

    mapping(address => Member) public members;
    mapping(uint256 => HostFund) public hostFunds;
    mapping(uint256 => mapping(address => bool)) private fundVotes;

    event MemberSignedUp(address indexed member, uint256 id, uint256 age, string name);
    event FundHosted(uint256 indexed hostId, address indexed host, uint256 amount, uint256 endTime);
    event Voted(address indexed member, uint256 indexed hostId, uint256 voteAmount);
    event InvestmentMade(uint256 indexed hostId, address indexed host, uint256 amount);
    event FundWithdrawn(address indexed member, uint256 amount);
    event ProportionChanged(string indexed proportionType, uint256 newValue);

    constructor(uint256 _minMoneySignUp) {
        minMoneySignUp = _minMoneySignUp;
        firstId = 0;
        hostIdCounter = 0;
    }

    modifier onlyActiveMember() {
        require(isMemberActive(msg.sender), "Caller is not an active member");
        _;
    }

    function signUp(uint256 _age, string memory _name) public payable {
        require(msg.value >= minMoneySignUp, "Insufficient funds for sign up!");
        require(!members[msg.sender].isActive, "Already signed up!");

        members[msg.sender] = Member(firstId, _age, _name, true);
        firstId++;

        emit MemberSignedUp(msg.sender, members[msg.sender].id, _age, _name);
    }

    function getListMember(address _addr) public view returns (uint256, uint256, string memory) {
        Member storage member = members[_addr];
        return (member.id, member.age, member.name);
    }

    function hostFund(uint256 _amount, uint256 _duration) public onlyActiveMember {
        require(_amount > 0, "Amount should be greater than 0.");
        require(_duration > 0, "Duration should be greater than 0.");
        require(hostFunds[hostIdCounter].endTime < block.timestamp, "Previous fund hosting not yet finished.");

        HostFund storage newFund = hostFunds[hostIdCounter];
        newFund.id = hostIdCounter;
        newFund.host = msg.sender;
        newFund.amount = _amount;
        newFund.endTime = block.timestamp + _duration;
        newFund.isCompleted = false;

        hostIdCounter++;

        emit FundHosted(newFund.id, msg.sender, _amount, newFund.endTime);
    }

    function voteFund(uint256 _hostId) public onlyActiveMember payable {
        HostFund storage fund = hostFunds[_hostId];
        require(fund.endTime > block.timestamp, "Voting period has ended.");
        require(!fundVotes[_hostId][msg.sender], "You have already voted.");
        require(msg.value > 0, "No value sent for voting.");

        fund.totalVotes += msg.value;
        fundVotes[_hostId][msg.sender] = true;

        emit Voted(msg.sender, _hostId, msg.value);
    }

    function makeInvestment(uint256 _hostId) public {
        HostFund storage fund = hostFunds[_hostId];
        require(fund.endTime <= block.timestamp, "Voting period not ended yet.");
        require(!fund.isCompleted, "Investment already made.");

        uint256 totalVotes = fund.totalVotes;
        require(totalVotes > 0, "No votes received.");
        require(totalVotes >= minMoneySignUp * 60 / 100, "Insufficient votes to accept.");

        payable(fund.host).transfer(fund.amount);
        fund.isCompleted = true;

        emit InvestmentMade(_hostId, fund.host, fund.amount);
    }

    function withdrawFund() public onlyActiveMember {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw.");

        Member storage member = members[msg.sender];
        member.isActive = false;

        payable(msg.sender).transfer(balance);

        emit FundWithdrawn(msg.sender, balance);
    }

    function changeProportionMemberSignUp(uint256 _newValue) public {
        minMoneySignUp = _newValue;
        emit ProportionChanged("MemberSignUp", _newValue);
    }

    function changeProportionAcceptFund(uint256 _newValue) public {
        // Update the acceptance proportion logic here if needed
        require(_newValue <= 100, "Percentage must be between 0 and 100");
        emit ProportionChanged("AcceptFund", _newValue);
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function isMemberActive(address member) public view returns (bool) {
        return members[member].isActive;
    }

    function getMemberCount() public view returns (uint256) {
        return firstId;
    }

    function getMembers() public view returns (address[] memory, uint256[] memory, string[] memory) {
        address[] memory memberAddresses = new address[](firstId);
        uint256[] memory ages = new uint256[](firstId);
        string[] memory names = new string[](firstId);
        uint256 count = 0;
        for (uint256 i = 0; i < firstId; i++) {
            address memberAddress = address(uint160(i));
            if (members[memberAddress].isActive) {
                memberAddresses[count] = memberAddress;
                ages[count] = members[memberAddress].age;
                names[count] = members[memberAddress].name;
                count++;
            }
        }
        return (memberAddresses, ages, names);
    }
}
