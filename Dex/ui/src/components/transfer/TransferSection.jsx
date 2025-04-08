import React, { useState } from "react";
import {
  formatAmount,
  validateAmount,
  validateAddress,
} from "../../utils/helpers";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../constants/config";

const TransferSection = ({ onTransfer, loading: isLoading }) => {
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showReferral, setShowReferral] = useState(false);

  const handleTransfer = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateAmount(amount)) {
      setError(ERROR_MESSAGES.INVALID_AMOUNT);
      return;
    }

    if (!validateAddress(recipient)) {
      setError(ERROR_MESSAGES.INVALID_ADDRESS);
      return;
    }

    try {
      await onTransfer(recipient, amount);
      setSuccess(SUCCESS_MESSAGES.TRANSFER_SUCCESS);
      setAmount("");
      setRecipient("");
    } catch (error) {
      setError(error.message || ERROR_MESSAGES.TRANSFER_ERROR);
    }
  };

  const handleGenerateReferral = async () => {
    try {
      setLoading(true);
      const code = await generateReferralCode();
      setSuccess(`Your referral code: ${code}`);
    } catch (error) {
      setError(error.message || ERROR_MESSAGES.REFERRAL_ERROR);
    } finally {
      setLoading(false);
    }
  };

  const handleUseReferral = async () => {
    try {
      setLoading(true);
      await useReferralCode(referralCode);
      setSuccess(SUCCESS_MESSAGES.REFERRAL_SUCCESS);
      setReferralCode("");
    } catch (error) {
      setError(error.message || ERROR_MESSAGES.REFERRAL_ERROR);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimRewards = async () => {
    try {
      setLoading(true);
      await claimReferralRewards();
      setSuccess(SUCCESS_MESSAGES.CLAIM_SUCCESS);
    } catch (error) {
      setError(error.message || ERROR_MESSAGES.CLAIM_ERROR);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Transfer Form */}
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-bold text-white mb-4">
          Transfer CLX Tokens
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded text-red-200">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-900/50 border border-green-500 rounded text-green-200">
            {success}
          </div>
        )}

        <form onSubmit={handleTransfer} className="space-y-4">
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
      </div>

      {/* Referral System */}
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-bold text-white mb-4">Referral System</h2>
        <div className="space-y-4">
          <button
            onClick={handleGenerateReferral}
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Generate Referral Code
          </button>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Use Referral Code
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                placeholder="Enter code"
                className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleUseReferral}
                disabled={loading || !referralCode}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Apply
              </button>
            </div>
          </div>
          <button
            onClick={handleClaimRewards}
            disabled={loading}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Claim Referral Rewards
          </button>
        </div>
      </div>

      {/* Features List */}
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-bold text-white mb-4">
          CLX Token Features
        </h2>
        <ul className="space-y-2 text-gray-300">
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✔</span>
            CLX Token (ERC-20) – Trade, earn, & transact!
          </li>
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✔</span>
            Exchange Bonus System – Customizable trade bonuses!
          </li>
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✔</span>
            2% Developer Fee – Earn passive income!
          </li>
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✔</span>
            Referral System – Invite & earn CLX tokens!
          </li>
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✔</span>
            Buyback Mechanism – Developer maintains token stability!
          </li>
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✔</span>
            Secure Transactions – Immutable & blockchain recorded!
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TransferSection;
