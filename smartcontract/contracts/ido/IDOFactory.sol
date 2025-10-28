// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./IDOContract.sol";

/**
 * @title LaunchStream IDO Factory
 * @dev Factory contract for creating IDO campaigns on LaunchStream platform
 */
contract IDOFactory {
    address public treasury;
    uint256 public creationFee = 0.25 ether; // Fee for creating IDOs
    
    mapping(address => address[]) public idosByCreator;
    mapping(address => bool) public validIDOs;
    address[] public allIDOs;
    
    event IDOCreated(
        address indexed idoAddress,
        address indexed creator,
        address indexed token,
        uint256 softCap,
        uint256 hardCap,
        uint256 startTime,
        uint256 endTime
    );
    
    event FeeUpdated(uint256 newFee);
    event TreasuryUpdated(address newTreasury);
    
    modifier onlyTreasury() {
        require(msg.sender == treasury, "Only treasury can call this");
        _;
    }
    
    constructor(address _treasury) {
        require(_treasury != address(0), "Invalid treasury address");
        treasury = _treasury;
    }
    
    /**
     * @dev Creates a new IDO contract
     * @param _token Token contract address
     * @param _rate Tokens per ETH (with 18 decimals)
     * @param _softCap Minimum funding goal in ETH
     * @param _hardCap Maximum funding goal in ETH
     * @param _minBuy Minimum contribution in ETH
     * @param _maxBuy Maximum contribution in ETH
     * @param _startTime Sale start timestamp
     * @param _endTime Sale end timestamp
     * @return IDO contract address
     */
    function createIDO(
        address _token,
        uint256 _rate,
        uint256 _softCap,
        uint256 _hardCap,
        uint256 _minBuy,
        uint256 _maxBuy,
        uint256 _startTime,
        uint256 _endTime
    ) external payable returns (address) {
        require(msg.value >= creationFee, "Insufficient fee");
        require(_token != address(0), "Invalid token address");
        require(_rate > 0, "Rate must be greater than 0");
        require(_softCap > 0 && _hardCap > _softCap, "Invalid caps");
        require(_minBuy > 0 && _maxBuy >= _minBuy, "Invalid buy limits");
        require(_startTime >= block.timestamp, "Invalid start time");
        require(_endTime > _startTime, "Invalid end time");
        
        // Create new IDO contract
        IDOContract newIDO = new IDOContract(
            _token,
            _rate,
            _softCap,
            _hardCap,
            _minBuy,
            _maxBuy,
            _startTime,
            _endTime,
            treasury
        );
        
        address idoAddress = address(newIDO);
        
        // Update mappings
        validIDOs[idoAddress] = true;
        idosByCreator[msg.sender].push(idoAddress);
        allIDOs.push(idoAddress);
        
        // Transfer fee to treasury
        if (msg.value > 0) {
            payable(treasury).transfer(msg.value);
        }
        
        emit IDOCreated(
            idoAddress,
            msg.sender,
            _token,
            _softCap,
            _hardCap,
            _startTime,
            _endTime
        );
        
        return idoAddress;
    }
    
    /**
     * @dev Get IDOs created by a specific address
     * @param _creator Creator address
     * @return Array of IDO addresses
     */
    function getIDOsByCreator(address _creator) external view returns (address[] memory) {
        return idosByCreator[_creator];
    }
    
    /**
     * @dev Get total number of IDOs created
     */
    function getTotalIDOs() external view returns (uint256) {
        return allIDOs.length;
    }
    
    /**
     * @dev Get all IDO addresses
     */
    function getAllIDOs() external view returns (address[] memory) {
        return allIDOs;
    }
    
    /**
     * @dev Update creation fee (only treasury)
     * @param _newFee New fee amount
     */
    function updateCreationFee(uint256 _newFee) external onlyTreasury {
        creationFee = _newFee;
        emit FeeUpdated(_newFee);
    }
    
    /**
     * @dev Update treasury address (only current treasury)
     * @param _newTreasury New treasury address
     */
    function updateTreasury(address _newTreasury) external onlyTreasury {
        require(_newTreasury != address(0), "Invalid treasury address");
        treasury = _newTreasury;
        emit TreasuryUpdated(_newTreasury);
    }
    
    /**
     * @dev Check if an address is a valid IDO created by this factory
     */
    function isValidIDO(address _ido) external view returns (bool) {
        return validIDOs[_ido];
    }
}
