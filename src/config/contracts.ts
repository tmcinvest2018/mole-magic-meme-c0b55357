export const MORO_TOKEN = "0x2BE27D1471508C80f15c19e26895C9d182FA3556"
export const PRESALE_CONTRACT = "0x33B6f94577747E7a859B5b66fB042c76BEe3A3CD"
export const USDT_CONTRACT = "0x3616C1a63F5Fc6510Ac4B720c2Ae0b739f69893B"

export const PRESALE_ABI = [
  {
    inputs: [],
    name: "buyWithBNB",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [{ type: "uint256", name: "amount" }],
    name: "buyWithUSDT",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "getTokensAvailable",
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ type: "address", name: "user" }],
    name: "getUserPurchased",
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
    type: "function"
  }
] as const