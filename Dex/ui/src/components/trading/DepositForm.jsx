import React, { useState } from "react";
import { useBlockchain } from "../../hooks/useBlockchain";

const DepositForm = () => {
  const { deposit, account, connectWallet, loading } = useBlockchain();
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;
    if (!account) {
      try {
        await connectWallet();
      } catch (error) {
        console.error("Failed to connect wallet:", error);
        return;
      }
    }
    setIsLoading(true);
    try {
      await deposit(amount);
      setAmount("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-gray-200"
        >
          Amount
        </label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
          placeholder="Enter amount"
          disabled={isLoading || loading}
        />
      </div>
      <button
        type="submit"
        disabled={isLoading || loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
      >
        {isLoading || loading
          ? "Processing..."
          : account
          ? "Deposit"
          : "Connect Wallet"}
      </button>
      {!account && (
        <p className="text-sm text-yellow-500 mt-2">
          Please connect your wallet to make deposits
        </p>
      )}
    </form>
  );
};

export default DepositForm;
