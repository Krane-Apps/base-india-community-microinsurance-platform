// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CropInsurance {
    uint256 public policyCount;

    bool isInside;

    enum ClaimStatus {
        // NotFiled,
        Pending,
        Rejected,
        // Approved,
        Withdrawn
    }

    struct Location {
        uint256 latitude;
        uint256 logitude;
    }

    struct WeatherCondition {
        string conditionType;
        string threshold;
        string operator;
    }

    address public owner;

    struct Policy {
        uint256 policyId;
        address policyholder;
        string basename;
        string policyName;
        Location location;
        uint256 startDate;
        uint256 endDate;
        uint256 premium;
        string premiumCurrency;
        uint256 maxCoverage;
        string coverageCurrency;
        WeatherCondition weatherCondition;
        bool isActive;
        bool isClaimed;
        uint256 createdAt;
        uint256 updatedAt;
    }

    mapping(uint256 => Policy) policies;
    mapping(address => uint256[]) allUserpolicyIds;
    // mapping(address => uint256) currentPolicy;
    mapping(address => mapping(uint256 => uint256)) totalPremiumPaid;
    mapping(address => mapping(uint256 => ClaimStatus)) policyClaimStatus;
    mapping(address => mapping(uint256 => uint256)) approvedAmount;
    mapping(address => Policy[]) policyCollection;

    modifier nonReentrant() {
        require(!isInside, "Reentracy attempt!");
        isInside = true;
        _;
        isInside = false;
    }

    modifier onlyOwner() {
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

    function createpolicy(
        string memory _basename,
        string memory _policyName,
        Location memory _location,
        WeatherCondition memory _weatherCondition,
        uint256 _premium,
        string memory _premiumCurrency,
        uint256 _maxCoverage,
        string memory _coverageCurrency,
        uint256 _startDate,
        uint256 _endDate
    ) public payable {
        require(msg.value == _premium, "Premium amount mismatch");
        require(msg.value > 0, "Premium cannot be 0");
        require( _endDate>_startDate && _startDate>=block.timestamp, "Invalid policy timstamp");

        policyCount++;

        policies[policyCount] = Policy({
            policyId: policyCount,
            policyholder: msg.sender,
            basename: _basename,
            policyName: _policyName,
            location: _location,
            startDate: _startDate,
            endDate: _endDate,
            premium: _premium,
            premiumCurrency: _premiumCurrency,
            maxCoverage: _maxCoverage,
            coverageCurrency: _coverageCurrency,
            weatherCondition: _weatherCondition,
            isActive: true,
            isClaimed: false,
            createdAt: block.timestamp,
            updatedAt: block.timestamp
        });

        // currentPolicy[msg.sender] = policyCount;
        totalPremiumPaid[msg.sender][policyCount] += _premium;
        policyClaimStatus[msg.sender][policyCount] = ClaimStatus.Pending;
        allUserpolicyIds[msg.sender].push(policyCount);
        policyCollection[msg.sender].push(policies[policyCount]);
        emit PolicyCreated(policyCount, msg.sender, _maxCoverage);
    }

    function payPremium(uint256 _policyId) public payable {
        Policy memory policy = policies[_policyId];
        require(policy.policyholder == msg.sender, "Unauthorised user");
        require(policy.policyholder != address(0), "No policy found");
        require(policy.isActive, "Policy is not active");
        require(msg.value == policy.premium, "Premium is mismatched");
        require(block.timestamp <= policy.endDate, "Policy has expired");
        totalPremiumPaid[msg.sender][_policyId] += policy.premium;
    }

    function fileClaim(uint256 _policyId, WeatherCondition memory _weatherCondition) external {
        // require(currentPolicy[msg.sender] == _policyId,"No policy found");
        Policy storage policy = policies[_policyId];
        require(policy.policyholder == msg.sender, "Unauthorised user");
        require(policy.policyholder != address(0), "No policy found");
        require(!policy.isClaimed, "Claim already filed");
        require(policy.isActive, "Policy is not active");
        require(block.timestamp <= policy.endDate, "Policy has expired");

        policy.isClaimed = true;
        policy.weatherCondition = _weatherCondition;
        // policy.active = false;
        // policy.status = ClaimStatus.Pending;
        policyClaimStatus[msg.sender][_policyId] = ClaimStatus.Pending;

        emit ClaimFiled(_policyId, msg.sender, policy.maxCoverage);
    }

    function updatePolicyClaim(uint256 _policyId, uint256 _approvedAmount) external onlyOwner {
        // require(currentPolicy[_user] == _policyId,"No policy found");
        Policy memory policy = policies[_policyId];
        require(policy.policyholder != address(0), "No policy found");
        require(policy.isActive, "Policy not active");
        require(policyClaimStatus[policy.policyholder][_policyId] == ClaimStatus.Pending, "Invalid claim status found");
        require(block.timestamp <= policy.endDate, "Policy has expired");
        address user = policy.policyholder;
        require(_approvedAmount <= policy.maxCoverage, "Invalid approved coverage");
        if (_approvedAmount == 0) {
            policyClaimStatus[user][_policyId] = ClaimStatus.Rejected;
        } else {
            policyClaimStatus[user][_policyId] = ClaimStatus.Withdrawn;
            policy.isActive = false;
            policy.isClaimed = true;
            (bool sent,) = user.call{value: _approvedAmount}("");
            require(sent, "Failed to send Ether");            
            emit ClaimPaid(_policyId, user, _approvedAmount);
    
        }
        approvedAmount[user][_policyId] = _approvedAmount;
    }

    // function withdrawClaim(uint256 _policyId) public nonReentrant {
    //     Policy storage policy = policies[_policyId];
    //     require(policy.policyholder != address(0), "No policy found");
    //     require(policy.isClaimed, "No claim filed for this policy");
    //     require(policy.policyholder == msg.sender, "Unauthorised user");
    //     // require(_approvedAmount <= policy.coverageAmount, "Approved amount exceeds coverage");
    //     require(policyClaimStatus[msg.sender][_policyId] == ClaimStatus.Approved, "Claim not in approved status");
    //     policyClaimStatus[msg.sender][_policyId] = ClaimStatus.Withdrawn;
    //     policy.isActive = false;
    //     (bool sent,) = policy.policyholder.call{value: approvedAmount[msg.sender][_policyId]}("");
    //     require(sent, "Failed to send Ether");
        
    //     emit ClaimPaid(_policyId, policy.policyholder, approvedAmount[msg.sender][_policyId]);
    // }

    // function withdrawNoClaimBonus(uint256 _policyId) public nonReentrant {
    //     Policy storage policy = policies[msg.sender][_policyId];
    //     require(policy.policyholder != address(0), "No policy found");
    //     require(!policy.isClaimed, "Policy already claimed");
    //     require(block.timestamp > policy.endDate, "Policy ongoing");
    //     require(policy.isActive, "Policy not active");
    //     uint256 bonus = (policy.premium * 12 * 20) / 100; // bonus = 20% of total premium paid
    //     policy.isActive = false;
    //     (bool sent,) = policy.policyholder.call{value: bonus}("");
    //     require(sent, "Failed to send ether");
    // }

    //// Getter functions

    function getPolicyDetail(uint256 _policyId) external view returns (Policy memory) {
        return policies[_policyId];
    }

    function getPolicyIds(address _user) public view returns(uint256[] memory) {
        return allUserpolicyIds[_user];
    }

    function checkClaimStatus(uint256 _policyId) public view returns (ClaimStatus) {
        return policyClaimStatus[msg.sender][_policyId];
    }

    function checkClaimApprovalAmount(uint256 _policyId) public view returns (uint256) {
        return approvedAmount[msg.sender][_policyId];
    }

    function getAllPolicies(address user) public view returns(Policy[] memory) {
        return policyCollection[user];
    }

    //// Ether deposit and withraw

    function withdrawFunds() external onlyOwner {
        uint256 balance = address(this).balance;
        (bool sent,) = owner.call{value: balance}("");
        require(sent, "Failed to send Ether");
    }

    receive() external payable {}
}
