import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)));

  // Deploy LaunchStreamToken
  console.log("\n1. Deploying LaunchStreamToken...");
  const LaunchStreamToken = await ethers.getContractFactory("LaunchStreamToken");
  const lstToken = await LaunchStreamToken.deploy();
  await lstToken.waitForDeployment();
  const lstAddress = await lstToken.getAddress();
  console.log("LaunchStreamToken deployed to:", lstAddress);

  // Get treasury address from env or use deployer
  const treasuryAddress = process.env.TREASURY_ADDRESS || deployer.address;
  console.log("Using treasury address:", treasuryAddress);

  // Deploy ERC20Factory
  console.log("\n2. Deploying ERC20Factory...");
  const ERC20Factory = await ethers.getContractFactory("ERC20Factory");
  const erc20Factory = await ERC20Factory.deploy(treasuryAddress);
  await erc20Factory.waitForDeployment();
  const factoryAddress = await erc20Factory.getAddress();
  console.log("ERC20Factory deployed to:", factoryAddress);
  console.log("Creation fee:", ethers.formatEther(await erc20Factory.creationFee()), "ETH");

  // Deploy FixedLSTPresaleV2
  console.log("\n3. Deploying FixedLSTPresaleV2...");
  const FixedLSTPresaleV2 = await ethers.getContractFactory("FixedLSTPresaleV2");
  const presale = await FixedLSTPresaleV2.deploy(treasuryAddress);
  await presale.waitForDeployment();
  const presaleAddress = await presale.getAddress();
  console.log("FixedLSTPresaleV2 deployed to:", presaleAddress);
  console.log("LST Token address:", await presale.lstToken());
  console.log("Price per token:", ethers.formatEther(await presale.PRICE()), "ETH");

  // Deploy IDOFactory
  console.log("\n4. Deploying IDOFactory...");
  const IDOFactory = await ethers.getContractFactory("IDOFactory");
  const idoFactory = await IDOFactory.deploy(treasuryAddress);
  await idoFactory.waitForDeployment();
  const idoFactoryAddress = await idoFactory.getAddress();
  console.log("IDOFactory deployed to:", idoFactoryAddress);
  console.log("Creation fee:", ethers.formatEther(await idoFactory.creationFee()), "ETH");

  // Deploy LiquidityLocker
  console.log("\n5. Deploying LiquidityLocker...");
  const LiquidityLocker = await ethers.getContractFactory("LiquidityLocker");
  const locker = await LiquidityLocker.deploy(treasuryAddress);
  await locker.waitForDeployment();
  const lockerAddress = await locker.getAddress();
  console.log("LiquidityLocker deployed to:", lockerAddress);
  console.log("Lock fee:", ethers.formatEther(await locker.lockFee()), "ETH");

  // Deploy MerkleDistributor (placeholder - requires token and merkle root)
  const tokenForAirdrop = lstAddress; // Using LST as example
  const merkleRoot = process.env.MERKLE_ROOT || ethers.ZeroHash; // Placeholder
  console.log("\n6. Deploying MerkleDistributor...");
  const MerkleDistributor = await ethers.getContractFactory("MerkleDistributor");
  const distributor = await MerkleDistributor.deploy(tokenForAirdrop, merkleRoot, deployer.address);
  await distributor.waitForDeployment();
  const distributorAddress = await distributor.getAddress();
  console.log("MerkleDistributor deployed to:", distributorAddress);
  console.log("Token:", await distributor.token());
  console.log("Merkle root:", await distributor.merkleRoot());

  // Summary
  console.log("\n=== DEPLOYMENT SUMMARY ===");
  console.log("LaunchStreamToken:", lstAddress);
  console.log("ERC20Factory:", factoryAddress);
  console.log("FixedLSTPresaleV2:", presaleAddress);
  console.log("IDOFactory:", idoFactoryAddress);
  console.log("LiquidityLocker:", lockerAddress);
  console.log("MerkleDistributor:", distributorAddress);
  console.log("Treasury:", treasuryAddress);
  console.log("\n=== FRONTEND ENV VARIABLES ===");
  console.log(`NEXT_PUBLIC_ERC20_FACTORY_ADDRESS=${factoryAddress}`);
  console.log(`NEXT_PUBLIC_LST_PRESALE_ADDRESS=${presaleAddress}`);
  console.log(`NEXT_PUBLIC_IDO_FACTORY_ADDRESS=${idoFactoryAddress}`);
  console.log(`NEXT_PUBLIC_LIQUIDITY_LOCKER_ADDRESS=${lockerAddress}`);
  console.log(`NEXT_PUBLIC_MERKLE_DISTRIBUTOR_ADDRESS=${distributorAddress}`);
  console.log(`NEXT_PUBLIC_LST_TOKEN_ADDRESS=${lstAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
