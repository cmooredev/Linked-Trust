// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract LinkedTrust {

    //emit when new trust is created
    event NewTrust(uint trustID, uint when, address creator);
    //emit when a new beneficiary is set
    event NewBeneficiary(uint trustID, address beneficiary);
    //emit when trust is funded
    event TrustFunded(uint trustID, address funder, uint amount, uint trustValue);
    //emit event upon withdrawal of funds
    event Withdrawal(uint amount, uint when, address who);

    //contract owner
    address public owner;

    //total number of trusts
    uint public totalNumberOfTrusts;

    struct TrustFunder {
        uint amount;
        uint timeFunded;
    }

    //struct to hold a new Trust
    struct Trust {

        //current trust value
        uint currentValue;

        //conditions to unlock funds
        uint unlockTime;
        uint unlockPrice;

        //mapping of funders
        mapping(address => TrustFunder) funders;

        //creator of trust
        address creator;

        //beneficiaries and percentage
        address[] beneficiaryList;
        mapping(address => bool) beneficiaries;
        mapping(address => bool) hasBeneficiaryAlreadyWithdrawn;
    }

    //mapping of trusts
    mapping(uint => Trust) public trusts;

    //set unlock: time, price, beneficiaries
    constructor() payable {
        owner = payable(msg.sender);
    }

    function createNewTrust(uint _unlockTime, uint _unlockPrice) public payable {
        require(block.timestamp < _unlockTime, "Unlock time should be in the future");
        //increment number of trusts and then use this as the index for trust mapping
        //create new instance of a trust
        Trust storage trust = trusts[totalNumberOfTrusts];
        //set all coniditions
        trust.unlockTime = _unlockTime;
        trust.unlockPrice = _unlockPrice;
        trust.creator = msg.sender;
        //emit event
        emit NewTrust(totalNumberOfTrusts, block.timestamp, msg.sender);
        //increment total number of trusts
        totalNumberOfTrusts += 1;

    }

    //add a beneficiary to the trust
    function setBeneficiary(address _beneficiary, uint _trustID) public payable {
        Trust storage trust = trusts[_trustID];
        //must be a proposed beneficiary that has been approved by both authorizedOne and authorizedTwo
        require(msg.sender == trust.creator);
        trust.beneficiaryList.push(_beneficiary);
        trust.beneficiaries[_beneficiary] = true;
        //emit event
        emit NewBeneficiary(_trustID, _beneficiary);
    }

    function getTrust(uint _trustID) public view returns (uint, uint, address, address[] memory) {
        return (trusts[_trustID].unlockTime, trusts[_trustID].unlockPrice, trusts[_trustID].creator, trusts[_trustID].beneficiaryList);
    }

    //allow anyone to fund a trust
    function fundTrust(uint _trustID) public payable {
        //grab instance of the trust
        Trust storage trust = trusts[_trustID];
        //grab instance of funder
        TrustFunder storage funder = trust.funders[msg.sender];
        //adjust current trust value
        trust.currentValue += msg.value;
        //set funders contribution and time of funding
        funder.amount = msg.value;
        funder.timeFunded = block.timestamp;
        emit TrustFunded(_trustID, msg.sender, msg.value, trust.currentValue);
    }
    //will be automated to work with chainlink
    function withdraw(uint _trustID) internal{
        Trust storage trust = trusts[_trustID];
        require(block.timestamp >= trust.unlockTime, "You can't withdraw yet");
        require(trust.beneficiaries[msg.sender], "Not a valid beneficiary");
        require(!trust.hasBeneficiaryAlreadyWithdrawn[msg.sender], "You have already withdrawn your portion of funds");

        emit Withdrawal(trust.currentValue / trust.beneficiaryList.length, block.timestamp, msg.sender);
        trust.hasBeneficiaryAlreadyWithdrawn[msg.sender] = true;
        trust.currentValue -= msg.value;
        payable(msg.sender).transfer(trust.currentValue/trust.beneficiaryList.length);
    }

    receive() external payable{}
    fallback() external payable {}
}
