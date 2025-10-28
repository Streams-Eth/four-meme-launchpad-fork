// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../tokens/ERC20Token.sol";

/**
 * @title ERC20Factory
 * @dev Factory contract to create generic ERC20 tokens with a creation fee sent to treasury.
 */
contract ERC20Factory {
    address public treasury;
    uint256 public creationFee = 0.1 ether; // Fee to create a token

    mapping(address => address[]) public tokensByCreator;
    address[] public allTokens;

    event TokenCreated(
        address indexed token,
        address indexed creator,
        address indexed owner,
        string name,
        string symbol,
        uint256 totalSupply
    );
    event FeeUpdated(uint256 newFee);
    event TreasuryUpdated(address newTreasury);

    modifier onlyTreasury() {
        require(msg.sender == treasury, "Only treasury");
        _;
    }

    constructor(address _treasury) {
        require(_treasury != address(0), "Invalid treasury");
        treasury = _treasury;
    }

    function createToken(
        string calldata name_,
        string calldata symbol_,
        uint256 totalSupply_,
        address owner_
    ) external payable returns (address) {
        require(msg.value >= creationFee, "Insufficient fee");
        require(owner_ != address(0), "Invalid owner");

        ERC20Token token = new ERC20Token(name_, symbol_, totalSupply_, owner_);
        address tokenAddr = address(token);

        tokensByCreator[msg.sender].push(tokenAddr);
        allTokens.push(tokenAddr);

        if (msg.value > 0) {
            payable(treasury).transfer(msg.value);
        }

        emit TokenCreated(tokenAddr, msg.sender, owner_, name_, symbol_, totalSupply_);
        return tokenAddr;
    }

    function getTokensByCreator(address creator) external view returns (address[] memory) {
        return tokensByCreator[creator];
    }

    function getAllTokens() external view returns (address[] memory) {
        return allTokens;
    }

    function updateCreationFee(uint256 _newFee) external onlyTreasury {
        creationFee = _newFee;
        emit FeeUpdated(_newFee);
    }

    function updateTreasury(address _newTreasury) external onlyTreasury {
        require(_newTreasury != address(0), "Invalid treasury");
        treasury = _newTreasury;
        emit TreasuryUpdated(_newTreasury);
    }
}
