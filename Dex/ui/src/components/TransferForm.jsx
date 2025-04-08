// components/TransferForm.jsx
import React, { useState } from "react";
import { useBlockchain } from "../hooks/useBlockchain";

const TransferForm = () => {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { transfer, showNotification } = useBlockchain();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!recipient || !amount || isNaN(amount) || parseFloat(amount) <= 0) {
      showNotification(
        "Please enter valid recipient address and amount",
        "error"
      );
      return;
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(recipient)) {
      showNotification("Please enter a valid Ethereum address", "error");
      return;
    }

    try {
      setIsLoading(true);
      await transfer(recipient, parseFloat(amount));
      showNotification("Transfer successful!", "success");
      setRecipient("");
      setAmount("");
    } catch (error) {
      showNotification(error.message || "Transfer failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Transfer Tokens</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Recipient Address
          </label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="0x..."
            disabled={isLoading}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter amount to transfer"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Transferring..." : "Transfer"}
        </button>
      </form>
    </div>
  );
};

export default TransferForm;
