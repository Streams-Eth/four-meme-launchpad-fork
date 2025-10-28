// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

/**
 * @title Fixed LST Presale V2 
 * @dev CORRECTED presale contract with proper LST token address and investor-friendly pricing
 * @notice THIS CONTRACT FIXES: Wrong token address + overpriced tokens
 */
contract FixedLSTPresaleV2 {
    // CORRECT LST TOKEN ADDRESS (where the 3M tokens actually are)
   IERC20 public constant lstToken = IERC20(0xcCF93923DA72dc91F393e6bBbbEBfcc7c1ADbDA7);
    
    // INVESTOR-FRIENDLY PRICING: 0.0001 ETH per token (100x cheaper!)
    uint256 public constant PRICE = 0.0001 ether;                  // 0.0001 ETH per token
    uint256 public constant MAX_TOKENS = 3_000_000 * 1e18;         // 3M tokens with 18 decimals
    uint256 public constant PLATFORM_FEE = 250;                    // 2.5% platform fee (250 basis points)
    uint256 public constant BASIS_POINTS = 10000;                  // 100% = 10000 basis points
    
    uint256 public totalRaised;
    uint256 public totalFeeCollected;
    address public owner;
    address public treasury;
    bool public paused;
    
    mapping(address => uint256) public userPurchases;
    
    event TokensPurchased(address indexed buyer, uint256 ethAmount, uint256 tokenAmount, uint256 platformFee);
    event PlatformFeeCollected(address indexed treasury, uint256 feeAmount);
    event PresalePaused(bool paused);
    event TreasuryUpdated(address indexed newTreasury);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    constructor(address _treasury) {
        owner = msg.sender;
        treasury = _treasury;
    }
    
    /**
     * @dev Buy LST tokens with automatic fee distribution - FIXED VERSION
     * @notice NOW WORKS: Correct token address + affordable pricing
     */
    function buyTokens() external payable {
        require(!paused, "Presale paused");
        require(msg.value >= PRICE, "Below minimum purchase");
        require(treasury != address(0), "Treasury not set");
        
        // Calculate platform fee (2.5%)
        uint256 platformFee = (msg.value * PLATFORM_FEE) / BASIS_POINTS;
        uint256 creatorAmount = msg.value - platformFee;
        
        // FIXED TOKEN CALCULATION: Proper token amount with 18 decimals
        uint256 tokenAmount = (msg.value * 1e18) / PRICE;
        
        require(lstToken.balanceOf(address(this)) >= tokenAmount, "Insufficient tokens");
        require(lstToken.transfer(msg.sender, tokenAmount), "Token transfer failed");
        
        // Update state
        totalRaised += msg.value;
        totalFeeCollected += platformFee;
        userPurchases[msg.sender] += msg.value;
        
        // Distribute payments: 97.5% to owner, 2.5% to platform treasury
        if (platformFee > 0) {
            payable(treasury).transfer(platformFee);
            emit PlatformFeeCollected(treasury, platformFee);
        }
        
        if (creatorAmount > 0) {
            payable(owner).transfer(creatorAmount);
        }
        
        emit TokensPurchased(msg.sender, msg.value, tokenAmount, platformFee);
    }
    
    /**
     * @dev Get fee breakdown for a purchase amount
     */
    function getFeeBreakdown(uint256 ethAmount) external pure returns (
        uint256 platformFee,
        uint256 creatorAmount,
        uint256 tokenAmount
    ) {
        platformFee = (ethAmount * PLATFORM_FEE) / BASIS_POINTS;
        creatorAmount = ethAmount - platformFee;
        tokenAmount = (ethAmount * 1e18) / PRICE;
    }
    
    function tokensRemaining() external view returns (uint256) {
        return lstToken.balanceOf(address(this));
    }
    
    function platformFeeBPS() external pure returns (uint256) {
        return PLATFORM_FEE;
    }
    
    function totalFeesCollected() external view returns (uint256) {
        return totalFeeCollected;
    }
    
    // Owner functions
    function setPauseState(bool _paused) external onlyOwner {
        paused = _paused;
        emit PresalePaused(_paused);
    }
    
    function setTreasury(address _treasury) external onlyOwner {
        require(_treasury != address(0), "Invalid treasury address");
        treasury = _treasury;
        emit TreasuryUpdated(_treasury);
    }
    
    /**
     * @dev Emergency withdrawal of unsold tokens
     */
    function withdrawUnsoldTokens() external onlyOwner {
        uint256 balance = lstToken.balanceOf(address(this));
        require(balance > 0, "No tokens to withdraw");
        lstToken.transfer(owner, balance);
    }
    
    /**
     * @dev Emergency ETH withdrawal (should rarely be needed due to auto-distribution)
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        if (balance > 0) {
            payable(owner).transfer(balance);
        }
    }
    
    /**
     * @dev Get detailed sale statistics
     */
    function getSaleStats() external view returns (
        uint256 _totalRaised,
        uint256 _totalFees,
        uint256 _tokensRemaining,
        uint256 _tokensSold,
        bool _isActive
    ) {
        _totalRaised = totalRaised;
        _totalFees = totalFeeCollected;
        _tokensRemaining = lstToken.balanceOf(address(this));
        _tokensSold = (totalRaised * 1e18) / PRICE;
        _isActive = !paused && _tokensRemaining > 0;
    }
}
