import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Loading from "../common/Loading";
import { ethers } from "ethers";
import CLXTokenABI from "../../scdata/contract_abi/CLXToken.json";
import CLXTokenAddress from "../../scdata/deployed-address/CLXToken.json";

const CLX_TOKEN_ADDRESS = CLXTokenAddress.address;

const Dashboard = () => {
  const [account, setAccount] = useState("");
  const [tokenBalance, setTokenBalance] = useState("0");
  const [tokenValue, setTokenValue] = useState("0.00");
  const [isLoading, setIsLoading] = useState(false);

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
      } else {
        alert("Please install MetaMask!");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const fetchTokenBalance = async () => {
    if (!account) return;

    try {
      setIsLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const tokenContract = new ethers.Contract(
        CLX_TOKEN_ADDRESS,
        CLXTokenABI,
        provider
      );

      const balance = await tokenContract.balanceOf(account);
      const formattedBalance = ethers.formatEther(balance);
      console.log("Token Balance:", formattedBalance);
      setTokenBalance(formattedBalance);

      // For now, we'll set a placeholder value
      // In a real application, you would fetch the actual token price from an API
      setTokenValue((parseFloat(formattedBalance) * 0.01).toFixed(2));
    } catch (error) {
      console.error("Error fetching token balance:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (account) {
      fetchTokenBalance();
      // Set up an interval to refresh the balance every 30 seconds
      const interval = setInterval(fetchTokenBalance, 30000);
      return () => clearInterval(interval);
    }
  }, [account]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Token Balance */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4">
            Token Balance
          </h2>
          <div className="space-y-2">
            {isLoading ? (
              <Loading />
            ) : (
              <>
                <p className="text-gray-300">
                  NTN:{" "}
                  <span className="text-yellow-500 font-semibold">
                    {tokenBalance || "0"}
                  </span>
                </p>
                <p className="text-gray-300">
                  Value:{" "}
                  <span className="text-yellow-500 font-semibold">
                    ${tokenValue || "0.00"}
                  </span>
                </p>
              </>
            )}
            {!account && (
              <button
                onClick={connectWallet}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>

        {/* ETH Balance */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4">ETH Balance</h2>
          <div className="space-y-2">
            <p className="text-gray-300">
              ETH: <span className="text-yellow-500 font-semibold">0</span>
            </p>
            <p className="text-gray-300">
              Value:{" "}
              <span className="text-yellow-500 font-semibold">$0.00</span>
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg md:col-span-2 lg:col-span-3">
          <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/trading"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200 text-center"
            >
              Trade
            </Link>
            <Link
              to="/portfolio"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-200 text-center"
            >
              Portfolio
            </Link>
            <Link
              to="/transfer"
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-200 text-center"
            >
              Transfer
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
