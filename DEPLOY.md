# Four.Meme Launchpad - Deployment Guide

## Prerequisites

- Node.js 18+ and npm
- A wallet with ETH/BNB for deployment
- RPC endpoint for your target network
- (Optional) Etherscan/BSCScan API key for verification

## Quick Start

### 1. Install Dependencies

```bash
# Root dependencies
npm install

# Frontend dependencies
cd frontend
npm install

# Smart contract dependencies
cd ../smartcontract
npm install
```

### 2. Configure Environment

```bash
# Smart contracts
cd smartcontract
cp .env.example .env
# Edit .env with your private key, RPC URLs, and treasury address

# Frontend
cd ../frontend
cp .env.example .env.local
# Edit .env.local with your WalletConnect project ID
```

### 3. Compile Smart Contracts

```bash
cd smartcontract
npm run compile
```

### 4. Deploy Contracts

**For BSC Testnet:**
```bash
npm run deploy:bsc-testnet
```

**For BSC Mainnet:**
```bash
npm run deploy:bsc
```

**For Local Hardhat Network:**
```bash
# Terminal 1: Start local node
npm run node

# Terminal 2: Deploy
npx hardhat run scripts/deploy.ts --network localhost
```

### 5. Update Frontend Config

After deployment, copy the contract addresses from the deploy output and update `frontend/.env.local`:

```bash
NEXT_PUBLIC_ERC20_FACTORY_ADDRESS=0x...
NEXT_PUBLIC_LST_PRESALE_ADDRESS=0x...
NEXT_PUBLIC_IDO_FACTORY_ADDRESS=0x...
NEXT_PUBLIC_LIQUIDITY_LOCKER_ADDRESS=0x...
NEXT_PUBLIC_MERKLE_DISTRIBUTOR_ADDRESS=0x...
NEXT_PUBLIC_LST_TOKEN_ADDRESS=0x...
```

### 6. Run Frontend

```bash
cd frontend
npm run dev
```

Visit http://localhost:3000

## Contract Addresses

After deployment, your contracts will be deployed with these fees:

- **ERC20Factory**: 0.1 ETH creation fee
- **IDOFactory**: 0.25 ETH creation fee
- **LiquidityLocker**: 0.1 ETH lock fee
- **FixedLSTPresaleV2**: 2.5% platform fee on purchases

## Verify Contracts (Optional)

```bash
npx hardhat verify --network bsc-testnet <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

Example:
```bash
npx hardhat verify --network bsc-testnet 0xYourFactoryAddress 0xYourTreasuryAddress
```

## Deployment Checklist

- [ ] Set `PRIVATE_KEY` in `smartcontract/.env`
- [ ] Set `TREASURY_ADDRESS` in `smartcontract/.env`
- [ ] Fund deployer wallet with ETH/BNB
- [ ] Compile contracts successfully
- [ ] Deploy to testnet first
- [ ] Test all contract functions
- [ ] Update frontend `.env.local` with addresses
- [ ] Test frontend integration
- [ ] Deploy to mainnet
- [ ] Verify contracts on block explorer

## Troubleshooting

**Error: Insufficient funds**
- Ensure deployer wallet has enough ETH/BNB for gas

**Error: Contract verification failed**
- Check that constructor arguments match deployment
- Ensure correct network in hardhat.config.ts

**Frontend can't connect to contracts**
- Verify contract addresses in `.env.local`
- Check network in RainbowKit matches deployed network
- Ensure wallet is connected to correct network

## Security Notes

- **Never commit `.env` files** - they contain private keys
- Use a dedicated deployment wallet
- Consider using a multisig for treasury address
- Test thoroughly on testnet before mainnet deployment
- Audit contracts before production use

## Support

For issues, check:
- [Hardhat Documentation](https://hardhat.org/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [RainbowKit Documentation](https://www.rainbowkit.com/docs)
