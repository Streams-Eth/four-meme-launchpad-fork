// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title LiquidityLocker
 * @dev Simple ERC20 (LP) token locker with a flat lock fee sent to the treasury.
 */
contract LiquidityLocker {
    address public treasury;
    uint256 public lockFee = 0.1 ether;

    struct LockInfo {
        address token;
        address owner;
        uint256 amount;
        uint256 unlockTime;
        bool withdrawn;
    }

    uint256 public nextLockId = 1;
    mapping(uint256 => LockInfo) public locks;
    mapping(address => uint256[]) public locksByOwner;

    event Locked(
        uint256 indexed lockId,
        address indexed owner,
        address indexed token,
        uint256 amount,
        uint256 unlockTime,
        uint256 fee
    );
    event Unlocked(uint256 indexed lockId, address indexed owner, address indexed token, uint256 amount);
    event Extended(uint256 indexed lockId, uint256 newUnlockTime);
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

    function lock(address token, uint256 amount, uint256 unlockTime) external payable returns (uint256 lockId) {
        require(token != address(0), "Invalid token");
        require(amount > 0, "Invalid amount");
        require(unlockTime > block.timestamp, "Unlock in future");
        require(msg.value >= lockFee, "Insufficient fee");

        // Pull tokens from sender
        require(IERC20(token).transferFrom(msg.sender, address(this), amount), "Transfer failed");

        // Forward fee to treasury
        if (msg.value > 0) {
            payable(treasury).transfer(msg.value);
        }

        lockId = nextLockId++;
        locks[lockId] = LockInfo({
            token: token,
            owner: msg.sender,
            amount: amount,
            unlockTime: unlockTime,
            withdrawn: false
        });
        locksByOwner[msg.sender].push(lockId);

        emit Locked(lockId, msg.sender, token, amount, unlockTime, msg.value);
    }

    function unlock(uint256 lockId) external {
        LockInfo storage info = locks[lockId];
        require(info.owner == msg.sender, "Not lock owner");
        require(!info.withdrawn, "Already withdrawn");
        require(block.timestamp >= info.unlockTime, "Still locked");

        info.withdrawn = true;
        require(IERC20(info.token).transfer(msg.sender, info.amount), "Transfer failed");

        emit Unlocked(lockId, msg.sender, info.token, info.amount);
    }

    function extendLock(uint256 lockId, uint256 newUnlockTime) external {
        LockInfo storage info = locks[lockId];
        require(info.owner == msg.sender, "Not lock owner");
        require(!info.withdrawn, "Already withdrawn");
        require(newUnlockTime > info.unlockTime, "Must extend");
        info.unlockTime = newUnlockTime;
        emit Extended(lockId, newUnlockTime);
    }

    function getLocksByOwner(address owner) external view returns (uint256[] memory) {
        return locksByOwner[owner];
    }

    function updateLockFee(uint256 _newFee) external onlyTreasury {
        lockFee = _newFee;
        emit FeeUpdated(_newFee);
    }

    function updateTreasury(address _newTreasury) external onlyTreasury {
        require(_newTreasury != address(0), "Invalid treasury");
        treasury = _newTreasury;
        emit TreasuryUpdated(_newTreasury);
    }
}
