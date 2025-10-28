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
