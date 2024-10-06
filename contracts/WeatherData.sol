// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;


contract WeatherData {
    address public owner;
    mapping(uint256=> mapping(uint256=>bool)) rainStatus;

    modifier onlyOwner {
        require(owner == msg.sender, "Not the owner");
        _;
    }

    event OwnerChanged(address oldOwner, address newOwner);

    constructor(){
        owner = msg.sender;
    }

    function updateOwner(address _newOwner) public onlyOwner {
        emit OwnerChanged(owner, _newOwner);
        owner = _newOwner;
    }

    function loadData(uint256 _latitude, uint256 _longitude, bool isRained) public onlyOwner{
        rainStatus[_latitude][_longitude] = isRained;
    }

    function getRainStatus(uint256 _latitude, uint256 _longitude) public view returns(bool) {
        return rainStatus[_latitude][_longitude];
    }
}