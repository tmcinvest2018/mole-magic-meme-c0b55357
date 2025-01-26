import { ethers } from 'ethers';

// Contract addresses
export const MORO_TOKEN = '0x2BE27D1471508C80f15c19e26895C9d182FA3556';
export const PRESALE_CONTRACT = '0x33B6f94577747E7a859B5b66fB042c76BEe3A3CD';
export const USDT_CONTRACT = '0x3616C1a63F5Fc6510Ac4B720c2Ae0b739f69893B';

// Current presale ID
export const PRESALE_ID = 2;

// Presale ABI with all required functions
export const PRESALE_ABI = [
  // ... (your full ABI here)
];

// USDT ABI (only approve function needed)
export const USDT_ABI = [
  {
    constant: false,
    inputs: [
      { name: '_spender', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
];

// Initialize provider and signer
const getProvider = () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    return new ethers.providers.Web3Provider(window.ethereum);
  }
  throw new Error('MetaMask not installed');
};

const getSigner = async () => {
  const provider = getProvider();
  await provider.send('eth_requestAccounts', []);
  return provider.getSigner();
};

/**
 * Calculate the required ETH value for a given amount of tokens
 * @param amount The amount of tokens to buy (in token units)
 * @returns The ETH value in wei
 */
export const calculateEthValue = async (amount: string): Promise<string> => {
  try {
    const signer = await getSigner();
    const presaleContract = new ethers.Contract(PRESALE_CONTRACT, PRESALE_ABI, signer);
    console.log('Calculating ETH value for amount:', amount);
    const ethValueWei = await presaleContract.ethBuyHelper(PRESALE_ID, ethers.utils.parseEther(amount));
    console.log('Required ETH value (wei):', ethValueWei.toString());
    return ethValueWei.toString();
  } catch (error) {
    console.error('Error calculating ETH value:', error);
    throw error;
  }
};

/**
 * Buy tokens with ETH
 * @param amount The amount of tokens to buy (in token units)
 */
export const buyWithEth = async (amount: string): Promise<void> => {
  try {
    const signer = await getSigner();
    const presaleContract = new ethers.Contract(PRESALE_CONTRACT, PRESALE_ABI, signer);

    // Calculate required ETH value
    const ethValue = await calculateEthValue(amount);
    console.log('Buying tokens with ETH value:', ethValue);

    // Execute purchase
    const tx = await presaleContract.buyWithEth(PRESALE_ID, ethers.utils.parseEther(amount), {
      value: ethValue,
    });
    await tx.wait();
    console.log('Purchase successful!');
  } catch (error) {
    console.error('Error buying with ETH:', error);
    throw error;
  }
};

/**
 * Calculate the required USDT value for a given amount of tokens
 * @param amount The amount of tokens to buy (in token units)
 * @returns The USDT value in 6 decimals
 */
export const calculateUsdtValue = async (amount: string): Promise<string> => {
  try {
    const signer = await getSigner();
    const presaleContract = new ethers.Contract(PRESALE_CONTRACT, PRESALE_ABI, signer);
    console.log('Calculating USDT value for amount:', amount);

    // Get the USDT value in 18 decimals (from the presale contract)
    const usdtValue = await presaleContract.usdtBuyHelper(PRESALE_ID, ethers.utils.parseEther(amount));

    // Adjust for USDT's 6 decimals
    const adjustedUsdtValue = ethers.BigNumber.from(usdtValue).div(ethers.BigNumber.from(10).pow(12));

    console.log('Required USDT value (6 decimals):', adjustedUsdtValue.toString());
    return adjustedUsdtValue.toString();
  } catch (error) {
    console.error('Error calculating USDT value:', error);
    throw error;
  }
};

/**
 * Buy tokens with USDT
 * @param amount The amount of tokens to buy (in token units)
 */
export const buyWithUSDT = async (amount: string): Promise<void> => {
  try {
    const signer = await getSigner();
    const presaleContract = new ethers.Contract(PRESALE_CONTRACT, PRESALE_ABI, signer);
    const usdtContract = new ethers.Contract(USDT_CONTRACT, USDT_ABI, signer);

    // Calculate required USDT value
    const usdtValue = await calculateUsdtValue(amount);
    console.log('Approving USDT spend:', usdtValue);

    // Convert the USDT value to 6 decimals
    const usdtValueIn6Decimals = ethers.utils.parseUnits(usdtValue, 6);

    // Approve USDT spending
    const approveTx = await usdtContract.approve(PRESALE_CONTRACT, usdtValueIn6Decimals);
    await approveTx.wait();
    console.log('USDT approved');

    // Execute purchase
    const tx = await presaleContract.buyWithUSDT(PRESALE_ID, ethers.utils.parseEther(amount));
    await tx.wait();
    console.log('Purchase successful!');
  } catch (error) {
    console.error('Error buying with USDT:', error);
    throw error;
  }
};

/**
 * Get the amount of tokens purchased by a user
 * @param userAddress The user's wallet address
 * @returns The amount of tokens purchased (formatted)
 */
export const getUserPurchased = async (userAddress: string): Promise<string> => {
  try {
    const provider = getProvider();
    const presaleContract = new ethers.Contract(PRESALE_CONTRACT, PRESALE_ABI, provider);
    console.log('Fetching purchased amount for address:', userAddress);
    const purchasedAmount = await presaleContract.getUserPurchased(userAddress);
    const formatted = ethers.utils.formatEther(purchasedAmount);
    console.log('User purchased amount:', formatted);
    return formatted;
  } catch (error) {
    console.error('Error fetching user purchased tokens:', error);
    return '0';
  }
};
