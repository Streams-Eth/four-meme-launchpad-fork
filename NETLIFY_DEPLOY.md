# Netlify Deployment Configuration

## Environment Variables

Set these in Netlify Dashboard → Site settings → Environment variables:

### Required
```bash
NEXT_PUBLIC_LST_PRESALE_ADDRESS=0xF66d8027c8Bf5094F1b12162bE5Eda12f2Fc6b00
```

### Optional (set after deploying other contracts)
```bash
NEXT_PUBLIC_ERC20_FACTORY_ADDRESS=
NEXT_PUBLIC_IDO_FACTORY_ADDRESS=
NEXT_PUBLIC_LIQUIDITY_LOCKER_ADDRESS=
NEXT_PUBLIC_MERKLE_DISTRIBUTOR_ADDRESS=
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
```

### Token Addresses (hardcoded but can override)
```bash
NEXT_PUBLIC_LST_TOKEN_ADDRESS=0xcCF93923DA72dc91F393e6bBbbEBfcc7c1ADbDA7
```

## Build Settings

Already configured in `netlify.toml`:
- **Build command:** `cd frontend && npm run build`
- **Publish directory:** `frontend/out`
- **Node version:** 22

## Post-Deploy

After setting the environment variable:
1. Trigger a new deploy from Netlify Dashboard
2. Or push a commit to trigger auto-deploy
3. Visit `/presale` to verify the presale contract is connected

## Troubleshooting

If you see "Presale address not configured":
- Check environment variables are set in Netlify
- Redeploy after adding variables
- Verify variable names match exactly (case-sensitive)
