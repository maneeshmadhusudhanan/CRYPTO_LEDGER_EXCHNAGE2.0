import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Loading from "../common/Loading";
import CLXTokenABI from "../../scdata/contract_abi/CLXToken.json";
import CryptoExchangeABI from "../../scdata/contract_abi/CryptoExchange.json";
import CLXTokenAddress from "../../scdata/deployed-address/CLXToken.json";
import ExchangeAddress from "../../scdata/deployed-address/CryptoExchange.json";

const CLX_TOKEN_ADDRESS = CLXTokenAddress.address;
const EXCHANGE_ADDRESS = ExchangeAddress.address;

const Trading = () => {
  const [account, setAccount] = useState("");
  const [tokenBalance, setTokenBalance] = useState("0");
  const [ethBalance, setEthBalance] = useState("0");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

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

  const fetchBalances = async () => {
    if (!account) return;

    try {
      setIsLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const tokenContract = new ethers.Contract(
        CLX_TOKEN_ADDRESS,
        CLXTokenABI,
        provider
      );
      const exchangeContract = new ethers.Contract(
        EXCHANGE_ADDRESS,
        CryptoExchangeABI,
        provider
      );

      // Fetch token balance
      const tokenBalance = await tokenContract.balanceOf(account);
      setTokenBalance(ethers.formatEther(tokenBalance));

      // Fetch ETH balance
      const ethBalance = await provider.getBalance(account);
      setEthBalance(ethers.formatEther(ethBalance));

      // Fetch exchange balances
      const exchangeTokenBalance = await tokenContract.balanceOf(
        EXCHANGE_ADDRESS
      );
      const exchangeEthBalance = await provider.getBalance(EXCHANGE_ADDRESS);

      console.log(
        "Exchange Token Balance:",
        ethers.formatEther(exchangeTokenBalance)
      );
      console.log(
        "Exchange ETH Balance:",
        ethers.formatEther(exchangeEthBalance)
      );
    } catch (error) {
      console.error("Error fetching balances:", error);
      showNotification("Error fetching balances", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwap = async (isTokenToEth) => {
    if (!account || !amount) {
      showNotification("Please enter an amount", "error");
      return;
    }

    try {
      setIsLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const tokenContract = new ethers.Contract(
        CLX_TOKEN_ADDRESS,
        CLXTokenABI,
        signer
      );
      const exchangeContract = new ethers.Contract(
        EXCHANGE_ADDRESS,
        CryptoExchangeABI,
        signer
      );

      if (isTokenToEth) {
        // Approve tokens for exchange
        const amountWei = ethers.parseEther(amount);
        const approveTx = await tokenContract.approve(
          EXCHANGE_ADDRESS,
          amountWei
        );
        await approveTx.wait();
        showNotification("Token approval successful", "success");

        // Swap tokens for ETH
        const swapTx = await exchangeContract.swapTokenToEth(amountWei);
        await swapTx.wait();
        showNotification("Swap successful!", "success");
      } else {
        // Swap ETH for tokens
        const amountWei = ethers.parseEther(amount);
        const swapTx = await exchangeContract.swapEthToToken({
          value: amountWei,
        });
        await swapTx.wait();
        showNotification("Swap successful!", "success");
      }

      // Refresh balances after swap
      await fetchBalances();
    } catch (error) {
      console.error("Error during swap:", error);
      showNotification("Swap failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (account) {
      fetchBalances();
      const interval = setInterval(fetchBalances, 30000);
      return () => clearInterval(interval);
    }
  }, [account]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Trading</h1>

        {notification && (
          <div
            className={`p-4 mb-4 rounded ${
              notification.type === "error"
                ? "bg-red-500"
                : notification.type === "success"
                ? "bg-green-500"
                : "bg-blue-500"
            } text-white`}
          >
            {notification.message}
          </div>
        )}

        {!account ? (
          <button
            onClick={connectWallet}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition duration-200"
          >
            Connect Wallet
          </button>
        ) : (
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Your Balances
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700 p-4 rounded">
                  <p className="text-gray-300">NTN Balance</p>
                  <p className="text-2xl font-bold text-yellow-500">
                    {tokenBalance || "0"}
                  </p>
                </div>
                <div className="bg-gray-700 p-4 rounded">
                  <p className="text-gray-300">ETH Balance</p>
                  <p className="text-2xl font-bold text-yellow-500">
                    {ethBalance || "0"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-4">Swap</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Amount</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-gray-700 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter amount"
                    step="any"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleSwap(true)}
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition duration-200 disabled:opacity-50"
                  >
                    {isLoading ? <Loading /> : "Swap NTN to ETH"}
                  </button>
                  <button
                    onClick={() => handleSwap(false)}
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded transition duration-200 disabled:opacity-50"
                  >
                    {isLoading ? <Loading /> : "Swap ETH to NTN"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Trading;
