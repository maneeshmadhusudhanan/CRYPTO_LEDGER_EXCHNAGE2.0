import React, { useState, useEffect } from "react";
import { useBlockchain } from "../../hooks/useBlockchain";

const ReferralSystem = () => {
  const {
    account,
    getReferralCode,
    useReferralCode,
    getReferralRewards,
    claimReferralRewards,
    generateReferralCode,
  } = useBlockchain();
  const [referralCode, setReferralCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [newCode, setNewCode] = useState("");
  const [rewards, setRewards] = useState("0");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (account) {
        try {
          const [code, currentRewards] = await Promise.all([
            getReferralCode(account),
            getReferralRewards(account),
          ]);
          setReferralCode(code);
          setRewards(currentRewards);
        } catch (error) {
          console.error("Error fetching referral data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [account, getReferralCode, getReferralRewards]);

  const handleUseCode = async (e) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    await useReferralCode(inputCode);
    setInputCode("");
  };

  const handleGenerateCode = async (e) => {
    e.preventDefault();
    if (!newCode.trim()) return;
    await generateReferralCode(newCode);
    setNewCode("");
  };

  const handleClaimRewards = async () => {
    await claimReferralRewards();
  };

  if (!account) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-fade-in">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Referral Program</h3>

      <div className="space-y-6">
        {/* Your Referral Code */}
        <div className="p-4 bg-purple-50 rounded-lg">
          <h4 className="font-semibold text-purple-800 mb-2">
            Your Referral Code
          </h4>
          {referralCode ? (
            <div className="flex items-center space-x-2">
              <code className="bg-purple-100 px-3 py-1 rounded text-purple-800 font-mono">
                {referralCode}
              </code>
              <button
                onClick={() => navigator.clipboard.writeText(referralCode)}
                className="text-purple-600 hover:text-purple-800 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 5H6a2 2 0 00-2 2v11a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <form onSubmit={handleGenerateCode} className="space-y-2">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="Enter your desired referral code"
                  className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Generate
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Use Referral Code */}
        <form onSubmit={handleUseCode} className="space-y-2">
          <h4 className="font-semibold text-gray-800">Use a Referral Code</h4>
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="Enter referral code"
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Apply
            </button>
          </div>
        </form>

        {/* Referral Rewards */}
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-semibold text-green-800">
                Available Rewards
              </h4>
              <p className="text-2xl font-bold text-green-600 animate-pulse">
                {isLoading ? "..." : `${rewards} CLX`}
              </p>
            </div>
            <button
              onClick={handleClaimRewards}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors transform hover:scale-105"
            >
              Claim Rewards
            </button>
          </div>
        </div>

        {/* How it works */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">How it works:</h4>
          <ul className="list-disc list-inside space-y-2 text-sm text-blue-700">
            <li>Generate your unique referral code</li>
            <li>Share your code with friends</li>
            <li>Friends enter your code when they start trading</li>
            <li>Earn rewards from their trades automatically</li>
            <li>Claim your rewards anytime</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReferralSystem;
