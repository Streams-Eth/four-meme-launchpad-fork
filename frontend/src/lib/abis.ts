export const ERC20FactoryAbi = [
  {
    type: 'function',
    name: 'creationFee',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'createToken',
    inputs: [
      { name: 'name_', type: 'string' },
      { name: 'symbol_', type: 'string' },
      { name: 'totalSupply_', type: 'uint256' },
      { name: 'owner_', type: 'address' },
    ],
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'payable',
  },
];

export const FixedLSTPresaleAbi = [
  {
    type: 'function',
    name: 'buyTokens',
    inputs: [],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'PRICE',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'tokensRemaining',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getSaleStats',
    inputs: [],
    outputs: [
      { name: '_totalRaised', type: 'uint256' },
      { name: '_totalFees', type: 'uint256' },
      { name: '_tokensRemaining', type: 'uint256' },
      { name: '_tokensSold', type: 'uint256' },
      { name: '_isActive', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getFeeBreakdown',
    inputs: [{ name: 'ethAmount', type: 'uint256' }],
    outputs: [
      { name: 'platformFee', type: 'uint256' },
      { name: 'creatorAmount', type: 'uint256' },
      { name: 'tokenAmount', type: 'uint256' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    name: 'userPurchases',
    inputs: [{ name: '', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'paused',
    inputs: [],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'TokensPurchased',
    inputs: [
      { name: 'buyer', type: 'address', indexed: true },
      { name: 'ethAmount', type: 'uint256', indexed: false },
      { name: 'tokenAmount', type: 'uint256', indexed: false },
      { name: 'platformFee', type: 'uint256', indexed: false },
    ],
  },
];
