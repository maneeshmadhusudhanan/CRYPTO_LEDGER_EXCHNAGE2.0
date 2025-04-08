import { ethers } from "ethers";
import { MAX_DECIMALS, MIN_AMOUNT, MAX_AMOUNT } from "../constants/config";

// Error handling
const handleError = (error, operation) => {
  console.error(`Error in ${operation}:`, error);
  return null;
};

// Address formatting and validation
export const formatAddress = (address) => {
  if (!address) return "Not Connected";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const validateAddress = (address) => {
  if (!address) return false;
  try {
    return ethers.isAddress(address);
  } catch (error) {
    return handleError(error, "validateAddress");
  }
};

// Amount formatting and validation
export const formatAmount = (amount, decimals = 18) => {
  try {
    if (!amount || amount === "0") return "0";

    // Convert to string and handle scientific notation
    const numStr = Number(amount).toFixed(decimals);

    // Parse the number with the correct decimals
    const parsed = ethers.parseUnits(numStr, decimals);

    // Format with the correct decimals
    return ethers.formatUnits(parsed, decimals);
  } catch (error) {
    console.error("Error in formatAmount:", error);
    return "0";
  }
};

export const parseAmount = (amount, decimals = MAX_DECIMALS) => {
  if (!amount) return "0";
  try {
    return ethers.parseUnits(amount.toString(), decimals);
  } catch (error) {
    return handleError(error, "parseAmount");
  }
};

export const validateAmount = (amount) => {
  if (!amount) return false;
  try {
    const numAmount = parseFloat(amount);
    return (
      !isNaN(numAmount) &&
      numAmount > 0 &&
      numAmount <= Number.MAX_SAFE_INTEGER &&
      numAmount >= parseFloat(MIN_AMOUNT) &&
      numAmount <= parseFloat(MAX_AMOUNT)
    );
  } catch (error) {
    return handleError(error, "validateAmount");
  }
};

// Network utilities
export const getNetworkName = (chainId) => {
  if (!chainId) return "unknown";
  const networks = {
    1: "mainnet",
    5: "goerli",
    31337: "localhost",
    11155111: "sepolia",
  };
  return networks[chainId] || "unknown";
};

export const getNetworkIcon = (chainId) => {
  const icons = {
    1: "🌐", // mainnet
    5: "🔷", // goerli
    31337: "💻", // localhost
    11155111: "🔵", // sepolia
  };
  return icons[chainId] || "❓";
};

// Price and trading calculations
export const calculatePriceImpact = (amountIn, amountOut) => {
  if (!amountIn || !amountOut) return "0";
  try {
    const impact = ((amountOut - amountIn) / amountIn) * 100;
    return Math.abs(impact).toFixed(2);
  } catch (error) {
    return handleError(error, "calculatePriceImpact");
  }
};

export const calculateSlippage = (expectedPrice, actualPrice) => {
  if (!expectedPrice || !actualPrice) return "0";
  try {
    const slippage = ((actualPrice - expectedPrice) / expectedPrice) * 100;
    return Math.abs(slippage).toFixed(2);
  } catch (error) {
    return handleError(error, "calculateSlippage");
  }
};

// Date and time formatting
export const formatDate = (timestamp) => {
  if (!timestamp) return "";
  try {
    return new Date(timestamp * 1000).toLocaleString();
  } catch (error) {
    return handleError(error, "formatDate");
  }
};

export const formatTimeAgo = (timestamp) => {
  if (!timestamp) return "";
  try {
    const now = Date.now();
    const diff = now - timestamp * 1000;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return `${seconds}s ago`;
  } catch (error) {
    return handleError(error, "formatTimeAgo");
  }
};

// Text formatting
export const truncateText = (text, maxLength = 20) => {
  if (!text) return "";
  try {
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength)}...`;
  } catch (error) {
    return handleError(error, "truncateText");
  }
};

// Currency and number formatting
export const formatCurrency = (amount, currency = "USD") => {
  if (!amount) return "0";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    return handleError(error, "formatCurrency");
  }
};

export const formatPercentage = (value) => {
  if (value === null || value === undefined) return "0%";
  try {
    return `${value.toFixed(2)}%`;
  } catch (error) {
    return handleError(error, "formatPercentage");
  }
};

// Gas estimation
export const estimateGas = async (contract, method, args = []) => {
  try {
    const gasEstimate = await contract.estimateGas[method](...args);
    return gasEstimate;
  } catch (error) {
    return handleError(error, "estimateGas");
  }
};

// Transaction utilities
export const getTransactionStatus = (receipt) => {
  if (!receipt) return "pending";
  try {
    if (receipt.status === 1) return "success";
    if (receipt.status === 0) return "failed";
    return "pending";
  } catch (error) {
    return handleError(error, "getTransactionStatus");
  }
};

// Local storage utilities
export const setLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    handleError(error, "setLocalStorage");
  }
};

export const getLocalStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    return handleError(error, "getLocalStorage");
  }
};

export const removeLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    handleError(error, "removeLocalStorage");
  }
};

export const formatPrice = (price) => {
  try {
    if (!price || price === "0") return "$0.00";
    return `$${Number(price).toFixed(2)}`;
  } catch (error) {
    console.error("Error in formatPrice:", error);
    return "$0.00";
  }
};
