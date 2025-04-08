// components/WithdrawForm.jsx
import React, { useState } from "react";
import { useBlockchain } from "../hooks/useBlockchain";

const WithdrawForm = () => {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { withdraw, showNotification } = useBlockchain();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      showNotification("Please enter a valid amount", "error");
      return;
    }

    try {
      setIsLoading(true);
      await withdraw(parseFloat(amount));
      showNotification("Withdrawal successful!", "success");
      setAmount("");
    } catch (error) {
      showNotification(error.message || "Withdrawal failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Withdraw Tokens</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter amount to withdraw"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Withdrawing..." : "Withdraw"}
        </button>
      </form>
    </div>
  );
};

export default WithdrawForm;
