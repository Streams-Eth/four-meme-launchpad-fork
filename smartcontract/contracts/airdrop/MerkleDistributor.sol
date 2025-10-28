// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title MerkleDistributor
 * @dev Distributes ERC20 tokens to claimants based on a Merkle root. Owner can recover unclaimed tokens.
 */
contract MerkleDistributor is Ownable2Step, ReentrancyGuard {
    IERC20 public immutable token;
    bytes32 public immutable merkleRoot;

    // Packed array of claimed bits. Each index uses 1 bit in the bitmap.
    mapping(uint256 => uint256) private claimedBitMap;

    event Claimed(uint256 indexed index, address indexed account, uint256 amount);

    constructor(address token_, bytes32 merkleRoot_, address initialOwner) Ownable(initialOwner) {
        require(token_ != address(0), "Invalid token");
        token = IERC20(token_);
        merkleRoot = merkleRoot_;
    }

    function isClaimed(uint256 index) public view returns (bool) {
        uint256 wordIndex = index / 256;
        uint256 bitIndex = index % 256;
        uint256 word = claimedBitMap[wordIndex];
        uint256 mask = (1 << bitIndex);
        return word & mask == mask;
    }

    function _setClaimed(uint256 index) private {
        uint256 wordIndex = index / 256;
        uint256 bitIndex = index % 256;
        claimedBitMap[wordIndex] = claimedBitMap[wordIndex] | (1 << bitIndex);
    }

    /**
     * @notice Claim tokens for a given account if a valid proof is provided.
     * @param index Index in the distribution
     * @param account Address eligible to claim
     * @param amount Amount of tokens allocated
     * @param merkleProof Proof that verifies the claim
     */
    function claim(
        uint256 index,
        address account,
        uint256 amount,
        bytes32[] calldata merkleProof
    ) external nonReentrant {
        require(!isClaimed(index), "Drop already claimed");

        // Verify the merkle proof.
        bytes32 node = keccak256(abi.encodePacked(index, account, amount));
        require(MerkleProof.verify(merkleProof, merkleRoot, node), "Invalid proof");

        // Mark as claimed and transfer.
        _setClaimed(index);
        require(token.transfer(account, amount), "Transfer failed");

        emit Claimed(index, account, amount);
    }

    /**
     * @notice Recover tokens back to owner (e.g., after distribution period ends)
     */
    function recoverTokens(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Invalid to");
        require(token.transfer(to, amount), "Transfer failed");
    }
}
