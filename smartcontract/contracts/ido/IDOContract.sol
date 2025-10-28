// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

/**
 * @title LaunchStream IDO Contract
 * @dev Individual IDO contract for token sales on LaunchStream platform
 */
contract IDOContract {
    enum SaleState { Upcoming, Active, Completed, Cancelled, Failed }
    
    address public token;
    address public creator;
    address public treasury;
    
    uint256 public rate; // Tokens per ETH
    uint256 public softCap;
    uint256 public hardCap;
    uint256 public minBuy;
    uint256 public maxBuy;
    uint256 public startTime;
    uint256 public endTime;
    
    uint256 public raisedAmount;
    uint256 public soldTokens;
    SaleState public saleState;
    
    mapping(address => uint256) public contributions;
    mapping(address => uint256) public tokensPurchased;
    mapping(address => bool) public claimed;
    mapping(address => bool) public refunded;
    
    address[] public contributors;
    
    event Contribution(address indexed buyer, uint256 amount, uint256 tokens);
    event TokensClaimed(address indexed buyer, uint256 tokens);
    event Refund(address indexed buyer, uint256 amount);
    event SaleFinalized(bool successful, uint256 totalRaised);
    event SaleStateChanged(SaleState newState);
    
    modifier onlyCreator() {
        require(msg.sender == creator, "Only creator can call this");
        _;
    }
    
    modifier onlyActive() {
        require(isActive(), "Sale is not active");
        _;
    }
    
    modifier onlyAfterSale() {
        require(block.timestamp > endTime || raisedAmount >= hardCap, "Sale is still ongoing");
        _;
    }
    
    constructor(
        address _token,
        uint256 _rate,
        uint256 _softCap,
        uint256 _hardCap,
        uint256 _minBuy,
        uint256 _maxBuy,
        uint256 _startTime,
        uint256 _endTime,
        address _treasury
    ) {
        require(_token != address(0), "Invalid token address");
        require(_rate > 0, "Rate must be greater than 0");
        require(_softCap > 0 && _hardCap > _softCap, "Invalid caps");
        require(_startTime >= block.timestamp, "Invalid start time");
        require(_endTime > _startTime, "Invalid end time");
        require(_treasury != address(0), "Invalid treasury address");
        
        token = _token;
        creator = msg.sender;
        treasury = _treasury;
        rate = _rate;
        softCap = _softCap;
        hardCap = _hardCap;
        minBuy = _minBuy;
        maxBuy = _maxBuy;
        startTime = _startTime;
        endTime = _endTime;
        saleState = SaleState.Upcoming;
    }
    
    /**
     * @dev Contribute ETH to the IDO
     */
    function contribute() external payable onlyActive {
        require(msg.value >= minBuy, "Below minimum buy");
        require(contributions[msg.sender] + msg.value <= maxBuy, "Exceeds maximum buy");
        require(raisedAmount + msg.value <= hardCap, "Exceeds hard cap");
        
        uint256 tokens = (msg.value * rate) / 1 ether;
        
        if (contributions[msg.sender] == 0) {
            contributors.push(msg.sender);
        }
        
        contributions[msg.sender] += msg.value;
        tokensPurchased[msg.sender] += tokens;
        raisedAmount += msg.value;
        soldTokens += tokens;
        
        emit Contribution(msg.sender, msg.value, tokens);
        
        // Check if hard cap reached
        if (raisedAmount >= hardCap) {
            _updateSaleState(SaleState.Completed);
        }
    }
    
    /**
     * @dev Claim purchased tokens (after successful sale)
     */
    function claimTokens() external onlyAfterSale {
        require(!claimed[msg.sender], "Already claimed");
        require(raisedAmount >= softCap, "Sale failed - use refund instead");
        require(tokensPurchased[msg.sender] > 0, "No tokens to claim");
        
        uint256 tokens = tokensPurchased[msg.sender];
        claimed[msg.sender] = true;
        
        require(IERC20(token).transfer(msg.sender, tokens), "Token transfer failed");
        
        emit TokensClaimed(msg.sender, tokens);
    }
    
    /**
     * @dev Claim refund (if sale failed)
     */
    function claimRefund() external onlyAfterSale {
        require(!refunded[msg.sender], "Already refunded");
        require(raisedAmount < softCap, "Sale was successful - use claim instead");
        require(contributions[msg.sender] > 0, "No contribution to refund");
        
        uint256 amount = contributions[msg.sender];
        refunded[msg.sender] = true;
        
        payable(msg.sender).transfer(amount);
        
        emit Refund(msg.sender, amount);
    }
    
    /**
     * @dev Finalize the sale (creator only)
     */
    function finalizeSale() external onlyCreator onlyAfterSale {
        require(saleState != SaleState.Completed && saleState != SaleState.Failed, "Already finalized");
        
        if (raisedAmount >= softCap) {
            _updateSaleState(SaleState.Completed);
            
            // Transfer raised funds to creator (minus treasury fee)
            uint256 treasuryFee = (raisedAmount * 25) / 1000; // 2.5% fee
            uint256 creatorAmount = raisedAmount - treasuryFee;
            
            payable(treasury).transfer(treasuryFee);
            payable(creator).transfer(creatorAmount);
        } else {
            _updateSaleState(SaleState.Failed);
        }
        
        emit SaleFinalized(raisedAmount >= softCap, raisedAmount);
    }
    
    /**
     * @dev Check if sale is currently active
     */
    function isActive() public view returns (bool) {
        return block.timestamp >= startTime && 
               block.timestamp <= endTime && 
               raisedAmount < hardCap &&
               saleState == SaleState.Active;
    }
    
    /**
     * @dev Get number of contributors
     */
    function getContributorCount() external view returns (uint256) {
        return contributors.length;
    }
    
    /**
     * @dev Emergency functions (creator only)
     */
    function emergencyWithdrawTokens() external onlyCreator {
        require(saleState == SaleState.Failed || saleState == SaleState.Cancelled, "Invalid state");
        uint256 balance = IERC20(token).balanceOf(address(this));
        require(IERC20(token).transfer(creator, balance), "Transfer failed");
    }
    
    function cancelSale() external onlyCreator {
        require(saleState == SaleState.Upcoming, "Can only cancel upcoming sales");
        _updateSaleState(SaleState.Cancelled);
    }
    
    /**
     * @dev Internal function to update sale state
     */
    function _updateSaleState(SaleState _newState) internal {
        saleState = _newState;
        emit SaleStateChanged(_newState);
    }
    
    /**
     * @dev Activate sale (automatic when start time reached)
     */
    function activateSale() external {
        require(block.timestamp >= startTime, "Start time not reached");
        require(saleState == SaleState.Upcoming, "Sale not in upcoming state");
        _updateSaleState(SaleState.Active);
    }
}
