// components/TradeForm.jsx
import React, { useState, useEffect } from "react";
import { useBlockchain } from "../hooks/useBlockchain";

const TradeForm = () => {
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { trade, getPrice, showNotification } = useBlockchain();

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const currentPrice = await getPrice();
        setPrice(currentPrice.toString());
      } catch (error) {
        console.error("Error fetching price:", error);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 30000); // Update price every 30 seconds
    return () => clearInterval(interval);
  }, [getPrice]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      showNotification("Please enter a valid amount", "error");
      return;
    }

    try {
      setIsLoading(true);
      await trade(parseFloat(amount));
      showNotification("Trade executed successfully!", "success");
      setAmount("");
    } catch (error) {
      showNotification(error.message || "Trade failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Trade Tokens</h2>
      <div className="mb-4">
        <p className="text-gray-600">
          Current Price:{" "}
          <span className="font-bold">{price || "Loading..."}</span> ETH
        </p>
      </div>
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
            placeholder="Enter amount to trade"
            disabled={isLoading}
          />
        </div>
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Estimated Value:{" "}
            {amount && price
              ? (parseFloat(amount) * parseFloat(price)).toFixed(4)
              : "0"}{" "}
            ETH
          </p>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Trading..." : "Trade"}
        </button>
      </form>
    </div>
  );
};

export default TradeForm;
