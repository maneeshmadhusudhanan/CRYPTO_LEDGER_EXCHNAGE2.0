import React, { useState, useEffect } from "react";
import { useBlockchain } from "../../hooks/useBlockchain";

const BonusSystem = () => {
  const { account, getBonusRate, getReferralRate } = useBlockchain();
  const [bonusRate, setBonusRate] = useState(0);
  const [referralRate, setReferralRate] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRates = async () => {
      if (account) {
        try {
          const [bonus, referral] = await Promise.all([
            getBonusRate(),
            getReferralRate(),
          ]);
          setBonusRate(bonus);
          setReferralRate(referral);
        } catch (error) {
          console.error("Error fetching rates:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchRates();
  }, [account, getBonusRate, getReferralRate]);

  if (!account) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-fade-in">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        Trading Bonus System
      </h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
          <div>
            <h4 className="font-semibold text-blue-800">Current Bonus Rate</h4>
            <p className="text-sm text-blue-600">
              Earn extra CLX on every trade!
            </p>
          </div>
          <div className="text-2xl font-bold text-blue-600 animate-pulse">
            {isLoading ? "..." : `${bonusRate}%`}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 rounded-lg transform hover:scale-105 transition-transform duration-200">
            <h4 className="font-semibold text-green-800">Trading Bonus</h4>
            <p className="text-sm text-green-600">
              Get {bonusRate}% bonus on every trade
            </p>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg transform hover:scale-105 transition-transform duration-200">
            <h4 className="font-semibold text-purple-800">Referral Program</h4>
            <p className="text-sm text-purple-600">
              Earn {referralRate}% from referred trades
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <h4 className="font-semibold text-yellow-800 mb-2">How it works:</h4>
          <ul className="list-disc list-inside space-y-2 text-sm text-yellow-700">
            <li>Every trade automatically includes a {bonusRate}% bonus</li>
            <li>Refer friends to earn {referralRate}% from their trades</li>
            <li>Bonuses are paid in CLX tokens</li>
            <li>No minimum trade amount required</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BonusSystem;
