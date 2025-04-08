import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import CLXTokenABI from "../scdata/contract_abi/CLXToken.json";
import CryptoExchangeABI from "../scdata/contract_abi/CryptoExchange.json";
import CLXTokenAddress from "../scdata/deployed-address/CLXToken.json";
import ExchangeAddress from "../scdata/deployed-address/CryptoExchange.json";

import {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  CONTRACT_CONFIG,
  TX_CONFIG,
  NETWORK_CONFIG,
} from "../constants/config";

const CLX_TOKEN_ADDRESS = CLXTokenAddress.address;
const EXCHANGE_ADDRESS = ExchangeAddress.address;

export const useBlockchain = () => {
  const [account, setAccount] = useState("");
  const [tokenBalance, setTokenBalance] = useState("0");
  const [tokenValue, setTokenValue] = useState("0.00");
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  }, []);

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        showNotification("Wallet connected successfully!", "success");
      } else {
        showNotification("Please install MetaMask!", "error");
      }
    } catch (error) {
      showNotification("Failed to connect wallet.", "error");
      console.error("Error connecting wallet:", error);
    }
  };

  const fetchTokenBalance = async () => {
    if (!account) return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const tokenContract = new ethers.Contract(
        CLX_TOKEN_ADDRESS,
        CLXTokenABI,
        provider
      );

      const balance = await tokenContract.balanceOf(account);
      const formattedBalance = ethers.formatEther(balance);
      console.log("Token Balance:", formattedBalance);
      setTokenBalance(formattedBalance);

      // For now, we'll set a placeholder value
      // In a real application, you would fetch the actual token price from an API
      setTokenValue((parseFloat(formattedBalance) * 0.01).toFixed(2));
    } catch (error) {
      console.error("Error fetching token balance:", error);
    }
  };

  useEffect(() => {
    if (account) {
      console.log("Account connected:", account);
      console.log("Fetching token balance...");
      fetchTokenBalance();
      // Set up an interval to refresh the balance every 30 seconds
      const interval = setInterval(fetchTokenBalance, 30000);
      return () => clearInterval(interval);
    }
  }, [account]);

  console.log("Current token balance:", tokenBalance);

  return {
    account,
    tokenBalance,
    tokenValue,
    notification,
    showNotification,
    connectWallet,
  };
};
