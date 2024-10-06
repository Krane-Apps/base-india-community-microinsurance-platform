// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// write custom errors
// write reentrancy guard modifier

contract Insurance {
    uint256 public policyCount;
    bool isInside;

    enum ClaimStatus {
        NotFiled,
        Pending,
        Rejected,
        Approved,
        Withdrawn
    }

    address public owner;
     struct Policy {
        address policyholder;
        uint256 coverageAmount;
        uint256 premium;
        uint256 startDate;
        uint256 endDate;
        uint256 approvedAmount;
        uint256 latitude;
        uint256 longitude;
        bool active;
        bool claimed;
        bool approved;
        ClaimStatus status;
    }
    mapping(uint256 => Policy) public policies;

    modifier nonReentrant {
        require(!isInside, "Reentracy attempt!");
        isInside = true;
        _;
        isInside = false;
    }

    modifier onlyOwner {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    event PolicyCreated(uint256 indexed policyId, address policyholder, uint256 coverageAmount);
    event ClaimFiled(uint256 indexed policyId, address policyholder, uint256 claimAmount);
    event ClaimPaid(uint256 indexed policyId, address policyholder, uint256 paidAmount);
    event OwnerChanged(address oldOwner, address newOwner);


    constructor() {
        owner = msg.sender;
    }

    function updateOwner(address _newOwner) external onlyOwner {
        emit OwnerChanged(owner, _newOwner);
        owner = _newOwner;
    }

    function createpolicy(uint256 _coverageAmount, uint256 _premium, uint256 _duration, uint256 _latitude, uint256 _longitude) public payable{
        require(msg.value == _premium, "Premium amount mismatch");
        require(_duration%365 == 0, "Invalid policy duration"); // duration can only be the multiple of 365 days (1 year)

        policyCount = policyCount++;

         policies[policyCount] = Policy({
            policyholder: msg.sender,
            coverageAmount: _coverageAmount,
            premium: _premium,
            startDate: block.timestamp,
            endDate: block.timestamp + _duration,
            approvedAmount: 0,
            latitude: _latitude,
            longitude: _longitude,
            active: true,
            claimed: false,
            approved: false,
            status: ClaimStatus.NotFiled
        });

        emit PolicyCreated(policyCount, msg.sender, _coverageAmount);
    }

     function fileClaim(uint256 _policyId) external returns(bool){
        Policy storage policy = policies[_policyId];
        require(msg.sender == policy.policyholder, "Not the policyholder");
        require(policy.active, "Policy is not active");
        require(!policy.claimed, "Claim already filed");
        require(block.timestamp <= policy.endDate, "Policy has expired");

        policy.claimed = true;
        policy.active = false;
        policy.status = ClaimStatus.Pending;

        emit ClaimFiled(_policyId, msg.sender, policy.coverageAmount);
        return true;
    }

    function checkClaim(uint256 _policyId, uint256 _approvedAmount) external onlyOwner returns(ClaimStatus){
        // logic to call weatherxp or other onchain data to verify the claim
        Policy storage policy = policies[_policyId];
        policy.approved = true;
        policy.approvedAmount = _approvedAmount;
        policy.status = ClaimStatus.Approved; // or ClaimStatus.Rejected
        return policy.status;
    }


    function settleClaim(uint256 _policyId) internal nonReentrant returns(bool){
        Policy storage policy = policies[_policyId];
        require(policy.claimed, "No claim filed for this policy");
        // require(_approvedAmount <= policy.coverageAmount, "Approved amount exceeds coverage");

        policy.claimed = false;
        policy.status = ClaimStatus.Withdrawn;
        (bool sent, ) = policy.policyholder.call{value: policy.approvedAmount}("");
        require(sent, "Failed to send Ether");

        emit ClaimPaid(_policyId, policy.policyholder, policy.approvedAmount);
        return true;
    }

    function getPolicyDetails(uint256 _policyId) external view returns (Policy memory) {
        return policies[_policyId];
    }

    function withdrawFunds() external onlyOwner returns(bool){
        uint256 balance = address(this).balance;
        (bool sent, ) = owner.call{value: balance}("");
        require(sent, "Failed to send Ether");
        return true;
    }

    receive() external payable {}

    
    }