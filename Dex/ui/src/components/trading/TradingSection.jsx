import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import CLXTokenABI from "../../scdata/contract_abi/CLXToken.json";
import CryptoExchangeABI from "../../scdata/contract_abi/CryptoExchange.json";
import CLXTokenAddress from "../../scdata/deployed-address/CLXToken.json";
import ExchangeAddress from "../../scdata/deployed-address/CryptoExchange.json";

const CLX_TOKEN_ADDRESS = CLXTokenAddress.address;
const EXCHANGE_ADDRESS = ExchangeAddress.address;

const TradingSection = () => {
  const [account1, setAccount1] = useState("");
  const [account2, setAccount2] = useState("");
  const [amount, setAmount] = useState("");
  const [tokenBalance1, setTokenBalance1] = useState("0");
  const [tokenBalance2, setTokenBalance2] = useState("0");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const connectWallet = async (accountNumber) => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const selectedAccount = accounts[0];

        if (
          (accountNumber === 1 && selectedAccount === account2) ||
          (accountNumber === 2 && selectedAccount === account1)
        ) {
          showNotification(
            "This account is already connected to the other wallet",
            "error"
          );
          return;
        }

        if (accountNumber === 1) {
          setAccount1(selectedAccount);
        } else {
          setAccount2(selectedAccount);
        }
        showNotification(
          `Wallet ${accountNumber} connected successfully!`,
          "success"
        );
      } else {
        showNotification("Please install MetaMask!", "error");
      }
    } catch (error) {
      showNotification(`Failed to connect wallet ${accountNumber}.`, "error");
      console.error("Error connecting wallet:", error);
    }
  };

  const fetchTokenBalance = async (account, setBalance) => {
    if (!account) return;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const tokenContract = new ethers.Contract(
        CLX_TOKEN_ADDRESS,
        CLXTokenABI,
        provider
      );
      const balance = await tokenContract.balanceOf(account);
      setBalance(ethers.formatEther(balance));
      return ethers.formatEther(balance);
    } catch (error) {
      console.error("Error fetching token balance:", error);
      setBalance("0"); // Set balance to 0 on error
      return "0";
    }
  };

  const handleTransfer = async (fromAccount, toAccount) => {
    if (!fromAccount || !toAccount || !amount) {
      showNotification(
        "Please enter an amount and ensure both accounts are connected",
        "error"
      );
      return;
    }

    setIsLoading(true);
    try {
      // Check if amount is valid
      let amountInWei;
      try {
        amountInWei = ethers.parseEther(amount);
        if (amountInWei <= 0n) throw new Error("Amount must be positive");
      } catch (e) {
        showNotification("Please enter a valid amount", "error");
        setIsLoading(false);
        return;
      }

      // Get provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const signerAddress = await signer.getAddress();

      // Ensure the correct account is selected in MetaMask for the transfer
      if (signerAddress.toLowerCase() !== fromAccount.toLowerCase()) {
        showNotification(
          `Please ensure Account ${
            fromAccount === account1 ? 1 : 2
          } (${fromAccount.slice(
            0,
            6
          )}...) is selected in MetaMask to approve the transfer.`,
          "error"
        );
        setIsLoading(false);
        return;
      }

      // Get current balance (as BigInt)
      const tokenContract = new ethers.Contract(
        CLX_TOKEN_ADDRESS,
        CLXTokenABI,
        provider
      );
      const balanceWei = await tokenContract.balanceOf(fromAccount);

      // Check if balance is sufficient (using BigInt comparison)
      if (balanceWei < amountInWei) {
        showNotification(
          `Insufficient balance. You have ${ethers.formatEther(
            balanceWei
          )} NTN tokens`,
          "error"
        );
        setIsLoading(false);
        return;
      }

      // Proceed with transfer
      const tokenContractWithSigner = new ethers.Contract(
        CLX_TOKEN_ADDRESS,
        CLXTokenABI,
        signer
      );

      const transferTx = await tokenContractWithSigner.transfer(
        toAccount,
        amountInWei
      );
      showNotification("Transaction pending...", "info");
      await transferTx.wait();
      showNotification("Transfer successful!", "success");

      // Refresh balances after transfer
      await fetchTokenBalance(account1, setTokenBalance1);
      await fetchTokenBalance(account2, setTokenBalance2);
    } catch (error) {
      console.error("Error during transfer:", error);
      if (
        error.code === "ACTION_REJECTED" ||
        error.info?.error?.code === 4001
      ) {
        showNotification("Transaction rejected by user", "error");
      } else if (error.code === "INSUFFICIENT_FUNDS") {
        showNotification("Insufficient funds for gas fee", "error");
      } else if (
        error.reason &&
        error.reason.includes("transfer amount exceeds balance")
      ) {
        showNotification("Insufficient NTN token balance", "error");
      } else {
        showNotification("Transfer failed. Please try again.", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchBalances = async () => {
      if (account1) {
        await fetchTokenBalance(account1, setTokenBalance1);
      }
      if (account2) {
        await fetchTokenBalance(account2, setTokenBalance2);
      }
    };
    fetchBalances();

    const interval = setInterval(fetchBalances, 30000);
    return () => clearInterval(interval);
  }, [account1, account2]);

  // Handle MetaMask account changes
  useEffect(() => {
    const handleAccountsChanged = (newAccounts) => {
      if (newAccounts.length === 0) {
        // MetaMask is locked or the user has not connected any accounts
        setAccount1("");
        setAccount2("");
        showNotification("MetaMask disconnected. Please reconnect.", "error");
      } else {
        const currentAccount = newAccounts[0];
        // Update connected account if it doesn't match anymore
        if (
          account1 &&
          account1.toLowerCase() !== currentAccount.toLowerCase() &&
          account2 &&
          account2.toLowerCase() !== currentAccount.toLowerCase()
        ) {
          // If neither account matches the new primary account, disconnect both for clarity
          setAccount1("");
          setAccount2("");
          showNotification(
            "MetaMask account changed. Please reconnect wallets.",
            "info"
          );
        } else if (
          account1 &&
          account1.toLowerCase() !== currentAccount.toLowerCase() &&
          (!account2 || account2.toLowerCase() !== currentAccount.toLowerCase())
        ) {
          // Only disconnect account 1 if it was the one changed and not matching account 2
          // setAccount1(""); // Or potentially update account1 to currentAccount? Decide based on UX.
          // showNotification("Account 1 disconnected due to MetaMask change. Please reconnect if needed.", "info");
        } else if (
          account2 &&
          account2.toLowerCase() !== currentAccount.toLowerCase() &&
          (!account1 || account1.toLowerCase() !== currentAccount.toLowerCase())
        ) {
          // Only disconnect account 2 if it was the one changed and not matching account 1
          // setAccount2(""); // Or potentially update account2 to currentAccount?
          // showNotification("Account 2 disconnected due to MetaMask change. Please reconnect if needed.", "info");
        }
      }
    };

    if (window.ethereum && window.ethereum.on) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }

    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      }
    };
  }, [account1, account2]); // Re-run if account1 or account2 changes

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">
          Trading Between Accounts
        </h1>

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Account 1 */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Account 1</h2>
            {!account1 ? (
              <button
                onClick={() => connectWallet(1)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition duration-200"
              >
                Connect Wallet 1
              </button>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-gray-300">Address:</p>
                  <p className="text-sm text-yellow-500 break-all">
                    {account1}
                  </p>
                </div>
                <div>
                  <p className="text-gray-300">NTN Balance:</p>
                  <p className="text-2xl font-bold text-yellow-500">
                    {tokenBalance1}
                  </p>
                </div>
                <button
                  onClick={() => connectWallet(1)}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition duration-200"
                >
                  Change Account
                </button>
              </div>
            )}
          </div>

          {/* Account 2 */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Account 2</h2>
            {!account2 ? (
              <button
                onClick={() => connectWallet(2)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition duration-200"
              >
                Connect Wallet 2
              </button>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-gray-300">Address:</p>
                  <p className="text-sm text-yellow-500 break-all">
                    {account2}
                  </p>
                </div>
                <div>
                  <p className="text-gray-300">NTN Balance:</p>
                  <p className="text-2xl font-bold text-yellow-500">
                    {tokenBalance2}
                  </p>
                </div>
                <button
                  onClick={() => connectWallet(2)}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition duration-200"
                >
                  Change Account
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Transfer Section */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4">
            Transfer NTN from Account 1 to Account 2
          </h2>
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
                min="0"
              />
            </div>

            <div>
              <button
                onClick={() => handleTransfer(account1, account2)}
                disabled={
                  isLoading || !account1 || !account2 || account1 === account2
                }
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition duration-200 disabled:opacity-50"
              >
                {isLoading
                  ? "Processing..."
                  : "Transfer NTN from Account 1 to Account 2"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingSection;
