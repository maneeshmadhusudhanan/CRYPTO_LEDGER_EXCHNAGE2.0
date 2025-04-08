import React, { useState } from "react";
import { useBlockchain } from "../../hooks/useBlockchain";

const TransferForm = () => {
  const { transfer } = useBlockchain();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !recipient || parseFloat(amount) <= 0) return;
    setIsLoading(true);
    try {
      await transfer(recipient, amount);
      setAmount("");
      setRecipient("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="recipient"
          className="block text-sm font-medium text-gray-200"
        >
          Recipient Address
        </label>
        <input
          type="text"
          id="recipient"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
          placeholder="Enter recipient address"
          disabled={isLoading}
        />
      </div>
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
          disabled={isLoading}
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
      >
        {isLoading ? "Processing..." : "Transfer"}
      </button>
    </form>
  );
};

export default TransferForm;
