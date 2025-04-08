import React, { useState, useEffect } from "react";
import { useBlockchain } from "../../hooks/useBlockchain";

const TradeForm = () => {
  const { trade, getPrice } = useBlockchain();
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("0");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const currentPrice = await getPrice();
        setPrice(currentPrice);
      } catch (error) {
        console.error("Error fetching price:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 30000);
    return () => clearInterval(interval);
  }, [getPrice]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;
    await trade(amount);
    setAmount("");
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
          disabled={isLoading}
        />
      </div>
      <div className="text-sm text-gray-400">Current Price: {price} USD</div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
      >
        {isLoading ? "Processing..." : "Trade"}
      </button>
    </form>
  );
};

export default TradeForm;
