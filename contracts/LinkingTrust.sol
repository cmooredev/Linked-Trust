// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract LinkingTrust {

    //contract owner
    address public owner;

    //total number of trusts
    uint public totalNumberOfTrusts;

    struct TrustFunder {
      uint amount;
      uint timestamp;
    }

    //struct to hold a new Trust
    struct Trust {
      //conditions to unlock funds
      uint unlockTime;
      uint unlockPrice;

      //mapping of funders
      mapping(address => TrustFunder) funders;

      //creator of trust
      address creator;

      //trust board - additional 'owners' of the trust.
      //owner must get approval from both - but can override both with single vote from owner
      address authorizedOne;
      address authorizedTwo;
      mapping(address => bool) authorizedUserApprovalStatus;

      //new beneficiary to authorize
      address proposedBeneficiary;
      mapping(address => bool) proposedBeneficiaryApproval;

      //beneficiaries and percentage
      address[] beneficiaries;
      mapping(address => uint) beneficiaryPercent;
    }

    //mapping of trusts
    mapping(uint => Trust) public trusts;

    //emit when new trust is created
    event NewTrust(uint trustID, uint when, address creator);
    //

    //emit event upon withdrawal of funds
    event Withdrawal(uint amount, uint when, address who);

    //set unlock: time, price, beneficiaries
    constructor() payable {
        owner = payable(msg.sender);
    }

    function createNewTrust(uint _unlockTime, uint _unlockPrice, address _authorizedOne, address _authorizedTwo) public payable {
        require(block.timestamp < _unlockTime, "Unlock time should be in the future");
        //increment number of trusts and then use this as the index for trust mapping
        //create new instance of a trust
        Trust storage trust = trusts[totalNumberOfTrusts];
        //set all coniditions
        trust.unlockTime = _unlockTime;
        trust.unlockPrice = _unlockPrice;
        trust.authorizedOne = _authorizedOne;
        trust.authorizedTwo = _authorizedTwo;
        trust.creator = msg.sender;
        trust.proposedBeneficiary = payable(address(0));
        emit NewTrust(totalNumberOfTrusts, block.timestamp, msg.sender);
        totalNumberOfTrusts += 1;

    }

    //add a beneficiary to the trust
    //must be a proposed beneficiary that has been approved by both authorizedOne and authorizedTwo
    function setBeneficiary(address _beneficiary, uint _trustID) public payable {
        Trust storage trust = trusts[_trustID];
        require(trust.proposedBeneficiaryApproval[_beneficiary] == true, "Must be approved beneficiary to add");
        trust.beneficiaries.push(_beneficiary);
    }

    //trust owner can propose an new beneficiary
    function proposeBeneficiary(address _beneficiary, uint _trustID) public payable {
        Trust storage trust = trusts[_trustID];
        //must be no other beneficiaries waiting for approval
        require(trust.proposedBeneficiary == payable(address(0)), "Must approve or deny current proposal");
        require(msg.sender == trust.creator, "Must be owner of trust to propose beneficiary");
        trust.proposedBeneficiary = _beneficiary;
    }

    //authorized user and either cast their approval or denial vote for the current proposedBeneficiary
    function setAuthorizedUserApprovalOrDenial(uint _trustID, bool vote) public payable {
        Trust storage trust = trusts[_trustID];
        //require voter to be either authorizedOne or authorizedTwo
        require(msg.sender == trust.authorizedOne || msg.sender == trust.authorizedTwo, "Must be an authorized user");
        //if authorized user votes 'no', erase current proposedBeneficiary
        //vote must be unanimous
        if(!vote) {
            trust.proposedBeneficiary = payable(address(0));
        } else {
            trust.authorizedUserApprovalStatus[msg.sender] = true;
        }
    }

    function getTrustBeneficiaries(uint _trustID) public view returns (address[] memory){
        return trusts[_trustID].beneficiaries;
    }

    function withdraw() public {
        //require(block.timestamp >= unlockTime, "You can't withdraw yet");
        //require(beneficiaries[msg.sender], "Not a valid beneficiary");

        emit Withdrawal(address(this).balance, block.timestamp, msg.sender);

        payable(msg.sender).transfer(address(this).balance);
    }

    receive() external payable{}
    fallback() external payable {}
}
