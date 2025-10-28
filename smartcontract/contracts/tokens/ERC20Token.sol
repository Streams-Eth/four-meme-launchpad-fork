// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Generic ERC20 Token
 * @dev Simple ERC20 token where the full supply is minted to the provided owner at deployment.
 */
contract ERC20Token is ERC20, Ownable {
	constructor(
		string memory name_,
		string memory symbol_,
		uint256 totalSupply_,
		address initialOwner_
	) ERC20(name_, symbol_) Ownable(initialOwner_) {
		require(initialOwner_ != address(0), "Invalid owner");
		_mint(initialOwner_, totalSupply_);
	}
}
