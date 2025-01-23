import { parseEther, formatEther } from "viem";

// Contract addresses
export const MORO_TOKEN = "0x2BE27D1471508C80f15c19e26895C9d182FA3556";
export const PRESALE_CONTRACT = "0x33B6f94577747E7a859B5b66fB042c76BEe3A3CD";
export const USDT_CONTRACT = "0x3616C1a63F5Fc6510Ac4B720c2Ae0b739f69893B";

// Current presale ID
export const PRESALE_ID = 2;

// Presale ABI with all required functions
export const PRESALE_ABI = [
  {
    inputs: [
      { internalType: "uint256", name: "_id", type: "uint256" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "buyWithEth",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_id", type: "uint256" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "buyWithUSDT",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_id", type: "uint256" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "ethBuyHelper",
    outputs: [{ internalType: "uint256", name: "ethAmount", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_id", type: "uint256" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "usdtBuyHelper",
    outputs: [{ internalType: "uint256", name: "usdPrice", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getUserPurchased",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// USDT ABI (only approve function needed)
export const USDT_ABI = [
  {
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

/**
 * Calculate the required ETH value for a given amount of tokens
 * @param amount The amount of tokens to buy (in token units)
 * @returns The ETH value in wei
 */
export const calculateEthValue = async (
  contract: any,
  amount: string
): Promise<bigint> => {
  try {
    console.log('Calculating ETH value for amount:', amount);
    const ethValueWei = await contract.read.ethBuyHelper([PRESALE_ID, parseEther(amount)]);
    console.log('Required ETH value (wei):', ethValueWei.toString());
    return ethValueWei;
  } catch (error) {
    console.error("Error calculating ETH value:", error);
    throw error;
  }
};

/**
 * Calculate the required USDT value for a given amount of tokens
 * @param amount The amount of tokens to buy (in token units)
 * @returns The USDT value in wei
 */
export const calculateUsdtValue = async (
  contract: any,
  amount: string
): Promise<bigint> => {
  try {
    console.log('Calculating USDT value for amount:', amount);
    const usdtValue = await contract.read.usdtBuyHelper([PRESALE_ID, parseEther(amount)]);
    console.log('Required USDT value:', usdtValue.toString());
    return usdtValue;
  } catch (error) {
    console.error("Error calculating USDT value:", error);
    throw error;
  }
};

/**
 * Get the amount of tokens purchased by a user
 * @param contract The contract instance
 * @param userAddress The user's wallet address
 * @returns The amount of tokens purchased (formatted)
 */
export const getUserPurchased = async (
  contract: any,
  userAddress: `0x${string}`
): Promise<string> => {
  try {
    console.log('Fetching purchased amount for address:', userAddress);
    const purchasedAmount = await contract.read.getUserPurchased([userAddress]);
    const formatted = formatEther(purchasedAmount);
    console.log('User purchased amount:', formatted);
    return formatted;
  } catch (error) {
    console.error("Error fetching user purchased tokens:", error);
    return "0";
  }
};