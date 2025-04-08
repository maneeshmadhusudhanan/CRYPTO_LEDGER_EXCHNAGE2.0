// components/DepositForm.jsx
import { useState } from "react";

const DepositForm = ({ onSubmit, loading, className }) => {
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      return;
    }
    onSubmit(parseFloat(amount));
    setAmount("");
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="space-y-4">
        <div>
          <label
            htmlFor="deposit-amount"
            className="block text-sm font-medium text-gray-700"
          >
            Amount to Deposit
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="number"
              id="deposit-amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="block w-full pr-12 sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
              min="0"
              step="0.000000000000000001"
              disabled={loading}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">CLX</span>
            </div>
          </div>
        </div>
        <button
          type="submit"
          disabled={
            loading || !amount || isNaN(amount) || parseFloat(amount) <= 0
          }
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : "Deposit"}
        </button>
      </div>
    </form>
  );
};

export default DepositForm;
